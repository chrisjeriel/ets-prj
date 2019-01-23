import { Component, OnInit } from '@angular/core';
import { PremiumReturnList } from '@app/_models';
import { AccountingService } from '../../../../_services/accounting.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-premium-returns',
  templateUrl: './payment-premium-returns.component.html',
  styleUrls: ['./payment-premium-returns.component.css']
})
export class PaymentPremiumReturnsComponent implements OnInit {
  


PremiumReturn : any = {
    tableData: this.accountingService.getPremiumReturnList(),
    tHeader: ['Due Date', 'Ceding Company', 'Policy No', 'Premium', 'RI Commission','Charges','Curr','Net Due'],
    dataTypes: ['date', 'text', 'text', 'currency', 'currency', 'currency', 'text', 'currency'],
    nData: new PremiumReturnList(null,null,null,null,null,null,null,null),
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, 'Total', 'premium','riCommission','charges',null,'netDue'],
    widths:['auto',107,214,'auto','auto','auto',62,'auto'],
    genericBtn: 'Save'
  }

  constructor(private accountingService: AccountingService, private titleService: Title) { }
  	dateCreated:string;
  	lastUpdate:string;
  ngOnInit() {
  	this.dateCreated = new Date(2018,10,1).toISOString().slice(0, 16);
    this.lastUpdate = new Date().toISOString().slice(0, 16);
  }

}
