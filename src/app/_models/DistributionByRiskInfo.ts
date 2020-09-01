export class DistributionByRiskInfo {
    treaty: string;
    treatyCompany: string;
    share: string;
    siAmount: string;
    premAmount: string;
    commShare: string;


    constructor(treaty: string,
                treatyCompany: string,
                share: string,
                siAmount: string,
                premAmount: string,
                commShare: string,) {
        this.treaty = treaty;
        this.treatyCompany = treatyCompany;
        this.share = share;
        this.siAmount = siAmount;
        this.premAmount = premAmount;
        this.commShare = commShare;
    }

}
