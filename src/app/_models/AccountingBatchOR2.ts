export class BatchOR2{
	g: string
	p: string
	inDate: Date
	inNo: string
	billedTo: string
	amount : number

	constructor(g: string,
		p: string,
		inDate: Date,
		inNo: string,
		billedTo : string,
		amount: number){

		this.g = g
		this.p = p
		this.inDate = inDate
		this.inNo = inNo
		this.billedTo = billedTo
		this.amount = amount
	}
}


