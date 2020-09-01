export class AccORSerFeeLoc{
	cedingCompany: string;
	quarterEnding: Date;
	curr: string;
	currRate:number;
	amount: number;
	amountPHP: number;

	constructor(
			cedingCompany: string,
			quarterEnding: Date,
			curr: string,
			currRate:number,
			amount: number,
			amountPHP: number
		) {
		this.cedingCompany = cedingCompany;
		this.quarterEnding = quarterEnding;
		this.curr = curr;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPHP = amountPHP;
	}
}