import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css']
})
export class PaymentRequestDetailsComponent implements OnInit {

  @Input() paymentType: string = "";
  constructor() { }

  ngOnInit() {
    if(this.paymentType === null){
      this.paymentType = "";
    }
  }

}
