export class Risks{
    riskCode: string;
    risk: string;
    region: string;
    province: string;
    townCity: string;
    district: string;
    block: string;
    
    constructor(riskCode: string, risk: string, region: string, province: string, townCity: string, district: string, block: string){
        this.riskCode = riskCode;
        this.risk = risk;
        this.region = region;
        this.province = province;
        this.townCity = townCity;
        this.district = district;
        this.block = block;
    }
}