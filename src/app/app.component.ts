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
    currentUser: User;
    public style: object = {};

    private _opened: boolean = true;
 
    private _toggleSidebar() {
        this._opened = !this._opened;
    }

    validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 50;
        if (
          event.rectangle.width &&
          event.rectangle.height &&
          (event.rectangle.width < MIN_DIMENSIONS_PX ||
            event.rectangle.height < MIN_DIMENSIONS_PX)
        ) {
          return false;
        }
        return true;
    }

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    onResizeEnd(event: ResizeEvent): void {
        console.log(this);
        this.style = {
          position: 'relative',
          left: `${event.rectangle.left}px`,
          top: `${event.rectangle.top}px`,
          width: `${event.rectangle.width}px`,
          height: `${event.rectangle.height}px`
        };
      }
}