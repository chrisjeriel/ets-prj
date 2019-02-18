import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountingService } from '../../../_services/accounting.service';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-acct-srvc-cancelled-transactions',
  templateUrl: './acct-srvc-cancelled-transactions.component.html',
  styleUrls: ['./acct-srvc-cancelled-transactions.component.css']
})
export class AcctSrvcCancelledTransactionsComponent implements OnInit {

  cancelledTransactionsData: any = {
  	tableData: this.accountingService.getAccountingSrvcCancelledTransactions(),
  	tHeader: ['Tran Type', 'Ref. No.', 'Tran Date', 'Payee/Payor', 'Particulars', 'Cancelled By', 'Cancelled Date', 'Reason', 'Amount'],
  	dataTypes: ['text', 'text', 'date', 'text', 'text', 'text', 'date', 'text', 'number'],
  	filters: [
  		{
  		    key: 'tranType',
  		    title:'Tran. Type',
  		    dataType: 'text'
  		},
  		{
  		    key: 'refNo',
  		    title:'Ref. No.',
  		    dataType: 'text'
  		},
  		{
  		    key: 'tranDate',
  		    title:'Tran Date',
  		    dataType: 'date'
  		},
  		{
  		    key: 'payeePayor',
  		    title:'Payee/Payor',
  		    dataType: 'text'
  		},
  		{
  		    key: 'particulars',
  		    title:'Particulars',
  		    dataType: 'text'
  		},
  		{
  		    key: 'cancelledBy',
  		    title:'Cancelled By',
  		    dataType: 'text'
  		},
  		{
  		    key: 'cancelledDate',
  		    title:'Cancelled Date',
  		    dataType: 'date'
  		},
  		{
  		    key: 'reason',
  		    title:'Reason',
  		    dataType: 'text'
  		},
  		{
  		    key: 'amount',
  		    title:'Amount',
  		    dataType: 'text'
  		},
  	],
    colSize: ['30px', '50px', '40px', '', '60px', '', '40px', '', '60px'],
  	total: [null,null,null,null,null,null,null,'Total','amount'],
  	pageLength: 15,
  	pagination: true,
  	pageStatus: true,
  }

  tranType: string = '';

  constructor(private titleService: Title, private accountingService: AccountingService, private route: Router) { }


  ngOnInit() {
  	this.titleService.setTitle("Acct-Srvc | Cancelled Transactions");
  }

  onRowClick(data){
    this.tranType = data.tranType;
  }

  viewTranDetails(){
    if(this.tranType == 'AR'){
      this.route.navigate(['accounting-in-trust',{link:'/acct-it-cancelled-trans'}],{ skipLocationChange: true });
    }else if(this.tranType == 'CV'){
      this.route.navigate(['generate-cv',{link:'/acct-it-cancelled-trans'}],{ skipLocationChange: true });
    }else if(this.tranType == 'JV'){
      this.route.navigate(['generate-jv',{link:'/acct-it-cancelled-trans'}],{ skipLocationChange: true });
    }else{
      //do something
    }
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.route.navigateByUrl('');
      } 
  
  }
}
