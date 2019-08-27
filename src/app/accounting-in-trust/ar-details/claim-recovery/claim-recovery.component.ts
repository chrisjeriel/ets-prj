import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { ARInwdPolBalDetails } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-claim-recovery',
  templateUrl: './claim-recovery.component.html',
  styleUrls: ['./claim-recovery.component.css']
})
export class ClaimRecoveryComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  @Input() record: any = {};

  passData: any = {
    tableData: [],
    tHeader: ['Payment Type', 'Claim No', 'Co. Claim No.', 'Policy No.', 'Loss Date', 'Remarks', 'Curr', 'Curr Rate', 'Amount', 'Amount(PHP)'],
    dataTypes: ["select","text","text", "text", "date", "text", "select", "percent", "currency", "currency"],
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
        paytType: '',
        claimId: '',
        claimNo: '',
        policyId: '',
        policyNo: '',
        coClmNo: '',
        lossDate: '',
        currCd: '',
        currRate: '',
        remarks: '',
        recOverAmt: '',
        localAmt: '',
        showMG: 1
    },
    total: [null,null,null,null,null, null, null, 'Total', 'recOverAmt', 'localAmt'],
    widths: [150, 200, 200, 200,120, 250, 85, 100, 120, 120],
    keys: ['paytType', 'claimNo', 'coClmNo', 'policyNo', 'lossDate', 'remarks', 'currCd', 'currRate', 'recOverAmt', 'localAmt'],
    uneditable: [false,false,true,true,true,false,false,false,false,false],
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
    selector: 'acitArClmRecover',
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

  constructor(private titleService: Title, private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Claim Recovery / Overpayment");
    this.passLov.payeeNo = this.record.payeeNo;
    if(this.record.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true, true, true, true, true, true,true, true, true, true ];
      this.passData.addFlag = false;
      this.passData.deleteFlag =  false;
      this.passData.checkFlag = false;
    }
    this.retrievePaytType();
    this.retrieveClmRecover();
    this.getCurrency();
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
    console.log(this.passLov.hide);
    this.clmRecoverIndex = data.index;
    this.lovMdl.openLOV();
  }

  retrieveClmRecover(){
    this.passData.tableData = [];
    this.accountingService.getAcitArClmRecover(this.record.tranId, 1).subscribe( //billId for Claim Recovery / Overpayment is always 1
      (data: any)=>{
        if(data.arClmRecover.length !== 0){
          for(var i of data.arClmRecover){
            i.currCd = i.currCd+'T'+i.currRate;
            i.uneditable = ['paytType', 'claimNo'];
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
      this.passData.tableData[this.passData.tableData.length - 1].currCd = selected[i].currCd+'T'+selected[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = selected[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
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
      saveClmRecover: this.savedData,
      delClmRecover: this.deletedData
    }
    console.log(params);

    this.accountingService.saveAcitArClmRecover(params).subscribe(
      (data:any)=>{
       if(data.returnCode === -1){
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveClmRecover();
        }else if(data.returnCode === 0 && data.custReturnCode !== 2){
          this.dialogIcon = 'error';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }else if(data.returnCode === 0 && data.custReturnCode === 2){
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'Total Amount of Recoveries/Overpayment must not exceed the AR Amount.';
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
    console.log(data);
  }
  onTableDataChange(data){
    if(data.key === 'recOverAmt'){
      for(var i = 0; i < data.length; i++){
        data[i].localAmt = data[i].recOverAmt * data[i].currRate;
      }
    }else if(data.key === 'currCd'){
      for(var j = 0; j < data.length; j++){
        data[j].currRate = data[j].currCd.split('T')[1];
        data[j].localAmt = data[j].recOverAmt * data[j].currRate;
      }
    }
    this.passData.tableData = data;
    this.table.refreshTable();
  }

  //ALL VALIDATIONS STARTS HERE

  checkBalance(){
    for(var i of this.passData.tableData){
      console.log(i.netDue);
      console.log(i.totalPayments);
      console.log(i.balPaytAmt)
      if(i.balPaytAmt > i.netDue - i.totalPayments){
        return true;
      }
    }
    return false;
  }

}
