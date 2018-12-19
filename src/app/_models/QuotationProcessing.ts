export class QuotationProcessing {
	quotationNo: string;
	typeOfCession: string;
	lineClass: string;
	status: string;
	cedingCompany: string;
	principal: string;
	contractor: string;
	insured: string;
	risk: string;
	qObject: string;
	site: string;
	policyNo: string;
	currency: string;
	quoteDate: Date;
	validityDate: Date;
	requestDate: Date;
	createDate: Date;

	constructor(quotationNo: string,typeOfCession: string,lineClass: string,status: string,cedingCompany: string,principal: string,contractor: string,insured: string,risk: string,qObject: string,site: string,policyNo: string,currency: string,quoteDate: Date,validityDate: Date,requestDate: Date,createDate: Date) {
		this.quotationNo = quotationNo;
		this.typeOfCession = typeOfCession;
		this.lineClass = lineClass;
		this.status = status;
		this.cedingCompany = cedingCompany;
		this.principal = principal;
		this.contractor = contractor;
		this.insured = insured;
		this.risk = risk;
		this.qObject = qObject;
		this.site = site;
		this.policyNo = policyNo;
		this.currency = currency;
		this.quoteDate = quoteDate;
		this.validityDate = validityDate;
		this.requestDate = requestDate;
		this.createDate = createDate;
	}

}

,