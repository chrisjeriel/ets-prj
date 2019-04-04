import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, QuotationService, NotesService, MaintenanceService } from '../../../_services';
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
  holCovList: any[] = [];
  polOcList: any[] = [];

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

  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal, private router: Router,
              private titleService: Title, private quoteService: QuotationService, private ns: NotesService, private mtnService: MaintenanceService) {

  }

  ngOnInit() {    
    this.getQuoteListing();

    this.inceptionDate = this.ns.toDateTimeString(0).split('T')[0];

    var d = new Date();
    d.setFullYear(d.getFullYear() + 1);

    this.expiryDate = this.ns.toDateTimeString(d).split('T')[0];
  }

  getQuoteListing() {
    this.quoteService.getQuoProcessingData([]).subscribe(data => {
      this.quotationList = data['quotationList'];
      this.passDataLOV.tableData = this.quotationList.filter(qu => qu.status.toUpperCase() === 'RELEASED' )
                                                     .map(qu => { qu.riskName = qu.project.riskName; return qu; });
      this.lovTable.refreshTable();
    });    

  }

  getOptionLOV(quoteId) {
    this.quoteService.getQuoteOptions(quoteId).subscribe(data => {
      this.passDataOptionLOV.tableData = data['quotation']['optionsList'];

      this.lovOptTable.refreshTable();
    });
  }

  getHoldCovListing() {
    this.quoteService.getQuotationHoldCoverList([]).subscribe(data => {
      this.holCovList = data['quotationList'];
      this.passDataLOV.tableData = this.holCovList.filter(hc => hc.holdCover.status.toUpperCase() === 'RELEASED' || hc.holdCover.status.toUpperCase() === 'EXPIRED')
                                                  .map(hc => { hc.riskName = hc.project.riskName; return hc; });
      this.lovTable.refreshTable();
    });
  }

  getPolOCListing() {
    this.underwritingService.getPolListingOc([]).subscribe(data => {
      console.log(data);
    });
    /*this.quoteService.getQuotationHoldCoverList([]).subscribe(data => {
      this.holCovList = data['quotationList'];
      this.passDataLOV.tableData = this.holCovList.filter(hc => hc.holdCover.status.toUpperCase() === 'IN FORCE' || hc.holdCover.status.toUpperCase() === 'EXPIRED')
                                                  .map(hc => { hc.riskName = hc.project.riskName; return hc; });
      this.lovTable.refreshTable();
    });*/
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
        this.getQuoteListing();
        this.clearFields();

        this.qu = true;   
        this.hc = false;
        this.oc = false;       
        break;

      case 'hc':
        this.getHoldCovListing();
        this.clearFields();

        this.qu = false;
        this.hc = true;
        this.oc = false;
        break;
      
      case 'oc':
        this.clearFields();

        this.qu = false;
        this.hc = false;
        this.oc = true;
        break;
    }
  }

  showLOV() {
    // this.getQuoteListing();
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
        console.log(this.selected);

        // this.quoteService.getQuoteOptions(this.selected.quoteId).subscribe(data => {
        //   console.log(data);
        // });

        this.hcNo = this.selected.holdCover.holdCoverNo.split('-');
        this.optionId = this.selected.holdCover.optionId;
        this.condition = 'WALANG CONDITION!'
        this.cedingName = this.selected.cedingName;
        this.insuredDesc = this.selected.insuredDesc;
        this.riskName = this.selected.riskName;
      } else if (str === 'oc') {

      }
    } else {
      this.clearFields();
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
      "expiryDate"    : this.expiryDate + 'T' + this.expiryTime,
      "holdCoverNo"   : this.hc ? this.hcNo.join('-') : '',
      "inceptDate"    : this.inceptionDate + 'T' + this.inceptionTime,
      "openPolicyNo"  : this.oc ? this.ocNo.join('-') : '',
      "optionId"      : this.optionId,
      "quotationNo"   : this.qu ? this.quNo.join('-') : '',
      "createUser"    : JSON.parse(window.localStorage.currentUser).username,
      "createDate"    : this.ns.toDateTimeString(0),
      "updateUser"    : JSON.parse(window.localStorage.currentUser).username,
      "updateDate"    : this.ns.toDateTimeString(0)
    }

    console.log(savePolicyDetailsParam);
    this.underwritingService.savePolicyDetails(savePolicyDetailsParam).subscribe(data => {
      console.log(data);
    });
  }

  updateExpiryDate() {
    var d = new Date(this.inceptionDate);
    d.setFullYear(d.getFullYear() + 1);

    this.expiryDate = this.ns.toDateTimeString(d).split('T')[0];
  }

  getCutOffTime(ev) {
    var lineCd = ev.target.value;

    if(lineCd != '') {
      this.mtnService.getLineLOV(lineCd).subscribe(data => {
        var res = data['line'];

        if(res.length != 0) {
          this.inceptionTime = res[0].cutOffTime;
          this.expiryTime = res[0].cutOffTime;
        } else {
          this.inceptionTime = '';
          this.expiryTime = '';
        }
      });
    } else {
      this.inceptionTime = '';
      this.expiryTime = '';
    }
  }

  clearFields() {
    this.quNo = [];
    this.hcNo = [];
    this.ocNo = [];
    this.optionId = "";
    this.condition = "";
    this.cedingName = "";
    this.insuredDesc = "";
    this.riskName = "";
  }
}