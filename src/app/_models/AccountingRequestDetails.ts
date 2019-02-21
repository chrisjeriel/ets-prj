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
	curr: string
	currRate: number
	reserveAmount: number
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
	curr: string
	currRate: number
	reserveAmount: number
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
	currRate: number;
	netDue: number

	constructor(policyNo: string,dueDate: Date,cedingCompany: string,premium: number,riCommision: number,charges: number,curr: string,netDue: number,currRate: number){
		this.policyNo = policyNo;
		this.dueDate = dueDate;
		this.cedingCompany = cedingCompany;
		this.curr = curr;
		this.currRate = currRate;
		this.premium = premium;
		this.riCommision = riCommision;
		this.charges = charges;
		this.netDue = netDue;
	}
}


export class PaymentOfSeviceFee {
	item: string;
	desc: string;
	curr: string;
	curRate: number;
	amount: number;
	amountPHP: number;

	constructor(item: string, 
		 desc: string,
		 curr: string,
		 curRate: number, 
		 amount: number,
		 amountPHP: number) {

		this.item = item;
		this.desc = desc;
		this.curr = curr;
		this.curRate = curRate;
		this.amount = amount;
		this.amountPHP = amountPHP;
	}
}


export class TreatyBalance {
	quarterEnding: Date;
	currency: string;
	currencyRate:number;
	amount: number;
	amountPHP: number;


	constructor(quarterEnding: Date,
	currency: string,
	currencyRate:number,
	amount: number,
	amountPHP: number) {

		this.quarterEnding = quarterEnding;
		this.currency = currency;
		this.currencyRate = currencyRate;
		this.amount = amount;
		this.amountPHP = amountPHP;
	}
}

 

