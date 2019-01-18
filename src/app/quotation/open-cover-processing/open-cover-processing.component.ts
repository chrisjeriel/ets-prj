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
  ocLine: string = '';

  passData: any = {
    tableData: [],
    tHeader: ['Open Cover Quotation No.', 'Type of Cession', 'Line Class', 'Status', 'Ceding Company', 'Principal', 'Contractor', 'Insured', 'Risk', 'Object', 'Site', 'Currency', 'Quote Date', 'Valid Until', 'Request By', 'Created By'],
    //dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', "text", 'date', 'date', 'text', 'text'],
    dataTypes: ["text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text"],
    resizable: [false, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true],
    pageLength: 10,
    expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: true, printBtn: false, pagination: true, pageStatus: true,
    filters: [
      {
        key: 'openCoverQuotationNo',
        title: 'OC Quo. No',
        dataType: 'text'
      },
      {
        key: 'typeOfCession',
        title: 'Type of Cession',
        dataType: 'text'
      },
      {
        key: 'lineClass',
        title: 'Line Class',
        dataType: 'text'
      },
      {
        key: 'status',
        title: 'Status',
        dataType: 'text'
      },
      {
        key: 'cedingCompany',
        title: 'Ceding Co',
        dataType: 'text'
      },
      {
        key: 'principal',
        title: 'Principal',
        dataType: 'text'
      },
      {
        key: 'contractor',
        title: 'Contractor',
        dataType: 'text'
      },
      {
        key: 'insured',
        title: 'Insured',
        dataType: 'text'
      },
      {
        key: 'risk',
        title: 'Risk',
        dataType: 'text'
      },
      {
        key: 'qObject',
        title: 'Object',
        dataType: 'text'
      },
      {
        key: 'site',
        title: 'Site',
        dataType: 'text'
      },
      {
        key: 'currency',
        title: 'Currency',
        dataType: 'text'
      },
      {
        key: 'quoteDate',
        title: 'Quote Date',
        dataType: 'date'
      },
      {
        key: 'validatyDate',
        title: 'Validity Date',
        dataType: 'date'
      },
      {
        key: 'requestBy',
        title: 'Requested By',
        dataType: 'text'
      },
      {
        key: 'createBy',
        title: 'Created By',
        dataType: 'text'
      },
    ],
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
    // this.line = this.quotationService.rowData[0].split("-")[0];
    // this.quotationService.toGenInfo = [];
    // this.quotationService.toGenInfo.push("edit", this.line);
    // this.router.navigate(['/open-cover']);
    setTimeout(() => {
      this.router.navigate(['/open-cover', { line: this.ocLine }], { skipLocationChange: true });
    }, 100);
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
      // this.quotationService.toGenInfo = [];
      // this.quotationService.toGenInfo.push("add", this.line);
      // this.router.navigate(['/open-cover']);

      this.ocLine = this.line;
      setTimeout(() => {
        this.router.navigate(['/open-cover', { line: this.ocLine }], { skipLocationChange: true });
      }, 100);
    }

  }


  onRowClick(event) {
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
      this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }
    this.ocLine = this.ocLine = this.quotationService.rowData[0].split("-")[0];

    this.disabledEditBtn = false;
    this.disabledCopyBtn = false;
  }

  onRowDblClick(event) {
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
      this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }
    this.ocLine = this.quotationService.rowData[0].split("-")[0];
    setTimeout(() => {
      this.router.navigate(['/open-cover', { line: this.ocLine }], { skipLocationChange: true });
    }, 100);
    // this.quotationService.toGenInfo = [];
    // this.quotationService.toGenInfo.push("edit", this.line);
  }

  showApprovalModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }
  closeModalPls(content) {
    this.activeModal = content;
    this.activeModal.dismiss;
  }

}
