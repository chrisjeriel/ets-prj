export class QSOA{
	quarterEnding:Date;
	drBalance:number;
	crBalance:number;
	begBalDR:number;
	begBalCR:number;
	endBalDR:number;
	endBalCR:number;
	constructor(quarterEnding:Date,drBalance:number,crBalance:number,begBalDR:number,begBalCR:number,endBalDR:number,endBalCR:number){
		this.quarterEnding = quarterEnding;
		this.drBalance = drBalance;
		this.crBalance = crBalance;
		this.begBalDR = begBalDR;
		this.begBalCR = begBalCR;
		this.endBalDR = endBalDR;
		this.endBalCR = endBalCR;
	}
}

export class QSOABalances {
	quarterEnding:Date;
	currency: string
	currencyRate: number
	intPremium: number
	withHTax: number
	fundsHRel: number

	constructor(quarterEnding:Date,currency: string,currencyRate: number,intPremium: number,withHTax: number, fundsHRel: number ){
		this.quarterEnding = quarterEnding;
		this.currency = currency;
		this.currencyRate = currencyRate;
		this.intPremium = intPremium;
		this.withHTax = withHTax;
		this.fundsHRel = fundsHRel;
	}
}
;