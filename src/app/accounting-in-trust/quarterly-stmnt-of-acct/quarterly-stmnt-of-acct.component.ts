import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quarterly-stmnt-of-acct',
  templateUrl: './quarterly-stmnt-of-acct.component.html',
  styleUrls: ['./quarterly-stmnt-of-acct.component.css']
})
export class QuarterlyStmntOfAcctComponent implements OnInit {

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
			{particulars: 'PREMIUMS',referenceNo: '',breakdownAmount: 2204840.49,debit: null,credit: null},
			{particulars: 'Less: Returns',referenceNo: '',breakdownAmount: 29095.37,debit: null,credit: 2175745.12},
			{particulars: 'COMMISSIONS',referenceNo: '',breakdownAmount: 583237.96,debit: null,credit: null},
			{particulars: 'Less: Returns',referenceNo: '',breakdownAmount: 8719.97,debit: null,credit: -574517.99},
			{particulars: 'OTHER UNDERWRITING CHARGES',referenceNo: '',breakdownAmount: 69574.22,debit: null,credit: null},
			{particulars: 'Less: Returns',referenceNo: '',breakdownAmount: 1047.37,debit: null,credit: -68499.85},
			{particulars: 'LOSSES PAID',referenceNo: '',breakdownAmount: null,debit: null,credit: -307936.47},
			{particulars: 'INTEREST INCOME ON INVESTMENT (Net WHTax)',referenceNo: '',breakdownAmount: null,debit: null,credit: 3536.47},
			{particulars: 'INTEREST ON SAVINGS (Net WHTax)',referenceNo: '',breakdownAmount: null,debit: null,credit: 174.93},
			{particulars: 'INTEREST EXPENSES ON PREMIUM RESERVE RELEASED for the 1st Quarter 2018',referenceNo: '',breakdownAmount: null,debit: null,credit: -18315.12},
			{particulars: 'ACCOUNTS RECEIVABLE',referenceNo: '',breakdownAmount: null,debit: 736563.02,credit: null},
			{particulars: 'Less: Returns',referenceNo: '',breakdownAmount: null,debit: -24502.60,credit: null},
			{particulars: 'Service Fee',referenceNo: 'OR-016312',breakdownAmount: -66927.94,debit: null,credit: -66927.94},
			{particulars: 'Miscellaneous Charges',referenceNo: '',breakdownAmount: null,debit: null,credit: -12298.52},
			{particulars: 'Excess of Loss 2018 Min. Deposit-1st Installment',referenceNo: '',breakdownAmount: null,debit: null,credit: -212500.63},
			{particulars: 'Gain on Foreign Exchange',referenceNo: '',breakdownAmount: null,debit: null,credit: 3.78},
			{particulars: 'Remittances',referenceNo: 'AR-000264',breakdownAmount: -68535.60,debit: null,credit: null},
			{particulars: '',referenceNo: 'AR-000264',breakdownAmount: -78399.92,debit: -146935.52,credit: null},
		],
		tHeader:["Particulars","Reference No.","Breakdown Amount","DEBIT","CREDIT"],
		dataTypes: ["text","text","currency","currency","currency"],
		uneditable: [true,true,true,true,true],
		total: [null,'TOTAL',null,'debit','credit'],
		pageLength: 20,
		widths: ['auto',80,120,120,120],
		pageID:2
	}

  constructor(private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | QSOA Inquiry");
  }

  showModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

}
