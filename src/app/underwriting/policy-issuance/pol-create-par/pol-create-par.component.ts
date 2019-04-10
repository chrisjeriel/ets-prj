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
  loading: boolean = false;

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

  dialogMessage: any = "";
  policyId: any = "";
  policyNo: any = "";

  searchArr: any[] = [];

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

  getQuoteListing(param?) {
    this.quoteService.getQuoProcessingData(param === undefined ? [] : param).subscribe(data => {
      this.quotationList = data['quotationList'];
      this.passDataLOV.tHeader = ['Quotation No', 'Ceding Company', 'Insured', 'Risk'];
      this.passDataLOV.keys = ['quotationNo','cedingName','insuredDesc','riskName'];
      this.quotationList = this.quotationList.filter(qu => qu.status.toUpperCase() === 'RELEASED' )
                                             .map(qu => { qu.riskName = qu.project.riskName; return qu; });
      this.passDataLOV.tableData = this.quotationList;
      this.lovTable.refreshTable();

      if(param !== undefined) {
        if(this.quotationList.length === 1) {  
          this.selected = this.quotationList[0];
          this.setDetails();
        } else if(this.quotationList.length === 0) {
          this.clearFields();
          this.getQuoteListing(undefined);
          this.showLOV();
        }
      }
    });    

  }

  getOptionLOV(quoteId) {
    this.quoteService.getQuoteOptions(quoteId).subscribe(data => {
      this.passDataOptionLOV.tableData = data['quotation']['optionsList'];

      this.lovOptTable.refreshTable();
    });
  }

  getHoldCovListing(param?) {
    this.quoteService.getQuotationHoldCoverList([]).subscribe(data => {
      this.holCovList = data['quotationList'];
      this.passDataLOV.tHeader = ['Quotation No', 'Ceding Company', 'Insured', 'Risk'];
      this.passDataLOV.keys = ['quotationNo','cedingName','insuredDesc','riskName'];
      this.holCovList = this.holCovList.filter(hc => hc.holdCover.status.toUpperCase() === 'RELEASED' || hc.holdCover.status.toUpperCase() === 'EXPIRED')
                                       .map(hc => { hc.riskName = hc.project.riskName; return hc; });
      this.passDataLOV.tableData = this.holCovList;
      this.lovTable.refreshTable();

      if(param !== undefined) {
        if(this.holCovList.length === 1) {  
          this.selected = this.holCovList[0];
          this.setDetails();
        } else if(this.holCovList.length === 0) {
          this.clearFields();
          this.getHoldCovListing(undefined);
          this.showLOV();
        }
      }
    });
  }

  getPolOCListing() {
    this.underwritingService.getPolListingOc([]).subscribe(data => {
      console.log(data);
      this.polOcList = data['policyList'];
      this.passDataLOV.tHeader = ['Open Cover Policy No', 'Ceding Company', 'Insured', 'Risk'];
      this.passDataLOV.keys = ['openPolicyNo','cedingName','insuredDesc','riskName'];

      // this.passDataLOV.tableData = this.polOcList.filter(oc => oc.statusDesc.toUpperCase() === 'RELEASED')
      //                                            .map(oc => { oc.riskName = oc.project.riskName; return oc; });
      this.passDataLOV.tableData = data['policyList'].map(oc => { oc.riskName = oc.project.riskName; return oc; });;      
      this.lovTable.refreshTable();
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
    $('.req').css('boxShadow', 'none');
    $('.req').focus(function() {
      $(this).css('boxShadow','0 0 0 0.2rem rgba(0, 123, 255, 0.25)');
    })

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
        this.getPolOCListing();
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

  setDetails() {
    if(this.selected != null) {
      if(this.qu) {
        this.quNo = this.selected.quotationNo.split('-');
        this.cedingName = this.selected.cedingName;
        this.insuredDesc = this.selected.insuredDesc;
        this.riskName = this.selected.riskName;

        this.getOptionLOV(this.selected.quoteId);
        this.getCutOffTime({ target: { value: this.quNo[0] } });
      } else if (this.hc) {       
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

        this.getCutOffTime({ target: { value: this.hcNo[0] } });
      } else if (this.oc) {
        this.ocNo = this.selected.openPolicyNo.split('-');
        this.optionId = this.selected.optionId;
        this.condition = this.selected.condition;
        this.cedingName = this.selected.cedingName;
        this.insuredDesc = this.selected.insuredDesc;
        this.riskName = this.selected.project.riskName; //update

        this.getCutOffTime({ target: { value: this.ocNo[1] } });
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

  prepareParam() {    
    var savePolicyDetailsParam = {    
      "expiryDate"    : this.expiryDate + 'T' + this.expiryTime,
      "holdCoverNo"   : this.hc ? this.hcNo.join('-') : '',
      "inceptDate"    : this.inceptionDate + 'T' + this.inceptionTime,
      "lineCd"        : this.qu ? this.quNo[0] : this.hc ? this.hcNo[0] : this.ocNo[1],
      "openPolicyNo"  : this.oc ? this.ocNo.join('-') : '',
      "optionId"      : this.optionId,
      "quotationNo"   : this.qu ? this.quNo.join('-') : '',
      "createUser"    : JSON.parse(window.localStorage.currentUser).username,
      "createDate"    : this.ns.toDateTimeString(0),
      "updateUser"    : JSON.parse(window.localStorage.currentUser).username,
      "updateDate"    : this.ns.toDateTimeString(0)
    }

    console.log(savePolicyDetailsParam);
    return savePolicyDetailsParam;
    
    
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
    this.searchArr = [];
    this.quNo = [];
    this.hcNo = [];
    this.ocNo = [];
    this.optionId = "";
    this.condition = "";
    this.cedingName = "";
    this.insuredDesc = "";
    this.riskName = "";
    this.inceptionTime = "";
    this.expiryTime = "";
  }

  toPolGenInfo() {
    var line = this.policyNo.split('-')[0];

    this.underwritingService.toPolInfo = [];
    this.underwritingService.toPolInfo.push("edit", line);
    this.router.navigate(['/policy-issuance', { line: line, policyNo: this.policyNo, policyId: this.policyId, editPol: true }], { skipLocationChange: true });
  }

  validate(obj) {
    var entries = Object.entries(obj);
    console.log(entries);
    var ctr = 0;

    for(var [key, val] of entries) {
      if (this.qu && key === 'quotationNo' && String(val).split('-').includes('')) {
        return false;
      } else if (this.hc && key === 'holdCoverNo' && String(val).split('-').includes('')) {
        return false;
      } else if (this.oc && key === 'openPolicyNo' && String(val).split('-').includes('')) {
        return false;
      } else if (key === 'inceptDate' || key === 'expiryDate') {
        if (String(val).split('T')[0] === '' || String(val).split('T')[1] === '' || val === 'T') {
          return false;
        }
      } else if (key === 'optionId' && val === '') {
        return false;
      }
    }

    return true;
  }

  onClickConvert(cancelFlag?) {
    // console.log(this.validate(this.prepareParams()));
    // this.cancelFlag = cancelFlag !== undefined;
    this.loading = true;

    if(this.validate(this.prepareParam())){
      this.underwritingService.savePolicyDetails(this.prepareParam()).subscribe(data => {
        this.loading = false;
        console.log(data);
        if(data['returnCode'] === 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;

          $('#createPol #successModalBtn').trigger('click');
        } else if (data['returnCode'] === -1) {     
          this.policyId = data['policyId'];
          this.policyNo = data['policyNo'];

          $('#convSuccessModal > #modalBtn').trigger('click');
        }
      });
    } else {
      this.loading = false;
      this.dialogMessage = "Please complete all the required fields.";
      $('#createPol #successModalBtn').trigger('click');
      setTimeout(() => {
        $('.globalLoading').css('display','none');
        $('.req').focus();
        $('.req').blur();
      },0);
    }
  }

  search(key,ev) {
    var a = ev.target.value;

    if(this.qu || this.hc) {
      if(key === 'lineCd') {
        this.searchArr[0] = a.toUpperCase() + '%';
      } else if(key === 'year') {
        this.searchArr[1] = '%' + a.toUpperCase() + '%';
      } else if(key === 'seqNo') {
        this.searchArr[2] = '%' + a.toUpperCase() + '%';
      } else if(key === 'revNo') {
        this.searchArr[3] = '%' + a.toUpperCase() + '%';
      } else if(key === 'cedingId') {
        this.searchArr[4] = '%' + a.toUpperCase();
      }

      if(this.qu) {
        this.getQuoteListing([{ key: 'quotationNo', search: this.searchArr.join('') }]);  
      } else {
        this.getHoldCovListing([{ key: 'holdCoverNo', search: this.searchArr.join('') }]);       
      }
      
    } else {

    }

  }

}