export class UnderwritingCoverageInfo {
    coverCode: string;
    section: string;
    bulletNo: string;
    prenium: string;
    rate: string;
    sumInsured: string;
    addSl: string;

    constructor(coverCode: string, section: string, bulletNo: string, prenium:string, rate:string, sumInsured: string, addSl: string) {
        this.coverCode = coverCode;
        this.section = section;
        this.bulletNo = bulletNo;
        this.prenium = prenium;
        this.rate = rate;
        this.sumInsured = sumInsured;
        this.addSl = addSl;
    }

}