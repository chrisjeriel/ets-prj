export class ORPreVATDetails {
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