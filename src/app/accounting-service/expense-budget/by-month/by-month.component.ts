import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ExpenseBudget, ByMonth } from '@app/_models';
import { ExpenseBudgetByMonth } from '@app/_models';

@Component({
  selector: 'app-by-month',
  templateUrl: './by-month.component.html',
  styleUrls: ['./by-month.component.css']
})
export class ByMonthComponent implements OnInit {

/*<<<<<<< HEAD
  ByMonthData: any = {
  	tableData: this.accountingService.getByMonth(),
  	tHeader: ['AccountCode','AccountName','Total','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug',
  			  'Sep','Oct','Nov','Dec'],
  	dataTypes: ['text', 'text', 'currency', 'currency', 'currency', 'currency', 'currency', 
  				'currency', 'currency', 'currency', 'currency', 'currency', 'currency', 
  				'currency', 'currency'],
  	nData: new ByMonth(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	total: [ null, 'Total', 'total','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
  	genericBtn: 'Print',
    widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto',
    		 'auto','auto','auto','auto']
  }

  
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}



=======*/
   passData: any = {
    tableData: [],
    tHeader: [
        "Account Code","Account Name", "SL Type", "SL Name", "Total","Jan", "Feb", "Mar",
        "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ],
    dataTypes: [
            "text","text", "text","text", "currency", "currency","currency","currency",
            "currency","currency","currency","currency","currency","currency",
            "currency","currency","currency"
    ],
    total:[null,"TOTAL",null,null,'total','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
    magnifyingGlass: [],
    options: [],
    opts: [],
    nData: {},
    checkFlag: false,
    selectFlag: false,
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    infoFlag: true,
    searchFlag: true,
    pageLength: 15,
    widths: [],
    pagination: true,
    pageStatus: true,
    printBtn: false,
    filters: [
            {
                key: 'accountCd',
                title: 'Account Code',
                dataType: 'text'
            },
            {
                key: 'accountName',
                title: 'Account Name',
                dataType: 'text'
            },
            {
                key: 'jan',
                title: 'Jan',
                dataType: 'text'
            },
            {
                key: 'feb',
                title: 'Feb',
                dataType: 'text'
            },
            {
                key: 'mar',
                title: 'Mar',
                dataType: 'text'
            },
            {
                key: 'apr',
                title: 'Apr',
                dataType: 'text'
            },
            {
                key: 'may',
                title: 'May',
                dataType: 'text'
            },
            {
                key: 'jun',
                title: 'Jun',
                dataType: 'text'
            },
            {
                key: 'jul',
                title: 'Jul',
                dataType: 'text'
            },
            {
                key: 'aug',
                title: 'Aug',
                dataType: 'text'
            },
            {
                key: 'sep',
                title: 'Sep',
                dataType: 'text'
            },
            {
                key: 'oct',
                title: 'Oct',
                dataType: 'text'
            },
            {
                key: 'nov',
                title: 'Nov',
                dataType: 'text'
            },
            {
                key: 'dec',
                title: 'Dec',
                dataType: 'text'
            },
        ],
  };

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	//this.passData.tableData = this.accountingService.getListBudAccByMonth();
      this.passData.tableData = [
          new BudgetByMonth("5-01-01","Salaries, Bonuses, and Allowances", null, null, 18112500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-17","Official Rental, Light and Water", null, null, 10150000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-15","Transportation and Travel", null, null, 1682450, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-14","Stationary Supplies and Printing", null, null, 1444000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-11","Representation and Entertainment", null, null, 363500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-13","Postages, Telephone, and Cables", null, null, 425000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-18","Bank Charges", null, null, 360000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-06-01","SSS Contribution", null, null, 300000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-06-02","Pag-Ibig Contribution", null, null, 260000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-06-03","Philhealth Contribution", null, null, 21600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-05","Insurance Expenses", null, null, 103000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-09","Repairs and Maintenance", null, null, 1176000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-04","Membership Dues", null, null, 210000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-21","Taxes and Licenses", null, null, 81700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-20","Directors' Fees", null, null, 289700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-19-01","Depreciation of Electronic Equipment", 'Electronic Equipment', 'Copier', 1120000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-19-01","Depreciation of Electronic Equipment", 'Electronic Equipment', 'Computer', 151850, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-01-02","Depreciation of Transportation Equipment", 'Car', 'Fortuner', 6850, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-01-02","Depreciation of Transportation Equipment", 'Car', 'Toyota Altis', 215000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          new BudgetByMonth("5-01-01-02","Depreciation of Transportation Equipment", 'Car', 'Innova', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      ];
  }
  
}
/*>>>>>>> 978e0a86388844d0fc07436f2327abfe7de2467c*/

class BudgetByMonth{
  accountCd: string;
  accountName: string;
  slType: string;
  slName: string;
  total: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;

  constructor(
    accountCd: string,
    accountName: string,
    slType: string,
    slName: string,
    total: number,
    jan: number,
    feb: number,
    mar: number,
    apr: number,
    may: number,
    jun: number,
    jul: number,
    aug: number,
    sep: number,
    oct: number,
    nov: number,
    dec: number
    )
  {
      this.accountCd = accountCd;
      this.accountName = accountName;
      this.slType = slType;
      this.slName = slName;
      this.total = total;
      this.jan = jan;
      this.feb = feb;
      this.mar = mar;
      this.apr = apr;
      this.may = may;
      this.jun = jun;
      this.jul = jul;
      this.aug = aug;
      this.sep = sep;
      this.oct = oct;
      this.nov = nov;
      this.dec = dec;
  }
}
