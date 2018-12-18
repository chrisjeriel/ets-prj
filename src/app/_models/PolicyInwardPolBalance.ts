export class PolicyInwardPolBalance{
	taxCode: string;
	taxDescription: string;
	taxAmount: number;
	taxAllocation: string;

	constructor(taxCode:string, taxDescription: string, taxAmount: number, taxAllocation: string){
		this.taxCode = taxCode;
		this.taxDescription = taxDescription;
		this.taxAmount = taxAmount;
		this.taxAllocation = taxAllocation;
	}
}
