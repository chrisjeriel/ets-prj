import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { ARInwdPolBalDetails } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-ar-claim-cash-call',
  templateUrl: './ar-claim-cash-call.component.html',
  styleUrls: ['./ar-claim-cash-call.component.css']
})
export class ArClaimCashCallComponent implements OnInit, AfterViewInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  @Input() record: any = {};

  @Output() emitCreateUpdate: EventEmitter<any> = new EventEmitter();

  passData: any = {
    tableData: [],
    tHeader: ['Claim No', 'Co. Claim No.', 'Policy No.', 'Loss Date', 'Remarks', 'Curr', 'Curr Rate', 'Amount', 'Amount(PHP)'],
    dataTypes: ["text","text", "text", "date", "text", "text", "percent", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    magnifyingGlass: ['claimNo'],
    pageLength: 10,
    nData: {
        tranId: '',
        billId: '',
        itemNo: '',
        claimId: '',
        claimNo: '',
        policyId: '',
        policyNo: '',
        coClmNo: '',
        lossDate: '',
        currCd: '',
        currRate: '',
        remarks: '',
        cashcallAmt: '',
        localAmt: '',
        showMG: 1
    },
    total: [null,null,null,null, null, null, 'Total', 'cashcallAmt', 'localAmt'],
    widths: [ 130, 130, 180,1, 250, 1, 100, 120, 120],
    keys: ['claimNo', 'coClmNo', 'policyNo', 'lossDate', 'remarks', 'currCd', 'currRate', 'cashcallAmt', 'localAmt'],
    uneditable: [false,true,true,true,false,true,true,false,true],
    opts:[
      {
        selector: 'paytType',
        vals: [],
        prev: []
      },
      {
        selector: 'currCd',
        vals: [],
        prev: []
      }
    ]
  };

  passLov: any = {
    selector: 'acitArClmCashCall',
    payeeNo: '',
    currCd: '',
    hide: []
  }

  cancelFlag: boolean;

  totalLocalAmt: number = 0;
  clmRecoverIndex: number = 0;

  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];

  payorData: any;

  constructor(private titleService: Title, private accountingService: AccountingService, public ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    /*this.titleService.setTitle("Acct-IT | Claim Cash Call");
    this.passLov.payeeNo = this.record.payeeNo;
    if(this.record.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true, true, true, true, true, true,true, true, true, true ];
      this.passData.addFlag = false;
      this.passData.deleteFlag =  false;
      this.passData.checkFlag = false;
    }
    //this.retrievePaytType();
    this.retrieveClmRecover();
    //this.getCurrency();*/
    this.ms.getCedingCompany(this.record.cedingId).subscribe(
      (data:any)=>{
        data.cedingCompany[0].cedingRepresentative = data.cedingCompany[0].cedingRepresentative.filter(a=>{return a.defaultTag === 'Y'});
        this.payorData = data.cedingCompany[0];
        this.payorData.business = this.record.bussTypeName;
      }
    );
  }

  ngAfterViewInit(){
    setTimeout(()=>{this.emitCreateUpdate.emit(this.record);},0);
  }

  retrievePaytType(){
    this.ms.getRefCode('ACIT_AR_CLMRECOVER.PAYT_TYPE').subscribe(
      (data:any)=>{
        for(var i of data.refCodeList){
          this.passData.opts[0].vals.push(i.code);
          this.passData.opts[0].prev.push(i.description);
        }
      }
    );
  }

  getCurrency(){
    this.ms.getMtnCurrency('','Y').subscribe(
       (data: any)=>{
         for(var i of data.currency){
           this.passData.opts[1].vals.push(i.currencyCd+'T'+i.currencyRt);
           this.passData.opts[1].prev.push(i.currencyCd);
         }
       }
    );
  }

  openClmRecoverLov(data){
    this.passLov.payeeNo = this.record.payeeNo;
    this.passLov.currCd = this.record.currCd;
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.claimId});
    this.clmRecoverIndex = data.index;
    this.lovMdl.openLOV();
  }

  retrieveClmRecover(){
    this.passData.tableData = [];
    this.accountingService.getAcitArClmCashCall(this.record.tranId, 1).subscribe( //billId for Claim Recovery / Overpayment is always 1
      (data: any)=>{
        if(data.clmCashCallList.length !== 0){
          for(var i of data.clmCashCallList){
            i.uneditable = ['claimNo'];
            this.passData.tableData.push(i);
          }
          this.table.refreshTable();
        }
      }
    );
  }

  setSelectedData(data){
    let selected = data.data;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < selected.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].policyId = selected[i].policyId;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = selected[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].claimNo = selected[i].claimNo;
      this.passData.tableData[this.passData.tableData.length - 1].claimId = selected[i].claimId;
      this.passData.tableData[this.passData.tableData.length - 1].coClmNo = selected[i].coClmNo;
      this.passData.tableData[this.passData.tableData.length - 1].lossDate = selected[i].lossDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd = selected[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = selected[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].cashcallAmt = selected[i].reserveAmt == null ? 0 : selected[i].reserveAmt;
      this.passData.tableData[this.passData.tableData.length - 1].localAmt = this.passData.tableData[this.passData.tableData.length - 1].cashcallAmt * selected[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['claimNo'];
    }
    this.table.refreshTable();
  }

  onClickSave(){
      this.confirm.confirmModal();
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    //prepare params from table
    this.savedData = [];
    this.deletedData = [];
    this.totalLocalAmt = 0;
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(!this.passData.tableData[i].deleted){
        this.totalLocalAmt += this.passData.tableData[i].localAmt;
      }
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].tranId = this.record.tranId;
          this.savedData[this.savedData.length-1].billId = 1; //1 for Claim Recovery / Overpayment Transaction Type
          this.savedData[this.savedData.length-1].currCd = this.savedData[this.savedData.length-1].currCd.split('T')[0];
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
         this.deletedData[this.deletedData.length-1].billId = 1; //1 for Claim Recovery / Overpayment Transaction Type
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Claim Recovery / Overpayment Transaction Type
      billType: this.record.tranTypeCd,
      totalLocalAmt: this.totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveClmCashCall: this.savedData,
      delClmCashCall: this.deletedData
    }

    this.accountingService.saveAcitArClmCashCall(params).subscribe(
      (data:any)=>{
       if(data.returnCode === -1){
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveClmRecover();
          this.table.markAsPristine();
        }else if(data.returnCode === 0 && data.custReturnCode !== 2){
          this.dialogIcon = 'error';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }else if(data.returnCode === 0 && data.custReturnCode === 2){
          this.dialogIcon = 'error-message';
          //this.dialogMessage = 'Total Amount of Recoveries/Overpayment must not exceed the AR Amount.';
          this.dialogMessage = 'Total Amount of Claim Cash Call Payments must not exceed the AR Amount.';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }
      },
      (error: any)=>{

      }
    );
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onRowClick(data){
    if(data !== null){
      data.updateDate = this.ns.toDateTimeString(data.updateDate);
      data.createDate = this.ns.toDateTimeString(data.createDate);
      this.emitCreateUpdate.emit(data);
    }else{
      this.emitCreateUpdate.emit(null);
    }
  }
  onTableDataChange(data){
    if(data.key === 'cashcallAmt'){
      for(var i = 0; i < data.length; i++){
        data[i].localAmt = data[i].cashcallAmt * data[i].currRate;
      }
    }else if(data.key === 'currCd'){
      for(var j = 0; j < data.length; j++){
        data[j].currRate = data[j].currCd.split('T')[1];
        data[j].localAmt = data[j].cashcallAmt * data[j].currRate;
      }
    }
    this.passData.tableData = data;
    this.table.refreshTable();
  }

  //ALL VALIDATIONS STARTS HERE

  checkBalance(){
    for(var i of this.passData.tableData){
      if(i.balPaytAmt > i.netDue - i.totalPayments){
        return true;
      }
    }
    return false;
  }

}
