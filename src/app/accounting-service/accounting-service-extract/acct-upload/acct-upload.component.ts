import { Component, OnInit, Input } from '@angular/core';
import { CredibleWithholdingTaxUpload, InputVatUpload, OutputVatUpload, WithholdingTaxUpload } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-acct-upload',
  templateUrl: './acct-upload.component.html',
  styleUrls: ['./acct-upload.component.css']
})
export class AcctUploadComponent implements OnInit {
  @Input() taxType: string = "";
  CreditableTaxData: any = {
    tableData: this.accountingService.getCredibleWithholdingTaxUpload(),
    tHeader: ['DMAP','D1601E','BIR Code','Payee','TIN','TIN Branch','Last Name','First Name','M.I','Income','Whtax Rate','Whtax Amount'],
    dataTypes: ["text","text","text","text","text","text","text","text","text","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,,true,true,true,true,true],
    nData: new CredibleWithholdingTaxUpload(null,null,null,null,null,null,null,null,null,null,null,null),
    pageLength: 15,
    widths: [150,220,150,150,150,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,null,null,'Total',null,'income',null,'whtaxAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: [
      {
        key: 'dmap',
        title: 'DMAP',
        dataType: 'text'
      },
      {
        key: 'd1601e',
        title: 'D1601E',
        dataType: 'text'
      },
      {
        key: 'birCode',
        title: 'BIR Code',
        dataType: 'text'
      },
      {
        key: 'payee',
        title: 'Payee',
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
        key: 'lastName',
        title: 'Last Name',
        dataType: 'text'
      },
      {
        key: 'firstName',
        title: 'First Name',
        dataType: 'text'
      },
      {
        key: 'mi',
        title: 'M.I.',
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
      },
    ]
  }

  InputVatData: any = {
    tableData: this.accountingService.getInputVatUpload(),
    tHeader: ['Taxable Month','Seq No','TIN','Registered Name','Last Name','First Name','Middle Initial','Address 1','Adress 2',' Total Purchase','Taxable Net of VAT','Exempt','Zero Rated','Services','Capital Goods','Goods other than Capital Goods','Tax Rate','Total Input Tax'],
    dataTypes: ["text","text","text","text","text","text","text","text","text","currency","currency","currency","currency","currency","currency","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true,true,true,true,true,true,true,true,true,true],
    total:[null,null,null,null,null,null,null,null,'Total','totalPurchase','taxableNetOfVat','exempt','zeroRated','services','capitalGood','goodsOtherThanCapitalGoods',null,'totalInputTax'],
    colSize: ['80px', '80px', '80px', '80px', '53px', '80px', '30px', '80px', '80px','80px'],
    pagination: true,
    pageStatus: true,
    pageLength: 15,
    searchFlag:true,
    filters: [
      {
        key: 'taxableMonth',
        title: 'Taxable Month',
        dataType: 'text'
      },
      {
        key: 'seqNo',
        title: 'Seq No',
        dataType: 'text'
      },
      {
        key: 'tin',
        title: 'TIN',
        dataType: 'text'
      },
      {
        key: 'registeredName',
        title: 'Registered Name',
        dataType: 'text'
      },
      {
        key: 'lastName',
        title: 'Last Name',
        dataType: 'text'
      },
      {
        key: 'firstName',
        title: 'First Name',
        dataType: 'text'
      },
      {
        key: 'mi',
        title: 'M.I.',
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
        key: 'totalPurchase',
        title: 'Total Purchase',
        dataType: 'text'
      },
      {
        key: 'taxableNetOfVat',
        title: 'Taxable Net Of Vat',
        dataType: 'text'
      },
      {
        key: 'exempt',
        title: 'Exempt',
        dataType: 'text'
      },
      {
        key: 'zeroRated',
        title: 'Zero Rated',
        dataType: 'text'
      },
      {
        key: 'services',
        title: 'Services',
        dataType: 'text'
      },
      {
        key: 'capitalGood',
        title: 'Capital Good',
        dataType: 'text'
      },
      {
        key: 'goodsOtherThanCapitalGoods',
        title: 'Goods Other Than Cap.Goods',
        dataType: 'text'
      },
      {
        key: 'taxRate',
        title: 'Tax Rate',
        dataType: 'text'
      },
      {
        key: 'totalInputTax',
        title: 'Total InputTax',
        dataType: 'text'
      }
    ]
  }
 

  OutputVatData: any = {
    tableData: this.accountingService.getOutputVatUpload(),
    tHeader: ['Taxable Month','Seq No','TIN','Registered Name','Last Name','First Name','Middle Initial','Address 1','Adress 2',' G Sales','GT Sales','GE Sales','GZ Sales','Tax Rate','Total Output Tax'],
    dataTypes: ["text","text","text","text","text","text","text","text","text","currency","currency","currency","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,true,true,true,true,true,true,true,true,true,true],
    nData: new OutputVatUpload(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null),
    pageLength: 15,
    widths: ['auto','auto','auto','auto','auto','auto','auto','auto',150,150,150,150,'auto',150,150],
    total:[null,null,null,null,null,null,null,null,'Total','gSales','gtSales','geSales','gzSales',null,'totalOutputTax'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: [
      {
        key: 'taxableMonth',
        title: 'Taxable Month',
        dataType: 'text'
      },
      {
        key: 'seqNo',
        title: 'Seq No',
        dataType: 'text'
      },
      {
        key: 'tin',
        title: 'TIN',
        dataType: 'text'
      },
      {
        key: 'registeredName',
        title: 'Registered Name',
        dataType: 'text'
      },
      {
        key: 'lastName',
        title: 'Last Name',
        dataType: 'text'
      },
      {
        key: 'firstName',
        title: 'First Name',
        dataType: 'text'
      },
      {
        key: 'mi',
        title: 'M.I.',
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
        key: 'gSales',
        title: 'G Sales',
        dataType: 'text'
      },
      {
        key: 'gtSales',
        title: 'GT Sales',
        dataType: 'text'
      },
      {
        key: 'gzSales',
        title: 'GZ Sales',
        dataType: 'text'
      },
      {
        key: 'taxRate',
        title: 'Tax Rate',
        dataType: 'text'
      },
      {
        key: 'totalInputTax',
        title: 'Total InputTax',
        dataType: 'text'
      }
    ]
  }

  WithholdingTaxData: any = {
    tableData: this.accountingService.getWithholdingTaxUpload(),
    tHeader: ['DMAP','D1601E','BIR Code','Payee','TIN','TIN Branch','Last Name','First Name','M.I','Income','Whtax Rate','Whtax Amount'],
    dataTypes: ["text","text","text","text","text","text","text","text","text","currency","currency","currency"],
    resizable: [true, true, true, true, true, true,true,true,,true,true,true,true,true],
    nData: new WithholdingTaxUpload(null,null,null,null,null,null,null,null,null,null,null,null),
    pageLength: 15,
    widths: [150,220,150,150,150,150,150,150,150,150,150,150],
    total:[null,null,null,null,null,null,null,'Total',null,'income',null,'whtaxAmount'],
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    filters: [
      {
        key: 'dmap',
        title: 'DMAP',
        dataType: 'text'
      },
      {
        key: 'd1601e',
        title: 'D1601E',
        dataType: 'text'
      },
      {
        key: 'birCode',
        title: 'BIR Code',
        dataType: 'text'
      },
      {
        key: 'payee',
        title: 'Payee',
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
        key: 'lastName',
        title: 'Last Name',
        dataType: 'text'
      },
      {
        key: 'firstName',
        title: 'First Name',
        dataType: 'text'
      },
      {
        key: 'mi',
        title: 'M.I.',
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
