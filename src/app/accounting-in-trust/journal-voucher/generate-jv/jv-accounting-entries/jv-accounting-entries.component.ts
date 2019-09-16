import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
   @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
   @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
   @ViewChild('myForm') form:any;
   @ViewChild(LovComponent) lov: LovComponent;

   passData: any = {
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
  }
  
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

  constructor(private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    console.log(this.jvType)
    this.jvDetails = this.jvData;
    this.jvDetails.jvDate = this.ns.toDateTimeString(this.jvDetails.jvDate);
    this.jvDetails.refnoDate = this.jvDetails.refnoDate === "" ? "":this.ns.toDateTimeString(this.jvDetails.refnoDate);

    if(this.jvDetails.statusType == 'N'){
      this.passData.disableAdd = false;
      this.readOnly = false;
    }else {
      this.readOnly = true;
       this.passData.uneditable = [true,true,true,true,true,true]
    }
    this.retrieveAcctEntries();
    this.retrieveJVDetails();
  }

  retrieveAcctEntries(){
    this.accountingService.getAcitAcctEntries(this.jvData.tranId).subscribe((data:any) => {
      this.passData.tableData = [];
      this.debitTotal = 0;
      this.creditTotal = 0;
      for (var i = 0; i < data.list.length; i++) {
        this.passData.tableData.push(data.list[i]);
        this.debitTotal += data.list[i].debitAmt;
        this.creditTotal += data.list[i].creditAmt;
      }
      this.variance = this.debitTotal - this.creditTotal;
      if(this.variance === 0){
        this.notBalanced = false;
      }
      this.table.refreshTable();
      console.log(data)
    });
  }

  onClickSave(){
    this.debitTotal = 0;
    this.creditTotal = 0;
    this.variance = 0;
    if(this.jvDetails.forApproval === 'Y'){
      for (var i = 0; i < this.passData.tableData.length; i++) {
        this.debitTotal += this.passData.tableData[i].debitAmt;
        this.creditTotal += this.passData.tableData[i].creditAmt;
      }
      this.variance = this.debitTotal - this.creditTotal;

      if(this.variance != 0){
        this.dialogMessage = "Accounting Entries does not tally.";
        this.dialogIcon = "error-message";
        this.successDiag.open();
      }else if(this.errorFlag){
        this.dialogMessage = 'Total Balance for Selected Policy Transactions must be equal to JV Amount.';
        this.dialogIcon = "error-message";
        this.successDiag.open();
      }else{
        this.confirm.confirmModal();
      }
    }else{
      this.confirm.confirmModal();
    }
    
  }

  prepareData(){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.accEntries.saveList.push(this.passData.tableData[i]);
        this.accEntries.saveList[this.accEntries.saveList.length - 1].tranId = this.jvData.tranId;
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

  retrieveJVDetails(){
    var total = 0;
    this.errorFlag = false;
    if(this.jvType === 1){
      this.accountingService.getJVInwPolBal(this.jvDetails.tranId,'').subscribe((data:any) => {
        var datas = data.inwPolBal;

        for(var i = 0; i < datas.length; i++){
          total += datas[i].paytAmt;
        }

        if(total != this.jvDetails.jvAmt){
          this.errorFlag = true;
        }
      });
    }else if(this.jvType === 2){
      this.accountingService.getAcitJVZeroBal(this.jvDetails.tranId,'').subscribe((data:any) => {
        console.log(data)
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
        for (var i = 0; i < datas.length; i++) {
          total += datas[i].balanceAmt
        }

        if(total != this.jvDetails.jvAmt){
          this.errorFlag = true;
        }
      });
    }else if(this.jvType === 6){
      this.accountingService.getAcctTrtyBal(this.jvDetails.tranId).subscribe((data:any) => {
        var datas = data.acctTreatyBal;
        console.log(datas);
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
        console.log(datas);
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
        console.log(datas);
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
        console.log(datas);
          for (var i = 0; i < datas.length; i++) {
            total += datas[i].maturityValue
          }
          if(total != this.jvDetails.jvAmt){
            this.errorFlag = true;
          }
      });
    }else if(this.jvType === 10){
      this.accountingService.getInvPlacement(this.jvDetails.tranId).subscribe((data:any) => {
        var datas = data.invPlacement;
        console.log(datas);
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
        console.log(datas);
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
      this.debitTotal  += this.passData.tableData[i].debitAmt;
      this.creditTotal += this.passData.tableData[i].creditAmt;
    }

     this.variance = this.debitTotal - this.creditTotal;
    if(this.variance === 0){
      this.notBalanced = false;
    }
  }
}
