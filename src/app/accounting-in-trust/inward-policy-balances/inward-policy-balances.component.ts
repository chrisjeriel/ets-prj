import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService } from '@app/_services';
import { ARInwdPolBalDetails } from '@app/_models';

@Component({
  selector: 'app-inward-policy-balances',
  templateUrl: './inward-policy-balances.component.html',
  styleUrls: ['./inward-policy-balances.component.css']
})
export class InwardPolicyBalancesComponent implements OnInit {

  passDataBalanceDetails: any = {
    tableData: this.accountingService.getARInwdPolBalDetails(),
    tHeader: ["Policy No", "Inst No.", "Due Date", "Curr", "Premium", "RI Comm", "Charges", "Net Due", "Payments", "Overdue Interest", "Balance"],
    dataTypes: ["text", "number", "date", "text", "currency", "currency", "currency", "currency", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    magnifyingGlass: ['0', '1'],
    pageLength: 10,
    widths: [178, "1", "auto", "1", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
    nData: new ARInwdPolBalDetails(null, null, null, null, null, null, null, null, null, null, null),
    total: [null, null, null, 'Total', 'premium', 'riComm', 'charges', 'netDue', 'payments', 'overdueInterest', 'balance']
  };

  constructor(private titleService: Title, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Inward Policy Balances");
  }

}
