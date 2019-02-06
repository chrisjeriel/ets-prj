import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cv-entry-service',
  templateUrl: './cv-entry-service.component.html',
  styleUrls: ['./cv-entry-service.component.css']
})
export class CvEntryServiceComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  showPrintModal() {
    $('#printMdl > #modalBtn').trigger('click');
  }
}
