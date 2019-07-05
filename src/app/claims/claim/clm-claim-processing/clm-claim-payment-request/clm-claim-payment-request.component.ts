import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ClaimsService, NotesService, UnderwritingService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-clm-claim-payment-request',
  templateUrl: './clm-claim-payment-request.component.html',
  styleUrls: ['./clm-claim-payment-request.component.css']
})

export class ClmClaimPaymentRequestComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;

  passData: any = {
    tableData: [],
    tHeader: ["Payment Request No.", "Status", "Hist. No.", "Hist. Type", "Type", "Curr", "Reserve", "Payment Amount", "Ref. No.", "Ref. Date"],
    dataTypes: ["text", "text", "number", "text", "text", "text", "currency", "currency", "text", "date"],
    keys: ['paytReqNo','paytReqStatDesc','histNo','histCategoryDesc','histTypeDesc','currencyCd','reserveAmt','paytAmt','refNo','refDate'],
    pagination: true,
    pageStatus: true,
    pageLength: 10,
    tableOnly: true,
    resizable: [false, false, false, false, false, false, false, false, false, false],
  }

  claimId: any = null;
  selected: any = null;
  disableGenerateBtn: boolean = false;

  @Input() claimInfo = {
    claimId: '',
    claimNo: '',
    policyNo: '',
    riskId: '',
    riskName:'',
    insuredDesc:''
  }

  constructor(private titleService: Title, private router: Router, private cs: ClaimsService, private ns: NotesService, private us: UnderwritingService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Generate Payment Request");

    setTimeout(() => {
      this.table.refreshTable();
      this.getClmPaytReq();
    }, 0);
  }

  getClmPaytReq() {
    this.table.overlayLoader = true;
    this.cs.getClmPaytReq(this.claimInfo.claimId,'').subscribe(data => {
      this.passData.tableData = data['paytReqList'].map(a => {
                                                               a.refDate = this.ns.toDateTimeString(a.refDate);
                                                               a.createDate = this.ns.toDateTimeString(a.createDate);
                                                               a.updateDate = this.ns.toDateTimeString(a.updateDate);

                                                               return a;
                                                             });
      this.table.refreshTable();
      this.disableGenerateBtn = this.passData.tableData.length == 0;
    });
  }

  onRowClick(ev) {
    this.selected = ev == null || (Object.entries(ev).length === 0 && ev.constructor === Object) ? null : ev;
    this.disableGenerateBtn = this.selected == null;
  }

  generateRequest(){
    this.router.navigate(['generate-payt-req'], {skipLocationChange: true});
  }
}
