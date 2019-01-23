export class OpenCoverProcessing {
	openCoverQuotationNo: string;
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
	currency: string;
	//policyNo: string;
	quoteDate: Date;
	validityDate: Date;
	requestBy: string;
	createBy: string;

	constructor(openCoverQuotationNo: string,typeOfCession: string,lineClass: string,status: string,cedingCompany: string,principal: string,contractor: string,insured: string,risk: string,qObject: string,site: string,currency: string,quoteDate: Date,validityDate: Date,requestBy: string,createBy: string) {
		this.openCoverQuotationNo = openCoverQuotationNo;
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
		this.currency = currency;
		this.quoteDate = quoteDate;
		this.validityDate = validityDate;
		this.requestBy = requestBy;
		this.createBy = createBy;
	}

}