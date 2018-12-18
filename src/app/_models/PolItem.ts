export class PolItem_MLP {
	itemNo:string;
	quantity:number;
	description:string;
	indemnityPeriod:number;
	relativeImportance:number;
	stockSpareParts:number;
	constructor(itemNo:string,quantity:number,description:string,indemnityPeriod:number,relativeImportance:number,stockSpareParts:number){
		this.itemNo = itemNo;
		this.quantity = quantity;
		this.description = description;
		this.indemnityPeriod = indemnityPeriod;
		this.relativeImportance = relativeImportance;
		this.stockSpareParts = stockSpareParts;
	}
}

export class PolGoods_DOS{
	itemNo:string;
	chamberNo:string;
	typeOfGoods:string;
	noClaimsPeriod:string;
	sumInsured:number;
	constructor(itemNo:string,chamberNo:string,typeOfGoods:string,noClaimsPeriod:string,sumInsured:number){
		this.itemNo = itemNo; 
		this.chamberNo = chamberNo; 
		this.typeOfGoods = typeOfGoods; 
		this.noClaimsPeriod = noClaimsPeriod; 
		this.sumInsured = sumInsured; 
	}
}

export class PolMachinery_DOS{
	itemNo:string;
	numberOfUnits:number;
	description:string;
	yearOfMake:number;
	sumInsured:number;
	constructor(itemNo:string,numberOfUnits:number,description:string,yearOfMake:number,sumInsured:number){
		this.itemNo = itemNo; 
		this.numberOfUnits = numberOfUnits; 
		this.description = description; 
		this.yearOfMake = yearOfMake; 
		this.sumInsured = sumInsured; 
	}
}