export class PoolDistribution {
	company:string;
	firstRetLine:number;
	firstRet:number;
	secRetLine:number;
	secRet:number;
	constructor(company:string,firstRetLine:number,firstRet:number,secRetLine:number,secRet:number){
		this.company = company;
		this.firstRetLine = firstRetLine;
		this.firstRet = firstRet;
		this.secRetLine = secRetLine;
		this.secRet = secRet;
	}

}