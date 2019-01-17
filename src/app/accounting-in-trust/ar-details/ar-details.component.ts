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


  constructor(private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | AR Details");

  }

}
