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

export class MaintenanceRisks{
    active: boolean;
    riskNo: string;
    description: string;
    abbreviation: string;
    region: string;
    province: string;
    townCity: string;
    district: string;
    block: string;
    lat: string;
    long: string;
    
    constructor(active: boolean, riskNo: string, description: string, abbreviation: string, region: string, province: string, townCity: string, district: string, block: string, lat: string, long: string){
        this.active = active;
        this.riskNo = riskNo; 
        this.description = description;
        this.abbreviation = abbreviation;
        this.region = region;
        this.province = province;
        this.townCity = townCity;
        this.district = district;
        this.block = block;
        this.lat = lat;
        this.long = long;
    }
}