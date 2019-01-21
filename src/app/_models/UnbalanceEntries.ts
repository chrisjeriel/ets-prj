export class UnbalanceEntries{
	tranType:string;
	refNo:string;
	tranDate:Date;
	payeePayor:string;
	particulars:string;
	status:string;
	transID:number;
	totalDebit:number;
	totalCredit:number;
	variance: number;
	constructor(tranType:string,refNo:string,tranDate:Date,payeePayor:string,particulars:string,status:string,transID:number,totalDebit:number,totalCredit:number, variance: number) {
		this.tranType = tranType;
		this.refNo = refNo;
		this.tranDate = tranDate;
		this.payeePayor = payeePayor;
		this.particulars = particulars;
		this.status = status;
		this.transID = transID;
		this.totalDebit = totalDebit;
		this.totalCredit = totalCredit;
		this.variance = variance;
	}	
}