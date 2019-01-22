import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checks-register',
  templateUrl: './checks-register.component.html',
  styleUrls: ['./checks-register.component.css']
})
export class ChecksRegisterComponent implements OnInit {

  tDate: boolean = false;
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
