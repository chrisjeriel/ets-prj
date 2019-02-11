import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })

export class MaintenanceService{

	constructor(private http: HttpClient) {

    }
	getMtnDistrict(){
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnDistrict");
	}

	getMtnInsured(){
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnInsured");
	}

	getEndtCode(lineCd?:string,endtCd?:number){
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveEndtCode"
			+(lineCd!==undefined ? '?lineCd='+lineCd : '')
			+(endtCd!==undefined ? (lineCd!==undefined ? '&' : '?')+'endtCd='+endtCd : '')
			);
	}

	getMtnCity(){
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnCity");
	}

	getMtnCrestaZone(){
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnCrestaZone");
	}

	getMtnCurrency(){
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnCurrency");
	}

	getMtnBlock(){
		return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMaintenanceBlock');
	}

	getMtnObject(lineCd,objectId){
		const params = new HttpParams()
			.set('objectId',objectId)
			.set('lineCd',lineCd)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnObject",{params});
	}
	getMtnQuotationWordings(lineCd,type){
		const params = new HttpParams()
			.set('lineCd',lineCd)
			.set('type',type)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnQuotationWordings",{params});
	}
}