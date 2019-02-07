export class CedingCompanyList{
	active: string
	govt: string
	member: string
	coNo: number
	name: string
	abbreviation: string
	address: string
	membershipDate: Date
	terminationDate: Date
	inactiveDate: Date

	constructor(active: string,govt: string,member: string,coNo: number,name: string,abbreviation: string,address: string,membershipDate: Date,terminationDate: Date,inactiveDate: Date){
		this.active = active
		this.govt = govt
		this.member = member
		this.coNo = coNo;
		this.name = name;
		this.abbreviation = abbreviation;
		this.address = address;
		this.membershipDate = membershipDate;
		this.terminationDate = terminationDate;
		this.inactiveDate = inactiveDate;
	}
}

export class CedingCompany{
	defaultParam: string
	designation: string
	firstName: string
	mI: string
	lastName: string
	position: string
	department: string
	contactNo: string
	eSignature: string

	constructor(defaultParam: string,designation: string,firstName: string,mI: string,lastName: string,position: string,department: string,contactNo: string,eSignature: string){
		this.defaultParam = defaultParam
		this.designation = designation
		this.firstName = firstName
		this.mI = mI
		this.lastName = lastName
		this.position = position
		this.department = department
		this.contactNo = contactNo
		this.eSignature = eSignature
	}
}








