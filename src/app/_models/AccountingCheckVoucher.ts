export class CVListing {
	cvYear: Date;
	cvNo: number;
	payee:string;
	cvDate: Date;
	status:string;
	particulars: string;
	amount:number;

	constructor(cvYear: Date,cvNo: number,payee:string,cvDate: Date,status:string,particulars: string,amount:number){
		this.cvYear = cvYear;
		this.cvNo = cvNo;
		this.payee = payee;
		this.cvDate = cvDate;
		this.status = status;
		this.particulars = particulars;
		this.amount = amount;
	}
}