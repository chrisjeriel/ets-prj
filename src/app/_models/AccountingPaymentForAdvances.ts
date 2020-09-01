export class PaymentForAdvances{
	cedingCompany: string;
	remarks: string;
	curr: string;
	currRate: number;
	amount: number;
	amountPhp: number;

	constructor(cedingCompany: string, remarks: string, curr: string, currRate: number, amount: number, amountPhp: number){
		this.cedingCompany = cedingCompany;
		this.remarks = remarks;
		this. curr = curr;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;
	}
}