export class ExpiryListing{
	policyNo:string;
	line:string;
	branch:string;
	cedingCompany:string;
	insured:string;
	projectDescription:string;
	principal:string;
	contractor:string;
	currency:string;
	sectionI:string;
	sI:string;
	premium:string;
	constructor(policyNo:string,line:string,branch:string,cedingCompany:string,insured:string,projectDescription:string,principal:string,contractor:string,currency:string,sectionI:string,sI:string,premium:string){
		this.policyNo=policyNo;
		this.line=line;
		this.branch=branch;
		this.cedingCompany=cedingCompany;
		this.insured=insured;
		this.projectDescription=projectDescription;
		this.principal=principal;
		this.contractor=contractor;
		this.currency=currency;
		this.sectionI=sectionI;
		this.sI=sI;
		this.premium=premium;
	}
}

export class RenewedPolicy{
	originalPolicyNumber:string;
	policyRecordNo:string;

	constructor(originalPolicyNumber:string,policyRecordNo:string){
		this.originalPolicyNumber = originalPolicyNumber;
		this.policyRecordNo = policyRecordNo;
	}
}