export class PolInwardPolBalanceOtherCharges {
    code: string;
    chargeDescription: string;
    amount: string;

    constructor(code: string, chargeDescription: string, amount: string) {
        this.code = code;
        this.chargeDescription = chargeDescription;
        this.amount = amount;
    }
}