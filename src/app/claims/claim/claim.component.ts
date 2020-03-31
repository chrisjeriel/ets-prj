import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject, forkJoin } from 'rxjs';
import { ClaimsService, MaintenanceService, NotesService, UserService, SecurityService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { map } from 'rxjs/operators';
import { ClmClaimHistoryComponent } from '@app/claims/claim/clm-claim-processing/clm-claim-history/clm-claim-history.component';
import { Location } from '@angular/common';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '@environments/environment';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

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
  @ViewChild('recordLock') recordLock;
  @Input() contModal: NgbModalRef;

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

  webSocketEndPoint: string = environment.prodApiUrl + '/moduleSecurity';
    topic: string = "/clm-processing";
    stompClient: any;
    initLoad: boolean = true;
    lockModalShown: boolean = false;
    lockUser: string = "";
    lockMessage: string = "";

  exitLink:any;

  constructor( private router: Router, private route: ActivatedRoute, private modalService: NgbModal, 
               private ns: NotesService, private clmService : ClaimsService, private mtnService: MaintenanceService, private userService: UserService,
               private securityService: SecurityService, private loc: Location) { }

  @ViewChild('tabset') tabset: any;

  @Input()claimParams:any;

  activeIdString:string = 'geninfo';

  ngOnInit() {
    if(!this.claimParams){

      this.sub = this.route.params.subscribe(
        (params)=>{
          if(params['readonly'] == 'true' || params['readonly'] == true){
            this.isInquiry = true;
          }else{
            this.isInquiry = false;
          }

          this.exitLink = params['exitLink']

          if(params['tab']!=undefined){
            this.activeIdString=params['tab'];
            this.claimInfo = params;
            this.disableClmHistory = false;
            this.disableNextTabs = false;
            this.disablePaytReq = false;


          }

          if (!this.isInquiry) {
            this.claimInfo.claimId = params['claimId'];
            this.wsConnect();
          }


        }
      );
    }else{
      this.claimInfo = this.claimParams;
      this.claimInfo.fromModal = true;
      if(this.claimParams['readonly'] == 'true' || this.claimParams['readonly'] == true){
        this.isInquiry = true;
      }else{
        this.isInquiry = false;
      }

      if(this.claimParams['tab']!=undefined){
        this.activeIdString=this.claimParams['tab'];
        this.claimInfo = this.claimParams;
        this.disableClmHistory = false;
        this.disableNextTabs = false;
        this.disablePaytReq = false;


      }

      if (!this.isInquiry) {
        this.claimInfo.claimId = this.claimParams['claimId'];
        this.wsConnect();
      }
    }
    
  }

  ngOnDestroy(){
    if(this.sub != undefined)
      this.sub.unsubscribe();

    if (!this.isInquiry && this.stompClient != undefined) {
      this.wsDisconnect();
    }
  }

    wsConnect() {
      console.log("XXXX");
      console.log(this.claimInfo);
      console.log("XXXX");

      let ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const _this = this;
      _this.stompClient.connect({}, function (frame) {
          if (_this.initLoad) {
            _this.sendMessage();
            _this.initLoad = false;
          }

          _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
              var obj = JSON.parse(sdkEvent.body);
              if (obj.message == "") {
                if (_this.claimInfo.claimId == obj.refId) {
                  if (_this.ns.getCurrentUser() == obj.user) {
                    //Proceed because same user.
                    console.log("Same user with same record, proceed.");
                  } else {
                    _this.stompClient.send(_this.topic, {}, JSON.stringify({ user: _this.ns.getCurrentUser(), refId: _this.claimInfo.claimId, message: "This record is currently being updated by " }));
                  }
                }
              } else {
                if (_this.claimInfo.claimId == obj.refId) {
                  if (_this.ns.getCurrentUser() != obj.user) {
                    setTimeout(() => {
                        if (_this.lockModalShown == false) {
                         _this.modalService.open(_this.recordLock, { centered: true, backdrop: 'static', windowClass: "modal-size" });
                         _this.lockModalShown = true;
                         _this.lockUser = obj.user;
                         _this.lockMessage = obj.message;
                        }
                     });
                  }
                }
              }
          });
      }, this.errorCallBack);
  }; 

  wsDisconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
  }

  sendMessage() {
    this.stompClient.send(this.topic, {}, JSON.stringify({ user: this.ns.getCurrentUser(), refId: this.claimInfo.claimId, message: "" }));
  }

  errorCallBack(error) {
      console.log("errorCallBack -> " + error)
      setTimeout(() => {
          this.wsConnect();
      }, 5000);
  }

  returnOnModal(){
    if (!this.isInquiry) {
     this.router.navigateByUrl('/clm-claim-processing');
    }
  }

  onTabChange($event: NgbTabChangeEvent) {
      if(this.contModal != undefined && $event.nextId === 'edit-claim'){
        setTimeout(a=>this.contModal.dismiss(),0);
        this.claimParams.readonly = false;
        this.router.navigate(
                        ['/claims-claim', this.claimParams],
                        { skipLocationChange: true }
          );
      }else if(this.contModal != undefined && $event.nextId === 'Exit'){
        this.contModal.dismiss();
      }else if ($event.nextId === 'Exit' && this.isInquiry) {
        $event.preventDefault();
        this.router.navigateByUrl(this.exitLink);
      } else if($event.nextId === 'Exit' && !this.isInquiry && $('.ng-dirty.ng-touched:not([type="search"]):not(.exclude)').length == 0){
        $event.preventDefault();
        this.router.navigateByUrl('/clm-claim-processing');
      } else if($event.nextId === 'view-pol-info' && $('.ng-dirty').length == 0) {
        this.router.navigate(['/policy-information', { policyId: this.claimInfo.policyId, policyNo: this.claimInfo.policyNo, clmInfo: JSON.stringify(this.claimInfo), readonly: !this.isInquiry, isInquiry: this.isInquiry }], { skipLocationChange: true });
      }

      if($event.nextId === 'clmHistoryId') {
        this.prevTab = $event.activeId;
      }

      if($('.ng-dirty.ng-touched:not([type="search"]):not(.exclude)').length != 0 && this.contModal==undefined){
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
    if(this.isInquiry){
      return;
    }

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

      this.securityService.secEncryption(this.password).subscribe((data:any)=>{
          if(data.password == pass.toString()){
            this.overMdl.closeModal();
            this.dialogIcon = 'success-message';
            this.dialogMessage = 'Login Successfully';
            this.claimInfo['upUserGi'] = this.userId;
            this.clmHist.histFunction(this.proceed+1);
            this.success.open();
          } else{
            this.dialogIcon = 'error-message';
            this.dialogMessage = 'Invalid Password';
            this.success.open();
          }
        });
    }else{
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Invalid Username';
      this.success.open();
    }

    
  }
}
