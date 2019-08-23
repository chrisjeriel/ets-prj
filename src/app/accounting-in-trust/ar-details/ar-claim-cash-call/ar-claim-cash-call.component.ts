import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
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
export class ArClaimCashCallComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  @Input() record: any = {};

  passData: any = {
    tableData: [],
    tHeader: ['Claim No.', 'Policy No', 'Insured', 'Loss Date', 'Loss Cause', 'Hist No', 'Hist Category', 'Reserve', 'Paid Amount', 'Curr', 'Curr Rate', 'Amount', 'Amount(PHP)'],
    dataTypes: ["text", "text", "text", "date","text","sequence-2", "text", "currency", "currency", "text", "percent", "currency", "currency"],
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
        projId: '',
        claimId: '',
        claimNo: '',
        insuredDesc: '',
        lossAbbr: '',
        histNo: '',
        histCatDesc: '',
        reserveAmt: '',
        paytAmt: '',
        policyNo: '',
        coClmNo: '',
        lossDate: '',
        currCd: '',
        currRate: '',
        cashcallAmt: '',
        localAmt: '',
        showMG: 1
    },
    total: [null,null,null,null,null,null,null,null, null, null, 'Total', 'cashcallAmt', 'localAmt'],
    widths: [120,180,300,100, 100, 1, 1,120, 120, 1, 100, 120, 120],
    keys: ['claimNo', 'policyNo', 'insuredDesc', 'lossDate', 'lossAbbr', 'histNo', 'histCatDesc', 'reserveAmt', 'paytAmt', 'currCd', 'currRate', 'cashcallAmt', 'localAmt'],
    uneditable: [false,true,true,true,true,true,true,true, true, true,true,false, true],
  };

  passLov: any = {
    selector: 'acitArClmCashCall',
    payeeNo: '',
    currCd: '',
    hide: []
  }

  cancelFlag: boolean;

  totalLocalAmt: number = 0;
  clmCashCallIndex: number = 0;

  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];

  constructor(private titleService: Title, private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Claim Cash Call");
    this.passLov.payeeNo = this.record.payeeNo;
    if(this.record.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true,true,true,true,true,true,true,true, true, true,true,true, true];
      this.passData.addFlag = false;
      this.passData.deleteFlag =  false;
      this.passData.checkFlag = false;
    }
    this.retrieveClmCashCall();

  }

  openClmCashCallLov(data){
    this.passLov.payeeNo = this.record.payeeNo;
    this.passLov.currCd = this.record.currCd;
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.claimId});
    console.log(this.passLov.hide);
    this.clmCashCallIndex = data.index;
    this.lovMdl.openLOV();
  }

  retrieveClmCashCall(){
    this.passData.tableData = [];
    this.accountingService.getAcitArClmCashCall(this.record.tranId, 1).subscribe( //billId for Claim Cash Call is always 1
      (data: any)=>{
        if(data.clmCashCallList.length !== 0){
          /*for(var i of data.arClmRecover){
            i.currCd = i.currCd+'T'+i.currRate;
            i.uneditable = ['paytType', 'claimNo'];
            this.passData.tableData.push(i);
          }*/
          this.passData.tableData = data.clmCashCallList;
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
      this.passData.tableData[this.passData.tableData.length - 1].projId = selected[i].projId;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = selected[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].claimNo = selected[i].claimNo;
      this.passData.tableData[this.passData.tableData.length - 1].claimId = selected[i].claimId;
      this.passData.tableData[this.passData.tableData.length - 1].insuredDesc = selected[i].insuredDesc;
      this.passData.tableData[this.passData.tableData.length - 1].lossDate = selected[i].lossDate;
      this.passData.tableData[this.passData.tableData.length - 1].histNo = selected[i].histNo;
      this.passData.tableData[this.passData.tableData.length - 1].histCatDesc = selected[i].histCatDesc;
      this.passData.tableData[this.passData.tableData.length - 1].lossAbbr = selected[i].lossAbbr;
      this.passData.tableData[this.passData.tableData.length - 1].reserveAmt = selected[i].reserveAmt;
      this.passData.tableData[this.passData.tableData.length - 1].paytAmt = selected[i].paytAmt;
      this.passData.tableData[this.passData.tableData.length - 1].currCd = selected[i].currencyCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = selected[i].currencyRt;
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
          this.savedData[this.savedData.length-1].billId = 1; //1 for Claim Cash Call
          this.savedData[this.savedData.length-1].currCd = this.savedData[this.savedData.length-1].currCd.split('T')[0];
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
         this.deletedData[this.deletedData.length-1].billId = 1; //1 for Claim Cash Call
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Claim Cash Call
      billType: this.record.tranTypeCd,
      totalLocalAmt: this.totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveClmCashCall: this.savedData,
      delClmCashCall: this.deletedData
    }
    console.log(params);

    this.accountingService.saveAcitArClmCashCall(params).subscribe(
      (data:any)=>{
       if(data.returnCode === -1){
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveClmCashCall();
        }else if(data.returnCode === 0 && data.custReturnCode !== 2){
          this.dialogIcon = 'error';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }else if(data.returnCode === 0 && data.custReturnCode === 2){
          this.dialogIcon = 'error-message';
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
    console.log(data);
  }
  onTableDataChange(data){
    if(data.key === 'cashcallAmt'){
      for(var i = 0; i < data.length; i++){
        data[i].localAmt = data[i].cashcallAmt * data[i].currRate;
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
