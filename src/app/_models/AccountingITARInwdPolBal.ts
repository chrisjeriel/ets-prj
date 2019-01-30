export class ARInwdPolBalDetails {
    soaNo: string;
    polNo: string;
    coRefNo: string;
    instNo: string;
    type: string;
    effDate: Date;
    dueDate: Date;
    curr: string;
    currRate: number;
    premium: number;
    riComm: number;
    charges: number;
    netDue: number;
    payments: number;
    overdueInterest: number;
    balance: number;

    constructor(soaNo: string,polNo: string,coRefNo: string,instNo: string,type: string,effDate: Date,dueDate: Date,curr: string,currRate: number,premium: number,riComm: number,charges: number,netDue: number,payments: number,overdueInterest: number,balance: number) {
        this.soaNo = soaNo;
        this.polNo = polNo;
        this.coRefNo = coRefNo;
        this.instNo = instNo;
        this.type = type;
        this.effDate = effDate;
        this.dueDate = dueDate;
        this.curr = curr;
        this.currRate = currRate;
        this.premium = premium;
        this.riComm = riComm;
        this.charges = charges;
        this.netDue = netDue;
        this.payments = payments;
        this.overdueInterest = overdueInterest;
        this.balance = balance;
    }

}

