export class ARClaimsRecovery {
    paymentType: string;
    claimNo: string;
    coClaimNo: string;
    histNo: number;
    amountType: string;
    historyType: string;
    remarks: string;
    curr: string;
    rate: number;
    amount: number;
    amountPHP: number;

    constructor(paymentType:string, claimNo: string, coClaimNo:string,  histNo: number, amountType: string, historyType: string, remarks: string, curr: string, rate: number, amount: number, amountPHP: number) {
        this.paymentType = paymentType;
        this.claimNo = claimNo;
        this.coClaimNo = coClaimNo;
        this.histNo = histNo;
        this.amountType = amountType;
        this.historyType = historyType;
        this.remarks = remarks;
        this.curr = curr;
        this.rate = rate;
        this.amount = amount;
        this.amountPHP = amountPHP;
    }
}

