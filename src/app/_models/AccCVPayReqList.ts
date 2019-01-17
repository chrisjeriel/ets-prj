export class AccCVPayReqList {
	payReqNo : string;
	payee: string;
	paymentType : string;
	status : string;
	requestDate : Date;
	particulars : string;
	requestedBy : string;
	curr : string;
	amount : number;

	constructor(
			payReqNo : string,
			payee : string,
			paymentType : string,
			status : string,
			requestDate : Date,
			particulars : string,
			requestedBy : string,
			curr : string,
			amount : number){

		this.payReqNo = payReqNo;
		this.payee = payee;
		this.paymentType = paymentType;
		this.status = status;
		this.requestDate = requestDate;
		this.particulars = particulars;
		this.requestedBy = requestedBy;
		this.curr = curr;
		this.amount = amount;
	}
}