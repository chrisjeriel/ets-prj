export class ARClaimsRecovery {
    recoveryNo: string;
    claimNo: string;
    histNo: number;
    amountType: string;
    historyType: string;
    remarks: string;
    curr: string;
    rate: number;
    amount: number;
    amountPHP: number;

    constructor(recoveryNo:string, claimNo: string, histNo: number, amountType: string, historyType: string, remarks: string, curr: string, rate: number, amount: number, amountPHP: number) {
        this.recoveryNo = recoveryNo;
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

