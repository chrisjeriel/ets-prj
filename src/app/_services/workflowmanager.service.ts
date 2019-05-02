import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkFlowManagerService {
    constructor(private http: HttpClient) { }

    retrieveWfmApprovals(userId: string){
         const params = new HttpParams()
                .set('userId', userId);

        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrieveWfmApprovals', {params});
    }


    retrieveWfmReminders(reminderId: string, assignedTo: string , createUser: string ){
         const params = new HttpParams()
                .set('reminderId', reminderId)
                .set('assignedTo', assignedTo)
                .set('createUser', createUser);

        return this.http.get(environment.prodApiUrl + '/work-flow-service/retReminders', {params});
    }


}