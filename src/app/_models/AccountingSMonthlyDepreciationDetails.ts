export class AccountingSMonthlyDepreciationDetails{
	assetDescription: string;
	monthEnd: Date;
	depreciationAmount: number;
	referenceNo: string;

	constructor(assetDescription: string, monthEnd: Date, depreciationAmount: number, referenceNo: string){
		this.assetDescription = assetDescription;
		this.monthEnd = monthEnd;
		this.depreciationAmount = depreciationAmount;
		this.referenceNo = referenceNo;
	}
}