import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-open-cover',
  templateUrl: './open-cover.component.html',
  styleUrls: ['./open-cover.component.css']
})
export class OpenCoverComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public beforeChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'approval-tab') {
			$event.preventDefault();
		}
	}
}
