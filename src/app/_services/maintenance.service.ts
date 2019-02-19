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

	getMtnCurrency(currencyCd: string){
		const params = new HttpParams()
		     .set('currencyCd', currencyCd);
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnCurrency", {params});
	}

	getMtnBlock(){
		return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMaintenanceBlock');
	}


	getMtnObject(lineCd,objectId){
		const params = new HttpParams()
		 	.set('lineCd',lineCd)
			.set('objectId',objectId)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnObject",{params});
	}
	getMtnQuotationWordings(lineCd,type){
		const params = new HttpParams()
			.set('lineCd',lineCd)
			.set('type',type)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnQuotationWordings",{params});
	}

	getMtnRisk(riskId) {
		const params = new HttpParams()
                .set('riskId',riskId);

       	return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMtnRisk', {params});    
    }


	getLineLOV() {
       	return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMntLine');
    }

    getIntLOV() {
       	return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMntIntermediary');
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


	getLineClassLOV(line : string) {
		
		const params = new HttpParams()
             .set('lineCd',line)

   	   return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMntLineClass',{params});
	}

	getMtnRegion(regionCd){
		const params = new HttpParams()
			.set('regionCd',regionCd)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnRegion",{params});
	}

	getMtnProvince(provinceCd,regionCd){
		const params = new HttpParams()
			.set('provinceCd',provinceCd)
			.set('regionCd',regionCd)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnProvince",{params});
	}

	getAdviceWordings(){
		return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMaintenanceAdviceWordings');
	}

}