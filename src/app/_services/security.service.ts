import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersInfo, UserGroups, ModuleInfo, ModuleTransaction } from '@app/_models';
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

	getModuleInfo(){
		this.moduleInfo = [
			new ModuleInfo('QUOTE001','Quoation Processing','Quotation','This module displays the list of quotation that are valid for processing. It allows the user to add or edit'),
			new ModuleInfo('QUOTE002','General Info(Quotation)','Quotation','This module displays the list of quotation that are valid for processing. It allows the user to add or edit'),
			new ModuleInfo('QUOTE003','Coverage(Quotation)','Quotation','This module allows the user to add or edit section covers, sum insured and quoytation deductibles'),
			new ModuleInfo('QUOTE004','Quote Option(Quotation)','Quotation','This module allows the user to add or edit quoatation conditions and other rates')
		]
		return this.moduleInfo;
	}

	getModuleTransaction(){
		this.moduleTransaction = [
			new ModuleTransaction('001','Security','System Admin'),
			new ModuleTransaction('002','Quotation Processing',null),
			new ModuleTransaction('003','POL - Policy/Alteration Issuance',null),
			new ModuleTransaction('004','POL - POSTING',null),
			new ModuleTransaction('005','POL - Distribution',null),
			new ModuleTransaction('006','POL Expiry & Renewal',null)
		]
		return this.moduleTransaction;
	}
}