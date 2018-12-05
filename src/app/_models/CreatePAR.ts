export class CreateParInfo{
	line: string
	year: Date
	
}








export class CreateParTable {
	quotationNo: string
	branch: string
	lineClass: string
	quoteStatus: string
	cedingCompany: string
	principal: string
	contractor: string
	insured: string
	quoteDate: Date
	validityDate: Date
	requestedBy: string
	createdBy: string

	constructor(quotationNo: string,branch: string,lineClass: string,
				quoteStatus: string,cedingCompany: string,principal: string,
				contractor: string,insured: string,quoteDate: Date,
				validityDate: Date,requestedBy: string,createdBy: string){
		
		this.quotationNo = quotationNo;
		this.branch = branch;
		this.lineClass = lineClass;
		this.quoteStatus = quoteStatus;
		this.cedingCompany = cedingCompany;
		this.principal = principal;
		this.contractor = contractor;
		this.insured = insured;
		this.quoteDate = quoteDate;
		this.validityDate = validityDate;
		this.requestedBy = requestedBy;
		this.createdBy = createdBy;

	}
}