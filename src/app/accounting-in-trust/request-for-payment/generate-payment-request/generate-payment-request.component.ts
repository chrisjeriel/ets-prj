import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generate-payment-request',
  templateUrl: './generate-payment-request.component.html',
  styleUrls: ['./generate-payment-request.component.css']
})
export class GeneratePaymentRequestComponent implements OnInit, OnDestroy {

  private sub: any;
  rowData: any;

  paymentData: any = {};

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      this.paymentData = {
      		reqNo: params['reqNo'],
      		payee: params['payee'],
      		paymentType: params['paymentType'],
      		status: params['status'],
      		amount: params['amount'],
      		currency: params['currency'],
      		particulars: params['particulars'],
      		reqDate: params['reqDate'],
      		reqBy: params['reqBy']
      }
    });
  }

  ngOnDestroy(){
  	this.sub.unsubscribe();
  }

}