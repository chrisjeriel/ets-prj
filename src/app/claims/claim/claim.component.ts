import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { ClaimsService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';


@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit, OnDestroy {
  @ViewChild('warnModal') warnModal  : ModalComponent; 

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

  claimInfo = {
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

  constructor( private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private clmService : ClaimsService) { }

  @ViewChild('tabset') tabset: any;


  ngOnInit() {
    this.sub = this.route.params.subscribe(
      (params)=>{
        if(params['readonly'] !== undefined){
          this.isInquiry = true;
        }else{
          this.isInquiry = false;
        }
      }
    );
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  onTabChange($event: NgbTabChangeEvent) {

      if ($event.nextId === 'Exit' && this.isInquiry) {
        this.router.navigateByUrl('/claims-inquiry');
      } else if($event.nextId === 'Exit' && !this.isInquiry){
        this.router.navigateByUrl('/clm-claim-processing');
      } else if($event.nextId === 'view-pol-info' && $('.ng-dirty').length == 0) {
        this.router.navigate(['/policy-information', { policyId: this.claimInfo.policyId, policyNo: this.claimInfo.policyNo, clmInfo: JSON.stringify(this.claimInfo) }], { skipLocationChange: true });
      }

      if($event.nextId === 'clmHistoryId') {
        this.prevTab = $event.activeId;
      }

      if($('.ng-dirty').length != 0 ){
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
            this.tabset.select($event.nextId)
          }
        })
  
      }

    // setTimeout(() => {
    //     if($event.nextId == 'clmHistoryId' && this.preventHistory){
    //       $event.preventDefault();
    //       this.warnModal.openNoClose();
    //   }
    // }, 1000);
  }

  getClmInfo(ev) {
    console.log(ev);
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

    // this.clmService.getClaimHistory(this.claimInfo.claimId,'','','')
    //   .subscribe(data => {
    //     this.preventHistory = !data['claimReserveList'][0]['clmHistory'].some(e => e.proceed == 'Y');
    //   });
  }
  
  showWarnMdl() {
    this.warnModal.openNoClose();
  }

  prevsTab() {
    this.tabset.select(this.prevTab);
  }
}
