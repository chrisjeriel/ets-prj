import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

}