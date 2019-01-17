import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-ar-details',
  templateUrl: './ar-details.component.html',
  styleUrls: ['./ar-details.component.css']
})
export class ArDetailsComponent implements OnInit {
  passDataTaxDetailsVat: any = {
    tableData: [["Output", "Services", "Ma. Teresa Leonora", "1785714.29", "214285.71"]],
    tHeader: ["VAT Type", "BIR RLF Purchase Type", "Payor", "Base Amount", "VAT Amount"],
    dataTypes: ["text", "text", "text", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    pageLength: 5,
    widths: [],
    paginateFlag: true,
    nData: [null, null, null, null, null]
  };

  passDataTaxDetailsCreditableWtax: any = {
    tableData: [["WC020", "WTax on Investment Income PHP", "20", "BPI/MS INSURANCE CORPORATION", "1785714.29", "357142.86"]],
    tHeader: ["BIR Tax Code", "Description", "WTax Rate", "Payor", "Base Amount", "WTax Amount"],
    dataTypes: ["text", "text", "currency", "text", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    pageLength: 5,
    widths: [],
    paginateFlag: true,
    nData: [null, null, null, null, null, null]
  };

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
    nData: [null,null,null,null,null],
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
      [null,null,null,null,null,null]
    ],
    tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
    dataTypes: ['text', 'text', 'text', 'text', 'currency','currency'],
    nData: [null,null,null,null,null,null],
    paginateFlag: true,
    infoFlag: true,
    pageID: 2,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', null, null],
    genericBtn: 'Save'
  }


  constructor(private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | AR Details");

  }

}
