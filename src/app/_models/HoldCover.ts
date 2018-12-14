export class HoldCoverInfo {
	quotationNo: String;
	cedingCompany: string;
	insured:string;
	risk:string;
	holdCoverNo:string;
	periodFrom:Date;
	requestedBy: string;
	periodTo: Date;
	requestDate: Date;
	coRefHoldCoverNo: string;
	preparedBy:string;
	status: string;
	approvedBy:string;

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
