export class HoldCoverInfo {
	quotationNo: String;
	cedingCompany: string;
	insured:string;
	risk:string;
	holdCoverNo:string;
	periodFrom:Date;
	coRefHoldCoverNo: string;
	periodTo: Date;
	requestedBy: string;
	requestDate: Date;
	status: string;

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
