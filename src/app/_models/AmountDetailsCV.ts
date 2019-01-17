export class AmountDetailsCV{
	detail: string;
	amount: number;
	amountPHP: number;
	plusMinus: string;
	amountPlusMinus: number;

	constructor(detail: string, amount: number, amountPHP: number, plusMinus: string, amountPlusMinus: number){
		this.detail = detail;
		this.amount = amount;
		this.amountPHP = amountPHP;
		this.plusMinus = plusMinus;
		this.amountPlusMinus = amountPlusMinus;
	}
}

