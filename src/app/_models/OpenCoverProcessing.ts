export class OpenCoverProcessing {
	openQuotationNo: string;
	cessionDesc: string;
	lineClassCdDesc: string;
	status: string;
	cedingName: string;
	principalName: string;
	contractorName: string;
	insuredDesc: string;
	riskName: string;
	objectDesc: string;
	site: string;
	currencyCd: string;
	//policyNo: string;
	issueDate: Date;
	expiryDate: Date;
	reqBy: string;
	createUser: string;

	constructor(openQuotationNo: string,cessionDesc: string,lineClassCdDesc: string,status: string,cedingName: string,principalName: string,contractorName: string,insuredDesc: string,riskName: string,objectDesc: string,site: string,currencyCd: string,issueDate: Date,expiryDate: Date,reqBy: string,createUser: string) {
		this.openQuotationNo = openQuotationNo;
		this.cessionDesc = cessionDesc;
		this.lineClassCdDesc = lineClassCdDesc;
		this.status = status;
		this.cedingName = cedingName;
		this.principalName = principalName;
		this.contractorName = contractorName;
		this.insuredDesc = insuredDesc;
		this.riskName = riskName;
		this.objectDesc = objectDesc;
		this.site = site;
		this.currencyCd = currencyCd;
		this.issueDate = issueDate;
		this.expiryDate = expiryDate;
		this.reqBy = reqBy;
		this.createUser = createUser;
	}

}