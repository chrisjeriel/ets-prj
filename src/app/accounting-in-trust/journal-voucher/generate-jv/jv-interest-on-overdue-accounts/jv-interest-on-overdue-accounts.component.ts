import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInterestOverdue} from '@app/_models';

@Component({
  selector: 'app-jv-interest-on-overdue-accounts',
  templateUrl: './jv-interest-on-overdue-accounts.component.html',
  styleUrls: ['./jv-interest-on-overdue-accounts.component.css']
})


export class JvInterestOnOverdueAccountsComponent implements OnInit {
  
  passData: any = {
    tableData: this.accountingService.getAccJVInterestOverdue(),
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.', 'Eff Date','Due Date','No. of Days Overdue','Curr','Curr Rate','Premium',"Overdue Interest"],
    resizable: [true, true, true, true, true, true, true, true, true,true,true],
    dataTypes: ['text','text','text','number','date','date','number','text','percent','currency','currency'],
    nData: new AccJvInterestOverdue(null,null,null,null,new Date(),new Date(),null,null,null,null,null),
    total:[null,null,null,null,null,null,null,null,'Total','prenium','overdueInt'],
    magnifyingGlass: ['soaNo','policyNo'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    saveBtn: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 10,
    genericBtn: 'Save',
    widths: [180,180,120,1,1,1,1,1,85,120,120]
  };

  constructor(private accountingService: AccountingService,private titleService: Title) { }

  ngOnInit() {
  }

}
