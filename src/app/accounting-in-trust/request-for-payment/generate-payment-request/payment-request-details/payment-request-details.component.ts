import { Component, OnInit, Input } from '@angular/core';
import { PaymentToAdjusters, PaymentToOtherParty, PaymentToCedingCompany, PremiumReturn } from '@app/_models';
import { AccountingService } from '../../../../_services/accounting.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css']
})
export class PaymentRequestDetailsComponent implements OnInit {

  @Input() paymentType: string = "";

  AdjustersData: any = {
  	tableData: this.accountingService.getPaymentToAdjuster(),
  	tHeader: ['Claim Request No', 'Claim No', 'Adjusters', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Reserve Amount', 'Curr','Curr Rate','Amount','Amount (Php)'],
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
  	tHeader: ['Claim Request No', 'Claim No', 'Ceding Company', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Reserve Amount', 'Curr','Curr Rate','Amount','Amount (Php)'],
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
  	tHeader: ['Claim Request No', 'Claim No', 'Ceding Company', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Reserve Amount', 'Curr','Curr Rate','Amount','Amount (Php)'],
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

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
    if(this.paymentType === null){
      this.paymentType = "";
    }
  }

}
