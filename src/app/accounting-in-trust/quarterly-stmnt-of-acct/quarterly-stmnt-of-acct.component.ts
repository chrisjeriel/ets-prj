import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quarterly-stmnt-of-acct',
  templateUrl: './quarterly-stmnt-of-acct.component.html',
  styleUrls: ['./quarterly-stmnt-of-acct.component.css']
})
export class QuarterlyStmntOfAcctComponent implements OnInit {

comStmt:boolean = false;
receivables:boolean = false;
summary:boolean = false;
remittances:boolean = false;

balanceDebit: any = 800071.34;
balanceCredit: any = 0;
totalDebit: any = 1510787.46;
totalCredit: any = 1510787.46;

	passDataListOfQsoaAperCompany: any ={
		tableData:[
			{
				company: 'Charter Ping An',
				quarterEnding: new Date('2018-03-31'),
				status: 'Paid',
				referenceNo: '2018-00001',
				debit: 710716.12,
				credit: 1510787.46
			},
			{
				company: 'Charter Ping An',
				quarterEnding: new Date('2018-06-30'),
				status: 'Paid',
				referenceNo: '2018-00045',
				debit: 500000,
				credit: 700000
			},
			{
				company: 'Charter Ping An',
				quarterEnding: new Date('2018-09-30'),
				status: 'Unpaid',
				referenceNo: '',
				debit: 500000,
				credit: 100000
			},
			{
				company: 'Malayan',
				quarterEnding: new Date('2018-03-31'),
				status: 'Paid',
				referenceNo: '2018-00002',
				debit: 500000,
				credit: 700000
			},
			{
				company: 'Malayan',
				quarterEnding: new Date('2018-06-30'),
				status: 'Paid',
				referenceNo: '2018-00046',
				debit: 500000,
				credit: 100000
			},
			{
				company: 'Malayan',
				quarterEnding: new Date('2018-06-30'),
				status: 'Unpaid',
				referenceNo: '',
				debit: 500000,
				credit: 700000
			}
		],
		tHeader: ["Company","Quarter Ending","Status","Reference No.","Debit","Credit"],
		dataTypes: ["text","date","text","text","currency","currency"],
		widths:["200"],
		infoFlag: true,
		paginateFlag: true,
		genericBtn: 'View Details',
		total: [null,null,null,"TOTAL","debit","credit"],
		searchFlag:true,
		uneditable: [true,true,true,true,true,true],
		pageLength: 15,
		pageID:1,
		filters: [
			{
				key: 'company',
				title: 'Company',
				dataType: 'text'
			},
			{
				key: 'quarterEnding',
				title: 'Quarter Ending',
				dataType: 'date'
			},
			{
				key: 'status',
				title: 'Status',
				dataType: 'text'
			},
			{
				key: 'referenceNo',
				title: 'Ref. No.',
				dataType: 'text'
			},
			{
				key: 'debit',
				title: 'Debit',
				dataType: 'text'
			},
			{
				key: 'credit',
				title: 'Credit',
				dataType: 'text'
			},
		]
	}

	passDataCombinedStatementOfItAcct: any ={
		tableData:[
			{particulars: 'BEGINNING BALANCES DECEMBER 31,2017',referenceNo: '',breakdownAmount: null,debit: 145590.21,credit: 580431.73},
			{particulars: 'PREMIUMS',referenceNo: '',breakdownAmount: 2204840.49,debit:'',credit:''},
			{particulars: 'Less: Returns',referenceNo: '',breakdownAmount: 29095.37,debit:'',credit: 2175745.12},
			{particulars: 'COMMISSIONS',referenceNo: '',breakdownAmount: 583237.96,debit:'',credit:''},
			{particulars: 'Less: Returns',referenceNo: '',breakdownAmount: 8719.97,debit:'',credit: -574517.99},
			{particulars: 'OTHER UNDERWRITING CHARGES',referenceNo: '',breakdownAmount: 69574.22,debit:'',credit:''},
			{particulars: 'Less: Returns',referenceNo: '',breakdownAmount: 1047.37,debit:'',credit: -68499.85},
			{particulars: 'LOSSES PAID',referenceNo: '',breakdownAmount: null,debit: '',credit: -307936.47},
			{particulars: 'INTEREST INCOME ON INVESTMENT (Net WHTax)',referenceNo:'',breakdownAmount: null,debit:'',credit: 3536.47},
			{particulars: 'INTEREST ON SAVINGS (Net WHTax)',referenceNo: '',breakdownAmount: null,debit:'',credit: 174.93},
			{particulars: 'INTEREST EXPENSES ON PREMIUM RESERVE RELEASED for the 1st Quarter 2018',referenceNo: '',breakdownAmount: null,debit: '',credit: -18315.12},
			{particulars: 'ACCOUNTS RECEIVABLE',referenceNo: '',breakdownAmount: null,debit: 736563.02,credit:''},
			{particulars: 'Less: Returns',referenceNo: '',breakdownAmount: null,debit: -24502.60,credit:''},
			{particulars: 'Service Fee',referenceNo: 'OR-016312',breakdownAmount: -66927.94,debit:'',credit: -66927.94},
			{particulars: 'Miscellaneous Charges',referenceNo: '',breakdownAmount: null,debit:'',credit: -12298.52},
			{particulars: 'Excess of Loss 2018 Min. Deposit-1st Installment',referenceNo: '',breakdownAmount: null,debit:'',credit: -212500.63},
			{particulars: 'Gain on Foreign Exchange',referenceNo: '',breakdownAmount: null,debit:'',credit: 3.78},
			{particulars: 'Remittances',referenceNo: 'AR-000264',breakdownAmount: -68535.60,debit:'',credit:''},
			{particulars: '',referenceNo: 'AR-000264',breakdownAmount: -78399.92,debit: -146935.52,credit:''},
		],
		tHeader:["Particulars","Reference No.","Breakdown Amount","DEBIT","CREDIT"],
		dataTypes: ["text","text","currency","currency","currency"],
		uneditable: [true,true,true,true,true],
		total: [null,'TOTAL',null,'debit','credit'],
		tableOnly: true,
		pageLength: 20,
		pageStatus: true,
		pagination: true,
		colSize: ['300px','120px','120px','120px','120px'],
		pageID:2
	}

	passDataViewAccountsReceivable: any = {
		tableData:[
			{policyNo:'CAR-2018-00001-99-0001-000',memoNo:'01-0060',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:37128,commission:11138.40,premiumTax:1336.61,amountDue:24652.99},
			{policyNo:'CAR-2018-00002-33-0001-000',memoNo:'01-0061',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:33210,commission:9963,premiumTax:1195.56,amountDue:22051.44},
			{policyNo:'CAR-2018-00003-01-0002-001',memoNo:'01-0062',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:47832.42,commission:14349.73,premiumTax:1721.97,amountDue:31760.72},
			{policyNo:'CAR-2018-00004-01-0001-001',memoNo:'01-0020',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:9979.20,commission:2993.76,premiumTax:359.25,amountDue:6626.19},
			{policyNo:'CAR-2018-00005-01-0001-005',memoNo:'03-0320',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:23493.91,commission:7048.18,premiumTax:845.78,amountDue:15599.95},
			{policyNo:'CEC-2018-00001-99-0001-000',memoNo:'01-0060',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:5918.40,commission:1775.52,premiumTax:213.06,amountDue:3929.82},
			{policyNo:'CEC-2018-00002-31-0001-000',memoNo:'01-0060',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:552856.33,commission:165856.90,premiumTax:19902.83,amountDue:367096.60},
			{policyNo:'EAR-2018-00003-99-0001-000',memoNo:'01-0287',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:11299.62,commission:3289.89,premiumTax:406.79,amountDue:7502.94},
			{policyNo:'EAR-2018-00004-02-0001-000',memoNo:'01-0060',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:4500,commission:1350,premiumTax:162,amountDue:2988},
			{policyNo:'EAR-2018-00005-24-0001-000',memoNo:'01-0060',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:14080,commission:4224,premiumTax:506.88,amountDue:9349.12},
			{policyNo:'EAR-2018-00001-99-0001-001',memoNo:'02-0324',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:43880.50,commission:13164.15,premiumTax:1579.70,amountDue:29136.65},
			{policyNo:'EAR-2018-00002-42-0001-000',memoNo:'01-0060',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:5387.80,commission:1616.34,premiumTax:193.96,amountDue:3577.50},
			{policyNo:'EEI-2018-00003-99-0001-000',memoNo:'01-0035',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:1943.34,commission:583,premiumTax:69.96,amountDue:1290.38},
			{policyNo:'EEI-2018-00004-01-0001-000',memoNo:'01-0060',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:49238.81,commission:14771.65,premiumTax:1772.60,amountDue:32694.56},
			{policyNo:'MBI-2018-00001-12-0001-000',memoNo:'03-0622',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:42991.39,commission:12897.42,premiumTax:1547.69,amountDue:28546.28},
			{policyNo:'MBI-2018-00002-24-0001-000',memoNo:'01-0060',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:12708.80,commission:3812.64,premiumTax:457.52,amountDue:8438.64},
			{policyNo:'CAR-2018-00006-35-0001-000',memoNo:'01-0004',inceptDate:new Date('2018-01-12'),expiryDate:new Date('2019-01-01'),effectiveDate:new Date('2018-01-12'),premium:199433.18,commission:59829.95,premiumTax:7179.59,amountDue:132423.64},
		],
		tHeader:["Policy No.","Memo No.","Incept Date","Expiry Date","Effective Date","Premium","Commission","Premium Tax","Amount Due"],
		dataTypes: ["text","text","date","date","date","currency","currency","currency","currency"],
		uneditable: [true,true,true,true,true,true,true,true,true],
		tableOnly: true,
		pageStatus: true,
		pagination: true,
		pageLength: 15,
		total: [null,null,null,null,'TOTAL','premium','commission','premiumTax','amountDue'],
		pageID: 3
	}

	passDataSummary: any = {
		tableData: [
			{line:'CAR',premium:703397.88,commission:211019,premiumTax:25332.33,amountDue:467056.17},
			{line:'CEC',premium:156150.64,commission:46845.20,premiumTax:5621.43,amountDue:103684.01},
			{line:'EEI',premium:19909.84,commission:4289,premiumTax:1037.97,amountDue:14299.09},
			{line:'MBI',premium:212833.18,commission:63849.95,premiumTax:7661.99,amountDue:141321.24},
		],
		tHeader:["Line","Premium","Commission","Premium Tax","Amount Due"],
		dataTypes: ["text","currency","currency","currency","currency"],
		total: ['TOTAL','premium','commission','premiumTax','amountDue'],
		tableOnly: true,
		pageStatus: true,
		pagination: true,
		pageLength: 10,
		pageID: 4,
		uneditable:[true,true,true,true,true]
	}

    passDataViewRemittances: any = {
		tableData: [
			{tranType:'AR',tranNo:"00372890",tranDate:new Date("12-02-2018"),paymentType:"Inward Policy Balance",payee:"AFPGEN",particulars:"Payment for",amount:100000},
			{tranType:'AR',tranNo:"00373244",tranDate:new Date("12-03-2018"),paymentType:"Inward Policy Balance",payee:"AUII",particulars:"Payment for",amount:50000},
			{tranType:'AR',tranNo:"00372890",tranDate:new Date("12-04-2018"),paymentType:"Negative Treaty Balance",payee:"ALLIED",particulars:"Payment for",amount:250000},
			{tranType:'AR',tranNo:"00372890",tranDate:new Date("12-5-2018"),paymentType:"Negative Treaty Balance",payee:"UCPBGEN",particulars:"Payment for",amount:100000},
			{tranType:'CV',tranNo:"2018-003892",tranDate:new Date("12-5-2018"),paymentType:"Treaty Balance Due Participant",payee:"UCPBGEN",particulars:"Payment for",amount:100000},
			{tranType:'CV',tranNo:"2018-003893",tranDate:new Date("12-5-2018"),paymentType:"Treaty Balance Due Participant",payee:"ALLIED",particulars:"Payment for",amount:250000},
			{tranType:'CV',tranNo:"2018-003894",tranDate:new Date("12-5-2018"),paymentType:"Inward Policy Balances",payee:"AUII",particulars:"Payment for",amount:50000},
		],
		tHeader:["Tran Type","Tran No.","Tran Date","Payment Type","Payee/Payor","Particulars","Amount"],
		dataTypes: ["text","text","date","text","text","text","currency"],
		total: [null,null,null,null,null,'TOTAL','amount'],
		tableOnly: true,
		pageStatus: true,
		pagination: true,
		pageLength: 10,
		pageID: 5,
		uneditable:[true,true,true,true,true],
		widths:[1,150,1,'auto','auto',200,200]
	}


  constructor(private titleService: Title, private modalService: NgbModal, private route: Router) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | QSOA Inquiry");
  }

  showModal(content) {
  	this.comStmt = true;
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  viewRemittances(){
  	this.comStmt = false;
  	this.receivables = false;
  	this.summary	= false;
  	this.remittances = true;
  }

  viewComStmt(){
  	this.comStmt = true;
  	this.receivables = false;
  	this.summary	= false;
  	this.remittances = false;
  }

  viewSummary(){
  	this.comStmt = false;
  	this.receivables = false;
  	this.summary	= true;	
  	this.remittances = false;
  }

   viewReceivables(){
  	this.comStmt = false;
  	this.receivables = true;
  	this.summary	= false;
  	this.remittances = false;
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.route.navigateByUrl('');
      } 
  }

}
