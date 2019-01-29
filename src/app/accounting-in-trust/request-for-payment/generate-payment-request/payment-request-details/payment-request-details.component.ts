import { Component, OnInit } from '@angular/core';
import { PaymentToAdjusters, PaymentToOtherParty, PaymentToCedingCompany, PremiumReturn } from '@app/_models';
import { AccountingService } from '../../../../_services/accounting.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css']
})
export class PaymentRequestDetailsComponent implements OnInit {
  
  AdjustersData: any = {
  	tableData: this.accountingService.getPaymentToAdjuster(),
  	tHeader: ['Claim Request No', 'Claim No', 'Adjusters', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Reserve Amount', 'Curr','Curr Rate','Amount','Amount (Php)'],
  	dataTypes: ['text', 'text', 'text', 'text', 'number', 'text', 'checkbox', 'currency', 'text', 'currency', 'currency', 'currency'],
  	nData: new PaymentToAdjusters(null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null,null, null, null,null, null, null, 'Total', 'amount', 'amountPhp'],
  	genericBtn: 'Save'
  }

  OtherPartyData: any = {
  	tableData: this.accountingService.getPaymentToOtherParty(),
  	tHeader: ['Claim Request No', 'Claim No', 'Ceding Company', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Reserve Amount', 'Curr','Curr Rate','Amount','Amount (Php)'],
  	dataTypes: ['text', 'text', 'text', 'text', 'number', 'text', 'checkbox', 'currency', 'text', 'currency', 'currency', 'currency'],
  	nData: new PaymentToOtherParty(null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null,null, null, null,null, null, null, 'Total', 'amount', 'amountPhp'],
  	genericBtn: 'Save'
  }

  CedingCompanyData: any = {
  	tableData: this.accountingService.getPaymentToCedingCompany(),
  	tHeader: ['Claim Request No', 'Claim No', 'Ceding Company', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Reserve Amount', 'Curr','Curr Rate','Amount','Amount (Php)'],
  	dataTypes: ['text', 'text', 'text', 'text', 'number', 'text', 'checkbox', 'currency', 'text', 'currency', 'currency', 'currency'],
  	nData: new PaymentToCedingCompany(null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null,null, null, null,null, null, null, 'Total', 'amount', 'amountPhp'],
  	genericBtn: 'Save'
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
  	genericBtn: 'Save'
  }
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
