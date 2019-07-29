import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting-mtn',
  templateUrl: './accounting-mtn.component.html',
  styleUrls: ['./accounting-mtn.component.css']
})
export class AccountingMtnComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	setTimeout(() => {
  		console.log($('div.col-sm-3'));
  		$('div.col-sm-3').find('p-accordion').click();
  	}, 0);
  }

}
