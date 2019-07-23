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
  rowData: any;

  constructor(private activatedRoute: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
    console.log('IM HERE AT GEN PAYT REQ');
  	this.sub = this.activatedRoute.params.subscribe(params => {
      if(Object.keys(params).length != 0){
        this.rowData = JSON.parse(params['tableInfo']);
        console.log(this.rowData);
      }
    });
  }

  
  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('/payt-req');
      } 
  
  }

  // tabController(paymentType){
  //   console.log(this.paymentType);
  //   this.paymentType = paymentType;
  // }

}
