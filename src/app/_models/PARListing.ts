export class PARListing {
	parNo: string;
    status: string;
	branch: string;
	lineClass: string;
	cedingCompany: string;
	principal: string;
	contractor: string;
	createdBy: string;

	constructor(parNo: string,status: string,branch: string,lineClass: string,
			cedingCompany: string,principal: string,contractor: string, createdBy: string) {
		this.parNo = parNo;
		this.status = status;
		this.branch = branch;
		this.lineClass = lineClass;
		this.cedingCompany = cedingCompany;
		this.principal = principal;
		this.contractor = contractor;
		this.createdBy = createdBy;
	}

}