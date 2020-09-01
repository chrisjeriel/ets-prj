export class AccountingRequestsListRP{
	paytReqNo: string;
	payee: string;
	paymentType: string;
	status: string;
	requestDate: Date;
	particulars: string;
	currency: string;
	amount: number;
	requestedBy: string;

	constructor(paytReqNo: string, payee: string, paymentType: string, status: string, requestDate: Date, particulars: string, currency: string, amount: number, requestedBy: string){
		this.paytReqNo = paytReqNo;
		this.payee = payee;
		this.paymentType = paymentType;
		this.status = status;
		this.requestDate = requestDate;
		this.particulars = particulars;
		this.currency = currency;
		this.amount = amount;
		this.requestedBy = requestedBy;
	}
}