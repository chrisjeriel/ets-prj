import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    public accessibleModules = new Subject<any>();
    public moduleIdObs = new Subject<string>();
    public accessibleModulesArr: string[] = [];

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`${environment.apiUrl}/users/${user.id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    userLogin(userId: string, password: string) {
        const params = new HttpParams()
                .set('userId', userId)
                .set('password', password);

        return this.http.get(environment.prodApiUrl + '/user-service/userLogin', {params});
    }

    retMtnUsers(userId?: string, userGrp?: string){
         const params = new HttpParams()
            .set('userId',userId ===undefined || userId===null ? '' : userId)
            .set('userGrp',userGrp ===undefined || userGrp===null ? '' : userGrp);
            
        return this.http.get(environment.prodApiUrl + '/user-service/retMtnUsers', {params});
    }

    retMtnUserAmtLmt(userGrp,lineCd){
         const params = new HttpParams()
                .set('userGrp', userGrp)
                .set('lineCd', lineCd)

        return this.http.get(environment.prodApiUrl + '/user-service/retrieveMtnUserAmountLimit', {params});
    }

    saveMtnUser(params) {
        let header: any = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        return this.http.post(environment.prodApiUrl + '/user-service/saveMtnUser',params,header);
    }

    setAccessModules(data) {
        this.accessibleModulesArr = data;
    }

    getAccessModules() {
        return this.accessibleModulesArr;
    }

    emitAccessModules(val) {
        this.accessibleModules.next(val);
    }

    emitModuleId(val) {
        this.moduleIdObs.next(val);
    }
}