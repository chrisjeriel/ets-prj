import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService } from '@app/_services';
import { TaxDetails, WTaxDetails } from '@app/_models';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.css']
})
export class UtilitiesComponent implements OnInit {
tableData: any[] = [];	

 passData: any = {
    tableData: [],
    tHeader: ['VAT Type','BIR RLF Purchase Type','Payor','Base Amount', 'VAT AMount'],
    resizable: [true, true, true, true, true],
    dataTypes: ['text','text','text','currency','currency'],
  	nData: new TaxDetails(null,null,null,null,null),
	total:[null,null,null,'Total','vatAmt'],
    checkFlag: false,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 3,
    width:['auto','auto',200,'auto','auto'],
    genericBtn: 'Save'
  };

   passDataWTax: any = {
    tableData: [],
    tHeader: ['Bill Tax Code','Description', 'WTax Rate','Payor','Base Amount', 'WTax AMount'],
    resizable: [true, true, true, true, true , true],
    dataTypes: ['text','text','percent','text','currency','currency'],
  	nData: new WTaxDetails(null,null,null,null,null,null),
	  total:[null,null,null,null,'Total','wTaxAmt'],
    checkFlag: false,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 3,
    width:[100,100,60,100,100,100],
    genericBtn: 'Save'
  };


  constructor(private accountingService: AccountingService,private titleService: Title,  private router: Router, private route: ActivatedRoute) { }

  exitLink: string;
  exitTab: string;
    sub: any;

  ngOnInit() {
  	this.titleService.setTitle(" Acct | Utilities | Edit Tax Details");
  	this.passData.tableData = this.accountingService.getTaxDetails();
  	this.passDataWTax.tableData = this.accountingService.getWTaxDetails();
		this.sub = this.route.params.subscribe(params => {
	      this.exitLink = params['link'] !== undefined ? params['link'] : 'adasdas';
	      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';
	    });
  }

  onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
  		} 
  
  }

}
