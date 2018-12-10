import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService } from '../../_services';
import { QuotationProcessing } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quotation-processing',
  templateUrl: './quotation-processing.component.html',
  styleUrls: ['./quotation-processing.component.css']
})
export class QuotationProcessingComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];
  rowData: any[] = [];
  disabledEditBtn: boolean = true;

  constructor(private quotationService: QuotationService, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.rowData = this.quotationService.getRowData();

  	this.tHeader.push("Quotation No");
  	this.tHeader.push("Branch");
  	this.tHeader.push("Line Class");
  	this.tHeader.push("Quote Status");
  	this.tHeader.push("Ceding Company");
  	this.tHeader.push("Principal");
  	this.tHeader.push("Contractor");
  	this.tHeader.push("Insured");
  	this.tHeader.push("Quote Date");
  	this.tHeader.push("Validity Date");
  	this.tHeader.push("Requested By");
  	this.tHeader.push("Created By");

    this.filters.push("Quotation No");
    this.filters.push("Branch");
    this.filters.push("Line Class");
    this.filters.push("Quote Status");
    this.filters.push("Ced. Company");
    this.filters.push("Principal");
    this.filters.push("Contractor");
    this.filters.push("Insured");
    this.filters.push("Quote Date");
    this.filters.push("Val. Date");
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
  	this.dataTypes.push("date");
  	this.dataTypes.push("date");
  	this.dataTypes.push("text");
  	this.dataTypes.push("text");

  	this.tableData = this.quotationService.getQuoProcessingData();
  }

  editBtnEvent() {
    this.quotationService.toGenInfo = "edit";
    this.router.navigate(['/quotation']);
  }

  onRowClick(event) {
    for(var i = 0; i < event.target.parentElement.children.length; i++) {
      this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
    }

    for(var i = 0; i < event.target.parentElement.parentElement.children.length; i++) {
      event.target.parentElement.parentElement.children[i].style.backgroundColor = "";
    }

    event.target.parentElement.style.backgroundColor = "#67b4fc";
    this.disabledEditBtn = false;
  }

  onRowDblClick(event) {
    for(var i = 0; i < event.target.parentElement.children.length; i++) {
      this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
    }

    this.quotationService.toGenInfo = "edit";
    this.router.navigate(['/quotation']);
  }
}
