export class ClaimsHistoryInfo{
	historyNo : string;
	amountType: string;
	historyType: string;
	currency: string;
	amount: number;
	remarks: string;
	accountingTranId: number
	accountingDate:  Date;

constructor(historyNo : string,amountType: string,historyType: string,currency: string,amount: number,remarks: string,accountingTranId: number,accountingDate:  Date){

	this.historyNo = historyNo;
	this.amountType = amountType;
	this.historyType = historyType;
	this.currency = currency;
	this.amount = amount;
	this.remarks = remarks;
	this.accountingTranId = accountingTranId;
	this.accountingDate = accountingDate;
}

}

