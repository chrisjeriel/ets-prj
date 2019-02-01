export class PaymentToAdjusters {
	claimRequestNo: string
	claimNo: string
	adjusters: string
	insured: string
	histNo: number
	histType: string
	exGratia: string
	reserveAmount: number
	curr: string
	currRate: number
	amount: number
	amountPhp: number

	constructor(claimRequestNo: string,claimNo: string,adjusters: string,insured: string,histNo: number,histType: string,exGratia: string,reserveAmount: number,curr: string,currRate: number,amount: number,amountPhp: number){

		this.claimRequestNo = claimRequestNo;
		this.claimNo = claimNo;
		this.adjusters = adjusters;
		this.insured = insured;
		this.histNo = histNo;
		this.histType = histType;
		this.exGratia = exGratia;
		this.reserveAmount = reserveAmount;
		this.curr = curr;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;

	}
}

export class PaymentToOtherParty {
	claimRequestNo: string
	claimNo: string
	cedingCompany: string
	insured: string
	histNo: number
	histType: string
	exGratia: string
	reserveAmount: number
	curr: string
	currRate: number
	amount: number
	amountPhp: number

	constructor(claimRequestNo: string,claimNo: string,cedingCompany: string,insured: string,histNo: number,histType: string,exGratia: string,reserveAmount: number,curr: string,currRate: number,amount: number,amountPhp: number){

		this.claimRequestNo = claimRequestNo;
		this.claimNo = claimNo;
		this.cedingCompany = cedingCompany;
		this.insured = insured;
		this.histNo = histNo;
		this.histType = histType;
		this.exGratia = exGratia;
		this.reserveAmount = reserveAmount;
		this.curr = curr;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;


	}
}


export class PaymentToCedingCompany {
	claimRequestNo: string
	claimNo: string
	cedingCompany: string
	insured: string
	histNo: number
	histType: string
	exGratia: string
	reserveAmount: number
	curr: string
	currRate: number
	amount: number
	amountPhp: number

	constructor(claimRequestNo: string,claimNo: string,cedingCompany: string,insured: string,histNo: number,histType: string,exGratia: string,reserveAmount: number,curr: string,currRate: number,amount: number,amountPhp: number){

		this.claimRequestNo = claimRequestNo;
		this.claimNo = claimNo;
		this.cedingCompany = cedingCompany;
		this.insured = insured;
		this.histNo = histNo;
		this.histType = histType;
		this.exGratia = exGratia;
		this.reserveAmount = reserveAmount;
		this.curr = curr;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;


	}
}

export class PremiumReturn {
	policyNo: string
	dueDate: Date
	cedingCompany: string
	premium: number
	riCommision: number
	charges: number
	curr: string
	netDue: number

	constructor(policyNo: string,dueDate: Date,cedingCompany: string,premium: number,riCommision: number,charges: number,curr: string,netDue: number){
		this.policyNo = policyNo;
		this.dueDate = dueDate;
		this.cedingCompany = cedingCompany;
		this.premium = premium;
		this.riCommision = riCommision;
		this.charges = charges;
		this.curr = curr;
		this.netDue = netDue;
	}
}








