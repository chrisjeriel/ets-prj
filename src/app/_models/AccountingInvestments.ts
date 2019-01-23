export class AccInvestments {
	bank: string;
	acctNo: string;
	matPeriod: number;
	durUnit: string;
	intRate: number;
	datePur: Date;
	matDate: Date;
	investment: number;
	matValue: number;


	constructor(bank: string, 
		acctNo: string,
		matPeriod: number, 
		durUnit: string,
		intRate: number,
		datePur: Date,
		matDate: Date,
		investment: number,
		matValue: number) {

		this.bank = bank;
		this.acctNo = acctNo;
		this.matPeriod = matPeriod;
		this.durUnit = durUnit;
		this.intRate = intRate;
		this.datePur = datePur;
		this.matDate = matDate;
		this.investment = investment;
		this.matValue = matValue;
	}
}
