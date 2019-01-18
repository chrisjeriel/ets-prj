import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generate-payment-request',
  templateUrl: './generate-payment-request.component.html',
  styleUrls: ['./generate-payment-request.component.css']
})
export class GeneratePaymentRequestComponent implements OnInit {

  private sub: any;
  rowData: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      this.rowData = params['data'];
    });
    console.log(this.rowData.payee);
  }

}
