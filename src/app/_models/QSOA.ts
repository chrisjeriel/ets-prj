export class QSOA{
	quarterEnding:string;
	begBalDR:number;
	begBalCR:number;
	endBalDR:number;
	endBalCR:number;
	constructor(quarterEnding:string,begBalDR:number,begBalCR:number,endBalDR:number,endBalCR:number){
		this.quarterEnding = quarterEnding;
		this.begBalDR = begBalDR;
		this.begBalCR = begBalCR;
		this.endBalDR = endBalDR;
		this.endBalCR = endBalCR;
	}
}