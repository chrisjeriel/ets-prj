export class AccARInvestments {
	bank: string;
	acctNo: string;
	matPeriod: number;
	durUnit: string;
	intRate: number;
	datePur: Date;
	matDate: Date;
	curr: string;
	currRate: number;
	bankCharge: number;
	withTax: number;
	investment: number;
	matValue: number;
	income: number;


	constructor(bank: string, 
		acctNo: string,
		matPeriod: number, 
		durUnit: string,
		intRate: number,
		datePur: Date,
		matDate: Date,
		curr: string,
		currRate: number,
		bankCharge: number,
		withTax: number,
		investment: number,
		matValue: number,
		income: number) {

		this.bank = bank;
		this.acctNo = acctNo;
		this.matPeriod = matPeriod;
		this.durUnit = durUnit;
		this.intRate = intRate;
		this.datePur = datePur;
		this.matDate = matDate;
		this.curr = curr;
		this.currRate = currRate;
		this.bankCharge = bankCharge;
		this.withTax = withTax;
		this.investment = investment;
		this.matValue = matValue;
		this.income = income;
	}
}
