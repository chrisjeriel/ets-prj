export class ExpenseBudget {
	budgetMonth: Date
	accountCode: string
	accountName: string
	slType: string
	slName: string
	amount: number

	constructor(budgetMonth: Date,accountCode: string,accountName: string,slType: string,
				slName: string,amount:number){
		this.budgetMonth =budgetMonth;
		this.accountCode =accountCode;
		this.accountName =accountName;
		this.slType =slType;
		this.slName =slName;
		this.amount =amount;
	}
} 

export class ByMonth {
	accountCode: string
	accountName: string
	total: number
	jan: number
	feb: number
	mar: number
	apr: number
	may: number
	jun: number
	jul: number
	aug: number
	sep: number
	oct: number
	nov: number
	dec: number

	constructor(accountCode: string,accountName: string,total: number,jan: number,feb: number,mar: number,
				apr: number,may: number,jun: number,jul: number,aug: number,sep: number,oct: number,
				nov: number,dec: number){

		this.accountCode = accountCode;
		this.accountName = accountName;
		this.total = total;
		this.jan = jan;
		this.feb = feb;
		this.mar = mar;
		this.apr = apr;
		this.may = may;
		this.jun = jun;
		this.jul = jul;
		this.aug = aug;
		this.sep = sep;
		this.oct = oct;
		this.nov = nov;
		this.dec = dec;
	}
}


export class ExtractFromLastYear {
	accountCode: string
	accountName: string
	total: number
	jan: number
	feb: number
	mar: number
	apr: number
	may: number
	jun: number
	jul: number
	aug: number
	sep: number
	oct: number
	nov: number
	dec: number

	constructor(accountCode: string,accountName: string,total: number,jan: number,feb: number,mar: number,
				apr: number,may: number,jun: number,jul: number,aug: number,sep: number,oct: number,
				nov: number,dec: number){

		this.accountCode = accountCode;
		this.accountName = accountName;
		this.total = total;
		this.jan = jan;
		this.feb = feb;
		this.mar = mar;
		this.apr = apr;
		this.may = may;
		this.jun = jun;
		this.jul = jul;
		this.aug = aug;
		this.sep = sep;
		this.oct = oct;
		this.nov = nov;
		this.dec = dec;
	}
}



