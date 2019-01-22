import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-maint-chart-trst-acct',
  templateUrl: './maint-chart-trst-acct.component.html',
  styleUrls: ['./maint-chart-trst-acct.component.css']
})
export class MaintChartTrstAcctComponent implements OnInit {

  passDataAccountsSetup: any = {
    tableData: [
      ["1", "Asset", "0", "0", "0", "0", "ASSETS", "1", "", "Dr", "Summary", ""],
    ],
    tHeader: ["Acct ID", "Type", "Main", "Sub1", "Sub2", "Sub3", "Long Description", "Short Code", "SL Type", "Dr/Cr (Normal)", "Post Tag", "Active"],
    dataTypes: ["number", "text", "number", "number", "number", "number", "text", "text", "text", "text", "text", "checkbox"],
    pageLength: 15,
    pageStatus: true,
    pagination: true,
    addFlag: true,
    deleteFlag: true,
  };

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Maint | Chart of Accounts");
  }

}
