export class CMDM {
	cmdmNo: string
	cmdmDate: Date
	recipient: string
	particulars: string
	cmdmType: string
	refNo: string
	preparedBy: string
	amount: number

	constructor(cmdmNo: string,cmdmDate: Date,recipient:string,particulars: string,cmdmType: string,refNo: string,preparedBy: string,amount: number){

		this.cmdmNo = cmdmNo;
		this.cmdmDate = cmdmDate;
		this.recipient = recipient;
		this.particulars = particulars;
		this.cmdmType = cmdmType;
		this.refNo = refNo;
		this.preparedBy = preparedBy;
		this.amount = amount;
	}
}


