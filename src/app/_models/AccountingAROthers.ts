export class AROthers {
	item: string;
	refNo: string;
	desc: string;
	curr: string;
	curRate: number;
	amount: number;
	amountPHP: number;

	constructor(item: string, 
	     refNo: string,
		 desc: string,
		 curr: string,
		 curRate: number, 
		 amount: number,
		 amountPHP: number) {

		this.item = item;
		this.refNo = refNo;
		this.desc = desc;
		this.curr = curr;
		this.curRate = curRate;
		this.amount = amount;
		this.amountPHP = amountPHP;
	}
}