import { Component, OnInit } from '@angular/core';

import { AmountDetailsCV, AccountingEntriesCV } from '@app/_models';

import { AccountingService } from '../../../../_services/accounting.service';

@Component({
  selector: 'app-cv-details',
  templateUrl: './cv-details.component.html',
  styleUrls: ['./cv-details.component.css']
})
export class CvDetailsComponent implements OnInit {

  amountDetailsData: any = {
  	tableData: this.accountingService.getAmountDetailsCV(),
  	tHeader: ['Detail', 'Amount', 'Amount (PHP)', 'Plus/Minus', 'Amount Plus/Minus'],
  	dataTypes: ['text', 'currency', 'currency', 'text', 'currency'],
  	nData: new AmountDetailsCV(null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null, 'Total', 'amountPlusMinus'],
  	genericBtn: 'Save'
  }

  accountingEntriesData: any = {
  	tableData: this.accountingService.getAccountingEntriesCV(),
  	tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
  	dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
  	nData: new AccountingEntriesCV(null,null,null,null,null,null),
  	pageID: 2,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null, 'Total', null, null],
  	genericBtn: 'Save',
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {

  }

}
