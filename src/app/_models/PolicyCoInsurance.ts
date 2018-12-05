export class PolicyCoInsurance{
    risk: string;
    company: string;
    sharePercentage: number;
    shareSumInsured: number;
    sharePremium: number;

    constructor(risk: string,
                company: string,
                sharePercentage: number,
                shareSumInsured: number,
                sharePremium: number
                )
    {
        this.risk = risk;
        this.company = company;
        this.sharePercentage = sharePercentage;
        this.shareSumInsured = shareSumInsured;
        this.sharePremium = sharePremium;
    }
}