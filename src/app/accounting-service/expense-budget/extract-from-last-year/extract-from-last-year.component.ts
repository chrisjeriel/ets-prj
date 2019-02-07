import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ExpenseBudgetByMonth } from '@app/_models';

@Component({
  selector: 'app-extract-from-last-year',
  templateUrl: './extract-from-last-year.component.html',
  styleUrls: ['./extract-from-last-year.component.css']
})
export class ExtractFromLastYearComponent implements OnInit {

  passData: any = {
    tHeader: [
        "Account Code","Account Name", "Total","Jan", "Feb", "Mar",
        "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ],
    resizable: [
            true,true, true, true, true, true,
            true,true,true,true,true,true,true,true,true
    ],
    dataTypes: [
            "text","text", "currency", "currency","currency","currency",
            "currency","currency","currency","currency","currency","currency",
            "currency","currency","currency"
    ],
    total:[null,"Total",'total','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
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
    pageLength: 10,
    widths: [],
    pagination: true,
    pageStatus: true,
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
  	this.passData.tableData = this.accountingService.getListBudAccByMonth();
  }

}
	