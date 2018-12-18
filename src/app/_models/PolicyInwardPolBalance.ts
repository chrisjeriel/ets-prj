export class PolicyInwardPolBalance{
	taxCode: string;
	taxDescription: string;
	taxAmount: number;
	taxAllocation: string;

	constructor(taxCode:string, taxDescription: string, taxAmount: number, taxAllocation: string){
		this.taxCode = taxCode;
		this.taxDescription = taxDescription;
		this.taxAmount = taxAmount;
		this.taxAllocation = taxAllocation;
	}
}

export class InvoiceInformation {
	takeUpSeqNo: string;
	bookingDate: string;
	prenium: string;
	totalTax: number;
	amountDue: number;

	constructor(takeUpSeqNo: string, bookingDate: string, prenium:string, totalTax: number, amountDue: number){
		this.takeUpSeqNo = takeUpSeqNo;
		this.bookingDate = bookingDate;
		this.prenium = prenium;
		this.totalTax = totalTax;
		this.amountDue = amountDue;
	}
}