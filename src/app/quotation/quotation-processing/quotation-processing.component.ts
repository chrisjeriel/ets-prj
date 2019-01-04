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
  dataTypes: any[] = [];
  filters: any[] = [];
  rowData: any[] = [];
  disabledEditBtn: boolean = true;
  disabledCopyBtn: boolean = true;
/*  addQuoteFlag: boolean = true;
  copyQuotationFlag: boolean = true;*/
    
  line: string = "";
    
  mdlConfig = {
      mdlBtnAlign: 'center',
  }

  passData: any = {
        tableData: this.quotationService.getQuoProcessingData(), 
        tHeader: ['Quotation No.','Type of Cession','Line Class','Status','Ceding Company','Principal','Contractor','Insured','Risk','Object','Site','Policy No','Currency', 'Quote Date', 'Valid Until', 'Requested By', 'Created By'],
        dataTypes: ['text','text','text','text','text','text','text','text','text','text','text','text','text','date','date','text',],
        resizable: [false, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true],
        filters: [],
        pageLength: 10,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, addFlag: true, editFlag: true, copyFlag: true, pageStatus: true, pagination: true,
  }
    
  riskData: any = {
      tableData: this.quotationService.getRisksLOV(),
      tHeader: ['Risk Code', 'Risk', 'Region', 'Province', 'Town/City', 'District', 'Block'],
      dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text'],
      resizable: [false, true, false, true, true, false, false],
      pageLength: 10,
      searchFlag: true,
     /* pageStatus: true,
      pagination: true,*/
      fixedCol: false,
  }

  constructor(private quotationService: QuotationService, private modalService: NgbModal, private router: Router
    , public activeModal: NgbActiveModal, private titleService: Title
  ) { }


  ngOnInit() {
    this.titleService.setTitle("Quo | List Of Quotations");
    this.rowData = this.quotationService.getRowData();
  }
  
  onClickAdd(event){
      $('#addModal > #modalBtn').trigger('click');
  }
  onClickEdit(event) {
    this.line = this.quotationService.rowData[0].split("-")[0];

    this.quotationService.toGenInfo = [];
    this.quotationService.toGenInfo.push("edit", this.line);
    this.router.navigate(['/quotation']);
  }
    
  onClickCopy(event){
      $('#copyModal > #modalBtn').trigger('click');
  }

  riskLOV(){
      $('#riskModal > #modalBtn').trigger('click');
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