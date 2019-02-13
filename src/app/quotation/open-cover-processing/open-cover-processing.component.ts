import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService } from '../../_services';
import { OpenCoverProcessing } from '../../_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-open-cover-processing',
  templateUrl: './open-cover-processing.component.html',
  styleUrls: ['./open-cover-processing.component.css'],
  providers: [NgbModal, NgbActiveModal]
})

export class OpenCoverProcessingComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];
  rowData: any[] = [];
  disabledEditBtn: boolean = true;
  disabledCopyBtn: boolean = true;

  line: string = "";
  ocLine: string = '';
  ocQuoteNo: string = "";
  ocQuoteId: string = "";
  //riskName: string = "";

  riskId:string;
  riskName:string;

  passData: any = {
    tableData: [],
    tHeader: ['Open Cover Quotation No.', 'Type of Cession', 'Line Class', 'Status', 'Ceding Company', 'Principal', 'Contractor', 'Insured', 'Risk', 'Object', 'Site', 'Currency', 'Quote Date', 'Valid Until', 'Request By', 'Created By'],
    //dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', "text", 'date', 'date', 'text', 'text'],
    dataTypes: ["text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "date", "date", "text", "text", "text"],
    resizable: [false, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true],
    pageLength: 10,
    expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: true, printBtn: false, pagination: true, pageStatus: true,
    filters: [
        {
            key: 'quotationNo',
            title: 'Quotation No.',
            dataType: 'text'
        },
        {
            key: 'cessionDesc',
            title: 'Type of Cession',
            dataType: 'text'
        },
        {
            key: 'lineClassCdDesc',
            title: 'Line Class',
            dataType: 'text'
        },
        {
            key: 'status',
            title: 'Status',
            dataType: 'text'
        },
        {
            key: 'cedingName',
            title: 'Ceding Co.',
            dataType: 'text'
        },
        {
            key: 'principalName',
            title: 'Principal',
            dataType: 'text'
        },
        {
            key: 'contractorName',
            title: 'Contractor',
            dataType: 'text'
        },
        {
            key: 'insuredDesc',
            title: 'Insured',
            dataType: 'text'
        },
        {
            key: 'riskName',
            title: 'Risk',
            dataType: 'text'
        },
        {
            key: 'objectDesc',
            title: 'Object',
            dataType: 'text'
        },
        {
            key: 'site',
            title: 'Site',
            dataType: 'text'
        },
        {
            key: 'policyNo',
            title: 'Policy No.',
            dataType: 'text'
        },
        {
            key: 'currencyCd',
            title: 'Currency',
            dataType: 'text'
        },
        {
            key: 'issueDate',
            title: 'Quote Date',
            dataType: 'date'
        },
        {
            key: 'expiryDate',
            title: 'Valid Until',
            dataType: 'date'
        },
        {
            key: 'reqBy',
            title: 'Requested By',
            dataType: 'text'
        },
        {
            key: 'createUser',
            title: 'Created By',
            dataType: 'text'
        },
    ],
    keys: ['quotationNo','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','currencyCd','issueDate','expiryDate','reqBy','createUser'],
    // addFlag:true
  }

  // passDataRiskLOV:any = {
  //   tableData: this.quotationService.getRisksLOV(),
  //   tHeader: ["Risk Code", "Risk", "Region", "Province", "Town/City", "District", "Block"],
  //   dataTypes: ["text","text","text","text","text","text","text"],
  //   pagination: true,
  //   pageLength:10,
  //   pageStatus: true,
  //   filters:[
  //     {
  //       key: 'riskCode',
  //       title: 'Risk Code',
  //       dataType: 'text'
  //     },
  //     {
  //       key: 'risk',
  //       title: 'Risk',
  //       dataType: 'text'
  //     },
  //     {
  //       key: 'region',
  //       title: 'Region',
  //       dataType: 'text'
  //     },
  //     {
  //       key: 'province',
  //       title: 'Province',
  //       dataType: 'text'
  //     },
  //     {
  //       key: 'townCity',
  //       title: 'Town/City',
  //       dataType: 'text'
  //     },
  //     {
  //       key: 'district',
  //       title: 'District',
  //       dataType: 'text'
  //     },
  //     {
  //       key: 'block',
  //       title: 'Block',
  //       dataType: 'text'
  //     }
  //   ]
  // }

  constructor(private quotationService: QuotationService, private modalService: NgbModal, private router: Router
    , public activeModal: NgbActiveModal, private titleService: Title
  ) { }
 
  ngOnInit() {
    this.titleService.setTitle("Quo | Open Cover Processing");
    this.rowData = this.quotationService.getRowData();
    // this.passData.tableData = this.quotationService.getOpenCoverProcessingData();
    
    this.quotationService.getOpenCoverProcessingData().subscribe(data => {
      var records = data['quotationOcList'];

      for(let rec of records){
        this.passData.tableData.push(new OpenCoverProcessing(
            rec.quotationNo,
            rec.cessionDesc,
            rec.lineClassCdDesc,
            rec.status,
            rec.cedingName,
            rec.principalName,
            rec.contractorName,
            rec.insuredDesc,
            (rec.project == null) ? '' : rec.project.riskName,
            (rec.project == null) ? '' : rec.project.objectDesc,
            (rec.project == null) ? '' : rec.project.site,
            rec.currencyCd,
            this.dateParser(rec.issueDate),
            this.dateParser(rec.expiryDate),
            rec.reqBy,
            rec.createUser
          ));
      }

      this.table.refreshTable();
    });
    
  }

  


  editBtnEvent() {
    setTimeout(() => {
      this.router.navigate(['/open-cover', { line: this.ocLine, ocQuoteNo: this.ocQuoteNo }], { skipLocationChange: true });
    }, 100);
  }


  nextBtnEvent() {
    var ocLine = this.line.toUpperCase();

    if (ocLine === 'CAR' ||
      ocLine === 'EAR' ||
      ocLine === 'EEI' ||
      ocLine === 'CEC' ||
      ocLine === 'MBI' ||
      ocLine === 'BPV' ||
      ocLine === 'MLP' ||
      ocLine === 'DOS') {
      this.modalService.dismissAll();

      this.quotationService.rowData = [];
      // this.quotationService.toGenInfo = [];
      // this.quotationService.toGenInfo.push("add", this.line);
      // this.router.navigate(['/open-cover']);

      setTimeout(() => {
        this.router.navigate(['/open-cover', { line: ocLine }], { skipLocationChange: true });
      }, 100);
    }

  }

  onClickAdd(event) {
    $('#addModal > #modalBtn').trigger('click');
  }

  onRowClick(event) {
    this.disabledEditBtn = false;
    this.disabledCopyBtn = false;
  }

  onRowDblClick(event) {
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
      this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }
    this.ocLine = this.quotationService.rowData[0].split("-")[1];
    this.ocQuoteNo  = this.quotationService.rowData[0];
    
    setTimeout(() => {
      this.router.navigate(['/open-cover', { line: this.ocLine, ocQuoteNo: this.ocQuoteNo }], { skipLocationChange: true });
    }, 100);
  }

  showApprovalModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }
  closeModalPls(content) {
    this.activeModal = content;
    this.activeModal.dismiss;
  }

  dateParser(arr){
    return new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);   
  }

  riskLovModal(event){
    $('#riskLovId > #modalBtn').trigger('click');
  }

  clickRow(event){
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
      this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }
    this.ocLine = this.quotationService.rowData[0].split("-")[1];
    this.ocQuoteNo  = this.quotationService.rowData[0];
  }

  getRiskLov(){
    $('#riskIdLov #modalBtn').trigger('click');
  }
  setRisk(data){
    this.riskId  = data.riskId;
    this.riskName  = data.riskName;
    this.onClickAdd("");
  }

}
