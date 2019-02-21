export class QuotationInfo {
    quotationNo: string;
    insuredName: string;
}

export class QuotationOption{
	optionId: number;
	optionRt: number;
	condition:string;
	commRtQuota:number;
	commRtSurplus:number;
	commRtFac:number;
	deductiblesList: any[];
	constructor(optionId: number,optionRt: number,condition:string,commRtQuota:number,commRtSurplus:number,commRtFac:number,deductiblesList?: any[]){
		this.optionId=optionId;
		this.optionRt=optionRt;
		this.condition=condition;
		this.commRtQuota=commRtQuota;
		this.commRtSurplus=commRtSurplus;
		this.commRtFac=commRtFac;
		this.deductiblesList = deductiblesList;
	}
}

export class QuotationDeductibles{
	deductibleCd: string
    deductibleTitle: string;
    deductibleRt: number;
    deductibleAmt: number;
    deductibleTxt: string;
    constructor(deductibleCd:string,deductibleTitle: string, deductibleRt: number, deductibleAmt: number, deductibleTxt: string){
    	this.deductibleCd = deductibleCd;
        this.deductibleTitle = deductibleTitle;
        this.deductibleRt = deductibleRt;
        this.deductibleAmt = deductibleAmt;
        this.deductibleTxt = deductibleTxt;
    }
}

export class QuotationOtherRates{
	coverCd:number;
	coverCdDesc:string;
    rate: number;
	amount:number;
	constructor(coverCd:number,coverCdDesc:string,rate: number, amount:number){
		this.coverCd = coverCd;
		this.coverCdDesc=coverCdDesc;
        this.rate = rate;
		this.amount=amount;
	}
}