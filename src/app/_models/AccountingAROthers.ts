export class AROthers {
	item: string;
	desc: string;
	curr: string;
	curRate: number;
	amount: number;
	amountPHP: number;

	constructor(item: string, 
		 desc: string, 
		 curr: string,
		 curRate: number, 
		 amount: number,
		 amountPHP: number) {

		this.item = item;
		this.desc = desc;
		this.curr = curr;
		this.curRate = curRate;
		this.amount = amount;
		this.amountPHP = amountPHP;
	}
}
