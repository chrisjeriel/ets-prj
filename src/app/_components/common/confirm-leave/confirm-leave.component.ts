import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbModal,NgbModalRef,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-leave',
  templateUrl: './confirm-leave.component.html',
  styleUrls: ['./confirm-leave.component.css']
})
export class ConfirmLeaveComponent {
  subject: Subject<boolean>;
  closeAll: boolean = true;

  constructor(public modalService: NgbModal,private activeModal: NgbActiveModal) { }

  action(value: boolean) {
  	this.activeModal.close();
    // this.modalService.dismissAll();
    if(value && this.closeAll)
    	this.modalService.dismissAll();
    this.subject.next(value);
    this.subject.complete();
  }


}
