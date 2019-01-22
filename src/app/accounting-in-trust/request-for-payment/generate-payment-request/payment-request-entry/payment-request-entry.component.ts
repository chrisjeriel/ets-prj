import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-payment-request-entry',
  templateUrl: './payment-request-entry.component.html',
  styleUrls: ['./payment-request-entry.component.css']
})
export class PaymentRequestEntryComponent implements OnInit {

  @Input() data: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  tabController(event) {
  	console.log(this.data.paymentType);
  	this.onChange.emit(this.data.paymentType);
  }
}
