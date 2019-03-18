import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

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

    retMtnUsers(userId: string){
         const params = new HttpParams()
                .set('userId', userId);

        return this.http.get(environment.prodApiUrl + '/user-service/retMtnUsers', {params});
    }
}