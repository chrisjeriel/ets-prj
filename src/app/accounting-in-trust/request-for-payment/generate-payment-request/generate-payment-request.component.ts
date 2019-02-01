import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generate-payment-request',
  templateUrl: './generate-payment-request.component.html',
  styleUrls: ['./generate-payment-request.component.css']
})
export class GeneratePaymentRequestComponent implements OnInit, OnDestroy {

  private sub: any;
  rowData: any;

  paymentData: any = {};

  paymentType: any;

  constructor(private route: ActivatedRoute,  private router: Router) { }

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
    this.paymentType = this.paymentData.paymentType;
  }


  ngOnDestroy(){
  	this.sub.unsubscribe();
  }
  
  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }

  tabController(paymentType){
    console.log(this.paymentType);
    this.paymentType = paymentType;
  }

}
