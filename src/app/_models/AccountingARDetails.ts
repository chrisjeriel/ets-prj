export class ARDetails {
	detail: string;
	amount: number;
	amountPhp: number;
	plusMinus: string;
	amountPlusMinus: number;

	constructor(detail: string, amount: number, amountPhp: number, plusMinus: string, amountPlusMinus: number) {
		this.detail = detail;
		this.amount = amount;
		this.amountPhp = amountPhp;
		this.plusMinus = plusMinus;
		this.amountPlusMinus = amountPlusMinus;
	}
}

export class AccountingEntries {

	code: string;
	amount: number;
	slType: string;
	slName: string;
	debit: string;
	credit: string;

	constructor(code: string, amount: number, slType: string, slName: string, debit: string, credit: string) {
		this.code = code;
		this.amount = amount;
		this.slType = slType;
		this.slName = slName;
		this.debit = debit;
		this.credit = credit;
	}
}

export class ARTaxDetailsVAT {
	vatType: string;
	birRlfPurchaseType: string;
	payor: string;
	baseAmount: number;
	vatAmount: number;

	constructor(vatType: string, birRlfPurchaseType: string, payor: string, baseAmount: number, vatAmount: number) {
		this.vatType = vatType;
		this.birRlfPurchaseType = birRlfPurchaseType;
		this.payor = payor;
		this.baseAmount = baseAmount;
		this.vatAmount = vatAmount;
	}
}

export class ARTaxDetailsWTAX {
	birTaxCode: string;
	description: string;
	wtaxRate: number;
	payor: string;
	baseAmount: number;
	wtaxAmount: number;

	constructor(birTaxCode: string, description: string, wtaxRate: number, payor: string, baseAmount: number, wtaxAmount: number) {
		this.birTaxCode = birTaxCode;
		this.description = description;
		this.wtaxRate = wtaxRate;
		this.payor = payor;
		this.baseAmount = baseAmount;
		this.wtaxAmount = wtaxAmount;
	}
}