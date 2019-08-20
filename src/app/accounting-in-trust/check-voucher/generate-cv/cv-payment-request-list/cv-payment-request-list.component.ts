import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { AccCVPayReqList } from '@app/_models';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cv-payment-request-list',
  templateUrl: './cv-payment-request-list.component.html',
  styleUrls: ['./cv-payment-request-list.component.css']
})
export class CvPaymentRequestListComponent implements OnInit {
  @ViewChild('paytReqTbl') paytReqTbl : CustNonDatatableComponent;
  @ViewChild('paytReqLov') paytReqLov  : LovComponent;
  @ViewChild('can') can             : CancelButtonComponent;
  @ViewChild('con') con             : ConfirmSaveComponent;
  @ViewChild('suc') suc            : SucessDialogComponent;

  passDataPaytReqList: any = {
    tableData     : [],
    tHeader       : ['Payment Request No.','Payment Type','Request Date','Particulars','Requested By','Curr','Amount'],
    dataTypes     : ['lov-input','text','date','text','text','text','currency'],
    magnifyingGlass : ['paytReqNo'],
    nData : {
      paytReqNo     : '',
      tranTypeDesc  : '',
      reqDate       : '',
      particulars   : '',
      requestedBy   : '',
      currCd        : '',
      reqAmt        : '',
      showMG        : 1
    },
    total         : [null,null,null,null,null,'Total','reqAmt'],
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    infoFlag      : true,
    paginateFlag  : true,
    pageLength    : 10,
    widths        : [120,250,100,250,150,1,150],
    pageID        : 'passDataCvPaytReq',
    keys          : ['paytReqNo','tranTypeDesc','reqDate','particulars','requestedBy','currCd','reqAmt']
  };

  @Input() passData: any = {
    tranId : ''
  };
  passDataLov  : any = {
    selector     : '',
    payeeClassCd : ''
  };

  params : any =  {
    savePaytReqList     : [],
    deletePaytReqList   : []
  };

  cvInfo : any = {
    cvNo : '',
    cvDate : '',
    cvStatus : '',
    payee : '',
    cvAmt : '',
    localAmt : '',
    currCd : ''
  };

  cancelFlag     : boolean;
  dialogIcon     : string;
  dialogMessage  : string;


  constructor(private titleService: Title,private accountingService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle(" Acct | CV | Payment Request List");
  	this.getPaytReqList();
  }

  getPaytReqList(){
    console.log(this.passData.tranId);
    // this.accountingService.getPaytReqList([])
    // .subscribe(data => {
    //   console.log(data);
    //   var rec = data['acitPaytReq'];
    // });

    var subRes = forkJoin(this.accountingService.getAcitCv(this.passData.tranId),this.accountingService.getPaytReqList([]))
                       .pipe(map(([cv, pr]) => { return { cv, pr }; }));

    subRes.subscribe(data => {
      console.log(data);
      var recCv = data['cv']['acitCvList'];
      var recPr = data['pr']['acitPaytReq'];
      
    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    this.passDataPaytReqList.tableData.forEach(e => {
      e.tranId    = this.passData.tranId;
      if(e.edited && !e.deleted){
        this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.invtId != e.invtId);
        e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
        e.createDate    = (e.createDate == '' || e.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate);
        e.updateUser    = this.ns.getCurrentUser();
        e.updateDate    = this.ns.toDateTimeString(0);
        e.quarterEnding = '';
        e.currAmt       = e.invtAmt;
        e.itemNo        = e.itemNo,
        e.localAmt      = Number(e.invtAmt) * Number(e.currRate);
        this.params.savePrqTrans.push(e);
      }else if(e.edited && e.deleted){ 
        this.params.deletePrqTrans.push(e);  
      }
    });
 
    console.log(this.passDataPaytReqList.tableData);
    console.log(this.params);

    //var invtAmt = this.passDataPaytReqList.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.invtAmt != null ?parseFloat(b.invtAmt):0),0);

    // if(Number(this.requestData.reqAmt) < Number(invtAmt)){
    //     this.warnMsg = 'The Total Investment Amount for Placement must not exceed the Requested Amount.';
    //     this.warnMdl.openNoClose();
    //     this.params.savePrqTrans   = [];
    //     this.params.deletePrqTrans = [];
    // }else{
    //     if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
    //       $('.ng-dirty').removeClass('ng-dirty');
    //       this.conInvt.confirmModal();
    //       this.params.savePrqTrans   = [];
    //       this.params.deletePrqTrans = [];
    //       this.investmentData.tableData = this.investmentData.tableData.filter(e => e.invtCd != '');
    //     }else{
    //       console.log(this.cancelFlagInvt);
    //       if(this.cancelFlagInvt == true){
    //         this.conInvt.showLoading(true);
    //         setTimeout(() => { try{this.conInvt.onClickYes();}catch(e){}},500);
    //       }else{
    //         this.conInvt.confirmModal();
    //       }
    //     }
    // }
  }

  showLov(){
    this.passDataLov.selector = 'paytReqList';
    this.paytReqLov.openLOV();
  }

  setData(data){
    $('input').addClass('ng-dirty');
    this.ns.lovLoader(data.ev, 0);
    var rec = data['data'].map(e => {
      e.approvedDate = this.ns.toDateTimeString(e.approvedDate);
      e.createDate   = this.ns.toDateTimeString(e.createDate);
      e.preparedDate = this.ns.toDateTimeString(e.preparedDate);
      e.updateDate   = this.ns.toDateTimeString(e.updateDate);
      e.edited       = true; 
      e.checked      = false;
      return e;
    });

    this.passDataPaytReqList.tableData = rec;
    console.log(this.passDataPaytReqList.tableData);
    this.paytReqTbl.refreshTable();

  }

}
