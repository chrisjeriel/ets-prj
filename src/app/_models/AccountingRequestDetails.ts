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
	drBalance: number;
	crBalance: number;
	beginningCRBalance: number;
	beginningDRBalance: number;
	endingCRBalance: number;
	endingDRBalance: number;

	constructor(quarterEnding: Date,drBalance: number,crBalance: number,
				beginningCRBalance: number,beginningDRBalance: number,
				endingCRBalance: number,endingDRBalance: number) {

		this.quarterEnding = quarterEnding; 
		this.drBalance = drBalance; 
		this.crBalance = crBalance; 
		this.beginningCRBalance = beginningCRBalance; 
		this.beginningDRBalance = beginningDRBalance; 
		this.endingDRBalance = endingDRBalance; 
		this.endingCRBalance = endingCRBalance;
	}
}

 

