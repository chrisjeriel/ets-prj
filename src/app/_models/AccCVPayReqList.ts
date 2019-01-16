export class AccCVPayReqList {
	year : string;
	seqNo : string;
	payee: string;
	paymentType : string;
	status : string;
	requestDate : Date;
	particulars : string;
	requestedBy : string;
	curr : string;
	amount : number;

	constructor(
			year : string,
			seqNo : string,
			payee : string,
			paymentType : string,
			status : string,
			requestDate : Date,
			particulars : string,
			requestedBy : string,
			curr : string,
			amount : number){

		this.year = year;
		this.seqNo = seqNo;
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