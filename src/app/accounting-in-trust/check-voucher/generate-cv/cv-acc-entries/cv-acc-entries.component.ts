import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { AccountingEntriesCV } from '@app/_models';

@Component({
  selector: 'app-cv-acc-entries',
  templateUrl: './cv-acc-entries.component.html',
  styleUrls: ['./cv-acc-entries.component.css']
})
export class CvAccEntriesComponent implements OnInit {

  accountingEntriesData: any = {
  	tableData: this.accountingService.getAccountingEntriesCV(),
  	tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
  	widths:['auto','auto',80,'auto',120,120],
  	dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
  	nData: new AccountingEntriesCV(null,null,null,null,null,null),
  	pageID: 2,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null, 'Total', null, null],
  	genericBtn: 'Save'
  }

  constructor(private accountingService : AccountingService) { }

  ngOnInit() {
  }

}
