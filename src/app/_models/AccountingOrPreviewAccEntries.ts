export class ORPrevAccEntries {

	code: string;
	amount: number;
	slType: string;
	slName: string;
	debit: string;
	credit: string;

	constructor(code: string, amount: number, slType: string, slName: string, debit: string, credit: string) {
		this.code = code;
		this.amount = amount;
		this.slType = slType;
		this.slName = slName;
		this.debit = debit;
		this.credit = credit;
	}
}
