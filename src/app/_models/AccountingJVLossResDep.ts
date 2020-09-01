export class AccJvLossResDep {
	cedComp: string;
	depType: string;
	depositDate: Date;
	memDate: Date;
	curr: string;
	currRate: number;
	amount: number;
	amountPHP: number;

	constructor( cedComp: string,
		depType: string,
		depositDate: Date,
		memDate: Date,
		curr: string,
		currRate: number,
		amount: number,
		amountPHP: number){

		this.cedComp = cedComp;
		this.depType = depType;
		this.depositDate = depositDate;
		this.memDate = memDate;
		this.curr = curr;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPHP = amountPHP;
	}
}