export class PolInwardPolBalanceOtherCharges {
    code: number;
    chargeDescription: string;
    amount: number;

    constructor(code: number, chargeDescription: string, amount: number) {
        this.code = code;
        this.chargeDescription = chargeDescription;
        this.amount = amount;
    }
}