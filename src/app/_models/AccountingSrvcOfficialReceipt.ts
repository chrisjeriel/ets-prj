export class OfficialReceipt {
    item: string;
    curr: string;
    currRate: number;
    amount: number;
    amountPHP: number;
    
    constructor(item: string,curr: string,currRate: number,amount: number,amountPHP: number){
        this.item       =    item;
        this.curr       =    curr;
        this.currRate   =    currRate;
        this.amount     =    amount;
        this.amountPHP  =    amountPHP;
    }
}