import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ExpenseBudget } from '@app/_models';

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.css']
})
export class BudgetDetailsComponent implements OnInit {
  ExpenseBudgetData: any = {
  	tableData: this.accountingService.getExpenseBudget(),
  	tHeader: ['Budegt Month', 'Account Code', 'Account Name', 'SL Type', 'SL Name', 'Amount'],
  	dataTypes: ['date', 'text', 'text', 'text', 'text','currency'],
  	nData: new ExpenseBudget(null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	addFlag: true,
  	deleteFlag: true,
  	total: [ null,null, null, null, 'Total', 'amount'],
  	genericBtn: 'Save',
    widths: ['auto','auto','auto','auto','auto','auto']
  }
  
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
