import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersInfo } from '@app/_models';
@Injectable({
	providedIn: 'root'
})

export class SecurityService {

	usersInfo : UsersInfo[] = [];

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
}