import { Component, OnInit } from '@angular/core';
import { NotesService, WorkFlowManagerService } from '@app/_services';

@Component({
  selector: 'app-wf-transactions',
  templateUrl: './wf-transactions.component.html',
  styleUrls: ['./wf-transactions.component.css']
})
export class WfTransactionsComponent implements OnInit {

  constructor(
     private ns: NotesService,
     private workFlowService: WorkFlowManagerService) { }

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
}
