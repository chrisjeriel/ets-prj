import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-claims',
  templateUrl: './payment-claims.component.html',
  styleUrls: ['./payment-claims.component.css']
})
export class PaymentClaimsComponent implements OnInit {
  dateCreated:string;
  lastUpdate:string;
    
  constructor() { }

  ngOnInit() {
  	this.dateCreated = new Date(2018,10,1).toISOString().slice(0, 16);
    this.lastUpdate = new Date().toISOString().slice(0, 16);
  }

}
