export class AccountingItClaimCashCallAr{
	claimNo: string;
	policyNo: string;
	insured: string;
	lossDate: Date;
	lossCover: string;
	histNo: string;
	historyType: string;
	paidAmount: number;
	reserveAmount: number;
	currency: string;
	currRate: number;
	amount: number;
	amountPhp: number;

	constructor(claimNo: string, policyNo: string, insured: string, lossDate: Date,
				lossCover: string, histNo:string, historyType: string, paidAmount: number, 
				reserveAmount: number, currency: string, currRate: number, 
				amount: number, amountPhp: number){
		this.claimNo = claimNo;
		this.policyNo = policyNo;
		this.insured = insured;
		this.lossDate = lossDate;
		this.lossCover = lossCover;
		this.histNo = histNo;
		this.historyType = historyType;
		this.paidAmount	= paidAmount;
		this.reserveAmount = reserveAmount;
		this.currency = currency;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;
	}
}