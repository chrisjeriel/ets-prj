export class ExtractedData{
	date: Date;
	tranType: string;
	refNo: string;
	code: string;
	description: string;
	particulars: string;
	slType: string;
	status: string;
	debit: number;
	credit: number;

	constructor(date: Date,tranType: string,refNo: string,code: string,description: string,particulars: string,slType: string,status: string,debit: number,credit: number){
		this.date = date; 
		this.tranType = tranType; 
		this.refNo = refNo; 
		this.code = code; 
		this.description = description; 
		this.particulars = particulars; 
		this.slType = slType; 
		this.status = status; 
		this.debit = debit; 
		this.credit = credit; 
	}
}