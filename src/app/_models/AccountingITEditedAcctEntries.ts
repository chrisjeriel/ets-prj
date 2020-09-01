export class AccItEditedTransactions {
    tranType: string;
    refNo: string;
    tranDate: Date;
    payeePayor: string;
    particulars: string;
    editedBy: string;
    dateEdited: Date;
    reason: string;
    status: string;
    amount: number;

    constructor(tranType: string, refNo: string, tranDate: Date, payeePayor: string, particulars: string, editedBy: string, dateEdited: Date, reason: string, status: string, amount: number) {
        this.tranType = tranType;
        this.refNo = refNo;
        this.tranDate = tranDate;
        this.payeePayor = payeePayor;
        this.particulars = particulars;
        this.editedBy = editedBy;
        this.dateEdited = dateEdited;
        this.reason = reason;
        this.status = status;
        this.amount = amount;
    }
}

export class AccItEditedOldAcctEntries {
    code: string;
    account: string;
    slType: string;
    slName: string;
    debit: number;
    credit: number;

    constructor(code: string, account: string, slType: string, slName: string, debit: number, credit: number) {
        this.code = code;
        this.account = account;
        this.slType = slType;
        this.slName = slName;
        this.debit = debit;
        this.credit = credit;
    }
}

export class AccItEditedLatestAcctEntries {
    code: string;
    account: string;
    slType: string;
    slName: string;
    debit: number;
    credit: number;

    constructor(code: string, account: string, slType: string, slName: string, debit: number, credit: number) {
        this.code = code;
        this.account = account;
        this.slType = slType;
        this.slName = slName;
        this.debit = debit;
        this.credit = credit;
    }
}