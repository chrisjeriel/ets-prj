export class PolItem_MLP {
	itemNo:string;
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
