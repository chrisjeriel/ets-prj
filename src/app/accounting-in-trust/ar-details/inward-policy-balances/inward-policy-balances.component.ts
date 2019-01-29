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
    tHeader: ["SOA No.","Policy No","Co. Ref. No.", "Inst No.","Type","Eff Date", "Due Date", "Curr","Curr Rate", "Premium", "RI Comm", "Charges", "Net Due", "Payments", "Overdue Interest", "Balance"],
    dataTypes: ["text","text","text", "text","select", "date", "date", "text", "percent", "currency", "currency", "currency", "currency", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    magnifyingGlass: ['soaNo','instNo'],
    pageLength: 10,
    widths: ["auto", "auto","auto","auto","auto", "auto","auto", "1", "auto", "auto", "auto", "auto", "auto", "auto", "auto","auto"],
    nData: new ARInwdPolBalDetails(null, null, null, null, null, null, null, null, null, null, null,null,null,null,null,null,),
    total: [null,null,null,null,null,null, null, null, 'Total', 'premium', 'riComm', 'charges', 'netDue', 'payments', 'overdueInterest', 'balance'],
    genericBtn: 'Save',
    opts: [{ selector: 'type', vals: ["Payment"] }]
  };

  constructor(private titleService: Title, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Inward Policy Balances");
  }

}
