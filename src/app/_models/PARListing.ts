export class PARListing {

	line : string
	policyNo : string
	typeCession : string
	cedingCompany : string
	insured : string
	risk: string
	object : string
	site : string
	currency : string
	sumInsured : number
	premium : number
	issueDate : Date
	inceptionDate : Date
	expiryDate : Date
	accountingDate : Date
	status : string


	constructor(
		line : string,
		policyNo : string,
		typeCession : string,
		cedingCompany : string,
		insured : string,
		risk: string,
		object : string,
		site : string,
		currency : string,
		sumInsured : number,
		premium : number,
		issueDate : Date,
		inceptionDate : Date,
		expiryDate : Date,
		accountingDate : Date,
		status : string) {
		
		this.line = line;
		this.policyNo = policyNo;
		this.typeCession = typeCession;
		this.cedingCompany = cedingCompany;
		this.insured = insured;
		this.risk = risk;
		this.object = object;
		this.site= site;
		this.currency = currency;
		this.sumInsured = sumInsured;
		this.premium = premium;
		this.issueDate = issueDate;
		this.inceptionDate = inceptionDate;
		this.expiryDate = expiryDate;
		this.accountingDate = accountingDate;
		this.status = status;
	}

}