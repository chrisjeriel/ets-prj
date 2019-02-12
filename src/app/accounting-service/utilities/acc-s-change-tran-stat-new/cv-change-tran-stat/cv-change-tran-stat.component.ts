import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-cv-change-tran-stat',
  templateUrl: './cv-change-tran-stat.component.html',
  styleUrls: ['./cv-change-tran-stat.component.css']
})
export class CvChangeTranStatComponent implements OnInit {

  cvData: any = {
  	tableData:[],
  	tHeader:['CV No.','Payee','CV Date', 'Status', 'Particulars', 'Amount'],
  	dataTypes:['text','text','date','text','text','currency'],
  	pageStatus:true,
  	pagination:true,
  	checkFlag:true,
  	pageLength: 10,
  	colSize:['1px','','1px','1px','','105px'],
    filters:[
      {
          key: 'cvNo',
          title:'CV No.',
          dataType: 'text'
      },
      {
          key: 'payee',
          title:'Payee',
          dataType: 'text'
      },
      {
          key: 'cvDate',
          title:'CV Date',
          dataType: 'datespan'
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


  dateCreated:string;
  lastUpdate:string;

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.cvData.tableData = this.accountingService.getAccSChangeTranStatCV();
  	this.dateCreated = new Date(2018,10,1).toISOString().slice(0, 16);
    this.lastUpdate = new Date().toISOString().slice(0, 16);
  }

}
