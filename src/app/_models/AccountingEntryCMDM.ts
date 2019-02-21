export class AccountingEntryCMDM {
	accountCode: string
	accountName: string
	slType: string
	slName: string
	debit: number
	credit: number

	constructor(accountCode: string,accountName: string,slType: string,slName: string,debit: number,credit: number){
		this.accountCode = accountCode;
		this.accountName = accountName;
		this.slType = slType;
		this.slName = slName;
		this.debit = debit;
		this.credit = credit;

	}
}


