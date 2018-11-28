import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../_services';
import { QuotationProcessing } from '../../_models';


@Component({
  selector: 'app-quotation-processing',
  templateUrl: './quotation-processing.component.html',
  styleUrls: ['./quotation-processing.component.css']
})
export class QuotationProcessingComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];
  nData: QuotationProcessing = new QuotationProcessing(null, null, null, null, null, null, null, null, null, null, null, null);

  constructor(private quotationService: QuotationService) { }

  ngOnInit() {
  	this.tHeader.push("Quotation No");
  	this.tHeader.push("Branch");
  	this.tHeader.push("Line Class");
  	this.tHeader.push("Quote Status");
  	this.tHeader.push("Ceding Company");
  	this.tHeader.push("Principal");
  	this.tHeader.push("Contractor");
  	this.tHeader.push("Insured");
  	this.tHeader.push("Quote Date");
  	this.tHeader.push("Validity Date");
  	this.tHeader.push("Requested By");
  	this.tHeader.push("Created By");

  	this.tableData = this.quotationService.getQuoProcessingData();
  }

}
