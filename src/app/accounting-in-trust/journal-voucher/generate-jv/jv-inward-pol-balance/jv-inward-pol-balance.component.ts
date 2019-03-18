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
    tableData: this.accountingService.getAccJVInPolBal(),
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','Charges','Net Due','Payments','Balance',"Overdue Interest"],
    resizable: [true, true, true, true,true, true, true, true,true,true,true,true,true,true,true],
    dataTypes: ['text','text','text','number','date','date','text','percent','currency','percent','percent','currency','currency','currency','percent'],
    nData: new AccJvInPolBal(null,null,null,null,new Date(),new Date(),null,null,null,null,null,null,null,null,null),
    total:[null,null,null,null,null,null,null,'Total','premium','riComm','charges','netDue','payments','bal','overdueInt'],
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
    genericBtn: 'Save',
    widths: [180,180,120,50,1,1,1,85,120,85,85,120,120,120,120,85]
  };




  constructor(private accountingService: AccountingService,private titleService: Title) { }

  ngOnInit() {

  	 this.titleService.setTitle(" Acct | JV | Inward Policy Balances");
  }

}
