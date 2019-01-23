
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
   	 tableData: [],
   	 tHeader: ["Bank","Account No.", "Maturity Period","Duration Unit","Interest Rate","Date Purchased","Maturity Date","Investment","Maturity Value"],
   	 resizable: [true, true, true, true, true, true, true, true, true],
   	 dataTypes: ['select','text','number','select','percent','date','date','currency','currency'],
   	 nData: new AccInvestments(null,null,null,null,null,new Date,new Date,null,null),
   	 total:[null,null,null,null,null,null,'Total','investment','matValue'],
     opts: [],
   	 addFlag: true,
   	 deleteFlag: true,
     searchFlag: true,
     infoFlag: true,
     paginateFlag: true,
     pageStatus: true,
     pagination: true,
     genericBtn: 'Save',
     pageLength: 10,
     widths: [100,150,70,70,100,80,150,150,'auto','auto'],

   };

  constructor(private accountingService: AccountingService,private titleService: Title,private router: Router) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Investments");
  	this.passData.tableData = this.accountingService.getAccInvestments();
    this.passData.opts.push({ selector: "bank", vals: ["BPI", "RCBC", "BDO"] });
    this.passData.opts.push({ selector: "durUnit", vals: ["Years","Months","Weeks","Days"] });

  }

  onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('');
  		} 
  
  }


}
