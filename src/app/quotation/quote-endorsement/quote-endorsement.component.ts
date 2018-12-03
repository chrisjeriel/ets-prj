import { Component, OnInit } from '@angular/core';
import { QuotationInfo } from '../../_models/QuoteOption'
import { QuoteEndorsement } from '../../_models/QuoteEndorsement'
import { QuotationService } from '../../_services';

@Component({
  selector: 'app-quote-endorsement',
  templateUrl: './quote-endorsement.component.html',
  styleUrls: ['./quote-endorsement.component.css']
})
export class QuoteEndorsementComponent implements OnInit {
  private quotationInfo: QuotationInfo;
  private quoteEndorsement: QuoteEndorsement;
  tableData: any[] = [];
  tHeader: any[] = ['Endt Title', 'Endt Description', 'Wording','Edit Flag'];
  magnifyingGlass: any[]=["endtDescription"]
  nData: QuoteEndorsement = new QuoteEndorsement(null, null, null);
  constructor(private quotationService: QuotationService) { }

  ngOnInit() {
  	this.quotationInfo = new QuotationInfo();
  	this.quotationInfo.quotationNo = "SMP-0000-0000-00";
  	this.quotationInfo.insuredName ="Insured Name";

    this.tableData = this.quotationService.getEndorsements();

  }
}
