export class PolicyInwardPolBalance {
	instNo: string;
	dueDate: string;
	bookingDate: string;
	premium: string;
	otherCharges: string;
	amountDue: string;

	constructor(instNo: string, dueDate: string, bookingDate: string, premium: string, otherCharges: string, amountDue: string) {
		this.instNo = instNo;
		this.dueDate = dueDate;
		this.bookingDate = bookingDate;
		this.premium = premium;
		this.otherCharges = otherCharges;
		this.amountDue = amountDue;
	}
}


