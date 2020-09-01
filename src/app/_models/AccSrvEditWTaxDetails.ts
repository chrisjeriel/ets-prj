export class WTaxDetails {
	billTaxCode: string;
	desc: string;
	wTaxRate: number;
	payor: string;
	baseAmt: number;
	wTaxAmt: number;

	constructor(billTaxCode: string, 
		desc: string,
		wTaxRate: number, 
		payor: string, 
		baseAmt: number, 
		wTaxAmt: number) {

		this.billTaxCode = billTaxCode;
		this.desc = desc;
		this.wTaxRate = wTaxRate,
		this.payor = payor;
		this.baseAmt = baseAmt;
		this.wTaxAmt = wTaxAmt;
	}
}
