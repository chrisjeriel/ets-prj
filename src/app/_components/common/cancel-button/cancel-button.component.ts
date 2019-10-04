import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cancel-button',
  templateUrl: './cancel-button.component.html',
  styleUrls: ['./cancel-button.component.css']
})
export class CancelButtonComponent implements OnInit {
  @ViewChild('saveModal') saveModal: ModalComponent;
  @Input() url:any;
  @Output() onYes: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() no: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() onCancel: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input()form : NgForm;
  constructor(private router:Router, private modalService: NgbModal) { }  

  ngOnInit() {
  }

  clickCancel(){
  	if((this.form == undefined && $('.ng-dirty:not([type="search"]):not(.not-form)').length != 0) || (this.form!= undefined && this.form.dirty)){
      this.saveModal.openNoClose();
  	} else {
      if (this.url != null) {
        this.router.navigate([this.url]);
      } else {
        ///this.saveModal.closeModal();
        this.onClickNo();
      }
  	}
  }

  onNo(){
    if (this.url != null) {
      $('.ng-dirty').removeClass('ng-dirty');
      this.router.navigate([this.url]);
    } else {
      this.saveModal.closeModal();
    }
  }

  onClickYes(){
  	this.onYes.emit();
  }

  onClickNo(){
    this.no.emit();
  }

  onClickCancel(){
    this.onCancel.emit();
  }

}
