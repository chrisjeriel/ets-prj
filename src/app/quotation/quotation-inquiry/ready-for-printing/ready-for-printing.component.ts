import { Component, OnInit } from '@angular/core';
import { QuotationService } from '@app/_services'

@Component({
  selector: 'app-ready-for-printing',
  templateUrl: './ready-for-printing.component.html',
  styleUrls: ['./ready-for-printing.component.css']
})
export class ReadyForPrintingComponent implements OnInit {


  constructor(private quotationService: QuotationService) { }

  passData: any = {
    tHeader: [
      "Quotation No", "Approved By", "Type of Cession", "Line Class","Status", "Ceding Company", "Principal", "Contractor", "Insured","Risk","Object","Site","Currency","Quote Date","Valid Until","Requested By"
    ],

    resizable: [
      true, true, true, true, true, true, true,true,true, true, true, true, true, true, true,true
    ],
    dataTypes: [
      "text", "text", "text", "text", "text", "text", "text", "text","text", "text", "text", "text", "text", "date", "date", "text"
    ],

    tableData: this.quotationService.getReadyForPrinting(),
    pageLength: 10,

  }

  ngOnInit() {

  }

}
