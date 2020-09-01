import { Component, OnInit } from '@angular/core';
import { AccountingItClaimOverPaymentAr } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-ar-claim-over-payment',
  templateUrl: './ar-claim-over-payment.component.html',
  styleUrls: ['./ar-claim-over-payment.component.css']
})
export class ArClaimOverPaymentComponent implements OnInit {

  claimOverPaymentData: any = {
    tableData: this.accountingService.getAccountingItClaimOverPaymentAR(),
    tHeader: ['Claim No.', 'Policy No.', 'Insured', 'Loss Date', 'Loss Cover', 'Claim Paid Amount', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes: ['text', 'text', 'text', 'date', 'text', 'currency', 'text', 'percent', 'currency', 'currency'],
    nData: new AccountingItClaimOverPaymentAr(null, null, null, null, null, null, null, null, null, null),
    magnifyingGlass: ['claimNo'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 5,
    addFlag: true,
    deleteFlag: true,
    checkFlag: true,
    genericBtn: 'Save',
    total: [null, null, null, null, null, null, null, 'Total', 'amount', 'amountPhp'],
    widths: [130,180,'auto',1,'auto',100,1,2,100,100],
  }
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
