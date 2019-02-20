export class OfficialReceipt {
    item: string;
    referenceNo: string;
    payor:string;
    curr: string;
    currRate: number;
    amount: number;
    amountPHP: number;
    
    constructor(item: string,referenceNo: string,payor:string,curr: string,currRate: number,amount: number,amountPHP: number){
        this.item       =    item;
        this.referenceNo = referenceNo;
        this.payor = payor;
        this.curr       =    curr;
        this.currRate   =    currRate;
        this.amount     =    amount;
        this.amountPHP  =    amountPHP;
    }
}