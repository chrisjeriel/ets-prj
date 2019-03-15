import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService, NotesService, MaintenanceService } from '../../_services';
import { OpenCoverProcessing } from '../../_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';

@Component({
  selector: 'app-open-cover-processing',
  templateUrl: './open-cover-processing.component.html',
  styleUrls: ['./open-cover-processing.component.css'],
  providers: [NgbModal, NgbActiveModal]
})

export class OpenCoverProcessingComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
  @ViewChild(MtnRiskComponent) riskLov: MtnTypeOfCessionComponent;

  loading: boolean = false;

  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];
  rowData: any[] = [];

  line: string = "";
  ocLine: string = '';
  ocQuoteNo: string = "";
  ocQuoteId: string = "";
  //riskName: string = "";

  mtnLineCd: string;
  mtnLineDesc: string;
  mtnCessionId: string;
  mtnCessionDesc: string;
  riskDetails: any = {
    riskId: '',
    riskName: '',
  };

  objId:number;

  passData: any = {
    tableData: [],
    tHeader: ['Open Cover Quotation No.', 'Type of Cession', 'Line Class', 'Status', 'Ceding Company', 'Principal', 'Contractor', 'Insured', 'Risk', 'Object', 'Site', 'Currency', 'Quote Date', 'Valid Until', 'Request By', 'Created By'],
    //dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', "text", 'date', 'date', 'text', 'text'],
    dataTypes: ["text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text","text", "date", "date", "text", "text"],
    resizable: [false, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true],
    pageLength: 20,
    expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, pagination: true, pageStatus: true, addFlag: true, editFlag: true,
     filters: [
        {
            key: 'quotationNo',
            title: 'Quotation No.',
            dataType: 'seq'
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
            dataType: 'seq'
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
    keys: ['openQuotationNo','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','currencyCd','issueDate','expiryDate','reqBy','createUser'],
  }

  searchParams: any[] = [];

  selectedOpenQuotationNo: any = {};

  newEntry: boolean = true;

  constructor(private quotationService: QuotationService, private modalService: NgbModal, private router: Router
    , public activeModal: NgbActiveModal, private titleService: Title, private notes: NotesService, private maintenanceService: MaintenanceService
  ) { }
 
  ngOnInit() {
    this.titleService.setTitle("Quo | Open Cover Processing");
    this.rowData = this.quotationService.getRowData();
    this.retrieveQuoteOcListingMethod();
    
  }

  retrieveQuoteOcListingMethod(){
     this.quotationService.getOpenCoverProcessingData(this.searchParams).subscribe((data:any) => {
      var records = data['quotationOcList'];
      console.log(records);
      for(let rec of records){
        this.passData.tableData.push(new OpenCoverProcessing(
            rec.openQuotationNo,
            rec.cessionDesc,
            rec.lineClassCdDesc,
            rec.status,
            rec.cedingName,
            rec.principalName,
            rec.contractorName,
            rec.insuredDesc,
            (rec.projectOc == null) ? '' : rec.projectOc.riskName,
            (rec.projectOc == null) ? '' : rec.projectOc.objectDesc,
            (rec.projectOc == null) ? '' : rec.projectOc.site,
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

  nextBtnEvent() {
    var ocLine = this.mtnLineCd.toUpperCase();

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

      setTimeout(() => {
        this.router.navigate(['/open-cover', { line: ocLine, 
                                               from: "oc-processing", 
                                               cessionId: this.mtnCessionId,
                                               typeOfCession: this.mtnCessionDesc, 
                                               riskId: this.riskDetails.riskId,
                                               riskName: this.riskDetails.riskName,
                                               regionDesc: this.riskDetails.regionDesc,
                                               provinceDesc: this.riskDetails.provinceDesc,
                                               cityDesc: this.riskDetails.cityDesc,
                                               districtDesc: this.riskDetails.districtDesc,
                                               blockDesc: this.riskDetails.blockDesc,
                                               latitude: this.riskDetails.latitude, 
                                               longitude: this.riskDetails.longitude,
                                               fromBtn: 'add', 
                                               inquiryFlag: false 
                                             }], { skipLocationChange: true });
      }, 100);
    }

  }

  onClickAdd(event) {
    if(this.newEntry){
        this.maintenanceService.getMtnTypeOfCession(1).subscribe(data => {            
            this.mtnCessionId = data['cession'][0].cessionId;
            this.mtnCessionDesc = data['cession'][0].cessionAbbr;

            this.newEntry = false;
        });
    }
    $('#addModal > #modalBtn').trigger('click');
    setTimeout(function() { $(event).focus(); }, 0)
  }

  onClickEdit(event){
    this.ocLine = this.selectedOpenQuotationNo.openQuotationNo.split('-')[1];
    this.ocQuoteNo = this.selectedOpenQuotationNo.openQuotationNo;
    this.mtnCessionDesc = this.selectedOpenQuotationNo.cessionDesc;

    setTimeout(() => {
      this.router.navigate(['/open-cover', { line: this.ocLine, from: "oc-processing", typeOfCession: this.mtnCessionDesc, fromBtn: 'edit', ocQuoteNo: this.ocQuoteNo, inquiryFlag: false }], { skipLocationChange: true });
    }, 100);

  }

  //Method for DB query
  searchQuery(searchParams){
      this.searchParams = searchParams;
      this.passData.tableData = [];
      this.retrieveQuoteOcListingMethod();
  }

  onRowClick(data) {
    this.selectedOpenQuotationNo = data;
    console.log(data);
  }

  onRowDblClick(event) {
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
      this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }

    this.ocLine = this.quotationService.rowData[0].split("-")[1];
    this.ocQuoteNo  = this.quotationService.rowData[0];
    this.mtnCessionDesc =  this.quotationService.rowData[1];

    /*this.ocLine = this.selectedOpenQuotationNo.openQuotationNo.split('-')[1];
    this.ocQuoteNo = this.selectedOpenQuotationNo.openQuotationNo;
    this.mtnCessionDesc = this.selectedOpenQuotationNo.cessionDesc;*/

    setTimeout(() => {
      this.router.navigate(['/open-cover', { line: this.ocLine, from: "oc-processing", fromBtn: 'edit', typeOfCession: this.mtnCessionDesc, ocQuoteNo: this.ocQuoteNo, inquiryFlag: false }], { skipLocationChange: true });
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

/*  clickRow(event){
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
      this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }
    this.ocLine = this.quotationService.rowData[0].split("-")[1];
    this.ocQuoteNo  = this.quotationService.rowData[0];
 
    this.mtnCessionDesc =  this.quotationService.rowData[1];
  }*/

  getRiskLov(){
    $('#riskIdLov #modalBtn').trigger('click');
  }
  setRisk(data){
    this.riskDetails = data;
    this.notes.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#riskId');   
        }
  }

  getLineLov(){
    $('#lineIdLov #modalBtn').trigger('click');
  }
  setLine(data){
    this.mtnLineCd  = data.lineCd;
    this.mtnLineDesc  = data.description;
    this.notes.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#mtnLineCd');   
        }
  }

  getCessionLov(){
    $('#cessionIdLov #modalBtn').trigger('click');
  }
  setCession(data){
    this.mtnCessionId = data.cessionId;
    this.mtnCessionDesc  = data.description;
    this.notes.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#mtnCessionId');   
        }
  }
  checkCode(ev, field){
        this.notes.lovLoader(ev, 1)
        if(field === 'line') {
            this.lineLov.checkCode(this.mtnLineCd.toUpperCase(), ev);
        } else if(field === 'typeOfCession'){
            this.typeOfCessionLov.checkCode(this.mtnCessionId, ev);    
        } else if(field === 'risk') {
            this.riskLov.checkCode(this.riskDetails.riskId, ev);
        }             
    }

    checkFields(){
        if(this.mtnLineDesc === undefined || this.mtnCessionDesc === undefined || this.riskDetails.riskName === undefined ||
           this.mtnLineDesc === null || this.mtnCessionDesc === null || this.riskDetails.riskName === null ||
           this.mtnLineDesc === '' || this.mtnCessionDesc === '' || this.riskDetails.riskName === ''){
            return true;
        }

        return false;
    }

    clearAddFields(){
      this.riskDetails = {
          riskId: '',
          riskName: '',
       };
       this.mtnCessionId = '';
       this.mtnCessionDesc = '';
       this.mtnLineCd = '';
       this.mtnLineDesc = '';
       this.newEntry = true;
    }

}
