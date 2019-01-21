import { Component, OnInit } from '@angular/core';
import { QuotationService } from '@app/_services'

@Component({
  selector: 'app-ready-for-printing',
  templateUrl: './ready-for-printing.component.html',
  styleUrls: ['./ready-for-printing.component.css']
})
export class ReadyForPrintingComponent implements OnInit {


  constructor(private quotationService: QuotationService) { }
  btnDisabled: boolean;
  passData: any = {
    tHeader: [
      "Quotation No", "Approved By", "Type of Cession", "Line Class", "Status", "Ceding Company", "Principal", "Contractor", "Insured", "Risk", "Object", "Site", "Currency", "Quote Date", "Valid Until", "Requested By"
    ],

    resizable: [
      true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true
    ],
    dataTypes: [
      "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "date", "date", "text"
    ],
    filters: [
      {
        key: 'quotationNo',
        title: 'Quotation No',
        dataType: 'text'
      },
      {
        key: 'approvedBy',
        title: 'Approved By',
        dataType: 'text'
      },
      {
        key: 'typeOfCession',
        title: 'Type of Cession',
        dataType: 'text'
      },
      {
        key: 'lineClass',
        title: 'Line Class',
        dataType: 'text'
      },
      {
        key: 'status',
        title: 'Status',
        dataType: 'text'
      },
      {
        key: 'cedingCompany',
        title: 'Ceding Co',
        dataType: 'text'
      },
      {
        key: 'principal',
        title: 'Principal',
        dataType: 'text'
      },
      {
        key: 'contractor',
        title: 'Contractor',
        dataType: 'text'
      },
      {
        key: 'insured',
        title: 'Insured',
        dataType: 'text'
      },
      {
        key: 'risk',
        title: 'Risk',
        dataType: 'text'
      },
      {
        key: 'object',
        title: 'Object',
        dataType: 'text'
      },
      {
        key: 'site',
        title: 'Site',
        dataType: 'text'
      },
      {
        key: 'currency',
        title: 'Currency',
        dataType: 'text'
      },
      {
        key: 'quoteDate',
        title: 'Quote Date',
        dataType: 'date'
      },
      {
        key: 'validUntil',
        title: 'Valid Until',
        dataType: 'date'
      },
      {
        key: 'requestedBy',
        title: 'Requested By',
        dataType: 'text'
      },
    ],

    tableData: this.quotationService.getReadyForPrinting(),
    pageLength: 10,
    checkFlag: true,
    pagination: true,
    pageStatus: true,

  }

  ngOnInit() {
    this.btnDisabled = true;
  }

}
