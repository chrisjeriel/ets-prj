import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AccountingService } from '../../_services';

@Component({
  selector: 'app-acc-s-request-for-payment',
  templateUrl: './acc-s-request-for-payment.component.html',
  styleUrls: ['./acc-s-request-for-payment.component.css']
})
export class AccSRequestForPaymentComponent implements OnInit {

  private routeData: any;

  requestsListData: any = {
  	tableData: this.accountingService.getAccountingSRequestsList(),
  	tHeader: ['Payment Request No.', 'Payee', 'Payment Type', 'Status', 'Request Date', 'Particulars', 'Curr', 'Amount', 'Requested By'],
  	dataTypes: ['text', 'text', 'text', 'text', 'date', 'text', 'text', 'currency', 'text'],
  	colSize: ['100px', '', '', '', '60px', '', '30px', '', ''],
    btnDisabled: true,
  	pagination: true,
  	pageStatus: true,
  	addFlag: true,
  	editFlag: true,
  	pageLength: 10,
  }

  constructor(private titleService: Title, private router: Router, private accountingService: AccountingService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-Service | Request for Payment");
  }

  onClickAdd(event){
    
   this.router.navigate(['acc-s-generate-request',
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
        // this.onClickEdit(event);
        var type = event.target.closest('tr').children[2].innerText.trim();
        
        this.router.navigate(['acc-s-generate-request',
         {reqNo: "",
          payee: "",
          paymentType: type,
          status: "",
          amount: "",
          currency: "",
          particulars: "",
          reqDate: "",
          reqBy: "",
          }], {skipLocationChange: true});
    }

}
