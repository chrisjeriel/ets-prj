import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClaimPaymentRequests } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  claimPaymentRequestData : ClaimPaymentRequests[] = [];

  constructor(private http: HttpClient) { }

  getClaimPaymentRequestList() {

  		this.claimPaymentRequestData = [
  			new ClaimPaymentRequests('BVP-2018-000001','3M Corp','PNBGEN','01','Loss','OS Reserve','PHP',3000000),
  			new ClaimPaymentRequests('CAR-2018-000001','2nd Inn. Inc.','Asia United','01','Loss','OS Reserve','PHP',10000000),
  			new ClaimPaymentRequests('CAR-2018-000003','CPI','Asia United','12','Loss','Payment','PHP',500000),

  		];
  		return this.claimPaymentRequestData;
  }


}
