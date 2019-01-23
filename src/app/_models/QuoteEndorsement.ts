export class QuoteEndorsement{
	optionNo: number;
	endtCode: string;
	endtTitle: string;
	endtDescription: string;
	endtWording: string;

	constructor(optionNo:number,endtCode:string,endTitle: string,endtDescription: string,endtWording: string){
		this.optionNo = optionNo;
		this.endtCode = endtCode;
		this.endtTitle = endTitle;
		this.endtDescription = endtDescription;
		this.endtWording = endtWording;
	}
}
