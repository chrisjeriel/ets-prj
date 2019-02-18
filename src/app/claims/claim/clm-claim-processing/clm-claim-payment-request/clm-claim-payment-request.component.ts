import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-clm-claim-payment-request',
  templateUrl: './clm-claim-payment-request.component.html',
  styleUrls: ['./clm-claim-payment-request.component.css']
})
export class ClmClaimPaymentRequestComponent implements OnInit {
  tableData: any[] = [
    ["CSR-2018-12-00001", "Issued", "4", "Loss", "Partial Payment", "PHP", -351000, 350842.89, "CV-000101", new Date("2018-11-24")],
    ["CSR-2018-12-00002", "Issued", "5", "Loss", "Full Payment", "PHP", 0, 348532.75, "CV-000102", new Date("2018-11-24")],
  ];

  tHeader: string[] = [];
  dataTypes: string[] = [];
  dataTypes2: string[] = [];
  paginateFlag;
  pageStatus;
  pageLength = 10;
  resizable;

  passData: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    pagination: true,
    pageStatus: true,
    pageLength: 10,
    tableOnly: true,
    resizable: [false, false, false, false, false, false, false, false, false, false],
  };
  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Generate Payment Request");
    this.passData.tHeader.push("Payment Request No.", "Status", "Hist. No.", "Hist. Type", "Type", "Curr", "Reserve", "Payment Amount", "Ref. No.", "Ref. Date");
    this.passData.dataTypes.push("text", "text", "number", "text", "text", "text", "number", "number", "text", "date");
    this.passData.tableData = this.tableData;
  }

}
