export class ReadyForPrint {

	quotationNo: string
	approvedBy: string
	typeOfCession: string
	lineClass: string
	status: string
	cedingCompany: string
	principal: string
	contractor: string
	insured: string
	risk: string
	object: string
	site: string
	currency: string
	quoteDate: Date
	validUntil: Date
	requestedBy: string

	constructor(quotationNo: string,approvedBy: string,typeOfCession: string,lineClass: string,status: string,cedingCompany: string,principal: string,contractor: string,insured: string,risk: string,object: string,site: string,currency: string,quoteDate: Date,validUntil: Date,requestedBy: string){

		this.quotationNo = quotationNo;
		this.approvedBy = approvedBy;
		this.typeOfCession = typeOfCession;
		this.lineClass = lineClass;
		this.status = status;
		this.cedingCompany = cedingCompany;
		this.principal = principal;
		this.contractor = contractor;
		this.insured = insured;
		this.risk = risk;
		this.object = object;
		this.site = site;
		this.currency = currency;
		this.quoteDate = quoteDate;
		this.validUntil = validUntil;
		this.requestedBy = requestedBy;
	}
}