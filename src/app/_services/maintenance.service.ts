import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })

export class MaintenanceService{

	constructor(private http: HttpClient) {

    }
	getMtnDistrict(regionCd?,provinceCd?,cityCd?,districtCd?){
		const params = new HttpParams()
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
			.set('cityCd',cityCd ===undefined || cityCd===null ? '' : cityCd)
			.set('districtCd',districtCd ===undefined || districtCd===null ? '' : districtCd)
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnDistrict",{params});
	}

	getMtnInsured(insuredId){
		const params = new HttpParams()
		     .set('insuredId', insuredId);

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnInsured", {params});
	}

	// getEndtCode(lineCd?:string,endtCd?:number){
	// 	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveEndtCode"
	// 		+(lineCd!==undefined ? '?lineCd='+lineCd : '')
	// 		+(endtCd!==undefined ? (lineCd!==undefined ? '&' : '?')+'endtCd='+endtCd : '')
	// 		);
	// }

	getEndtCode(lineCd,endtCd){
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveEndtCode"
			+(lineCd!==undefined ? '?lineCd='+lineCd : '')
			+(endtCd!==undefined ? (lineCd!==undefined ? '&' : '?')+'endtCd='+endtCd : '')
			);
	}

	getMtnCity(regionCd?,provinceCd?,cityCd?){
		const params = new HttpParams()
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('cityCd',cityCd ===undefined || cityCd===null ? '' : cityCd)
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCity",{params});
	}

	getMtnCrestaZone(){
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCrestaZone");
	}

	getMtnCurrency(currencyCd: string, activeTag: string){
		const params = new HttpParams()
		     .set('currencyCd', currencyCd)
		     .set('activeTag', activeTag);

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCurrency", {params});
	}

	getMtnBlock(regionCd?,provinceCd?,cityCd?,districtCd?,blockCd?){
		const params = new HttpParams()
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
			.set('cityCd',cityCd ===undefined || cityCd===null ? '' : cityCd)
			.set('districtCd',districtCd ===undefined || districtCd===null ? '' : districtCd)
			.set('blockCd',blockCd ===undefined || blockCd===null ? '' : blockCd)
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMaintenanceBlock',{params});
	}


	getMtnObject(lineCd,objectId){
		const params = new HttpParams()
		 	.set('lineCd',lineCd)
			.set('objectId',objectId)
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnObject",{params});
	}
	getMtnQuotationWordings(lineCd,type){
		const params = new HttpParams()
			.set('lineCd',lineCd)
			.set('type',type)
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnQuotationWordings",{params});
	}

    getMtnQuotationPrintingWordings(reportId){
		const params = new HttpParams()
			.set('reportId',reportId)
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnReportsParam",{params});
	}






	getMtnRisk(riskId) {
		const params = new HttpParams()
                .set('riskId',riskId);

       	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnRisk', {params});    
    }


	getLineLOV(lineCd) {
		const params = new HttpParams()
			.set('lineCd', lineCd);

       	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMntLine', {params});
    }

    getIntLOV(intmId) {
    	const params = new HttpParams()
			.set('intmId', intmId);

       	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMntIntermediary', {params});
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

        return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnRiskListing', {params});
	}

	
	getMtnSectionCovers(lineCd,coverCd) {
		const params = new HttpParams()
                .set('lineCd',lineCd)
                .set('coverCd',coverCd);

        return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnSectionCovers', {params});     
	}

	getMtnTypeOfCession(cessionId) {
		const params = new HttpParams()
                .set('cessionId',cessionId);

        return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnTypeOfCession', {params});     
	}


	getLineClassLOV(line : string) {
		
		const params = new HttpParams()
             .set('lineCd',line)

   	   return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMntLineClass',{params});
	}

	getMtnRegion(regionCd?){
		const params = new HttpParams()
			.set('regionCd',regionCd===undefined || regionCd===null ? '' : regionCd)
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnRegion",{params});
	}

	getMtnProvince(regionCd?, provinceCd?){
		const params = new HttpParams()
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnProvince",{params});
	}

	getAdviceWordings(){
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMaintenanceAdviceWordings');
	}

	saveMtnRisk(params){
		let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnRisk',JSON.stringify(params),header);
	}

	getMtnReason(){
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnReason');
	}

	getMtnTreaty(){
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnTreaty');
	}

	getMtnSectionCoversLov(lineCd,cover) {
		const params = new HttpParams()
                .set('lineCd',lineCd)
                .set('cover',cover);

        return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnSectionCoversLov', {params});     
	}

	getRefCode(identifier: string){
		const params = new HttpParams()
			.set('identifier', identifier === undefined || identifier === null ? '' : identifier);

		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveRefCode', {params});
	}

	getMtnOtherCharges(){
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnCharges');
	}
	
	saveMtnLine(params){
		let header : any = {
             headers: new HttpHeaders({
                 'Content-Type': 'application/json'
             })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnLine',params,header);
	}
	
	getMtnDeductibles(lineCd,coverCd,endtCd,deductiblesCd) {
		const params = new HttpParams()
			.set('lineCd', lineCd)
			.set('coverCd', coverCd)
			.set('endtCd', endtCd)
			.set('deductiblesCd', deductiblesCd);

       	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnDeductibles', {params});
    }

    saveMtnDeductibles(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnDeductibles',params,header);
    }

    getMtnSpoilageReason(spoilCd){
    	const params = new HttpParams()
			.set('spoilCd', spoilCd)

       	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnSpoilageReason', {params});
    }

    getMtnPolWordings(pass){
    	const params = new HttpParams()
			.set('lineCd', pass.lineCd == undefined ? '' : pass.lineCd)
			.set('wordingCd', pass.wordingCd == undefined ? '' : pass.wordingCd)
			.set('activeTag', pass.activeTag == undefined ? '' : pass.activeTag)
			.set('defaultTag', pass.defaultTag == undefined ? '' : pass.defaultTag)
			.set('ocTag', pass.ocTag == undefined ? '' : pass.ocTag)
       	return this.http.get(environment.prodApiUrl + '/maintenance-service/retMtnPolWordings', {params});
    }

}

