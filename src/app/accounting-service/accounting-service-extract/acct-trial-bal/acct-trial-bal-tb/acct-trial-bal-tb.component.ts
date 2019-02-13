import { Component, OnInit, Input } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccTBTotDebCred, AccTBNet} from '@app/_models';

@Component({
  selector: 'app-acct-trial-bal-tb',
  templateUrl: './acct-trial-bal-tb.component.html',
  styleUrls: ['./acct-trial-bal-tb.component.css']
})
export class AcctTrialBalTbComponent implements OnInit {


  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];
  @Input() accountCode: string;

  passDataTotal: any = {
    tableData: [/*{accCode:null,accDesc:null,slType:null,debit:null,credit:null}*/],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','Debit','Credit'],
    resizable: [true, true, true, true, true],
    dataTypes: ['text','text','text','text','currency','currency'],
    total:[null,null,null,'Total','debit','credit'],
    searchFlag: true,
    pagination: true,
    pageStatus: true,
    pageLength: 10,
    widths: [100,'auto',150,'auto','auto'],
      filters: [
             {
                key: 'accCode',
                title: 'Account Code',
                dataType: 'text'
            },
            {
                key: 'accDesc',
                title: 'Account Description',
                dataType: 'text'
            },
            {
                key: 'slType',
                title: 'SL Type',
                dataType: 'text'
            },
            {
                key: 'debit',
                title: 'Debit',
                dataType: 'text'
            },
            {
                key: 'credit',
                title: 'Credit',
                dataType: 'text'
            },
        ],
  };

   passDataNet: any = {
    tableData: [/*{accCode:null,accDesc:null,slType:null,drBal:null,crBal:null}*/],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','DR Balance','CR Balance'],
    resizable: [true, true, true, true, true],
    dataTypes: ['text','text','text','text','currency','currency'],
    total:[null,null,null,'Total','drBal','crBal'],
    searchFlag: true,
    pagination: true,
    pageStatus: true,
    pageLength: 10,
    widths: [100,'auto',150,'auto','auto'],
      filters: [
             {
                key: 'accCode',
                title: 'Account Code',
                dataType: 'text'
            },
            {
                key: 'accDesc',
                title: 'Account Description',
                dataType: 'text'
            },
            {
                key: 'slType',
                title: 'SL Type',
                dataType: 'text'
            },
            {
                key: 'drBal',
                title: 'DR Balance',
                dataType: 'text'
            },
            {
                key: 'crBal',
                title: 'CR Balance',
                dataType: 'text'
            },
        ],
  };

  constructor(private accountingService: AccountingService,private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Trial Balance | Extract");
  	//this.accountCode = 'Total Debits and Credits' ;
  	this.passDataTotal.tableData = this.accountingService.getAccTBTotDebCred();
  	this.passDataNet.tableData = this.accountingService.getAccTBNet();
  }

  test(){
    console.log(this.accountCode);
  }
}
