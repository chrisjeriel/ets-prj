export class PolicyEndorsement{
	c: string;
	endtCode: string;
	endtTitle: string;
	remarks: string;

	constructor(c:string,endtCode:string,endTitle: string, remarks: string){
		this.c = c;
		this.endtCode = endtCode;
		this.endtTitle = endTitle;
		this.remarks = remarks;
	}
}
