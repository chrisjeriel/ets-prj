import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-claim-recovery',
  templateUrl: './claim-recovery.component.html',
  styleUrls: ['./claim-recovery.component.css']
})
export class ClaimRecoveryComponent implements OnInit {

  passDataClaimsForRecovery: any = {
    tableData: [["CAR-2018-000001", "3", "Loss", "Recovery", "Salvage for Construction Materials", "PHP", "1", "30000", "30000"]],
    tHeader: ["Claim No.", "Hist No.", "Amount Type", "History Type", "Remarks", "Curr", "Rate", "Amount", "Amount(PHP)"],
    dataTypes: ["text", "number", "text", "text", "text", "text", "percent", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    widths: ["auto", "1", "auto", "auto", "auto", "1", "auto", "auto", "auto"],
    nData: [null, null, null, null, null, null, null, null, null],
    pageLength: 10,
  };
  constructor(private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Claim Recovery");
  }

}
