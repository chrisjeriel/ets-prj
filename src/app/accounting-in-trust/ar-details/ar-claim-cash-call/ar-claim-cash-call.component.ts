import { Component, OnInit } from '@angular/core';
import { AccountingItClaimCashCallAr } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-ar-claim-cash-call',
  templateUrl: './ar-claim-cash-call.component.html',
  styleUrls: ['./ar-claim-cash-call.component.css']
})
export class ArClaimCashCallComponent implements OnInit {

  claimCashCallData: any = {
    tableData: this.accountingService.getAccountingItClaimCashCallAR(),
    tHeader: ['Claim No.', 'Policy No.', 'Insured', 'Loss Date', 'Loss Cover','Hist No.','History Type','Paid Amount','Reserve Amount', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes: ['text', 'text', 'text', 'date', 'text','number','text','currency', 'currency', 'text', 'percent', 'currency', 'currency'],
    nData: new AccountingItClaimCashCallAr(null, null, null, null, null, null, null, null, null, null, null,null,null),
    magnifyingGlass: ['claimNo'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 3,
    addFlag: true,
    deleteFlag: true,
    checkFlag: true,
    genericBtn: 'Save',
    total: [null, null, null, null, null,null, null,null,null,null, 'Total', 'amount', 'amountPhp'],
    widths: [180,180,250,1,200,1,1,120,120,1,85,120,120],
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
