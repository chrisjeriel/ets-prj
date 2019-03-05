export class AccJvInPolBal {
	soaNo: string;
	polNo: string;
	colRefNo: string;
	instNo: number;
	effDate: Date;
	dueDate: Date;
	noOfDaysOverDue: number;
	curr: string;
	currRate: number;
	premium: number;
	riComm: number;
	charges: number;
	netDue: number;
	payments: number;
	bal: number;
	overdueInt: number;

	constructor( soaNo: string,
		polNo: string,
		colRefNo: string,
		instNo: number,
		effDate: Date,
		dueDate: Date,
		noOfDaysOverDue: number,
		curr: string,
		currRate: number,
		premium: number,
		riComm: number,
		charges: number,
		netDue: number,
		payments: number,
		bal: number,
		overdueInt: number){

		this.soaNo = soaNo;
		this.polNo = polNo;
		this.colRefNo = colRefNo;
		this.instNo = instNo;
		this.effDate = effDate;
		this.dueDate = dueDate;
		this.noOfDaysOverDue = noOfDaysOverDue;
		this.curr = curr;
		this.currRate = currRate;
		this.premium = premium;
		this.riComm = riComm;
		this.charges = charges;
		this.netDue = netDue;
		this.payments = payments;
		this.bal= bal;
		this.overdueInt = overdueInt;
		
	}
}
