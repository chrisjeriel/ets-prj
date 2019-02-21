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
/*<<<<<<< HEAD
    tHeader: ["Item","Reference No.","Description", "Type", "Curr", "Curr Rate","Amount","Amount(PHP)"],
    dataTypes: ["text", "text","text", "select","text", "percent","currency","currency"],
    resizable: [true, true,true, true, true, true, true, true],
=======*/
    tHeader: ["Item", "Reference No.", "Description", "Curr", "Curr Rate","Amount","Amount(PHP)"],
    dataTypes: ["text", "text", "text", "text", "percent","currency","currency"],
    resizable: [true, true, true, true, true, true, true],
/*>>>>>>> 175e99f85deab8a5e9768e8a21f93aff2ffc85be*/
    nData: new AROthers(null,null,null,null,null,null,null),
    total:[null,null,null,null,'Total','amount','amountPHP'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [230,'auto','auto',1,50,150,150],
    paginateFlag:true,
    infoFlag:true,
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passDataArOthers.tableData = this.accountingService.getAROthers();
  }
  }

