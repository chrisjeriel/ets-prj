export class UnderwritingCoverageInfo {
    selectAll: string;
    coverCode: string;
    section: string;
    bulletNo: string;
    sumInsured: string;
    addSl: string;


    constructor(selectAll: string, coverCode: string, section: string, bulletNo: string, sumInsured: string, addSl: string) {
        this.selectAll = selectAll;
        this.coverCode = coverCode;
        this.section = section;
        this.bulletNo = bulletNo;
        this.sumInsured = sumInsured;
        this.addSl = addSl;
    }

}