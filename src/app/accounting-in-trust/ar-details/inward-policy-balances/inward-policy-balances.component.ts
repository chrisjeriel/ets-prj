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
    tHeader: ["SOA No.","Policy No","Co. Ref. No.", "Inst No.","Eff Date", "Due Date", "Curr","Curr Rate", "Premium", "RI Comm", "Charges", "Net Due", "Payments", "Balance", "Overdue Interest"],
    dataTypes: ["text","text","text", "text", "date", "date", "text", "percent", "currency", "currency", "currency", "currency", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    magnifyingGlass: ['soaNo','instNo'],
    pageLength: 10,
    nData: new ARInwdPolBalDetails(null, null, null, null,null, null, null, null, null, null,null,null,null,null,null,),
    total: [null,null,null,null,null, null, null, 'Total', 'premium', 'riComm', 'charges', 'netDue', 'payments', 'balance', 'overdueInterest'],
    genericBtn: 'Save',
/*    opts: [{ selector: 'type', vals: ["Payment", "Refund"] }],*/
    widths: [180, 180, 120, 50,120, 120, 30, 85, 120, 120,120,120,120,120,120]
  };

  constructor(private titleService: Title, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Inward Policy Balances");
  }

}
