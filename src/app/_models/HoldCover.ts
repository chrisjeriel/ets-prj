export class HoldCoverInfo {
	quotationNo: number;
	insured: string;
	risk: string;
	holdCoverNo: number;
	compRefHoldCoverNo: number;
	status: string;
	periodFrom: Date;
	periodTo: Date
	requestedBy: string;
	requestDate: Date; 
}

export class QuotationHoldCover {
	quotationNo: string
	cedingCompany: string
	insured: string
	risk: string

	constructor(quotationNo: string,cedingCompany: string,insured: string,risk: string){
		
		this.quotationNo = quotationNo;
		this.cedingCompany = cedingCompany;
		this.insured = insured;
		this.risk = risk;

	}
}
