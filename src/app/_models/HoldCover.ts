export class HoldCoverInfo {
	quotationNo: number;
	insured: string;
	risk: string;
	holdCoverNo: number;
	compRefHoldCoverNo: number;
	status: string;
	periodFrom: Date = new Date();
	periodTo: Date = new Date();
	requestedBy: string;
	requestDate: Date = new Date(); 

	/*constructor(quotationNo: number,insured: string,risk: string, holdCoverNo: number,compRefHoldCoverNo: number,
				status: string,periodFrom: Date,periodTo: Date, requestedBy: string, requestDate: Date){
		this.quotationNo = quotationNo;
		this.insured = insured;
		this.risk = risk;
		this.holdCoverNo = holdCoverNo;
		this.compRefHoldCoverNo = compRefHoldCoverNo;
		this.status = status;
		this.periodFrom = periodFrom;
		this.periodTo = periodTo;
		this.requestedBy = requestedBy;
		this.requestDate = requestDate;

	}*/
}
