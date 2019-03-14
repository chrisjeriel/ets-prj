import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate):Observable<boolean> | Promise<boolean> | boolean {
  	if($('.ng-dirty').length != 0 && !confirm("Leave without saving changes?")){
    	return false;
  	}
    else
    	return true;
  }
}
