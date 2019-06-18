import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ClaimPaymentRequests, ClaimsHistoryInfo, QSOA } from '@app/_models';
import { environment } from '@environments/environment';
@Injectable({
	providedIn: 'root'
})
export class ClaimsService {
	
	claimPaymentRequestData: ClaimPaymentRequests[] = [];
	claimsHistoryInfo: ClaimsHistoryInfo[] = [];
	qsoaData: QSOA[] = [];

	constructor(private http: HttpClient) { }

	getClaimPaymentRequestList() {

		this.claimPaymentRequestData = [
			new ClaimPaymentRequests('BVP-2018-000001', '3M Corp', 'PNBGEN', '01', 'Loss', 'OS Reserve', 'PHP', 3000000),
			new ClaimPaymentRequests('CAR-2018-000001', '2nd Inn. Inc.', 'Asia United', '01', 'Loss', 'OS Reserve', 'PHP', 10000000),
			new ClaimPaymentRequests('CAR-2018-000003', 'CPI', 'Asia United', '12', 'Loss', 'Payment', 'PHP', 500000),

		];
		return this.claimPaymentRequestData;
	}

	getClaimsHistoryInfo() {
		this.claimsHistoryInfo = [
			// new ClaimsHistoryInfo("1","Loss","Initial Reserve","Php",10000000,"Initial OS Reserve",34800,new Date()),
			new ClaimsHistoryInfo("1", "Loss", "Initial Reserve",false, "PHP", 500000, 0, "JV-000996", new Date("2018-11-14"), ""),
			new ClaimsHistoryInfo("2", "Loss", "Increase Reserve",false, "PHP", 300000, 0, "JV-000999", new Date("2018-11-14"), "Ceding Company Info"),
			new ClaimsHistoryInfo("3", "Loss", "Decrease Reserve",false, "PHP", -100000, 0, "JV-001000", new Date("2018-11-20"), "Email: Reserve Adjustment"),
			new ClaimsHistoryInfo("4", "Loss", "Partial Payment",false, "PHP", -351000, 350842.89, "CV-000101", new Date("2018-11-24"), ""),
			new ClaimsHistoryInfo("5", "Loss", "Full Payment",false, "PHP", 0, 384532.75, "CV-000102", new Date("2018-11-24"), "Final Payment"),
		];
		return this.claimsHistoryInfo;
	}

	getClmGenInfo(claimId, claimNo) {
		const params = new HttpParams()
             .set('claimId', claimId === null || claimId === undefined ? '' : claimId)
             .set('claimNo', claimNo === null || claimNo === undefined ? '' : claimNo);

        return this.http.get(environment.prodApiUrl + '/claims-service/retrieveClmGenInfo',{params});
	}

	getClaimSecCover(claimId,claimNo){
		 const params = new HttpParams()
            .set('claimId', claimId === undefined || claimId === null || claimId === '' ? '' : claimId)
            .set('claimNo', claimNo === undefined || claimNo === null || claimNo === '' ? '' : claimNo)
        return this.http.get(environment.prodApiUrl + '/claims-service/retrieveClaimSecCover', {params});
	}

	saveClaimSecCover(params){
		let header: any = {
		    headers: new HttpHeaders({
		        'Content-Type': 'application/json'
		    })
		}
		return this.http.post(environment.prodApiUrl + '/claims-service/saveClaimSecCover',JSON.stringify(params),header);
	}

}
