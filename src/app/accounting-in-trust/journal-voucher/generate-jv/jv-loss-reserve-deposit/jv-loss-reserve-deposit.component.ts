import { Component, OnInit } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvLossResDep} from '@app/_models';

@Component({
  selector: 'app-jv-loss-reserve-deposit',
  templateUrl: './jv-loss-reserve-deposit.component.html',
  styleUrls: ['./jv-loss-reserve-deposit.component.css']
})
export class JvLossReserveDepositComponent implements OnInit {

  passData: any = {
    tableData: [],
    tHeader: ['Ceding Company','Deposit Type','Deposit Date','Membership Date','Curr', 'Curr Rate', 'Amount','Amount(PHP)'],
    resizable: [true, true, true, true, true,true, true, true],
    dataTypes: ['text','select','date','date','text','percent','currency','currency'],
    nData: new AccJvLossResDep(null,null,new Date(),new Date(),null,null,null,null),
    total:[null,null,null,null,null,'Total','amount','amountPHP'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    saveBtn: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 10,
    genericBtn: 'Save',
    opts: [],
    widths: ['auto',100,100,100,50,130,130,130],

  };

  payorData:any = '';

  constructor(private accountingService: AccountingService,private titleService: Title, public ns: NotesService) { }

  ngOnInit() {
  	 this.titleService.setTitle(" Acct | JV | Loss Reserve Deposit");
  	 /*this.passData.tableData = this.accountingService.getLossRepDep();
  	 this.passData.opts.push({ selector: "depType", vals: ["Initial", "Additional", "CUMI"] });*/
  }

}
