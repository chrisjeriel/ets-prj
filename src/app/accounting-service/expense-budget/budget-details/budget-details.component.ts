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
    tableData: [],
    tHeader: [
        "Account Code", "Account Name","SL Type", "SL Name", "Amount"
    ],
    resizable: [
            true, true, true, true, true
    ],
    dataTypes: [
            "text", "text", "text","text","currency"
    ],
    options: [],
    opts: [],
    nData: new BudgetForTheYear(null,null,null,null,null),
    selectFlag: false,
    addFlag: true,
    deleteFlag: true,
    checkFlag: true,
    searchFlag: true,
    pageLength: 15,
    widths: [117, 'auto', 'auto', 'auto', 125],
    paginateFlag: true,
    printBtn: false,
    filters: [
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
    total: [null,null,null,'TOTAL','amount'],
    magnifyingGlass: ['accountCd', 'slType', 'slName'],
  };

  constructor (private accountingService: AccountingService) { }

  ngOnInit() {
  		this.passData.tableData = [
          new BudgetForTheYear("5-01-01","Salaries, Bonuses, and Allowances", null, null, 18112500),
          new BudgetForTheYear("5-01-17","Official Rental, Light and Water", null, null, 10150000),
          new BudgetForTheYear("5-01-15","Transportation and Travel", null, null, 1682450),
          new BudgetForTheYear("5-01-14","Stationary Supplies and Printing", null, null, 1444000),
          new BudgetForTheYear("5-01-11","Representation and Entertainment", null, null, 363500),
          new BudgetForTheYear("5-01-13","Postages, Telephone, and Cables", null, null, 425000),
          new BudgetForTheYear("5-01-18","Bank Charges", null, null, 360000),
          new BudgetForTheYear("5-01-06-01","SSS Contribution", null, null, 300000),
          new BudgetForTheYear("5-01-06-02","Pag-Ibig Contribution", null, null, 260000),
          new BudgetForTheYear("5-01-06-03","Philhealth Contribution", null, null, 21600),
          new BudgetForTheYear("5-01-05","Insurance Expenses", null, null, 103000),
          new BudgetForTheYear("5-01-09","Repairs and Maintenance", null, null, 1176000),
          new BudgetForTheYear("5-01-04","Membership Dues", null, null, 210000),
          new BudgetForTheYear("5-01-21","Taxes and Licenses", null, null, 81700),
          new BudgetForTheYear("5-01-20","Directors' Fees", null, null, 289700),
          new BudgetForTheYear("5-01-19-01","Depreciation of Electronic Equipment", 'Electronic Equipment', 'Copier', 1120000),
          new BudgetForTheYear("5-01-19-01","Depreciation of Electronic Equipment", 'Electronic Equipment', 'Computer', 151850),
          new BudgetForTheYear("5-01-01-02","Depreciation of Transportation Equipment", 'Car', 'Fortuner', 6850),
          new BudgetForTheYear("5-01-01-02","Depreciation of Transportation Equipment", 'Car', 'Toyota Altis', 215000),
          new BudgetForTheYear("5-01-01-02","Depreciation of Transportation Equipment", 'Car', 'Innova', 0),
      ];
  }
/*>>>>>>> 978e0a86388844d0fc07436f2327abfe7de2467c*/
  }

  class BudgetForTheYear{
    accountCd: string;
    accountName: string;
    slType: string;
    slName: string;
    amount: number;

    constructor(
      accountCd: string,
      accountName: string,
      slType: string,
      slName: string,
      amount: number
      )
    {
        this.accountCd = accountCd;
        this.accountName = accountName;
        this.slType = slType;
        this.slName = slName;
        this.amount = amount;
    }
  }


