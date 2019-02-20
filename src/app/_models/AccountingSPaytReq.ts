export class AccountingSPaytReqCheckVoucher{
	item: string;
	description: string;
	currency: string;
	currRate: number;
	amount: number;
	amountPhp: number;

	constructor(item: string, description: string, currency: string, currRate: number, amount: number, amountPhp: number){
		this.item = item
		this.description = description
		this.currency = currency
		this.currRate = currRate
		this.amount = amount
		this.amountPhp = amountPhp
	}

}

export class AccountingSPaytReqPettyCashVoucher{
	pcvYear: string;
	pcvNo: string;
	pcvDate: Date;
	payee: string;
	purpose: string;
	replenishment: string;
	status: string;
	currency: string;
	currRate: number;
	amount: number;
	amountPhp: number;

	constructor(pcvYear: string, pcvNo: string, pcvDate: Date, payee: string, purpose: string, replenishment: string, status: string, currency: string, currRate: number, amount: number, amountPhp: number){
		this.pcvYear = pcvYear;
		this.pcvNo = pcvNo;
		this.pcvDate = pcvDate;
		this.payee = payee;
		this.purpose = purpose;
		this.replenishment = replenishment;
		this.status = status;
		this.currency = currency;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;
	}
}

export class AccountingSPaytReqPRMFE{
	empNo: string;
	employee: string;
	department: string;
	currency: string;
	currRate: number;
	amount: number;
	amountPhp: number;

	constructor(empNo: string, employee: string, department: string, currency: string, currRate: number, amount: number, amountPhp: number){
		this.empNo = empNo;
		this.employee = employee;
		this.department = department;
		this.currency = currency;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;
	}
}

export class AccountingSPaytReqOthers{
	item: string;
	referenceNo: string;
	description: string;
	currency: string;
	currRate: number;
	amount: number;
	amountPhp: number;

	constructor(item: string, referenceNo: string, description: string, currency: string, currRate: number, amount: number, amountPhp: number){
		this.item = item;
		this.referenceNo = referenceNo;
		this.description = description;
		this.currency = currency;
		this.currRate = currRate;
		this.amount = amount;
		this.amountPhp = amountPhp;
	}
}