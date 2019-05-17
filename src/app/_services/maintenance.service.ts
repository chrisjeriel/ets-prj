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

	getMtnInsuredList(searchParams : any[]){
		var params;

		if(searchParams.length < 1){
			params = new HttpParams()
				.set('insured','')
				.set('insuredName','')
				.set('insuredAbbr','')
				.set('activeTag','')
				.set('insuredType','')
				.set('corpTag','')
				.set('vatTag','')
				.set('address','')
		}else{
			params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
		}

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

	getMtnQuotationWordings(lineCd,wordType){
		const params = new HttpParams()
			.set('lineCd',lineCd)
			.set('wordType',wordType);

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

	getMtnRiskListing(searchParams: any[]) {
		var params;
		if(searchParams.length < 1){
			params = new HttpParams()
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
        }else{
        	params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
        }

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

	saveMtnLineClass(params) {
	    let header: any = {
	      headers: new HttpHeaders({
	        'Content-Type': 'application/json'
	      })
	    };
	    return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnLineClass',params,header);
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

         console.log(params);
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

    getMtnSpoilageReason(spoilCd,activeTag){
    	const params = new HttpParams()
			.set('spoilCd', spoilCd)
			.set('activeTag', spoilCd);
       	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnSpoilageReason', {params});
    }

    getMtnPolWordings(pass){
    	const params = new HttpParams()
			.set('lineCd', pass.lineCd == undefined ? '' : pass.lineCd)
			.set('wordingCd', pass.wordingCd == undefined ? '' : pass.wordingCd)
			.set('wordType', pass.wordType == undefined ? '' : pass.wordType)
			.set('activeTag', pass.activeTag == undefined ? '' : pass.activeTag)
			.set('defaultTag', pass.defaultTag == undefined ? '' : pass.defaultTag)
			.set('ocTag', pass.ocTag == undefined ? '' : pass.ocTag)
       	return this.http.get(environment.prodApiUrl + '/maintenance-service/retMtnPolWordings', {params});
    }

    saveMtnInsured(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnInsured',params,header);
    }


    saveMtnTypeOfCession(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnTypeOfCession',params,header);
    }

    getMtnInsuredLov(pass){
    	const params = new HttpParams()
			.set('lovParam', pass.lovParam == undefined ? '' : pass.lovParam)
			.set('paginationRequest.count', pass.count == undefined ? '' : pass.count)
			.set('paginationRequest.position', pass.position == undefined ? '' : pass.position)
			.set('sortRequest.sortKey', pass.sortKey == undefined ? '' : pass.sortKey)
			.set('sortRequest.order', pass.order == undefined ? '' : pass.order)

    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retMtnInsuredLov', {params});
    }

    saveMtnAdviceWordings(save: any[], del: any[]){
    	let params: any = {
    		saveAdvWordList: save,
    		deleteAdvWordList: del,
    	};

    	let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    	return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnAdviceWordings',params,header);
    }

    getMtnIntmList(searchParams : any[]){
		var params;

		if(searchParams.length < 1){
			params = new HttpParams()
				.set('intmId','')
				.set('intmName','')
				.set('activeTag','')
				.set('corpTag','')
				.set('vatTag','')
				.set('address','')
				.set('contactNo','')
				.set('oldIntmId','')
		}else{
			params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
		}
		
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMntIntermediary", {params});
	}

	saveMtnIntermediary(params){
		let header : any = {
		            headers: new HttpHeaders({
		                 'Content-Type': 'application/json'
		            })
		         };
		return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnIntermediary',params,header);
	}

    getMtnCurrencyList(currencyCd: string){
		const params = new HttpParams()
		     .set('currencyCd', (currencyCd === null || currencyCd === undefined ? '' : currencyCd))

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCurrencyList",{params});
	}

	saveMtnCurrency(currencyData: any){
		let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnCurrency', JSON.stringify(currencyData), header);
	}

	getMtnCurrencyRt(currencyCd: string){
		const params = new HttpParams()
		     .set('currencyCd', (currencyCd === null || currencyCd === undefined ? '' : currencyCd))

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCurrencyRt",{params});
	}

	saveMtnCurrencyRt(currencyData:any){
		let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnCurrencyRt', JSON.stringify(currencyData), header);
	}

    saveMtnEndt(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnEndorsement',JSON.stringify(params),header);
    }

    getCedingCompanyList(searchParams: any[]){
        var params;
        if(searchParams.length < 1){
        	params = new HttpParams()
            .set('cedingId','')
            .set('cedingName','')
            .set('cedingAbbr','')
            .set('address','')
            .set('membershipDate','')
            .set('terminationDate','')
            .set('inactiveDate','')
            .set('activeTag','')
            .set('govtTag','')
            .set('membershipTag','');
        }else{
        	params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
        }

	    return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMaintenanceCedingCompanyListing', {params});
    }

    getCedingCompany(cedingId){
    	const params = new HttpParams()
    		  .set('cedingId', cedingId);

        return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMaintenanceCedingCompany', {params});
    }

    saveMtnSectionCovers(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnSectionCover',JSON.stringify(params),header);
    }

    getMtnQuoteReason(pass){
    	const params = new HttpParams()
			.set('reasonCd', pass.reasonCd == undefined ? '' : pass.reasonCd)
			.set('activeTag', pass.activeTag == undefined ? '' : pass.activeTag);
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retMtnQuoteReason', {params});
    }

    saveMtnQuoteReason(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnQuoteReason',JSON.stringify(params),header);
    }

    saveMtnCedingCompany(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
    	return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnCedingCompany',params,header);
    }

     saveMtnRegion(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnRegion',params,header);
    }

    saveMtnProvince(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnProvince',params,header);
    }

    saveMtnSpoilageReason(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnSpoilageReason',JSON.stringify(params),header);
    }

    saveMtnDistrict(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnDistrict',JSON.stringify(params),header);
    }

    saveMtnQuoteWordings(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnQuoteWordings', params, header);
    }

    saveMtnBlock(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnBlock',JSON.stringify(params),header);
    }

    saveMtnPolicyWordings(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnPolicyWordings', params, header);
    }

    getMtnCatPeril(lineCd: string, objectId?: string, perilId?: string){
    	const params = new HttpParams()
		     .set('lineCd', (lineCd === null || lineCd === undefined ? '' : lineCd))
		     .set('objectId', (objectId === null || objectId === undefined ? '' : objectId))
		     .set('perilId', (perilId === null || perilId === undefined ? '' : perilId))
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCATPeril",{params});
    }

    saveMtnCatPeril(catPeril: any){
		let header : any = {
	        headers: new HttpHeaders({
	             'Content-Type': 'application/json'
	        })
	     };
	    return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnCatPeril',JSON.stringify(catPeril),header);
	}

	getMtnCresta(){
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCrestaZone");
	}

	saveMtnCrestaZone(saveData:any){
		let header : any = {
	        headers: new HttpHeaders({
	             'Content-Type': 'application/json'
	        })
	     };
	    return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnCrestaZone',JSON.stringify(saveData),header);
	}

}

