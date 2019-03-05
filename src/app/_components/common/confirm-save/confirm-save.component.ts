import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-confirm-save',
  templateUrl: './confirm-save.component.html',
  styleUrls: ['./confirm-save.component.css']
})
export class ConfirmSaveComponent implements OnInit {
  @ViewChild('saveModal') saveModal: ModalComponent;
  @ViewChild('success') sucessDialog : SucessDialogComponent;
  // @ViewChild('saveModal') saveModal: ModalComponent;
  @Output() onYes: EventEmitter<any[]> = new EventEmitter<any[]>();
  dialogMessage:string;
  dialogIcon: string;
  constructor() { }

  ngOnInit() {

  }

  confirmModal(){
  	if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
  		this.saveModal.openNoClose();
  	}else{
  	  this.dialogMessage = "Nothing to save.";
      this.dialogIcon = "info"
      this.sucessDialog.open();
  	}
  }

  // 
}
