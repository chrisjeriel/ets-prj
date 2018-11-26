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
}

export class QuotationOtherRates{
	others:string;
	amounts:string;
	deductibleRemarks:string;
}