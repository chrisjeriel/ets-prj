import { Component, OnInit } from '@angular/core';
import { QuotationInfo } from '../../_models/QuoteOption'
import { QuoteEndorsment } from '../../_models/QuoteEndorsment'
import { QuotationService } from '../../_services';

@Component({
  selector: 'app-quote-endorsment',
  templateUrl: './quote-endorsment.component.html',
  styleUrls: ['./quote-endorsment.component.css']
})
export class QuoteEndorsmentComponent implements OnInit {
  private quotationInfo: QuotationInfo;
  private quoteEndorsment: QuoteEndorsment;
  tableData: any[] = [];
  tHeader: any[] = ['Endt Title', 'Endt Description', 'Wording' ];
  constructor(private quotationService: QuotationService) { }

  ngOnInit() {
  	this.quotationInfo = new QuotationInfo();
  	this.quotationInfo.quotationNo = "SMP-0000-0000-00";
  	this.quotationInfo.insuredName ="Insured Name";

    this.tableData = this.quotationService.getEndorsments();

  }
}
