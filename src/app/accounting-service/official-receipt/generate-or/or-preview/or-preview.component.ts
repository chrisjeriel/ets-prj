import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ORPrevAmountDetails , ORPrevAccEntries , ORPreVATDetails , ORPreCreditableWTaxDetails } from '@app/_models';

@Component({
  selector: 'app-or-preview',
  templateUrl: './or-preview.component.html',
  styleUrls: ['./or-preview.component.css']
})
export class OrPreviewComponent implements OnInit {
  
   passDataAmountDetails: any = {
  	tableData: [],
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
    infoFlag:true
  }

   passDataAccountingEntries: any = {
  	tableData: [],
    tHeader: ["Account Code", "Account Name", "SL Type", "SL Name", "Debit","Credit"],
    dataTypes: ["text", "text", "text", "text", "currency","currency"],
    resizable: [true, true, true, true, true, true],
    nData: new ORPrevAccEntries(null,null,null,null,null,null),
    total:[null,null,null,'Total',null,'credit'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [150,'auto',100,200,150,150],
    magnifyingGlass: ['code','slType','slName'],
    paginateFlag:true,
    infoFlag:true
  }

   passDataAccountingVATTaxDetails: any = {
    tableData: [],
    tHeader: ['VAT Type', 'BIR RLF Purchase Type', 'Payor', 'Base Amount', 'VAT Amount'],
    dataTypes: ['text', 'text', 'text', 'currency', 'currency'],
    //opts: [{ selector: "vatType", vals: ["Output", "Input"] }],
	  nData: new ORPreVATDetails(null,null,null,null,null),
    pageID: 3,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', 'vatAmount'],
    pageLength:5,
    genericBtn: 'Save',
    widths: [100,200,'auto',150,150],
    paginateFlag:true,
    infoFlag:true
  }

  passDataAccountingCreditableTaxDetails: any = {
   tableData: [],
    tHeader: ['BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
    dataTypes: ['text', 'text', 'percent','text', 'currency', 'currency'],
    // opts:[
    //   {
    //     selector: 'birTaxCode',
    //     vals: ['WC002', 'WC010', 'WC020'],
    //   }
    // ],
    nData: new ORPreCreditableWTaxDetails(null,null,null,null,null,null),
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    total: [null, null, null, null,'Total', 'wTaxAmount'],
    widths: [150,250,130,'auto',150,150,],
    genericBtn: 'Save',
    paginateFlag:true,
    infoFlag:true
  }


  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passDataAmountDetails.tableData = this.accountingService.getORPrevAmountDetails();
  	this.passDataAccountingEntries.tableData = this.accountingService.getORPrevAccEntries();
  	this.passDataAccountingVATTaxDetails.tableData = this.accountingService.getORPrevTaxDetails();
  	this.passDataAccountingCreditableTaxDetails.tableData = this.accountingService.getORPrevCredWTaxDetails();
  }

}
