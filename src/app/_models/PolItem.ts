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

export class PolItem_EEI_MBI_CEC{
    itemNo: string;
    quantity: number;
    itemDesc: string;
    yearOfMake: Date;
    deductible: number;
    sumInsured: number;
    
    constructor(itemNo: string, quantity: number, itemDesc: string, yearOfMake: Date, deductible: number, sumInsured: number){
        this.itemNo = itemNo;
        this.quantity = quantity;
        this.itemDesc = itemDesc;
        this.yearOfMake = yearOfMake;
        this.deductible = deductible;
        this.sumInsured = sumInsured;
    }
}
export class PolItem_BPV{
    serial: string;
    location: string;
    makerDesc: string;
    yearOfMake: Date;
    sumInsured: number;
    
    constructor(serial: string, location: string, makerDesc: string, yearOfMake: Date, sumInsured){
        this.serial = serial;
        this.location = location;
        this.makerDesc = makerDesc;
        this.yearOfMake = yearOfMake;
        this.sumInsured = sumInsured;
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
