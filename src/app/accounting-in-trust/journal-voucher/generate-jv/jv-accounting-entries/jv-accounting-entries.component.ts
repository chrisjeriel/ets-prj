import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { JVAccountingEntries } from '@app/_models'
import { AccountingService, NotesService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-jv-accounting-entries',
  templateUrl: './jv-accounting-entries.component.html',
  styleUrls: ['./jv-accounting-entries.component.css']
})
export class JvAccountingEntriesComponent implements OnInit {

   @Input() jvData:any;
   @Input() jvType:any;
   @Output() emitData = new EventEmitter<any>();
   @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
   @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
   @ViewChild('myForm') form:any;
   @ViewChild(LovComponent) lov: LovComponent;

   /*passData: any = {
    tableData: [],
    tHeader: ['Account Code', 'Account Name', 'SL Type', 'SL Name', 'Debit', 'Credit'],
    dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
    magnifyingGlass: ['glShortCd','slTypeName','slName'],
    nData: {
        tranId: '',
        entryId: '',
        glAcctId: '',
        glShortCd: '',
        glShortDesc:'',
        slTypeCd: '',
        slTypeName: '',
        slCd: '',
        slName: '',
        creditAmt: 0,
        debitAmt: 0,
        autoTag: 'N',
        createUser: this.ns.getCurrentUser(),
        createDate: this.ns.toDateTimeString(0),
        updateUser: this.ns.getCurrentUser(),
        updateDate: this.ns.toDateTimeString(0),
        showMG:1,
        colMG: [],
        uneditable:[],
        edited: true
    },
    paginateFlag: true,
    infoFlag: true,
    checkFlag: true,
    pageID: 2,
    addFlag: true,
    deleteFlag: true,
    disableAdd: true,
    //total: [null, null, null, 'Total', null, null],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt']
  }*/

  passData: any = {};
  
  jvDetails : any = {
     jvNo: '', 
     jvYear: '', 
     jvDate: '', 
     jvType: '',
     jvStatus: '',
     refnoDate: '',
     refnoTranId: '',
     currCd: '',
     currRate: '',
     jvAmt: '',
     localAmt: ''
  }

  accEntries: any = {
    saveList:[],
    delList :[]
  }

  passLov:any = {
    selector:'',
    params:{}
  }

  debitTotal: number = 0;
  creditTotal: number = 0;
  variance : number = 0;
  dialogIcon : any;
  dialogMessage : any;
  readOnly: boolean = true;
  errorFlag: boolean = false;
  notBalanced: boolean = true;
  lovCheckBox:boolean = true;
  lovRow:any;
  cancelFlag: boolean = false;
  rowData:any;
  detailDatas :any;
  errorMessage: any;

  constructor(private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.passData = this.accountingService.getAccEntriesPassData();
    this.passData.nData = { tranId: '', entryId: '', glAcctId: '', glShortCd: '', glShortDesc:'', slTypeCd: '', slTypeName: '', slCd: '', slName: '', creditAmt: 0, debitAmt: 0, foreignDebitAmt: 0, foreignCreditAmt: 0, autoTag: 'N', createUser: '', createDate: '', updateUser: '', updateDate: '', showMG:1, edited: true };
    this.jvDetails = this.jvData;
    this.jvDetails.jvDate = this.ns.toDateTimeString(this.jvDetails.jvDate);
    this.jvDetails.refnoDate = this.jvDetails.refnoDate === "" ? "":this.ns.toDateTimeString(this.jvDetails.refnoDate);
    if(this.jvDetails.statusType == 'N'){
      this.passData.disableAdd = false;
      this.readOnly = false;
    }else {
      this.notBalanced = true;
      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      this.passData.checkFlag = false;
      this.readOnly = true;
      this.passData.uneditable = [true,true,true,true,true,true,true,true]
    }
    this.retrieveAcctEntries();
    this.retrieveJVDetails();
  }

  retrieveAcctEntries(){
    this.accountingService.getAcitAcctEntries(this.jvData.tranId).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      this.debitTotal = 0;
      this.creditTotal = 0;
      for (var i = 0; i < data.list.length; i++) {
        if(data.list[i].updateLevel == 'N') {
          data.list[i].uneditable = ['glShortCd','foreignDebitAmt','foreignCreditAmt'];
          data.list[i].showMG = 0;
        } else if(data.list[i].updateLevel == 'L') {
          data.list[i].uneditable = ['glShortCd'];
          data.list[i].colMG = ['glShortCd'];
          data.list[i].showMG = 1;
        } else {
          data.list[i].uneditable = ['glShortDesc','debitAmt','creditAmt'];
          data.list[i].showMG = 1;
        }

        this.passData.tableData.push(data.list[i]);
        this.debitTotal  += data.list[i].foreignDebitAmt;
        this.creditTotal += data.list[i].foreignCreditAmt;
      }

      this.variance = this.debitTotal - this.creditTotal;
      this.variance = Math.round(this.variance * 100)/100;
      if(this.variance === 0 && this.jvDetails.statusType == 'N'){
        this.notBalanced = false;
      }
      this.table.refreshTable();
    });
  }

  onClickSave(){
    this.debitTotal = 0;
    this.creditTotal = 0;
    this.variance = 0;
    if(this.jvDetails.forApproval === 'Y'){
      for (var i = 0; i < this.passData.tableData.length; i++) {
        this.debitTotal += this.passData.tableData[i].foreignDebitAmt;
        this.creditTotal += this.passData.tableData[i].foreignCreditAmt;
      }
      this.variance = this.debitTotal - this.creditTotal;
      this.variance = Math.round(this.variance * 100)/100

      if(this.variance != 0){
        this.dialogMessage = "Accounting Entries does not tally.";
        this.dialogIcon = "error-message";
        this.successDiag.open();
      }else if(!this.validDetailPayment()){
        this.dialogMessage = this.errorMessage;
        this.dialogIcon = "error-message";
        this.successDiag.open();
      }else if(!this.validPaytAmt()){
        this.dialogMessage = this.errorMessage;
        this.dialogIcon = "error-message";
        this.successDiag.open();
      }else if(this.errorFlag){
        this.dialogMessage = 'Total Amount in Details must be equal to JV Amount.';
        this.dialogIcon = "error-message";
        this.successDiag.open();
      }else{
        this.confirm.confirmModal();
      }
    }else{
      this.confirm.confirmModal();
    }
  }

  onRowclick(data){
    console.log(data)
    if(data !== null){
      this.rowData = data;
      this.rowData.createDate = this.ns.toDateTimeString(this.rowData.createDate);
      this.rowData.updateDate = this.ns.toDateTimeString(this.rowData.updateDate);
    }else{
      this.rowData = [];
    }
  }

  prepareData(){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.accEntries.saveList.push(this.passData.tableData[i]);
        this.accEntries.saveList[this.accEntries.saveList.length - 1].tranId = this.jvData.tranId;
        this.accEntries.saveList[this.accEntries.saveList.length - 1].createUser = this.ns.getCurrentUser();
        this.accEntries.saveList[this.accEntries.saveList.length - 1].updateUser = this.ns.getCurrentUser();
        this.accEntries.saveList[this.accEntries.saveList.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
        this.accEntries.saveList[this.accEntries.saveList.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
      }

      if(this.passData.tableData[i].deleted){
        this.accEntries.delList.push(this.passData.tableData[i]);
      }
    }
    
     this.accEntries.forApproval = this.jvDetails.forApproval === 'Y' ? 'Y':'N';
     this.accEntries.tranId = this.jvData.tranId;
  }

  saveAcctEntries(){
    console.log(this.accEntries)
    this.prepareData();
    this.accountingService.saveAcitAcctEntries(this.accEntries).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveJVEntry();
        this.retrieveAcctEntries();
        this.form.control.markAsPristine();
      }
    });
  }

  onClickApproval(){
    this.form.control.markAsDirty();
  }

  retrieveJVData(){
    this.accountingService.getJVEntry(this.jvDetails.tranId).subscribe((data:any) => {
      var datas = data.transactions.jvListings;
      this.jvDetails.jvDate = this.ns.toDateTimeString(datas.jvDate);
      this.jvDetails.jvStatus = datas.jvStatusName;
      this.jvDetails.refNo = datas.refNo;
      this.jvDetails.jvType = datas.tranTypeName;
      this.jvDetails.refnoDate = this.ns.toDateTimeString(datas.refnoDate);
    });
  }

  validDetailPayment() : boolean{
    
    if(this.jvType === 1){
        var errorFlag = false;
        for(var i = 0 ; i < this.detailDatas.length; i++){
          if(!this.detailDatas[i].deleted && this.detailDatas[i].prevNetDue < this.detailDatas[i].totalPayt){
            errorFlag = true;
            break;
          }
        }

        if(errorFlag){
          this.errorMessage = 'Total payment amount for Policy cannot be greater than Net Due.';
          return false;
        }else{
          return true;
        }

    }else if(this.jvType === 2){
      return true;
    }else if(this.jvType === 5){
      var totalPaid = 0;
      for (var i = 0; i < this.detailDatas.length; i++) {
        totalPaid = 0;
        for (var j = 0; j < this.detailDatas[i].clmOffset.length; j++) {
          totalPaid += this.detailDatas[i].clmOffset[j].clmPaytAmt;
        }
        if(totalPaid + this.detailDatas[i].balanceAmt == 0){
          return true;
          break;
        }
      }
      this.errorMessage = 'Payment for selected claim is not proportional to payment for Treaty Balance.';
      return false;
    }else if(this.jvType === 6){
      var inwPayment = 0;
      for (var i = 0; i < this.detailDatas.length; i++) {
        inwPayment = 0;
        for (var j = 0; j < this.detailDatas[i].acctOffset.length; j++) {
          inwPayment += this.detailDatas[i].acctOffset[j].paytAmt;
        }
        if(Math.round((this.detailDatas[i].balanceAmt - inwPayment)  * 100)/100 == 0){
          return true;
        }
      }
      this.errorMessage = 'Payment for selected policy is not proportional to payment for Treaty Balance.';
      return false;
    }else if(this.jvType === 7){
      var inwPayment = 0;
      for (var i = 0; i < this.detailDatas.length; i++) {
        inwPayment = 0;
        for (var j = 0; j < this.detailDatas[i].inwPolBal.length; j++) {
          inwPayment += this.detailDatas[i].inwPolBal[j].paytAmt;
        }
        if(this.detailDatas[i].clmPaytAmt - inwPayment == 0){
          return true;
        }
      }
      this.errorMessage = 'Payment for selected claim is not proportional to payment for Treaty Balance.';
      return false;
    }
    return true;
  }

  validPaytAmt() : boolean{
    var errorFlag = false;
    if(this.jvType === 1){
      for (var i = 0; i < this.detailDatas.length; i++) {
        if(!this.detailDatas[i].deleted){
          if((this.detailDatas[i].prevNetDue > 0 &&  this.detailDatas[i].paytAmt < 0 &&
              this.detailDatas[i].paytAmt + this.detailDatas[i].cumPayment < 0)  ||
             
             (this.detailDatas[i].prevNetDue < 0 && this.detailDatas[i].paytAmt > 0 &&
              this.detailDatas[i].paytAmt + this.detailDatas[i].cumPayment > 0)
            ){
            errorFlag = true;
            break;
          }
        }
      }

      if(errorFlag){
        this.errorMessage = 'Refund must not exceed cummulative payments.';
        return false;
      }else{
        return true;
      }
    }else if(this.jvType === 5){
      for (var i = 0; i < this.detailDatas.length; i++) {
        for (var j = 0; j < this.detailDatas[i].clmOffset.length; j++) {
          if(this.detailDatas[i].clmOffset[j].clmPaytAmt > this.detailDatas[i].clmOffset[j].reserveAmt){
            errorFlag = true;
            break;
          }
        }

        if(errorFlag){
          this.errorMessage = 'Paid Amount must not greater than Hist Amount.';
          return false;
        }else{
          return true;
        }
      }
    }else if(this.jvType === 6){

      /*for (var i = 0; i < this.detailDatas.length; i++) {
        for (var j = 0; j < this.detailDatas[i].acctOffset.length; j++) {
          if(!this.detailDatas[i].acctOffset[j].deleted){
            if((this.detailDatas[i].acctOffset[j].prevNetDue > 0 &&  this.detailDatas[i].acctOffset[j].paytAmt < 0 &&
                this.detailDatas[i].acctOffset[j].paytAmt + this.detailDatas[i].acctOffset[j].cumPayment < 0)  ||
               
               (this.detailDatas[i].acctOffset[j].prevNetDue < 0 && this.detailDatas[i].acctOffset[j].paytAmt > 0 &&
                this.detailDatas[i].acctOffset[j].paytAmt + this.detailDatas[i].acctOffset[j].cumPayment > 0)
              ){
                errorFlag = true;
                break;
            }
          }
        }
      }*/

      for (var i = 0; i < this.detailDatas.length; i++) {
        for (var j = 0; j < this.detailDatas[i].acctOffset.length; j++) {
          if(!this.detailDatas[i].acctOffset[j].deleted){
            if(this.detailDatas[i].acctOffset[j].paytAmt + this.detailDatas[i].acctOffset[j].cumPayment > this.detailDatas[i].acctOffset[j].prevNetDue){
              errorFlag = true;
              break;
            }
          }
        }
      }

      if(errorFlag){
        this.errorMessage = 'Paid Amount must not greater than Net Due.';
        return false;
      }else{
        return true;
      }

    }else if(this.jvType === 7){
      for (var i = 0; i < this.detailDatas.length; i++) {
        if(this.detailDatas[i].clmPaytAmt <= this.detailDatas[i].reserveAmt){
          return true;
        }
      }
      this.errorMessage = 'Paid Amount must not greater than Hist Amount.';
      return false;
    }
    return true;
  }

  retrieveJVDetails(){
    var total = 0;
    this.errorFlag = false;
    this.detailDatas = [];
    if(this.jvType === 1){
      this.accountingService.getJVInwPolBal(this.jvDetails.tranId,'').subscribe((data:any) => {
        var datas = data.inwPolBal;
        this.detailDatas = data.inwPolBal;
        for(var i = 0; i < datas.length; i++){
          total += datas[i].paytAmt;
        }
        console.log(total);
        if(total != this.jvDetails.jvAmt){
          this.errorFlag = true;
        }
      });
    }else if(this.jvType === 2){
      this.accountingService.getAcitJVZeroBal(this.jvDetails.tranId,'').subscribe((data:any) => {
        var datas = data.zeroBal;
        for (var i = 0; i < datas.length; i++) {
          total += datas[i].paytAmt;
        }

        if(total != this.jvDetails.jvAmt){
          this.errorFlag = true;
        }
      });
    }else if(this.jvType === 3){
      this.accountingService.getAcitJVPremRes(this.jvDetails.tranId).subscribe((data:any) => {
        var datas = data.premResRel;
        for (var i = 0; i < datas.length; i++) {
          total += datas[i].releaseAmt
        }

        if(total != this.jvDetails.jvAmt){
          this.errorFlag = true;
        }
      });
    }else if(this.jvType === 4){
      this.accountingService.getAcitJVOverdue(this.jvDetails.tranId,'').subscribe((data:any) => {
        var datas = data.overDueAccts;
          for (var i = 0; i < datas.length; i++) {
            total += datas[i].overdueInt
          }
          if(total != this.jvDetails.jvAmt){
            this.errorFlag = true;
          }
      });
    }else if(this.jvType === 5){
      this.accountingService.getNegativeTreaty(this.jvDetails.tranId).subscribe((data:any) => {
        var datas = data.negativeTrty;
        this.detailDatas = data.negativeTrty;
        for (var i = 0; i < datas.length; i++) {
          total += datas[i].balanceAmt
        }

        if(total + this.jvDetails.jvAmt !== 0){
          this.errorFlag = true;
        }
      });
    }else if(this.jvType === 6){
      this.accountingService.getAcctTrtyBal(this.jvDetails.tranId).subscribe((data:any) => {
        var datas = data.acctTreatyBal;
        this.detailDatas = data.acctTreatyBal;
          for (var i = 0; i < datas.length; i++) {
            total += datas[i].balanceAmt
          }
          if(total != this.jvDetails.jvAmt){
            this.errorFlag = true;
          }
      });
    }else if(this.jvType === 7){
      this.accountingService.getRecievableLosses(this.jvDetails.tranId).subscribe((data:any) => {
        var datas = data.receivables;
        this.detailDatas = data.receivables;
          for (var i = 0; i < datas.length; i++) {
            total += datas[i].clmPaytAmt
          }
          if(total != this.jvDetails.jvAmt){
            this.errorFlag = true;
          }
      });
    }else if(this.jvType === 8){
      this.accountingService.getJvInvRollOver(this.jvDetails.tranId).subscribe((data:any) => {
        var datas = data.invtRollOver;
          for (var i = 0; i < datas.length; i++) {
            total += datas[i].maturityValue
          }
          if(total != this.jvDetails.jvAmt){
            this.errorFlag = true;
          }
      });
    }else if(this.jvType === 9){
      this.accountingService.getJvInvPullout(this.jvDetails.tranId).subscribe((data:any) => {
        var datas = data.pullOut;
          for (var i = 0; i < datas.length; i++) {
            total += datas[i].srcMaturityValue
          }
          if(total != this.jvDetails.jvAmt){
            this.errorFlag = true;
          }
      });
    }else if(this.jvType === 10){
      this.accountingService.getInvPlacement(this.jvDetails.tranId).subscribe((data:any) => {
        var datas = data.invPlacement;
          for (var i = 0; i < datas.length; i++) {
            total += datas[i].invtAmt
          }
          if(total != this.jvDetails.jvAmt){
            this.errorFlag = true;
          }
      });
    }else if(this.jvType === 11){
      this.accountingService.getTrtyInv(this.jvDetails.tranId).subscribe((data:any) =>{
        var datas = data.acctTreatyBal;
          for (var i = 0; i < datas.length; i++) {
            total += datas[i].balanceAmt
          }
          if(total != this.jvDetails.jvAmt){
            this.errorFlag = true;
          }
      });
    }
  }

  clickLov(data){
    this.lovRow = data.data;
    if(data.key == 'glShortCd'){
      this.passLov.selector = 'acitChartAcct';
      this.lovCheckBox = true;
      this.passLov.params = {};
    }else if(data.key == 'slTypeName'){
      this.passLov.selector = 'slType';
      this.lovCheckBox = false;
      this.passLov.params = {};
    }else if(data.key == 'slName'){
      this.passLov.selector = 'sl';
      this.lovCheckBox = false;
      this.passLov.params = {
        slTypeCd: data.data.slTypeCd
      };
    }
    this.lov.openLOV();
  }

  setLov(data){
    console.log(data)
    if(data.selector == 'slType'){
      this.lovRow.slTypeName = data.data.slTypeName;
      this.lovRow.slTypeCd = data.data.slTypeCd;
      this.lovRow.slName = '';
      this.lovRow.slCd = '';
    }else if(data.selector == 'sl'){
      this.lovRow.slTypeName = data.data.slTypeName; 
      this.lovRow.slTypeCd = data.data.slTypeCd;
      this.lovRow.slName = data.data.slName;
      this.lovRow.slCd = data.data.slCd;
    }else if(data.selector == 'acitChartAcct'){
      let firstRow = data.data.pop();
      this.lovRow.glAcctId = firstRow.glAcctId;
      this.lovRow.glShortCd = firstRow.shortCode;
      this.lovRow.glShortDesc = firstRow.shortDesc;

      this.passData.tableData = this.passData.tableData.filter(a=>a.glAcctId != '');
      for(let row of data.data){
        this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
        this.passData.tableData[this.passData.tableData.length - 1].glAcctId = row.glAcctId;
        this.passData.tableData[this.passData.tableData.length - 1].glShortCd = row.shortCode;
        this.passData.tableData[this.passData.tableData.length - 1].glShortDesc = row.shortDesc;
      }
    }  

    this.table.refreshTable();
  }

  tableDataChange(data){
    console.log(data)
    this.debitTotal = 0;
    this.creditTotal = 0;

    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.debitTotal  += this.passData.tableData[i].foreignDebitAmt;
      this.creditTotal += this.passData.tableData[i].foreignCreditAmt;
      this.passData.tableData[i].debitAmt    = this.passData.tableData[i].foreignDebitAmt * this.jvData.currRate;
      this.passData.tableData[i].creditAmt  = this.passData.tableData[i].foreignCreditAmt * this.jvData.currRate;
    }
     this.debitTotal  = this.debitTotal;
     this.creditTotal = this.creditTotal;
     this.variance = this.debitTotal - this.creditTotal;
     this.variance = Math.round(this.variance * 100) / 100;
    if(this.variance === 0){
      this.notBalanced = false;
    }
  }

  retrieveJVEntry(){
    this.accountingService.getJVEntry(this.jvDetails.tranId).subscribe((data:any) => {
      console.log(data)
      if(data.transactions.jvListings.jvStatus == 'F'){
        this.readOnly = true;
        this.passData.disableAdd = true;
        this.passData.uneditable = [true,true,true,true,true,true,true,true]
        this.emitData.emit({ statusType: data.transactions.jvListings.jvStatus});
        this
      }
    });
  }
}
