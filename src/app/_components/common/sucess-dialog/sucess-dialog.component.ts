import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { dialogOpts } from 'src/environments/dialog';

@Component({
  selector: 'app-sucess-dialog',
  templateUrl: './sucess-dialog.component.html',
  styleUrls: ['./sucess-dialog.component.css']
})
export class SucessDialogComponent implements OnInit {

  @ViewChild(ModalComponent) modal: ModalComponent;
  @Input() message: string = dialogOpts.successMessage;
  @Input() icon: string = "success";
  @Output() onOk: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private modalService: NgbModal) { }

  ngOnInit() {

  }

  onClickOk() {
    $('.ng-dirty').removeClass('ng-dirty');
    this.onOk.emit();
    this.modal.closeModal();
  }

  open(content?) {        
  		// this.modalService.dismissAll();
    //     this.modalService.open(content, { centered: true, backdrop: 'static', windowClass : 'success-modal-size' });
     // $('#successMdl > #modalBtn').trigger('click');
     this.modal.openNoClose();
    }

}
