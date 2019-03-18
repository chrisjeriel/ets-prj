import { Component, OnInit } from '@angular/core';
import { PaymentForAdvances } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-ar-paymentfor-advances',
  templateUrl: './ar-paymentfor-advances.component.html',
  styleUrls: ['./ar-paymentfor-advances.component.css']
})
export class ArPaymentforAdvancesComponent implements OnInit {
  
  /*PaymentForAdvancesData: any = {
    tableData: this.accountingService.getPaymentForAdvances(),
    tHeader: ['Ceding Company', 'Remarks', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes: ['text', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: new PaymentForAdvances(null, null, null, null, null, null),
    magnifyingGlass: ['cedingCompany'],
    paginateFlag: true,
    infoFlag: true,
    addFlag: true,
    deleteFlag: true,
    checkFlag: true,
    genericBtn: 'Save',
    total: [null, null, null, 'Total', 'amount', 'amountPhp'],
    widths: ['auto','auto',1,1,2,100,100],
  }*/

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
