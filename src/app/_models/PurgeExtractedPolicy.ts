export class PurgeExtractedPolicy {
	policyNo: string;
	tSIAmount: number;
	premiumAmount: number;
	expiryDate: Date;
	expired:boolean;
	processed:boolean;
	
	constructor(policyNo: string,tSIAmount: number,premiumAmount: number,expiryDate: Date,expired:boolean,processed:boolean){
		this.policyNo = policyNo;
		this.tSIAmount = tSIAmount;
		this.premiumAmount = premiumAmount;
		this.expiryDate = expiryDate;
		this.expired = expired;
		this.processed = processed;
	}

}