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

export class QuotationDeductibles{
	deductibleCode: string
    deductibleTitle: string;
    rate: number;
    amount: number;
    deductibleText: string;
    constructor(deductibleCode:string,deductibleTitle: string, rate: number, amount: number, deductibleText: string){
    	this.deductibleCode = deductibleCode;
        this.deductibleTitle = deductibleTitle;
        this.rate = rate;
        this.amount = amount;
        this.deductibleText = deductibleText;
    }
}

export class QuotationOtherRates{
	optionNo:number;
	others:string;
    rate: number;
	amounts:number;
	constructor(optionNo:number,others:string,rate: number, amounts:number){
		this.optionNo = optionNo;
		this.others=others;
        this.rate = rate;
		this.amounts=amounts;
	}
}