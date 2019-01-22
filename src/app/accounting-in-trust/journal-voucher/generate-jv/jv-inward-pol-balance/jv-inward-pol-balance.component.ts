import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInPolBal} from '@app/_models';

@Component({
  selector: 'app-jv-inward-pol-balance',
  templateUrl: './jv-inward-pol-balance.component.html',
  styleUrls: ['./jv-inward-pol-balance.component.css']
})
export class JvInwardPolBalanceComponent implements OnInit {

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];


  passData: any = {
    tableData: [],
    tHeader: ['Policy No.','Inst No.','Due Date','Curr','Premium','RI Comm','Charges','Net Due','Payments',"Overdue Interest","Balance"],
    resizable: [true, true, true, true, true, true, true, true, true,true,true],
    dataTypes: ['text','text','date','text','currency','percent','percent','currency','currency','percent','currency'],
    nData: new AccJvInPolBal(null,null,new Date(),null,null,null,null,null,null,null,null),
    total:[null,null,'Total',null,'premium','riComm','charges','netDue','payments','overdueInt','bal'],
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
    widths: [180,50,'auto',60,'auto','auto','auto','auto','auto','auto','auto'],
    genericBtn: 'Save'
  };




  constructor(private accountingService: AccountingService,private titleService: Title) { }

  ngOnInit() {

  	 this.titleService.setTitle(" Acct | JV | Inward Policy Balances");
  	this.passData.tableData = this.accountingService.getAccJVInPolBal();
  }

}
