export class ExpenseBudget {
	budMonth: Date;
	accCode: string;
	accName: string;
	slType: string;
	slName: string;
	amount: number;

	constructor(budMonth: Date, 
		 accCode: string,
		 accName: string, 
		 slType: string, 
		 slName: string,
		 amount: number) {

		this.budMonth = budMonth;
		this.accCode = accCode;
		this.accName = accName;
		this.slType = slType;
		this.slName = slName;
		this.amount = amount;
	}
}

export class ExpenseBudgetByMonth {
	accCode: string;
	accName: string;
	total: number;
	jan: number;
	feb: number;
	mar: number;
	apr: number;
	may: number;
	jun: number;
	jul: number;
	aug: number;
	sep: number;
	oct: number;
	nov: number;
	dec: number;

	constructor(
		accCode: string,
		accName: string, 
		total: number,
		jan: number,
		feb: number,
		mar: number,
		apr: number,
		may: number,
		jun: number,
		jul: number,
		aug: number,
		sep: number,
		oct: number,
		nov: number,
		dec: number,
	) {
		this.accCode = accCode;
		this.accName = accName;
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
