import { Component, OnInit, Input } from '@angular/core';
import { PaymentToAdjusters, PaymentToOtherParty, PaymentToCedingCompany, PremiumReturn, AROthers, PaymentOfSeviceFee, TreatyBalance } from '@app/_models';
import { AccountingService } from '../../../../_services/accounting.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css']
})
export class PaymentRequestDetailsComponent implements OnInit {

  @Input() paymentType: string = "";
  date: string;

  AdjustersData: any = {
  	tableData: this.accountingService.getPaymentToAdjuster(),
  	tHeader: ['Claim Request No', 'Claim No', 'Payment For/To', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Reserve Amount', 'Curr','Curr Rate','Amount','Amount (Php)'],
  	dataTypes: ['text', 'text', 'text', 'text', 'number', 'text', 'checkbox', 'currency', 'text', 'percent', 'currency', 'currency'],
  	nData: new PaymentToAdjusters(null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null,null, null, null,null, null, null, 'Total', 'amount', 'amountPhp'],
  	genericBtn: 'Save',
    widths: ['auto','auto','auto','auto',1,'auto',1,100,1,2,100,100]
  }

  OtherPartyData: any = {
  	tableData: this.accountingService.getPaymentToOtherParty(),
  	tHeader: ['Claim Request No', 'Claim No', 'Payment For/To', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Reserve Amount', 'Curr','Curr Rate','Amount','Amount (PHP)'],
  	dataTypes: ['text', 'text', 'text', 'text', 'number', 'text', 'checkbox', 'currency', 'text', 'percent', 'currency', 'currency'],
  	nData: new PaymentToOtherParty(null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null,null, null, null,null, null, null, 'Total', 'amount', 'amountPhp'],
  	genericBtn: 'Save',
    widths: ['auto','auto','auto','auto',1,'auto',1,100,1,2,100,100]
  }

  CedingCompanyData: any = {
  	tableData: this.accountingService.getPaymentToCedingCompany(),
  	tHeader: ['Claim Request No', 'Claim No', 'Payment For/To', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Reserve Amount', 'Curr','Curr Rate','Amount','Amount (Php)'],
  	dataTypes: ['text', 'text', 'text', 'text', 'number', 'text', 'checkbox', 'currency', 'text', 'percent', 'currency', 'currency'],
  	nData: new PaymentToCedingCompany(null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null,null, null, null,null, null, null, 'Total', 'amount', 'amountPhp'],
  	genericBtn: 'Save',
    widths: ['auto','auto','auto','auto',1,'auto',1,100,1,2,100,100]
  }

  PremiumReturnData: any = {
  	tableData: this.accountingService.getPremiumReturn(),
  	tHeader: ['Policy No', 'Due Date', 'Ceding Company', 'Premium', 'RI Commision', 'Charges', 'Curr','Net Due'],
  	dataTypes: ['text', 'date', 'text', 'currency', 'currency', 'currency', 'text', 'currency'],
  	nData: new PremiumReturn(null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, 'Total', 'premium', 'riCommision','charges',null,'netDue'],
  	genericBtn: 'Save',
    widths: ['auto','auto','auto','auto',1,'auto',1,100,1,2,100,100]
  }

  ServiceAccountingData: any = {
    tableData: this.accountingService.getPaymentOfServiceFee(),
    tHeader: ["Item", "Description", "Curr", "Curr Rate","Amount","Amount(PHP)"],
    dataTypes: ["text", "text", "text", "percent","currency","currency"],
    resizable: [true, true, true, true, true, true],
    nData: new PaymentOfSeviceFee(null,null,null,null,null,null),
    total:[null,null,null,'Total','amount','amountPHP'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [220,'auto',50,100,150,150],
    paginateFlag:true,
    infoFlag:true
  }


  TreatyBalanceData: any = {
    tableData: this.accountingService.getTreatyBalance(),
    tHeader: ["Quarter Ending", "DR Balance", "CR Balance", "Beginning DR Balance","Beginning CR Balance","Ending DR Balance","Ending CR Balance"],
    dataTypes: ["date","currency","currency","currency","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true],
    nData: new TreatyBalance(null,null,null,null,null,null,null),
    total:['Total','drBalance','crBalance','beginningDrBalance','beginningCrBalance','endingDrBalance','endingCrBalance'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [220,150,150,150,150,150,150],
    paginateFlag:true,
    infoFlag:true
  }


  constructor(private accountingService: AccountingService) {
      this.date = new Date().toISOString().slice(0,16);
  }

  ngOnInit() {
    if(this.paymentType === null){
      this.paymentType = "";
    }

    
  }

}
