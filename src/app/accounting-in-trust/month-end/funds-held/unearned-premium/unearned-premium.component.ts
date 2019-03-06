import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-unearned-premium',
  templateUrl: './unearned-premium.component.html',
  styleUrls: ['./unearned-premium.component.css']
})
export class UnearnedPremiumComponent implements OnInit {

  passData: any = {
  	tHeader: ['Line', 'Premium', 'Deferred Premium', 'Prev. Deferred Premium','Deferred Difference'],
  	tableData: [
  		['CAR',100000000,10000000,10000000,0],
  		['EAR',133343455,1343455,1243455,100000],
  		['EEI',4043030.49,443030.49,443030.49,0],
  		['MBI',1453000,145000,142000,3000],
  		['BPV',302190000.39,32190000.39,32190000.39,0],
  		['MLP',38303940.99,3303940.99,3303940.00,0.99],
  		['DOS',26499000,2499000,2500000,1000],
  		['CEC',31492030,3492030,3492030,0]
  	],
  	dataTypes: ['text','currency','currency','currency','currency'],
  	pageStatus: true,
    pagination: true,
    colSize: []
  }

  detailsPerPolicy: any = {
  	tHeader: ['Policy No.', 'Effective Date', 'Expiry Date', 'Numerator', 'Denominator', 'Premium','Deferred Premium'],
  	tableData: [
  		{
  			polNo: 'CAR-2018-00001-99-0001-000',
  			effDate: new Date('2018-08-27'),
  			expDate: new Date('2019-08-27'),
  			numerator: 1,
  			denominator: 24,
  			premium: 8809.90,
  			defPremium: 367.08
  		},
  		{
  			polNo: 'CAR-2018-00001-99-0002-000',
  			effDate: new Date('2018-05-25'),
  			expDate: new Date('2019-05-25'),
  			numerator: 19,
  			denominator: 24,
  			premium: 1000,
  			defPremium: 791.67
  		},
  		{
  			polNo: 'CAR-2018-00001-99-0003-000',
  			effDate: new Date('2018-08-15'),
  			expDate: new Date('2019-08-15'),
  			numerator: 1,
  			denominator: 24,
  			premium: 6000,
  			defPremium: 250
  		},
  		{
  			polNo: 'CAR-2018-00001-99-0004-000',
  			effDate: new Date('2018-09-13'),
  			expDate: new Date('2019-09-13'),
  			numerator: 3,
  			denominator: 24,
  			premium: 4551.75,
  			defPremium: 568.97
  		},
  		{
  			polNo: 'CAR-2018-00001-99-0005-000',
  			effDate: new Date('2018-06-19'),
  			expDate: new Date('2019-06-19'),
  			numerator: 21,
  			denominator: 24,
  			premium: 1186.26,
  			defPremium: 1037.98
  		}
  	],
  	dataTypes: ['text','date','date','number','number','currency','currency'],
  	pageStatus: true,
    pagination: true,
    total: [null,null,null,null,'Total',null,null],
    colSize: ['', '', '', '90px', '90px', '150px', '150px'],
  }

  accountingEntries: any = {
  	tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
  	tableData: [
       {
           code: '9-01-01-00', account: 'Deferred Premium - CAR', slType: '', slName: '', debit: null, credit: 10000
       },
       {
           code: '9-02-01-00', account: '24th Method - CAR', slType: '', slName: '', debit: 10000, credit: null
       },
       {
           code: '9-01-01-00', account: 'Deferred Premium - EAR', slType: '', slName: '', debit: null, credit: 1343455
       },
       {
           code: '9-02-01-00', account: '24th Method - EAR', slType: '', slName: '', debit: 1343455, credit: null
       },
       {
           code: '9-01-01-00', account: 'Deferred Premium - EEI', slType: '', slName: '', debit: null, credit: 44303.49
       },
       {
           code: '9-02-01-00', account: '24th Method - EEI', slType: '', slName: '', debit: 44303.49, credit: null
       },
       {
           code: '9-01-01-00', account: 'Deferred Premium - MBI', slType: '', slName: '', debit: null, credit: 145000
       },
       {
           code: '9-02-01-00', account: '24th Method - MBI', slType: '', slName: '', debit: 145000, credit: null
       },
       {
           code: '9-01-01-00', account: 'Deferred Premium - BPV', slType: '', slName: '', debit: null, credit: 32190000.39
       },
       {
           code: '9-02-01-00', account: '24th Method - BPV', slType: '', slName: '', debit: 32190000.39, credit: null
       }
   ],
  	dataTypes: ['text','text','text','text','currency','currency'],
  	pageStatus: true,
    pagination: true,
    total: [null,null,null,'Total','debit','credit'],
    colSize: ['100px', '200px', '150px', '250px', '120px', '120px'],
  }

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  openDetailsPerPolicy() {
  	$('#detailsPerPolicy > #modalBtn').trigger('click');
  }

  openAccountingEntries(){
  	$('#accountingEntries > #modalBtn').trigger('click');
  }
}
