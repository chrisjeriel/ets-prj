import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ClaimsHistoryInfo } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class ClaimsService {

claimsHistoryInfo : ClaimsHistoryInfo[] = [];

constructor(private http: HttpClient) {

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
