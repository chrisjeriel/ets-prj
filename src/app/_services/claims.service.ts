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

    getClaimHistory(claimId?,projId?,histNo?){
		const params = new HttpParams()
			.set('claimId', (claimId == null || claimId == undefined ? '' : claimId))
			.set('projId', (projId == null || projId == undefined ? '' : projId))
			.set('histNo', (histNo == null || histNo == undefined ? '' : histNo))
		return this.http.get(environment.prodApiUrl + '/claims-service/retrieveClaimHistory',{params});	
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

	getClaimsListing(searchParams: any []) {
         var params;
         if(searchParams.length < 1){
              params = new HttpParams()
                     .set('claimNo','')
                     .set('cedingName', '')
                     .set('clmStatus', '')
                     .set('policyNo','')
                     .set('insuredDesc','')
                     .set('riskName','')
                     .set('lossDateFrom','')
                     .set('lossDateTo','')
                     .set('currencyCd','')
                     .set('processedBy','')
                     // .set('paginationRequest.position',null)
                     // .set('paginationRequest.count',null)
                     // .set('sortRequest.sortKey',null)
                     // .set('sortRequest.order',null);
         }
         else{
              params = new HttpParams();
             for(var i of searchParams){
                 params = params.append(i.key, i.search);
             }
         }
          return this.http.get(environment.prodApiUrl + '/claims-service/retrieveClaimListing',{params});
     }

	saveClaimHistory(params){
		let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/claims-service/saveClaimHistory',params,header);
	}

	getAttachment(claimId:string,claimNo?:string) {
        const params = new HttpParams()
             .set('claimNo', (claimNo === null || claimNo === undefined ? '' : claimNo) )
             .set('claimId',(claimId === null || claimId === undefined ? '' : claimId) )
        return this.http.get(environment.prodApiUrl + '/claims-service/retrieveClaimsAttachment',{params});
    }

    saveQuoteAttachment(params){
         let header : any = {
             headers: new HttpHeaders({
                 'Content-Type': 'application/json'
             })
         };
         return this.http.post(environment.prodApiUrl + '/claims-service/saveClaimsAttachment',params,header);
    }

}
