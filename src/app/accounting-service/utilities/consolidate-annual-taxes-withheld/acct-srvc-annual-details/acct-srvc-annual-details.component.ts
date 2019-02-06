import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-acct-srvc-annual-details',
  templateUrl: './acct-srvc-annual-details.component.html',
  styleUrls: ['./acct-srvc-annual-details.component.css']
})
export class AcctSrvcAnnualDetailsComponent implements OnInit {
  
  optionsData: any[] = [];
  passDataMonthlyTaxDetails = {
    tableData: this.accountingService.getAcctSrvcCWhtaxMonthlyTaxDetails(),
    tHeader: ["DM","D1604E","Seq No.","TIN","TIN Branch","Payee","Last Name","First Name","M.I.",
               "Month/Year","Tax Code","Tax Rate", "Tax Base", "Tax Amount"],
    dataTypes: ["text","text","number","sequence-6","text","text","text","text","text",
                "date","text","percent","currency","currency"],
    total: [null,null,null,null,null,null,null,null,null,null,"TOTAL",null,"taxBase","taxAmount"],
    widths: [],
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
        key: 'monthYear',
        title: 'Month/Year',
        dataType: 'date'
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
        key: 'taxBase',
        title: 'Tax Base',
        dataType: 'text'
      },
      {
        key: 'taxAmount',
        title: 'Tax Amount',
        dataType: 'text'
      },
    ]
  };

  constructor(private accountingService: AccountingService) { }
  ngOnInit() {
    this.optionsData.push("January","February","March","April","May","June","July",
                            "August","September","October","November","December");
  }

}
