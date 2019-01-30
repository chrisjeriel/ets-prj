import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payt-req-investment',
  templateUrl: './payt-req-investment.component.html',
  styleUrls: ['./payt-req-investment.component.css']
})
export class PaytReqInvestmentComponent implements OnInit {

  passData: any = {
    tableData: [
      {
      	bank: 'BPI',
      	accountNo: 'BPI 1',
      	maturityPeriod: 5,
      	durationUnit: 'Years',
      	interestRate: 8.875,
      	datePurchased: new Date('2013-10-20'),
      	maturityDate: new Date('2018-10-20'),
      	curr: 'PHP',
      	currRate: 1,
      	bankCharge: 18112.50,
      	witholdingTax: 82250,
      	investment: 14000000,
      	maturityValue: 18112500
      },
      {
      	bank: 'RCBC',
      	accountNo: 'RCBC1 1',
      	maturityPeriod: 35,
      	durationUnit: 'Days',
      	interestRate: 1.5,
      	datePurchased: new Date('2013-09-26'),
      	maturityDate: new Date('2018-10-31'),
      	curr: 'PHP',
      	currRate: 1,
      	bankCharge: 10150,
      	witholdingTax: 3000,
      	investment: 10000000,
      	maturityValue: 10150000
      },
    ],
    tHeader: ['Bank', 'Account No.', 'Maturity Period', 'Duration Unit', 'Interest Rate', 'Date Purchased', 'Maturity Date', 'Curr', 'Curr Rate','Bank Charge', 'Witholding Tax', 'Investment', 'Maturity Value'],
    dataTypes: ['text', 'text', 'number', 'text', 'percent', 'date', 'date', 'text','percent','currency','currency','currency','currency'],
    nData: {},
    widths: [],
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null,null,null,null,null,null, 'Total', 'bankCharge', 'witholdingTax', 'investment', 'maturityValue'],
    genericBtn: 'Save',
  }

  constructor() { }

  ngOnInit() {
  }

}
