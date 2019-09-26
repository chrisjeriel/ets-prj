import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject, forkJoin } from 'rxjs';
import { ClaimsService, MaintenanceService, NotesService, UserService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { map } from 'rxjs/operators';
import { ClmClaimHistoryComponent } from '@app/claims/claim/clm-claim-processing/clm-claim-history/clm-claim-history.component';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit, OnDestroy {
  @ViewChild('warnModal') warnModal    : ModalComponent;
  @ViewChild('conModal') conModal      : ModalComponent; 
  @ViewChild('overMdl') overMdl        : ModalComponent;
  @ViewChild(SucessDialogComponent) success  : SucessDialogComponent;
  @ViewChild('clmHist') clmHist: ClmClaimHistoryComponent;

  passDataHistory: any = {
        tHeader: ["History No", "Amount Type", "History Type", "Currency","mount","Remarks","Accounting Tran ID","Accounting Date"],
        dataTypes: [
                    "number", "select", "select","select","currency","text","number","number"
                   ],
        tableData: [[1,"LOST","OS Reserve","",10000000,"Initial OS Reserve",3480,"11/14/2018"]],
        pageLength: 10,
        paginateFlag:true,
        infoFlag:true,
        addFlag:true,
  };

  claimInfo:any = {
        claimId: '',
        claimNo: '',
        projId: '',
        policyId: '',
        policyNo: '',
        riskId: '',
        riskName:'',
        insuredDesc:'',
        clmStatus: ''
  }

  sub: any;
  isInquiry: boolean = false;

  disableClmHistory: boolean = true;
  disableNextTabs: boolean = true;
  disablePaytReq: boolean = true;
  subject: Subject<boolean>;
  preventHistory: boolean = false;
  prevTab: string = "";
  msg : string = '';
  userId : string = '';
  password : string = '';
  approversList : any[] = [];
  usersList : any[] =[];
  dialogIcon : string ='';
  dialogMessage : string ='';
  from : any ;
  proceed : any;

  constructor( private router: Router, private route: ActivatedRoute, private modalService: NgbModal, 
               private ns: NotesService, private clmService : ClaimsService, private mtnService: MaintenanceService, private userService: UserService) { }

  @ViewChild('tabset') tabset: any;

  activeIdString:string = 'geninfo';

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      (params)=>{
        if(params['readonly'] !== undefined){
          this.isInquiry = true;
        }else{
          this.isInquiry = false;
        }

        if(params['tab']!=undefined){
          console.log(params)
          this.activeIdString=params['tab'];
          this.claimInfo = params;
          this.disableClmHistory = false;
          this.disableNextTabs = false;
          this.disablePaytReq = false;
        }
      }
    );
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit' && this.isInquiry) {
        $event.preventDefault();
        this.router.navigateByUrl('/claims-inquiry');
      } else if($event.nextId === 'Exit' && !this.isInquiry && $('.ng-dirty.ng-touched:not([type="search"]):not(.exclude)').length == 0){
        $event.preventDefault();
        this.router.navigateByUrl('/clm-claim-processing');
      } else if($event.nextId === 'view-pol-info' && $('.ng-dirty').length == 0) {
        this.router.navigate(['/policy-information', { policyId: this.claimInfo.policyId, policyNo: this.claimInfo.policyNo, clmInfo: JSON.stringify(this.claimInfo) }], { skipLocationChange: true });
      }

      if($event.nextId === 'clmHistoryId') {
        this.prevTab = $event.activeId;
      }

      if($('.ng-dirty.ng-touched:not([type="search"]):not(.exclude)').length != 0){
        $event.preventDefault();
        const subject = new Subject<boolean>();
        const modal = this.modalService.open(ConfirmLeaveComponent,{
            centered: true, 
            backdrop: 'static', 
            windowClass : 'modal-size'
        });
        modal.componentInstance.subject = subject;

        subject.subscribe(a=>{
          if(a){
            $('.ng-dirty').removeClass('ng-dirty');

            if($event.nextId === 'Exit' && !this.isInquiry) {
              this.router.navigateByUrl('/clm-claim-processing');
            } else {
              this.tabset.select($event.nextId);
            }
          }
        });
      }
  }

  getClmInfo(ev) {
    this.claimInfo.claimId = ev.claimId;
    this.claimInfo.claimNo = ev.claimNo;
    this.claimInfo.projId = ev.projId;
    this.claimInfo.policyId = ev.policyId;
    this.claimInfo.policyNo = ev.policyNo;
    this.claimInfo.riskName = ev.riskName;
    this.claimInfo.insuredDesc = ev.insuredDesc;
    this.claimInfo.clmStatus = ev.clmStatus;
    this.disableClmHistory = ev.disableClmHistory;
    this.disableNextTabs = ev.disableNextTabs;
    this.disablePaytReq = ev.disablePaytReq;
    console.log(this.claimInfo);
  }
  
  showWarnMdl(event) {
    this.msg = event.msg;
    this.proceed = event.val;

    if(!event.show) {
      this.clmHist.histFunction(this.proceed);
      return;
    }

    if(event.val == 1){
      this.warnModal.openNoClose();
    }else{
      this.conModal.openNoClose();
      this.from = event.apvlCd;
    }
  }

  onClickYes(){
    this.getApprovalFn();
    this.conModal.closeModal();
  }

  prevsTab() {
    this.tabset.select(this.prevTab);
  }

  getApprovalFn(){
    $('.globalLoading').css('display','block');
    var subs =  forkJoin(this.mtnService.getMtnApprovalFunction(this.from),this.mtnService.getMtnApprover(), this.userService.retMtnUsers(''))
                  .pipe(map(([appFn, app, user]) => { return { appFn, app, user };}));

    subs.subscribe(data => {
      $('.globalLoading').css('display','none');
      var recAppFn = data['appFn']['approverFn'];
      this.approversList = data['app']['approverList'];
      this.usersList = data['user']['usersList'];

      if(recAppFn.some(e => e.userId.toUpperCase() == this.ns.getCurrentUser().toUpperCase())){
        this.claimInfo['upUserGi'] = this.ns.getCurrentUser();
      }else{
        this.overMdl.openNoClose();
      }

    });
  }

  onOkOver(){
    var user = this.approversList.some(e => this.userId.toUpperCase() == e.userId.toUpperCase());
    if(user){
      var pass = this.usersList.filter(e => this.userId.toUpperCase() == e.userId.toUpperCase()).map(e => e.password);
      if(this.password == pass.toString()){
        this.overMdl.closeModal();
        this.dialogIcon = 'success-message';
        this.dialogMessage = 'Login Successfully';
        this.claimInfo['upUserGi'] = this.userId;
        this.clmHist.histFunction(this.proceed+1); 
      } else{
        this.dialogIcon = 'error-message';
        this.dialogMessage = 'Invalid Password';
      }
    }else{
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Invalid Username';
    }

    this.success.open();
  }
}
