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
		this.quotationGenInfo.year = 2222;
		this.quotationGenInfo.seqNo = 10230;
		this.quotationGenInfo.reqSeq = "MOCK DATA";
		this.quotationGenInfo.histNo = "MOCK DATA";
		this.quotationGenInfo.branch = "MOCK DATA";
		this.quotationGenInfo.lineClass = "MOCK DATA";
		this.quotationGenInfo.policyNumber = "MOCK DATA";
		this.quotationGenInfo.printedBy = "";
		this.quotationGenInfo.printDate;
		this.quotationGenInfo.cedingCompany = "";
		this.quotationGenInfo.quoteStatus = "";
		this.quotationGenInfo.quoteDate;
		this.quotationGenInfo.validUntil;
		this.quotationGenInfo.requestedBy = "";
		this.quotationGenInfo.requestedDate;
		this.quotationGenInfo.requestedMode = "";

	}

	reqMode: SelectRequestMode[] = [
		{ name: 'Web Portal', value: 'Web Portal' },
		{ name: 'Fax', value: 'Fax' },
		{ name: 'Email', value: 'Email' },
		{ name: 'Phone', value: 'Phone' },
		{ name: 'etc', value: 'etc' },
	];

}
export interface SelectRequestMode {
	name: string;
	value: string;
}