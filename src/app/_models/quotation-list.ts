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
    cedingCompany: string;
    quotationNo: string;
    holdCoverNo: string;
    risk: string;
    insured: string;
    periodFrom: string;
    periodTo: string;
    compRefHoldCoverNo: string;
    requestedBy: string;
    requestDate: string;
    status: string;
    
    constructor(cedingCompany: string,
                quotationNo: string,
                holdCoverNo: string,
                risk: string,
                insured: string,
                periodFrom: string,
                periodTo: string,
                compRefHoldCoverNo: string,
                requestedBy: string,
                requestDate: string,
                status: string
                )
    {
        this.cedingCompany = cedingCompany;
        this.quotationNo = quotationNo;
        this.holdCoverNo = holdCoverNo;
        this.risk = risk;
        this.insured = insured;
        this.periodFrom = periodFrom;
        this.periodTo = periodTo;
        this.compRefHoldCoverNo = compRefHoldCoverNo;
        this.requestedBy = requestedBy;
        this.requestDate = requestDate;
        this.status = status;
    }
}