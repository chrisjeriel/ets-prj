import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, QuotationService, NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent, ModalComponent } from '@app/_components/common';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';

@Component({
  selector: 'app-pol-create-par',
  templateUrl: './pol-create-par.component.html',
  styleUrls: ['./pol-create-par.component.css']
})
export class PolCreatePARComponent implements OnInit {
  @ViewChild('polLov') lovTable: CustNonDatatableComponent;
  @ViewChild('polOptionLov') lovOptTable: CustNonDatatableComponent;

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
  polNo: any[] = [];

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
    tHeader:["Option No", "Rate", "Condition"],  
    dataTypes: ["text","percent","text"],
    pageLength: 10,
    //resizable: [false,false],
    tableOnly: false,
    keys: ['optionId','optionRt','condition'],
    pageStatus: true,
    pagination: true,
    filters: [
    /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
    pageID: 'createPolOptionLov'
  }

  selected: any = null;
  selectedOption: any = null;
  quNo: any[] = [];
  hcNo: any[] = [];
  ocNo: any[] = [];
  optionId: any = "";
  optionRt: any = "";
  cedingName: any = "";
  insuredDesc: any = "";
  riskName: any = "";
  riskId: any = "";
  inceptionDate: any = "";
  inceptionTime: any = "";
  expiryDate: any = "";
  expiryTime: any = "";
  coinsGrpId:any = "";

  dialogMessage: any = "";
  policyId: any = "";
  policyNo: any = "";

  searchArr: any[] = [];
  filtSearch: any[] = [];
  noSelected: boolean = true;

  sub:any;

  disabledConvert:boolean = false;

  constructor(private underwritingService: UnderwritingService, public modalService: NgbModal, private router: Router,
              private titleService: Title, private quoteService: QuotationService, private ns: NotesService, private mtnService: MaintenanceService) {

  }

  ngOnInit() {    
    this.getQuoteListing();

    this.inceptionDate = this.ns.toDateTimeString(0).split('T')[0];

    var d = new Date();
    d.setFullYear(d.getFullYear() + 1);

    this.expiryDate = this.ns.toDateTimeString(d).split('T')[0];
    this.toggle('qu');
  }

  getQuoteListing(param?) {
    this.lovTable.loadingFlag = true;
/*<<<<<<< HEAD*/
    let params = {mode:'createPol'}
    if(param != undefined){
      // params = params.concat(param);
      for(let p of param){
        params[p['key']] = p['search'];
      }
    }
    this.sub = this.quoteService.getQuoteListLOV(params).subscribe(data => {
/*=======
    
    this.sub = this.quoteService.getQuoProcessingData(param === undefined ? [] : param).subscribe(data => {
      console.log(data)
>>>>>>> 1990f3a3cedd9699648b1e0786568085c682f7e7*/
      this.quotationList = data['quotationList'];
      this.passDataLOV.tHeader = ['Quotation No', 'Ceding Company', 'Insured', 'Risk'];
      this.passDataLOV.keys = ['quotationNo','cedingName','insuredDesc','riskName'];
      this.passDataLOV.filters = [{key: 'quotationNo', title: 'Quotation No', dataType: 'text'},
                                  {key: 'cedingName',  title: 'Ceding Co',    dataType: 'text'},
                                  {key: 'insuredDesc', title: 'Insured',      dataType: 'text'},
                                  {key: 'riskName',    title: 'Risk',         dataType: 'text'}];

      this.quotationList = this.quotationList.map(qu => {qu.project != null ? qu.riskName = qu.project.riskName : ''; return qu; });
      this.passDataLOV.tableData = this.quotationList;
      this.lovTable.refreshTable();

      if(param !== undefined) {
        if(this.quotationList.length == 1 && this.quNo.length == 5 && !this.searchArr.includes('%%')) {  
          this.selected = this.quotationList[0];
          this.setDetails();
          this.noSelected = false;
        } 
        // else if(this.quotationList.length == 0 && this.quNo.length == 5 && !this.searchArr.includes('%%')) {
        //   this.clearFields();
        //   this.getQuoteListing();
        //   this.showLOV();
        // } 
        else if(this.quotationList.length == 0 && this.searchArr.includes('%%')) {
          this.getQuoteListing();
        } else if(this.searchArr.includes('%%')) {
          this.optionId = '';
          this.optionRt = '';
          this.cedingName = '';
          this.insuredDesc = '';
          this.riskName = '';
        }
      }
    });    

  }

  getOptionLOV(quoteId) {
    this.quoteService.getQuoteOptions(quoteId).subscribe(data => {
      var options = data['quotation']['optionsList'];
      this.passDataOptionLOV.tableData = options;

      this.lovOptTable.refreshTable();
      this.noSelected = false;

      if(options.length === 1) {
        this.selectedOption = options[0];
        this.setOption();
      } else {
        this.optionId = '';
        this.optionRt = '';
      }
    });
  }

  getHoldCovListing(param?) {
    this.lovTable.loadingFlag = true;
    
    this.sub = this.quoteService.getQuotationHoldCoverList(param === undefined ? [] : param).subscribe(data => {
      this.holCovList = data['quotationList'];
      this.passDataLOV.tHeader = ['Hold Cover No', 'Ceding Company', 'Insured', 'Risk'];
      this.passDataLOV.keys = ['holdCoverNo','cedingName','insuredDesc','riskName'];
      this.passDataLOV.filters = [{key: 'holdCoverNo', title: 'Hold Cov No',  dataType: 'text'},
                                  {key: 'cedingName',  title: 'Ceding Co',    dataType: 'text'},
                                  {key: 'insuredDesc', title: 'Insured',      dataType: 'text'},
                                  {key: 'riskName',    title: 'Risk',         dataType: 'text'}];

      this.holCovList = this.holCovList.filter(hc => hc.holdCover.status.toUpperCase() === 'EXPIRED')
                                       .map(hc => { hc.riskName = hc.project.riskName; 
                                                    hc.holdCoverNo = hc.holdCover.holdCoverNo;
                                                    return hc; });
      this.passDataLOV.tableData = this.holCovList;
      this.lovTable.refreshTable();

      if(param !== undefined) {
        if(this.holCovList.length === 1 && this.hcNo.length == 5 && !this.searchArr.includes('%%')) {  
          this.selected = this.holCovList[0];
          this.setDetails();
        } 
        // else if(this.holCovList.length === 0 && this.hcNo.length == 5 && !this.searchArr.includes('%%')) {
        //   this.clearFields();
        //   this.getHoldCovListing();
        //   this.showLOV();
        // } 
        else if(this.holCovList.length == 0 && this.searchArr.includes('%%')) {
          this.getQuoteListing();
        } else if(this.searchArr.includes('%%')) {
          this.optionId = '';
          this.optionRt = '';
          this.cedingName = '';
          this.insuredDesc = '';
          this.riskName = '';
        }
      }
    });
  }

  getPolOCListing(param?) {
    this.lovTable.loadingFlag = true;

    
    this.sub = this.underwritingService.getPolListingOc(param === undefined ? [] : param).subscribe(data => {
      this.polOcList = data['policyList'];
      this.passDataLOV.tHeader = ['Open Cover Policy No', 'Ceding Company', 'Insured', 'Risk'];
      this.passDataLOV.keys = ['openPolicyNo','cedingName','insuredDesc','riskName'];
      this.passDataLOV.filters = [{key: 'policyNo',    title: 'Hold Cov No',  dataType: 'text'},
                                  {key: 'cedingName',  title: 'Ceding Co',    dataType: 'text'},
                                  {key: 'insuredDesc', title: 'Insured',      dataType: 'text'},
                                  {key: 'riskName',    title: 'Risk',         dataType: 'text'}];

      this.polOcList = this.polOcList.filter(oc => oc.statusDesc.toUpperCase() === 'IN FORCE')
                                     .map(oc => { oc.riskName = oc.project.riskName; return oc; });
      this.passDataLOV.tableData = this.polOcList;
      this.lovTable.refreshTable();

      if(param !== undefined) {
        if(this.polOcList.length === 1 && this.ocNo.length == 7 && !this.searchArr.includes('%%')) {  
          this.selected = this.polOcList[0];
          this.setDetails();
        } 
        // else if(this.polOcList.length === 0 && this.ocNo.length == 7 && !this.searchArr.includes('%%')) {
        //   this.clearFields();
        //   this.getPolOCListing();
        //   this.showLOV();
        // } 
        else if(this.polOcList.length == 0 && this.searchArr.includes('%%')) {
          this.getQuoteListing();
        } else if(this.searchArr.includes('%%')) {
          this.optionId = '';
          this.optionRt = '';
          this.cedingName = '';
          this.insuredDesc = '';
          this.riskName = '';
        }
      }
    });    
  }

  toggle(str) {
    $('.req').css('boxShadow', 'none');
    $('.req').focus(function() {
      $(this).css('boxShadow','0 0 0 0.2rem rgba(0, 123, 255, 0.25)');
    })
    if(this.sub != undefined && this.sub != null){
      this.sub.unsubscribe();
    }

    switch (str) {
      case 'qu':        
        this.getQuoteListing();
        this.clearFields();
        this.searchArr = Array(5).fill('');

        this.qu = true;   
        this.hc = false;
        this.oc = false;       
        break;

      case 'hc':
        this.getHoldCovListing();
        this.clearFields();
        this.searchArr = Array(5).fill('');
        this.hcNo[0] = 'HC';

        this.qu = false;
        this.hc = true;
        this.oc = false;
        break;
      
      case 'oc':
        this.getPolOCListing();
        this.clearFields();
        this.searchArr = Array(7).fill('');
        this.ocNo[0] = 'OC';

        this.qu = false;
        this.hc = false;
        this.oc = true;
        break;
    }
  }

  showLOV() {
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

  setDetails(fromMdl?) {
    if(this.selected != null) {
      if(this.qu) {
        this.quNo = this.selected.quotationNo.split('-');
        this.cedingName = this.selected.cedingName;
        this.insuredDesc = this.selected.insuredDesc;
        this.riskName = this.selected.riskName;

        this.getOptionLOV(this.selected.quoteId);
        this.noSelected = false;
        this.getCutOffTime({ target: { value: this.quNo[0] } });

        if(fromMdl !== undefined) {
          this.searchArr = this.quNo.map((a, i) => {
            return (i == 0) ? a + '%' : (i == this.quNo.length - 1) ? '%' + a : '%' + a + '%';
          });

          this.search('forceSearch',{ target: { value: '' } });
        }               
      } else if (this.hc) {
        this.hcNo = this.selected.holdCoverNo.split('-');
        this.optionId = this.selected.holdCover.optionId;
        this.optionRt = this.selected.holdCover.optionRt;
        this.cedingName = this.selected.cedingName;
        this.insuredDesc = this.selected.insuredDesc;
        this.riskName = this.selected.riskName;

        if(this.selected.holdCover.status.toUpperCase() === 'EXPIRED') {
          this.inceptionDate = this.ns.toDateTimeString(this.selected.holdCover.periodFrom).split('T')[0];
          this.inceptionTime = this.ns.toDateTimeString(this.selected.holdCover.periodFrom).split('T')[1];
          this.expiryDate = this.ns.toDateTimeString(this.selected.holdCover.periodTo).split('T')[0];
          this.expiryTime = this.ns.toDateTimeString(this.selected.holdCover.periodTo).split('T')[1];
        } else {
          this.inceptionDate = this.ns.toDateTimeString(0).split('T')[0];
          this.updateExpiryDate();
          this.getCutOffTime({ target: { value: this.hcNo[1] } });
        }

        if(fromMdl !== undefined) {
          this.searchArr = this.hcNo.map((a, i) => {
            return (i == 0) ? a + '%' : (i == this.hcNo.length - 1) ? '%' + a : '%' + a + '%';
          });

          this.search('forceSearch',{ target: { value: '' } });
        }
        
      } else if (this.oc) {
        this.ocNo = this.selected.openPolicyNo.split('-');
        this.optionId = this.selected.optionId;
        this.optionRt = this.selected.optionRt;
        this.cedingName = this.selected.cedingName;
        this.insuredDesc = this.selected.insuredDesc;
        // this.riskName = this.selected.project.riskName; //update
        // this.riskId = this.selected.project.riskId;

        this.getCutOffTime({ target: { value: this.ocNo[1] } });

        if(fromMdl !== undefined) {
          this.searchArr = this.ocNo.map((a, i) => {
            return (i == 0) ? a + '%' : (i == this.ocNo.length - 1) ? '%' + a : '%' + a + '%';
          });

          this.search('forceSearch',{ target: { value: '' } });
        }
      }
      
      this.focusBlur();
    } else {
      this.clearFields();
    }
    
  }

  setOption() {
    if(this.selectedOption != null) {
      this.optionId = this.selectedOption.optionId;
      this.optionRt = this.selectedOption.optionRt;
    }

    this.focusBlur();
  }

  prepareParam() {    
    var savePolicyDetailsParam = { 
      "checkingType"  : 'normal',
      "expiryDate"    : this.expiryDate + 'T' + this.expiryTime,
      "holdCoverNo"   : this.hc ? this.hcNo.join('-') : '',
      "inceptDate"    : this.inceptionDate + 'T' + this.inceptionTime,
      "lineCd"        : this.qu ? this.quNo[0] : this.hc ? this.hcNo[1] : this.ocNo[1],
      "openPolicyNo"  : this.oc ? this.ocNo.join('-') : '',
      "optionId"      : this.optionId,
      "quotationNo"   : this.qu ? this.quNo.join('-') : '',
      "createUser"    : this.ns.getCurrentUser(),
      "createDate"    : this.ns.toDateTimeString(0),
      "updateUser"    : this.ns.getCurrentUser(),
      "updateDate"    : this.ns.toDateTimeString(0),
      "riskId"        : this.riskId,
      "coinsGrpId"    : this.coinsGrpId

    }

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
    this.hcNo[0] = 'HC';
    this.ocNo = [];
    this.ocNo[0] = 'OC';
    this.optionId = "";
    this.optionRt = "";
    this.cedingName = "";
    this.insuredDesc = "";
    this.riskName = "";
    this.riskId = "";
    this.inceptionTime = "";
    this.expiryTime = "";
    this.noSelected = true;
    this.coinsGrpId = "";
    this.polNo   = [];
  }

  toPolGenInfo() {
    var line = this.policyNo.split('-')[0];

    this.underwritingService.toPolInfo = [];
    this.underwritingService.toPolInfo.push("edit", line);
    this.underwritingService.fromCreateAlt = false;
    this.router.navigate(['/policy-issuance', { line: line, policyNo: this.policyNo, policyId: this.policyId, editPol: true }], { skipLocationChange: true });
  }

  validate(obj) {
    var entries = Object.entries(obj);

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
    if(this.oc && !(this.riskId+'')){
      console.log(this.riskId)
      return false;
    }else if(this.oc && !this.coinsGrpId && this.polNo.some(a=>!!a) ){
      return false;
    }
    return true;
  }

  onClickConvert(cancelFlag?) {
    // console.log(this.validate(this.prepareParams()));
    // this.cancelFlag = cancelFlag !== undefined;
    this.loading = true;
    this.disabledConvert = true;
    if(this.validate(this.prepareParam())){
      this.disabledConvert = true;
      this.underwritingService.savePolicyDetails(this.prepareParam()).subscribe(data => {
        this.loading = false;
        if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;

          $('#createPol #successModalBtn').trigger('click');
        } else if (data['returnCode'] === -1) {     
          this.policyId = data['policyId'];
          this.policyNo = data['policyNo'];

          $('#convSuccessModal > #modalBtn').trigger('click');
        }
        this.disabledConvert = false; 
        
        // else if (data['coInsStatus'] === 1) {
        //   $('#convWarningModal > #modalBtn').trigger('click');
        // }
      });
    } else {

      this.loading = false;
      this.dialogMessage = "Please complete all the required fields.";
      $('#createPol #successModalBtn').trigger('click');
      setTimeout(() => {
        $('.globalLoading').css('display','none');
        this.focusBlur();
      },0);
    }
  }

  search(key,ev) {
    var a = ev.target.value;

    if(this.qu) {      
      this.noSelected = true;

      if(key === 'lineCd') {
        this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
      } else if(key === 'year') {
        this.searchArr[1] = '%' + a + '%';
      } else if(key === 'seqNo') {
        this.searchArr[2] = a == '' ? '%%' : '%' + String(a).padStart(5, '0') + '%';
      } else if(key === 'revNo') {
        this.searchArr[3] = a == '' ? '%%' : '%' + String(a).padStart(2, '0') + '%';
      } else if(key === 'cedingId') {
        this.searchArr[4] = a == '' ? '%%' : '%' + String(a).padStart(3, '0');
      }

      if(this.searchArr.includes('')) {
        this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
      }

      this.getQuoteListing([{ key: 'quotationNo', search: this.searchArr.join('-') }]);
    } else if(this.hc) {
      this.searchArr[0] = 'HC%';

      if(key === 'hc') {
        this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
      } else if(key === 'lineCd') {
        this.searchArr[1] = '%' + a.toUpperCase() + '%';
      } else if(key === 'year') {
        this.searchArr[2] = '%' + a + '%';
      } else if(key === 'seqNo') {
        this.searchArr[3] = a == '' ? '%%' : '%' + String(a).padStart(5, '0') + '%';
      } else if(key === 'revNo') {
        this.searchArr[4] = a == '' ? '%%' : '%' + a;
      }

      if(this.searchArr.includes('')) {
        this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
      }

      this.getHoldCovListing([{ key: 'holdCoverNo', search: this.searchArr.join('-') }]);
    } else {
      this.searchArr[0] = 'OC%';

      if(key === 'oc') {
        this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
      } else if(key === 'lineCd') {
        this.searchArr[1] = '%' + a.toUpperCase() + '%';
      } else if(key === 'year') {
        this.searchArr[2] = '%' + a + '%';
      } else if(key === 'seqNo') {
        this.searchArr[3] = a == '' ? '%%' : '%' + String(a).padStart(5, '0') + '%';
      } else if(key === 'cedingId') {
        this.searchArr[4] = a == '' ? '%%' : '%' + String(a).padStart(3, '0') + '%';
      } else if(key === 'coSeriesNo') {
        this.searchArr[5] = a == '' ? '%%' : '%' + String(a).padStart(4, '0') + '%';
      } else if(key === 'altNo') {
        this.searchArr[6] = a == '' ? '%%' : '%' + String(a).padStart(3, '0');
      }

      if(this.searchArr.includes('')) {
        this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
      }

      this.getPolOCListing([{ key: 'policyNo', search: this.searchArr.join('-') }]);
    }

  }

  searchQuery(searchParams){
    this.filtSearch = searchParams;
    this.passDataLOV.tableData = [];
    if(this.qu) {
      this.getQuoteListing(this.filtSearch);
    } else if(this.hc) {
      this.getHoldCovListing(this.filtSearch);
    } else {
      this.getPolOCListing(this.filtSearch);
    }    
  }

  focusBlur() {
    // setTimeout(() => {
    //   $('.req').focus();
    //   $('.req').blur();
    // },0);
  }

  pad(ev,num) {
    var str = ev.target.value;    

    return str === '' ? '' : String(str).padStart(num, '0');
  }

  checkCode(ev) {
    if(this.optionId === '') {
        this.optionId = '';
        this.optionRt = '';
      } else {
        this.ns.lovLoader(ev, 1);

        this.quoteService.getQuoteOptions(this.selected.quoteId).subscribe(data => {
          var options = data['quotation']['optionsList'];

            
          options = options.filter(opt => opt.optionId == this.optionId);

          if(options.length == 1) {
            this.optionId = options[0].optionId;
            this.optionRt = options[0].optionRt;
          } else {
            this.optionId = '';
            this.optionRt = '';

            this.showOptionLOV();
          }
             

          this.ns.lovLoader(ev, 0);
        });
      }
  }

  //EDIT BY PAUL 02/05/2020
  //CO-INSURANCE FROM OPEN COVER POLICY

  passDataPolOcLov: any = {
    tableData: [],
    tHeader:["Policy No.", "Open Policy No.", "Risk"],  
    dataTypes: ["text","text","text"],
    pageLength: 10,
    //resizable: [false,false],
    tableOnly: false,
    keys: ['policyNo','policyNoOc','riskName'],
    pageStatus: true,
    pagination: true,
    filters: [
    /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
    pageID: 'PolOcLov'
  }
  searchParamsPolOcLov:any = {
    'paginationRequest.count':10,
    'paginationRequest.position':1,   
  }

  @ViewChild('polOcLovTable') polOcLovTable : LoadingTableComponent;
  @ViewChild('PolOcLov') polOcLov : ModalComponent;

  showPolOcLOV(){
    this.polOcLov.openNoClose();
    this.searchParamsPolOcLov.lineCd = !this.polNo[0] ? '' : this.polNo[0];
    this.searchParamsPolOcLov.polYear = !this.polNo[1] ? '' : this.polNo[1];
    this.searchParamsPolOcLov.polSeqNo = !this.polNo[2] ? '' : this.polNo[2];
    this.searchParamsPolOcLov.cedingId = !this.polNo[3] ? '' : this.polNo[3];
    this.searchParamsPolOcLov.coSeriesNo = !this.polNo[4] ? '' : this.polNo[4];
    this.searchParamsPolOcLov.altNo = !this.polNo[5] ? '' : this.polNo[5];
    this.underwritingService.getPolOcListing(this.searchParamsPolOcLov).subscribe((a:any)=>{
      this.passDataPolOcLov.count = a.polList.length;
      this.polOcLovTable.placeData(a.polList);
    })
  }

  @ViewChild('riskLOV') riskLOV : MtnRiskComponent;
  showRiskLOV(){
    if(!(this.coinsGrpId+''))
      this.riskLOV.modal.openNoClose();
  }

  setRisks(data){
    this.riskId = data.riskId;
    this.riskName = data.riskName;
    this.ns.lovLoader(data.ev, 0);
  }

  checkCodeRisk(ev){
    this.ns.lovLoader(ev, 1);
    this.riskLOV.checkCode(this.riskId, '#riskLOV', ev);
  }

  setPolOcLov(){
    if(this.polOcLovTable.indvSelect != null){
      this.polNo = this.polOcLovTable.indvSelect.policyNo.split('-');
      this.coinsGrpId = this.polOcLovTable.indvSelect.coinsGrpId;
      this.riskName = this.polOcLovTable.indvSelect.riskName;
      this.riskId = this.polOcLovTable.indvSelect.riskId;
    }
  }

  filterPolOcLov(){
    if(this.polNo.every(a=>!!a) && this.polNo.length == 6 ){
      this.searchParamsPolOcLov.lineCd = !this.polNo[0] ? '' : this.polNo[0];
      this.searchParamsPolOcLov.polYear = !this.polNo[1] ? '' : this.polNo[1];
      this.searchParamsPolOcLov.polSeqNo = !this.polNo[2] ? '' : this.polNo[2];
      this.searchParamsPolOcLov.cedingId = !this.polNo[3] ? '' : this.polNo[3];
      this.searchParamsPolOcLov.coSeriesNo = !this.polNo[4] ? '' : this.polNo[4];
      this.searchParamsPolOcLov.altNo = !this.polNo[5] ? '' : this.polNo[5];
      this.underwritingService.getPolOcListing(this.searchParamsPolOcLov).subscribe((a:any)=>{
        if(a.polList.length == 1){
          this.coinsGrpId = a.polList[0].coinsGrpId;
          this.riskName = a.polList[0].riskName;
          this.riskId = a.polList[0].riskId;
        }else{
          this.polNo = [];
          this.coinsGrpId = "";
          this.showPolOcLOV();
        }
      })
    }else{  
      this.coinsGrpId = "";
    }
  }
}