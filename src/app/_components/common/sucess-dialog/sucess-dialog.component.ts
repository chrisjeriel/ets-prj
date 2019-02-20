import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sucess-dialog',
  templateUrl: './sucess-dialog.component.html',
  styleUrls: ['./sucess-dialog.component.css']
})
export class SucessDialogComponent implements OnInit {


  @Input() message: string = "Successfully Saved!"

  constructor(private modalService: NgbModal) { }

  ngOnInit() {

  }

  open(content) {        
  		this.modalService.dismissAll();
        this.modalService.open(content, { centered: true, backdrop: 'static', windowClass : 'success-modal-size' });
    }

}
