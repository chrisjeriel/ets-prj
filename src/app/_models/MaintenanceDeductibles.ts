export class MaintenanceDeductibles{
    active: boolean;
    deductibleCode: string;
    deductibleTitle: string;
    deductibleType: string;
    deductibleRate: number;
    deductibleAmount: number;
    
    constructor(active: boolean, deductibleCode: string, deductibleTitle: string, deductibleType: string, deductibleRate: number, deductibleAmount: number){
        this.active = active;
        this.deductibleCode = deductibleCode;
        this.deductibleTitle = deductibleTitle;
        this.deductibleType = deductibleType;
        this.deductibleRate = deductibleRate;
        this.deductibleAmount = deductibleAmount;
    }
}