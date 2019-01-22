export class PremiumReturnList {
	dueDate: Date;
	cedingCompany: string;
	policyNo: string;
	premium: number;
	riCommission: number;
	charges: number;
	currency: string;
	netDue: number;

	constructor(dueDate: Date,cedingCompany: string,policyNo: string,premium: number,riCommission: number,charges: number,currency: string,netDue: number){
		this.dueDate = dueDate;
		this.cedingCompany = cedingCompany;
		this.policyNo = policyNo;
		this.premium = premium;
		this.riCommission = riCommission;
		this.charges = charges;
		this.currency = currency;
		this.netDue = netDue;
	}
}