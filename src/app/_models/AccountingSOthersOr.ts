export class AccountingSOthersOr{
	item: string;
	referenceNo: string;
	payor: string;
	description: string;
	curr: string;
	currRate: number;
	amount: number;
	amountPhp: number;

	constructor(item: string,referenceNo: string,payor: string, description: string, curr: string, currRate: number, amount: number, amountPhp: number){
		this.item = item;
		this.referenceNo = referenceNo;
		this.payor = payor;
		this.description = description;
		this.curr = curr;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;
	}
}