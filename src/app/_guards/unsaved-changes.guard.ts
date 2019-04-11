import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import {NgbModal,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

export interface CanComponentDeactivate {
 canDeactivate: (modalService : NgbModal) => Observable<boolean> | Promise<boolean> | boolean;
}


@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
    constructor(private modalService:NgbModal){}
    canDeactivate(component: CanComponentDeactivate):Observable<boolean> | Promise<boolean> | boolean {
    	if( $('.cancel-mdl-header').length != 1 && $('.ng-dirty').length != 0 ){
    		// if(!confirm("Leave without saving changes?"))
        // 		return false;
        // 	else
        // 		return true;

        const subject = new Subject<boolean>();
        const modal = this.modalService.open(ConfirmLeaveComponent,{
            centered: true, 
            backdrop: 'static', 
            windowClass : 'modal-size'
        });
        modal.componentInstance.subject = subject;

        return subject.asObservable();


    	}
      else
      	return true;
    }
}
