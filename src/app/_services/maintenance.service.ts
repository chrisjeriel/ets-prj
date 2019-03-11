import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })

export class MaintenanceService{

	constructor(private http: HttpClient) {

    }
	getMtnDistrict(regionCd?,provinceCd?,cityCd?){
		const params = new HttpParams()
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
			.set('cityCd',cityCd ===undefined || cityCd===null ? '' : cityCd)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnDistrict",{params});
	}

	getMtnInsured(insuredId){
		const params = new HttpParams()
		     .set('insuredId', insuredId);

		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnInsured", {params});
	}

	// getEndtCode(lineCd?:string,endtCd?:number){
	// 	return this.http.get("http://localhost:8888/api/maintenance-service/retrieveEndtCode"
	// 		+(lineCd!==undefined ? '?lineCd='+lineCd : '')
	// 		+(endtCd!==undefined ? (lineCd!==undefined ? '&' : '?')+'endtCd='+endtCd : '')
	// 		);
	// }

	getEndtCode(lineCd,endtCd){
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveEndtCode"
			+(lineCd!==undefined ? '?lineCd='+lineCd : '')
			+(endtCd!==undefined ? (lineCd!==undefined ? '&' : '?')+'endtCd='+endtCd : '')
			);
	}

	getMtnCity(regionCd?,provinceCd?){
		const params = new HttpParams()
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnCity",{params});
	}

	getMtnCrestaZone(){
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnCrestaZone");
	}

	getMtnCurrency(currencyCd: string, activeTag: string){
		const params = new HttpParams()
		     .set('currencyCd', currencyCd)
		     .set('activeTag', activeTag);

		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnCurrency", {params});
	}

	getMtnBlock(regionCd?,provinceCd?,cityCd?,districtCd?){
		const params = new HttpParams()
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
			.set('cityCd',cityCd ===undefined || cityCd===null ? '' : cityCd)
			.set('districtCd',districtCd ===undefined || districtCd===null ? '' : districtCd)
		return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMaintenanceBlock',{params});
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


	getLineLOV(lineCd) {
		const params = new HttpParams()
			.set('lineCd', lineCd);

       	return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMntLine', {params});
    }

    getIntLOV(intmId) {
    	const params = new HttpParams()
			.set('intmId', intmId);

       	return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMntIntermediary', {params});
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


	/*getMtnSectionCovers(lineCd) {
		const params = new HttpParams()
                .set('lineCd',lineCd)
                .set('coverCd',coverCd);

        return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMtnSectionCovers', {params});     
	}*/
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

	getMtnRegion(regionCd?){
		const params = new HttpParams()
			.set('regionCd',regionCd===undefined || regionCd===null ? '' : regionCd)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnRegion",{params});
	}

	getMtnProvince(provinceCd?,regionCd?){
		const params = new HttpParams()
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
		return this.http.get("http://localhost:8888/api/maintenance-service/retrieveMtnProvince",{params});
	}

	getAdviceWordings(){
		return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMaintenanceAdviceWordings');
	}

	saveMtnRisk(params){
		let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post('http://localhost:8888/api/maintenance-service/saveMtnRisk',JSON.stringify(params),header);
	}

	getMtnReason(){
		return this.http.get('http://localhost:8888/api/maintenance-service/retrieveMtnReason');
	}

}