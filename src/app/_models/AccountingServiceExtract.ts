export class AccountingEntriesExtract {
	tranType: string
	refNo: string
	refDate: Date
	payeePayor: string
	particulars: string
	accountCode: string
	accountName: string
	netAmount: number

	constructor(tranType: string,refNo: string,refDate: Date,payeePayor: string,particulars: string,
				accountCode: string,accountName: string,netAmount: number){
		this.tranType = tranType;
		this.refNo = refNo;
		this.refDate = refDate;
		this.payeePayor = payeePayor;
		this.particulars = particulars;
		this.accountCode = accountCode;
		this.accountName = accountName;
		this.netAmount = netAmount;
	}

}

export class CredibleWithholdingTaxDetails {
	refNo: string
	payeePayor: string
	birCode: string
	taxDescription: string
	tin: string
	tinBranch: string
	income: number
	whtaxRate: number
	whtaxAmount: number

	constructor(refNo: string,payeePayor: string,birCode: string,taxDescription: string,tin: string,tinBranch: string,income: number,whtaxRate: number,whtaxAmount: number){
		
		this.refNo = refNo;
		this.payeePayor = payeePayor;
		this.birCode = birCode;
		this.taxDescription = taxDescription;
		this.tin = tin;
		this.tinBranch = tinBranch;
		this.income = income;
		this.whtaxRate = whtaxRate;
		this.whtaxAmount = whtaxAmount;
	}

}

export class InputVatDetails {
	tranType: string
	refNo: string
	payeePayor: string
	address1: string
	address2: string
	tin: string
	birRLFPurchaseType: string
	baseAmount: number
	vatRate: number
	inputVatAmount: number

	constructor(tranType: string,refNo: string,payeePayor: string,address1: string,address2: string,tin: string,birRLFPurchaseType: string,baseAmount: number,vatRate: number,inputVatAmount: number){
		
		this.tranType = tranType;
		this.refNo = refNo;
		this.payeePayor = payeePayor;
		this.address1 = address1;
		this.address2 = address2;
		this.tin = tin;
		this.birRLFPurchaseType = birRLFPurchaseType;
		this.baseAmount = baseAmount;
		this.vatRate = vatRate;
		this.inputVatAmount = inputVatAmount;
	}

}


export class OutputVatDetails {
	tranType: string
	refNo: string
	payeePayor: string
	address1: string
	address2: string
	tin:string
	baseAmount: number
	vatRate: number
	outputVatAmount: number

	constructor(tranType: string,refNo: string,payeePayor: string,address1: string,address2: string,tin:string,baseAmount: number,vatRate: number,outputVatAmount: number){
		
		this.tranType = tranType;
		this.refNo = refNo;
		this.payeePayor = payeePayor;
		this.address1 = address1;
		this.address2 = address2;
		this.tin = tin;
		this.baseAmount = baseAmount;
		this.vatRate = vatRate;
		this.outputVatAmount = outputVatAmount;
	}

}


export class WithholdingVATDetails {
	refNo: string
	payeePayor: string
	birCode: string
	taxDescription: string
	tin: string
	tinBranch: string
	income: number
	whtaxRate: number
	whtaxAmount: number

	constructor(refNo: string,payeePayor: string,birCode: string,taxDescription: string,tin: string,tinBranch: string,income: number,whtaxRate: number,whtaxAmount: number){
		
		this.refNo = refNo;
		this.payeePayor = payeePayor;
		this.birCode = birCode;
		this.taxDescription = taxDescription;
		this.tin = tin;
		this.tinBranch = tinBranch;
		this.income = income;
		this.whtaxRate = whtaxRate;
		this.whtaxAmount = whtaxAmount;
	}

}


export class CredibleWithholdingTaxUpload {
	dmap: string
	d1601e: string
	birCode: string
	payee: string
	tin: string
	tinBranch:string
	lastName: string
	firstName: string
	mi: string
	income: number
	whtaxRate: number
	whtaxAmount:number

	constructor(dmap: string,d1601e: string,birCode: string,payee: string,tin: string,tinBranch:string,lastName: string,firstName: string,mi: string,income: number,whtaxRate: number,whtaxAmount:number){
		
		this.dmap = dmap;
		this.d1601e = d1601e;
		this.birCode = birCode;
		this.payee = payee;
		this.tin = tin;
		this.tinBranch = tinBranch;
		this.lastName = lastName;
		this.firstName = firstName;
		this.mi = mi;
		this.income = income;
		this.whtaxRate = whtaxRate;
		this.whtaxAmount = whtaxAmount;
	}
}



export class InputVatUpload {
	taxableMonth: string
	seqNo: string
	tin: string
	registeredName: string
	lastName: string
	firstName: string
	mi: string
	address1: string
	address2: string
	totalPurchase: number
	taxableNetOfVat: number
	exempt: number
	zeroRated: number
	services: number
	capitalGood:number
	goodsOtherThanCapitalGoods: number
	taxRate: number
	totalInputTax: number


	constructor(taxableMonth: string,seqNo: string,tin: string,registeredName: string,lastName: string,firstName: string,mi: string,address1: string,address2: string,totalPurchase: number,taxableNetOfVat: number,exempt: number,zeroRated: number,services: number,capitalGood:number,goodsOtherThanCapitalGoods: number,taxRate: number,totalInputTax: number ){
		
		this.taxableMonth = taxableMonth;
		this.seqNo = seqNo;
		this.tin = tin;
		this.registeredName = registeredName;
		this.lastName = lastName;
		this.firstName = firstName;
		this.mi = mi;
		this.address1 = address1;
		this.address2 = address2;
		this.totalPurchase = totalPurchase;
		this.taxableNetOfVat = taxableNetOfVat;
		this.exempt = exempt;
		this.zeroRated = zeroRated;
		this.services = services;
		this.capitalGood = capitalGood;
		this.goodsOtherThanCapitalGoods = goodsOtherThanCapitalGoods;
		this.taxRate = taxRate;
		this.totalInputTax = totalInputTax;
		
	}

}




export class OutputVatUpload {
	taxableMonth: string
	seqNo: string
	tin: string
	registeredName: string
	lastName: string
	firstName: string
	mi: string
	address1: string
	address2: string
	gSales: number
	gtSales:number
	geSales: number
	gzSales: number
	taxRate: number
	totalOutputTax: number



	constructor(taxableMonth: string,seqNo: string,tin: string,registeredName: string,lastName: string,firstName: string,mi: string,address1: string,address2: string,gSales: number,gtSales:number,geSales: number,gzSales: number,taxRate: number,totalOutputTax: number ){
		
		this.taxableMonth = taxableMonth;
		this.seqNo = seqNo;
		this.tin = tin;
		this.registeredName = registeredName;
		this.lastName = lastName;
		this.firstName = firstName;
		this.mi = mi;
		this.address1 = address1;
		this.address2 = address2;
		this.gSales = gSales;
		this.gtSales = gtSales;
		this.geSales = geSales;
		this.gzSales = gzSales;
		this.taxRate = taxRate;
		this.totalOutputTax = totalOutputTax;
		
	}

}



export class WithholdingTaxUpload {
	dmap: string
	d1601e: string
	birCode: string
	payee: string
	tin: string
	tinBranch:string
	lastName: string
	firstName: string
	mi: string
	income: number
	whtaxRate: number
	whtaxAmount:number

	constructor(dmap: string,d1601e: string,birCode: string,payee: string,tin: string,tinBranch:string,lastName: string,firstName: string,mi: string,income: number,whtaxRate: number,whtaxAmount:number){
		
		this.dmap = dmap;
		this.d1601e = d1601e;
		this.birCode = birCode;
		this.payee = payee;
		this.tin = tin;
		this.tinBranch = tinBranch;
		this.lastName = lastName;
		this.firstName = firstName;
		this.mi = mi;
		this.income = income;
		this.whtaxRate = whtaxRate;
		this.whtaxAmount = whtaxAmount;
	}
}
