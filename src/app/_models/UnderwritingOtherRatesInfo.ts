export class UnderwritingOtherRatesInfo {
    others: string;
    amounts: number;
    deductible: string;

    constructor(others: string, amounts: number, deductible: string) {
        this.others = others;
        this.amounts = amounts;
        this.deductible = deductible;

    }

}