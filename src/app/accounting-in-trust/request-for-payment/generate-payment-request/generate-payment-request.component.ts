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

  checkData : any = { 
    tranId : '',
    from : ''
  };

  constructor(private activatedRoute: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
    console.log('IM HERE AT GEN PAYT REQ');
  	this.sub = this.activatedRoute.params.subscribe(params => {
      if(Object.keys(params).length != 0){
        console.log(params);
        this.rowData.reqId = params['reqId'];
        this.checkData.from = params['from'];
        this.checkData.tranId = params['tranId'];
      }
    });
  }

  
  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        if(this.checkData.from.toLowerCase() == 'cv-paytreqlist'){
          this.router.navigate(['/generate-cv', { tranId : this.checkData.tranId, from: 'payt-req' }], { skipLocationChange: true });
        }else{
          this.router.navigateByUrl('/payt-req');
        }
      } 
  }

  // tabController(paymentType){
  //   console.log(this.paymentType);
  //   this.paymentType = paymentType;
  // }

}
