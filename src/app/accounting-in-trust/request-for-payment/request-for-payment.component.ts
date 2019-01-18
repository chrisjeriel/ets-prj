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

  private routeData: any;

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
  	this.router.navigate(['generate-payt-req',
         {reqNo: this.routeData.paytReqNo,
          payee: this.routeData.payee,
          paymentType: this.routeData.paymentType,
          status: this.routeData.status,
          amount: this.routeData.amount,
          currency: this.routeData.currency,
          particulars: this.routeData.particulars,
          reqDate: this.routeData.requestDate,
          reqBy: this.routeData.requestedBy,
          }], {skipLocationChange: true});
  }

  onRowClick(data){
      this.routeData = data;
    //console.log(this.accountingService.getPaytRequestsList());
  }
}
