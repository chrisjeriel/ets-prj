
export class ClaimsHistoryInfo {
	histNo: string;
	histType: string;
	type: string;
	exGratia:boolean;
	currency: string;
	reserve: number;
	paymentAmount: number;
	refNo: string;
	refDate: Date;
	remarks: string;

	constructor(histNo: string, histType: string, type: string,exGratia:boolean, currency: string, reserve: number, paymentAmount: number, refNo: string, refDate: Date, remarks: string) {
		this.histNo = histNo;
		this.histType = histType;
		this.type = type;
		this.exGratia = exGratia;
		this.currency = currency;
		this.reserve = reserve;
		this.paymentAmount = paymentAmount;
		this.refNo = refNo;
		this.refDate = refDate;
		this.remarks = remarks;

	}
}

