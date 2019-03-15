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
    tableData: this.accountingService.getAccJvInPolBalAgainstLoss(),
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','Charges','Net Due','Payments','Balance',"Overdue Interest","Actual Payment"],
    resizable: [true, true, true, true, true, true, true, true, true,true,true,true,true,true,true,true],
    dataTypes: ['text','text','text','number','date','date','text','percent','currency','percent','percent','currency','currency','currency','currency','currency'],
    nData: new AccJvInPolBalAgainstLoss(null,null,null,null,new Date(),new Date(),null,null,null,null,null,null,null,null,null,null),
    total:[null,null,null,null,null,null,null,'Total','premium','riComm','charges','netDue','payments','bal','overdueInt','actualPayment'],
    magnifyingGlass: ['soaNo','polNo','instNo'],
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
    pageLength: 5,
    genericBtn: 'Save',
    widths: [180,180,200,1,1,1,1,80,120,80,80,120,120,120,80,120],
    pageID: 2,
  };

  AgainstLossData: any = {
  	tableData: this.accountingService.getClaimLosses(),
  	tHeader: ['Claim No', 'Payment For/To', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Curr','Curr Rate', 'Reserve Amount','Amount','Amount (Php)'],
  	dataTypes: ['text', 'text', 'text', 'number', 'text', 'checkbox', 'text', 'percent', 'currency', 'currency', 'currency'],
  	nData: new AgainstLoss(null,null,null,null,null,null,null,null,null,null,null),
    magnifyingGlass: ['claimNo'],
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null,null, null, null,null, null,'Total',null, 'amount', 'amountPhp'],
  	genericBtn: 'Save',
    widths: [150,200,200,1,1,1,1,85,120,120,120],
    pageLength: 5,
  }

  constructor(private accountingService: AccountingService,private titleService: Title) { }

  ngOnInit() {
  }

}
