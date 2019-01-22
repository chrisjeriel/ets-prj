export class AccTBNet {
	accCode: string;
	accDesc: string;
	slType: string;
	drBal: number;
	crBal: number;

	constructor(accCode: string,
	 accDesc: string, 
	 slType: string, 
	 drBal: number, 
	 crBal: number) {
		this.accCode = accCode;
		this.accDesc = accDesc;
		this.slType = slType;
		this.drBal = drBal;
		this.crBal = crBal;
	}
}