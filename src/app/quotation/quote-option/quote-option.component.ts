import { Component, OnInit } from '@angular/core';
import { QuotationInfo, QuotationOption, QuotationOtherRates } from '../../_models/QuoteOption';


@Component({
  selector: 'app-quote-option',
  templateUrl: './quote-option.component.html',
  styleUrls: ['./quote-option.component.css']
})
export class QuoteOptionComponent implements OnInit {
  private quotationInfo: QuotationInfo;
  private quotationOption: QuotationOption;
  private quotationOtherRates: QuotationOtherRates;

  constructor() { }

  ngOnInit() {
  	this.quotationInfo = new QuotationInfo();
  	this.quotationInfo.quotationNo = "Quotation No";
  	this.quotationInfo.quotationName ="Quotation Name";
  }
  
  save(){
  	console.log(this.quotationInfo);
  }

}
