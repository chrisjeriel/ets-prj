import { Component, OnInit, Input } from '@angular/core';
import { AccountingEntriesExtract, CredibleWithholdingTaxDetails ,InputVatDetails, OutputVatDetails, WithholdingVATDetails } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-acct-details',
  templateUrl: './acct-details.component.html',
  styleUrls: ['./acct-details.component.css']
})
export class AcctDetailsComponent implements OnInit {
  @Input() taxType: string = "";

  CreditableTaxData: any = {
    tableData: this.accountingService.getCredibleWithholdingTaxDetails(),
    tHeader: ["Ref. No.","Payee/Payor","BIR Code","Tax Description","TIN","TIN Branch","Income","Whtax Rate","Whtax AMount"],
    dataTypes: ["text","text","text","text","text","text","text","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true],
    nData: new CredibleWithholdingTaxDetails(null,null,null,null,null,null,null,null,null),
    pageLength: 20,
    widths: [150,220,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,'Total','income',null,'whtaxAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: []
  }

  
  InputVatDetailsData: any = {
    tableData: this.accountingService.getInputVatDetails(),
    tHeader: ["Tran Type","Ref. No.","Payye/Payor", "Address 1", "Address 2", "TIN", "BIR RLF Purchase Type","Base Amount","VAT Rate","Input VAT Amount"],
    dataTypes: ["text","text","text","text","text","text","text","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true,true],
    nData: new InputVatDetails(null,null,null,null,null,null,null,null,null,null),
    pageLength: 20,
    widths: [150,220,150,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,null,'Total','baseAmount',null,'inputVatAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: []
  }

  OutputVatDetailsData: any = {
    tableData: this.accountingService.getOutputVatDetails(),
    tHeader: ["Tran Type","Ref. No.","Payye/Payor", "Address 1", "Address 2", "TIN","Base Amount","VAT Rate","Output VAT Amount"],
    dataTypes: ["text","text","text","text","text","text","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true],
    nData: new OutputVatDetails(null,null,null,null,null,null,null,null,null),
    pageLength: 20,
    widths: [150,220,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,'Total','baseAmount',null,'outputVatAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: []
  }

  WithholdingVatDetailsData: any = {
    tableData: this.accountingService.getWithholdingVATDetails(),
    tHeader: ["Ref. No.","Payye/Payor","BIR Code","Tax Description","TIN","TIN Branch","Income","Whtax Rate","Whtax AMount"],
    dataTypes: ["text","text","text","text","text","text","text","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true],
    nData: new WithholdingVATDetails(null,null,null,null,null,null,null,null,null),
    pageLength: 20,
    widths: [150,220,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,'Total','income',null,'whtaxAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: []
  }


  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
