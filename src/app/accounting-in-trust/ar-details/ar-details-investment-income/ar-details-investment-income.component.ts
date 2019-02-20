import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ar-details-investment-income',
  templateUrl: './ar-details-investment-income.component.html',
  styleUrls: ['./ar-details-investment-income.component.css']
})
export class ArDetailsInvestmentIncomeComponent implements OnInit {

  passDataInvestmentIncome: any = {
    tableData:[
    	{
    		bank: 'BPI',
    		certificateNo: 'BPI 1',
    		investmentType: 'Time Deposit',
    		maturityPeriod: 5,
    		durationUnit: 'Years',
    		interestRate: 8.875,
    		datePurchased: new Date('2013-10-20'),
    		maturityDate: new Date('2018-10-20'),
    		curr: 'PHP',
    		currRate: 1,
    		investment: 14000000,
    		investmentIncome: 4112500
    	},
    	{
    		bank: 'RCBC',
    		certificateNo: 'RCBC 1',
    		investmentType: 'Treasury Bonds',
    		maturityPeriod: 35,
    		durationUnit: 'Days',
    		interestRate: 1.5,
    		datePurchased: new Date('2018-09-26'),
    		maturityDate: new Date('2018-10-31'),
    		curr: 'PHP',
    		currRate: 1,
    		investment: 10000000,
    		investmentIncome: 150000
    	}
    ],
    tHeader:['Bank','Certificate No.','Investment Type','Maturity Period','Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income'],
    dataTypes:['text','text','text','number','text','percent','date','date','text','percent','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,'Total','investment','investmentIncome'],
    addFlag:true,
    deleteFlag:true,
    genericBtn: "Save",
    infoFlag:true,
    paginateFlag:true, 
    nData: {
    		bank: null,
    		certificateNo: null,
    		investmentType: null,
    		maturityPeriod: null,
    		durationUnit: null,
    		interestRate: null,
    		datePurchased: null,
    		maturityDate: null,
    		curr: null,
    		currRate: null,
    		investment: null,
    		investmentIncome: null
    	},
    checkFlag: true,
  }

  constructor() { }

  ngOnInit() {
  }

}
