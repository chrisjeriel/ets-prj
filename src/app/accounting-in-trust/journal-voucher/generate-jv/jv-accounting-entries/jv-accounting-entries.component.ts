import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jv-accounting-entries',
  templateUrl: './jv-accounting-entries.component.html',
  styleUrls: ['./jv-accounting-entries.component.css']
})
export class JvAccountingEntriesComponent implements OnInit {

   accEntriesData: any = {
    tableData: [
      [null, null, null, null, null, null]
    ],
    tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
    dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
    nData: [null, null, null, null, null, null],
    paginateFlag: true,
    infoFlag: true,
    checkFlag: true,
    pageID: 2,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', null, null],
    genericBtn: 'Save'
  }
  
  constructor() { }

  ngOnInit() {
  }

}
