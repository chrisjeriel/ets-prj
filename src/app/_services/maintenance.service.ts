import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })

export class MaintenanceService{

	constructor(private http: HttpClient) {

    }
	getMtnDistrict(regionCd?,provinceCd?,cityCd?,districtCd?,activeTag?){
		const params = new HttpParams()
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
			.set('cityCd',cityCd ===undefined || cityCd===null ? '' : cityCd)
			.set('districtCd',districtCd ===undefined || districtCd===null ? '' : districtCd)
			.set('activeTag',activeTag ===undefined || activeTag===null ? '' : activeTag)
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

	newGetMtnInsuredList(searchParams){
		
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnInsured", {params:searchParams});
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

	getMtnCurrency(currencyCd: string, activeTag: string, effDateFrom?){
		const params = new HttpParams()
		     .set('currencyCd', currencyCd)
		     .set('activeTag', activeTag)
		     .set('effDateFrom', effDateFrom == undefined || effDateFrom == null ? '' : effDateFrom);

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCurrency", {params});
	}

	getMtnBlock(regionCd?,provinceCd?,cityCd?,districtCd?,blockCd?,activeTag?){
		const params = new HttpParams()
			.set('provinceCd',provinceCd ===undefined || provinceCd===null ? '' : provinceCd)
			.set('regionCd',regionCd ===undefined || regionCd===null ? '' : regionCd)
			.set('cityCd',cityCd ===undefined || cityCd===null ? '' : cityCd)
			.set('districtCd',districtCd ===undefined || districtCd===null ? '' : districtCd)
			.set('blockCd',blockCd ===undefined || blockCd===null ? '' : blockCd)
			.set('activeTag',activeTag === undefined ? 'Y' : activeTag==null ? '' : activeTag)
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMaintenanceBlock',{params});
  }

	getMtnObject(lineCd,objectId){
		const params = new HttpParams()
		 	.set('lineCd',lineCd)
			.set('objectId',objectId)
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnObject",{params});
  }

  saveMtnObject(params) {
    let header: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnObject',params,header);
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

	getMtnTreaty(treatyId){
		const params = new HttpParams()
					.set('treatyId', treatyId === undefined || treatyId === null ? '' : treatyId);

		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnTreaty', {params});
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
			.set('activeTag', activeTag);
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

     saveMtnCity(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnCity',params,header);
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

	getMtnUserGrp(userGrp?){
		const params = new HttpParams()
		     .set('userGrp', (userGrp === null || userGrp === undefined ? '' : userGrp))
		return this.http.get(environment.prodApiUrl + "/user-service/retrieveMtnUserGroup",{params});
	}

	getMtnUserAmtLimit(userGrp?,lineCd?){
		const params = new HttpParams()
		     .set('userGrp', (userGrp === null || userGrp === undefined ? '' : userGrp))
		     .set('lineCd', (lineCd === null || lineCd === undefined ? '' : lineCd))
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retMtnUserAmtLimit", {params});   
	}

	saveMtnUserAmtLimit(params){
		let header : any = {
	        headers: new HttpHeaders({
	             'Content-Type': 'application/json'
	        })
	     };
	     return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnUserAmtLimit',JSON.stringify(params),header);
	}

	getMtnNonRenewalReason(reasonCd: any, activeTag: any){
		const params = new HttpParams()
		     .set('reasonCd', (reasonCd === null || reasonCd === undefined ? '' : reasonCd))
		     .set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag))
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnNonRenewalReason",{params});
	}

	saveMtnNonRenewalReason(save: any[], del: any[]){
		let header : any = {
	        headers: new HttpHeaders({
	             'Content-Type': 'application/json'
	        })
	     };

		let params : any = {
	    	saveNonRenewalReasonList: save,
	    	delNonRenewalReasonList: del
	    }
	    return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnNonRenewalReason',JSON.stringify(params),header);
	}

	saveMtnOtherCharge(params) {
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnOtherCharge', params, header);
    }

    getMtnTreatyCommission(quoteYear){
    	const params = new HttpParams()
    		.set('quoteYear', quoteYear === null || quoteYear === '' || quoteYear === undefined ? '' : quoteYear);
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnTreatyCommission",{params});
    }

    saveMtnTreaty(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnTreaty', params, header);
     }

    getMtnApproval(){
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnApproval");
	}

	getMtnApprovalFunction(approvalCd: string){
		const params = new HttpParams()
		     .set('approvalCd', (approvalCd === null || approvalCd === undefined ? null : approvalCd))
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnApprovalFunction",{params});
		
	}

	saveMtnApproval(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };

        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnApproval', params, header);
    }

    getMtnRetAmt(lineCd, lineClassCd, currencyCd, retentionId){
		const params = new HttpParams()
		     		.set('lineCd', (lineCd === null || lineCd === undefined ? '' : lineCd))
		     		.set('lineClassCd', (lineClassCd === null || lineClassCd === undefined ? '' : lineClassCd))
		     		.set('currencyCd', (currencyCd === null || currencyCd === undefined ? '' : currencyCd))
		     		.set('retentionId', (retentionId === null || retentionId === undefined ? '' : retentionId));

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnRetAmt", {params});
	}

	getMtnTreatyComm(year,currencyCd) {
		const params = new HttpParams()
		     		.set('quoteYear', (year === null || year === undefined ? '' : year))
		     		.set('currencyCd', (currencyCd === null || currencyCd === undefined ? '' : currencyCd));

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnTreatyCommission", {params});
	}

	getMtnTreatyShare(year, id) {
		const params = new HttpParams()
		     		.set('treatyYear', (year === null || year === undefined ? '' : year))
		     		.set('treatyId', (id === null || id === undefined ? '' : id));

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnTreatyShare", {params});
	}

	getMtnCedingRetention(year, id, cedId) {
		const params = new HttpParams()
		     		.set('treatyYear', (year === null || year === undefined ? '' : year))
		     		.set('treatyId', (id === null || id === undefined ? '' : id))
		     		.set('trtyCedId', (cedId === null || cedId === undefined ? '' : cedId));

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCedingRetention", {params});
	}

	saveMtnTreatyShare(params) {
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnTreatyShare', params, header);
    }

	saveMtnApprovalFunction(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnApprovalFunction', params, header);
	}

	getMtnApprover(userId?:string){
		const params = new HttpParams()
		     .set('userId', (userId === null || userId === undefined ? '' : userId))
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveApprover',{params});
	}

	getMtnParameters(paramType,paramName?){
		const params = new HttpParams()
		     .set('paramType', (paramType === null || paramType === undefined ? '' : paramType))
		     .set('paramName', (paramName === null || paramName === undefined ? '' : paramName))
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnParameters',{params});
	}

	saveMtnParameters(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
		return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnParameters', params, header);
	}

    saveMtnApprover(params) {
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveApprover', params, header);
     }  

	getMtnRoundingError(cedingId){
		const params = new HttpParams()
		     .set('cedingId', (cedingId === null || cedingId === undefined ? '' : cedingId))
		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnRoundingError',{params});
	}

	saveMtnRoundingError(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnRoundingError', params, header);
	}

    copyTreatyShareSetup(params) {
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }

        return this.http.post(environment.prodApiUrl + '/maintenance-service/copyTreatyShareSetup', params, header);
    }

    saveMtnRetAmt(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnRetAmt', params, header);
    }

    getMtnApproverFn(userId){
    	const params = new HttpParams()
		     .set('userId', (userId === null || userId === undefined ? '' : userId))
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveApproverFunction", {params});
    }

    getMtnApprovalLOV(approvalCd?){
    	const params = new HttpParams()
		     .set('approvalCd', (approvalCd === null || approvalCd === undefined ? '' : approvalCd))
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnApproval", {params});
    }

    saveMtnApproverFn(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveApproverFunction', params, header);
    }

	getMtnReports(reportId?: string){
		const params = new HttpParams()
			.set('reportId', (reportId === null || reportId === undefined ? '' : reportId));

		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnReports',{params});
	}

	saveMtnReports(save: any[], del: any[]){
		let params: any = {
			saveReports: save,
			delReports: del
		};
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnReports', JSON.stringify(params), header);
	}

    copyRetAmtSetup(params) {
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.post(environment.prodApiUrl + '/maintenance-service/copyRetAmtSetup', params, header);
    }

    getMtnTreatyLimit(lineCd, lineClassCd, currencyCd, treatyLimitId){
		const params = new HttpParams()
		     		.set('lineCd', (lineCd === null || lineCd === undefined ? '' : lineCd))
		     		.set('lineClassCd', (lineClassCd === null || lineClassCd === undefined ? '' : lineClassCd))
		     		.set('currencyCd', (currencyCd === null || currencyCd === undefined ? '' : currencyCd))
		     		.set('treatyLimitId', (treatyLimitId === null || treatyLimitId === undefined ? '' : treatyLimitId));

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnTreatyLimit", {params});
	}

	getMtnReportsParam(reportId?: string){
		const params = new HttpParams()
			.set('reportId', (reportId === null || reportId === undefined ? '' : reportId));

		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnReportsParam',{params});
	}

	saveMtnReportParam(save: any[], del: any[]){
		let params: any = {
			saveReportParam: save,
			delReportParam: del
		};
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnReportParam', JSON.stringify(params), header);
	}


	getMtnLossCode(lossCd?){
		const params = new HttpParams()
			.set('lossCd',lossCd===undefined || lossCd===null ? '' : lossCd)
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnLossCd",{params});
	}

	saveMtnLossCode(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnLossCd', params, header);

	}


	saveMtnTreatyLimit(params) {
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnTreatyLimit', params, header);
    }

	getMtnAdjusterList(searchParams: any[]){
        var params;
        if(searchParams.length < 1){
        	params = new HttpParams()
            .set('adjName','')
            .set('adjRefNo','')
            .set('fullAddress','')
            .set('zipCd','')
            .set('contactNo','')
            .set('emailAdd','')
            .set('createUser','')
            .set('createDateFrom','')
            .set('createDateTo','')
            .set('updateUser','')
            .set('updateDateFrom','')
            .set('updateDateTo','')
        }else{
        	params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
        }

	    return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnAdjusterList', {params});
    }

    getMtnAdjRepresentative(adjId){
    	const params = new HttpParams()
    		.set('adjId', (adjId === null || adjId === undefined ? '' : adjId));

    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnAdjRepresentative',{params});
    }

    saveMtnAdjuster(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnAdjuster',params,header);
    }

    copyTreatyLimit(params) {
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.post(environment.prodApiUrl + '/maintenance-service/copyTreatyLimit', params, header);
    }

    getClaimStatus(statusCode){
    	const params = new HttpParams()
    		.set('statusCode', (statusCode === null || statusCode === undefined ? '' : statusCode));

    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnClaimStatus',{params});
    }

    saveMtnClaimStatus(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnClaimStatus',params,header);
    }
    
    
	getMtnClmEventType(eventTypeCd?:string){
		const params = new HttpParams()
			.set('eventTypeCd', (eventTypeCd == null || eventTypeCd == undefined ? '' : eventTypeCd));

		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnClmEventType',{params});	
	}

	saveMtnClmEventType(params){
		let header : any = {
             headers: new HttpHeaders({
                 'Content-Type': 'application/json'
             })
         };

         console.log(params);
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnClmEventType',params,header);
	}

	getMtnClmEvent(eventCd?:string){
		const params = new HttpParams()
			.set('eventCd', (eventCd == null || eventCd == undefined ? '' : eventCd));

		return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnClmEvent',{params});	
	}

	saveMtnClmEvent(params){
		let header : any = {
             headers: new HttpHeaders({
                 'Content-Type': 'application/json'
             })
         };

         console.log(params);
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnClmEvent',params,header);
	}

	getMtnSecIITrtyLimit(lineCd, lineClassCd, currencyCd, seciiTrtyLimId){
		const params = new HttpParams()
		     		.set('lineCd', (lineCd === null || lineCd === undefined ? '' : lineCd))
		     		.set('lineClassCd', (lineClassCd === null || lineClassCd === undefined ? '' : lineClassCd))
		     		.set('currencyCd', (currencyCd === null || currencyCd === undefined ? '' : currencyCd))
		     		.set('seciiTrtyLimId', (seciiTrtyLimId === null || seciiTrtyLimId === undefined ? '' : seciiTrtyLimId));

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnSecIITrtyLimit", {params});
	}

	saveMtnSecIITrtyLimit(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnSecIITrtyLimit', params, header);
    }

    copySecIITrtyLimit(params) {
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.post(environment.prodApiUrl + '/maintenance-service/copySecIITrtyLimit', params, header);
    }


    getMtnClaimReason(reasonCd?, clmStatCd?, activeTag?){
    	const params = new HttpParams()
    				.set('reasonCd', (reasonCd === null || reasonCd === undefined ? '' : reasonCd))
    	     		.set('clmStatCd', (clmStatCd === null || clmStatCd === undefined ? '' : clmStatCd))
    	     		.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnClaimReason", {params});
    }

    saveMtnClaimReason(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnClaimReason', params, header);
     }

    getMtnPoolRetHist(retHistId,currencyCd){
		const params = new HttpParams()
		     		.set('retHistId', (retHistId === null || retHistId === undefined ? '' : retHistId))
		     		.set('currencyCd', (currencyCd === null || currencyCd === undefined ? '' : currencyCd));

		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnPoolRetHist", {params});
	}

	saveMtnPoolRetHist(params) {
		let header : any = {
			headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnPoolRetHist', params, header);
    }

    copyPoolRetHist(params) {
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.post(environment.prodApiUrl + '/maintenance-service/copyPoolRetHist', params, header);
    }

    getMtnLossCodeLov(lossCdType, searchStr){
		const params = new HttpParams()
			.set('lossCdType', lossCdType === undefined || lossCdType === null ? '' : lossCdType)
			.set('searchStr', searchStr === undefined || searchStr === null ? '' : searchStr);
			
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnLossCdLov",{params});
	}

	getAcitTranType(tranClass, tranTypeCd, typePrefix, autoTag, baeTag, activeTag){
		const params = new HttpParams()
			.set('tranClass', tranClass === undefined || tranClass === null ? '' : tranClass)
			.set('tranTypeCd', tranTypeCd === undefined || tranTypeCd === null ? '' : tranTypeCd)
			.set('typePrefix', typePrefix === undefined || typePrefix === null ? '' : typePrefix)
			.set('autoTag', autoTag === undefined || autoTag === null ? '' : autoTag)
			.set('baeTag', baeTag === undefined || baeTag === null ? '' : baeTag)
			.set('activeTag', activeTag === undefined || activeTag === null ? '' : activeTag)
			
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnAcitTranType",{params});
		
	}

	getMtnClmEventTypeLov(searchStr){
		const params = new HttpParams()
			.set('searchStr', searchStr === undefined || searchStr === null ? '' : searchStr);
			
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnClmEventTypeLov",{params});
	}

	getMtnClmEventLov(eventTypeCd, searchStr){
		const params = new HttpParams()
			.set('eventTypeCd', eventTypeCd === undefined || eventTypeCd === null ? '' : eventTypeCd)
			.set('searchStr', searchStr === undefined || searchStr === null ? '' : searchStr);
			
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnClmEventLov",{params});
	}

    getMtnClmCashCall(treatyCd, treatyCompCd, currencyCd){
		const params = new HttpParams()
		     		.set('treatyId', (treatyCd === null || treatyCd === undefined ? '' : treatyCd))
		     		.set('treatyCedId', (treatyCompCd === null || treatyCompCd === undefined ? '' : treatyCompCd))
		     		.set('currCd', (currencyCd === null || currencyCd === undefined ? '' : currencyCd));
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnClmCashCall", {params});
	}

	saveMtnClmCashCall(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnClmCashCall', params, header);

	}

	copyMtnClmCashCall(params) {
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.post(environment.prodApiUrl + '/maintenance-service/copyMtnClmCashCall', params, header);
    }
    
    getMtnAcitTranType(tranClass?, tranTypeCd?, typePrefix?, autoTag?, baeTag?, activeTag?){
    	const params = new HttpParams()
    				.set('tranClass', (tranClass === null || tranClass === undefined ? '' : tranClass))
    	     		.set('tranTypeCd', (tranTypeCd === null || tranTypeCd === undefined ? '' : tranTypeCd))
    	     		.set('typePrefix', (typePrefix === null || typePrefix === undefined ? '' : typePrefix))
    	     		.set('autoTag', (autoTag === null || autoTag === undefined ? '' : autoTag))
    	     		.set('baeTag', (baeTag === null || baeTag === undefined ? '' : baeTag))
    	     		.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnAcitTranType", {params});
    }

    getMtnBookingMonth(bookingMm?, bookingYear?){
    	const params = new HttpParams()
    				.set('bookingMm', (bookingMm === null || bookingMm === undefined ? '' : bookingMm))
    	     		.set('bookingYear', (bookingYear === null || bookingYear === undefined ? '' : bookingYear));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnBookingMonth", {params});
    }

    getMtnBank(bankCd?, officialName?, activeTag?, dcbTag?){
    	const params = new HttpParams()
    				.set('bankCd', (bankCd === null || bankCd === undefined ? '' : bankCd))
    				.set('officialName', (officialName === null || officialName === undefined ? '' : officialName))
    	     		.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag))
    	     		.set('dcbTag', (dcbTag === null || dcbTag === undefined ? '' : dcbTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnBank", {params});
    }

    getMtnBankAcct(bankCd?, bankAcctCd?, accountNo?, dcbTag?){
    	const params = new HttpParams()
    				.set('bankCd', (bankCd === null || bankCd === undefined ? '' : bankCd))
    				.set('bankAcctCd', (bankAcctCd === null || bankAcctCd === undefined ? '' : bankAcctCd))
    	     		.set('accountNo', (accountNo === null || accountNo === undefined ? '' : accountNo))
    	     		.set('dcbTag', (dcbTag === null || dcbTag === undefined ? '' : dcbTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnBankAcct", {params});
    }

    getMtnPrintableName(employeeId){
    	const params = new HttpParams()
    		.set('employeeId', (employeeId === null || employeeId === undefined ? '' : employeeId))
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnPrintableName", {params});
    }
   
    getMtnAcitDCBNo(dcbYear?, dcbNo?, dcbDate?, dcbStatus?){
    	const params = new HttpParams()
    				.set('dcbYear', (dcbYear === null || dcbYear === undefined ? '' : dcbYear))
    	     		.set('dcbNo', (dcbNo === null || dcbNo === undefined ? '' : dcbNo))
    	     		.set('dcbDate', (dcbDate === null || dcbDate === undefined ? '' : dcbDate))
    	     		.set('dcbStatus', (dcbStatus === null || dcbStatus === undefined ? '' : dcbStatus))
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnAcitDCBNo", {params});
    }

    saveMtnAcitDCBNo(delDCBNo, saveDCBNo){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         let params : any = {
         	delDCBNo: delDCBNo,
         	saveDCBNo: saveDCBNo
         }
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnAcitDCBNo', JSON.stringify(params), header);

	}

	getMtnDCBUser(userId?){
    	const params = new HttpParams()
    				.set('userid', (userId === null || userId === undefined ? '' : userId))
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnDCBUser", {params});
    }

    getMtnPayee(payeeNo?,payeeClassCd?){
    	const params = new HttpParams()
    				.set('payeeNo', (payeeNo === null || payeeNo === undefined ? '' : payeeNo))
    	     		.set('payeeClassCd', (payeeClassCd === null || payeeClassCd === undefined ? '' : payeeClassCd))
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnPayee", {params});
    }

    getMtnInvtSecType(invtSecCd?,activeTag?){
    	const params = new HttpParams()
    				.set('invtSecCd', (invtSecCd === null || invtSecCd === undefined ? '' : invtSecCd))
    	     		.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag))
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnInvtSecType", {params});
    }

    getMtnAcitChartAcct(param){
    	const params = new HttpParams()
    				.set('glAcctId', (param.glAcctId === null || param.glAcctId === undefined ? '' : param.glAcctId))
    				.set('glAcctCategory', (param.glAcctCategory === null || param.glAcctCategory === undefined ? '' : param.glAcctCategory))
    				.set('glAcctControl', (param.glAcctControl === null || param.glAcctControl === undefined ? '' : param.glAcctControl))
    				.set('glAcctSub1', (param.glAcctSub1 === null || param.glAcctSub1 === undefined ? '' : param.glAcctSub1))
    				.set('glAcctSub2', (param.glAcctSub2 === null || param.glAcctSub2 === undefined ? '' : param.glAcctSub2))
    				.set('glAcctSub3', (param.glAcctSub3 === null || param.glAcctSub3 === undefined ? '' : param.glAcctSub3))
    				.set('slTypeCd', (param.slTypeCd === null || param.slTypeCd === undefined ? '' : param.slTypeCd))
    				.set('drCrTag', (param.drCrTag === null || param.drCrTag === undefined ? '' : param.drCrTag))
    				.set('postTag', (param.postTag === null || param.postTag === undefined ? '' : param.postTag))
    				.set('activeTag', (param.activeTag === null || param.activeTag === undefined ? '' : param.activeTag))

    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnAcitChartAcct", {params});
    }

    getMtnSlType(param){
    	const params = new HttpParams()
    				.set('slTypeCd', (param.slTypeCd === null || param.slTypeCd === undefined ? '' : param.slTypeCd))
    				.set('autoTag', (param.autoTag === null || param.autoTag === undefined ? '' : param.autoTag))
    				.set('activeTag', (param.activeTag === null || param.activeTag === undefined ? '' : param.activeTag))
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnSLType", {params});
    }

    getMtnSL(param){
    	const params = new HttpParams()
    				.set('slTypeCd', (param.slTypeCd === null || param.slTypeCd === undefined ? '' : param.slTypeCd))
    				.set('slCd', (param.slCd === null || param.slCd === undefined ? '' : param.slCd))
    				.set('payeeNo', (param.payeeNo === null || param.payeeNo === undefined ? '' : param.payeeNo))
    				.set('autoTag', (param.autoTag === null || param.autoTag === undefined ? '' : param.autoTag))
    				.set('activeTag', (param.activeTag === null || param.activeTag === undefined ? '' : param.activeTag));
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnSL", {params});
    }

    saveMtnBank(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnBank', JSON.stringify(params), header);
    }

    getMtnCedingTreaty(treatyTag,cedingName){
    	const params = new HttpParams()
    				.set('treatyTag', (treatyTag === null || treatyTag === undefined ? '' : treatyTag))
    				.set('cedingName', (cedingName === null || cedingName === undefined ? '' : cedingName));
		return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnCedingTreaty", {params});
    }

    saveMtnBankAcct(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };	
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnBankAcct', JSON.stringify(params), header);
    }

    getMtnCompany(companyId?){
    	const params = new HttpParams()
    		.set('companyId', (companyId === null || companyId === undefined ? '' : companyId));
    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnCompany', {params});
    }

    getMtnBussType(bussTypeCd?, bussTypeName?, activeTag?){
    	const params = new HttpParams()
    		.set('bussTypeCd', (bussTypeCd === null || bussTypeCd === undefined ? '' : bussTypeCd))
    		.set('bussTypeName', (bussTypeName === null || bussTypeName === undefined ? '' : bussTypeName))
    		.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag));
    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnBussType', {params});
    }

    getMtnPayeeCeding(payeeClassCd, treatyTag){
    	const params = new HttpParams()
    		.set('payeeClassCd', (payeeClassCd === null || payeeClassCd === undefined ? '' : payeeClassCd))
    		.set('treatyTag', (treatyTag === null || treatyTag === undefined ? '' : treatyTag))
    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnPayeeCeding', {params});
    }

    getMtnAcitCheckSeries(bank?, bankAcct?, checkNo?){
    	const params = new HttpParams()
    		.set('bank', (bank === null || bank === undefined ? '' : bank))
    		.set('bankAcct', (bankAcct === null || bankAcct === undefined ? '' : bankAcct))
    		.set('checkNo', (checkNo === null || checkNo === undefined ? '' : checkNo))
    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnAcitCheckSeries', {params});
    }

    getMtnAcseTranType(tranClass?, tranTypeCd?, typePrefix?, autoTag?, baeTag?, activeTag?){
    	const params = new HttpParams()
    				.set('tranClass', (tranClass === null || tranClass === undefined ? '' : tranClass))
    	     		.set('tranTypeCd', (tranTypeCd === null || tranTypeCd === undefined ? '' : tranTypeCd))
    	     		.set('typePrefix', (typePrefix === null || typePrefix === undefined ? '' : typePrefix))
    	     		.set('autoTag', (autoTag === null || autoTag === undefined ? '' : autoTag))
    	     		.set('baeTag', (baeTag === null || baeTag === undefined ? '' : baeTag))
    	     		.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnAcseTranType", {params});
    }

	getMtnAcseDCBNo(dcbYear?, dcbNo?, dcbDate?, dcbStatus?){
    	const params = new HttpParams()
    				.set('dcbYear', (dcbYear === null || dcbYear === undefined ? '' : dcbYear))
    	     		.set('dcbNo', (dcbNo === null || dcbNo === undefined ? '' : dcbNo))
    	     		.set('dcbDate', (dcbDate === null || dcbDate === undefined ? '' : dcbDate))
    	     		.set('dcbStatus', (dcbStatus === null || dcbStatus === undefined ? '' : dcbStatus))
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnAcseDCBNo", {params});
    }

    saveMtnAcseDCBNo(delDCBNo, saveDCBNo){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         let params : any = {
         	delDCBNo: delDCBNo,
         	saveDCBNo: saveDCBNo
         }
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnAcseDCBNo', JSON.stringify(params), header);

	}

	getMtnAcitArSeries(usedTag?, rowNum?){
		const params = new HttpParams()
						.set('usedTag', (usedTag === null || usedTag === undefined ? '' : usedTag))
    	     			.set('rowNum', (rowNum === null || rowNum === undefined ? '' : rowNum));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnAcitArSeries", {params});
	}
    
    getMtnGenTax(taxCd?, taxName?, chargeType?, fixedTag?, activeTag?){
    	const params = new HttpParams()
						.set('taxCd', (taxCd === null || taxCd === undefined ? '' : taxCd))
						.set('taxName', (taxName === null || taxName === undefined ? '' : taxName))
						.set('chargeType', (chargeType === null || chargeType === undefined ? '' : chargeType))
						.set('fixedTag', (fixedTag === null || fixedTag === undefined ? '' : fixedTag))
    	     			.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnGenTax", {params});
    }

    getMtnWhTax(taxCd?, taxName?, taxType?, creditableTag?, fixedTag?, activeTag?){
    	const params = new HttpParams()
						.set('taxCd', (taxCd === null || taxCd === undefined ? '' : taxCd))
						.set('taxName', (taxName === null || taxName === undefined ? '' : taxName))
						.set('taxType', (taxType === null || taxType === undefined ? '' : taxType))
						.set('creditableTag', (creditableTag === null || creditableTag === undefined ? '' : creditableTag))
						.set('fixedTag', (fixedTag === null || fixedTag === undefined ? '' : fixedTag))
    	     			.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnWhTax", {params});
    }

    saveMtnBussType(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnBussType', JSON.stringify(params), header);
    }


    getMtnAcseCheckSeries(bank?, bankAcct?, checkNo?){
    	const params = new HttpParams()
    		.set('bank', (bank === null || bank === undefined ? '' : bank))
    		.set('bankAcct', (bankAcct === null || bankAcct === undefined ? '' : bankAcct))
    		.set('checkNo', (checkNo === null || checkNo === undefined ? '' : checkNo))
    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnAcseCheckSeries', {params});
    }


    generateARSeries(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/generateARSeries', JSON.stringify(params), header);
    }

    saveMtnDcbUser(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnDcbUser', JSON.stringify(params), header);
    }

    getMtnEmployee(companyId?, employeeId?){
    	const params = new HttpParams()
						.set('companyId', (companyId === null || companyId === undefined ? '' : companyId))
						.set('taxName', (employeeId === null || employeeId === undefined ? '' : employeeId));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnEmployee", {params});
    }

     saveMtnEmployee(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnEmployee', JSON.stringify(params), header);
      }

    getMtnAcseChartAcct(param){
    	const params = new HttpParams()
    				.set('glAcctId', (param.glAcctId === null || param.glAcctId === undefined ? '' : param.glAcctId))
    				.set('glAcctCategory', (param.glAcctCategory === null || param.glAcctCategory === undefined ? '' : param.glAcctCategory))
    				.set('glAcctControl', (param.glAcctControl === null || param.glAcctControl === undefined ? '' : param.glAcctControl))
    				.set('glAcctSub1', (param.glAcctSub1 === null || param.glAcctSub1 === undefined ? '' : param.glAcctSub1))
    				.set('glAcctSub2', (param.glAcctSub2 === null || param.glAcctSub2 === undefined ? '' : param.glAcctSub2))
    				.set('glAcctSub3', (param.glAcctSub3 === null || param.glAcctSub3 === undefined ? '' : param.glAcctSub3))
    				.set('slTypeCd', (param.slTypeCd === null || param.slTypeCd === undefined ? '' : param.slTypeCd))
    				.set('drCrTag', (param.drCrTag === null || param.drCrTag === undefined ? '' : param.drCrTag))
    				.set('postTag', (param.postTag === null || param.postTag === undefined ? '' : param.postTag))
    				.set('activeTag', (param.activeTag === null || param.activeTag === undefined ? '' : param.activeTag))

    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnAcseChartAcct", {params});
    }

    generateCVSeries(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/generateCVSeries', JSON.stringify(params), header);
     }

     generateJVSeries(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/generateJVSeries', JSON.stringify(params), header);
     }

     getArSeries(arFrom, arTo, usedTag?){
    	const params = new HttpParams()
			.set('arFrom', (arFrom === null || arFrom === undefined ? '' : arFrom))
			.set('arTo', (arTo === null || arTo === undefined ? '' : arTo))
			.set('usedTag', (usedTag === null || usedTag === undefined ? '' : usedTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveArSeries", {params});
    }

    getCvSeries(cvYear,cvFrom, cvTo, usedTag?){
    	const params = new HttpParams()
    		.set('cvYear', (cvYear === null || cvYear === undefined ? '' : cvYear))
			.set('cvFrom', (cvFrom === null || cvFrom === undefined ? '' : cvFrom))
			.set('cvTo', (cvTo === null || cvTo === undefined ? '' : cvTo))
			.set('usedTag', (usedTag === null || usedTag === undefined ? '' : usedTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveCvSeries", {params});
    }

    getJvSeries(jvYear,jvFrom, jvTo, usedTag?){
    	const params = new HttpParams()
    		.set('jvYear', (jvYear === null || jvYear === undefined ? '' : jvYear))
			.set('jvFrom', (jvFrom === null || jvFrom === undefined ? '' : jvFrom))
			.set('jvTo', (jvTo === null || jvTo === undefined ? '' : jvTo))
			.set('usedTag', (usedTag === null || usedTag === undefined ? '' : usedTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveJvSeries", {params});
    }

    getMaxTranSeries(tranClass,tranFrom,tranTo,year?){
    	const params = new HttpParams()
    		.set('tranClass', (tranClass === null || tranClass === undefined ? '' : tranClass))
    		.set('tranFrom', (tranFrom === null || tranFrom === undefined ? '' : tranFrom))
    		.set('tranTo', (tranTo === null || tranTo === undefined ? '' : tranTo))
    		.set('year', (year === null || year === undefined ? '' : year));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveAcitAllowGenerate", {params});
    }

    generateORSeries(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/generateAcseORSeries', JSON.stringify(params), header);
    }

    generateAcseCVSeries(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/generateAcseCVSeries', JSON.stringify(params), header);
    }
    
    generateAcseJVSeries(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/generateAcseJVSeries', JSON.stringify(params), header);
    }

     saveMtnGenTax(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
		return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnGenTax', JSON.stringify(params), header);
      }

    getAcseOrSeries(orType,orFrom,orTo, usedTag?){
    	const params = new HttpParams()
    		.set('orType', (orType === null || orType === undefined ? '' : orType))
			.set('orFrom', (orFrom === null || orFrom === undefined ? '' : orFrom))
			.set('orTo', (orTo === null || orTo === undefined ? '' : orTo))
			.set('usedTag', (usedTag === null || usedTag === undefined ? '' : usedTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveAcseOrSeries", {params});
    }

    getAcseCvSeries(cvYear,cvFrom,cvTo, usedTag?){
    	const params = new HttpParams()
    		.set('cvYear', (cvYear === null || cvYear === undefined ? '' : cvYear))
			.set('cvFrom', (cvFrom === null || cvFrom === undefined ? '' : cvFrom))
			.set('cvTo', (cvTo === null || cvTo === undefined ? '' : cvTo))
			.set('usedTag', (usedTag === null || usedTag === undefined ? '' : usedTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveAcseCVSeries", {params});
    }

    getAcseJvSeries(jvYear,jvFrom,jvTo, usedTag?){
    	const params = new HttpParams()
    		.set('jvYear', (jvYear === null || jvYear === undefined ? '' : jvYear))
			.set('jvFrom', (jvFrom === null || jvFrom === undefined ? '' : jvFrom))
			.set('jvTo', (jvTo === null || jvTo === undefined ? '' : jvTo))
			.set('usedTag', (usedTag === null || usedTag === undefined ? '' : usedTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveAcseJVSeries", {params});
    }

    getAcseMaxTranSeries(tranClass,tranFrom,tranTo,tranYear?,orType?){
    	const params = new HttpParams()
    		.set('tranClass', (tranClass === null || tranClass === undefined ? '' : tranClass))
    		.set('tranFrom', (tranFrom === null || tranFrom === undefined ? '' : tranFrom))
    		.set('tranTo', (tranTo === null || tranTo === undefined ? '' : tranTo))
    		.set('tranYear', (tranYear === null || tranYear === undefined ? '' : tranYear))
    		.set('orType', (orType === null || orType === undefined ? '' : orType));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveAcseAllowGenerate", {params});
    }

    getWhTax(whtaxId, taxCd, taxType, creditableTag?, fixedTag?, activeTag?){
    	const params = new HttpParams()
    		.set('whtaxId', (whtaxId === null || whtaxId === undefined ? '' : whtaxId))
    		.set('taxCd', (taxCd === null || taxCd === undefined ? '' : taxCd))
    		.set('taxType', (taxType === null || taxType === undefined ? '' : taxType))
    		.set('creditableTag', (creditableTag === null || creditableTag === undefined ? '' : creditableTag))
    		.set('fixedTag', (fixedTag === null || fixedTag === undefined ? '' : fixedTag))
    		.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveAcseWHTax", {params});
    }

    saveWhTax(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnWhTax', JSON.stringify(params), header);
    }

     getMtnGenTaxHist(taxId?){
    	const params = new HttpParams()
						.set('taxId', (taxId === null || taxId === undefined ? '' : taxId));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnGenTaxHist", {params});
    }

    saveMtnGenTaxHist(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
        };
		return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnGenTaxHist', JSON.stringify(params), header);
      }

    saveAcitTrantype(params){
		let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnAcitTranType', JSON.stringify(params), header);
    }

    saveMtnGenTaxRange(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
		return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnGenTaxRange', JSON.stringify(params), header);
    }

    getAcitDefAmt(tranClass,tranTypeCd,itemNo?){
    	const params = new HttpParams()
    		.set('tranClass', (tranClass == null || tranClass == undefined ? '' : tranClass))
    		.set('tranTypeCd', (tranTypeCd == null || tranTypeCd == undefined ? '' : tranTypeCd))
    		.set('itemNo', (itemNo == null || itemNo == undefined ? '' : itemNo));

    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveAcitDefAmt',{params});	
    }

    saveAcitAmtDtl(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnAcitDefAmt', JSON.stringify(params), header);
    }

    getAcitDefAcctEnt(tranClass,tranTypeCd,entryNo?){
    	const params = new HttpParams()
    		.set('tranClass', (tranClass == null || tranClass == undefined ? '' : tranClass))
    		.set('tranTypeCd', (tranTypeCd == null || tranTypeCd == undefined ? '' : tranTypeCd))
    		.set('entryNo', (entryNo == null || entryNo == undefined ? '' : entryNo));

    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveAcitDefAcctEnt',{params});	
    }

    saveAcitDefAcctEnt(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveAcitDefAcctEnt', JSON.stringify(params), header);
    }

    saveAcseTranType(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveAcseTranType', JSON.stringify(params), header);
    }


    getMtnGenTaxRange(taxId?){
    	const params = new HttpParams()
						.set('taxId', (taxId === null || taxId === undefined ? '' : taxId));
    	return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnGenTaxRange", {params});
    }

     saveMtnInvSecType(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnInvSecType', JSON.stringify(params), header);
      }

    getMtnPayeeClass(payeeClassCd?,activeTag?){
    	const params = new HttpParams()
						.set('payeeClassCd', (payeeClassCd === null || payeeClassCd === undefined ? '' : payeeClassCd))
						.set('activeTag', (activeTag === null || activeTag === undefined ? '' : activeTag));
    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMtnPayeeClass', {params});
    }

    saveMtnPayeeClass(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnPayeeClass', JSON.stringify(params), header);
    }

    saveMtnSLType(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnSLType', JSON.stringify(params), header);
    }

    saveMtnSL(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveMtnSL', JSON.stringify(params), header);
    }

    getMtnAcseDefAcctEnt(tranClass?,tranTypeCd?,entryNo?){
    	const params = new HttpParams()
			.set('tranClass', (tranClass === null || tranClass === undefined ? '' : tranClass))
			.set('tranTypeCd', (tranTypeCd === null || tranTypeCd === undefined ? '' : tranTypeCd))
			.set('entryNo', (entryNo === null || entryNo === undefined ? '' : entryNo));
    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveAcseDefAcctEnt', {params});
    }

    saveMtnAcseAcctEnt(params){
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveAcseDefAcctEnt', JSON.stringify(params), header);
    }

    getAcseDefAmt(tranClass,tranTypeCd,itemNo?){
    	const params = new HttpParams()
    		.set('tranClass', (tranClass == null || tranClass == undefined ? '' : tranClass))
    		.set('tranTypeCd', (tranTypeCd == null || tranTypeCd == undefined ? '' : tranTypeCd))
    		.set('itemNo', (itemNo == null || itemNo == undefined ? '' : itemNo));

    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveAcseAmtDtl',{params});	
    }

    saveAcseAmtDtl(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveAcseAmtDtl', JSON.stringify(params), header);
    }

    getAcseWhtaxHist(whTaxId,histNo,taxCd?){
    	const params = new HttpParams()
    		.set('whTaxId', (whTaxId == null || whTaxId == undefined ? '' : whTaxId))
    		.set('histNo', (histNo == null || histNo == undefined ? '' : histNo))
    		.set('taxCd', (taxCd == null || taxCd == undefined ? '' : taxCd));

    	return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveAcseWhTaxHist',{params});	
    }

    saveAcseWhtaxHist(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveAcseWhTaxHist', JSON.stringify(params), header);
    }

    saveAcitChartAcct(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveAcitChartAcct', JSON.stringify(params), header);
    }

    saveAcseChartAcct(params) {
    	let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
         };
         return this.http.post(environment.prodApiUrl + '/maintenance-service/saveAcseChartAcct', JSON.stringify(params), header);
    }
}