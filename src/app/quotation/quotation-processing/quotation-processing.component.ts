import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService } from '../../_services';
import { QuotationProcessing } from '../../_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-quotation-processing',
  templateUrl: './quotation-processing.component.html',
  styleUrls: ['./quotation-processing.component.css'],
  providers: [NgbModal, NgbActiveModal]
})
export class QuotationProcessingComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];
  tHeader2: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];
  rowData: any[] = [];
  disabledEditBtn: boolean = true;
  disabledCopyBtn: boolean = true;

  line: string = "";

  constructor(private quotationService: QuotationService, private modalService: NgbModal, private router: Router
    , public activeModal: NgbActiveModal, private titleService: Title
  ) { }


  ngOnInit() {
    this.titleService.setTitle("Quo | List Of Quotations");
    this.rowData = this.quotationService.getRowData();

    this.tHeader.push("Quotation No");
    this.tHeader.push("Type of Cession");
    this.tHeader.push("Line Class");
    this.tHeader.push("Status");
    this.tHeader.push("Ceding Company");
    this.tHeader.push("Principal");
    this.tHeader.push("Contractor");
    this.tHeader.push("Insured");
    this.tHeader.push("Risk");
    this.tHeader.push("Object");
    this.tHeader.push("Location");
    this.tHeader.push("Quote Date");
    this.tHeader.push("Validity Date");
    this.tHeader.push("Requested By");
    this.tHeader.push("Created By");

    this.filters.push("Quotation No");
    this.filters.push("Type of Cession");
    this.filters.push("Line Class");
    this.filters.push("Status");
    this.filters.push("Ceding Company");
    this.filters.push("Principal");
    this.filters.push("Contractor");
    this.filters.push("Insured");
    this.filters.push("Risk");
    this.filters.push("Object");
    this.filters.push("Location");
    this.filters.push("Quote Date");
    this.filters.push("Validity Date");
    this.filters.push("Requested By");
    this.filters.push("Created By");

    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("date");
    this.dataTypes.push("date");
    this.dataTypes.push("text");
    this.dataTypes.push("text");

    this.tableData = this.quotationService.getQuoProcessingData();

    this.tHeader2.push("Risk Code", "Risk", "Region", "Province", "Town/City", "District", "Block");
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
      this.router.navigate(['/quotation']);
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
    this.router.navigate(['/quotation']);

  }
  showApprovalModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }
  closeModalPls(content) {
    this.activeModal = content;
    this.activeModal.dismiss;
  }
}