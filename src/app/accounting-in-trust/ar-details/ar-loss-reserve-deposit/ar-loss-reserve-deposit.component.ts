import { Component, OnInit } from '@angular/core';
import { AccountingItLossReserveDepositAr } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-ar-loss-reserve-deposit',
  templateUrl: './ar-loss-reserve-deposit.component.html',
  styleUrls: ['./ar-loss-reserve-deposit.component.css']
})
export class ArLossReserveDepositComponent implements OnInit {

  lossReserveDepositData: any = {
    tableData: this.accountingService.getAccountingItLossReserveDepositAR(),
    tHeader: ['Ceding Company', 'Membership Date', 'Remarks', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes: ['text', 'date', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: new AccountingItLossReserveDepositAr(null, null, null, null, null, null, null),
    magnifyingGlass: ['cedingCompany'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    checkFlag: true,
    genericBtn: 'Save',
    total: [null, null, null, null, 'Total', 'amount', 'amountPhp'],
    widths: ['auto',1,'auto',1,2,100,100],
  }
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
