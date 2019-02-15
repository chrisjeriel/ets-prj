import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ARUnappliedCollection } from '@app/_models';

@Component({
  selector: 'app-unapplied-collection',
  templateUrl: './unapplied-collection.component.html',
  styleUrls: ['./unapplied-collection.component.css']
})
export class UnappliedCollectionComponent implements OnInit {

  passDataUnappliedDetails: any = {
  	tableData: [
      {
        item: 'Policy Deposit from UCPBGEN',
        referenceNo: 'EN-CAR-HO-18-00001-00',
        description: 'Payment for policy from PNBGEN',
        type: 'Payment',
        curr: 'PHP',
        currRate: 1,
        amount: 1000000,
        amountPHP: 1000000
      }
    ],
    tHeader: ['Item','Reference No.','Description','Type','Curr','Curr Rate','Amount','Amount (PHP)'],
    dataTypes: ['text','text','text','select','text','percent','currency','currency'],
    resizable: [true, true, true, true, true, true, true, true],
    nData: {
      item: null,
      referenceNo: null,
      description: null,
      type: null,
      curr: null,
      currRate: null,
      amount: null,
      amountPHP: null
    },
    total:[null,null,null,null,null,'Total','amount','amountPHP'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [210,160,'auto',100,60,80,120,120],
    paginateFlag:true,
    infoFlag:true,
    // opts: [
    //   { 
    //     selector: 'description',
    //     vals: ['Payment for policy from PNBGEN']
    //   }
    // ]
    opts: [
      { selector: 'type', vals: ['Payment','Refund']}
    ]
  }
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	//this.passDataUnappliedDetails.tableData = this.accountingService.getARUnappliedCollection();
  }

}
