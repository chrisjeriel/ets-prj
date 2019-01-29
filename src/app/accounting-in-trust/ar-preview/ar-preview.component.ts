import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ar-preview',
  templateUrl: './ar-preview.component.html',
  styleUrls: ['./ar-preview.component.css']
})
export class ArPreviewComponent implements OnInit {

  amountDetailsData: any = {
    tableData: [
      {
      	itemNo: 1,
      	genType: 'A',
        detail: 'Premium (Vatable)',
        originalAmount: 1785714.29,
        currency: 'PHP',
        curencyRate: 1,
        localAmount: 1785714.29
      },
      {
      	itemNo: 2,
      	genType: 'A',
        detail: 'VAT-Exempt Sales',
        originalAmount: 0,
        currency: 'PHP',
        curencyRate: 1,
        localAmount: 0
      },
      {
      	itemNo: 3,
      	genType: 'A',
        detail: 'VAT Zero-Rated Sales',
        originalAmount: 0,
        currency: 'PHP',
        curencyRate: 1,
        localAmount: 0
      },
      {
      	itemNo: 4,
      	genType: 'A',
        detail: 'VAT (12%)',
        originalAmount: 214285.71,
        currency: 'PHP',
        curencyRate: 1,
        localAmount: 214285.71
      },
      {
        itemNo: 5,
      	genType: 'A',
        detail: 'Creditable Wtax (20%)',
        originalAmount: -357142.86,
        currency: 'PHP',
        curencyRate: 1,
        localAmount: -357142.86
      },
    ],
    tHeader: ['Item No.', 'Gen Type', 'Detail', 'Original Amount', 'Currency', 'Currency Rate', 'Local Amount'],
    dataTypes: ['number', 'text', 'text', 'currency', 'text', 'percent', 'currency'],
    nData: [null, null, null, null, null, null, null],
    widths: ['1', '1', '500', 'auto','1','1','auto'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, 'Total', null, null, null, 'localAmount'],
    genericBtn: 'Save',
    opts:[

      {
        selector: 'plusMinus',
        vals: ['Add', 'Less', 'None']
      }
    ]
  }



  accEntriesData: any = {
    tableData: [
      [null, null, null, null, null, null]
    ],
    tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
    dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
    nData: [null, null, null, null, null, null],
    paginateFlag: true,
    infoFlag: true,
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
