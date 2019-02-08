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
    tHeader: ["Tran Type", "Ref. No.", "Ref. Date", "Payye/Payor","Particulars","Account Code","Account Name","Net Amount"],
    dataTypes: ["text","text","text","text","text","text","text","currency"],
    resizable: [true, true, true, true, true, true,true,true],
    total:[null,null,null,null,null,null,'Total','netAmount'],
    nData: new AccountingEntriesExtract(null,null,null,null,null,null,null,null),
    pageLength: 20,
    widths: [1,220,150,150,150,150,150,150],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: []
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
