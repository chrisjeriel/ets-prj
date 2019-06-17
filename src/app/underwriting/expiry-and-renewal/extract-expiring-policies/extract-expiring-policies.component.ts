import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { ExpiryParameters, LastExtraction } from '../../../_models';
import { UnderwritingService, NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-extract-expiring-policies',
  templateUrl: './extract-expiring-policies.component.html',
  styleUrls: ['./extract-expiring-policies.component.css']
})
export class ExtractExpiringPoliciesComponent implements OnInit {

  constructor(private underWritingService: UnderwritingService, private modalService: NgbModal, private titleService: Title, private ns: NotesService) { }

  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
  @ViewChild('ceding') cedingLov: CedingCompanyComponent;
  @ViewChild('extPolLov') lovTable: CustNonDatatableComponent;

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  lastExtraction: LastExtraction = new LastExtraction();
  
  byDate: any = '';

  radioVal: any = 'bypolno';
  extractedPolicies: number = 0;

  policyId:string = "";
  polLineCd: string = "";
  polYear:string = "";
  polSeqNo:string = "";
  polCedingId:string = "";
  coSeriesNo:string = "";
  altNo:string = "";
  fromExpiryDate:string = "";
  toExpiryDate:string = "";
  cessionType:string = "";
  extractUser:string = "";


  lineCd: string = "";
  lineDescription: string = "";
  typeOfCessionId: string = "";
  typeOfCession: string = "";
  cedingId: string = "";
  cedingName: string = "";

  fromMonth: string = "";
  fromYear: string = "";
  toMonth: string = "";
  toYear: string = "";

  polNo: any[] = [];

  passDataLOV: any = {
    tableData: [],
    tHeader:["Policy No", "Ceding Company", "Insured", "Risk","Inception Date","Expiry Date"],  
    dataTypes: ["text","text","text","text","date","date"],
    pageLength: 10,
    resizable: [false,false,false,false,false],
    tableOnly: false,
    keys: ['policyNo','cedingName','insuredDesc','riskName','inceptDate','expiryDate'],
    pageStatus: true,
    pagination: true,
    filters: [
    {key: 'policyNo', title: 'Policy No.', dataType: 'text'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'},
    { keys: {
            from: 'inceptDateFrom',
            to: 'inceptDateTo'
        }, title: 'Incept Date',         dataType: 'datespan'},
    { keys: {
            from: 'expiryDateFrom',
            to: 'expiryDateTo'
        }, title: 'Expiry Date',         dataType: 'datespan'},
    ],
    pageID: 'extPolLov'
  }

  selected: any = null;
  searchArr: any[] = Array(6).fill('');
  filtSearch: any[] = [];

  ngOnInit() {
    this.titleService.setTitle("Pol | Extract Expiring Policy");
    this.getPolListing();
  }

  extract() {
    // this.extractedPolicies = this.underWritingService.extractExpiringPolicies(this.expiryParameters);
    
    this.prepareExtractParameters();
    this.extractedPolicies = 0;
    console.log("this.expiryParameters : " + JSON.stringify(this.expiryParameters));

    this.underWritingService.extractExpiringPolicies(this.expiryParameters).subscribe(data => {
        console.log("extractExpiringPolicies: " + JSON.stringify(data));
        if (data['errorList'].length > 0) {

        } else {
          this.extractedPolicies = data['recordCount'];
          $('#extractMsgModal > #modalBtn').trigger('click');
        }
    });

  }

  getPolListing(param?) {
    if(this.radioVal == 'bypolno') {
      return;
    } else {
      this.lovTable.loadingFlag = true;
      this.underWritingService.getParListing(param === undefined ? [] : param).subscribe(data => {
        var polList = data['policyList'];

        polList = polList.filter(p => p.statusDesc.toUpperCase() === 'IN FORCE')
                         .map(p => { p.riskName = p.project.riskName; return p; });
        this.passDataLOV.tableData = polList;
        this.lovTable.refreshTable();

        if(param !== undefined) {
          if(polList.length === 1 && this.polNo.length == 6 && !this.searchArr.includes('%%')) {  
            this.selected = polList[0];
            this.setDetails();
          } else if(polList.length === 0 && this.polNo.length == 6 && !this.searchArr.includes('%%')) {
            this.selected = null;
            this.searchArr = Array(6).fill('');
            this.polNo = Array(6).fill('');
            this.getPolListing();
            this.showLOV();
          } else if(polList.length === 0 && this.searchArr.includes('%%')) {
            this.getPolListing();
          } else if(this.searchArr.includes('%%')) {
            this.selected = null;
          }
        }
      });
    }
  }

  onRowClick(event) {    
    if(Object.entries(event).length === 0 && event.constructor === Object){
      this.selected = null;
    } else {
      this.selected = event;
    }    
  }

  showLOV() {
    $('#extPolLov > #modalBtn').trigger('click');
  }

  searchQuery(searchParams){
    this.filtSearch = searchParams;
    this.passDataLOV.tableData = [];
    this.getPolListing(this.filtSearch);
  }

  setDetails(fromMdl?) {
    if(this.selected != null) {
      this.policyId = this.selected.policyId;
      this.polNo = this.selected.policyNo.split('-');

      if(fromMdl !== undefined) {
        this.searchArr = this.polNo.map((a, i) => {
          return (i == 0) ? a + '%' : (i == this.polNo.length - 1) ? '%' + a : '%' + a + '%';
        });

        this.search('forceSearch',{ target: { value: '' } });
      }
    }
  }

  search(key,ev) {
    if(!this.searchArr.includes('%%')) {
      this.selected = null;
    }

    var a = ev.target.value;

    if(key === 'lineCd') {
      this.searchArr[0] = a == '' ? '%%' : a.toUpperCase() + '%';
    } else if(key === 'year') {
      this.searchArr[1] = '%' + a + '%';
    } else if(key === 'seqNo') {
      this.searchArr[2] = a == '' ? '%%' : '%' + String(a).padStart(5, '0') + '%';
    } else if(key === 'cedingId') {
      this.searchArr[3] = a == '' ? '%%' : '%' + String(a).padStart(3, '0') + '%';
    } else if(key === 'coSeriesNo') {
      this.searchArr[4] = a == '' ? '%%' : '%' + String(a).padStart(4, '0') + '%';
    } else if(key === 'altNo') {
      this.searchArr[5] = a == '' ? '%%' : '%' + String(a).padStart(3, '0');
    }

    if(this.searchArr.includes('')) {
      this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
    }
    
    this.getPolListing([{ key: 'policyNo', search: this.searchArr.join('-') }]);
  }

  prepareExtractParameters() {
    this.expiryParameters.policyId         = this.radioVal == 'bypolno' ? this.policyId : '';
    this.expiryParameters.polLineCd        = this.radioVal == 'bypolno' ? this.polNo[0] : '';
    this.expiryParameters.polYear          = this.radioVal == 'bypolno' ? this.polNo[1] : '';
    this.expiryParameters.polSeqNo         = this.radioVal == 'bypolno' ? this.polNo[2] : '';
    this.expiryParameters.polCedingId      = this.radioVal == 'bypolno' ? this.polNo[3] : '';
    this.expiryParameters.coSeriesNo       = this.radioVal == 'bypolno' ? this.polNo[4] : '';
    this.expiryParameters.altNo            = this.radioVal == 'bypolno' ? this.polNo[5] : '';
    this.expiryParameters.fromExpiryDate   = this.radioVal == 'bydate' ? this.fromExpiryDate : this.radioVal == 'bymoyo' ? this.getFromAndToMon('from') : ''; 
    this.expiryParameters.toExpiryDate     = this.radioVal == 'bydate' ? this.toExpiryDate : this.radioVal == 'bymoyo' ? this.getFromAndToMon('to') : ''; 
    this.expiryParameters.lineCd           = this.lineCd; 
    this.expiryParameters.cedingId         = this.cedingId; 
    this.expiryParameters.cessionType      = this.typeOfCessionId; 
    this.expiryParameters.extractUser      = JSON.parse(window.localStorage.currentUser).username; 
  }

  /*
  policyId:string;
  lineCd:string;
  polYear:string;
  polSeqNo:string;
  polCedingId:string;
  coSeriesNo:string;
  altNo:string;
  fromExpiryDate:string;
  toExpiryDate:string;
  cedingId:string;
  cessionType:string;
  extractUser:string;
  */

  clearPolicyNo() {
    this.polNo = [];
    this.searchArr = Array(6).fill('');
    this.expiryParameters.polLineCd = null;
    this.expiryParameters.polYear = null;
    this.expiryParameters.polSeqNo = null;
    this.expiryParameters.polCedingId = null;
    this.expiryParameters.coSeriesNo = null;
    this.expiryParameters.altNo = null;
  }

  clearDates() {
    this.fromExpiryDate = "";
    this.toExpiryDate = "";
    this.fromMonth = null;
    this.fromYear = null;
    this.toMonth = null;
    this.toYear = null;
    this.clearPolicyNo();
  }

  clearOptionals() {
    this.lineCd = null;
    this.typeOfCessionId = null;
    this.cedingId = null;
    this.lineDescription = null;
    this.typeOfCession = null;
    this.cedingName = null;
  }

  clearAll() {
    this.clearDates();
    this.clearPolicyNo();
    this.clearOptionals();
  }

  checkCode(ev, field){
        this.ns.lovLoader(ev, 1);

        if(field === 'line') {            
            this.lineLov.checkCode(this.lineCd, ev);
        } else if(field === 'typeOfCession'){
            this.typeOfCessionLov.checkCode(this.typeOfCessionId, ev);
        } else if(field === 'cedingCo') {
            this.cedingLov.checkCode(String(this.cedingId).padStart(3, '0'), ev);            
        } /*else if(field === 'risk') {
            this.riskLOV.checkCode(this.riskCd, '#riskLOV', ev);
        } else if(field === 'copyRisk') {
            this.copyRiskLOV.checkCode(this.copyRiskId, '#copyRiskLOV', ev);
        }  else if(field === 'cedingCoIntComp') {
            this.cedingIntLov.checkCode(String(this.copyCedingId).padStart(3, '0'), ev);
        } */
    }

  showLineLOV(){
        // $('#lineLOV #modalBtn').trigger('click');
        this.lineLov.modal.openNoClose();
  }

  setLine(data){
        this.lineCd = data.lineCd;
        this.lineDescription = data.description;
        this.ns.lovLoader(data.ev, 0);
    }

  showTypeOfCessionLOV(){
    this.typeOfCessionLov.modal.openNoClose();
  }

  setTypeOfCession(data) {        
        this.typeOfCessionId = data.cessionId;
        this.typeOfCession = data.description;
        this.ns.lovLoader(data.ev, 0);
  }

  showCedingCompanyLOV() {
    this.cedingLov.modal.openNoClose();
  }

  setCedingcompany(data){
    this.cedingId = data.cedingId;
    this.cedingName = data.cedingName;
    this.ns.lovLoader(data.ev, 0);   
  }

  onClickExtract(){
    $('#extractModal > #modalBtn').trigger('click');
  }


  pad(str, num?) {
    var str = str.target.value;

    if(str === '' || str == null){
      return '';
    }
    
    return String(str).padStart(num != null ? num : 3, '0');
  }

  getFromAndToMon(str) {
    if(str == 'from') {
      return this.ns.toDateTimeString(new Date(Number(this.fromYear), Number(this.fromMonth)-1, 1)).split('T')[0];
    } else if(str == 'to') {
      return this.ns.toDateTimeString(new Date(Number(this.toYear), Number(this.toMonth), 0)).split('T')[0];
    }
  }
}
