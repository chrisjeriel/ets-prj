export class AccountingEntriesCV{
	code: string;
	account: string;
	slType: string;
	slName: string;
	debit: number;
	credit: number;

	constructor(code: string, account: string, slType: string, slName: string, debit: number, credit: number){
		this.code = code;
		this.account = account;
		this.slType = slType;
		this.slName = slName;
		this.debit = debit;
		this.credit = credit;
	}
}