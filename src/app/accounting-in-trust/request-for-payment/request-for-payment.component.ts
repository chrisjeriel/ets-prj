import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AccountingService } from '../../_services';

@Component({
  selector: 'app-request-for-payment',
  templateUrl: './request-for-payment.component.html',
  styleUrls: ['./request-for-payment.component.css']
})
export class RequestForPaymentComponent implements OnInit {

  requestsListData: any = {
  	tableData: this.accountingService.getPaytRequestsList(),
  	tHeader: ['Payment Request No.', 'Payee', 'Payment Type', 'Status', 'Request Date', 'Particulars', 'Curr', 'Amount', 'Requested By'],
  	dataTypes: ['text', 'text', 'text', 'text', 'date', 'text', 'text', 'currency', 'text'],
  	colSize: ['80px', '', '', '', '53px', '', '30px', '', ''],
  	pagination: true,
  	pageStatus: true,
  	addFlag: true,
  	editFlag: true,
  	pageLength: 10
  }

  constructor(private titleService: Title, private router: Router, private accountingService: AccountingService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Request for Payment");
  }

  onClickAdd(event){
  	this.router.navigate(['generate-payt-req']);
  }

  onClickEdit(event){
  	this.router.navigate(['generate-payt-req']);
  }
}
