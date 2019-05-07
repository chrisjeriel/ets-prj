import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

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

    saveWfmReminders(params){
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.post(environment.prodApiUrl +'/work-flow-service/saveReminders',JSON.stringify(params),header);
    }

    retrieveWfmNotes(noteId: string, assignedTo: string , createUser: string ){
         const params = new HttpParams()
                .set('noteId', noteId)
                .set('assignedTo', assignedTo)
                .set('createUser', createUser);

        return this.http.get(environment.prodApiUrl + '/work-flow-service/retNotes', {params});
    }

    saveWfmNotes(params){
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.post(environment.prodApiUrl +'/work-flow-service/saveNotes',JSON.stringify(params),header);
    }



}