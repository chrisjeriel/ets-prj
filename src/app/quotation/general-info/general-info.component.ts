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
		this.quotationGenInfo.printedBy = "MOCK DATA";
		this.quotationGenInfo.printDate;
		this.quotationGenInfo.cedingCompany = "MOCK DATA";
		this.quotationGenInfo.quoteStatus = "MOCK DATA";
		this.quotationGenInfo.quoteDate;
		this.quotationGenInfo.validUntil;
		this.quotationGenInfo.requestedBy = "MOCK DATA";
		this.quotationGenInfo.requestedDate;
		this.quotationGenInfo.requestedMode = "MOCK DATA";
		this.quotationGenInfo.principal = "MOCK DATA";
		this.quotationGenInfo.contractor = "MOCK DATA";
		this.quotationGenInfo.insured = "MOCK DATA";
		this.quotationGenInfo.propertyProjectDescription = "MOCK DATA";
		this.quotationGenInfo.site = "MOCK DATA";
		this.quotationGenInfo.durationTesting = "MOCK DATA";
		this.quotationGenInfo.risk = "MOCK DATA";
		this.quotationGenInfo.object = "MOCK DATA";
		this.quotationGenInfo.location = "MOCK DATA";
		this.quotationGenInfo.share = "MOCK DATA";
		this.quotationGenInfo.partOf100 = "MOCK DATA";
		this.quotationGenInfo.intermediary = "MOCK DATA";
		this.quotationGenInfo.governmentFlag = "MOCK DATA";
		this.quotationGenInfo.indicative = "MOCK DATA";
		this.quotationGenInfo.openCover = "MOCK DATA";
		this.quotationGenInfo.declaration = "MOCK DATA";
		this.quotationGenInfo.openingParagraph = "MOCK DATA";
		this.quotationGenInfo.closingParagraph = "MOCK DATA";
		this.quotationGenInfo.createdBy = "MOCK DATA";
		this.quotationGenInfo.dateCreated;
		this.quotationGenInfo.lastUpdate;
		this.quotationGenInfo.lastUpdateBy = "MOCK DATA";

	}

	reqMode: SelectRequestMode[] = [
		{ name: '', value: '' },
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