import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AccountingService } from '../../../_services/accounting.service';

@Component({
  selector: 'app-acct-it-cancelled-transactions',
  templateUrl: './acct-it-cancelled-transactions.component.html',
  styleUrls: ['./acct-it-cancelled-transactions.component.css']
})
export class AcctItCancelledTransactionsComponent implements OnInit {

  cancelledTransactionsData: any = {
  	tableData: this.accountingService.getCancelledTransactions(),
  	tHeader: ['Tran Type', 'Ref. No.', 'Tran Date', 'Payee/Payor', 'Particulars', 'Cancelled By', 'Cancelled Date', 'Reason', 'Status'],
  	dataTypes: ['text', 'text', 'date', 'text', 'text', 'text', 'date', 'text', 'text'],
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
  		    key: 'status',
  		    title:'Status',
  		    dataType: 'text'
  		},
  	],
    colSize: ['30px', '50px', '40px', '', '60px', '', '40px', '', '40px'],
  	total: [null,null,null,null,'Total',null,null,null,null],
  	pageLength: 20,
  	pagination: true,
  	pageStatus: true,
  }

  constructor(private titleService: Title, private accountingService: AccountingService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Cancelled Tran");
  }

}
