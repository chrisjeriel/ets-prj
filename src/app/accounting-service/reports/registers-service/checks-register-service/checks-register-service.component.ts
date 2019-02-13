import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checks-register-service',
  templateUrl: './checks-register-service.component.html',
  styleUrls: ['./checks-register-service.component.css']
})
export class ChecksRegisterServiceComponent implements OnInit {

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
