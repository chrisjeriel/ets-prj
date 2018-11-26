export class IntCompAdvInfo {
	advNo: number;
    company: string;
	attention: string;
	position: string;
	advOpt: string;
	advWord: string;
	createdBy: string;
	dateCreated: string;
	lastUpdateBy: string;
	lastUpdate: string;


	constructor(advNo: number,company: string,attention: string,position: string, advOpt: string,advWord: string,createdBy: string, dateCreated: string, lastUpdateBy: string, lastUpdate: string) {
		
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