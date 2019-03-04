import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-confirm-save',
  templateUrl: './confirm-save.component.html',
  styleUrls: ['./confirm-save.component.css']
})
export class ConfirmSaveComponent implements OnInit {
  @ViewChild('confirm-save') saveModal: ModalComponent;
  @Output() onYes: EventEmitter<any[]> = new EventEmitter<any[]>();
  constructor() { }

  ngOnInit() {

  }

}
