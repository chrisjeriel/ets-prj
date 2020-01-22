import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, PrintService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-policy-reports',
  templateUrl: './policy-reports.component.html',
  styleUrls: ['./policy-reports.component.css']
})

export class PolicyReportsComponent implements OnInit {
  
  @ViewChild (CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild('ceding') cedingLov: CedingCompanyComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild('polReportsModal') polReportsModal: ModalComponent;
  @ViewChild('appDialog') appDialog: SucessDialogComponent;
  
  passLov: any = {
    selector: 'mtnReport',
    reportId: '',
    hide: []
  }

  params :any = {
    dateRange: '',
    dateParam:'',
  	reportName : '',
    byDateFrom:'',
    byDateTo:'',
    byAsOf:'',
  	reportId : '',
    lineCd: '',
    lineName: '',
    destination: '',
    cedingId: '',
    cedingName: '',
    alteration: '',
    incRecTag: '',
    byMonthFrom: '',
    byMonthFromYear: '',
    byMonthTo : '',
    byMonthToYear: ''
  }

  sendData: any = {
    extractUser: JSON.parse(window.localStorage.currentUser).username,
    dateRange: '',
    dateParam:'',
    fromDate: '',
    toDate: '',
    cedingIdParam: '',
    lineCdParam: '',
    incRecTag: '',
    reportId : '',
    destination: '',
    forceExtract: 'N',
  };

  repExtractions: Array<string> = [
                        'POLR044A',
                        'POLR044B',
                        'POLR044C',
                        'POLR044D',
                        'POLR044E',
                        'POLR044F',
                        'POLR044G',
                        'POLR044H',
                        'POLR044I',
                        'POLR044J',
                        'POLR044K',
                        'POLR044L',
                        'POLR044M',
                        'POLR044N',
                        'POLR044O',
                        'POLR044P',
                        'POLR044Q',
                        'POLR044R',
                        'POLR044S',
                        'POLR044T',
                        'POLR044U',
                        'ACITR061F',
                        'ACITR061G',
                        'ACITR048A'
                        ];

  paramsToggle: Array<string> = [];

  extractDisabled: boolean = true;
  modalHeader: string = "";
  modalBody: string = "";
  dialogIcon: string = "";
  dialogMessage: string = "";
  modalMode: string = "";
  loading: boolean = true;
  disableTo: boolean = false;

  constructor(private ms: MaintenanceService, private ns: NotesService, private printService: PrintService, public modalService: NgbModal) { }

  ngOnInit() {
      this.passLov.modReportId = 'POLR044%';
      this.loading = false;
  }

  getReports(){
    this.passLov.reportId = 'POLR044%';
  	this.lovMdl.openLOV();
  }

  setReport(data){
    setTimeout(()=>{
      $('.reports').focus().blur();
    },0);
    this.paramsToggle = [];
    this.params = [];
  	console.log(data.data);
    if(data.data != null){
    	this.params.reportId = data.data.reportId;
    	this.params.reportName = data.data.reportTitle;
    }

    if (this.repExtractions.indexOf(this.params.reportId) > -1) {
      this.extractDisabled = false;
    } else {
      this.extractDisabled = true;
    }

      // this.paramsToggle.push('issueDate');
      // this.paramsToggle.push('lossDate');
      // this.paramsToggle.push('distributionDate');
      // this.paramsToggle.push('tranDate');
      // this.paramsToggle.push('postingDate');
      // this.paramsToggle.push('createDate');
      // this.paramsToggle.push('effectiveDate');
      // this.paramsToggle.push('accountingDate');
      // this.paramsToggle.push('line');
      // this.paramsToggle.push('company');
      // this.paramsToggle.push('policy');
      // this.paramsToggle.push('alteration');
      // this.paramsToggle.push('policyAlteration');
      // this.paramsToggle.push('distributed');
      // this.paramsToggle.push('undistributed');
      // this.paramsToggle.push('byDate');
      // this.paramsToggle.push('byMonthYear');
      // this.paramsToggle.push('asOf');

    if(this.params.reportId == 'POLR044A'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company');
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044B'){
      this.paramsToggle.push('byDate', 'byMonthYear', 'line', 'company');
    }
    else if(this.params.reportId == 'POLR044C'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company');
      this.params.dateParam = '5';
    }
    else if(this.params.reportId == 'POLR044D'){
      this.paramsToggle.push('bookingDate', 'accountingDate', 'asOf', 'line', 'company');
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044E'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company');
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044F'){
      this.paramsToggle.push('bookingDate', 'accountingDate', 'line', 'company', 'byMonthYear');
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044G'){
      this.paramsToggle.push('line', 'company','byMonthYear', 'bookingDate', 'accountingDate');
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044H'){
      this.paramsToggle.push('bookingDate', 'accountingDate', 'line', 'company', 'byDate', 'byMonthYear');
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044I'){
      this.paramsToggle.push('line', 'company', 'asOf');
    } 
    else if(this.params.reportId == 'POLR044J'){
      this.paramsToggle.push('accountingDate', 
                             'line', 'company', 'byMonthYear', 'distributed', 'undistributed');
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044J_ISS'){
      this.paramsToggle.push('accountingDate', 'line', 'company', 'byMonthYear', 'distributed', 'undistributed');
      this.params.dateParam = '5';
    }
    else if(this.params.reportId == 'POLR044J_RET'){
      this.paramsToggle.push('accountingDate', 'line', 'company', 'byMonthYear', 'distributed', 'undistributed');
      this.params.dateParam = '5';
    }
    else if(this.params.reportId == 'POLR044K'){
      this.paramsToggle.push('accountingDate', 'line', 'company', 'byDate', 'byMonthYear');
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044L'){
      this.paramsToggle.push('bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'undistributed', 
                             'policy', 'alteration', 'policyAlteration', 'undistributed');
      this.params.dateParam = '10';
    } 
    else if(this.params.reportId == 'POLR044M'){
      this.paramsToggle.push('line', 'company', 'asOf');
      this.params.dateRange = '3';
    } 
    else if(this.params.reportId == 'POLR044N'){
      this.paramsToggle.push('issueDate', 'createDate', 'effectiveDate', 'bookingDate', 'accountingDate',
                             'line', 'company', 'asOf', 'distributed', 'undistributed');
      this.params.dateRange = '3';
    } 
    else if(this.params.reportId == 'POLR044O'){
      this.paramsToggle.push('byDate', 'byMonthYear');
    } 
    else if(this.params.reportId == 'POLR044P'){
      this.paramsToggle.push('line', 'company', 'asOf');
      this.params.dateRange = '3';
    } 
    else if(this.params.reportId == 'POLR044Q'){
      this.paramsToggle.push('asOf');
      this.params.dateRange = '3';
    } 
    else if(this.params.reportId == 'POLR044R'){
      this.paramsToggle.push('line', 'company', 'byDate', 'byMonthYear');
    } 
    else if(this.params.reportId == 'POLR044S'){
      this.paramsToggle.push('line', 'company', 'byDate', 'byMonthYear');
    } 
    else if(this.params.reportId == 'POLR044T'){
      this.paramsToggle.push('line', 'company', 'byDate', 'byMonthYear');
    }
    else if(this.params.reportId == 'POLR044U'){
      this.paramsToggle.push('line', 'company', 'byDate', 'byMonthYear');
    }  
    else if(this.params.reportId == 'ACITR061F'){
      this.paramsToggle.push('issueDate', 'createDate', 'effectiveDate', 'bookingDate', 'accountingDate', 'distributed', 'undistributed',
                             'byDate', 'byMonthYear', 'asOf', );
    } 
    else if(this.params.reportId == 'ACITR061G'){
      this.paramsToggle.push('issueDate', 'lossDate', 'distributionDate', 'tranDate', 'postingDate',
                             'createDate', 'effectiveDate', 'accountingDate', 'byDate', 'byMonthYear',
                             'asOf');
    } 
    else if(this.params.reportId == 'POLR044V'){
      this.paramsToggle.push('issueDate', 'lossDate', 'distributionDate', 'tranDate', 'postingDate',
                             'createDate', 'effectiveDate', 'accountingDate', 'line', 'company',
                             'policy', 'alteration', 'policyAlteration', 'distributed', 'undistributed',
                             'byDate', 'byMonthYear', 'asOf');
    }

    this.ns.lovLoader(data.ev, 0);
  }

  checkReport(){
    this.paramsToggle = [];
    if(this.params.reportId == 'POLR044C'){
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company', 'distributed', 'undistributed', 'alldistribution');
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company');
      }
    }else if(this.params.reportId == 'POLR044D'){
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company', 'distributed', 'undistributed', 'alldistribution');
        this.params.dateParam = '10';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company');
      }
    }else if(this.params.reportId == 'POLR044E'){
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company', 'distributed', 'undistributed', 'alldistribution');
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company');
      }
    }else if(this.params.reportId == 'POLR044F'){
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company', 'distributed', 'undistributed', 'alldistribution');
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company');
      }
    }else if(this.params.reportId == 'POLR044G'){
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company', 'distributed', 'undistributed', 'alldistribution');
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company');
      }
    }else if(this.params.reportId == 'POLR044H'){
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company', 'distributed', 'undistributed', 'alldistribution');
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company');
      }
    }
  }

  checkMonthYear(){
    this.disableTo = false;
    if(this.params.reportId == 'POLR044C'){
      if(this.params.dateRange == 2){
        this.disableTo = true;

        if(this.params.byMonthFrom !== '' && this.params.byMonthFromYear !== ''){
          this.params.byMonthTo = this.params.byMonthFrom;
          this.params.byMonthToYear = this.params.byMonthFromYear;
        }else{
          this.params.byMonthTo = '';
          this.params.byMonthToYear = '';
        }
      }
    }else if(this.params.reportId == 'POLR044E'){
      if(this.params.dateRange == 2){
        this.disableTo = true;

        if(this.params.byMonthFrom !== '' && this.params.byMonthFromYear !== ''){
          this.params.byMonthTo = this.params.byMonthFrom;
          this.params.byMonthToYear = this.params.byMonthFromYear;
        }else{
          this.params.byMonthTo = '';
          this.params.byMonthToYear = '';
        }
      }
    }else if(this.params.reportId == 'POLR044F'){
      if(this.params.dateRange == 2){
        this.disableTo = true;

        if(this.params.byMonthFrom !== '' && this.params.byMonthFromYear !== ''){
          this.params.byMonthTo = this.params.byMonthFrom;
          this.params.byMonthToYear = this.params.byMonthFromYear;
        }else{
          this.params.byMonthTo = '';
          this.params.byMonthToYear = '';
        }
      }
    }else if(this.params.reportId == 'POLR044G'){
      if(this.params.dateRange == 2){
        this.disableTo = true;

        if(this.params.byMonthFrom !== '' && this.params.byMonthFromYear !== ''){
          this.params.byMonthTo = this.params.byMonthFrom;
          this.params.byMonthToYear = this.params.byMonthFromYear;
        }else{
          this.params.byMonthTo = '';
          this.params.byMonthToYear = '';
        }
      }
    }
  }

  removeDates(){
    this.params.byDateFrom = '';
    this.params.byDateTo = '';
    this.params.byMonthFrom = '';
    this.params.byMonthTo = '';
    this.params.byMonthToYear = '';
    this.params.byMonthFromYear = '';
    this.params.byAsOf = '';
  }

  getLine(){
    this.lineLov.modal.openNoClose();
  }
  
  setLine(data){
    this.params.lineCd = data.lineCd;
    this.params.lineName = data.description;
    this.ns.lovLoader(data.ev, 0);
  }

  showCedingCompanyLOV() {
    this.cedingLov.modal.openNoClose();
  }

  setCedingcompany(data){
    this.params.cedingId = data.cedingId;
    this.params.cedingName = data.cedingName; 
    this.ns.lovLoader(data.ev, 0);
  }

  prepareData(){
    this.modalMode = "";

    if(this.params.dateRange == 1){
      this.sendData.fromDate = this.ns.toDateTimeString(this.params.byDateFrom);
      this.sendData.toDate = this.ns.toDateTimeString(this.params.byDateTo);
    }else if(this.params.dateRange == 2){
      this.sendData.fromDate = this.ns.toDateTimeString(new Date(this.params.byMonthFromYear,this.params.byMonthFrom,0).getTime());
      this.sendData.toDate = this.ns.toDateTimeString(new Date(this.params.byMonthToYear,this.params.byMonthTo,0).getTime());
    }else if(this.params.dateRange == 3){
      this.sendData.toDate = this.ns.toDateTimeString(this.params.byAsOf);
    }

    this.sendData.dateRange = this.params.dateRange == 1 ? "D" : (this.params.dateRange == 2 ? "M" : "A");
    this.sendData.reportId = this.params.reportId;
    this.sendData.dateParam = this.params.dateParam;
    this.sendData.lineCdParam = this.params.lineCd;
    this.sendData.cedingIdParam = this.params.cedingId;
    this.sendData.incRecTag = this.params.incRecTag;
    this.sendData.destination = this.params.destination;
  }

  extract(cancel?){
    if(this.params.dateRange !== ''){
      if(this.params.dateRange == 1 && (this.params.byDateFrom == '' || this.params.byDateFrom == undefined) && 
         (this.params.byDateTo == '' || this.params.byDateTo == undefined)){
        this.dialogIcon = "warning-message";
        this.dialogMessage = "Please select dates to be extracted";
        this.appDialog.open();
        return;
      }else if(this.params.dateRange == 2 && ((this.params.byMonthFromYear == '' || this.params.byMonthFromYear == undefined) ||
               (this.params.byMonthFrom == '' || this.params.byMonthFrom == undefined)) && ((this.params.byMonthToYear == '' ||this.params.byMonthToYear == undefined) ||
               (this.params.byMonthTo == '' || this.params.byMonthTo == undefined))){
        this.dialogIcon = "warning-message";
        this.dialogMessage = "Please select dates to be extracted";
        this.appDialog.open();
        return;
      }else if(this.params.dateRange == 3 && (this.params.byAsOf == '' || this.params.byAsOf == undefined)){
        this.dialogIcon = "warning-message";
        this.dialogMessage = "Please select dates to be extracted";
        this.appDialog.open();
        return;
      }else if(this.params.dateRange == undefined){
        this.dialogIcon = "warning-message";  
        this.dialogMessage = "Please select dates to be extracted";
        this.appDialog.open();
        return;
      }
    }

    this.loading = true;
    this.prepareData();

    this.printService.extractReport({ reportId: this.params.reportId, polr044Params:this.sendData }).subscribe((data:any)=>{
        console.log("extractReport return data");
        console.log(data);
        this.loading = false;
        if (data.errorList.length > 0) {
          
          if (data.errorList[0].errorMessage.includes("parameters already exists.")) {
            this.modalMode = "reExtract";
            this.modalHeader = "Confirmation";
            this.polReportsModal.openNoClose();
          } else {
            this.dialogIcon = 'error';
            this.appDialog.open();
          }
          
        } else {
          if (data.params.extractCount != 0) {
            this.modalHeader = "Extraction Completed";
            this.modalBody = "Successfully extracted " + data.params.extractCount + " record/s.";
            this.polReportsModal.openNoClose();
          } else {
            this.modalHeader = "Extraction Completed";
            this.modalBody = "No record/s extracted.";
            this.polReportsModal.openNoClose();
          }
        }
    },
    (err) => {
      alert("Exception when calling services.");
    });
    
    this.sendData.forceExtract = 'N';
  }

  forceExtract() {
    this.sendData.forceExtract = 'Y';
  }

  print() {
    if(this.params.destination === '' || this.params.destination === undefined){
      this.dialogIcon = "warning-message";
      this.dialogMessage = "Please select a print destination";
      this.appDialog.open();
      return;
    }

    this.prepareData();

    let params :any = {
      "reportId" : this.params.reportId,
      "polr044Params.extractUser" :   this.sendData.extractUser,
      "polr044Params.dateRange" :   this.sendData.dateRange,
      "polr044Params.dateParam" :  this.sendData.dateParam,
      "polr044Params.fromDate"  :   this.sendData.fromDate,
      "polr044Params.toDate"    :     this.sendData.toDate,
      "polr044Params.cedingIdParam" : this.sendData.cedingIdParam,
      "polr044Params.lineCdParam" :   this.sendData.lineCdParam,
      "polr044Params.incRecTag" :   this.sendData.incRecTag,
      "polr044Params.reportId"  :   this.sendData.reportId,
    }

    this.printService.print(this.params.destination,this.params.reportId, params);
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  checkCode(ev, field){
    this.ns.lovLoader(ev, 1);

    if(field === 'line') {            
        this.lineLov.checkCode(this.params.lineCd, ev);
    } else if(field === 'company') {
        this.cedingLov.checkCode(String(this.params.cedingId).padStart(3, '0'), ev);            
    } else if(field === 'report'){
      if(this.params.reportId.indexOf('POLR044') == -1){
        this.passLov.code = '';
      }
      this.passLov.code = this.params.reportId;
      console.log(ev);
      this.lovMdl.checkCode('reportId',ev);
    }
  }

}
