export class UnderwritingBatchPosting{
    distNo: number;
    riskDistNo: number;
    status: string;
    line: string;
    policyNo: string;
    typeOfCession:string;
    cedingCompany: string;
    insured: string;
    risk: string;
    object:string;
    site: string;
    currency: string;
    sumInsured: number;
    premium: number;
    issueDate: Date;
    inceptionDate: Date;
    expiryDate: Date;
    accountingDate: Date;
    distributionDate: Date;

    constructor(distNo: number, riskDistNo: number, status: string,  line: string, policyNo: string,typeOfCession:string, cedingCompany: string, insured: string, risk: string,object:string,site: string, currency: string,sumInsured: number, premium: number, issueDate: Date,inceptionDate: Date,expiryDate: Date, accountingDate: Date, distributionDate: Date){
        this.distNo = distNo;
        this.riskDistNo = riskDistNo;
        this.status = status;
        this.line = line;
        this.policyNo = policyNo;
        this.typeOfCession = typeOfCession;
        this.cedingCompany = cedingCompany;
        this.insured = insured;
        this.risk = risk;
        this.object = object;
        this.site = site
        this.currency = currency;
        this.sumInsured = sumInsured;
        this.premium = premium;
        this.issueDate = issueDate;
        this.inceptionDate = inceptionDate;
        this.expiryDate = expiryDate;
        this.accountingDate = accountingDate;
        this.distributionDate = distributionDate;
    }
}