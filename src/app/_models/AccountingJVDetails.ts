export class AccountingEntriesJV{
	code: string;
	account: string;
	slType: string;
	slName: string;
	debit: number;
	credit: number;

	constructor(code: string, account: string, slType: string, slName: string, debit: number, credit: number){
		this.code = code;
		this.account = account;
		this.slType = slType;
		this.slName = slName;
		this.debit = debit;
		this.credit = credit;
	}
}

export class VATDetailsJV {
	vatType: string;
	birRLFPurchaseType: string;
	payor: string;
	baseAmount: number;
	vatAmount: number;

	constructor(vatType: string,birRLFPurchaseType: string,payor: string,baseAmount: number,vatAmount: number){
		this.vatType = vatType;
		this.birRLFPurchaseType = birRLFPurchaseType;
		this.payor = payor;
		this.baseAmount = baseAmount;
		this.vatAmount = vatAmount;
	}
}

export class CreditableTaxJV {
	birTaxCode: string;
	description: string;
	wTaxRate: number;
	payor: string;
	baseAmount: number;
	wTaxAmount: number;

	constructor(birTaxCode: string,description: string,wTaxRate: number,payor: string,baseAmount: number,wTaxAmount: number){
		this.birTaxCode = birTaxCode;
		this.description = description;
		this.wTaxRate = wTaxRate;
		this.payor = payor;
		this.baseAmount = baseAmount;
		this.wTaxAmount = wTaxAmount
	}
}

export class AmountDetailsJV{
	detail: string;
	amount: number;
	amountPHP: number;
	plusMinus: string;
	amountPlusMinus: number;

	constructor(detail: string, amount: number, amountPHP: number, plusMinus: string, amountPlusMinus: number){
		this.detail = detail;
		this.amount = amount;
		this.amountPHP = amountPHP;
		this.plusMinus = plusMinus;
		this.amountPlusMinus = amountPlusMinus;
	}
}

export class AccJvInterestOverdue {
	soaNo: string;
	polNo: string;
	colRefNo: string;
	instNo: number;
	effDate: Date;
	dueDate: Date;
	noOfDaysOverdue: number
	curr: string;
	currRate: number;
	premium: number;
	overdueInt: number;

	constructor( soaNo: string,
		polNo: string,
		colRefNo: string,
		instNo: number,
		effDate: Date,
		dueDate: Date,
		noOfDaysOverdue: number,
		curr: string,
		currRate: number,
		premium: number,
		overdueInt: number){

		this.soaNo = soaNo;
		this.polNo = polNo;
		this.colRefNo = colRefNo;
		this.instNo = instNo;
		this.effDate = effDate;
		this.dueDate = dueDate;
		this.noOfDaysOverdue = noOfDaysOverdue;
		this.curr = curr;
		this.currRate = currRate;
		this.premium = premium;
		this.overdueInt = overdueInt;
		
	}
}

export class AccJvInPolBalAgainstLoss {
	soaNo: string;
	polNo: string;
	colRefNo: string;
	instNo: number;
	effDate: Date;
	dueDate: Date;
	curr: string;
	currRate: number;
	premium: number;
	riComm: number;
	charges: number;
	netDue: number;
	payments: number;
	bal: number;
	overdueInt: number;
	actualPayment: number;

	constructor( soaNo: string,
		polNo: string,
		colRefNo: string,
		instNo: number,
		effDate: Date,
		dueDate: Date,
		curr: string,
		currRate: number,
		premium: number,
		riComm: number,
		charges: number,
		netDue: number,
		payments: number,
		bal: number,
		overdueInt: number,
		actualPayment: number){

		this.soaNo = soaNo;
		this.polNo = polNo;
		this.colRefNo = colRefNo;
		this.instNo = instNo;
		this.effDate = effDate;
		this.dueDate = dueDate;
		this.curr = curr;
		this.currRate = currRate;
		this.premium = premium;
		this.riComm = riComm;
		this.charges = charges;
		this.netDue = netDue;
		this.payments = payments;
		this.bal= bal;
		this.overdueInt = overdueInt;
		this.actualPayment = actualPayment;
		
	}
}

export class AgainstLoss {
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

	constructor(claimNo: string,adjusters: string,insured: string,histNo: number,histType: string,exGratia: string,curr: string,currRate: number,reserveAmount: number,amount: number,amountPhp: number){
		this.claimNo = claimNo;
		this.adjusters = adjusters;
		this.insured = insured;
		this.histNo = histNo;
		this.histType = histType;
		this.exGratia = exGratia;
		this.curr = curr;
		this.currRate = currRate;
		this.reserveAmount = reserveAmount;
		this.amount = amount;
		this.amountPhp = amountPhp;

	}
}

export class AgainstNegativeTreaty {
	quarterEnding: Date
	currency: string
	currencyRate: number
	amount: number
	amountPhp: number

	constructor(quarterEnding: Date,
	currency: string,
	currencyRate: number,
	amount: number,
	amountPhp: number){
		
		this.quarterEnding = quarterEnding;
		this.currency = currency;
		this.currencyRate = currencyRate;
		this.amount = amount;
		this.amountPhp = amountPhp;
	}
}

export class AccJvOutAccOffset {
	soaNo: string;
	polNo: string;
	colRefNo: string;
	instNo: number;
	effDate: Date;
	dueDate: Date;
	noDaysOverdue: number;
	curr: string;
	currRate: number;
	premium: number;
	riComm: number;
	charges: number;
	netDue: number;
	payments: number;
	bal: number;
	overdueInt: number;

	constructor( soaNo: string,
		polNo: string,
		colRefNo: string,
		instNo: number,
		effDate: Date,
		dueDate: Date,
		noDaysOverdue: number,
		curr: string,
		currRate: number,
		premium: number,
		riComm: number,
		charges: number,
		netDue: number,
		payments: number,
		bal: number,
		overdueInt: number){

		this.soaNo = soaNo;
		this.polNo = polNo;
		this.colRefNo = colRefNo;
		this.instNo = instNo;
		this.effDate = effDate;
		this.dueDate = dueDate;
		this.noDaysOverdue = noDaysOverdue;
		this.curr = curr;
		this.currRate = currRate;
		this.premium = premium;
		this.riComm = riComm;
		this.charges = charges;
		this.netDue = netDue;
		this.payments = payments;
		this.bal= bal;
		this.overdueInt = overdueInt;
		
	}
}