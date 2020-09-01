export class JVListing {
	jvNo: string;
	jvDate: Date;
	particulars: string;
	jvType: string;
	jvRefNo:string;
	preparedBy: string;
	jvStatus: string;
	amount: number;

	constructor(jvNo: string,jvDate: Date,particulars: string,jvType: string,jvRefNo:string,preparedBy: string,jvStatus: string,amount: number){
		this.jvNo = jvNo;
		this.jvDate = jvDate;
		this.particulars = particulars;
		this.jvType = jvType;
		this.jvRefNo = jvRefNo;
		this.preparedBy = preparedBy;
		this.jvStatus = jvStatus;
		this.amount = amount;
	}

}