import { Component, OnInit } from '@angular/core';
import { AmountDetailsCV, AccountingEntriesCV, VATDetails, CreditableTax } from '@app/_models';
import { AccountingService } from '../../../../_services/accounting.service';

@Component({
  selector: 'app-cv-preview-service',
  templateUrl: './cv-preview-service.component.html',
  styleUrls: ['./cv-preview-service.component.css']
})
export class CvPreviewServiceComponent implements OnInit {
amountDetailsData: any = {
  	tableData: this.accountingService.getAmountDetailsCV(),
  	tHeader: ['Detail', 'Amount', 'Amount (PHP)', 'Plus/Minus', 'Amount Plus/Minus'],
  	dataTypes: ['text', 'currency', 'currency', 'select', 'currency'],
  	nData: new AmountDetailsCV(null,null,null,null,null),
    opts:[
      {
        selector: 'plusMinus',
        vals: ['None', 'Add', 'Less'],
      }
    ],
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
    dataTypes: ['text', 'text', 'text', 'currency', 'currency'],
    nData: new VATDetails(null,null,null,null,null),
    pageID: 3,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', 'vatAmount'],
    pageLength:5,
    genericBtn: 'Save',
  }

  accountingCreditableTaxDetails: any = {
    tableData: this.accountingService.getCreditableTax(),
    tHeader: ['BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
    dataTypes: ['text', 'text', 'percent','text', 'currency', 'currency'],
    nData: new CreditableTax(null,null,null,null,null,null),
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    total: [null, null, null, null,'Total', 'wTaxAmount'],
    genericBtn: 'Save',
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
