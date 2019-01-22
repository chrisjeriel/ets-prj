import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payment-request-entry',
  templateUrl: './payment-request-entry.component.html',
  styleUrls: ['./payment-request-entry.component.css']
})
export class PaymentRequestEntryComponent implements OnInit {
  dateCreated:string;
  lastUpdate:string;
  @Input() data: any = {};

  constructor() { }

  ngOnInit() {
  	this.dateCreated = new Date(2018,10,1).toISOString().slice(0, 16);
    this.lastUpdate = new Date().toISOString().slice(0, 16);
  }

}
