export class ALOPItemInformation{
	itemNo:number;
	quantity: number;
	description: string;
	relativeImportance: string;
	possibleLossMin:string;
	constructor(itemNo:number,quantity: number,description: string,relativeImportance: string,possibleLossMin:string){
		this.itemNo = itemNo;
		this.quantity = quantity;
		this.description = description;
		this.relativeImportance = relativeImportance;
		this.possibleLossMin = possibleLossMin;
	}

}

export class ALOPInfo{
	insured1:string;
	insured2:string;
	address1:string;
	address2:string;
	address3:string;
	business:string;
	amountSI:number;
	maxSI:number;
	fromDate:Date;
	toDate:Date;
	months:number;
	reportInterval:number;
	fromDatePeriod:Date;
	timeExcess:string;
}