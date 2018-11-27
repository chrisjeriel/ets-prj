export class QuotationCoverageInfo {
    coverCode: number;
    section: string;
    bulletNo: number;
    sumInsured: number;
    sortSe: string;
    addSl: number;

    constructor(coverCode: number, section: string, bulletNo: number, sumInsured: number, sortSe: string, addSl: number) {
        this.coverCode = coverCode;
        this.section = section;
        this.bulletNo = bulletNo;
        this.sumInsured = sumInsured;
        this.sortSe = sortSe;
        this.addSl = addSl;
    }
}
