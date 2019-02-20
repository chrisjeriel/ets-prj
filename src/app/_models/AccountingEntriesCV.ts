export class AccountingEntriesCV{
	accCode: string;
	accName: string;
	slType: string;
	slName: string;
	debit: number;
	credit: number;

	constructor(accCode: string, accName: string, slType: string, slName: string, debit: number, credit: number){
		this.accCode = accCode;
		this.accName = accName;
		this.slType = slType;
		this.slName = slName;
		this.debit = debit;
		this.credit = credit;
	}
}