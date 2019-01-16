import { Component, OnInit } from '@angular/core';

import { AmountDetailsCV } from '@app/_models';

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
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {

  }

}
