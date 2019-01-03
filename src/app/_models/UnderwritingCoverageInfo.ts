export class UnderwritingCoverageInfo {
    coverCode: string;
    section: string;
    bulletNo: string;
    sumInsured: string;
    rate: string;
    premium: string;
    addSl: string;

    constructor(
                coverCode: string, 
                section: string, 
                bulletNo: string,
                sumInsured: string,  
                rate: string, 
                premium: string,
                addSl: string) {
        this.coverCode = coverCode;
        this.section = section;
        this.bulletNo = bulletNo;
        this.premium = premium;
        this.rate = rate;
        this.sumInsured = sumInsured;
        this.addSl = addSl;
    }

}

export class TotalPerSection {
    section : string
    sumInsured : string
    prenium: string

    constructor(section : string,sumInsured : string,prenium: string){
        this.section = section
        this.sumInsured = sumInsured
        this.prenium = prenium
    }
}


export class CoverageInfo {
    currency: string;
    exchRt: string;
    totalPrenium: number;
    totalSumInsured: number;
    sectionI: string;
    sectionII: string;
    sectionIII: string;
    share: number;
    pml: number;
    partOf: number;
    remarks: string;

}