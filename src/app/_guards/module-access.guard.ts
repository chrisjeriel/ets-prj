import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService, UserService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class ModuleAccessGuard implements CanActivate {


    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const moduleIdFromRouting = route.data.moduleId;
        const verifyWithData = route.data.verifyWithData;
        var index = -1;

        this.userService.accessibleModules.subscribe(data => { return index = data.indexOf(moduleIdFromRouting); });

        if (index > -1) {
            if (verifyWithData) {
                if (jQuery.isEmptyObject(route.paramMap['params'])) {
                    alert("Abnormal way of accessing this module, you will be redirected to Home Screen.");


                    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            // not logged in so redirect to login page with the return url
            alert("You have no access to this module. Please contact administrator.");
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }
    }
}