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