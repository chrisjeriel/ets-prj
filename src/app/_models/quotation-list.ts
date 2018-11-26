export class QuotationList{
    quotationNo: string;
    branch: string;
    lineClass: string;
    cedingCompany: string;
    principal: string;
    contractor: string;
    insured: string;
    quoteDate: Date = new Date();
    validityDate: Date = new Date();
    requestedBy: string;
    createdBy: string;
}

export class HoldCoverMonitoringList{
    company: string;
    quoteNo: string;
    holdCoverNo: string;
    risk: string;
    insured: string;
    periodFrom: Date = new Date();
    periodTo: Date = new Date();
    referenceHoldCover: string;
    requestedBy: string;
    requestDate: Date = new Date();
    status: string;
}