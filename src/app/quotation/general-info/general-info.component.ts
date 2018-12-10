import { Component, OnInit } from '@angular/core';
import { QuotationGenInfo } from '../../_models';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';
import { QuotationService } from '../../_services';


@Component({
	selector: 'app-general-info',
	templateUrl: './general-info.component.html',
	styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {
	private quotationGenInfo: QuotationGenInfo;
	rowData: any[] = this.quotationService.rowData;

	constructor(private quotationService: QuotationService) { }
	ngOnInit() {
		if(this.quotationService.toGenInfo == 'edit'){
			this.quotationGenInfo = new QuotationGenInfo();
			this.quotationGenInfo.line = this.rowData[0];
			this.quotationGenInfo.year = new Date().getFullYear();
			this.quotationGenInfo.seqNo;
			this.quotationGenInfo.reqSeq;
			this.quotationGenInfo.histNo = "MOCK DATA";
			this.quotationGenInfo.branch = this.rowData[1];
			this.quotationGenInfo.lineClass = "MOCK DATA";
			this.quotationGenInfo.policyNumber = 0;
			this.quotationGenInfo.printedBy = "MOCK DATA";
			this.quotationGenInfo.printDate;
			this.quotationGenInfo.cedingCompany = this.rowData[4];
			this.quotationGenInfo.quoteStatus = this.rowData[3];
			this.quotationGenInfo.quoteDate = new Date(this.rowData[8]);
			this.quotationGenInfo.validUntil = new Date(this.rowData[9]);
			this.quotationGenInfo.requestedBy = this.rowData[10];
			this.quotationGenInfo.requestedDate;
			this.quotationGenInfo.requestedMode = "MOCK DATA";
			this.quotationGenInfo.principal = this.rowData[5];
			this.quotationGenInfo.contractor = this.rowData[6];
			this.quotationGenInfo.insured = this.rowData[7];
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

		} else {
			this.quotationGenInfo = new QuotationGenInfo();
			this.quotationGenInfo.line = "EN";
			this.quotationGenInfo.year = new Date().getFullYear();
			this.quotationGenInfo.seqNo;
			this.quotationGenInfo.reqSeq;
			this.quotationGenInfo.histNo = "MOCK DATA";
			this.quotationGenInfo.branch = "MOCK DATA";
			this.quotationGenInfo.lineClass = "MOCK DATA";
			this.quotationGenInfo.policyNumber = 0;
			this.quotationGenInfo.printedBy = "MOCK DATA";
			this.quotationGenInfo.printDate;
			this.quotationGenInfo.cedingCompany = "MOCK DATA";
			this.quotationGenInfo.quoteStatus = "MOCK DATA";
			this.quotationGenInfo.quoteDate = new Date();
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

		console.log(this.rowData);
	}

	reqMode: SelectRequestMode[] = [
	{ name: '', value: '' },
	{ name: 'Web Portal', value: 'Web Portal' },
	{ name: 'Fax', value: 'Fax' },
	{ name: 'Email', value: 'Email' },
	{ name: 'Phone', value: 'Phone' },
	{ name: 'etc', value: 'etc' },
	];

	//getting value
	func(a: string, b: Date) {
		this.quotationGenInfo.createdBy = a;
		this.quotationGenInfo.lastUpdate = b;
		console.log(this.quotationGenInfo.createdBy);
		console.log(this.quotationGenInfo.lastUpdate);
	}

	defaultValues(year: Date) {
		year = new Date();
		year.getFullYear();
	}

}
export interface SelectRequestMode {
	name: string;
	value: string;
}
