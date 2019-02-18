export class CVListing {
	cvNo: string;
	payee:string;
	cvDate: Date;
	status:string;
	particulars: string;
	amount:number;

	constructor(cvNo: string,payee:string,cvDate: Date,status:string,particulars: string,amount:number){
		this.cvNo = cvNo;
		this.payee = payee;
		this.cvDate = cvDate;
		this.status = status;
		this.particulars = particulars;
		this.amount = amount;
	}
}