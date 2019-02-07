export class AccountingItLossReserveDepositAr{
	cedingCompany: string;
    membershipDate: Date;
    curr: string;
    currRate: number;
    amount: number;
    amountPhp: number;

    constructor(cedingCompany: string, membershipDate: Date, curr: string, currRate: number, amount: number, amountPhp: number){
    	this.cedingCompany = cedingCompany;
    	this.membershipDate = membershipDate;
    	this.curr = curr;
    	this.currRate = currRate;
    	this.amount = amount;
    	this.amountPhp = amountPhp;
    }
}