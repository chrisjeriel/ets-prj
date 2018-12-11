export class UnderwritingOtherRatesInfo {
    selectAll: string;
    others: string;
    amounts: number;
    deductible: string;

    constructor(selectAll: string, others: string, amounts: number, deductible: string) {
        this.selectAll = selectAll;
        this.others = others;
        this.amounts = amounts;
        this.deductible = deductible;

    }

}