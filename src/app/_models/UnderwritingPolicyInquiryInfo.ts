export class UnderwritingPolicyInquiryInfo {
    line: string;
    policyNo: string;
    typeCession: string;
    cedComp: string;
    insured: string;
    risk: string;
    object: string;
    site: string;
    curr: string;
    sumInsured: number;
    premium: number;
    issueDate: Date;
    inceptionDate: Date;
    expiryDate: Date;
    accDate: Date;
    status: string;

    constructor(line: string, 
         policyNo: string,
         typeCession: string, 
         cedComp: string, 
         insured: string, 
         risk: string,
         object: string,
         site: string, 
         curr: string, 
         sumInsured: number, 
         premium: number, 
         issueDate: Date,
         inceptionDate: Date,
         expiryDate: Date,
         accDate: Date,
         status: string
         ) {
        this.line = line;
        this.policyNo = policyNo;
        this.typeCession = typeCession;
        this.cedComp = cedComp;
        this.insured = insured;
        this.risk = risk;
        this.object = object;
        this.site = site;
        this.curr = curr;
        this.sumInsured = sumInsured;
        this.premium = premium;
        this.issueDate = issueDate;
        this.inceptionDate = inceptionDate;
        this.expiryDate = expiryDate;
        this.accDate = accDate;
        this.status = status;
    }
}

