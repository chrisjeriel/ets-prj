export class AccountingEntryCMDM {
	code: string
	account: string
	slType: string
	slName: string
	debit: number
	credit: number

	constructor(credit: number,code: string,account: string,slType: string,slName: string,debit: number){
		this.credit = credit;
		this.code = code;
		this.account = account;
		this.slType = slType;
		this.slName = slName;
		this.debit = debit;
	}
}


