import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

}