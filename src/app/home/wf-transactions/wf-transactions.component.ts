import { Component, OnInit } from '@angular/core';
import { NotesService, WorkFlowManagerService } from '@app/_services';
import { Router } from '@angular/router';


@Component({
  selector: 'app-wf-transactions',
  templateUrl: './wf-transactions.component.html',
  styleUrls: ['./wf-transactions.component.css']
})
export class WfTransactionsComponent implements OnInit {

  constructor(
     private ns: NotesService,
     private workFlowService: WorkFlowManagerService,
     private router: Router) { }

  transactionList:any = [];

  ngOnInit() {
  	this.retrieveTransactions();
  }

  retrieveTransactions() {
  	this.transactionList = [];
    this.workFlowService.retrieveWfmTransactions('').subscribe((data: any) =>{
        if (data.transactionList.length > 0) {
        	this.transactionList = data.transactionList;
        }
    });
  }

  redirectToPage(data) {
    console.log('redirectToPage');
    console.log(data);
    if (data.tranTitle == 'Quotation') {
      this.router.navigate(['/quotation-processing', {}], { skipLocationChange: false });
    } else if (data.tranTitle == 'Policy') {
      this.router.navigate(['/policy-listing', {}], { skipLocationChange: false });
    } else if (data.tranTitle == 'Distribution') {
      this.router.navigate(['/pol-dist-list', {}], { skipLocationChange: false });
    } else if (data.tranTitle == 'Claims') {
      this.router.navigate(['/clm-claim-processing', {}], { skipLocationChange: false });
    } else if (data.tranTitle == 'Acct in Trust') {
      this.router.navigate(['/acct-ar-listings', {}], { skipLocationChange: false });
    } else if (data.tranTitle == 'Acct Service') {
      this.router.navigate(['/acct-or-listings', {}], { skipLocationChange: false });
    }
  }
}
