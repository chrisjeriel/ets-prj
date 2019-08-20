import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generate-payment-request',
  templateUrl: './generate-payment-request.component.html',
  styleUrls: ['./generate-payment-request.component.css']
})
export class GeneratePaymentRequestComponent implements OnInit {

  private sub: any;
  rowData: any = {
    reqId : ''
  };

  constructor(private activatedRoute: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
    console.log('IM HERE AT GEN PAYT REQ');
  	this.sub = this.activatedRoute.params.subscribe(params => {
      if(Object.keys(params).length != 0){
        this.rowData.reqId = params['reqId'];
        console.log(params['reqId']);
      }
    });
  }

  
  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('/payt-req');
      } 
  
  }

  // tabController(paymentType){
  //   console.log(this.paymentType);
  //   this.paymentType = paymentType;
  // }

}
