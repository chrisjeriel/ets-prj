
import { Title } from '@angular/platform-browser';
import { AccountingService } from '@app/_services';
import { Component, OnInit } from '@angular/core';
import { AccInvestments} from '@app/_models';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css']
})
export class InvestmentsComponent implements OnInit {

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];

   passData: any = {
   	 tableData: [
        {
          bank: 'BPI',
          certificateNo: 'BPI 1',
          investmentType: 'Time Deposit',
          maturityPeriod: 5,
          durUnit: 'Years',
          interestRate: 8.875,
          datePurchased: new Date('2013-10-20'),
          maturityDate: new Date('2018-10-20'),
          curr: 'PHP',
          currRate: 1,
          bankCharges: 18112.50,
          withholdingTax: 82250,
          investment: 14000000,
          investmentIncome: 4112500,
          maturityValue: 18112500
        },
        {
          bank: 'RCBC',
          certificateNo: 'RCBC 1',
          investmentType: 'Treatsury',
          maturityPeriod: 35,
          durUnit: 'Days',
          interestRate: 1.5,
          datePurchased: new Date('2018-09-26'),
          maturityDate: new Date('2018-10-31'),
          curr: 'PHP',
          currRate: 1,
          bankCharges: 10150,
          withholdingTax: 3000,
          investment: 10000000,
          investmentIncome: 150000,
          maturityValue: 10150000
        }
      ],
   	 tHeader: ["Bank","Certificate No.","Investment Type","Maturity Period","Duration Unit","Interest Rate","Date Purchased","Maturity Date","Curr","Curr Rate","Bank Charges","Withholding Tax","Investment","Investment Income","Maturity Value"],
   	 resizable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
   	 dataTypes: ['select','text','text','number','select','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
   	 nData: {
          bank: null,
          certificateNo: null,
          investmentType: null,
          maturityPeriod: null,
          durUnit: null,
          interestRate: null,
          datePurchased: null,
          maturityDate: null,
          curr: null,
          currRate: null,
          bankCharges: null,
          withholdingTax: null,
          investment: null,
          investmentIncome: null,
          maturityValue: null
        },
   	 total:[null,null,null,null,null,null,null,null,null,'Total','bankCharges','withholdingTax','investment','investmentIncome','maturityValue'],
     opts: [],
   	 addFlag: true,
   	 deleteFlag: true,
     searchFlag: true,
     infoFlag: true,
     paginateFlag: true,
     pageStatus: true,
     pagination: true,
     genericBtn: 'Save',
     pageLength: 15,

   };

  constructor(private accountingService: AccountingService,private titleService: Title,private router: Router) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Investments");
  	//this.passData.tableData = this.accountingService.getAccInvestments();
    this.passData.opts.push({ selector: "bank", vals: ["BPI", "RCBC", "BDO"] });
    this.passData.opts.push({ selector: "durUnit", vals: ["Years","Months","Weeks","Days"] });

  }

  onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('');
  		} 
  
  }


}
