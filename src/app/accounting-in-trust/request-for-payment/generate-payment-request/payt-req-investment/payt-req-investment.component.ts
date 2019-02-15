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
      	certificateNo: 'BPI 1',
        investmentType: 'Treasury',
      	maturityPeriod: 5,
      	durationUnit: 'Years',
      	interestRate: 8.875,
      	datePurchased: new Date('2013-10-20'),
      	maturityDate: new Date('2018-10-20'),
      	curr: 'PHP',
      	currRate: 1,
      	investment: 14000000,
      },
      {
      	bank: 'RCBC',
      	certificateNo: 'RCBC1 1',
        investmentType: 'Time Deposit',
      	maturityPeriod: 35,
      	durationUnit: 'Days',
      	interestRate: 1.5,
      	datePurchased: new Date('2013-09-26'),
      	maturityDate: new Date('2018-10-31'),
      	curr: 'PHP',
      	currRate: 1,
      	investment: 10000000,
      },
    ],
    tHeader: ['Bank', 'Certificate No.', 'Investment Type', 'Maturity Period', 'Duration Unit', 'Interest Rate', 'Date Purchased', 'Maturity Date', 'Curr', 'Curr Rate', 'Investment'],
    dataTypes: ['text',  'text', 'text', 'number', 'text', 'percent', 'date', 'date', 'text','percent','currency'],
    nData: {},
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null,null,null,null,null,null,null, 'Total','investment'],
    widths:['auto',1,1,1,1,1,1,1,1,'auto','auto'],
    genericBtn: 'Save',
  }

  constructor() { }

  ngOnInit() {
  }

}
