export class PolicyCoInsurance{
    policyNum: string;
    refPolNum: string;
    company: string;
    sharePercentage: number;
    shareSumInsured: number;
    sharePremium: number;

    constructor(policyNum: string,
                refPolNum: string,
                company: string,
                sharePercentage: number,
                shareSumInsured: number,
                sharePremium: number
                )
    {
        this.policyNum = policyNum;
        this.refPolNum = refPolNum;
        this.company = company;
        this.sharePercentage = sharePercentage;
        this.shareSumInsured = shareSumInsured;
        this.sharePremium = sharePremium;
    }
}