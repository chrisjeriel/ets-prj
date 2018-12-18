export class UnderwritingPolicyDistList{
    distNo: number;
    riskDistNo: number;
    status: string;
    policyNo: string;
    cedingCompany: string;
    insured: string;
    risk: string;
    
    constructor(distNo: number, riskDistNo: number, status: string, policyNo: string, cedingCompany: string, insured: string, risk: string){
        this.distNo = distNo;
        this.riskDistNo = riskDistNo;
        this.status = status;
        this.policyNo = policyNo;
        this.cedingCompany = cedingCompany;
        this.insured = insured;
        this.risk = risk;
    }
}