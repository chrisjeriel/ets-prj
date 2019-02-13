export class AccountingSrvcCancelledTransactions{
	tranType: string;
	refNo: string;
	tranDate: Date;
	payeePayor: string;
	particulars: string;
	cancelledBy: string;
	cancelledDate: Date;
	reason: string;
	amount: number;

	constructor(tranType: string, refNo: string, tranDate: Date, payeePayor: string, particulars: string, cancelledBy: string, cancelledDate: Date, reason: string, amount: number){
		this.tranType = tranType;
		this.refNo = refNo;
		this.tranDate = tranDate;
		this.payeePayor = payeePayor;
		this.particulars = particulars;
		this.cancelledBy = cancelledBy;
		this.cancelledDate = cancelledDate;
		this.reason = reason;
		this.amount = amount;
	}
}