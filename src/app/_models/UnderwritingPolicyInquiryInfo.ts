export class UnderwritingPolicyInquiryInfo {
    policyNo: string;
    branch: string;
    cedingCompany: string;
    principal: string;
    contractor: string;
    intermediary: string;
    insured: string;
    status: string;
    sectionISI: string;
    sectionIISI: string;
    sectionIIISI: string;
    object: string;

    constructor(policyNo: string, branch: string, cedingCompany: string, principal: string, contractor: string, intermediary: string, insured: string, status: string, sectionISI: string, sectionIISI: string, sectionIIISI: string, object: string) {
        this.policyNo = policyNo;
        this.branch = branch;
        this.cedingCompany = cedingCompany;
        this.principal = principal;
        this.contractor = contractor;
        this.intermediary = intermediary;
        this.insured = insured;
        this.status = status;
        this.sectionISI = sectionISI;
        this.sectionIISI = sectionIISI;
        this.sectionIIISI = sectionIIISI;
        this.object = object;
    }
}

