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

	getLineLOV() {
       	return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMntLine');
    }

	getMtnRiskListing(){
		const params = new HttpParams()
                .set('riskId','')
                .set('riskAbbr','')
                .set('riskName','')
                .set('regionDesc','')
                .set('provinceDesc','')
                .set('cityDesc','')
                .set('districtDesc','')
                .set('blockDesc','')
                .set('latitude','')
                .set('longitude','')
                .set('activeTag','');

        return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMtnRiskListing', {params});
	}

}