import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from '@app/_services';
import { ARTaxDetailsVAT, ARTaxDetailsWTAX } from '@app/_models';

@Component({
  selector: 'app-ar-details',
  templateUrl: './ar-details.component.html',
  styleUrls: ['./ar-details.component.css']
})
export class ArDetailsComponent implements OnInit {
  passDataTaxDetailsVat: any = {
    tableData: this.accountingService.getARTaxDetailsVAT(),
    tHeader: ["VAT Type", "BIR RLF Purchase Type", "Payor", "Base Amount", "VAT Amount"],
    dataTypes: ["select", "text", "text", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    pageLength: 5,
    widths: [],
    paginateFlag: true,
    nData: new ARTaxDetailsVAT(null, null, null, null, null),
    total: [null, null, 'Total', null, 'vatAmount'],
    genericBtn: 'Save',
    opts: [{ selector: "vatType", vals: ["Input", "Output"] }]
  };

  passDataTaxDetailsCreditableWtax: any = {
    tableData: this.accountingService.getARTaxDetailsWTAX(),
    tHeader: ["BIR Tax Code", "Description", "WTax Rate", "Payor", "Base Amount", "WTax Amount"],
    dataTypes: ["select", "text", "currency", "text", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    pageLength: 5,
    widths: [],
    paginateFlag: true,
    nData: new ARTaxDetailsWTAX(null, null, null, null, null, null),
    total: [null, null, null, 'Total', null, 'wtaxAmount'],
    genericBtn: 'Save',
    opts: [{ selector: "birTaxCode", vals: ["", "WC020", "WC002", "WC110"] }]
  };

  //temporary
  kuha(event) {
    var birTaxCode = event.target.closest('tr').children[0].closest('td').children[0].closest('div').children[0].value;
    var wTaxRate = 0;
    var baseAmount = event.target.closest('tr').children[4].closest('td').children[0].closest('div').children[0].value;

    if (birTaxCode == "WC110") {
      wTaxRate = 1.10;
    } else if (birTaxCode == "WC002") {
      wTaxRate = 0.02;
    } else if (birTaxCode == "WC020") {
      wTaxRate = 0.20;
    }
    event.target.closest('tr').children[2].closest('td').children[0].closest('div').children[0].value = wTaxRate;
    var wTaxAmount = wTaxRate * baseAmount;
    event.target.closest('tr').children[5].closest('td').children[0].closest('div').children[0].value = wTaxAmount;
  }

  //temporary
  // getSelected(event) {
  //   var wTaxtRate = event.target.closest('tr').children[2].closest('td').children[0].closest('div').children[0].value;
  //   var wTaxAmount = event.target.closest('tr').children[5].closest('td').children[0].closest('div').children[0].value;
  //   var baseAmount = event.target.closest('tr').children[4].closest('td').children[0].closest('div').children[0].value
  //   console.log('tax rate: ' + wTaxtRate + " / base amount: " + baseAmount + " / tax amount: " + wTaxAmount);
  // }


  amountDetailsData: any = {
    tableData: [
      {
        detail: 'Gross Amount (VAT Inc)',
        amount: 2000000,
        amountPHP: 2000000,
        plusMinus: 'None',
        amountPlusMinus: 0
      },
      {
        detail: 'Vatable Sales',
        amount: 1785714.29,
        amountPHP: 1785714.29,
        plusMinus: 'Add',
        amountPlusMinus: 1785714.29
      },
      {
        detail: 'VAT-Exempt Sales',
        amount: 0,
        amountPHP: 0,
        plusMinus: 'Add',
        amountPlusMinus: 0
      },
      {
        detail: 'VAT Zero-Rated Sales',
        amount: 0,
        amountPHP: 0,
        plusMinus: 'Add',
        amountPlusMinus: 0
      },
      {
        detail: 'VAT (12%)',
        amount: 214285.71,
        amountPHP: 214285.71,
        plusMinus: 'Add',
        amountPlusMinus: 214285.71
      },
      {
        detail: 'Creditable Wtax (20%)',
        amount: 357142.86,
        amountPHP: 357142.86,
        plusMinus: 'Add',
        amountPlusMinus: -357142.86
      },
    ],
    tHeader: ['Detail', 'Amount', 'Amount (PHP)', 'Plus/Minus', 'Amount Plus/Minus'],
    dataTypes: ['text', 'currency', 'currency', 'text', 'currency'],
    nData: [null, null, null, null, null],
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', 'amountPlusMinus'],
    genericBtn: 'Save'
  }

  accEntriesData: any = {
    tableData: [
      [null, null, null, null, null, null]
    ],
    tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
    dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
    nData: [null, null, null, null, null, null],
    paginateFlag: true,
    infoFlag: true,
    pageID: 2,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', null, null],
    genericBtn: 'Save'
  }


  constructor(private titleService: Title, private modalService: NgbModal, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | AR Details");
    console.log(
      this.passDataTaxDetailsCreditableWtax.opts.value
    );

  }


}
