import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payment-request-entry',
  templateUrl: './payment-request-entry.component.html',
  styleUrls: ['./payment-request-entry.component.css']
})
export class PaymentRequestEntryComponent implements OnInit {

  @Input() data: any = {};

  constructor() { }

  ngOnInit() {
  }

}
