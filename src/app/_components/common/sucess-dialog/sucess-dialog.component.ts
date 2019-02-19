import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sucess-dialog',
  templateUrl: './sucess-dialog.component.html',
  styleUrls: ['./sucess-dialog.component.css']
})
export class SucessDialogComponent implements OnInit {

  @Input() message: string = "Successful Saved!"
  constructor(private modalService: NgbModal) { }

  ngOnInit() {

  }

}
