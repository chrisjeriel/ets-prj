export class QuotationList{
    quotationNo: string;
    cessionType: string
    lineClass: string;
    quoteStatus: string;
    cedingCompany: string;
    principal: string;
    contractor: string;
    insured: string;
    risk: string;
    object: string;
    location: string;
    policyNo: string;
    currency: string;
    quoteDate: Date;
    validityDate: Date;
    requestedBy: string;
    createdBy: string;

    constructor(quotationNo: string,
                 cessionType: string,
                 lineClass: string,
                 quoteStatus: string,
                 cedingCompany: string,
                 principal: string,
                 contractor: string,
                 insured: string,
                 risk: string,
                 object: string,
                 location: string,
                 policyNo: string,
                 currency: string,
                 quoteDate: Date,
                 validityDate: Date,
                 requestedBy: string,
                 createdBy: string
                )
    {
        this.quotationNo = quotationNo;
        this.cessionType = cessionType;
        this.lineClass = lineClass;
        this.quoteStatus = quoteStatus;
        this.cedingCompany = cedingCompany;
        this.principal = principal;
        this.contractor = contractor;
        this.insured = insured;
        this.risk = risk;
        this.object = object;
        this.location = location;
        this.policyNo = policyNo;
        this.currency = currency;
        this.quoteDate = quoteDate;
        this.validityDate = validityDate;
        this.requestedBy = requestedBy;
        this.createdBy = createdBy;
    }
}

export class HoldCoverMonitoringList{
    holdCoverNo: string;
    status: string;
    cedingCompany: string;
    quotationNo: string;
    risk: string;
    insured: string;
    periodFrom: Date;
    periodTo: Date;
    compRefHoldCoverNo: string;
    requestedBy: string;
    requestDate: Date;

    constructor(holdCoverNo: string,
                 status: string,
                 cedingCompany: string,
                 quotationNo: string,
                 risk: string,
                 insured: string,
                 periodFrom: Date,
                 periodTo: Date,
                 compRefHoldCoverNo: string,
                 requestedBy: string,
                 requestDate: Date)
    {
        this.holdCoverNo = holdCoverNo;
        this.status = status;
        this.cedingCompany = cedingCompany;
        this.quotationNo = quotationNo;
        this.risk = risk;
        this.insured = insured;
        this.periodFrom = periodFrom;
        this.periodTo = periodTo;
        this.compRefHoldCoverNo = compRefHoldCoverNo;
        this.requestedBy = requestedBy;
        this.requestDate = requestDate;

    }
}