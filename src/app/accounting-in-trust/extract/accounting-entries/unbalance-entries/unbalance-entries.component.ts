import { Component, OnInit } from '@angular/core';
import { UnbalanceEntries } from '@app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unbalance-entries',
  templateUrl: './unbalance-entries.component.html',
  styleUrls: ['./unbalance-entries.component.css']
})
export class UnbalanceEntriesComponent implements OnInit {
  passData: any ={
  	tableData: [],
  	tHeader: ['Tran Type', 'Ref. No.', 'Tran Date', 'Payee/Payor', 'Particulars', 'Status', 'Tran ID', 'Total Debit', 'Total Credit', 'Variance'],
  	dataTypes: ['text','text','date','text','text','text','sequence-8','currency','currency','currency'],
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

  constructor( private route: Router) { }

  ngOnInit() {
  	this.passData.tableData = [
  		new UnbalanceEntries('AR','2018-00372890',new Date(2018,11,2),'UCPBGEN','Payment for','New',282883,29930,29900,30),
      new UnbalanceEntries('CV','2018-00372900',new Date(2018,11,25),'BPI/MS','Payment for','New',282883,193038.99,193039,0.01),
      new UnbalanceEntries('JV','2018-00000093',new Date(2019,0,21),'SM PRIME HOLDINGS','Payment for','New',283000,1525850,1500000,25850)
    
  	]
  }

  onRowClick(data){
    this.tranType = data.tranType;
  }

  viewTranDetails(){
    if(this.tranType == 'AR'){
      this.route.navigate(['accounting-in-trust',{link:'/accounting-entries',tab:'Unbalance'}],{ skipLocationChange: true });
    }else if(this.tranType == 'CV'){
      this.route.navigate(['generate-cv',{link:'/accounting-entries',tab:'Unbalance'}],{ skipLocationChange: true });
    }else if(this.tranType == 'JV'){
      this.route.navigate(['generate-jv',{link:'/accounting-entries',tab:'Unbalance'}],{ skipLocationChange: true });
    }else{
      //do something
    }
  }
}
