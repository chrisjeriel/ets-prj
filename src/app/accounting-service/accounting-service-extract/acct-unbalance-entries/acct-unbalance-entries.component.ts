import { Component, OnInit, ViewChild } from '@angular/core';
import { UnbalanceEntries } from '@app/_models';
import { Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common';
import { AccountingService, NotesService } from '@app/_services';



@Component({
  selector: 'app-acct-unbalance-entries',
  templateUrl: './acct-unbalance-entries.component.html',
  styleUrls: ['./acct-unbalance-entries.component.css']
})
export class AcctUnbalanceEntriesComponent implements OnInit {

  passData: any={
    tHeader:['Date','Tran Class', 'Currency','Ref. No.', 'Particulars', 'Tran Status', 'Acct Status', 'Debit', 'Credit', 'Local Debit', 'Local Credit'],
    dataTypes:['date','text','text','text','text','text','text','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,'Total','debitAmt','creditAmt','localDebitAmt','localCreditAmt'],
    uneditable:[true,true,true,true,true,true,true,true,true,true,true,true],
    searchFlag: true,
    keys:['tranDate','tranClass','currCd','refNo','particulars','tranStatusDesc','acctStatusDesc','debitAmt','creditAmt','localDebitAmt','localCreditAmt'],
    paginateFlag:true,
    infoFlag:true,
    tableData:[],
    pageLength: 15,
    widths:[1,1,1,1,'auto',1,1,110,110,110,110],
    genericBtn : 'View Transaction Details'
  }

  tranType:string;
  dateExtracted:string;
  periodFrom: string;
  periodTo: string;
  selectedRow:any = {};

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  params:any = {
    extractUser : this.ns.getCurrentUser(),
    entryType : 'U'
  }

  extractParams:any = {
    entryType : '',
    periodType : '',
    periodFrom : '',
    periodTo : '',
    acctParam : '',
    slTypeParam : '',
    orTag : false,
    cvTag : false,
    jvTag : false,
    closeTranTag : false,
    appendTag : 'N',
    extractDate : '',
    currCdParam: ''
  }

  constructor(private as: AccountingService, private ns: NotesService,private route : Router) { }

  ngOnInit() {
    this.retrieveData();
  }

  onRowClick(data){
    this.selectedRow = data;
  }

  retrieveData(){
    setTimeout(() => {
      this.table.refreshTable();
      this.table.overlayLoader = true;
    }, 0);
    this.as.getAcseAcctEntriesExt(this.params).subscribe(a=>{
      this.passData.tableData = a['acseAcctEntriesExt'];
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
            orTag : row.orTag =='Y',
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

  viewTranDetails(){
    console.log(this.selectedRow)
    if(this.selectedRow.tranClass == 'OR'){
      // this.route.navigate(['accounting-in-trust',{link:'/accounting-service-extract',tab:'Unbalance'}],{ skipLocationChange: true });

      let record = {
        tranId: this.selectedRow.tranId,
        orNo:''
      }

    this.route.navigate(['/accounting-service', { link:'/accounting-service-extract',tab:'UnbalanceTab', slctd: JSON.stringify(record), action: 'edit', tranStat: this.selectedRow.tranStatus }], { skipLocationChange: true });
    }else if(this.selectedRow.tranClass == 'CV'){
      this.route.navigate(['/generate-cv-service',{ link:'/accounting-service-extract',tab:'UnbalanceTab',tranId : this.selectedRow.tranId}], { skipLocationChange: true });

    }else if(this.selectedRow.tranClass == 'JV'){
      // this.route.navigate(['generate-jv',{link:'/accounting-entries',tab:'UnbalanceTab'}],{ skipLocationChange: true });

      this.route.navigate(['/generate-jv-service', { link:'/accounting-service-extract',tab:'UnbalanceTab',
                                                  tranId            : this.selectedRow.tranId,
                                                  tranTypeCd        : this.selectedRow.trantypeCd,
                                                  exitLink          : '/journal-voucher'}], 
                                                { skipLocationChange: true });
    }else{
      //do something
    }
  }
}
