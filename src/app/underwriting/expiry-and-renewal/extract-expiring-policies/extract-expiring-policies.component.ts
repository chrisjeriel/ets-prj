import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { ExpiryParameters, LastExtraction } from '../../../_models';
import { UnderwritingService, NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Router } from '@angular/router';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { highlight,unHighlight } from '@app/_directives/highlight';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-extract-expiring-policies',
  templateUrl: './extract-expiring-policies.component.html',
  styleUrls: ['./extract-expiring-policies.component.css']
})
export class ExtractExpiringPoliciesComponent implements OnInit {

  constructor(private underWritingService: UnderwritingService, public modalService: NgbModal, private titleService: Title, private ns: NotesService, private router: Router) { }

  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
  @ViewChild('ceding') cedingLov: CedingCompanyComponent;
  @ViewChild('extPolLov') lovTable: CustNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  @ViewChild('fromMonthEl') fromMonthEl :any;
  @ViewChild('fromYearEl') fromYearEl :any;
  @ViewChild('toMonthEl') toMonthEl :any;
  @ViewChild('toYearEl') toYearEl :any;
  
  expiryParameters: ExpiryParameters = new ExpiryParameters();
  lastExtraction: any;
  
  byDate: any = '';

  radioVal: any = 'bypolno';
  extractedPolicies: number = 0;
  cancelFlag:boolean;
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
  dialogIcon:string = '';
  dialogMessage:string;

  lastExtractInfo:any;

  errorYear:boolean = false;
  errorMonth:boolean = false;

  ngOnInit() {
    this.titleService.setTitle("Pol | Extract Expiring Policy");
    this.getPolListing();
    this.getLastExtractInfo();
  }

  extract() {
    // this.extractedPolicies = this.underWritingService.extractExpiringPolicies(this.expiryParameters);
    // bydate, bymoyo, bypolno    

    this.extractedPolicies = 0;
    console.log("this.expiryParameters : " + JSON.stringify(this.expiryParameters));
    $('.globalLoading').css('display','block');
    this.underWritingService.extractExpiringPolicies(this.expiryParameters).subscribe((data:any) => {
        console.log("extractExpiringPolicies: " + JSON.stringify(data));
        $('.globalLoading').css('display','none');
        if (data.errorList.length > 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          this.successDiag.open();
        } else {
          this.extractedPolicies = data['recordCount'];
          $('#extractMsgModal > #modalBtn').trigger('click');
          this.getPolListing();
          this.getLastExtractInfo();
        }
    });

  }

  getPolListing(param?) {
    this.lovTable.loadingFlag = true;
    if(param != undefined){
      param.push({key: 'statusArr' , search : ['2']});
    }

    var sub$ = forkJoin(this.underWritingService.getParListing(param === undefined ? [{key: 'statusArr' , search : ['2']}] : param),
                        this.underWritingService.getExpPolList(null)
                        ).pipe(map(([parListing, expList]) => { return { parListing, expList}}));

    sub$.subscribe(a => {
      var polList = a['parListing']['policyList'];
      var expList = a['expList']['expPolicyList'].map(a=>a.policyId);
      console.log(expList);
      console.log(polList.map(a=>a.policyId))
      polList = polList.filter(p => { p.riskName = p.project.riskName; return !expList.includes(p.policyId.toString()); });
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

  onRowClick(event) {    
    console.log(event)
    if(Object.entries(event).length === 0 && event.constructor === Object){
      this.selected = null;
    } else {
      this.selected = event;
    }    
  }

  showLOV() {
    $('#extPolLov > #modalBtn').trigger('click');
  }

  gotoExpiryListing() {
    this.router.navigate(['/expiry-listing', { }], { skipLocationChange: false });
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

      this.underWritingService.getPolGenInfo(this.policyId,null).subscribe((data:any)=>{
        console.log(data)
        this.lineCd = data.policy.lineCd;
        this.lineDescription = data.policy.lineCdDesc;
        this.typeOfCessionId = data.policy.cessionId;
        this.typeOfCession = data.policy.cessionDesc;
        this.cedingId = data.policy.cedingId;
        this.cedingName = data.policy.cedingName;
      });

      /*if(fromMdl !== undefined) {
        this.searchArr = this.polNo.map((a, i) => {
          return (i == 0) ? a + '%' : (i == this.polNo.length - 1) ? '%' + a : '%' + a + '%';
        });

        this.search('forceSearch',{ target: { value: '' } });
      }*/
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
    this.expiryParameters.extractUser      = this.ns.getCurrentUser(); 
  }

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
    this.expiryParameters.fromExpiryDate = "";
    this.expiryParameters.toExpiryDate = "";
    this.fromExpiryDate = "";
    this.toExpiryDate = "";
    this.fromMonth = null;
    this.fromYear = null;
    this.toMonth = null;
    this.toYear = null;
    unHighlight(this.fromMonthEl); 
    unHighlight(this.fromYearEl); 
    unHighlight(this.toMonthEl); 
    unHighlight(this.toYearEl); 

    this.lineCd = "";
    this.lineDescription = "";
    this.typeOfCessionId = "";
    this.typeOfCession = "";
    this.cedingId = "";
    this.cedingName = "";
    this.clearPolicyNo();
    this.errorYear = false;
    this.errorMonth = false;
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
            if(this.cedingId !== ''){
              this.cedingLov.checkCode(String(this.cedingId).padStart(3, '0'), ev);
            }else{
              this.cedingName = "";
              this.ns.lovLoader(ev,0);
            }        
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
    var proceedExtract = true;
    this.prepareExtractParameters();
    if (this.radioVal == 'bydate') {
      if ((this.expiryParameters.fromExpiryDate == null || this.expiryParameters.toExpiryDate == null) || (this.expiryParameters.fromExpiryDate == '' || this.expiryParameters.toExpiryDate == '')) {
        console.log("Extract : ");
        console.log(this.radioVal);
        console.log(this.expiryParameters.fromExpiryDate);
        console.log(this.expiryParameters.toExpiryDate);
        proceedExtract = false;
      }
    } else if (this.radioVal == 'bymoyo') {
      if ((this.fromYear == '' || this.fromYear == null || this.toYear == '' || this.toYear == null) || (this.fromMonth == '' || this.fromMonth == null || this.toMonth == '' || this.toMonth == null)) {
        console.log("Extract : ");
        console.log(this.radioVal);
        console.log(this.expiryParameters.fromExpiryDate);
        console.log(this.expiryParameters.toExpiryDate);
        proceedExtract = false;
      }
    } else if (this.radioVal == 'bypolno') {
        console.log("Extract : ");
        console.log(this.radioVal);
        console.log(" polLineCd : " + this.expiryParameters.polLineCd);
        console.log(" polYear : " + this.expiryParameters.polYear);
        console.log(" polSeqNo : " + this.expiryParameters.polSeqNo);
        console.log(" polCedingId : " + this.expiryParameters.polCedingId);
        console.log(" coSeriesNo : " + this.expiryParameters.coSeriesNo);
        console.log(" altNo : " + this.expiryParameters.altNo);


        if ((this.expiryParameters.polLineCd == '' &&
            this.expiryParameters.polYear == '' &&
            this.expiryParameters.polSeqNo == '' &&
            this.expiryParameters.polCedingId == '' &&
            this.expiryParameters.coSeriesNo == '' &&
            this.expiryParameters.altNo == '') || 
            (this.expiryParameters.polLineCd === undefined &&
            this.expiryParameters.polYear === undefined &&
            this.expiryParameters.polSeqNo === undefined &&
            this.expiryParameters.polCedingId === undefined &&
            this.expiryParameters.coSeriesNo === undefined &&
            this.expiryParameters.altNo === undefined))   {
          proceedExtract = false;
        }
    }

    if (proceedExtract && !this.errorMonth && !this.errorYear) {
      $('#extractModal > #modalBtn').trigger('click');
    }else if (this.errorYear || this.errorMonth){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Entered Month/Year range is invalid.';
      this.successDiag.open();
    } else {
      this.dialogIcon = "error";
      this.successDiag.open();
    }
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


  getLastExtractInfo(){
    this.underWritingService.getLastExtractInfo().subscribe(a=>{
      this.lastExtraction = a['info'];
      this.lastExtraction.extractionDate = this.ns.toDateTimeString(this.lastExtraction.extractionDate);
    })
  }

  checkYear(){
    if(parseInt(this.fromYear) > parseInt(this.toYear) && this.fromYear != '' && this.toYear != ''){
      highlight(this.fromYearEl);
      highlight(this.toYearEl);
      this.errorYear = true;
    }else{
      unHighlight(this.fromYearEl);
      unHighlight(this.toYearEl);
      this.errorYear = false;
    }
    this.checkMonth();
  }

  checkMonth(){
    if(this.fromYear == this.toYear && this.fromYear != '' && this.toYear != ''){
      if(parseInt(this.fromMonth) > parseInt(this.toMonth) && this.fromMonth != '' && this.toMonth != ''){
        highlight(this.fromMonthEl);
        highlight(this.toMonthEl);
        this.errorMonth = true;
      }else{
        unHighlight(this.fromMonthEl);
        unHighlight(this.toMonthEl);
        this.errorMonth = false;
      }
    }
  }
}
