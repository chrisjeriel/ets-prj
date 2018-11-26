export class QuotationInfo {
    quotationNo: string;
    quotationName: string;
}

export class QuotationOption{
	optionNo: number;
	rate: number;
	conditions:string;
	commRateFac:number;
	commRateQuota:number;
	commRateSurplus:number;
	constructor(optionNo: number,rate: number,conditions:string,commRateFac:number,commRateQuota:number,commRateSurplus:number){
		this.optionNo=optionNo;
		this.rate=rate;
		this.conditions=conditions;
		this.commRateFac=commRateFac;
		this.commRateQuota=commRateQuota;
		this.commRateSurplus=commRateSurplus;
	}
}

export class QuotationOtherRates{
	others:string;
	amounts:number;
	deductibleRemarks:string;
	constructor(others:string,amounts:number,deductibleRemarks:string){
		this.others=others;
		this.amounts=amounts;
		this.deductibleRemarks=deductibleRemarks;
	}
}