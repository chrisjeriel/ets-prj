import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JVAccountingEntries } from '@app/_models'
import { AccountingService, NotesService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-jv-accounting-entries',
  templateUrl: './jv-accounting-entries.component.html',
  styleUrls: ['./jv-accounting-entries.component.css']
})
export class JvAccountingEntriesComponent implements OnInit {

   @Input() jvData:any;
   @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
   
   passData: any = {
    tableData: [],
    tHeader: ['Account Code', 'Account Name', 'SL Type', 'SL Name', 'Debit', 'Credit'],
    dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
    magnifyingGlass: ['accountCode','slType','slName'],
    nData: {
      autoTag : '',
      createDate : '',
      createUser : '',
      creditAmt : '',
      debitAmt : '',
      entryId : '',
      glAcctId : '',
      slCd : '',
      slTypeCd : '',
      tranId : '',
      updateDate : '',
      updateUser : ''
    },
    paginateFlag: true,
    infoFlag: true,
    checkFlag: true,
    pageID: 2,
    addFlag: true,
    deleteFlag: true,
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

  debitTotal: number = 0;
  creditTotal: number = 0;
  variance : number = 0;
  dialogIcon : any;
  dialogMessage : any;

  constructor(private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.jvDetails = this.jvData;
    this.jvDetails.jvDate = this.ns.toDateTimeString(this.jvDetails.jvDate);
    this.jvDetails.refnoDate = this.ns.toDateTimeString(this.jvDetails.refnoDate);
    this.retrieveAcctEntries();
  }

  retrieveAcctEntries(){
    this.accountingService.getAcitAcctEntries(this.jvData.tranId).subscribe((data:any) => {
      this.passData.tableData = [];
      this.debitTotal = 0;
      for (var i = 0; i < data.list.length; i++) {
        this.passData.tableData.push(data.list[i]);
        this.debitTotal += data.list[i].debitAmt;
        this.creditTotal += data.list[i].creditAmt;
      }
      this.variance = this.debitTotal - this.creditTotal;
      this.table.refreshTable();
      console.log(data)
    });
  }

  prepareData(){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.accEntries.saveList.push(this.passData.tableData[i]);
        this.accEntries.saveList[this.accEntries.saveList.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
        this.accEntries.saveList[this.accEntries.saveList.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
      }

      if(this.passData.tableData[i].deleted){
        this.accEntries.delList.push(this.passData.tableData[i]);
      }
    }
    
  }

  saveAcctEntries(){
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
      }
    });
  }
}
