export class PolicyInwardPolBalance {
	instNo: string;
	dueDate: string;
	bookingDate: string;
	premium: number;
	otherCharges: number;
	amountDue: number;

	constructor(instNo: string, dueDate: string, bookingDate: string, premium: number, otherCharges: number, amountDue: number) {
		this.instNo = instNo;
		this.dueDate = dueDate;
		this.bookingDate = bookingDate;
		this.premium = premium;
		this.otherCharges = otherCharges;
		this.amountDue = amountDue;
	}
}


