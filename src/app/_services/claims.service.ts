import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClaimPaymentRequests,ClaimsHistoryInfo } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  claimPaymentRequestData : ClaimPaymentRequests[] = [];
  claimsHistoryInfo : ClaimsHistoryInfo[] = [];

  constructor(private http: HttpClient) { }

  getClaimPaymentRequestList() {

  		this.claimPaymentRequestData = [
  			new ClaimPaymentRequests('BVP-2018-000001','3M Corp','PNBGEN','01','Loss','OS Reserve','PHP',3000000),
  			new ClaimPaymentRequests('CAR-2018-000001','2nd Inn. Inc.','Asia United','01','Loss','OS Reserve','PHP',10000000),
  			new ClaimPaymentRequests('CAR-2018-000003','CPI','Asia United','12','Loss','Payment','PHP',500000),

  		];
  		return this.claimPaymentRequestData;
  }

  getClaimsHistoryInfo(){
	this.claimsHistoryInfo = [
		new ClaimsHistoryInfo("1","Loss","OS Reserve","Php",10000000,"Initial OS Reserve",34800,new Date()),
		new ClaimsHistoryInfo("2","Adjuster Expense","Payment","Php",300000,"Partial Payment",34801,new Date()),
		new ClaimsHistoryInfo("3","Other Expenses","Recovery","Php",-6000000,"Recovery Expense",34820,new Date()),
		new ClaimsHistoryInfo("4","Loss","OS Reserve","Php",-6000000,"Partial Payment",34827,new Date())
		];
		return this.claimsHistoryInfo;
	}

}
