export class CheckDetails {
	bank: string;
	accountNo: string;
	checkDate: Date;
	checkNo: number;
	checkClass: string;
	curr: string;
	amount: number;

	constructor(bank: string,accountNo: string,checkDate: Date,checkNo: number,checkClass: string,curr: string,amount: number){
		this.bank = bank;
		this.accountNo = accountNo;
		this.checkDate = checkDate;
		this.checkNo = checkNo;
		this.checkClass = checkClass;
		this.curr = curr;
		this.amount = amount;
	}
}