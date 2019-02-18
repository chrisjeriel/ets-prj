import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-request-entry',
  templateUrl: './payment-request-entry.component.html',
  styleUrls: ['./payment-request-entry.component.css']
})
export class PaymentRequestEntryComponent implements OnInit {
  dateCreated:string;
  lastUpdate:string;
  @Input() data: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  paymentData: any = {};
  paymentType: any;
  private sub: any;

  constructor(private route: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
  	this.dateCreated = new Date(2018,10,1).toISOString().slice(0, 16);
    this.lastUpdate = new Date().toISOString().slice(0, 16);
  }

  tabController(event) {
  	this.onChange.emit(this.data.paymentType);
  }




}

