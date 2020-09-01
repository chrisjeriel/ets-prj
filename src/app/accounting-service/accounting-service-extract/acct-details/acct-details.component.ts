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
    pageLength: 15,
    widths: [150,220,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,'Total','income',null,'whtaxAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: [
      {
        key: 'refNo',
        title: 'Ref. No.',
        dataType: 'text'
      },
      {
        key: 'payeePayor',
        title: 'Payee/Payor',
        dataType: 'text'
      },
      {
        key: 'birCode',
        title: 'BIR Code',
        dataType: 'text'
      },
      {
        key: 'taxDescription',
        title: 'Tax Description',
        dataType: 'text'
      },
      {
        key: 'tin',
        title: 'TIN',
        dataType: 'text'
      },
      {
        key: 'tinBranch',
        title: 'TIN Branch',
        dataType: 'text'
      },
      {
        key: 'income',
        title: 'Income',
        dataType: 'text'
      },
      {
        key: 'whtaxRate',
        title: 'Whtax Rate',
        dataType: 'text'
      },
      {
        key: 'whtaxAmount',
        title: 'Whtax Amount',
        dataType: 'text'
      }
    ]

  }

  
  InputVatDetailsData: any = {
    tableData: this.accountingService.getInputVatDetails(),
    tHeader: ["Tran Type","Ref. No.","Payee/Payor", "Address 1", "Address 2", "TIN", "BIR RLF Purchase Type","Base Amount","VAT Rate","Input VAT Amount"],
    dataTypes: ["text","text","text","text","text","text","text","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true,true],
    nData: new InputVatDetails(null,null,null,null,null,null,null,null,null,null),
    pageLength: 15,
    widths: [150,220,150,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,null,'Total','baseAmount',null,'inputVatAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: [
      {
        key: 'tranType',
        title: 'Tran Type:',
        dataType: 'text'
      },
      {
        key: 'refNo',
        title: 'Ref. No.',
        dataType: 'text'
      },
      {
        key: 'payeePayor',
        title: 'Payee/Payor',
        dataType: 'text'
      },
      {
        key: 'address1',
        title: 'Address 1',
        dataType: 'text'
      },
      {
        key: 'address2',
        title: 'Address 2',
        dataType: 'text'
      },
      {
        key: 'tin',
        title: 'TIN',
        dataType: 'text'
      },
      {
        key: 'birRLFPurchaseType',
        title: 'BIR RLF Prchs Type',
        dataType: 'text'
      },
      {
        key: 'baseAmount',
        title: 'Base Amount',
        dataType: 'text'
      },
      {
        key: 'vatRate',
        title: 'VAT Rate',
        dataType: 'text'
      },
      {
        key: 'inputVatAmount',
        title: 'Input VAT Amount',
        dataType: 'text'
      }
    ]
  }

  OutputVatDetailsData: any = {
    tableData: this.accountingService.getOutputVatDetails(),
    tHeader: ["Tran Type","Ref. No.","Payee/Payor", "Address 1", "Address 2", "TIN","Base Amount","VAT Rate","Output VAT Amount"],
    dataTypes: ["text","text","text","text","text","text","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true],
    nData: new OutputVatDetails(null,null,null,null,null,null,null,null,null),
    pageLength: 15,
    widths: [150,220,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,'Total','baseAmount',null,'outputVatAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: [
      {
        key: 'tranType',
        title: 'Tran Type:',
        dataType: 'text'
      },
      {
        key: 'refNo',
        title: 'Ref. No.',
        dataType: 'text'
      },
      {
        key: 'payeePayor',
        title: 'Payee/Payor',
        dataType: 'text'
      },
      {
        key: 'address1',
        title: 'Address 1',
        dataType: 'text'
      },
      {
        key: 'address2',
        title: 'Address 2',
        dataType: 'text'
      },
      {
        key: 'tin',
        title: 'TIN',
        dataType: 'text'
      },
      {
        key: 'baseAmount',
        title: 'Base Amount',
        dataType: 'text'
      },
      {
        key: 'vatRate',
        title: 'VAT Rate',
        dataType: 'text'
      },
      {
        key: 'outputVatAmount',
        title: 'Output VAT Amount',
        dataType: 'text'
      }
    ]
  }

  WithholdingVatDetailsData: any = {
    tableData: this.accountingService.getWithholdingVATDetails(),
    tHeader: ["Ref. No.","Payee/Payor","BIR Code","Tax Description","TIN","TIN Branch","Income","Whtax Rate","Whtax AMount"],
    dataTypes: ["text","text","text","text","text","text","text","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true],
    nData: new WithholdingVATDetails(null,null,null,null,null,null,null,null,null),
    pageLength: 15,
    widths: [150,220,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,'Total','income',null,'whtaxAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: [
      {
        key: 'refNo',
        title: 'Ref. No.',
        dataType: 'text'
      },
      {
        key: 'payeePayor',
        title: 'Payee/Payor',
        dataType: 'text'
      },
      {
        key: 'birCode',
        title: 'BIR Code',
        dataType: 'text'
      },
      {
        key: 'taxDescription',
        title: 'Tax Description',
        dataType: 'text'
      },
      {
        key: 'tin',
        title: 'TIN',
        dataType: 'text'
      },
      {
        key: 'tinBranch',
        title: 'TIN Branch',
        dataType: 'text'
      },
      {
        key: 'income',
        title: 'Income',
        dataType: 'text'
      },
      {
        key: 'whtaxRate',
        title: 'Whtax Rate',
        dataType: 'text'
      },
      {
        key: 'whtaxAmount',
        title: 'Whtax Amount',
        dataType: 'text'
      }
    ]
  }


  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
