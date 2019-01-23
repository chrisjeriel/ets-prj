export class UnderwritingPolicyDistList{
    distNo: number;
    riskDistNo: number;
    status: string;
    line: string;
    policyNo: string;
    cedingCompany: string;
    insured: string;
    risk: string;
    currency: string;
    sumInsured: number;
    distributionDate: Date;
    accountingDate: Date;
    
    constructor(distNo: number, riskDistNo: number, status: string,  line: string, policyNo: string, cedingCompany: string, insured: string, risk: string, currency: string,sumInsured: number, distributionDate: Date, accountingDate: Date){
        this.distNo = distNo;
        this.riskDistNo = riskDistNo;
        this.status = status;
        this.line = line;
        this.policyNo = policyNo;
        this.cedingCompany = cedingCompany;
        this.insured = insured;
        this.risk = risk;
        this.currency = currency;
        this.sumInsured = sumInsured;
        this.distributionDate = distributionDate;
        this.accountingDate = accountingDate;
    }
}