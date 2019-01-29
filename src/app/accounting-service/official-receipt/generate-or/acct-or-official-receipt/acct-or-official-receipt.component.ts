import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from  '@angular/platform-browser';
import { OfficialReceipt } from '@app/_models';

@Component({
  selector: 'app-acct-or-official-receipt',
  templateUrl: './acct-or-official-receipt.component.html',
  styleUrls: ['./acct-or-official-receipt.component.css']
})
export class AcctOrOfficialReceiptComponent implements OnInit {
  passDataOfficialReceipt : any = {
    tableData: this.accountingService.getOfficialReceipt(),
    tHeader : ["Item","Curr","Curr Rate","Amount","Amount(PHP)"],
    dataTypes: ["text","text","percent","currency","currency"],
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    checkFlag: true,
    infoFlag: true,
    pageLength: 10,
    paginateFlag: true,
    total: [null,null,'Total','amount','amountPHP'],
    nData: new OfficialReceipt(null,null,null,null,null),
    
  }

  constructor(private accountingService: AccountingService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-Srvc | OR Details");

  }

}
