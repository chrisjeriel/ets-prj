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

	getMtnRisk(riskId) {
		const params = new HttpParams()
                .set('riskId',riskId);

       	return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMtnRisk', {params});      
	}

	getMtnRiskListing(riskId,riskAbbr,riskName,regionDesc,provinceDesc,cityDesc,districtDesc,blockDesc,latitude,longitude,activeTag) {
		const params = new HttpParams()
                .set('riskId',riskId)
                .set('riskAbbr',riskAbbr)
                .set('riskName',riskName)
                .set('regionDesc',regionDesc)
                .set('provinceDesc',provinceDesc)
                .set('cityDesc',cityDesc)
                .set('districtDesc',districtDesc)
                .set('blockDesc',blockDesc)
                .set('latitude',latitude)
                .set('longitude',longitude)
                .set('activeTag',activeTag);

        return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMtnRiskListing', {params});
	}

	getMtnSectionCovers(lineCd,coverCd) {
		const params = new HttpParams()
                .set('lineCd',lineCd)
                .set('coverCd',coverCd);

        return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMtnSectionCovers', {params});     
	}

	getMtnTypeOfCession(cessionId) {
		const params = new HttpParams()
                .set('cessionId',cessionId);

        return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMtnTypeOfCession', {params});     
	}
}