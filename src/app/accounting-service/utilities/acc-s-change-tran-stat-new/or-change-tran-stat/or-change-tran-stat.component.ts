import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';


@Component({
  selector: 'app-or-change-tran-stat',
  templateUrl: './or-change-tran-stat.component.html',
  styleUrls: ['./or-change-tran-stat.component.css']
})
export class OrChangeTranStatComponent implements OnInit {

  dateCreated:string;
  lastUpdate:string;

  orData: any = {
		tableData:[],
		tHeader:['OR No.','Payor', 'OR Date', 'Payment Type','Status', 'Particulars', 'Amount'],
		dataTypes:['right','text','date','text','text','text','currency'],
		pageStatus:true,
		pagination:true,
		checkFlag:true,
		pageLength: 10,
		colSize:['1px','300px','1px','1px','1px','','105px'],
	    filters:[
	          {
	              key: 'orNo',
	              title:'O.R. No.',
	              dataType: 'text'
	          },
	          {
	              key: 'payor',
	              title:'Payor',
	              dataType: 'text'
	          },
	          {
	              key: 'orDate',
	              title:'AR Date',
	              dataType: 'datespan'
	          },
	          {
	              key: 'paymentType',
	              title:'Payment Type',
	              dataType: 'text'
	          },
	          {
	              key: 'status',
	              title:'Status',
	              dataType: 'text'
	          },
	          {
	              key: 'particulars',
	              title:'Particulars',
	              dataType: 'text'
	          },
	          {
	              key: 'amount',
	              title:'Amount',
	              dataType: 'text'
	          },
	        ]
	}

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.orData.tableData = this.accountingService.getAccSChangeTranStatOR();
  	this.dateCreated = new Date(2018,10,1).toISOString().slice(0, 16);
    this.lastUpdate = new Date().toISOString().slice(0, 16);
  }

}
