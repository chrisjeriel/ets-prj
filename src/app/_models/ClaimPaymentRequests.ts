export class ClaimPaymentRequests{
	claimNo:string;
	insured:string;
	cedingCompany:string;
	histNo:string;
	amtType:string;
	histType:string;
	curr:string;
	amount:number;

	constructor(claimNo:string,insured:string,cedingCompany:string,histNo:string,amtType:string,histType:string,curr:string,amount:number){
		this.claimNo=claimNo;
		this.insured=insured;
		this.cedingCompany=cedingCompany;
		this.histNo=histNo;
		this.amtType=amtType;
		this.histType=histType;
		this.curr=curr;
		this.amount=amount;
	}
}