import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ExtractedData } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common';
import { AccountingService, NotesService } from '@app/_services';

@Component({
  selector: 'app-in-accounting-entries',
  templateUrl: './in-accounting-entries.component.html',
  styleUrls: ['./in-accounting-entries.component.css']
})
export class InAccountingEntriesComponent implements OnInit, AfterViewInit {
  passData: any={
  	tHeader:['Date','Tran Class', 'Currency', 'Ref. No.', 'Account Code','Account Name', 'Particulars', 'SL Type','SL Name', 'Tran Status', 'Acct Status', 'Debit', 'Credit','Local Debit', 'Local Credit'],
  	dataTypes:['date','text','text','text','text','text','text','text','text','text','text','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','debitAmt','creditAmt','localDebitAmt','localCreditAmt'],
    uneditable:[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
  	searchFlag: true,
  	keys:['tranDate','tranClass','currCd','refNo','acctCode','acctName','particulars','slTypeName','slName','tranStatusDesc','acctStatusDesc','debitAmt','creditAmt','localDebitAmt','localCreditAmt'],
  	paginateFlag:true,
  	infoFlag:true,
  	tableData:[],
  	pageLength: 15,
    widths:[1,1,1,1,1,1,'auto',1,1,1,1,110,110,110,110]
  }
  dateExtracted: string;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  params:any = {
    extractUser : this.ns.getCurrentUser(),
    entryType: 'A'
  }

  extractParams:any = {
    entryType : '',
    periodType : '',
    periodFrom : '',
    periodTo : '',
    acctParam : '',
    slTypeParam : '',
    arTag : false,
    cvTag : false,
    jvTag : false,
    closeTranTag : false,
    appendTag : 'N',
    extractDate : '',
    currCdParam: ''
  }

  constructor(private as: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.dateExtracted = new Date().toISOString().slice(0, 16);
    this.retrieveData();
  }

  ngAfterViewInit(){
    this.table.overlayLoader = true;
  }

  retrieveData() {
    setTimeout(() => {
      this.table.refreshTable();
      this.table.overlayLoader = true;
    }, 0);
    this.as.getAcitAcctEntriesExt(this.params).subscribe(a=>{
      this.passData.tableData = a['acitAcctEntriesExt'];
      if(this.passData.tableData.length != 0){
        if(this.passData.tableData.some(a=>a.extractId==2)){

        }else{
          let row = this.passData.tableData[0];
          this.extractParams = {
            
            periodType : row.periodType == 'T' ? 'Transaction Date' : 'Posting Date',
            periodFrom : this.ns.toDateTimeString(row.periodFrom),
            periodTo : this.ns.toDateTimeString(row.periodTo),
            acctParamCode : row.acctParamCode,
            acctParamName: row.acctParamName,
            slTypeParam : row.slTypeParam,
            slTypeParamName : row.slTypeParamName,
            arTag : row.arTag =='Y',
            cvTag : row.cvTag =='Y',
            jvTag : row.jvTag =='Y',
            closeTranTag : row.closeTranTag =='Y',
            appendTag : row.appendTag =='Y',
            extractDate : this.ns.toDateTimeString(row.extractDate),
            currCdParam: ''
          }
        }
      }
      this.table.refreshTable();
    })
  }

}
