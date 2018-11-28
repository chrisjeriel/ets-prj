export class QuotationCoverageInfo {
    selectAll: any;
    coverCode: any;
    section: any;
    bulletNo: any;
    sumInsured: any;
    sortSe: any;
    addSl: any;
    actions: any;

    quotationNo: string;
    insured: string;
    currency: string;
    sectionOne: string;
    sectionTwo: string;
    sectionThree: string;
    deductibles: string;
    remarks: string;

    constructor(selectAll: any, coverCode: any, section: any, bulletNo: any, sumInsured: any, sortSe: any, addSl: any, actions: any) {
        this.selectAll = selectAll;
        this.coverCode = coverCode;
        this.section = section;
        this.bulletNo = bulletNo;
        this.sumInsured = sumInsured;
        this.sortSe = sortSe;
        this.addSl = addSl;
        this.actions = actions;

    }

}
