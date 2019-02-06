export class AccARInvestments {
	bank: string;
	certificateNo: string;
	investmentType: string;
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
	income: number;
	matValue: number;



	constructor(bank: string, 
		certificateNo: string,
		investmentType: string,
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
		income: number,
		matValue: number) {

		this.bank = bank;
		this.certificateNo = certificateNo;
		this.investmentType	= investmentType;
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
		this.income = income;
		this.matValue = matValue;
	}
}
