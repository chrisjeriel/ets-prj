import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInPolBalAgainstLoss, AgainstLoss } from '@app/_models';

@Component({
  selector: 'app-jv-offsetting-against-losses',
  templateUrl: './jv-offsetting-against-losses.component.html',
  styleUrls: ['./jv-offsetting-against-losses.component.css']
})
export class JvOffsettingAgainstLossesComponent implements OnInit {
  passData: any = {
    tableData: this.accountingService.getAccJVInPolBal(),
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.', 'Type', 'Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','Charges','Net Due','Payments','Balance',"Overdue Interest"],
    resizable: [true, true, true, true, true, true, true, true, true,true,true,true,true,true,true,true],
    dataTypes: ['text','text','text','number','text','date','date','text','percent','currency','percent','percent','currency','currency','currency','currency'],
    nData: new AccJvInPolBalAgainstLoss(null,null,null,null,new Date(),new Date(),null,null,null,null,null,null,null,null,null),
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
    genericBtn: 'Save',
    widths: [185,'auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto']
  };

  AgainstLossData: any = {
  	tableData: this.accountingService.getClaimLosses(),
  	tHeader: ['Claim No', 'Payment For/To', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Curr','Curr Rate', 'Reserve Amount','Amount','Amount (Php)'],
  	dataTypes: ['text', 'text', 'text', 'number', 'text', 'checkbox', 'text', 'percent', 'currency', 'currency', 'currency'],
  	nData: new AgainstLoss(null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null,null, null, null,null, null, null, 'Total', 'amount', 'amountPhp'],
  	genericBtn: 'Save',
    widths: ['auto','auto','auto',1,'auto',1,1,2,100,100,100]
  }

  constructor(private accountingService: AccountingService,private titleService: Title) { }

  ngOnInit() {
  }

}
