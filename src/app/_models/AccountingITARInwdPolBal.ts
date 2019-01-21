export class ARInwdPolBalDetails {
    polNo: string;
    instNo: string;
    dueDate: Date;
    curr: string;
    premium: number;
    riComm: number;
    charges: number;
    netDue: number;
    payments: number;
    overdueInterest: number;
    balance: number;

    constructor(polNo: string, instNo: string, dueDate: Date, curr: string, premium: number, riComm: number, charges: number, netDue: number, payments: number, overdueInterest: number, balance: number) {
        this.polNo = polNo;
        this.instNo = instNo;
        this.dueDate = dueDate;
        this.curr = curr;
        this.premium = premium;
        this.riComm = riComm;
        this.charges = charges;
        this.netDue = netDue;
        this.payments = payments;
        this.overdueInterest = overdueInterest;
        this.balance = balance;
    }

}

