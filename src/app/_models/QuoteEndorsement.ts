export class QuoteEndorsement{
	endtCode: string;
	endtTitle: string;
	endtDescription: string;
	endtWording: string;

	constructor(endtCode:string,endTitle: string,endtDescription: string,endtWording: string){
		this.endtCode = endtCode;
		this.endtTitle = endTitle;
		this.endtDescription = endtDescription;
		this.endtWording = endtWording;
	}
}
