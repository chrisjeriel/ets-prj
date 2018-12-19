import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-gen-info-cover-open-letter',
  templateUrl: './pol-gen-info-cover-open-letter.component.html',
  styleUrls: ['./pol-gen-info-cover-open-letter.component.css']
})
export class PolGenInfoCoverOpenLetterComponent implements OnInit {

  constructor( private modalService: NgbModal) { }

  ngOnInit() {
  }

  showItemInfoModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

}
