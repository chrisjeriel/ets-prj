export class AltPARListing {
	policyNo : string
	typeCession : string
	lineClass : string
	status : string
	cedingCompany : string
	principal: string
	contractor : string
	insured : string

	risk: string
	object : string
	site : string
	quotationNo : string
	company : string
	issueDate : Date
	inceptionDate : Date
	expiryDate : Date
	createdBy : string


	constructor(policyNo : string,typeCession : string,lineClass : string,status : string,cedingCompany : string,principal:string,contractor : string,insured : string,risk: string,object : string,site : string,quotationNo : string,company : string,issueDate : Date,inceptionDate : Date,expiryDate : Date,createdBy : string) {
		
		this.policyNo = policyNo;
		this.typeCession = typeCession;
		this.lineClass = lineClass;
		this.status = status;
		this.cedingCompany = cedingCompany;
		this.principal = principal;
		this.contractor = contractor;
		this.insured = insured;
		this.risk = risk;
		this.object = object;
		this.site= site;
		this.quotationNo = quotationNo;
		this.company = company;
		this.issueDate = issueDate;
		this.inceptionDate = inceptionDate;
		this.expiryDate = expiryDate;
		this.createdBy = createdBy;
	}

}