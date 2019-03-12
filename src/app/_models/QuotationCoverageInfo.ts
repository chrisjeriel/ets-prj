export class QuotationCoverageInfo {
    section: string;
    bulletNo: string;
    shortName: string;
    sumInsured: string;
    addSi: string;


    constructor( section: string,bulletNo: string,shortName:string,  sumInsured: string, addSi: string) {
        this.section = section;
        this.bulletNo = bulletNo;
        this.shortName = shortName;
        this.sumInsured = sumInsured;
        this.addSi = addSi;
    }

}
