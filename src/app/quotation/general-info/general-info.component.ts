import { Component, OnInit } from '@angular/core';
import { QuotationGenInfo } from '../../_models';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {

  private quotationGenInfo: QuotationGenInfo;

  constructor() { }

  ngOnInit() {
  	this.quotationGenInfo = new QuotationGenInfo();
  	this.quotationGenInfo.line = "MCS";
	this.quotationGenInfo.year = 2018;
	this.quotationGenInfo.seqNo = 10230;
	this.quotationGenInfo.reqSeq = "MOCK DATA";
	this.quotationGenInfo.histNo = "MOCK DATA";
	this.quotationGenInfo.branch = "MOCK DATA";
	this.quotationGenInfo.lineClass = "MOCK DATA";
	this.quotationGenInfo.policyNumber = "MOCK DATA";
  }

}
