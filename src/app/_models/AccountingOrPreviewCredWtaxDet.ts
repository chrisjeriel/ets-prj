export class ORPreCreditableWTaxDetails {
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