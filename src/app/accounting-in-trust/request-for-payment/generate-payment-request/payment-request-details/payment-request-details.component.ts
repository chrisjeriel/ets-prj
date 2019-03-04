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
  	tHeader: ['Claim Request No', 'Claim No', 'Policy No.','Payment For/To', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Curr','Curr Rate','Reserve Amount','Amount','Amount (Php)'],
  	dataTypes: ['text', 'text', 'text','text', 'text', 'number', 'text', 'checkbox', 'text', 'percent','currency', 'currency', 'currency'],
  	nData: new PaymentToAdjusters(null,null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null, null,null, null, null,null, null, 'Total', null, 'amount', 'amountPhp'],
  	genericBtn: 'Save',
    widths: [150,150,150,200,200,1,150,1,1,85,120,120,120],
    magnifyingGlass: ['claimRequestNo']
  }

  OtherPartyData: any = {
  	tableData: this.accountingService.getPaymentToOtherParty(),
  	tHeader: ['Claim Request No', 'Claim No', 'Payment For/To', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Curr','Curr Rate','Reserve Amount','Amount','Amount (PHP)'],
  	dataTypes: ['text', 'text', 'text', 'text', 'number', 'text', 'checkbox','text', 'percent','currency', 'currency', 'currency'],
  	nData: new PaymentToOtherParty(null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null,null, null, null,null, null, 'Total', null, 'amount', 'amountPhp'],
  	genericBtn: 'Save',
    widths: [150,150,200,200,1,150,1,1,85,120,120,120],
    magnifyingGlass: ['claimRequestNo']
  }

  CedingCompanyData: any = {
  	tableData: this.accountingService.getPaymentToCedingCompany(),
  	tHeader: ['Claim Request No', 'Claim No', 'Payment For/To', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia','Curr','Curr Rate','Reserve Amount','Amount','Amount (PHP)'],
    dataTypes: ['text', 'text', 'text', 'text', 'number', 'text', 'checkbox','text', 'percent','currency', 'currency', 'currency'],
  	nData: new PaymentToCedingCompany(null,null,null,null,null,null,null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null,null, null, null,null, null, 'Total', null, 'amount', 'amountPhp'],
  	genericBtn: 'Save',
   widths: [150,150,200,200,1,150,1,1,85,120,120,120],
    magnifyingGlass: ['claimRequestNo']
  }

  PremiumReturnData: any = {
  	tableData: this.accountingService.getPremiumReturn(),
  	tHeader: ['Policy No', 'Due Date', 'Ceding Company', 'Curr', 'Curr Rate', 'Premium', 'RI Commision', 'Charges','Net Due'],
  	dataTypes: ['text', 'date', 'text', 'text','percent', 'currency', 'currency', 'currency', 'currency'],
  	nData: new PremiumReturn(null,null,null,null,null,null,null,null,null),
    magnifyingGlass: ['policyNo'],
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null,null, 'Total', 'premium', 'riCommision','charges','netDue'],
  	genericBtn: 'Save',
    widths: [180,1,250,1,85,120,120,120,120]
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

  MainCompanyServiceAccountingData:any = {
    tHeader: ['Main Company Distribution','Percent Share(%)','Curr','Curr Rate','Amount','Amount (PHP)'],
    widths:[300,85,1,85,120,120],
    dataTypes:['text','percent','text','percent','currency','currency'],
    uneditable:[true,true,true,true,true,true],
    total: [null,null,null,'Total','4','5'],
    infoFlag: true,
    paginateFlag: true,
    pageLength: 3,
    searchFlag:true,
    tableData:[
      ['Nat Re',4,'PHP',1,40000,40000],
      ['Pool & Munich Re',96,'PHP',1,960000,960000]
    ],
    pageID:2
  }

  SubServiceAccountingData: any= {
    tHeader: ['Sub-Distribution of Pool & Munich Re','Precent Share(%)','Curr','Curr Rate','Amount','Amount (PHP)'],
    widths:[209,141,56,91,120,120],
    dataTypes:['text','percent','text','percent','currency','currency'],
    uneditable:[true,true,true,true,true,true],
    total: [null,null,null,'Total','4','5'],
    infoFlag: true,
    paginateFlag: true,
    pageLength: 10,
    tableData:[
      ['Munich Re',10.00, 'PHP', 1, 96000, 96000 ],
      ['Allied', 1.00, 'PHP', 1, 9600, 9600],
      ['ASIA UNITED', 5.00, 'PHP', 1, 48000, 48000],
      ['BPI/MS', 5.00, 'PHP', 1, 48000, 48000],
      ['FEDERAL PHOENIX', 1.00, 'PHP', 1, 9600, 9600],
      ['INTRA_STRATA', 1.00, 'PHP', 1, 9600, 9600],
      ['LIBERTY', 10.00, 'PHP', 1, 96000, 96000],
      ['MAPFRE', 5.00, 'PHP', 1, 43000, 43000],
      ['MERIDIAN', 5.00, 'PHP', 1, 48000, 48000],
      ['PHILFIRE', 1.00, 'PHP', 1, 9600, 9600],
    ],
    pageID:3
  }

  TreatyBalanceData: any = {
    tableData: this.accountingService.getTreatyBalance(),
    tHeader: ["Quarter Ending", "Currency", "Currency Rate", "Amount", "Amount(PHP)"],
    dataTypes: ["date","text","percent","currency","currency"],
    resizable: [true, true, true, true, true, true,true],
    nData: new TreatyBalance(null,null,null,null,null),
    total:[null, null, 'Total','amount', 'amountPHP'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: ['auto',1,1,'auto','auto'],
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
    console.log(this.accountingService.getPaymentToAdjuster());
    
  }

}
