import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService } from '../../_services';
import { OpenCoverProcessing } from '../../_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-open-cover-processing',
  templateUrl: './open-cover-processing.component.html',
  styleUrls: ['./open-cover-processing.component.css'],
  providers: [NgbModal, NgbActiveModal]
})
export class OpenCoverProcessingComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];
  rowData: any[] = [];
  disabledEditBtn: boolean = true;
  disabledCopyBtn: boolean = true;

  line: string = "";

  passData: any = {
        tableData: [], 
        tHeader: ['Open Cover Quotation No.','Type of Cession','Line Class','Status','Ceding Company','Principal','Contractor','Insured','Risk','Object','Site','Currency', 'Quote Date', 'Valid Until', 'Request By', 'Created By'],
        dataTypes: ['text','text','text','text','text','text','text','text','text','text','text','date','date','text','text'],
        resizable: [false, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true],
        filters: [],
        pageLength: 10,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: true, printBtn: false, 
  }

  constructor(private quotationService: QuotationService, private modalService: NgbModal, private router: Router
    , public activeModal: NgbActiveModal, private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Quo | Open Cover Processing");
    this.rowData = this.quotationService.getRowData();
    this.passData.tableData = this.quotationService.getOpenCoverProcessingData();

  }

  editBtnEvent() {
    this.line = this.quotationService.rowData[0].split("-")[0];
    this.quotationService.toGenInfo = [];
    this.quotationService.toGenInfo.push("edit", this.line);
    this.router.navigate(['/quotation']);
  }

  nextBtnEvent() {
    if (this.line === 'CAR' ||
      this.line === 'EAR' ||
      this.line === 'EEI' ||
      this.line === 'CEC' ||
      this.line === 'MBI' ||
      this.line === 'BPV' ||
      this.line === 'MLP' ||
      this.line === 'DOS') {
      this.modalService.dismissAll();

      this.quotationService.rowData = [];
      this.quotationService.toGenInfo = [];
      this.quotationService.toGenInfo.push("add", this.line);
      this.router.navigate(['/open-cover']);
    }

  }

  onRowClick(event) {
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
      this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }

    this.disabledEditBtn = false;
    this.disabledCopyBtn = false;
  }

  onRowDblClick(event) {
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
      this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }

    this.line = this.quotationService.rowData[0].split("-")[0];

    this.quotationService.toGenInfo = [];
    this.quotationService.toGenInfo.push("edit", this.line);
    this.router.navigate(['/open-cover']);

  }
  showApprovalModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }
  closeModalPls(content) {
    this.activeModal = content;
    this.activeModal.dismiss;
  }

}
