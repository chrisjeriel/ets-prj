import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { NotesService } from '@app/_services';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';


@Component({
  selector: 'app-profit-commission',
  templateUrl: './profit-commission.component.html',
  styleUrls: ['./profit-commission.component.css']
})
export class ProfitCommissionComponent implements OnInit {
	@ViewChild("cedingComp") cedingCoLOV: CedingCompanyComponent;

    yearList: any[] = [];
    monthList: any[] = [ 'January',
    					 'February',
    					 'March',
    					 'April',
    					 'May',
    					 'June',
    					 'July',
    					 'August',
    					 'September',
    					 'October',
    					 'November',
    					 'December']
    yearCd: any;
    monthCd: any;
    cedingDesc: any = '';
	income1: any = 0;
	income2: any = 9481348.73;
	outgo1: any = 404777.58;
	outgo2: any = 9481348.73;

	passDataProfitCommissionStatement:any = {
		tableData: [
			{particulars:'NET PREMIUM WRITTEN-QUOTA***',actual:6956320.12,natCat:2676548.84,income:4279771.28,outGo:null},
			{particulars:'OUTSTANDING CLAIMS-NRE-12.31.2017',actual:9171380.97,natCat:5490199.52,income:3681181.45,outGo:null},
			{particulars:'40% OF UNEXPIRED RISKS FROM PREVIOS YEAR-RELEASED',actual:2467471.62,natCat:947075.62,income:1520396,outGo:null},
			{particulars:'UNEARNED AT 12.31.2018-HELD',actual:2782528.11,natCat:1070619.53,income:null,outGo:1711908.58},
			{particulars:'LOSSES PAID-NRE-12.31.2018',actual:1294962.30,natCat:916852.41,income:null,outGo:378109.89},
			{particulars:'OUSTANDING CLAIMS-NRE-12.31.2018',actual:10300005.51,natCat:6054630.86,income:null,outGo:4245374.65},
			{particulars:'ORIGINAL EXPENSES:',actual:null,natCat:null,income:null,outGo:null},
			{particulars:'POOL EXPENSES-QUOTA(W/ RMC)',actual:null,natCat:null,income:null,outGo:779640.71},
			{particulars:'AGENCY & GENERAL EXPENSES-QUOTA***',actual:1912105.52,natCat:733617.15,income:null,outGo:1178488.37},
			{particulars:'VAT ON COMMISSION***',actual:228893.76,natCat:87810.50,income:null,outGo:141083.26},
			{particulars:'MANAGEMENT EXPENSES:',actual:null,natCat:null,income:null,outGo:null},
			{particulars:'15% OF 4,279,771.28',actual:null,natCat:null,income:null,outGo:641965.69},
		],
		tHeader: ["Particulars","Actual","Nat Cat","INCOME","OUTGO"],
		dataTypes:["text","currency","currency","currency","currency"],
		total: [null,null,null,'income','outGo'],
		pageLength: 12,
		uneditable: [true,true,true,true,true],
		widths:[270,120,120,120,120]
	}

  constructor(private route: Router, private titleService: Title, private ns: NotesService,) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Profit Commission Statement");
  	this.getYearList();
  }

	onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.route.navigateByUrl('');
      } 
  	}

  	getYearList(){
  		for (let i = 0; i<100; i++){
  			this.yearList.push(2000 + i);
  		}
  	}

  	showCedCompLOV(){
  	  this.cedingCoLOV.modal.openNoClose();
  	}

  	setSelectedCedComp(data){
  	  this.cedingDesc = data.cedingName;
  	  this.ns.lovLoader(data.ev, 0);
  	}

  	checkCode(event){
  		this.ns.lovLoader(event, 1);
        this.cedingCoLOV.checkCode(this.cedingDesc, event);
  	}
}
