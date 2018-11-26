import { Component, OnInit } from '@angular/core';
import { QuotationInfo } from '../../_models/QuoteOption'
import { QuoteEndorsment } from '../../_models/QuoteEndorsment'

@Component({
  selector: 'app-quote-endorsment',
  templateUrl: './quote-endorsment.component.html',
  styleUrls: ['./quote-endorsment.component.css']
})
export class QuoteEndorsmentComponent implements OnInit {
  private quotationInfo: QuotationInfo;
  private quoteEndorsment: QuoteEndorsment;
  constructor() { }

  ngOnInit() {
  	this.quotationInfo = new QuotationInfo();
  	this.quotationInfo.quotationNo = "Quotation No";
  	this.quotationInfo.quotationName ="Quotation Name";
  }
}
