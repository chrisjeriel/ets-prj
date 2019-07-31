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
  @Input() rowData : any = {
    reqId : ''
  };
  @ViewChild('mtnClmHistLov') clmHistLov      : MtnClmHistoryLovComponent;
  @ViewChild('cedCompTbl') cedCompTbl         : CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(ConfirmSaveComponent) cs         : ConfirmSaveComponent;
  @ViewChild(SucessDialogComponent) success   : SucessDialogComponent;
  @ViewChild('warnMdl') warnMdl               : ModalComponent;

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

  inwardPolBalData: any = {
    tableData     : [],
    tHeader       : ['Policy No.','Inst No.','Due Date','Curr','Curr Rate','Balance','Payment','Premium', 'RI Commission', 'Charges', 'Net Return'],
    dataTypes     : ['lov-input', 'sequence-2', 'date', 'text', 'percent', 'currency', 'currency','currency', 'currency','currency', 'currency'],
    magnifyingGlass : ['policyNo'],
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
    pageID        : 'inwardPolBalData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [true,true,true,true,true,true,true,true,true,true,false],
    total         : [ null, null, null,null, 'Total', null,null, 'Total', 'reserveAmt', 'paytAmt', 'localAmt'],
    widths        : [130,120, 120,200,200,1,1,1,1,85,120,120,120],
    keys          : ['claimNo','histNo','histCatDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currencyCd','currencyRt','reserveAmt','paytAmt','localAmt']
  };

  tranTypeList    : any;
  tabTitle        : string = '';
  limitClmHistTbl : any[] = [];
  limitHistCat    : string = '';
  cancelFlag      : boolean;
  dialogIcon      : string;
  dialogMessage   : string;
  warnMsg         : string = '';

  params : any =  {
    savePrqTrans     : [],
    deletePrqTrans   : []
  };

  requestData : any;
  selectedTblData : any;


  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService, private clmService: ClaimsService) {
  }

  ngOnInit() {
    this.getAcitPaytReq();
    this.getPrqTrans();
  }

  getAcitPaytReq(){
    this.acctService.getPaytReq(this.rowData.reqId)
    .subscribe(data => {
      console.log(data);
      var rec = data['acitPaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate); return e; });
      this.requestData = rec[0];
      console.log(this.requestData);
    });
  }

  getPrqTrans(){
    this.cedingCompanyData.tableData = [];
    var subRes = forkJoin(this.acctService.getAcitPrqTrans(this.rowData.reqId,''), this.clmService.getClaimHistory())
                 .pipe(map(([prqTrans,clmHist]) => { return { prqTrans,clmHist }}));

    subRes.subscribe(data => {
      console.log(data);

      var recPrqTrans = data['prqTrans']['acitPrqTrans'];
      var recClmHist  = data['clmHist']['claimReserveList'].map(e => e.clmHistory).flatMap(e => { return e }).filter(e => (this.requestData.tranTypeCd == 3)?e.histCategory == 'L':e.histCategory != 'L').map(e => { return e });
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
                                                                e2.itemNo     = e.itemNo;
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
    this.limitHistCat = (this.requestData.tranTypeCd == 3)?'L':'AO';
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
    this.cedingCompanyData.tableData.forEach(e => {
      var rec = {
            claimId         : e.claimId,
            createUser      : (e.createUser == '' || e.createUser == null)?this.ns.getCurrentUser():e.createUser,
            createDate      : (e.createDate == '' || e.createDate == null)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate),
            currAmt         : e.paytAmt,
            currCd          : e.currencyCd,
            currRate        : e.currencyRt,
            histNo          : e.histNo,
            instNo          : '',
            investmentId    : '',
            itemNo          : e.itemNo,
            localAmt        : e.paytAmt,
            paymentFor      : e.paymentFor,
            policyId        : '',
            projId          : e.projId,
            quarterEnding   : '',
            refNo           : '',
            remarks         : '',
            reqId           : this.rowData.reqId,
            updateUser      : this.ns.getCurrentUser(),
            updateDate      : this.ns.toDateTimeString(0)
          };

      if(e.edited && !e.deleted){
        this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.claimId != e.claimId);
        this.params.savePrqTrans.push(rec);
      }else if(e.edited && e.deleted){
        this.params.deletePrqTrans.push(rec);
      }else{
        console.log('ELSE IN SAVE');
      }
    });

    console.log(this.cedingCompanyData.tableData);
    console.log(this.params.savePrqTrans);

    var paytAmt = this.cedingCompanyData.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.paytAmt != null ?parseFloat(b.paytAmt):0),0);
    console.log(paytAmt);

    if(Number(this.requestData.reqAmt) < Number(paytAmt)){
      console.log('The Total Payment Amount of Claim Histories must not exceed the Requested Amount.');
      this.warnMsg = 'The Total Payment Amount of Claim Histories must not exceed the Requested Amount.';
      this.warnMdl.openNoClose();
      this.params.savePrqTrans   = [];
      this.params.deletePrqTrans = [];
    }else{
      if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
        $('.ng-dirty').removeClass('ng-dirty');
        this.cs.confirmModal();
        this.params.savePrqTrans   = [];
        this.params.deletePrqTrans = [];
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
  }

  onSaveCPC(){
    console.log(this.params);
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      this.getPrqTrans();
      this.getAcitPaytReq();
      this.success.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
    });
  }

  onRowClick(event){
    console.log(event);
    this.selectedTblData = event;
    if(event != null){
      this.selectedTblData.createDate = this.ns.toDateTimeString(event.createDate);
      this.selectedTblData.updateDate = this.ns.toDateTimeString(event.updateDate);  
    }
  }

  checkCancel(){
    if(this.cancelFlag){
      this.cancelBtn.onNo();
    }else{
      this.success.modal.closeModal();
    }
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  addDirty(){
    $('#cedTbl').addClass('ng-dirty');
  }

}
