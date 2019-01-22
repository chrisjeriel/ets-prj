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

