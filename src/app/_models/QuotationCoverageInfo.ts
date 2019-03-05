export class QuotationCoverageInfo {
    coverCd: string;
    shortName: string;
    section: string;
    bulletNo: string;
    sumInsured: string;
    addSi: string;


    constructor(coverCd: string, shortName:string, section: string, bulletNo: string, sumInsured: string, addSi: string) {
        this.coverCd = coverCd;
        this.shortName = shortName;
        this.section = section;
        this.bulletNo = bulletNo;
        this.sumInsured = sumInsured;
        this.addSi = addSi;
    }

}
