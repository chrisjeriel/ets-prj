import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { AROthers } from '@app/_models';

@Component({
  selector: 'app-ar-others',
  templateUrl: './ar-others.component.html',
  styleUrls: ['./ar-others.component.css']
})
export class ArOthersComponent implements OnInit {

  passDataArOthers: any = {
  	tableData: [],
    tHeader: ["Item","Reference No.","Description", "Type", "Curr", "Curr Rate","Amount","Amount(PHP)"],
    dataTypes: ["text", "text","text", "select","text", "percent","currency","currency"],
    resizable: [true, true,true, true, true, true, true, true],
    nData: new AROthers(null,null,null,null,null,null,null,null),
    total:[null,null,null,null,null,'Total','amount','amountPHP'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [220,'auto','auto',120,1,50,100,150],
    paginateFlag:true,
    infoFlag:true,
    opts:[
          {
            selector: 'type',
            vals: ['Payment','Refund']
          }
    ]
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passDataArOthers.tableData = this.accountingService.getAROthers();
  }
  }

