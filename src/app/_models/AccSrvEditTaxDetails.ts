export class TaxDetails {
	vatType: string;
	birRlfPurcType: string;
	payor: string;
	baseAmt: number;
	vatAmt: number;

	constructor(vatType: string, 
		birRlfPurcType: string, 
		payor: string, 
		baseAmt: number, 
		vatAmt: number) {

		this.vatType = vatType;
		this.birRlfPurcType = birRlfPurcType;
		this.payor = payor;
		this.baseAmt = baseAmt;
		this.vatAmt = vatAmt;
	}
}
