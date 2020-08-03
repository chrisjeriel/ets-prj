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
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';
import { DecimalPipe } from '@angular/common';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { Router } from '@angular/router';

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
  @ViewChild('success') openDialog: SucessDialogComponent;
  @ViewChild('currencyModal') currLov: MtnCurrencyCodeComponent;
  @ViewChild('Range') rangeLOV: ModalComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;

  passLov: any = {
    selector: 'mtnReport',
    reportId: '',
    hide: [
      'POLR044BA'
    ]
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
                        'POLR044HA',
                        'POLR044I',
                        'POLR044J',
                        'POLR044JA',
                        'POLR044J_ISS',
                        'POLR044J_RET',
                        'POLR044K',
                        'POLR044KA',
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
                        'ACITR048A',
                        'POLR044W',
                        'POLR044Y'
                        ];

  rangeParams :any = {
    saveReportsRange:[],
    delReportsRange: []
  };

  passData: any = {
    tableData: [],
    tHeader: ['Range', 'Amount'],
    dataTypes: ['string', 'currency'],
    nData: {siRange: '', amount: ''},
    addFlag: true,
    deleteFlag: false,
    genericBtn:'Delete',
    checkFlag: true,
    infoFlag: true,
    paginateFlag: true,
    pagination: true,
    pageStatus: true,
    pageLength: 10,
    uneditable: [false,false],
    keys: ['siRange', 'amount'],
    widths: [110,140]
  };

  paramsToggle: Array<string> = [];

  extractDisabled: boolean = true;
  modalHeader: string = "";
  modalBody: string = "";
  dialogIcon: string = "";
  dialogMessage: string = "";
  modalMode: string = "";
  loading: boolean = true;
  disableTo: boolean = false;
  tableFlag: boolean = false;
  cancelFlag: boolean = false;
  fromSiRangeMdl: boolean = false;

  passDataCsv : any[] =[];

  constructor(private ms: MaintenanceService, private ns: NotesService, private printService: PrintService, public modalService: NgbModal,  private decimal : DecimalPipe, private router:Router) { }

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
    this.params.effDate = this.ns.toDateTimeString(0);

    if(data.data != null){
      this.params.reportId = data.data.reportId;
      this.params.reportName = data.data.reportTitle;
      this.extractDisabled = false;
    } else {
      this.extractDisabled = true;
      return;
    }

    /*if (this.repExtractions.indexOf(this.params.reportId) > -1) {
      this.extractDisabled = false;
    } else {
      this.extractDisabled = true;
    }*/

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
      this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'currCd');
      this.params.dateParam = '5';
      this.params.incRecTag = '';
    } 
    else if(this.params.reportId == 'POLR044B'){
      this.paramsToggle.push('byDate', 'byMonthYear', 'line', 'company', 'currCd');
    }
    else if(this.params.reportId == 'POLR044C'){
      this.paramsToggle.push('accountingDate', 'bookingDate','byDate', 'byMonthYear', 'line', 'company', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.params.incRecTag = 'D';
      this.checkMonthYear();
    }
    else if(this.params.reportId == 'POLR044D'){
      this.paramsToggle.push('bookingDate', 'accountingDate', 'asOf', 'line', 'company', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '3';
      this.params.incRecTag = 'D';
    } 
    else if(this.params.reportId == 'POLR044E'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company', 'currCd','siRange');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.params.incRecTag = 'D';
      this.checkMonthYear();
    } 
    else if(this.params.reportId == 'POLR044F'){
      this.paramsToggle.push('bookingDate', 'accountingDate', 'line', 'company', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.params.incRecTag = 'D';
      this.checkMonthYear();
    } 
    else if(this.params.reportId == 'POLR044G'){
      this.paramsToggle.push('line', 'company','byMonthYear', 'bookingDate', 'accountingDate', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.params.incRecTag = 'D';
      this.checkMonthYear();
    } 
    else if(this.params.reportId == 'POLR044H' || this.params.reportId == 'POLR044HA'){
      this.paramsToggle.push('bookingDate', 'accountingDate', 'line', 'company', 'byDate', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.incRecTag = 'D';
    } 
    else if(this.params.reportId == 'POLR044I'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company', 'currCd','siRange');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.params.incRecTag = 'D';
    } 
    //
    else if(this.params.reportId == 'POLR044YA'){
      this.paramsToggle.push('bookingDate', 'asOf', 'company', 'currCd');
      this.params.dateParam = '10';
      this.params.dateRange = 'A';
      this.extractDisabled = true;
    }  
    //
    else if(this.params.reportId == 'POLR044J' || this.params.reportId == 'POLR044JA'){
      this.paramsToggle.push('accountingDate', 'line', 'company', 'byMonthYear', 'currCd', 'bookingDate');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.params.incRecTag = 'D';
      // this.params.incRecTag = 'D';
      this.checkMonthYear();
    } 
    else if(this.params.reportId == 'POLR044J_ISS'){
      this.paramsToggle.push('accountingDate', 'line', 'company', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.params.incRecTag = 'D';
      this.checkMonthYear();
    }
    else if(this.params.reportId == 'POLR044J_RET'){
      this.paramsToggle.push('accountingDate', 'line', 'company', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.params.incRecTag = 'D';
      this.checkMonthYear();
    }
    else if(this.params.reportId == 'POLR044K' || this.params.reportId == 'POLR044KA'){
      this.paramsToggle.push('accountingDate', 'line', 'company', 'byDate', 'byMonthYear', 'currCd', 'bookingDate');
      this.params.dateParam = '5';
      this.params.incRecTag = 'D';
    } 
    else if(this.params.reportId == 'POLR044L'){
      this.paramsToggle.push('bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'undistributed', 
                             'policy', 'alteration', 'policyAlteration', 'undistributed', 'currCd','asOf');
      this.params.dateParam = '10';
    } 
    else if(this.params.reportId == 'POLR044M'){
      this.paramsToggle.push('line', 'company', 'asOf', 'currCd');
      this.params.dateRange = '3';
    } 
    else if(this.params.reportId == 'POLR044N'){
      this.paramsToggle.push('line', 'company', 'asOf', 'currCd');
      this.params.dateRange = '3';
    } 
    else if(this.params.reportId == 'POLR044O'){
      this.paramsToggle.push('byDate', 'byMonthYear', 'line', 'company','currCd','accountingDate', 'bookingDate',);
      this.params.dateParam = '5';
      this.params.incRecTag = 'D';
    } 
    else if(this.params.reportId == 'POLR044P'){
      this.paramsToggle.push('accountingDate', 'bookingDate','line', 'company', 'asOf', 'currCd');
      this.params.dateRange = '3';
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044Q'){
      this.paramsToggle.push('accountingDate', 'bookingDate','asOf','line', 'company', 'currCd');
      this.params.dateRange = '3';
      this.params.dateParam = '5';
    } 
    else if(this.params.reportId == 'POLR044R'){
      this.paramsToggle.push('line', 'company', 'currCd','siRange', 'asOf');
      this.params.incRecTag = 'D';
      this.params.dateRange = '3';
      this.params.dateParam = '6';
    } 
    else if(this.params.reportId == 'POLR044S'){
      this.paramsToggle.push('line', 'company', 'currCd','siRange', 'asOf');
      this.params.incRecTag = 'D';
      this.params.dateRange = '3';
      this.params.dateParam = '6';
    } 
    else if(this.params.reportId == 'POLR044T'){
      this.paramsToggle.push('line', 'company', 'byDate', 'byMonthYear', 'currCd');
    }
    else if(this.params.reportId == 'POLR044U'){
      this.paramsToggle.push('line', 'company', 'byDate', 'byMonthYear', 'currCd','accountingDate', 'bookingDate');
    }  
    else if(this.params.reportId == 'ACITR061F'){
      this.paramsToggle.push('issueDate', 'createDate', 'effectiveDate', 'bookingDate', 'accountingDate', 'distributed', 'undistributed',
                             'byDate', 'byMonthYear', 'asOf', );
      this.params.incRecTag = 'D';
    } 
    else if(this.params.reportId == 'ACITR061G'){
      this.paramsToggle.push('issueDate', 'lossDate', 'distributionDate', 'tranDate', 'postingDate',
                             'createDate', 'effectiveDate', 'accountingDate', 'byDate', 'byMonthYear',
                             'asOf');
      this.params.incRecTag = 'D';
    } 
    else if(this.params.reportId == 'POLR044V'){
      this.paramsToggle.push('line', 'company', 'asOf', 'currCd');
      this.params.dateRange = '3';
    }
    else if(this.params.reportId == 'POLR044W'){
      this.paramsToggle.push('byDate', 'byMonthYear', 'asOf','siRange');
    } else if(this.params.reportId == 'POLR044OA' || this.params.reportId == 'POLR044OB' || this.params.reportId == 'POLR044OB'){
      this.paramsToggle.push('byDate', 'byMonthYear', 'line', 'company','currCd','accountingDate', 'bookingDate',);
      this.params.dateParam = '5';
      this.params.incRecTag = 'D';
    } else if (this.params.reportId == 'POLR044X') {
      this.paramsToggle.push('issueDate', 'lossDate', 'distributionDate', 'tranDate', 'postingDate',
                             'createDate', 'effectiveDate', 'accountingDate', 'bookingDate', 'line', 'company',
                             'byDate', 'byMonthYear', 'asOf', 'currCd');
      this.params.incRecTag = 'B'
    }
    else if(this.params.reportId == 'POLR044Y'){
      this.paramsToggle.push('accountingDate', 'bookingDate','byDate', 'byMonthYear', 'line', 'company', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.checkMonthYear();
    }else if (this.params.reportId == 'POLR044Z') {
        this.paramsToggle = ['byDate','byMonthYear','asOf']
        this.params.dateParam = '10';
        this.params.dateRange = '3';
    } else  {
      this.paramsToggle.push('issueDate', 'lossDate', 'distributionDate', 'tranDate', 'postingDate',
                             'createDate', 'effectiveDate', 'accountingDate', 'bookingDate', 'line', 'company',
                             'policy', 'alteration', 'policyAlteration',
                             'byDate', 'byMonthYear', 'asOf', 'currCd');
    }

    this.ns.lovLoader(data.ev, 0);
  }

  checkReport(){
     if(this.params.reportId == 'POLR044R'){
      this.paramsToggle.push('line', 'company', 'currCd','siRange', 'asOf');
      this.params.incRecTag = 'D';
      this.params.dateRange = '3';
      this.params.dateParam = '6';
    } 
    else if(this.params.reportId == 'POLR044S'){
      this.paramsToggle.push('line', 'company', 'currCd','siRange','asOf');
      this.params.incRecTag = 'D';
      this.params.dateRange = '3';
      this.params.dateParam = '6';
    } else if(this.params.reportId == 'POLR044C'){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate','byDate', 'byMonthYear', 'line', 'company', 'currCd', 'distributed', 'undistributed', 'alldistribution');
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate' , 'byMonthYear', 'line', 'company', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
      }
    }else if(this.params.reportId == 'POLR044D'){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company', 'currCd', 'distributed', 'undistributed', 'alldistribution');
        this.params.dateParam = '10';
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'asOf', 'line', 'company', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
      }
    }else if(this.params.reportId == 'POLR044E' || this.params.reportId == 'POLR044I'){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company', 'currCd', 'distributed', 'undistributed', 'alldistribution','siRange');
        this.params.dateRange = '2';
        this.params.dateParam = '10';
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company', 'currCd','siRange');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
      }
    }
     //
    else if(this.params.reportId == 'POLR044YA'){
      this.paramsToggle.push('bookingDate', 'asOf', 'company', 'currCd');
      this.params.dateParam = '10';
      this.params.dateRange = 'A';
      this.extractDisabled = true;
    }  
    //
    else if(this.params.reportId == 'POLR044F'){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company', 'currCd', 'distributed', 'undistributed', 'alldistribution');
        this.params.dateParam == 10
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
      }
    }else if(this.params.reportId == 'POLR044G'){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company', 'currCd', 'distributed', 'undistributed', 'alldistribution');
        this.params.dateParam == 10
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byMonthYear', 'line', 'company', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
      }
    }else if(this.params.reportId == 'POLR044H' || this.params.reportId == 'POLR044HA' ){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'currCd', 'distributed', 'undistributed', 'alldistribution');
        this.params.dateParam == 10;
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
      }
    }else if(this.params.reportId == 'POLR044J' || this.params.reportId == 'POLR044JA'){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'currCd', 'distributed', 'undistributed', 'alldistribution');
        this.params.dateParam == 10;
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
      }
    }else if(this.params.reportId == 'POLR044K' || this.params.report == 'POLR044KA'){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'currCd', 'distributed', 'undistributed', 'alldistribution');
        this.params.dateParam == 10;
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
      }
    } else if(this.params.reportId == 'POLR044O' || this.params.reportId == 'POLR044OA' || this.params.reportId == 'POLR044OB'){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'currCd', 'distributed', 'undistributed', 'alldistribution');
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate', 'byMonthYear', 'line', 'company', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
      }
    }else if(this.params.reportId == 'POLR044Y'){
      this.paramsToggle = [];
      if(this.params.dateParam == 10){
        this.paramsToggle.push('accountingDate', 'bookingDate','byDate', 'byMonthYear', 'line', 'company', 'currCd');
        this.params.incRecTag = 'D';
      }else{
        this.paramsToggle.push('accountingDate', 'bookingDate', 'byDate' , 'byMonthYear', 'line', 'company', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
        this.params.incRecTag = '';
      }
      
     }else if (this.params.reportId == 'POLR044X') {
        // this.paramsToggle.push('issueDate', 'lossDate', 'distributionDate', 'tranDate', 'postingDate',
        //                        'createDate', 'effectiveDate', 'accountingDate', 'bookingDate', 'line', 'company',
        //                        'byDate', 'byMonthYear', 'asOf', 'currCd');
    }else if(this.params.reportId == 'POLR044V' || this.params.reportId == 'POLR044P' || this.params.reportId == 'POLR044Q' || this.params.reportId == 'POLR044U' ){
      // this.paramsToggle.push('line', 'company', 'asOf', 'currCd');
      // this.params.dateRange = '3';
    }else {
      this.paramsToggle = [];
      if(this.params.dateParam == 10) {
        this.paramsToggle.push('issueDate', 'lossDate', 'distributionDate', 'tranDate', 'postingDate',
                             'createDate', 'effectiveDate', 'accountingDate', 'bookingDate', 'line', 'company',
                             'policy', 'alteration', 'policyAlteration',
                             'byDate', 'byMonthYear', 'asOf', 'currCd', 'distributed', 'undistributed', 'alldistribution');
        this.params.incRecTag = 'D';
      } else {
        this.paramsToggle.push('issueDate', 'lossDate', 'distributionDate', 'tranDate', 'postingDate',
                             'createDate', 'effectiveDate', 'accountingDate', 'bookingDate', 'line', 'company',
                             'policy', 'alteration', 'policyAlteration',
                             'byDate', 'byMonthYear', 'asOf', 'currCd');
        this.params.incRecTag = this.params.dateParam == 5 ? 'D' : '';
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
    }else if(this.params.reportId == 'POLR044E' || this.params.reportId == 'POLR044I'){
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
    this.sendData.currCdParam = this.params.currCd;
    this.sendData.cedingIdParam = this.params.cedingId;
    this.sendData.incRecTag = this.params.incRecTag;
    this.sendData.destination = this.params.destination;
  }

  extract(cancel?){
    this.tableFlag = true;
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
    console.log(this.sendData);
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
    this.tableFlag = true;
    if(this.params.destination == 'exl'){
      this.passDataCsv = [];
      this.getExtractToCsv();
      return;
    }
    
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
      "polr044Params.cedingIdParam" : (this.sendData.cedingIdParam==undefined || this.sendData.cedingIdParam==null)?'':this.sendData.cedingIdParam,
      "polr044Params.lineCdParam" :   this.sendData.lineCdParam,
      "polr044Params.incRecTag" :   this.sendData.incRecTag,
      "polr044Params.reportId"  :   this.sendData.reportId,
      "polr044Params.currCdParam"  :   (this.sendData.currCdParam==undefined || this.sendData.currCdParam==null)?'':this.sendData.currCdParam,
    }

    console.log(params);
    console.log(this.sendData.cedingIdParam);

    this.printService.print(this.params.destination,this.params.reportId, params);
    if(this.params.reportId == 'POLR044B'){
      params.reportId = 'POLR044BA';
      params["polr044Params.reportId"]= 'POLR044BA';
      this.printService.print(this.params.destination,'POLR044BA', params);
    }
  }

  onClickCancel(){
    this.router.navigateByUrl('');
  }

  checkCode(ev, field){
    this.ns.lovLoader(ev, 1);

    if(field === 'line') {            
        this.lineLov.checkCode(this.params.lineCd, ev);
    } else if(field === 'company') {
        this.cedingLov.checkCode(String(this.params.cedingId).padStart(3, '0'), ev);            
    } else if(field === 'report'){
      if(this.params.reportId.indexOf('POLR044') == -1) { // || (this.params.reportId.length > 8)){
        this.passLov.code = 'POLR044%';
      }else{
        this.passLov.code = this.params.reportId;
      }
      this.lovMdl.checkCode('reportId',ev);
    }else if(field == 'currCd') {
      this.currLov.checkCode(this.params.currCd, ev);
    }
  }

  showCurrencyModal(){
    $('#currencyModal #modalBtn').trigger('click');
  }
  
  setCurrency(data){
    console.log(data)
    this.params.currCd = data.currencyCd;
    this.params.currdesc = data.description;
    this.ns.lovLoader(data.ev, 0);
    setTimeout(()=>{
          $('.currCd').focus().blur();
        }, 0);
  }

  retrieveRange(){
    this.table.loadingFlag = true;
    this.ms.retrieveReportRange(this.ns.getCurrentUser()).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      var nextSiRange;
      if(data.reportsRange.length !== 0){
        for (var i = 0; i < data.reportsRange.length; i++) {
          this.passData.tableData.push(data.reportsRange[i]);
          this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['siRange'];
        }
        nextSiRange = this.passData.tableData[this.passData.tableData.length - 1].siRange + 1;
        this.passData.nData = {siRange: nextSiRange, amount: ''};
      }else{
        this.passData.nData = {siRange: 1, amount: ''};
      }

      this.table.refreshTable();
      this.table.loadingFlag = false;
      this.passData.disableGeneric = true
    });
  }

  update(data){
    var checkFlag = false;
    this.table.markAsDirty();
    var nextSiRange = this.passData.tableData[this.passData.tableData.length - 1].siRange +1;
    this.passData.nData = {siRange: nextSiRange, amount: ''};
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].checked){
        checkFlag = true;
        break;
      }
    }
    console.log(checkFlag)
    if(checkFlag){
      this.passData.disableGeneric = false;
    }else{
      this.passData.disableGeneric = true;
    }
  }

  onRowClick(data){
    if( data !==null){
      this.passData.disableGeneric = false;
    }
  }

  deleteCurr(){
    var notChecked = this.passData.tableData.filter(a=> !a.deleted && !a.checked);
    var finalRange = notChecked.length > 0 ? notChecked[notChecked.length - 1].siRange : undefined;
    var errorFlag = false;

    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].checked ){
        if(finalRange != undefined && this.passData.tableData[i].siRange < finalRange){
          errorFlag = true;
          break;
        }
      }
    }

    if(errorFlag){
      this.dialogIcon = "warning-message";
      this.dialogMessage = "Range must be in a chronological order";
      this.openDialog.open();
    }else{
      // this.table.indvSelect.deleted = true;
      // this.table.selected  = [this.table.indvSelect]
      this.table.confirmDelete();
    }
  }

  onClickSave(){
    var errorFlag = false;
    for (var i = 0; i < this.passData.tableData.length - 1; i++) {
      if(!this.passData.tableData[i].deleted){
        if(this.passData.tableData[i].amount >= this.passData.tableData[i+1].amount && !this.passData.tableData[i+1].deleted){
          errorFlag = true;
          break;
        } 
      }
    }

    if(errorFlag){
      this.dialogIcon = "warning-message";
      this.dialogMessage = "Amount must be in ascending order";
      this.openDialog.open();
    }else{
      this.confirm.confirmModal();
    }
    
  }

  saveRange(cancel?){
    this.cancelFlag = cancel !== undefined;
    // this.tableFlag = true;
    this.rangeParams.saveReportsRange = [];
    this.rangeParams.delReportsRange = [];
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.passData.tableData[i].userId = this.ns.getCurrentUser();
        this.rangeParams.saveReportsRange.push(this.passData.tableData[i]);
      }

      if(this.passData.tableData[i].deleted){
        this.passData.tableData[i].userId = this.ns.getCurrentUser();
        this.rangeParams.delReportsRange.push(this.passData.tableData[i]);
      }
    }

    this.ms.saveReportRange(this.rangeParams).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.appDialog.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.appDialog.open();
        this.table.markAsPristine();
        this.retrieveRange();
      }
    });
  }

  siClickCancel(){
    if(this.table.form.first.dirty) {
      this.cancelBtn.clickCancel();
    } else {
      this.rangeLOV.closeModal();
    }
  }

  afterCancelSave() {
    this.fromSiRangeMdl = false;
    this.rangeLOV.closeModal();
  }

  export(tab1,tab2) {
    var currDate = this.ns.toDateTimeString(0).replace(':', '.');
    var filename = this.params.reportId + '_' + currDate + '.xls';
    var opts = [{
                sheetid: 'Sheet1',
                headers: true
               },
               {
                sheetid: 'Sheet2',
                headers: true
               }];

    // var opts = [
    //             {sheetid: 'Sheet1',headers: true,
    //               cells: {1:{1:{
    //                 style: {Color:"#7CEECE"}
    //               }}}
    //             },
    //             {sheetid: 'Sheet2',headers: true,
    //               cells: {1:{1:{
    //                 style:"background:blue"
    //               }}}
    //             }
    //            ];

// var opts = {
//               headers:true,
//               column: {
//                     style:{
//                       Font:{
//                           Bold:"1",
//                           Color:"#3C3741",
//                       },
//                       Alignment:{
//                           Horizontal:"Center"
//                       },
//                       Interior:{
//                           Color:"#7CEECE",
//                           Pattern:"Solid"
//                       },
//                   }
//               }
//             };

// columns: [
                //   {columnid:'a',title:'Albatroses',
                //     style:'background:red;font-size:20px',
                //     cell:{style:'background:blue'}
                //   },
                //   {columnid:'b',title:'Bird',cell:{
                //     style:function(value,sheet,row,column,rowidx,columnidx){
                //       return 'background'+(value==10?'brown':'white')
                //   }}},
                //   { 
                //     columnid: 'b', cell:{value:function(value){ return value * value}}
                //   }
                // ]
    // var opts = {
    //   headers:true, 
    //   column: {style:{Font:{Bold:"1"}}},
    //   rows: {1:{style:{Font:{Color:"#7CEECE"}}}},
    //   cells: {1:{1:{
    //     style: {Font:{Color:"#7CEECE"}}
    //   }}}
    // };

    // var opts = {
    //           headers:true,
    //           column: {
    //                 style:{
    //                   Font:{
    //                       Bold:"1",
    //                       Color:"#3C3741",
    //                   },
    //                   Alignment:{
    //                       Horizontal:"Center"
    //                   },
    //                   Interior:{
    //                       Color:"#7CEECE",
    //                       Pattern:"Solid"
    //                   },
    //               }
    //           }
    //         };

    //alasql('SELECT INTO XLSX("'+filename+'",?) FROM ?', [opts,[tab1,tab2]]);
    alasql('SELECT INTO XLSX("'+filename+'",?) FROM ?', [opts, [tab1, tab2]]);

  }

  getExtractToCsv(){
    console.log(this.params.reportId);
    console.log(this.params.byAsOf + ' >> as of');
      console.log(this.ns.getCurrentUser() + ' >> current user');
      this.ms.getExtractToCsv(this.ns.getCurrentUser(),this.params.reportId,null,null,this.params.currCd,this.params.cedingId,null,null,
           null,this.params.byAsOf,null,null,null,null,null,null,null,this.params.lineCd)
      .subscribe(data => {
        console.log(data);
    
        var months = new Array("Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
        "Oct", "Nov", "Dec");

        alasql.fn.myFormat = function(d){
          if(d == null){
            return '';
          }
          var date = new Date(d);
          var day = (date.getDate()<10)?"0"+date.getDate():date.getDate();
          var mos = months[date.getMonth()];
          return day+'-'+mos+'-'+date.getFullYear(); 
        };

        alasql.fn.negFmt = function(m){
          // return (m==null || m=='')?0:(Number(String(m).replace(/,/g, ''))<0?('('+String(m).replace(/-/g, '')+')'):isNaN(Number(String(m).replace(/,/g, '')))?'0.00':m);
          return (m==null || m=='') ? 0 : Number(m);
        };

        alasql.fn.isNull = function(n){
          return n==null?'':n;
        };

        alasql.fn.checkNullNo = function(o){
          return (o==null || o=='')?'': Number(o);
        };

        function checkNull(obj) {
          for (var key in obj) {
              if (obj[key] == null){
                 obj[key] = ' ';
              }
          }
          return obj;
        }

        var name = this.params.reportId;
        var query = '';
        if(this.params.reportId == 'POLR044E'){
          this.passDataCsv = data['listPolr044e'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE],currCdParam AS [CURRENCY],'+
          'negFmt(lineSortSeq) as [LINE SORT SEQ],lineCdParam AS [LINE],negFmt(siRange) AS [SI RANGE],siRangeDesc AS [SI RANGE DESC], negFmt(mthNoPol) AS [No of POLICIES for MTH], negFmt(cumNoPol) AS [CUM No of POLICIES]';
        }else if(this.params.reportId == 'POLR044A'){
          this.passDataCsv = data['listPolr044a'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],isNull(lineCd) as [LINE CD],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],'+
          'myFormat(issueDate) as [ISSUE DATE],myFormat(effDate) as [EFF DATE],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR044B'){
          this.passDataCsv = data['listPolr044b'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(lineCd) as [LINE CD],checkNullNo(policyId) as [POLICY ID],'+
          'isNull(policyNo) as [POLICY NO],isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],myFormat(inceptDate) as [INCEPT DATE],'+
          'myFormat(expiryDate) as [EXPIRY DATE],isNull(insuredDesc) as [INSURED DESC],isNull(projDesc) as [PROJ DESC],isNull(currencyCd) as [CURRENCY CD],'+
          'negFmt(siAmt) as [SI AMT],negFmt(premAmt) as [PREM AMT],isNull(remarks) as [REMARKS],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR044C'){
          this.passDataCsv = data['listPolr044c'];
          query = 'SELECT extractUser AS [EXTRACT USER],currencyCd AS [CURRENCY],lineCd AS [LINE], checkNullNo(prevYear) AS [PREV YEAR],'+ 
            'negFmt(currency(prevMthPrem)) AS [PREV MTH PREM],'+ 
            'negFmt(currency(prevPctTotal)) AS [PREV % TOTAL],'+
            'negFmt(currency(prevCumPrem)) AS [PREV CUM PREM],'+
            'checkNullNo(currYear) AS [CURR YEAR],'+
            'negFmt(currency(currMthPrem)) AS [CURR MTH PREM],'+
            'negFmt(currency(mthIncDecPct)) AS [MTH INC/DEC %],'+
            'negFmt(currency(currPctTotal)) AS [CURR % TOTAL],'+
            'negFmt(currency(currCumPrem)) AS [CURR CUM PREM],'+
            'negFmt(currency(cumIncDecPct)) AS [CUM INC/DEC %],'+
            'negFmt(currency(mthPlanPrem)) AS [MTH PLAN PREM],'+
            'negFmt(currency(mthVariance)) AS [MTH VARIANCE],'+
            'negFmt(currency(cumPlanPrem)) AS [CUM PLAN PREM],'+
            'negFmt(currency(cumVariance)) AS [CUM VARIANCE]';
        }else if(this.params.reportId == 'POLR044D'){
          this.passDataCsv = data['listPolr044d'];
          query = 'SELECT extractUser AS [EXTRACT USER],toDate AS [AS OF],lineCd AS [LINE],mmPolcountPrev AS [PREV MONTHLY TOTAL],mmPolcountCur AS [CURR MONTHLY TOTAL],ytdPolcountPrev AS [PREV YR-DATE TOTAL],ytdPolcountCur AS [CURR YR-DATE TOTAL]';
        }else if(this.params.reportId == 'POLR044F'){
          this.passDataCsv = data['listPolr044f'];
          query = 'SELECT extractUser AS [EXTRACT USER], currencyCd AS [CURRENCY],cedingName AS [COMPANY], checkNullNo(prevYear) AS [PREV YEAR],'+
            'negFmt(currency(prevMthPrem)) AS [PREV MTH PREM],negFmt(currency(prevCumPrem)) AS [PREV CUM PREM],prevMthNoPol AS [PREV MTH # of POL], prevCumNoPol AS [PREV CUM # of POL],'+
            'checkNullNo(currYear) AS [CURR YEAR], negFmt(currency(currMthPrem)) AS [CURR MTH PREM], negFmt(currency(currCumPrem)) AS [CURR CUM PREM],currMthNoPol AS [CURR MTH # of POL],'+
            'currCumNoPol AS [CURR CUM # of POL]';
        }else if(this.params.reportId == 'POLR044G'){
          this.passDataCsv = data['listPolr044g'];
          query = 'SELECT extractUser AS [EXTRACT USER], myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE], lineCd AS [LINE],'+
          'currencyCd AS [CURRENCY],renewTag as [RENEW TAG], renThisMmQty AS [REN THIS MTH QTY], negFmt(currency(renThisMmPrem)) AS [REN THIS MTH PREM],'+
          'renCumuQty AS [REN CUM QTY], negFmt(currency(renCumuPrem)) AS [REN CUM PREM], newThisMmQty AS [NEW THIS MTH QTY],'+
          'negFmt(currency(newThisMmPrem)) AS [NEW THIS MTH PREM], newCumuQty as [NEW CUM QTY], negFmt(currency(newCumuPrem)) AS [NEW CUM PREM],'+
          'totThisMmQty AS [TOTAL THIS MTH QTY], negFmt(currency(totThisMmPrem)) AS [TOTAL THIS MTH PREM], totCumuQty AS [TOTAL CUM QTY],'+
          'negFmt(currency(totCumuPrem)) AS [TOTAL CUM PREM]';
        }else if(this.params.reportId == 'POLR044H'){
          this.passDataCsv = data['listPolr044h'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(cedingId) as [CEDING ID],'+
          'isNull(cedingName) as [CEDING NAME],isNull(lineCd) as [LINE CD],isNull(currencyCd) as [CURRENCY CD],'+
          'checkNullNo(policyId) as [POLICY ID],checkNullNo(instNo) as [INST NO],isNull(policyNo) as [POLICY NO],'+
          'myFormat(issueDate) as [ISSUE DATE],myFormat(effDate) as [EFF DATE],negFmt(premAmt) as [PREM AMT],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR044HA'){
          this.passDataCsv = data['listPolr044ha'];
          query = 'SELECT extractUser AS [EXTRACT USER], myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE], currencyCd as [CURRENCY],'+
          'checkNullNo(cessionId) as [CESSION ID], cessionIdDesc as [TYPE OF CESSION], lineCd as [LINE], checkNullNo(policyId) as [POLICY ID], policyNo || "/" || instNo as [POLICY NO/INST NO],cedingName as [CEDING NAME],'+
          'myFormat(issueDate) as [ISSUE DATE], myFormat(effDate) as [EFFECTIVE DATE], negFmt(currency(premAmt)) as [PREMIUM AMOUNT]';
        }else if(this.params.reportId == 'POLR044I'){
          this.passDataCsv = data['listPolr044i'];
          query = 'SELECT extractUser AS [EXTRACT USER], myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE],currencyCd AS [CURRENCY], checkNullNo(lineSortSeq) AS [LINE SORT SEQ],lineCd AS [LINE],'+
          'negFmt(siRange) as [SI RANGE],amtRangeDesc as [SI RANGE DESC], negFmt(currency(premAmtCum)) as [CUMMULATIVE PREMIUM], negFmt(currency(premAmtMth)) as [PREMIUM FOR THE MONTH]';
        }else if(this.params.reportId == 'POLR044J'){
          this.passDataCsv = data['listPolr044j'];
          query = 'SELECT isNull(extractUser) AS [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE],currencyCd AS [CURRENCY],lineCd AS [LINE],'+
          'isNull(cedingId) as [CEDING ID],isNull(cedingName) AS [COMPANY],isNull(tranType) as [TRAN TYPE],isNull(tranTypeDesc) as [TRAN TYPE DESC],'+
          'negFmt(currency(ret1PremAmt)) AS [1st RET PREM], negFmt(currency(ret1CommAmt)) AS [1st RET COMM],'+
          'negFmt(currency(ret1VatRiComm)) AS [1st RET VAT on RI], negFmt(currency(ret1NetDue)) AS [1st RET NET DUE],'+
          'negFmt(currency(ret2PremAmt)) AS [2nd RET PREM], negFmt(currency(ret2CommAmt)) AS [2nd RET COMM],'+
          'negFmt(currency(ret2VatRiComm)) AS [2nd RET VAT on RI], negFmt(currency(ret2NetDue)) AS [2nd RET NET DUE],'+
          'myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE]';
        }else if(this.params.reportId == 'POLR044JA'){
          this.passDataCsv = data['listPolr044ja'];
          query = 'SELECT extractUser AS [EXTRACT USER], myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE],currencyCd AS [CURRENCY],lineCd AS [LINE],'+
          'isNull(cedingId) as [CEDING ID], isNull(cedingName) as [COMPANY], isNull(tranType) as [TRAN TYPE], isNull(tranTypeDesc) AS [TRAN TYPE DESC],'+
          'policyId as [POLICY ID], policyNo || "/" || instNo as [POLICY NO/INST NO], isNull(insuredDesc) as [INSURED DESC], isNull(sortSeq) as [SORT SEQ],'+
          'negFmt(currency(ret1PremAmt)) as [RET1 PREM AMT],negFmt(currency(ret1CommAmt)) as [RET1 COMM AMT], negFmt(currency(ret1VatRiComm)) as [RET1 VAT RI COMM], negFmt(currency(ret1NetDue)) as [RET1 NET DUE],'+
          'negFmt(currency(ret2PremAmt)) as [RET2 PREM AMT],negFmt(currency(ret2CommAmt)) as [RET2 COMM AMT], negFmt(currency(ret2VatRiComm)) as [RET2 VAT RI COMM], negFmt(currency(ret2NetDue)) as [RET2 NET DUE]';
        }else if(this.params.reportId == 'POLR044K'){
          this.passDataCsv = data['listPolr044k'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(lineCd) as [LINE CD],checkNullNo(treatyId) as [TREATY ID],isNull(treatyName) as [TREATY NAME],isNull(trtyCedId) as [TRTY CED ID],'+
          'isNull(trtyCedIdName) as [TRTY CED ID NAME],checkNullNo(retLayer) as [RET LAYER],isNull(retLayerDesc) as [RET LAYER DESC],'+
          'isNull(tranType) as [TRAN TYPE],isNull(tranTypeDesc) as [TRAN TYPE DESC],negFmt(premAmt) as [PREM AMT],negFmt(commAmt) as [COMM AMT],'+
          'negFmt(vatRiComm) as [VAT RI COMM],negFmt(dueToTrty) as [DUE TO TRTY],negFmt(dueToCedant) as [DUE TO CEDANT],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR044KA'){
          this.passDataCsv = data['listPolr044ka'];
          query = 'SELECT extractUser AS [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE], currencyCd AS [CURRENCY],lineCd AS [LINE], uwYear as [UW YEAR],'+
          'treaty as [TREATY], treatyId as [TREATY ID], treatyIdName as [TREATY NAME], isNull(trtyCedId) as [TRTY CED ID], isNull(trtyCedIdName) as [TREATY COMPANY],'+
          'isNull(retLayer) as [RET LAYER], isNull(tranType) as [TRAN TYPE], isNull(tranTypeDesc) as [TRAN TYPE DESC], negFmt(currency(premAmt)) as [PREM AMT],'+
          'negFmt(currency(commAmt)) as [COMM AMT], negFmt(currency(vatRiComm)) as [VAT RI COMM], negFmt(currency(dueToTrty)) as [DUE TO TRTY], negFmt(currency(dueToCedant)) as [DUE TO CEDANT],'+
          'myFormat(fromDate) as [FROM DATE], myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR044L'){
          this.passDataCsv = data['listPolr044l'];
          query = 'SELECT isNull(extractUser) as [EXTRACT_USER],myFormat(extractDate) as [EXTRACT DATE],isNull(lineCd) as [LINE CD],'+
          'myFormat(acctDate) as [ACCT DATE],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],'+
          'isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],myFormat(inceptDate) as [INCEPT DATE],'+
          'myFormat(expiryDate) as [EXPIRY DATE],isNull(currencyCd) as [CURRENCY CD],negFmt(premAmt) as [PREM AMT],'+
          'isNull(status) as [STATUS],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR044M'){
          this.passDataCsv = data['listPolr044m'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'checkNullNo(zoneCd) as [ZONE CD],isNull(zoneCdDesc) as [ZONE CD DESC],checkNullNo(polCount) as [POL COUNT],'+
          'negFmt(siAmt) as [SI AMT],negFmt(premAmt) as [PREM AMT],negFmt(avRiskAmt) as [AV RISK AMT],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR044N'){
          this.passDataCsv = data['listPolr044n'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(lineCd) as [LINE CD],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],isNull(cedingId) as [CEDING ID],'+
          'isNull(cedingName) as [CEDING NAME],myFormat(inceptDate) as [INCEPT DATE],myFormat(expiryDate) as [EXPIRY DATE],'+
          'isNull(insuredDesc) as [INSURED DESC],isNull(projectDesc) as [PROJECT DESC],isNull(currencyCd) as [CURRENCY CD],'+
          'negFmt(siAmt) as [SI AMT],negFmt(premAmt) as [PREM AMT],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR044OA'){
          this.passDataCsv = data['listPolr044oa'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE],'+
          'currencyCd as [CURRENCY],cedingName as [COMPANY],cedingId as [CEDING ID],negFmt(polCount) AS [NO of POLICY],negFmt(currency(siAmt)) AS [SUM INSURED], negFmt(currency(premAmt)) AS [PREMIUM],'+
          'negFmt(lossPdCount) AS [NO of PAID], negFmt(currency(lossPaid)) AS [LOSSES PAID], negFmt(lossOsCount) AS [NO of OS], negFmt(currency(lossOs)) AS [O/S LOSSES]';
        }else if(this.params.reportId == 'POLR044OB'){
          this.passDataCsv = data['listPolr044ob'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE],'+
          'currencyCd as [CURRENCY],insuredName as [INSURED],checkNullNo(insuredId) as [INSURED ID],negFmt(polCount) AS [NO of POLICY],negFmt(currency(siAmt)) AS [SUM INSURED], negFmt(currency(premAmt)) AS [PREMIUM],'+
          'negFmt(lossPdCount) AS [NO of PAID], negFmt(currency(lossPaid)) AS [LOSSES PAID], negFmt(lossOsCount) AS [NO of OS], negFmt(currency(lossOs)) AS [O/S LOSSES]';
        }else if(this.params.reportId == 'POLR044P'){
          this.passDataCsv = data['listPolr044p'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],myFormat(fromDate) as [FROM DATE],'+
          'myFormat(toDate) as [TO DATE],isNull(lineCd) as [LINE CD],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],'+
          'isNull(cedingId) as [CEDING ID],isNull(cedingAbbr) as [CEDING ABBR],isNull(cedingName) as [CEDING NAME],myFormat(inceptDate) as [INCEPT DATE],'+
          'myFormat(expiryDate) as [EXPIRY DATE],myFormat(acctEntDate) as [ACCT ENT DATE],negFmt(accumNoDays) as [ACCUM NO DAYS],'+
          'negFmt(totalNoDays) as [TOTAL NO DAYS],negFmt(noOfMonths) as [NO OF MONTHS],checkNullNo(cityCd) as [CITY CD],isNull(cityDesc) as [CITY DESC],'+
          'checkNullNo(zoneCd) as [ZONE CD],isNull(zoneCdDesc) as [ZONE CD DESC],isNull(currencyCd) as [CURRENCY CD],negFmt(polSi) as [POL SI],'+
          'negFmt(polPrem) as [POL PREM],negFmt(polAccumSi) as [POL ACCUM SI],negFmt(polAccumPrem) as [POL ACCUM PREM],checkNullNo(treatyId) as [TREATY ID],'+
          'isNull(treatyName) as [TREATY NAME],isNull(trtyCedId) as [TRTY CED ID],isNull(treatyCompany) as [TREATY COMPANY],checkNullNo(retLayer) as [RET LAYER],'+
          'isNull(retName) as [RET NAME],isNull(distGrp) as [DIST GRP],negFmt(distSi) as [DIST SI],negFmt(distPrem) as [DIST PREM],'+
          'negFmt(distAccumSi) as [DIST ACCUM SI],negFmt(distAccumPrem) as [DIST ACCUM PREM]';
        }else if(this.params.reportId == 'POLR044Q'){
          // this.passDataCsv = data['listPolr044q'];
          // query = 'SELECT extractUser as [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE], myFormat(fromDate) as [FROM DATE], myFormat(toDate) as [TO DATE], isNull(cedingIdParam) as [CEDING ID PARAM], myFormat(inceptDate) as [INCEPT DATE],'+
          // 'myFormat(expiryDate) as [EXPIRY DATE], lineCd as [LINE], policyId as [POLICY ID], policyNo as [POLICY NO], isNull(cedingId) as [CEDING ID], isNull(cedingName) as [CEDING NAME],'+
          // 'checkNullNo(zoneCd) as [ZONE CD], currencyCd as [CURRENCY], negFmt(currency(pctPml)) as [PCT PML], negFmt(accumNoDays) as [ACCUM NO DAYS], negFmt(totalNoDays) as [TOTAL NO DAYS],'+
          // 'treatyId as [TREATY ID], treatyName as [TREATY NAME], isNull(trtyCedId) as [TREATY CED ID],isNull(treatyCompany) as [TREATY COMPANY], isNull(retLayer) as [RET LAYER],'+
          // 'isNull(retName) as [RET NAME], isNull(distGrp) AS [DIST GRP],negFmt(currency(siAmt)) as [SI AMT], negFmt(currency(accumSiAmt)) as [ACCUM SI AMT],'+
          // 'negFmt(currency(premAmt)) as [PREM AMT],negFmt(currency(accumPremAmt)) as [ACCUM PREM AMT]';
          var tab1 : any[] =[];
          var tab2 : any[] =[];
          var res1 =  data['listPolr044q'];
          var res2 =  data['listPolr044q2'];

          res1.forEach(e => {
            checkNull(e);
          });

          res2.forEach(e => {
            checkNull(e);
          });

          res1.forEach(e => {
              tab1.push(Object.keys(e).reduce((c, k) => (c[k.replace(/([A-Z])/g, function($1){return " "+$1.toLowerCase()}).toUpperCase()] = e[k], c), {}));
          });
           
          res2.forEach(e => {
              tab2.push(Object.keys(e).reduce((c, k) => (c[k.replace(/([A-Z])/g, function($1){return " "+$1.toLowerCase()}).toUpperCase()] = e[k], c), {}));
          });

          console.log(tab1);
          console.log(tab2);

          this.export(tab1,tab2);
        }else if(this.params.reportId == 'POLR044R'){
          this.passDataCsv = data['listPolr044r'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],isNull(lineCd) as [LINE CD],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],negFmt(currency(tsiAmt)) as [TSI AMT],isNull(cedingId) as [CEDING ID],'+
          'isNull(cedingName) as [CEDING NAME],negFmt(currency(premTotal)) as [PREM TOTAL],negFmt(currency(premQuota)) as [PREM QUOTA],'+
          'negFmt(currency(premQuotaRet1)) as [PREM QUOTA RET1],negFmt(currency(premQuotaRet2)) as [PREM QUOTA RET2],negFmt(currency(prem1stSurplus)) as [PREM 1ST SURPLUS],'+
          'negFmt(currency(prem2ndSurplus)) as [PREM 2ND SURPLUS],negFmt(currency(premFacul)) as [PREM FACUL],checkNullNo(siRange) as [SI RANGE],'+
          'isNull(amtRangeDesc) as [AMT RANGE DESC],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
          // 'negFmt(currency(amtRangeFrom)) as [AMT RANGE FROM],negFmt(currency(amtRangeTo)) as [AMT RANGE TO],isNull(dateParam) as [DATE PARAM],'+
          // 'isNull(dateRange) as [DATE RANGE],isNull(incRecTag) as [INC REC TAG]';
        }else if(this.params.reportId == 'POLR044S'){
          this.passDataCsv = data['listPolr044s'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],isNull(lineCd) as [LINE CD],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],negFmt(currency(tsiAmt)) as [TSI AMT],isNull(cedingId) as [CEDING ID],'+
          'isNull(cedingName) as [CEDING NAME],negFmt(currency(siTotal)) as [SI TOTAL],negFmt(currency(siQuota)) as [SI QUOTA],'+
          'negFmt(currency(siQuotaRet1)) as [SI QUOTA RET1],negFmt(currency(siQuotaRet2)) as [SI QUOTA RET2],negFmt(currency(si1stSurplus)) as [SI 1ST SURPLUS],'+
          'negFmt(currency(si2ndSurplus)) as [SI 2ND SURPLUS],negFmt(currency(siFacul)) as [SI FACUL],checkNullNo(siRange) as [SI RANGE],'+
          'isNull(amtRangeDesc) as [AMT RANGE DESC], myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
          // 'negFmt(currency(amtRangeFrom)) as [AMT RANGE FROM],negFmt(currency(amtRangeTo)) as [AMT RANGE TO],isNull(dateParam) as [DATE PARAM],'+
          // 'checkNullNo(polCount) as [POL COUNT],isNull(dateRange) as [DATE RANGE],isNull(incRecTag) as [INC REC TAG]';
        }else if(this.params.reportId == 'POLR044V'){
          this.passDataCsv = data['listPolr044v'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE], isNull(lineCd) as [LINE CD],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],'+
          'myFormat(inceptDate) as [INCEPT DATE], myFormat(expiryDate) as [EXPIRY DATE],isNull(insuredDesc) as [NAME OF INSURED],isNull(projectDesc) as [NATURE OF PROJ],'+
          'currencyCd as [CURRENCY], negFmt(currency(siAmt)) as [SUM INSURED], negFmt(currency(premAmt)) as [PREM AMT], checkNullNo(sortSeq) as [SORT SEQ],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR044W'){
          this.passDataCsv = data['listPolr044w'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE],currencyCd as [CURRENCY],checkNullNo(lineSortSeq) as [LINE SORT SEQ], lineCd as [LINE],'+
          'checkNullNo(siRange) as [SI RANGE],amtRangeDesc as [SI RANGE DESC], negFmt(quotIssCnt) as [QUOTED], negFmt(quotConvCnt) as [WRITTEN]';
        }else if(this.params.reportId == 'POLR044X'){
          this.passDataCsv = data['listPolr044x'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],lineCd as [LINE],isNull(cedingId) as [CEDING ID],'+
          'isNull(cedingName) as [COMPANY],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO], isNull(insuredDesc) as [INSURED],'+
          'myFormat(inceptDate) as [INCEPT DATE], myFormat(expiryDate) as [EXPIRY DATE],isNull(currencyCd) as [CURRENCY],'+
          'negFmt(currency(siAmt)) as [SUM INSURED],negFmt(currency(premAmt)) as [PREMIUM], checkNullNo(binderWarranty) as [BINDER WARRANTY(Days)],'+
          'myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE]';
        }else if(this.params.reportId == 'POLR044Y'){
          this.passDataCsv = data['listPolr044y'];
          query = 'SELECT isNull(extractUser) AS [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY],'+
          'checkNullNo(policyId) as [POLICY ID], isNull(policyNo) AS [POLICY NO],isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],'+
          'isNull(lineCd) as [LINE], checkNullNo(prinId) as [PRIN ID], isNull(principalName), checkNullNo(contractorId) as [CONTRACTOR ID], isNull(contractorName) AS [CONTRACTOR NAME],'+
          'myFormat(effDate) AS [EFFECTIVE DATE], myFormat(expiryDate) AS [EXPIRY DATE], myFormat(acctDate) AS [ACCT DATE],'+
          'checkNullNo(distId) AS [DIST ID], checkNullNo(histNo) AS [HIST NO], checkNullNo(instNo) AS [INST NO],'+
          'negFmt(currency(tsiAmt)) as [SUM INSURED],negFmt(currency(tsiQuota)) as [SI QUOTA],negFmt(currency(tsi1stRet)) as [SI 1st RET],'+
          'negFmt(currency(tsi2ndRet)) as [SI 2nd RET],negFmt(currency(tsi1stSurplus)) as [SI 1st SURPLUS],negFmt(currency(tsi2ndSurplus)) as [SI 2nd SURPLUS],'+
          'negFmt(currency(tsiFacul)) as [SI FACUL], negFmt(currency(premAmt)) as [PREMIUM], negFmt(currency(premQuota)) as [PREM QUOTA], negFmt(currency(prem1stRet)) as [PREM 1st RET],'+
          'negFmt(currency(prem2ndRet)) as [PREM 2nd RET],negFmt(currency(prem1stSurplus)) as [PREM 1st SURPLUS], negFmt(currency(prem2ndSurplus)) as [PREM 2nd SURPLUS],negFmt(currency(premFacul)) as [PREM FACUL],'+
          'negFmt(currency(commAmt)) as [COMMISSION], negFmt(currency(commQuota)) as [COMM QUOTA], negFmt(currency(comm1stRet)) as [COMM 1st RET],'+
          'negFmt(currency(comm2ndRet)) as [COMM 2nd RET],negFmt(currency(comm1stSurplus)) as [COMM 1st SURPLUS], negFmt(currency(comm2ndSurplus)) as [COMM 2nd SURPLUS],negFmt(currency(commFacul)) as [COMM FACUL],'+
          'negFmt(currency(commVatAmt)) as [VAT on RI COMM], negFmt(currency(commVatQuota)) as [VAT on RI QUOTA], negFmt(currency(commVat1stRet)) as [VAT on RI 1st RET],'+
          'negFmt(currency(commVat2ndRet)) as [VAT on RI 2nd RET],negFmt(currency(commVat1stSurplus)) as [VAT on RI 1st SURPLUS], negFmt(currency(commVat2ndSurplus)) as [VAT on RI 2nd SURPLUS],negFmt(currency(commVatFacul)) as [VAT on RI FACUL],'+
          'negFmt(currency(netDueAmt)) as [NET DUE], negFmt(currency(netDueQuota)) as [NET DUE QUOTA], negFmt(currency(netDue1stRet)) as [NET DUE 1st RET],'+
          'negFmt(currency(netDue2ndRet)) as [NET DUE 2nd RET],negFmt(currency(netDue1stSurplus)) as [NET DUE 1st SURPLUS], negFmt(currency(netDue2ndSurplus)) as [NET DUE 2nd SURPLUS],negFmt(currency(netDueFacul)) as [COMM FACUL],'+
          'myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE]';
        }else if(this.params.reportId == 'POLR044YA'){
          this.passDataCsv = data['listPolr044ya'];
          query = 'SELECT extractUser as [PRINTED BY], isNull(cedingId) as [CEDING ID], isNull(cedingName) as [CEDING NAME], currency as [CURRENCY], policyId as [POLICY ID],' +
          'instNo AS [INST NO], policyNo as [POLICY NO/INST NO], isNull(policyRef) as [POLICY REF], checkNullNo(prinId) as [PRIN ID], checkNullNo(contractorId) as [CONTRACTOR ID],'+
          'isNull(insured) as [INSURED], negFmt(currency(premium)) as [PREMIUM], negFmt(currency(commission)) as [COMMISSION], negFmt(currency(vatOnComm)) as [VAT ON COMM],'+
          'negFmt(currency(netDue)) as [NET DUE], myFormat(dueDate) as [DUE DATE], myFormat(bookingDate) as [BOOKING DATE], paramDate as [AS OF]';
        }else if(this.params.reportId == 'POLR044Z'){
          this.passDataCsv = data['listPolr044z'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE], checkNullNo(policyId) as [POLICY ID], policyNo as [POLICY NO],'+
          'currencyCd as [CURRENCY CD], myFormat(bookingDate) as [BOOKING DATE],negFmt(pctShare) as [% SHARE],negFmt(currency(premAmt)) as [PREM AMT],negFmt(currency(tsiAmt)) as [TSI AMT],'+
          'negFmt(currency(hundredPremAmt)) as [HUNDRED PREM AMT], negFmt(currency(hundredTsiAmt)) as [HUNDRED TSI AMT],negFmt(currency(mioPremAmt)) as [MIO PREM AMT],'+
          'negFmt(currency(mioTsiAmt)) as [MIO TSI AMT],negFmt(currency(hundredMioPremAmt)) as [HUNDRED MIO PREM AMT], negFmt(currency(hundredMioTsiAmt)) as [HUNDRED MIO TSIAMT]';
        }else if(this.params.reportId == 'POLR044U'){
          this.passDataCsv = data['listPolr044u'];
          query = 'SELECT extractUser as [EXTRACT USER],extractDate as [EXTRACT DATE],uwYear as [UW YEAR],truncDate(transactDate) as [TRANSACT DATE],currencyCd as [CURRENCY CD],'+
          'checkNullNo(treatyId) as [TREATY ID], isNull(treatyName) as [TREATY NAME], checkNullNo(retLayer) as [RET LAYER],isNull(retLayerDesc) as [RET LAYER DESC], trtyCedId as [TRTY CED ID],'+
          'isNull(trtyCedName) as [TRTY CED NAME],negFmt(currency(premAmt)) as [PREM AMT],negFmt(currency(commAmt)) as [COMM AMT],negFmt(currency(riCommVat)) as [RI COMM VAT],negFmt(currency(lossAmt)) as [LOSS AMT],'+
          'negFmt(currency(paidLoss)) as [PAID LOSS],negFmt(currency(incurredLoss)) as [INCURRED LOSS],negFmt(currency(lossRatio)) as [LOSS RATIO],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
          // 'isNull(lineCdParam) as [LINE CD PARAM],isNull(cedingIdParam) as [CEDING ID PARAM],isNull(dateParam) as [DATE PARAM],isNull(dateRange) as [DATE RANGE],'+
          // 'isNull(incRecTag) as [INC REC TAG],'
        }
        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);
        });
    //}
  }
}


                   
                   
                   