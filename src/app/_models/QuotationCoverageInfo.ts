export class QuotationCoverageInfo {
    coverCode: any;
    section: any;
    bulletNo: any;
    sumInsured: any;
    sortSe: any;
    addSl: any;

    quotationNo: string;
    insured: string;
    currency: string;
    sectionOne: string;
    sectionTwo: string;
    sectionThree: string;
    deductibles: string;
    remarks: string;

    constructor(coverCode: any, section: any, bulletNo: any, sumInsured: any, sortSe: any, addSl: any) {
        this.coverCode = coverCode;
        this.section = section;
        this.bulletNo = bulletNo;
        this.sumInsured = sumInsured;
        this.sortSe = sortSe;
        this.addSl = addSl;
    }

}
