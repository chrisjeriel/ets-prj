import { Component, OnInit } from '@angular/core';
import {QSOA} from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-ar-details-qsoa',
  templateUrl: './ar-details-qsoa.component.html',
  styleUrls: ['./ar-details-qsoa.component.css']
})
export class ArDetailsQsoaComponent implements OnInit {

    passDataQSOA: any = {
    tableData:[],
    tHeader:['Quarter Ending','DR Balance','CR Balance', 'Beginning Balance DR', 'Beginning Balance CR', 'Ending Balance DR', 'Ending Balance CR'],
    dataTypes:['date','currency','currency','currency','currency','currency','currency'],
    total:['Total','drBalance','crBalance','begBalDR','begBalCR','endBalDR','endBalCR'],
    addFlag:true,
    deleteFlag:true,
    genericBtn: "Save",
    infoFlag:true,
    paginateFlag:true,  
    nData: new QSOA(null, null, null, null, null, null, null),
    checkFlag: true,
    widths:['auto','auto','auto','auto','auto','auto','auto'],
    pageID: 5
  }

  passDataNegativeTreatyBalance: any = {
    tableData: [
      {
        quarterEnding: new Date('2018-03-31'), currency: 'PHP', currencyRate: 1, amount: 100000, amountPHP: 100000
      },
      {
        quarterEnding: new Date('2018-06-30'), currency: 'PHP', currencyRate: 1, amount: -500000, amountPHP: -500000
      },
    ],
    tHeader: ["Quarter Ending", "Currency", "Currency Rate", "Amount", "Amount(PHP)"],
    dataTypes: ["date","text","percent","currency","currency"],
    widths: [1,1,1,"auto","auto"],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: "Save",
    infoFlag:true,
    paginateFlag:true,
    nData:  {
      quarterEnding: null, currency: null, currencyRate: null, amount: null, amountPHP: null
    },
    pageID: 6,
    total: [null,null,'TOTAL','amount','amountPHP']
  }

  constructor( private accountingService: AccountingService) { }

  ngOnInit() {
    //this.passDataQSOA.tableData = this.accountingService.getQSOAData();
  }

}
