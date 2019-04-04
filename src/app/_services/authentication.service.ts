import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;


    currUser:any = {
        "id" : "",
        "username" : "",
        "firstName" : "",
        "lastName" : "",
    };

    valLogin:any = {
        user: {},
        token: "",
    };

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    /*login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }*/

    login(username: string, password: string) {
        const params = new HttpParams()
             .set('userId', (username === null || username === undefined ? '' : username) )
             .set('password',(password === null || password === undefined ? '' : password) )
        return this.http.get<any>(environment.prodApiUrl + "/user-service/userAuthenticate",{params})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user.user != null) {
                    user.username = user.user.userId;
                    user.firstName = user.user.userName;
                    user.lastName = '';
                    user.token = "fake-jwt-token";
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    this.currentUserSubject.next(user);
                    console.log("USER:::" + JSON.stringify(user));
                    return user;
                } else {
                    // else return 400 bad request
                    console.log("Incorrect account.");
                    throw ({ error: { message: 'Username or password is incorrect' } });
                }
                /*{"id":2,"username":"TOTZ","firstName":"TOTZ","lastName":"TOTZ","token":"fake-jwt-token"}*/
                
            }),catchError(e=>{
                throw(e=="Unknown Error" ?{ error: { message: 'Connection Error' } } :e)    
            }
            ))
            ;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}