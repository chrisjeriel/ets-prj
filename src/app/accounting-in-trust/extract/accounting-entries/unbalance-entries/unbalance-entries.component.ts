import { Component, OnInit } from '@angular/core';
import { UnbalanceEntries } from '@app/_models';

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

  constructor() { }

  ngOnInit() {
  	this.passData.tableData = [
  		new UnbalanceEntries('AR','2018-00372890',new Date(2018,11,2),'UCPBGEN','Payment for','New',282883,29930,29900,30)
  	]
  }

}
