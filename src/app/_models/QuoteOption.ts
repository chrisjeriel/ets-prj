export class QuotationInfo {
    quotationNo: string;
    insuredName: string;
}

export class QuotationOption{
	optionNo: number;
	rate: number;
	conditions:string;
	commRateQuota:number;
	commRateSurplus:number;
	commRateFac:number;
	constructor(optionNo: number,rate: number,conditions:string,commRateQuota:number,commRateSurplus:number,commRateFac:number){
		this.optionNo=optionNo;
		this.rate=rate;
		this.conditions=conditions;
		this.commRateQuota=commRateQuota;
		this.commRateSurplus=commRateSurplus;
		this.commRateFac=commRateFac;
	}
}

export class QuotationOtherRates{
	optionNo:number;
	others:string;
	amounts:number;
	deductible:string;
	constructor(optionNo:number,others:string,amounts:number,deductible:string){
		this.optionNo = optionNo;
		this.others=others;
		this.amounts=amounts;
		this.deductible=deductible;
	}
}