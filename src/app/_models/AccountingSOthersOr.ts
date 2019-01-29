export class AccountingSOthersOr{
	item: string;
	description: string;
	curr: string;
	currRate: number;
	amount: number;
	amountPhp: number;

	constructor(item: string, description: string, curr: string, currRate: number, amount: number, amountPhp: number){
		this.item = item;
		this.description = description;
		this.curr = curr;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;
	}
}