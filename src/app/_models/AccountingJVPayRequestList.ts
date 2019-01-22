export class AccJVPayReqList{
	payReqNo: string;
	payee: string;
	payType: string;
	status: string;
	reqDate: Date;
	particulars: string;
	requestedBy: string;
	curr: string;
	amount: number;

	constructor(payReqNo: string, 
		payee: string,
		payType: string,
		status: string,
		reqDate: Date,
		particulars: string,
		requestedBy: string,
		curr: string,
		amount: number
		){
		this.payReqNo = payReqNo;
		this.payee = payee;
		this.payType = payType;
		this.status = status;
		this.reqDate = reqDate;
		this.particulars = particulars;
		this.requestedBy = requestedBy;
		this.curr = curr;
		this.amount = amount;
		
	}
}