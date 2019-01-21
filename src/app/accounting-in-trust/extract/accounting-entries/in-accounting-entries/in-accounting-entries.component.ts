import { Component, OnInit } from '@angular/core';
import { ExtractedData } from '@app/_models';

@Component({
  selector: 'app-in-accounting-entries',
  templateUrl: './in-accounting-entries.component.html',
  styleUrls: ['./in-accounting-entries.component.css']
})
export class InAccountingEntriesComponent implements OnInit {
  passData: any={
  	tHeader:['Date','Tran Type', 'Ref. No.', 'Code','Description', 'Particulars', 'SL Type', 'Status', 'Debit', 'Credit'],
  	dataTypes:['date','text','text','text','text','text','text','text','currency','currency'],
    total:[null,null,null,null,null,null,null,'Total','debit','credit'],
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
  constructor() { }

  ngOnInit() {
  	this.passData.tableData = [
  		new ExtractedData(new Date(),'tran','2018-00001','COD','Sample Description', 'Sample Particular', 'SL','Printed', 498431,4643213)
  	];
  }

}
