export class ARUnappliedCollection {
	cedCompany: string;
	memDate: Date;
	remarks: string;
	curr: string;
	curRate: number;
	amount: number;
	amountPHP: number;

	constructor(cedCompany: string, 
		 memDate: Date,
		 remarks: string, 
		 curr: string,
		 curRate: number, 
		 amount: number,
		 amountPHP: number) {

		this.cedCompany = cedCompany;
		this.memDate = memDate;
		this.remarks = remarks;
		this.curr = curr;
		this.curRate = curRate;
		this.amount = amount;
		this.amountPHP = amountPHP;
	}
}
