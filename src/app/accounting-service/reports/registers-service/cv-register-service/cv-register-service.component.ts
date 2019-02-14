import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-register-service',
  templateUrl: './cv-register-service.component.html',
  styleUrls: ['./cv-register-service.component.css']
})
export class CvRegisterServiceComponent implements OnInit {

  tDate: boolean = true;
  pDate: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  tickBox(event) {
  	var el = event.target.closest('input');

  	this.tDate = false;
  	this.pDate = false;

  	$('.rdo').prop('checked', false);
  	$(el).prop('checked', true);
  }
}
