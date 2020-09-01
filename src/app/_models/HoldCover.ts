export class HoldCoverInfo {
	quotationNo: string;
	cedingCompany: string;
	insured:string;
	risk:string;
	holdCoverNo:string;
	periodFrom:string;
	requestedBy: string;
	periodTo: string;
	requestDate: string;
	coRefHoldCoverNo: string;
	preparedBy:string;
	status: string;
	approvedBy:string;

	// constructor(quotationNo: string,cedingCompany: string,insured:string,risk:string,holdCoverNo:string,periodFrom:Datestring,requestedBy: string,periodTo: Datestring,requestDate: Datestring,coRefHoldCoverNo: string,preparedBy:string,status: string,approvedBy:string){
	// 	this.quotationNo	= quotationNo	;
	// 	this.cedingCompany	= cedingCompany	;
	// 	this.insured	= insured	;
	// 	this.risk	= risk	;
	// 	this.holdCoverNo	= holdCoverNo	;
	// 	this.periodFrom	= periodFrom	;
	// 	this.requestedBy	= requestedBy	;
	// 	this.periodTo	= periodTo	;
	// 	this.requestDate	= requestDate	;
	// 	this.coRefHoldCoverNo	= coRefHoldCoverNo	;
	// 	this.preparedBy	= preparedBy	;
	// 	this.status	= status	;
	// 	this.approvedBy	= approvedBy	;
	// }
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
