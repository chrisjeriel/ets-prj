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
    tHeader: ['Soa No','Policy No.','Co. Ref No.','Inst No.', 'Type', 'Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','Charges','Net Due','Payments','Balance',"Overdue Interest"],
    resizable: [true, true, true, true, true, true, true, true, true,true,true,true,true,true,true,true],
    dataTypes: ['text','text','text','number','text','date','date','text','percent','currency','percent','percent','currency','currency','currency','percent'],
    nData: new AccJvInPolBal(null,null,null,null,null,new Date(),new Date(),null,null,null,null,null,null,null,null,null),
    total:[null,null,null,null,null,null,null,null,'Total','premium','riComm','charges','netDue','payments','bal','overdueInt'],
    magnifyingGlass: ['soaNo','instNo'],
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
    genericBtn: 'Save'
  };




  constructor(private accountingService: AccountingService,private titleService: Title) { }

  ngOnInit() {

  	 this.titleService.setTitle(" Acct | JV | Inward Policy Balances");
  	this.passData.tableData = this.accountingService.getAccJVInPolBal();
  }

}
