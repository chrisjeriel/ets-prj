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