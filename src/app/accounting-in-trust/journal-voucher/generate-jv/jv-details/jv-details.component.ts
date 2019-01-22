import { Component, OnInit } from '@angular/core';
import { AmountDetailsCV, AccountingEntriesCV, VATDetails, CreditableTax } from '@app/_models';
import { AccountingService } from '../../../../_services/accounting.service';

@Component({
  selector: 'app-jv-details',
  templateUrl: './jv-details.component.html',
  styleUrls: ['./jv-details.component.css']
})
export class JvDetailsComponent implements OnInit {
  
  amountDetailsData: any = {
  	tableData: this.accountingService.getAmountDetailsCV(),
  	tHeader: ['Detail', 'Amount', 'Amount (PHP)', 'Plus/Minus', 'Amount Plus/Minus'],
  	dataTypes: ['text', 'currency', 'currency', 'select', 'currency'],
  	opts: [{ selector: "plusMinus", vals: ["Add", "Less","None"] }],
  	nData: new AmountDetailsCV(null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null, 'Total', 'amountPlusMinus'],
  	genericBtn: 'Save'
  }

  accountingEntriesData: any = {
  	tableData: this.accountingService.getAccountingEntriesCV(),
  	tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
  	dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
  	nData: new AccountingEntriesCV(null,null,null,null,null,null),
  	pageID: 2,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null, 'Total', null, null],
  	genericBtn: 'Save',
  }

  accountingVATTaxDetails: any = {
    tableData: this.accountingService.getVATDetails(),
    tHeader: ['VAT Type', 'BIR RLF Purchase Type', 'Payor', 'Base Amount', 'VAT Amount'],
    dataTypes: ['select', 'text', 'text', 'currency', 'currency'],
    opts: [{ selector: "vatType", vals: ["Output", "Input"] }],
    nData: new VATDetails(null,null,null,null,null),
    pageID: 3,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, 'Total', null, 'vatAmount'],
    pageLength:5,
    genericBtn: 'Save',
  }

  accountingCreditableTaxDetails: any = {
    tableData: this.accountingService.getCreditableTax(),
    tHeader: ['BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
    dataTypes: ['text', 'text', 'currency','text', 'currency', 'currency'],
    nData: new CreditableTax(null,null,null,null,null,null),
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    total: [null, null, null, 'Total', null, 'wTaxAmount'],
    genericBtn: 'Save',
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
