import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pol-inq-claims',
  templateUrl: './pol-inq-claims.component.html',
  styleUrls: ['./pol-inq-claims.component.css']
})
export class PolInqClaimsComponent implements OnInit {

  constructor() { }
  passData:any = {
  	tHeader:['Claim No', 'Status','Creation Date','Loss Date','Currency','Total Reserve','Total Payment','Processed By'],
  	dataTypes: ['text','text','date','date','text','currency','currency','text'],
  	tableData:[
  		['CAR-2019-00001','In Progress','2019-02-28','2019-02-28','PHP',150000,0,'ESALUNSON'],
  	],
  	uneditable:[true,true,true,true,true,true,true,true,],
  	pageID: 'inst',
  	paginateFlag:true,
  	infoFlag:true
  }
  @ViewChild('claim') table:any;
  ngOnInit() {
  	setTimeout(a=>{this.table.refreshTable()},0);
  }

}
