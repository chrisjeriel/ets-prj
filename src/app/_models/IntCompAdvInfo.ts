export class IntCompAdvInfo {
	advNo: number;
    company: string;
	attention: string;
	position: string;
	advOpt: string;
	advWord: string;
	createdBy: string;
	dateCreated: Date;
	lastUpdateBy: string;
	lastUpdate: Date;


	constructor(advNo: number,company: string,attention: string,position: string, advOpt: string,advWord: string,createdBy: string, dateCreated: Date, lastUpdateBy: string, lastUpdate: Date) {
		
		this.advNo = advNo;
		this.company = company;
		this.attention = attention;
		this.position = position;
		this.advOpt = advOpt;
		this.advWord = advWord;
		this.createdBy = createdBy;
		this.dateCreated = dateCreated;
		this.lastUpdateBy = lastUpdateBy;
		this.lastUpdate = lastUpdate;
	}

}