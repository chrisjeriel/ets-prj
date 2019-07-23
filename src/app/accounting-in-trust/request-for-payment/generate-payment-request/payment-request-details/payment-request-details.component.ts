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
    savePrqTrans     : [],
    deletePrqTrans   : []
  };


  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService, private clmService: ClaimsService) {
  }

  ngOnInit() {
    console.log(this.rowData);
    this.rowData.reqDate = this.ns.toDateTimeString(this.rowData.reqDate);
    this.getPrqTrans();
  }

  getPrqTrans(){
    this.acctService.getAcitPrqTrans(this.rowData.reqId,'')
    .subscribe(data => {
      console.log(data);
      var rec = data['acitPrqTrans'];
      this.cedingCompanyData.tableData = rec;
      console.log(this.cedingCompanyData.tableData);
      this.cedCompTbl.refreshTable();
    });
  }

  showLOV(event){
    console.log(event); 
    this.clmHistLov.modal.openNoClose();
  }

  selectedDataLov(data){
    data.forEach(e => {
      if(this.cedingCompanyData.tableData.some(e2 => e2.claimId != e.claimId && e2.histNo != e.histNo)){
        this.cedingCompanyData.tableData.push(e);
        this.limitClmHistTbl.push(e);
      }
    });
    
    this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.filter(e => e.claimNo != '').map(e => { e.checked = false; return e});
    this.cedCompTbl.refreshTable();
  }

  onClickSaveCPC(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';

    for(let record of this.cedingCompanyData.tableData){
      if(record.edited && !record.deleted){
          record.createUser    = (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
          record.createDate    = (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
          record.updateUser    = this.ns.getCurrentUser();
          record.updateDate    = this.ns.toDateTimeString(0);
          this.params.savePrqTrans.push(record);
        }else if(record.edited && record.deleted){
          this.params.deletePrqTrans.push(record);
      }
    }

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
