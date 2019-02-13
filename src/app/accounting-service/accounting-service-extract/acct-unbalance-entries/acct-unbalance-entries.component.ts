import { Component, OnInit } from '@angular/core';
import { UnbalanceEntries } from '@app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acct-unbalance-entries',
  templateUrl: './acct-unbalance-entries.component.html',
  styleUrls: ['./acct-unbalance-entries.component.css']
})
export class AcctUnbalanceEntriesComponent implements OnInit {

passData: any ={
  	tableData: [],
  	tHeader: ['Tran Type', 'Ref. No.', 'Tran Date', 'Payee/Payor', 'Particulars', 'Status',  'Total Debit', 'Total Credit', 'Variance'],
    colSize: ['1px','1px','1px','auto','auto','1px','150px','150px','150px'],
  	dataTypes: ['text','text','date','text','text','text','currency','currency','currency'],
  	pagination: true,
  	pageStatus: true,
  	filters:[
  		{
  			key:'tranType',
  			title:'Tran Type',
  			dataType: 'text'
  		},
  		{
  			key:'refNo',
  			title:'Ref. No.',
  			dataType: 'text'
  		},
  		{
  			key:'tranDate',
  			title:'Tran Date',
  			dataType: 'datespan'
  		},
  		{
  			key:'payeePayor',
  			title:'Payee/Payor',
  			dataType: 'text'
  		},
  		{
  			key:'particulars',
  			title:'Particulars',
  			dataType: 'text'
  		},
  		{
  			key:'status',
  			title:'Status',
  			dataType: 'text'
  		},
  	],
  	pageLength: 14

  }
  tranType:string;
  dateExtracted:string;
  periodFrom: string;
  periodTo: string;
  constructor( private route: Router) { }

  ngOnInit() {
  	this.passData.tableData = [
  	  new UnbalanceEntries('OR','2018-00372890',new Date(2018,11,2),'UCPBGEN','Payment for','New',29930,29900,30),
      new UnbalanceEntries('CV','2018-00372900',new Date(2018,11,25),'BPI/MS','Payment for','New',193038.99,193039,0.01),
      new UnbalanceEntries('JV','2018-00000093',new Date(2019,0,21),'SM PRIME HOLDINGS','Payment for','New',1525850,1500000,25850)
  	];
    this.dateExtracted = new Date().toISOString().slice(0, 16);
    this.periodFrom = '2018-12-01';
    this.periodTo = '2018-12-31';
  }

  onRowClick(data){
    this.tranType = data.tranType;
  }

  viewTranDetails(){
    if(this.tranType == 'OR'){
      this.route.navigate(['accounting-service',{link:'/accounting-service-extract',tab:'Unbalance'}],{ skipLocationChange: true });
    }else if(this.tranType == 'CV'){
      this.route.navigate(['generate-cv-service',{link:'/accounting-service-extract',tab:'Unbalance'}],{ skipLocationChange: true });
    }else if(this.tranType == 'JV'){
      this.route.navigate(['generate-jv-service',{link:'/accounting-service-extract',tab:'Unbalance'}],{ skipLocationChange: true });
    }else{
      //do something
    }
  }
}
