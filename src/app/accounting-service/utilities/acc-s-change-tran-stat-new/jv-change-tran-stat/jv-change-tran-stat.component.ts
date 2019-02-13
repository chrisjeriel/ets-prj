import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-jv-change-tran-stat',
  templateUrl: './jv-change-tran-stat.component.html',
  styleUrls: ['./jv-change-tran-stat.component.css']
})
export class JvChangeTranStatComponent implements OnInit {

  	jvData: any = {
  		tableData:[],
  		tHeader:['JV No.','JV Date', 'Particulars', 'JV Type','JV Ref. No', 'Prepared By','JV Status', 'Amount'],
  		dataTypes:['text','date','text','text','text','text','text','currency'],
  		pageStatus:true,
  		pagination:true,
  		checkFlag:true,
  		colSize:['1px','1px','','1px','1px','1px','1px','105px'],
  	    filters:[
  	      {
  	          key: 'jvNo',
  	          title:'JV No.',
  	          dataType: 'text'
  	      },
  	      {
  	          key: 'jvDate',
  	          title:'JV Date',
  	          dataType: 'datespan'
  	      },
  	      {
  	          key: 'particulars',
  	          title:'Particulars',
  	          dataType: 'text'
  	      },
  	      {
  	          key: 'jvType',
  	          title:'JV Type',
  	          dataType: 'text'
  	      },
  	      {
  	          key: 'jvRefNo',
  	          title:'JV Ref. No',
  	          dataType: 'text'
  	      },
  	      {
  	          key: 'preparedBy',
  	          title:'Prepared By',
  	          dataType: 'text'
  	      },
  	      {
  	          key: 'jvStatus',
  	          title:'JV Status',
  	          dataType: 'text'
  	      },
  	      {
  	          key: 'amount',
  	          title:'Amount',
  	          dataType: 'text'
  	      },
      	]
  	}

  dateCreated:string;
  lastUpdate:string;

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.jvData.tableData = this.accountingService.getAccSChangeTranStatJV();
  	this.dateCreated = new Date(2018,10,1).toISOString().slice(0, 16);
    this.lastUpdate = new Date().toISOString().slice(0, 16);
  }

}
