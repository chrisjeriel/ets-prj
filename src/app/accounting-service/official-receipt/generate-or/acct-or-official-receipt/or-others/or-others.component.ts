import { Component, OnInit } from '@angular/core';
import { AccountingSOthersOr } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-or-others',
  templateUrl: './or-others.component.html',
  styleUrls: ['./or-others.component.css']
})
export class OrOthersComponent implements OnInit {

  orOthersData: any = {
    tableData: this.accountingService.getAccountingSOthersOr(),
    tHeader: ['Item', 'Reference No.', 'Payor','Description', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes: ['text', 'text', 'text', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: new AccountingSOthersOr(null,null,null, null, null, null, null, null),
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    addFlag: true,
    deleteFlag: true,
    checkFlag: true,
    genericBtn: 'Save',
    total: [null, null,null,null, null, 'Total', 'amount', 'amountPhp'],
    widths: ['auto',1,'auto','auto',1,100,120,120],
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

  openTaxAllocation(){
   $('#taxAlloc #modalBtn').trigger('click');
 }

}
