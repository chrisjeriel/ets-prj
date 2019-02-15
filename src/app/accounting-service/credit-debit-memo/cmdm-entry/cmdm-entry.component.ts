import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { AccountingEntryCMDM } from '@app/_models';

@Component({
  selector: 'app-cmdm-entry',
  templateUrl: './cmdm-entry.component.html',
  styleUrls: ['./cmdm-entry.component.css']
})
export class CmdmEntryComponent implements OnInit {
  
  passData: any = {
    tableData: this.accountingService.getAccountingEntryCMDM(),
    tHeader: ['Code','Account','SL Type','SL Name','Debit','Credit'],
    resizable: [true, true, true, true, true, true],
    dataTypes: ['text','text','text','text','currency','currency'],
    nData: new AccountingEntryCMDM(null,null,null,null,null,null),
    total:[null,null,null,'Total','debit','credit'],
    addFlag: true,
    deleteFlag: true,
    editFlag: false,
    pageLength: 10,
    widths: [205,305,163,176,122,154],
    genericBtn: 'Save'
  };
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

  
  
}