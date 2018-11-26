export class QuotationList{
    quotationNo: string;
    branch: string;
    lineClass: string;
    quoteStatus: string;
    cedingCompany: string;
    principal: string;
    contractor: string;
    insured: string;
    quoteDate: string;
    validityDate: string;
    requestedBy: string;
    createdBy: string;
    
    constructor(quotationNo: string,
                branch: string,
                lineClass: string,
                quoteStatus: string,
                cedingCompany: string,
                principal: string,
                contractor: string,
                insured: string,
                quoteDate: string,
                validityDate: string,
                requestedBy: string,
                createdBy: string
                )
    {
        this.quotationNo = quotationNo;
        this.branch = branch;
        this.lineClass = lineClass;
        this.quoteStatus = quoteStatus;
        this.cedingCompany = cedingCompany;
        this.principal = principal;
        this.contractor = contractor;
        this.insured = insured;
        this.quoteDate = quoteDate;
        this.validityDate = validityDate;
        this.requestedBy = requestedBy;
        this.createdBy = createdBy;
    }
}

export class HoldCoverMonitoringList{
    company: string;
    quoteNo: string;
    holdCoverNo: string;
    risk: string;
    insured: string;
    periodFrom: string;
    periodTo: string;
    referenceHoldCover: string;
    requestedBy: string;
    requestDate: string;
    status: string;
    
    constructor(company: string,
                quoteNo: string,
                holdCoverNo: string,
                risk: string,
                insured: string,
                periodFrom: string,
                periodTo: string,
                referenceHoldCover: string,
                requestedBy: string,
                requestDate: string,
                status: string
                )
    {
        this.company = company;
        this.quoteNo = quoteNo;
        this.holdCoverNo = holdCoverNo;
        this.risk = risk;
        this.insured = insured;
        this.periodFrom = periodFrom;
        this.periodTo = periodTo;
        this.referenceHoldCover = referenceHoldCover;
        this.requestedBy = requestedBy;
        this.requestDate = requestDate;
        this.status = status;
    }
}