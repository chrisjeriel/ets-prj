export class AccServiceAmountDetails {
	itemNo: number
	genType: string
	detail: string
	originalAmount: number
	currency: string
	currencyRate: number
	localAmount: number

	constructor(itemNo: number,genType: string,detail: string,originalAmount: number,currency: string,currencyRate: number,localAmount: number){
		this.itemNo = itemNo
		this.genType = genType
		this.detail = detail
		this.originalAmount = originalAmount
		this.currency = currency
		this.currencyRate = currencyRate
		this.localAmount = localAmount
	}

}






