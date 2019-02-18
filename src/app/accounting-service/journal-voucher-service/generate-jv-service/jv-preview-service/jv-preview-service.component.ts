import { Component, OnInit } from '@angular/core';
import { AmountDetailsCV, AccountingEntriesCV, VATDetails, CreditableTax, ORPrevAmountDetails, ORPreVATDetails, ORPreCreditableWTaxDetails } from '@app/_models';
import { AccountingService } from '../../../../_services/accounting.service';

@Component({
  selector: 'app-jv-preview-service',
  templateUrl: './jv-preview-service.component.html',
  styleUrls: ['./jv-preview-service.component.css']
})
export class JvPreviewServiceComponent implements OnInit {
amountDetailsData: any = {
  	tableData: this.accountingService.getORPrevAmountDetails(),
    tHeader: ["Item No", "Gen Type", "Detail", "Original Amount", "Currency","Currency Rate","Local Amount"],
    dataTypes: ["text", "text", "text", "currency", "text","percent","currency"],
    resizable: [true, true, true, true, true, true, true],
    nData: new ORPrevAmountDetails(null,null,null,null,null,null,null),
    total:[null,null,'TOTAL',null,null,null,'localAmount'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [70,70,'auto',160,60,160,160],
    paginateFlag:true,
    infoFlag:true,
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
    tableData: this.accountingService.getORPrevTaxDetails(),
    tHeader: ['VAT Type', 'BIR RLF Purchase Type', 'Payor', 'Base Amount', 'VAT Amount'],
    dataTypes: ['text', 'text', 'text', 'currency', 'currency'],
	nData: new ORPreVATDetails(null,null,null,null,null),
    pageID: 3,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', 'vatAmount'],
    pageLength:5,
    genericBtn: 'Save',
    widths: [100,200,'auto',200,200,],
    paginateFlag:true,
    infoFlag:true
  }

  accountingCreditableTaxDetails: any = {
   tableData: this.accountingService.getORPrevCredWTaxDetails(),
    tHeader: ['BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
    dataTypes: ['text', 'text', 'percent','text', 'currency', 'currency'],
    nData: new ORPreCreditableWTaxDetails(null,null,null,null,null,null),
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    total: [null, null, null, null,'Total', 'wTaxAmount'],
    widths: [100,200,150,'auto',150,150,],
    genericBtn: 'Save',
    paginateFlag:true,
    infoFlag:true
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

  plusMinus(data){
    console.log(data);
    
    for (var i = data.length - 1; i >= 0; i--) {
      if(data[i].plusMinus == "None"){
        data[i].amountPlusMinus = 0;
      }else if(data[i].plusMinus == "Add"){
        data[i].amountPlusMinus = Math.abs(data[i].amountPHP);
      }else if(data[i].plusMinus == "Less"){
        data[i].amountPlusMinus = Math.abs(data[i].amountPHP) * -1;
      }
    }
    this.amountDetailsData.tableData = data;
  }

  computeWTax(data){
    console.log(data);
    
    for (var i = data.length - 1; i >= 0; i--) {
      if(data[i].birTaxCode == "WC002"){
        data[i].wTaxRate = 2;
      }else if(data[i].birTaxCode == "WC010"){
        data[i].wTaxRate = 10;
      }else if(data[i].birTaxCode == "WC020"){
        data[i].wTaxRate = 20;
      }
      data[i].wTaxAmount = data[i].wTaxRate *  data[i].baseAmount / 100;
    }

    this.accountingCreditableTaxDetails.tableData = data;
  }
}
