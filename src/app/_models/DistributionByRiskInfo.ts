export class DistributionByRiskInfo {
    treaty: string;
    cedingCompany: string;
    share: string;
    commRate: string;
    line: string;


    constructor(treaty: string, cedingCompany: string, share: string, commRate: string, line: string) {
        this.treaty = treaty;
        this.cedingCompany = cedingCompany;
        this.share = share;
        this.commRate = commRate;
        this.line = line;
    }

}
