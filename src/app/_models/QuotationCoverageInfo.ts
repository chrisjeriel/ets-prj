export class QuotationCoverageInfo {
/*<<<<<<< HEAD
=======
    coverCode: string;
>>>>>>> 8fb0a8c1d0d0ae87776312e385030316186813ae*/
    section: string;
    bulletNo: string;
    shortName: string;
    sumInsured: string;
    addSi: string;


/*<<<<<<< HEAD*/
    constructor( section: string,bulletNo: string,shortName:string,  sumInsured: string, addSi: string) {
/*=======
    constructor(coverCode: string, section: string, bulletNo: string, sumInsured: string, addSl: string) {
        this.coverCode = coverCode;
>>>>>>> 8fb0a8c1d0d0ae87776312e385030316186813ae*/
        this.section = section;
        this.bulletNo = bulletNo;
        this.shortName = shortName;
        this.sumInsured = sumInsured;
        this.addSi = addSi;
    }

}
