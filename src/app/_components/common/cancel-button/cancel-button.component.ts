import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  constructor(private router:Router, private modalService: NgbModal) { }

  ngOnInit() {
  }

  clickCancel(){
  	if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
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
    $('.ng-dirty').removeClass('ng-dirty');
    if (this.url != null) {
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
