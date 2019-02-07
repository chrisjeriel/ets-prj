import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ExpenseBudget, ByMonth } from '@app/_models';

@Component({
  selector: 'app-by-month',
  templateUrl: './by-month.component.html',
  styleUrls: ['./by-month.component.css']
})
export class ByMonthComponent implements OnInit {

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



