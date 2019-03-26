import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate):Observable<boolean> | Promise<boolean> | boolean {

  	if( $('.cancel-mdl-header').length != 1 && $('.ng-dirty').length != 0 ){
  		if(!confirm("Leave without saving changes?"))
    		return false;
    	else
    		return true;
  	}
    else
    	return true;
  }
}
