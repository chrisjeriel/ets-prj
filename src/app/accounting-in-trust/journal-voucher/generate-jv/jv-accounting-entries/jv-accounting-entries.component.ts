import { Component, OnInit } from '@angular/core';
import { JVAccountingEntries } from '@app/_models'
import { AccountingService } from '@app/_services'

@Component({
  selector: 'app-jv-accounting-entries',
  templateUrl: './jv-accounting-entries.component.html',
  styleUrls: ['./jv-accounting-entries.component.css']
})
export class JvAccountingEntriesComponent implements OnInit {

   accEntriesData: any = {
    tableData: this.accountingService.getJVAccountingEntry(),
    tHeader: ['Account Code', 'Account Name', 'SL Type', 'SL Name', 'Debit', 'Credit'],
    dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
    magnifyingGlass: ['accountCode','slType','slName'],
    nData: new JVAccountingEntries(null, null, null, null, null, null),
    paginateFlag: true,
    infoFlag: true,
    checkFlag: true,
    pageID: 2,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', null, null],
    genericBtn: 'Save'
  }
  
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
