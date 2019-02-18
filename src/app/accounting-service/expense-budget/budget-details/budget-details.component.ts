import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ExpenseBudget } from '@app/_models';

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.css']
})
export class BudgetDetailsComponent implements OnInit {
/*<<<<<<< HEAD
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
=======*/

   passData: any = {
    tHeader: [
        "Budget Month","Account Code", "Account Name","SL Type", "SL Name", "Amount"
    ],
    resizable: [
            true,true, true, true, true, true
    ],
    dataTypes: [
            "date","text", "text", "text","text","currency"
    ],
    magnifyingGlass: [],
    options: [],
    opts: [],
    nData: {},
    checkFlag: false,
    selectFlag: false,
    addFlag: true,
    editFlag: true,
    deleteFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    widths: [],
    pagination: true,
    pageStatus: true,
    printBtn: false,
    filters: [
             {
                key: 'budMonth',
                title: 'Budget Month',
                dataType: 'date'
            },
            {
                key: 'accCode',
                title: 'Account Code',
                dataType: 'text'
            },
            {
                key: 'accName',
                title: 'Account Name',
                dataType: 'text'
            },
            {
                key: 'slType',
                title: 'SL Type',
                dataType: 'text'
            },
            {
                key: 'slName',
                title: 'SL Name',
                dataType: 'text'
            },
            {
                key: 'amount',
                title: 'Amount',
                dataType: 'text'
            },
        ],
  };

  constructor (private accountingService: AccountingService) { }

  ngOnInit() {
  		this.passData.tableData = this.accountingService.getListBudAcc();
  }
/*>>>>>>> 978e0a86388844d0fc07436f2327abfe7de2467c*/
  }


