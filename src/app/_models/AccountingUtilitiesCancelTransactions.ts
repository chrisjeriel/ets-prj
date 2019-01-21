export class CancelTransactionAR {
	arNo: number;
	payor: string;
	arDate: Date;
	paymentType: string;
	status: string;
	particulars: string;
	amount: number;


	constructor(arNo: number,payor: string,arDate: Date,paymentType: string,status: string,particulars: string,amount: number) {
		this.arNo = arNo;
		this.payor = payor;
		this.arDate = arDate;
		this.paymentType = paymentType;
		this.status = status;
		this.particulars = particulars;
		this.amount = amount;
	}
}

export class CancelTransactionCV{
	cvNo: string;
	payee: string;
	cvDate: Date;
	status: string;
	particulars: string;
	amount : number;
	
	constructor(cvNo: string,payee: string,cvDate: Date,status: string,particulars: string,amount : number) {
		this.cvNo = cvNo;
		this.payee = payee;
		this.cvDate = cvDate;
		this.status = status;
		this.particulars = particulars;
		this.amount = amount; 
	}
}

export class CancelTransactionJV{
	jvNo: string;
	jvDate: Date;
	particulars: string;
	jvType: string;
	jvRefNo: string;
	preparedBy: string;
	jvStatus: string;
	amount: number;

	constructor(jvNo: string,jvDate: Date,particulars: string,jvType: string,jvRefNo: string,preparedBy: string,jvStatus: string,amount: number){
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