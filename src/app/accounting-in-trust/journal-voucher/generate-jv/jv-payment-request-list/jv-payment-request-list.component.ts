import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJVPayReqList} from '@app/_models';



@Component({
  selector: 'app-jv-payment-request-list',
  templateUrl: './jv-payment-request-list.component.html',
  styleUrls: ['./jv-payment-request-list.component.css']
})
export class JvPaymentRequestListComponent implements OnInit {

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];

  passData: any = {
    tableData: [],
    tHeader: ['Payment Request No.','Payee','Payment Type','Status','Request Date','Particulars','Requested By','Curr','Amount'],
    resizable: [true, true, true, true, true, true, true, true, true],
    dataTypes: ['text','text','text','text','date','text','text','text','currency'],
    nData: new AccJVPayReqList(null,null,null,null,new Date(),null,null,null,null),
    total:[null,null,null,null,null,null,'Total',null,'amount'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: true,
    saveBtn: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 10,
    widths: [100,200,'auto',70,40,200,150,42,'auto'],
    genericBtn: 'Save'
  };

  constructor(private accountingService: AccountingService,private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle(" Acct | JV | Payment Request List ");
  	this.passData.tableData = this.accountingService.getAccJVPayReqList();
  }

}
