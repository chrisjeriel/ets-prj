export class AcctSrvcCWhtaxMonthlyTaxDetails{
    dm: string;
    d1604e: string;
    seqNo: number;
    tin: number;
    tinBranch: string;
    payee: string;
    lastName: string;
    firstName: string;
    midName: string;
    monthYear: Date;
    taxCode: string;
    taxRate: number;
    taxBase: number;
    taxAmount: number;
    
    constructor(dm: string,d1604e: string,seqNo: number,tin: number,tinBranch: string,payee: string,lastName: string,firstName: string,midName: string,monthYear: Date,taxCode: string,taxRate: number,taxBase: number,taxAmount: number){
        this.dm = dm;
        this.d1604e = d1604e;
        this.seqNo  = seqNo;
        this.tin    = tin;
        this.tinBranch  = tinBranch;
        this.payee  = payee;
        this.lastName   = lastName;
        this.firstName  = firstName;
        this.midName    = midName;
        this.monthYear  = monthYear;
        this.taxCode    = taxCode;
        this.taxRate    = taxRate;
        this.taxBase    = taxBase;
        this.taxAmount  = taxAmount;
    }
}

export class AcctSrvcCWhtaxConsolidateData{
    dm: string;
    d1604e: string;
    iiapTin: string;
    iiapBranch: string;
    period: Date;
    seqNo: number;
    tin: number;
    tinBranch: string;
    payee: string;
    lastName: string;
    firstName: string;
    midName: string;
    taxCode: string;
    taxRate: number;
    income: number;
    taxAmount: number;
    
    constructor(dm: string,d1604e: string,iiapTin: string,iiapBranch: string, period:Date,seqNo: number,tin: number,tinBranch: string,payee: string,lastName: string,firstName: string,midName: string,taxCode: string,taxRate: number,income: number,taxAmount: number){
        this.dm = dm;
        this.d1604e = d1604e;
        this.iiapTin = iiapTin;
        this.iiapBranch = iiapBranch;
        this.period = period;
        this.seqNo  = seqNo;
        this.tin    = tin;
        this.tinBranch  = tinBranch;
        this.payee  = payee;
        this.lastName   = lastName;
        this.firstName  = firstName;
        this.midName    = midName;
        this.taxCode    = taxCode;
        this.taxRate    = taxRate;
        this.income    = income;
        this.taxAmount  = taxAmount;
    }
}