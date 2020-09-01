export class ORPrevAmountDetails {
	itemNo: number;
	genType: string;
	detail: string;
	origAmt: number;
	curr: string;
	currRate: number;
	localAmount: number;

	constructor(itemNo: number,
	 genType: string, 
	 detail: string, 
	 origAmt: number, 
	 curr: string,
	 currRate: number,
	 localAmount: number) {
		this.itemNo = itemNo;
		this.genType = genType;
		this.detail = detail;
		this.origAmt = origAmt;
		this.curr = curr;
		this.currRate = currRate;
		this.localAmount = localAmount;
	}
}