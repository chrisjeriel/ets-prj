import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from  '@angular/platform-browser';

@Component({
  selector: 'app-acct-srvc-consolidate-data',
  templateUrl: './acct-srvc-consolidate-data.component.html',
  styleUrls: ['./acct-srvc-consolidate-data.component.css']
})
export class AcctSrvcConsolidateDataComponent implements OnInit {
  
  passDataConsolidatedAnnualTaxes = {
    tableData: this.accountingService.getAcctSrvcCWhtaxConsolidateData(),
    tHeader: ["DM","D1604E","IIAP TIN","IIAP Branch","Period","Seq No.","TIN","TIN Branch","Payee","Last Name","First Name","M.I.",
               "Tax Code","Tax Rate", "Income", "Tax Amount"],
    dataTypes: ["text","text","text","text","date","number","sequence-6","text","text","text","text","text",
                "text","percent","currency","currency"],
    total: [null,null,null,null,null,null,null,null,null,null,null,null,"TOTAL",null,"income","taxAmount"],
    colSize: ['','','','','','','','','20%','20%','20%','','','','20%','20%'],
    pageLength: 15,
    tableOnly: false,
    pageStatus: true,
    pagination: true,
    filters:[
      {
        key: 'dm',
        title: 'DM',
        dataType: 'text'
      },
      {
        key: 'd1604e',
        title: 'D1604E',
        dataType: 'text'
      },
      {
        key: 'iiapTin',
        title: 'IIAP TIN',
        dataType: 'text'
      },
      {
        key: 'iiapBranch',
        title: 'IIAP Branch',
        dataType: 'text'
      },
      {
        key: 'period',
        title: 'Period',
        dataType: 'date'
      },
      {
        key: 'seqNo',
        title: 'Seq No.',
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
        key: 'payee',
        title: 'Payee',
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
        key: 'midName',
        title: 'M.I.',
        dataType: 'text'
      },
      {
        key: 'taxCode',
        title: 'Tax Code',
        dataType: 'text'
      },
      {
        key: 'taxRate',
        title: 'Tax Rate',
        dataType: 'text'
      },
      {
        key: 'income',
        title: 'Income',
        dataType: 'text'
      },
      {
        key: 'taxAmount',
        title: 'Tax Amount',
        dataType: 'text'
      },
    ]
  };

  constructor(private accountingService: AccountingService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-Service | Consolidate Data");
  }

}
