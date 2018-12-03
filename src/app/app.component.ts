import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';

import { AuthenticationService } from './_services';
import { User } from './_models';

@Component({ 
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    datetime: Date;
    currentUser: User;
    public style: object = {};

    private _opened: boolean = true; /*must be added*/
    private _closeOnClickOutside: boolean = true; /*must be added*/

    private _toggleOpened(): void {
        this._opened = !this._opened;
    }

    private _toggleCloseOnClickOutside(): void {
        this._closeOnClickOutside = !this._closeOnClickOutside;
    }

    constructor(
    private router: Router,
     private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        setInterval(() => {
            this.datetime = Date.now();
        }, 1);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}