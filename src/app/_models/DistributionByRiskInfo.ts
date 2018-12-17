export class DistributionByRiskInfo {
    selectAll: string;
    treaty: string;
    cedingCompany: string;
    share: string;
    commRate: string;
    line: string;


    constructor(selectAll: string, treaty: string, cedingCompany: string, share: string, commRate: string, line: string) {
        this.selectAll = selectAll;
        this.treaty = treaty;
        this.cedingCompany = cedingCompany;
        this.share = share;
        this.commRate = commRate;
        this.line = line;
    }

}
