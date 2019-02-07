import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ExpenseBudget } from '@app/_models';


@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.css']
})
export class BudgetDetailsComponent implements OnInit {

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
  }

}
