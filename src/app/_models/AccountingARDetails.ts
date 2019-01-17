export class ARDetails {
	detail:string;
	amount:number;
	amountPhp:number;
	plusMinus:string;
	amountPlusMinus: number;

	constructor(detail:string,amount:number,amountPhp:number,plusMinus:string,amountPlusMinus: number){
		this.detail = detail;
		this.amount = amount;
		this.amountPhp = amountPhp;
		this.plusMinus = plusMinus;
		this.amountPlusMinus = amountPlusMinus;
	}
}

export class AccountingEntries {

	code:string;
	amount:number;
	slType:string;
	slName:string;
	debit:string;
	credit:string;

	constructor(code:string,amount:number,slType:string,slName:string,debit:string,credit:string){
		this.code = code;
		this.amount = amount;
		this.slType = slType;
		this.slName = slName;
		this.debit = debit;
		this.credit = credit;
	}
}