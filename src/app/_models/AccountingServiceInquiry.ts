export class AccSrvInquiry {
	tranType: string;
	refNo: string;
	tranDate: Date;
	payee: string;
	particulars: string;
	editedBy: string;
	dateEdited: Date;
	reason: string;
	status: string;
	amount: number;

	constructor(tranType: string, 
		refNo: string,
		tranDate: Date,
		payee: string, 
		particulars: string,
		editedBy: string,
		dateEdited: Date,
		reason: string,
		status: string,
		amount: number) {

		this.tranType = tranType;
		this.refNo = refNo;
		this.tranDate	= tranDate;
		this.payee = payee;
		this.particulars = particulars;
		this.editedBy = editedBy;
		this.dateEdited = dateEdited;
		this.reason = reason;
		this.status = status;
		this.amount = amount;
	}
}
