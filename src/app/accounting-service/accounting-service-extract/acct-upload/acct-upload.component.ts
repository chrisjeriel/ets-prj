import { Component, OnInit } from '@angular/core';
import { CredibleWithholdingTaxUpload, InputVatUpload, OutputVatUpload, WithholdingTaxUpload } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-acct-upload',
  templateUrl: './acct-upload.component.html',
  styleUrls: ['./acct-upload.component.css']
})
export class AcctUploadComponent implements OnInit {
  
  CreditableTaxData: any = {
    tableData: this.accountingService.getCredibleWithholdingTaxUpload(),
    tHeader: ['DMAP','D1601E','BIR Code','Payee','TIN','TIN Branch','Last Name','First Name','M.I','Income','Whtax Rate','Whtax Amount'],
    dataTypes: ["text","text","text","text","text","text","text","text","text","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,,true,true,true,true,true],
    nData: new CredibleWithholdingTaxUpload(null,null,null,null,null,null,null,null,null,null,null,null),
    pageLength: 20,
    widths: [150,220,150,150,150,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,null,null,'Total',null,'income',null,'whtaxAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: []
  }

  InputVatData: any = {
    tableData: this.accountingService.getInputVatUpload(),
    tHeader: ['Taxable Month','Seq No','TIN','Registered Name','Last Name','First Name','Middle Initial','Address 1','Adress 2',' Total Purchase','Taxable Net of VAT','Exempt','Zero Rated','Services','Capital Goods','Goods other than Capital Goods','Tax Rate','Total Input Tax'],
    dataTypes: ["text","text","text","text","text","text","text","text","text","currency","currency","currency","currency","text","text","text","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true,true,true,true,true,true,true,true,true,true],
    nData: new InputVatUpload(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null),
    pageLength: 20,
    widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto',150,150,150,150,150],
    total:[null,null,null,null,null,null,null,null,'Total','totalPurchase','taxableNetOfVat','exempt','zeroRated',null,null,null,null,'totalInputTax'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: []
  }

  OutputVatData: any = {
    tableData: this.accountingService.getOutputVatUpload(),
    tHeader: ['Taxable Month','Seq No','TIN','Registered Name','Last Name','First Name','Middle Initial','Address 1','Adress 2',' G Sales','GT Sales','GE Sales','GZ Sales','Tax Rate','Total Output Tax'],
    dataTypes: ["text","text","text","text","text","text","text","text","text","currency","currency","currency","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true,true,true,true,true,true,true,true,true,true],
    nData: new OutputVatUpload(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null),
    pageLength: 20,
    widths: ['auto','auto','auto','auto','auto','auto','auto','auto',150,150,150,150,'auto',150,150],
    total:[null,null,null,null,null,null,null,null,'Total','gSales','gtSales','geSales','gzSales',null,'totalInputTax'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: []
  }

  WithholdingTaxData: any = {
    tableData: this.accountingService.getWithholdingTaxUpload(),
    tHeader: ['DMAP','D1601E','BIR Code','Payee','TIN','TIN Branch','Last Name','First Name','M.I','Income','Whtax Rate','Whtax Amount'],
    dataTypes: ["text","text","text","text","text","text","text","text","text","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,,true,true,true,true,true],
    nData: new WithholdingTaxUpload(null,null,null,null,null,null,null,null,null,null,null,null),
    pageLength: 20,
    widths: [150,220,150,150,150,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,null,null,'Total',null,'income',null,'whtaxAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: []
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
