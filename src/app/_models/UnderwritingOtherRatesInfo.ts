export class UnderwritingOtherRatesInfo {
    selectAll: string;
    others: string;
    amounts: number;
    deductibleRemarks: string;

    constructor(selectAll: string, others: string, amounts: number, deductibleRemarks: string) {
        this.selectAll = selectAll;
        this.others = others;
        this.amounts = amounts;
        this.deductibleRemarks = deductibleRemarks;

    }

}