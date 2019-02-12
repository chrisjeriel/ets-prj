import { Component, OnInit } from '@angular/core';
import { AccountingEntriesExtract } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-acct-entries',
  templateUrl: './acct-entries.component.html',
  styleUrls: ['./acct-entries.component.css']
})
export class AcctEntriesComponent implements OnInit {
  
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

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
