import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-premium-coll',
  templateUrl: './premium-coll.component.html',
  styleUrls: ['./premium-coll.component.css']
})
export class PremiumCollComponent implements OnInit {
  passData:any = {
  	tHeader:['Inst No', 'Due Date','Booking Date','Premium Amount','Comm Rate(%)','Comm Amount','Other Charges','Amount Due'],
  	dataTypes: ['number','date','date','currency','percentage','currency','currency','currency'],
  	tableData:[
  		[1,'2019-02-01','2019-02-28',22800,30,6840,200,16160],
  		[2,'2019-03-01','2019-03-31',22800,30,6840,200,16160],
  		[3,'2019-04-01','2019-04-30',22800,30,6840,200,16160],
  		[4,'2019-05-01','2019-05-31',22800,30,6840,200,16160],
  	],
  	uneditable:[true,true,true,true,true,true,true,true,],
  	total:[null,null,'Total','3',null,'5','6','7'],
  	pageLength: 5,
  	pageID: 'inst'
  }

  passData2:any = {
  	tHeader:['Reference No', 'Transaction Date','Premium Amount','Comm Amount','Other Charges','Collection Amount'],
  	dataTypes: ['text','date','currency','currency','currency','currency'],
  	tableData:[
  		['CAR-2019-00001-028-0001-000-01','2019-05-03',22800,6840,200,16160],
  	],
  	uneditable:[true,true,true,true,true,true,true,true,],
  	total:[null,'Total','2','3','4','5'],
  	pageLength: 5,
  	pageID: 'collection'
  }
  @ViewChild('instllmentTable') instTable:any;
  @ViewChild('collectionTable') collTable:any;
  constructor() { }

  ngOnInit() {
  	setTimeout(a=>{
  		this.instTable.refreshTable();
  		this.collTable.refreshTable();
  	},0)
  }

}
