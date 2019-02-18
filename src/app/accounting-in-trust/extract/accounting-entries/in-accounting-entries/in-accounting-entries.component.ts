import { Component, OnInit } from '@angular/core';
import { ExtractedData } from '@app/_models';

@Component({
  selector: 'app-in-accounting-entries',
  templateUrl: './in-accounting-entries.component.html',
  styleUrls: ['./in-accounting-entries.component.css']
})
export class InAccountingEntriesComponent implements OnInit {
  passData: any={
  	tHeader:['Date','Tran Type', 'Ref. No.', 'Account Code','Account Name', 'Particulars', 'SL Type','SL Name', 'Status', 'Debit', 'Credit'],
  	dataTypes:['date','text','text','text','text','text','text','text','text','currency','currency'],
    total:[null,null,null,null,null,null,null,null,'Total','debit','credit'],
    uneditable:[true,true,true,true,true,true,true,true,true,true],
  	searchFlag: true,
  	// filters:[
  	// 	{}
  	// ],
  	paginateFlag:true,
  	infoFlag:true,
  	tableData:[],
  	pageLength: 15
  }
  dateExtracted: string;
  constructor() { }

  ngOnInit() {
  	this.passData.tableData = [
  		new ExtractedData(new Date(2018,11,2),'AR','2018-00372890','1-01-03-01','BPI Savings Account No 0074-0073-92', 'Payment for', null,null ,'New', 282883,282883),
      new ExtractedData(new Date(2018,11,25),'CV','2018-00372900','1-01-03-01','BPI Savings Account No 0074-0073-92', 'Payment for', null,null ,'New', 193039,193039),
      new ExtractedData(new Date(2019,0,21),'JV','2018-00000093','1-01-03-01','BPI Savings Account No 0074-0073-92', 'Payment for', null,null ,'New', 1500000,1500000),

  	];
    this.dateExtracted = new Date().toISOString().slice(0, 16);
  }

}
