import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { UsersInfo, UserGroups, ModuleInfo, ModuleTransaction } from '@app/_models';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root'
})

export class SecurityService {

	usersInfo : UsersInfo[] = [];
	userGroups: UserGroups[] = [];
	moduleInfo: ModuleInfo[] = [];
	moduleTransaction: ModuleTransaction[]=[];

	constructor(private http: HttpClient) { }

	getUsersInfo(){
		this.usersInfo = [
			new UsersInfo('LCUARESMA','Lope Cuaresma','001','Admin','Y','lopecuaresma@pmmsc.com.ph','System Administrator'),
			new UsersInfo('MIBANEZ','Mel Ibanez','002','Engineering',' Y','melibanez@pmmsc.com.ph',null),
			new UsersInfo('ESALUNSON','Edwars Salunson','003','Engineering','Y','edwardsalunson@pmmsc.com.ph',null),
			new UsersInfo('LGUEVARRA','Ludy Guevarra','003','Accounting','Y','ludyguevarra@pmmsc.com.ph',null),
			new UsersInfo('CREYES','Chie Reyes','003','Accounting','Y','chiereyes@pmmsc.com.ph',null)
		]
		return this.usersInfo
	}

	getUsersGroup(){
		this.userGroups = [
			new UserGroups('001','Admin','System Administrators'),
			new UserGroups('002','Engineering',null),
			new UserGroups('003','Accounting',null)
		]
		return this.userGroups;
	}

	getMtnModules(moduleId?, tranCd?){
		const params = new HttpParams()
			.set('moduleId',moduleId ===undefined || moduleId===null ? '' : moduleId)
			.set('tranCd',tranCd ===undefined || tranCd===null ? '' : tranCd)
		return this.http.get(environment.prodApiUrl + "/security-service/retrieveMtnModules",{params});
	}

	getMtnTransactions(moduleId?, tranCd?){
		const params = new HttpParams()
			.set('moduleId',moduleId ===undefined || moduleId===null ? '' : moduleId)
			.set('tranCd',tranCd ===undefined || tranCd===null ? '' : tranCd)
		return this.http.get(environment.prodApiUrl + "/security-service/retrieveMtnTransactions",{params});
	}
}