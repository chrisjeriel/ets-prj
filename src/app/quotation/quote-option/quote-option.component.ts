import { Component, OnInit } from '@angular/core';
import { QuotationInfo, QuotationOption, QuotationOtherRates } from '../../_models';
import { QuotationService } from '../../_services'


@Component({
  selector: 'app-quote-option',
  templateUrl: './quote-option.component.html',
  styleUrls: ['./quote-option.component.css']
})
export class QuoteOptionComponent implements OnInit {
  private quotationInfo: QuotationInfo;
  private quotationOption: QuotationOption;
  private quotationOtherRates: QuotationOtherRates;

  quoteOptionTableData: any[] = [];
  quoteOptionTHeader : any[] = ['Option No','Rate(%)','Conditions','Comm Rate Fac(%)','Comm Rate Quota(%)', 'Comm Rate Surplus(%)'];

  otherRatesTableData: any[] = [];
  otherRatesTHeader: any[] = ['Others', 'Amounts', 'Deductible/Remarks'];

  constructor(private quotationService: QuotationService) { }

  ngOnInit() {
  	this.quotationInfo = new QuotationInfo();
  	this.quotationInfo.quotationNo = "Quotation No";
  	this.quotationInfo.quotationName ="Quotation Name";

    this.quoteOptionTableData = this.quotationService.getQuoteOptions();
    this.otherRatesTableData = this.quotationService.getQuotataionOtherRates();
  }
  
  save(){
  	console.log(this.quotationInfo);
  }

}
