export class AccountingItClaimOverPaymentAr{
	claimNo: string;
	policyNo: string;
	insured: string;
	lossDate: Date;
	lossCover: string;
	claimPaidAmount: number;
	currency: string;
	currRate: number;
	amount: number;
	amountPhp: number;

	constructor(claimNo: string, policyNo: string, insured: string, lossDate: Date,
				lossCover: string, claimPaidAmount: number, currency: string, currRate: number, 
				amount: number, amountPhp: number){
		this.claimNo = claimNo;
		this.policyNo = policyNo;
		this.insured = insured;
		this.lossDate = lossDate;
		this.lossCover = lossCover;
		this.claimPaidAmount = claimPaidAmount;
		this.currency = currency;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;
	}
}