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
    dataTypes: ["text", "text", "text", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    pageLength: 5,
    widths: [],
    paginateFlag: true,
    nData: new ARTaxDetailsVAT(null, null, null, null, null),
    total: [null, null, 'Total', null, 'vatAmount'],
    genericBtn: 'Save'
  };

  passDataTaxDetailsCreditableWtax: any = {
    tableData: this.accountingService.getARTaxDetailsWTAX(),
    tHeader: ["BIR Tax Code", "Description", "WTax Rate", "Payor", "Base Amount", "WTax Amount"],
    dataTypes: ["text", "text", "currency", "text", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    pageLength: 5,
    widths: [],
    paginateFlag: true,
    nData: new ARTaxDetailsWTAX(null, null, null, null, null, null),
    total: [null, null, null, 'Total', null, 'wtaxAmount'],
    genericBtn: 'Save'
  };


  constructor(private titleService: Title, private modalService: NgbModal, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | AR Details");

  }

}
