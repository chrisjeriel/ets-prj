import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-register',
  templateUrl: './cv-register.component.html',
  styleUrls: ['./cv-register.component.css']
})
export class CvRegisterComponent implements OnInit {

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
