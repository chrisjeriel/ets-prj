export class AccTBTotDebCred {
	accCode: string;
	accDesc: string;
	slType: string;
	slName: string;
	debit: number;
	credit: number;

	constructor(accCode: string,
	 accDesc: string, 
	 slType: string, 
	 slName: string,
	 debit: number, 
	 credit: number) {
		this.accCode = accCode;
		this.accDesc = accDesc;
		this.slType = slType;
		this.slName = slName;
		this.debit = debit;
		this.credit = credit;
	}
}