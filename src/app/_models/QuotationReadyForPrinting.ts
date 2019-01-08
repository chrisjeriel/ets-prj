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

	constructor(quotationNo: string,approvedBy: string,typeOfCession: string,lineClass: string,status: string,cedingCompany: string,principal: string,contractor: string,insured: string){

		this.quotationNo = quotationNo;
		this.approvedBy = approvedBy;
		this.typeOfCession = typeOfCession;
		this.lineClass = lineClass;
		this.status = status;
		this.cedingCompany = cedingCompany;
		this.principal = principal;
		this.contractor = contractor;
		this.insured = insured;
	}
}