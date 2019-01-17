import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inward-policy-balances',
  templateUrl: './inward-policy-balances.component.html',
  styleUrls: ['./inward-policy-balances.component.css']
})
export class InwardPolicyBalancesComponent implements OnInit {

  passDataBalanceDetails: any = {
    tableData: [["CAR-2018-00001-99-0001-000", "01", "09/25/2018", "PHP", "3000000", "0", "0", "1642857.14", "1357142.86", "0", "1642857.14"]],
    tHeader: ["Policy No", "Inst No.", "Due Date", "Curr", "Premium", "RI Comm", "Charges", "Net Due", "Payments", "Overdue Interest", "Balance"],
    dataTypes: ["text", "number", "date", "text", "currency", "currency", "currency", "currency", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    magnifyingGlass: ['0', '1'],
    pageLength: 10,
    widths: ["auto", "1", "auto", "1", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
    nData: [null, null, null, null, null, null, null, null, null, null, null]
  };

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Inward Policy Balances");
  }

}
