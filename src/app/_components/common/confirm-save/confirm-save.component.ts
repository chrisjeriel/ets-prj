import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

import {NgForm} from '@angular/forms';

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
  @Output() onNo: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Input() form: NgForm;


  dialogMessage:string;
  dialogIcon: string;
  showBool : boolean = true;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    setTimeout(() => { $('div.globalLoading').css({'height': $('#wrapperDiv').height() + 'px'}); }, 0); // to cover scrollable content
  }

  confirmModal(){
    console.log(this.form)
  	if((this.form == undefined && $('.ng-dirty:not([type="search"]):not(.not-form)').length != 0)|| (this.form != undefined && this.form.dirty)
        ){
  		this.saveModal.openNoClose();
  	}else{
  	  this.dialogMessage = "Nothing to save.";
      this.dialogIcon = "info"
      this.sucessDialog.open();
  	}
  }

  onClickYes(){
    this.onYes.emit();
    this.saveModal.closeModal()
    if(this.showBool){
      this.showLoading(true);
    }else {
      this.showLoading(false);
    }
    
  }

  onClickNo(){
    //$('.ng-dirty').removeClass('ng-dirty'); will cause nothing to save next time save is clicked
    this.onNo.emit();
    this.saveModal.closeModal();
  }

  showLoading(obj : boolean){
    if(obj){
      $('.globalLoading').css('display','block');
    }else {
      $('.globalLoading').css('display','none');
    }
  }
  // 
}
