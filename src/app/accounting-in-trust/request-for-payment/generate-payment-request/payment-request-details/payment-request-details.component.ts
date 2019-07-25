import { Component, OnInit, Input, ViewChild } from '@angular/core';
//import { PaymentToAdjusters, PaymentToOtherParty, PaymentToCedingCompany, PremiumReturn, AROthers, PaymentOfSeviceFee, TreatyBalance } from '@app/_models';
import { AccountingService, MaintenanceService, NotesService, ClaimsService } from '../../../../_services';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { MtnClmHistoryLovComponent } from '@app/maintenance/mtn-clm-history-lov/mtn-clm-history-lov.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css']
})
export class PaymentRequestDetailsComponent implements OnInit {
  @Input() rowData : any;
  @ViewChild('mtnClmHistLov') clmHistLov      : MtnClmHistoryLovComponent;
  @ViewChild('cedCompTbl') cedCompTbl         : CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(ConfirmSaveComponent) cs         : ConfirmSaveComponent;
  @ViewChild(SucessDialogComponent) success   : SucessDialogComponent;

  cedingCompanyData: any = {
  	tableData     : [],
  	tHeader       : ['Claim No.','Hist No.','Hist Category','Hist Type','Payment For', 'Insured', 'Ex-Gratia','Curr','Curr Rate','Reserve Amount','Payment Amount','Payment Amount (PHP)'],
    dataTypes     : ['lov-input', 'sequence-2', 'text', 'text', 'text', 'text', 'checkbox','text', 'percent','currency', 'currency', 'currency'],
    magnifyingGlass : ['claimNo'],
  	nData: {
      claimNo        : '',
      histNo         : '',
      histCatDesc    : '',
      histTypeDesc   : '',
      paymentFor     : '',
      insuredDesc    : '',
      exGratia       : '',
      currCd         : '',
      currRate       : '',
      reserveAmt     : '',
      reqAmt         : '',
      localAmt       : '',
      showMG         : 1
    },
  	paginateFlag  : true,
  	infoFlag      : true,
  	pageID        : 'cedingCompanyData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
  	checkFlag     : true,
  	addFlag       : true,
  	deleteFlag    : true,
    uneditable    : [true,true,true,true,false,true,true,true,true,true,true,true],
  	total         : [null, null, null, null,null, null, null,null, 'Total', 'reserveAmt', 'paytAmt', 'localAmt'],
    widths        : [130,120, 120,200,200,1,1,1,1,85,120,120,120],
    keys          : ['claimNo','histNo','histCatDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currencyCd','currencyRt','reserveAmt','paytAmt','localAmt']
  };

  tranTypeList    : any;
  tabTitle        : string = '';
  limitClmHistTbl : any[] = [];
  cancelFlag      : boolean;
  dialogIcon      : string;
  dialogMessage   : string;

  params : any =  {
    savePrqTrans     : [
      {
        claimId       : '',
        createDate    : '',
        createUser    : '',
        currAmt       : '',
        currCd        : '',
        currRate      : '',
        histNo        : '',
        instNo        : '',
        investmentId  : '',
        itemNo        : '',
        localAmt      : '',
        paymentFor    : '',
        policyId      : '',
        projId        : '',
        quarterEnding : '',
        refNo         : '',
        remarks       : '',
        reqId         : '',
        updateDate    : '',
        updateUser    : ''
      }
    ],
    deletePrqTrans   : [
      {
        claimId       : '',
        createDate    : '',
        createUser    : '',
        currAmt       : '',
        currCd        : '',
        currRate      : '',
        histNo        : '',
        instNo        : '',
        investmentId  : '',
        itemNo        : '',
        localAmt      : '',
        paymentFor    : '',
        policyId      : '',
        projId        : '',
        quarterEnding : '',
        refNo         : '',
        remarks       : '',
        reqId         : '',
        updateDate    : '',
        updateUser    : ''
      }
    ]
  };


  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService, private clmService: ClaimsService) {
  }

  ngOnInit() {
    console.log(this.rowData);
    this.rowData.reqDate = this.ns.toDateTimeString(this.rowData.reqDate);
    this.getPrqTrans();
  }

  getPrqTrans(){

    var subRes = forkJoin(this.acctService.getAcitPrqTrans(this.rowData.reqId,''), this.clmService.getClaimHistory())
                 .pipe(map(([prqTrans,clmHist]) => { return { prqTrans,clmHist }}));

    subRes.subscribe(data => {
      console.log(data);

      var recPrqTrans = data['prqTrans']['acitPrqTrans'];
      var recClmHist  = data['clmHist']['claimReserveList'].map(e => e.clmHistory).flatMap(e => { return e }).filter(e => e.histCategory == 'L').map(e => { return e });
      console.log(recPrqTrans);
      console.log(recClmHist);

      recPrqTrans.forEach(e => {
        this.cedingCompanyData.tableData.push(recClmHist.filter(e2 => e2.claimId == e.claimId && e2.histNo == e.histNo && e2.projId == e.projId )
                                                               .map(e2 => { 
                                                                 e2.paymentFor = e.paymentFor; 
                                                                 e2.createUser = e.createUser;
                                                                 e2.updateUser = e.updateUser;
                                                                 e2.createDate = e.createDate;
                                                                 e2.updateDate = e.updateDate;
                                                                 return e2; 
                                                               }));
      });
      this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.flatMap(e => { return e });
      this.cedCompTbl.refreshTable();
      console.log(this.cedingCompanyData.tableData);
    });

  }

  showLOV(event){
    console.log(event);
    this.cedingCompanyData.tableData.forEach(e => {
      this.limitClmHistTbl.push(e);
    });
    this.clmHistLov.modal.openNoClose();
  }

  selectedDataLov(data){
    data.forEach(e => {
      if(this.cedingCompanyData.tableData.some(e2 => e2.claimId != e.claimId && e2.histNo != e.histNo)){
        this.cedingCompanyData.tableData.push(e);
        this.limitClmHistTbl.push(e);
      }
    });
    
    this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.filter(e => e.claimNo != '').map(e => { e.edited = true; e.checked = false; e.createDate = ''; e.createUser = ''; return e});
    this.cedCompTbl.refreshTable();
  }

  onClickSaveCPC(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';

    // for(let record of this.cedingCompanyData.tableData){
    //   if(record.edited && !record.deleted){
    //     console.log('Should be successful in saving');
    //       record.createUser    = (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
    //       record.createDate    = (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
    //       record.updateUser    = this.ns.getCurrentUser();
    //       record.updateDate    = this.ns.toDateTimeString(0);
    //       this.params.savePrqTrans.push(record);
    //   }else if(record.edited && record.deleted){
    //       this.params.deletePrqTrans.push(record);
    //   }
    // }

    this.cedingCompanyData.tableData.forEach(e => {
      if(e.edited && !e.deleted){
        this.params.savePrqTrans.map(a => {
          a.reqId = this.rowData.reqId;
          a.claimId = e.claimId;
          a.projId = e.projId;
          a.histNo = e.histNo;
          a.currCd = e.currencyCd;
          a.currRate = e.currencyRt;
          a.currAmt =  e.paytAmt;
          a.localAmt = e.paytAmt;
          a.createUser = (a.createUser == '' || a.createUser == null)?this.ns.getCurrentUser():a.createUser;
          a.createDate = (a.createDate == '' || a.createDate == null)?this.ns.toDateTimeString(0):a.createDate;
          a.updateUser = this.ns.getCurrentUser();
          a.createUser = this.ns.toDateTimeString(0);
          return a;
        });
      }else if(e.edited && e.deleted){
        console.log('RECORD DELETED');
      }else{
        console.log('ELSE IN SAVE');
      }
    });

    console.log(this.cedingCompanyData.tableData);
    if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
      $('.ng-dirty').removeClass('ng-dirty');
      this.cs.confirmModal();
      this.params.savePrqTrans   = [];
      this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.filter(e => e.claimNo != '');
    }else{
      if(this.cancelFlag == true){
        this.cs.showLoading(true);
        setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},500);
      }else{
        this.cs.confirmModal();
      }
    }
  }

  onSaveCPC(){
    this.params.savePrqTrans.map(e => {
      e.currCd   = e.currencyCd;
      e.currRate = e.currencyRt;
      e.currAmt  = e.paytAmt;
      e.localAmt = e.paytAmt;
      e.reqId    = this.rowData.reqId;

    });

    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      this.getPrqTrans();
      this.success.open();
      this.params.savePrqTrans  = [];
    });
  }

  checkCancel(){
    this.cancelBtn.onNo();
  }

}
