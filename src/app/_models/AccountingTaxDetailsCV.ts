export class VATDetails {
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

export class CreditableTax {
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