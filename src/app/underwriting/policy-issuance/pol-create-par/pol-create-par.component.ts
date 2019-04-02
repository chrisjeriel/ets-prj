import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, QuotationService, NotesService } from '../../../_services';
import { CreateParInfo } from '../../../_models/CreatePolicy';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-pol-create-par',
  templateUrl: './pol-create-par.component.html',
  styleUrls: ['./pol-create-par.component.css']
})
export class PolCreatePARComponent implements OnInit {
  @ViewChild('polLov') lovTable: CustNonDatatableComponent;
  @ViewChild('polOptionLov') lovOptTable: CustNonDatatableComponent;

  private createParInfo: CreateParInfo
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];  
  quoteLine: any;

  qu: boolean = true;
  hc: boolean = false;
  oc: boolean = false;

  quotationList: any[] = [];

  passDataLOV: any = {
    tableData: [],
    tHeader:["Quotation No", "Ceding Company", "Insured", "Risk"],  
    dataTypes: ["text","text","text","text"],
    pageLength: 10,
    resizable: [false,false,false,false],
    tableOnly: false,
    keys: ['quotationNo','cedingName','insuredDesc','riskName'],
    pageStatus: true,
    pagination: true,
    filters: [
    /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
    pageID: 'createPolLov'
  }

  passDataOptionLOV: any = {
    tableData: [],
    tHeader:["Option No", "Condition"],  
    dataTypes: ["text","text"],
    pageLength: 10,
    //resizable: [false,false],
    tableOnly: false,
    keys: ['optionId','condition'],
    pageStatus: true,
    pagination: true,
    filters: [
    /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
    pageID: 'createPolOptionLov'
  }

  selected: any;
  selectedOption: any;
  quNo: any[] = [];
  hcNo: any[] = [];
  ocNo: any[] = [];
  optionId: any = "";
  condition: any = "";
  cedingName: any = "";
  insuredDesc: any = "";
  riskName: any = "";
  inceptionDate: any = "";
  inceptionTime: any = "";
  expiryDate: any = "";
  expiryTime: any = "";

  constructor(private underwritingService: UnderwritingService,
    private modalService: NgbModal, private router: Router, private titleService: Title, private quoteService: QuotationService, private ns: NotesService) {

  }

  ngOnInit() {    
    // this.getQuoteListing();
  }

  getQuoteListing() {
    this.quoteService.getQuoProcessingData([]).subscribe(data => {
      this.quotationList = data['quotationList'];
      this.passDataLOV.tableData = this.quotationList.filter(q => q.status.toUpperCase() === 'RELEASED').map(q => { q.riskName = q.project.riskName; return q; });

      this.lovTable.refreshTable();
    });    

  }

  getOptionLOV(quoteId) {
    this.quoteService.getQuoteOptions(quoteId).subscribe(data => {
      this.passDataOptionLOV.tableData = data['quotation']['optionsList'];

      this.lovOptTable.refreshTable();
    });
  }

  navigateToGenInfo() {
    var qLine = this.quoteLine.toUpperCase();

    if (qLine === 'CAR' ||
      qLine === 'EAR' ||
      qLine === 'EEI' ||
      qLine === 'CEC' ||
      qLine === 'MBI' ||
      qLine === 'BPV' ||
      qLine === 'MLP' ||
      qLine === 'DOS') {
      this.router.navigate(['/policy-issuance', { line: qLine }], { skipLocationChange: true });
    }

  }

  toggle(str) {
    switch (str) {
      case 'qu':
        this.qu = true;   
        this.hc = false;
        this.oc = false;
        break;

      case 'hc':
        this.qu = false;
        this.hc = true;        
        this.oc = false;
        break;
      
      case 'oc':        
        this.qu = false;
        this.hc = false;
        this.oc = true;
        break;
    }
  }

  showLOV() {
    console.log('1');
    this.getQuoteListing();
    $('#polLovMdl > #modalBtn').trigger('click');
  }

  showOptionLOV() {
    $('#optionLovMdl > #modalBtn').trigger('click');
  }

  onRowClick(event) {    
    if(Object.entries(event).length === 0 && event.constructor === Object){
      this.selected = null;
    } else {
      this.selected = event;
    }    
  }

  onRowClickOption(event) {
    if(Object.entries(event).length === 0 && event.constructor === Object){
      this.selectedOption = null;
    } else {
      this.selectedOption = event;
    }  
  }

  setDetails(str) {
    if(this.selected != null) {
      if(str === 'qu') {
        this.quNo = this.selected.quotationNo.split('-');
        this.cedingName = this.selected.cedingName;
        this.insuredDesc = this.selected.insuredDesc;
        this.riskName = this.selected.riskName;

        this.getOptionLOV(this.selected.quoteId);
      } else if (str === 'hc') {

      } else if (str === 'oc') {

      }
    } else {
      this.quNo = [];
      this.hcNo = [];
      this.ocNo = [];
      this.cedingName = '';
      this.insuredDesc = '';
      this.riskName = '';
    }
    
  }

  setOption() {
    if(this.selectedOption != null) {
      this.optionId = this.selectedOption.optionId;
      this.condition = this.selectedOption.condition;
    }
  }

  prepareParams() {    
    var savePolicyDetailsParam = {    
      "expiryDate": this.expiryDate + 'T' + this.expiryTime,
      "holdCoverNo": this.hcNo.length == 0 ? '' : this.hcNo.join('-'),
      "inceptDate": this.inceptionDate + 'T' + this.inceptionTime,
      "openPolicyNo": this.ocNo.length == 0 ? '' : this.ocNo.join('-'),
      "optionId": this.optionId,
      "quotationNo": this.quNo.length == 0 ? '' : this.quNo.join('-'),
      "createUser": JSON.parse(window.localStorage.currentUser).username,
      "createDate": this.ns.toDateTimeString(0),
      "updateUser": JSON.parse(window.localStorage.currentUser).username,
      "updateDate": this.ns.toDateTimeString(0)
    }

    console.log(savePolicyDetailsParam);
  }
}
