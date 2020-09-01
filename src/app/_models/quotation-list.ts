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
    approvedBy: string;

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
                 createdBy: string,
                 approvedBy: string,
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
        this.approvedBy = approvedBy;
    }
}

export class HoldCoverMonitoringList{
    holdCoverNo: string;
    status: string;
    cedingName: string;
    quotationNo: string;
    riskName: string;
    insuredDesc: string;
    periodFrom: Date;
    periodTo: Date;
    compRefHoldCovNo: string;
    reqBy: string;
    reqDate: Date;


    constructor(holdCoverNo: string,status: string,cedingName: string,quotationNo: string,riskName: string,insuredDesc: string,periodFrom: Date,periodTo: Date,compRefHoldCovNo: string,reqBy: string,reqDate: Date)
    {
        this.holdCoverNo = holdCoverNo;
        this.status = status;
        this.cedingName = cedingName;
        this.quotationNo = quotationNo;
        this.riskName = riskName;
        this.insuredDesc = insuredDesc;
        this.periodFrom = periodFrom;
        this.periodTo = periodTo;
        this.compRefHoldCovNo = compRefHoldCovNo;
        this.reqBy = reqBy;
        this.reqDate = reqDate;

    }
}

export class OpenCoverList{
    openCoverQuotationNo: string;
    typeofCession: string
    lineClass: string;
    status: string;
    cedingCompany: string;
    principal: string;
    contractor: string;
    insured: string;
    risk: string;
    object: string;
    location: string;
    policyNo: string;
    currency: string;

    constructor(openCoverQuotationNo: string,
                 typeofCession: string,
                 lineClass: string,
                 status: string,
                 cedingCompany: string,
                 principal: string,
                 contractor: string,
                 insured: string,
                 risk: string,
                 object: string,
                 location: string,
                 policyNo: string,
                 currency: string
                )
    {
        this.openCoverQuotationNo = openCoverQuotationNo;
        this.typeofCession = typeofCession;
        this.lineClass = lineClass;
        this.status = status;
        this.cedingCompany = cedingCompany;
        this.principal = principal;
        this.contractor = contractor;
        this.insured = insured;
        this.risk = risk;
        this.object = object;
        this.location = location;
        this.policyNo = policyNo;
        this.currency = currency;
}
}