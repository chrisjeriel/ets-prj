export class BatchOR{
	g: string
	p: string
	inDate: Date
	inNo: string
	jvNo: string
	jvDate: Date
	billedTo: string
	amount : number

	constructor(g: string,
		p: string,
		inDate: Date,
		inNo: string,
		jvNo: string,
		jvDate: Date,
		billedTo : string,
		amount: number){

		this.g = g
		this.p = p
		this.inDate = inDate
		this.inNo = inNo
		this.jvNo = jvNo
		this.jvDate = jvDate
		this.billedTo = billedTo
		this.amount = amount
	}
}


