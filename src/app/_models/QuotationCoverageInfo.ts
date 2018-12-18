export class QuotationCoverageInfo {
    coverCode: string;
    section: string;
    bulletNo: string;
    sumInsured: string;
    addSl: string;


    constructor(coverCode: string, section: string, bulletNo: string, sumInsured: string, addSl: string) {
        this.coverCode = coverCode;
        this.section = section;
        this.bulletNo = bulletNo;
        this.sumInsured = sumInsured;
        this.addSl = addSl;
    }

}
