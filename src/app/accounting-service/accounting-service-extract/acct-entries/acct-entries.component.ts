import { Component, OnInit } from '@angular/core';
import { ExtractedData, AccountingEntriesExtract } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-acct-entries',
  templateUrl: './acct-entries.component.html',
  styleUrls: ['./acct-entries.component.css']
})
export class AcctEntriesComponent implements OnInit {
  

  passData: any={
    tHeader:['Date','Tran Type', 'Ref. No.', 'Account Code','Account Name', 'Particulars', 'SL Type','SL Name', 'Status', 'Debit', 'Credit'],
    dataTypes:['date','text','text','text','text','text','text','text','text','currency','currency'],
    total:[null,null,null,null,null,null,null,null,'Total','debit','credit'],
    uneditable:[true,true,true,true,true,true,true,true,true,true],
    searchFlag: true,
    // filters:[
    //   {}
    // ],
    paginateFlag:true,
    infoFlag:true,
    tableData:[],
    pageLength: 15,
    widths: [1,1,1,1,'auto','auto',1,1,1,120,120]
  }

  AccountingEntryData: any = {
    tableData: this.accountingService.getAccountingEntryExtract(),
    tHeader: ["Tran Type", "Ref. No.", "Ref. Date", "Payee/Payor","Particulars","Account Code","Account Name","Net Amount"],
    dataTypes: ["text","text","text","text","text","text","text","currency"],
    resizable: [true, true, true, true, true, true,true,true],
    total:[null,null,null,null,null,null,'Total','netAmount'],
    nData: new AccountingEntriesExtract(null,null,null,null,null,null,null,null),
    pageLength: 15,
    widths: [1,220,150,150,150,150,150,150],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: [
      {
        key: 'tranType',
        title: 'Tran Type',
        dataType: 'text'
      },
      {
        key: 'refNo',
        title: 'Ref. No.',
        dataType: 'text'
      },
      {
        key: 'refDate',
        title: 'Ref. Date',
        dataType: 'date'
      },
      {
        key: 'payeePayor',
        title: 'Payee/Payor',
        dataType: 'text'
      },
      {
        key: 'particulars',
        title: 'Particulars',
        dataType: 'text'
      },
      {
        key: 'accountCode',
        title: 'Account Code',
        dataType: 'text'
      },
      {
        key: 'accountName',
        title: 'Account Name',
        dataType: 'text'
      },
      {
        key: 'netAmount',
        title: 'Net Amount',
        dataType: 'text'
      },
    ]
  }
  dateExtracted: string;
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
    this.passData.tableData = [
      new ExtractedData(new Date(2018,11,2),'AR','2018-00372890','1-01-03-01','BPI Savings Account No 0074-0073-92', 'Payment for', null,null ,'New', 282883,282883),
      new ExtractedData(new Date(2018,11,25),'CV','2018-00372900','1-01-03-01','BPI Savings Account No 0074-0073-92', 'Payment for', null,null ,'New', 193039,193039),
      new ExtractedData(new Date(2019,0,21),'JV','2018-00000093','1-01-03-01','BPI Savings Account No 0074-0073-92', 'Payment for', null,null ,'New', 1500000,1500000),

    ];
    this.dateExtracted = new Date().toISOString().slice(0, 16);
  }
}
