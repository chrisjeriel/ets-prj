import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';

import { AuthenticationService } from './_services';
import { User } from './_models';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({ 
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    datetime: number;
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

    content: any;
    
    constructor(
    private router: Router,
     private authenticationService: AuthenticationService,
     config: NgbModalConfig,
     private modalService: NgbModal

    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        setInterval(() => {
            this.datetime = Date.now();
        }, 1);
        config.backdrop = 'static';
        config.keyboard = false;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    open(content) {
        this.content = content;
        this.modalService.dismissAll();
        this.modalService.open(this.content, { centered: true , windowClass : 'modal-size'} );
    }
    


}