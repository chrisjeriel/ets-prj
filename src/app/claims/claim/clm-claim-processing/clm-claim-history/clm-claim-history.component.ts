import { Component, OnInit } from '@angular/core';
import { ClaimsHistoryInfo } from '@app/_models';
import { ClaimsService } from '@app/_services/claims.service';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clm-claim-history',
  templateUrl: './clm-claim-history.component.html',
  styleUrls: ['./clm-claim-history.component.css']
})
export class ClmClaimHistoryComponent implements OnInit {
  private claimsHistoryInfo = ClaimsHistoryInfo;

  tableDataAdj: any[] = [
    ["001", "650000", "Monica Reyes", "1/13/2018", "PMMSC-MLP-2018-025"],
    ["002", "700000", "Monica Reyes", "1/14/2018", "ADJ2 REF 001"],
    ["003", "800000", "Monica Reyes", "1/15/2018", "ADJ3 REF 001"],
  ];
  dataTypes: any[] = [];
  addFlag;
  editFlag;
  paginateFlag;
  infoFlag;
  searchFlag;
  pageLength = 10;

  passDataAdj: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    pageID: 2,
    widths: []
  }

  passDataHistory: any = {
    tHeader: [],
    dataTypes: [],
    // opts: [{ selector: "amountType", vals: ["Loss", "Adjuster Expense", "Other Expenses"] }, { selector: "historyType", vals: ["OS Reserve", "Payment", "Recovery"] }, { selector: "currency", vals: ["Php", "USD"] }],
    opts: [],
    pageLength: 10,
    pageID: 1,
    paginateFlag: true,
    infoFlag: true,
    addFlag: true,
    tableData: [],
    widths: [1,1,147,67,91,118,78,1,'auto'],
    nData: new ClaimsHistoryInfo(null, null, null, null, null, null, null, null, null)
  };

  constructor(private claimsService: ClaimsService, private modalService: NgbModal, private titleService: Title) {

  }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim History");

    this.passDataHistory.tHeader.push("Hist. No.", "Hist. Type", "Type", "Curr", "Reserve", "Payment Amount", "Ref. No", "Ref. Date", "Remarks");
    this.passDataHistory.dataTypes.push("number", "select", "select", "select", "currency", "currency", "text", "date", "text");
    this.passDataHistory.opts.push({ selector: "histType", vals: ["Loss", "Adjuster's Expense", "Other Expenses"] });
    this.passDataHistory.opts.push({ selector: "type", vals: ["Initial Reserve", "Increase Reserve", "Decrease Reserve", "Partial Payment", "Full Payment"] });
    this.passDataHistory.opts.push({ selector: "currency", vals: ["PHP", "USD", "SGD"] });
    this.passDataHistory.widths.push("1", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto");
    this.passDataHistory.tableData = this.claimsService.getClaimsHistoryInfo();

    this.passDataAdj.tHeader.push("Hist No", "Approved Amount", "Approved By", "Approved Date", "Remarks");
    this.passDataAdj.dataTypes.push("number", "currency", "text", "date", "text");
    this.passDataAdj.widths.push("1", "auto", "auto", "1", "auto");
    this.passDataAdj.tableData = this.tableDataAdj;

  }

}
