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
    btnDisabled: true,
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
    
   this.router.navigate(['generate-payt-req',
         {reqNo: "",
          payee: "",
          paymentType: "",
          status: "",
          amount: "",
          currency: "",
          particulars: "",
          reqDate: "",
          reqBy: "",
          }], {skipLocationChange: true});
  }

  record:any;
  onClickEdit(event){
    //  var selectedRow = event.target.closest('tr').children;

    //   this.record = {
    //     reqNo: selectedRow[0].innerText,
    //     payee: selectedRow[1].innerText,
    //     paymentType: selectedRow[2].innerText,
    //     status: selectedRow[3].innerText.trim(),
    //     amount: selectedRow[4].innerText,
    //     currency: selectedRow[5].innerText,
    //     particulars: selectedRow[6].innerText,
    //     reqDate: selectedRow[7].innerText,
    //     reqBy: selectedRow[8].innerText
    //   }
    //   this.router.navigate(['/generate-payt-req', { slctd: JSON.stringify(this.record) }], { skipLocationChange: true });

    this.router.navigate(['generate-payt-req',
         {reqNo: "",
          payee: "",
          paymentType: "",
          status: "",
          amount: "",
          currency: "",
          particulars: "",
          reqDate: "",
          reqBy: "",
          }], {skipLocationChange: true});
  }

  onRowClick(data){
      this.routeData = data;
      if(data.status == 'Paid' || data.status == 'Cancelled'){
        this.requestsListData.btnDisabled = true;
      }else{
        this.requestsListData.btnDisabled = false;
      }
    //console.log(this.accountingService.getPaytRequestsList());
  }
  onRowDblClick(event) {
        /*setTimeout(() => {
               this.router.navigate(['/generate-payt-req']);
        },100); */
        this.onClickEdit(event);
    }
}
