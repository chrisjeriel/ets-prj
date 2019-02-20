import { Component, OnInit } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profit-commission',
  templateUrl: './profit-commission.component.html',
  styleUrls: ['./profit-commission.component.css']
})
export class ProfitCommissionComponent implements OnInit {

	passDataProfitCommissionStatement:any = {
		tableData: [
			{particulars:'NET PREMIUM WRITTEN-QUOTA***',actual:6956320.12,natCat:2676548.84,income:4279771.28,outGo:null},
			{particulars:'OUTSTANDING CLAIMS-NRE-12.31.2017',actual:9171380.97,natCat:5490199.52,income:3681181.45,outGo:null},
			{particulars:'40% OF UNEXPIRED RISKS FROM PREVIOS YEAR-RELEASED',actual:2467471.62,natCat:947075.62,income:1520396,outGo:null},
			{particulars:'UNEARNED AT 12.31.2018-HELD',actual:2782528.11,natCat:1070619.53,income:null,outGo:1711908.58},
			{particulars:'LOSSES PAID-NRE-12.31.2018',actual:1294962.30,natCat:916852.41,income:null,outGo:378109.89},
			{particulars:'OUSTANDING CLAIMS-NRE-12.31.2018',actual:10300005.51,natCat:6054630.86,income:null,outGo:4245374.65},
			{particulars:'ORIGINAL EXPENSES:',actual:null,natCat:null,income:null,outGo:null},
			{particulars:'    POOL EXPENSES-QUOTA(W/ RMC)',actual:null,natCat:null,income:null,outGo:779640.71},
			{particulars:'	  AGENCY & GENERAL EXPENSES-QUOTA***',actual:1912105.52,natCat:733617.15,income:null,outGo:1178488.37},
			{particulars:'	  VAT ON COMMISSION***',actual:228893.76,natCat:87810.50,income:null,outGo:141083.26},
			{particulars:'MANAGEMENT EXPENSES:',actual:null,natCat:null,income:null,outGo:null},
			{particulars:'	  15% OF 4,279,771.28',actual:null,natCat:null,income:null,outGo:641965.69},
		],
		tHeader: ["Particulars","Actual","Nat Cat","INCOME","OUTGO"],
		dataTypes:["text","currency","currency","currency","currency"],
		total: [null,null,null,'income','outGo'],
		pageLength: 12,
		uneditable: [true,true,true,true,true],
		widths:['auto',200,200,200,200]
	}

  constructor(private route: Router, private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Profit Commission Statement");
  }

	onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.route.navigateByUrl('');
      } 
  	}
}
