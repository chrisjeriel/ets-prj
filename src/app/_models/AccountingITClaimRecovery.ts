export class ARClaimsRecovery {
    claimNo: string;
    histNo: number;
    amountType: string;
    historyType: string;
    remarks: string;
    curr: string;
    rate: number;
    amount: number;
    amountPHP: number;

    constructor(claimNo: string, histNo: number, amountType: string, historyType: string, remarks: string, curr: string, rate: number, amount: number, amountPHP: number) {
        this.claimNo = claimNo;
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

