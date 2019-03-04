import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from '@app/_services';
import { ARClaimsRecovery } from '@app/_models';

@Component({
  selector: 'app-claim-recovery',
  templateUrl: './claim-recovery.component.html',
  styleUrls: ['./claim-recovery.component.css']
})
export class ClaimRecoveryComponent implements OnInit {

  passDataClaimsForRecovery: any = {
    tableData: this.accountingService.getARClaimsRecovery(),
    tHeader: ["Payment Type","Claim No.", "Co. Claim No.", "Hist No.", "Amount Type", "History Type", "Remarks", "Curr", "Curr Rate", "Amount", "Amount(PHP)"],
    dataTypes: ["select","text","text", "number", "text", "text", "text", "text", "percent", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    widths: [135,130,150, "1", "auto", "auto", 220, "1", "auto", "auto", "auto"],
    nData: new ARClaimsRecovery(null,null,null, null, null, null, null, null, null, null, null),
    total: [null,null, null, null, null, null, null, null, 'Total','amount', 'amountPHP'],
    pageLength: 10,
    magnifyingGlass: ['claimNo'],
    opts: [{selector: 'paymentType', vals: ['Recovery','Overpayment']}],
    
  };

  passDataDistributionTreaty: any = {
    tableData: [
      ["Proportional", "Quota Share", "MunichRe", "-11400"],
      ["Proportional", "Quota Share", "PhilNaRe", "-600"],
      ["Proportional", "Quota Share", "QS Pool", "-18000"],
    ],
    tHeader: ["Treaty Type", "Treaty", "Company", "Amount"],
    dataTypes: ["text", "text", "text", "currency"],
    pageStatus: true,
    pagination: true,
    pageLength: 5,
    resizable: true,
    tableOnly: true,

  };

  passDataDistributionQuotaShare: any = {
    tableData: [
      ["AFP", "-450", "0"],
      ["AlliedBankers", "-450", "0"],
      ["Alpha", "-450", "0"],
      ["Asia Insurance", "-450", "0"],
      ["Asia United", "-450", "0"],
    ],
    tHeader: ["Company", "1st Retention", "2nd Retention"],
    dataTypes: ["text", "currency", "currency"],
    pageStatus: true,
    pagination: true,
    pageLength: 5,
    resizable: true,
    tableOnly: true,

  };

  constructor(private titleService: Title, private modalService: NgbModal, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Claim Recovery");
  }
  onViewDetailsDistribute(event) {
    $('#idMdl > #modalBtn').trigger('click');
  }

}
