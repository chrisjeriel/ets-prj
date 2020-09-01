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
  selector: 'app-pol-bordereaux',
  templateUrl: './pol-bordereaux.component.html',
  styleUrls: ['./pol-bordereaux.component.css']
})
export class PolBordereauxComponent implements OnInit {

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
    byMonthToYear: '',
    faculTag : 'Y'
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
    faculTag : 'Y'
  };

  /*repExtractions: Array<string> = [
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
                        'POLR044J_ISS',
                        'POLR044J_RET',
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
                        ];*/

  repExtractions: Array<string> = [
                        'POLR052A',
                        'POLR052B',
                        'POLR052C',
                        'POLR052AA',
                        'POLR052BA',
                        'POLR052CA',
                        'POLR052D',
                        'POLR052E',
                        'POLR052F',
                        'POLR052G',
                        'POLR052H',
                        'POLR052I'
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

  passDataCsv : any[] = [];

  constructor(private ms: MaintenanceService, private ns: NotesService, private printService: PrintService, public modalService: NgbModal,  private decimal : DecimalPipe, private router:Router) { }

  ngOnInit() {
    this.passLov.modReportId = 'POLR052%';
  	this.loading = false;
  }

  getReports(){
    this.passLov.reportId = 'POLR052%';
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
    }

    if (this.repExtractions.indexOf(this.params.reportId) > -1) {
      this.extractDisabled = false;
    } else {
      this.extractDisabled = true;
    }

    if(this.params.reportId == 'POLR052A' || this.params.reportId == 'POLR052AA'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.checkMonthYear();
    } else if(this.params.reportId == 'POLR052B' || this.params.reportId == 'POLR052BA'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.checkMonthYear();
    } else if(this.params.reportId == 'POLR052C' || this.params.reportId == 'POLR052CA'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.checkMonthYear();
    } else if(this.params.reportId == 'POLR052D'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byDate', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
    } else if(this.params.reportId == 'POLR052E'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byDate', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
    } else if(this.params.reportId == 'POLR052F'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byDate', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
    } else if(this.params.reportId == 'POLR052G'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byDate', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
    } else if(this.params.reportId == 'POLR052H'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byDate', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
    }else if(this.params.reportId == 'POLR052I'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byDate', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.faculTag = 'Y';
    }

    this.ns.lovLoader(data.ev, 0);
  }

  checkReport(){

  }

  checkMonthYear(){

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
    this.sendData.incRecTag = 'D'; //this.params.incRecTag;
    this.sendData.destination = this.params.destination;
    this.sendData.faculTag = this.params.faculTag;
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

    if(this.params.reportId == 'POLR052I' && !this.params.cedingId){
      this.dialogIcon = "warning-message";  
      this.dialogMessage = "Please select company.";
      this.appDialog.open();
      return;
    }

    this.loading = true;
    this.prepareData();
    console.log(this.params.reportId);
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
      "polr044Params.cedingIdParam" : this.sendData.cedingIdParam,
      "polr044Params.lineCdParam" :   this.sendData.lineCdParam,
      "polr044Params.incRecTag" :   this.sendData.incRecTag,
      "polr044Params.reportId"  :   this.sendData.reportId,
    }

    this.printService.print(this.params.destination,this.params.reportId, params);
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
      if(this.params.reportId.indexOf('POLR052') == -1){
        this.passLov.code = 'POLR052%';
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

   getExtractToCsv(){
    console.log(this.params.reportId);
    console.log(this.ns.getCurrentUser() + ' >> current user');
    this.ms.getExtractToCsv(this.ns.getCurrentUser(),this.params.reportId)
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
          // return (m==null || m=='')?0:(Number(String(m).replace(',',''))<0?('('+String(m).replace('-','')+')'):isNaN(Number(String(m).replace(',','')))?'0.00':m);
          // return (m==null || m=='')?0:(Number(String(m).replace(/,/g, ''))<0?('('+String(m).replace(/-/g, '')+')'):isNaN(Number(String(m).replace(/,/g, '')))?'0.00':m);
          return (m==null || m=='') ? 0 : Number(m);
        };

        alasql.fn.isNull = function(n){
          return n==null?'':n;
        };

        alasql.fn.checkNullNo = function(o){
          return (o==null || o=='')?'': Number(o);
        };

        var name = this.params.reportId;
        var query = '';

        if(this.params.reportId == 'POLR052A'){
          this.passDataCsv = data['listPolr052a'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(lineCd) as [LINE CD],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],checkNullNo(instNo) as [INST NO],isNull(currencyCd) as [CURRENCY CD],'+
          'negFmt(totalPrem) as [TOTAL PREM],negFmt(premQuota) as [PREM QUOTA],negFmt(prem1stRet) as [PREM 1ST RET],'+
          'negFmt(prem2ndRet) as [PREM 2ND RET],negFmt(prem1stSurplus) as [PREM 1ST SURPLUS],negFmt(prem2ndSurplus) as [PREM 2ND SURPLUS],'+
          'negFmt(premFacul) as [PREM FACUL],negFmt(totalComm) as [TOTAL COMM],negFmt(commQuota) as [COMM QUOTA],'+
          'negFmt(comm1stRet) as [COMM 1ST RET],negFmt(comm2ndRet) as [COMM 2ND RET],negFmt(comm1stSurplus) as [COMM 1ST SURPLUS],'+
          'negFmt(comm2ndSurplus) as [COMM 2ND SURPLUS],negFmt(commFacul) as [COMM FACUL],negFmt(totalVatri) as [TOTAL VATRI],'+
          'negFmt(vatriQuota) as [VATRI QUOTA],negFmt(vatri1stRet) as [VATRI 1ST RET],negFmt(vatri2ndRet) as [VATRI 2ND RET],'+
          'negFmt(vatri1stSurplus) as [VATRI 1ST SURPLUS],negFmt(vatri2ndSurplus) as [VATRI 2ND SURPLUS],negFmt(vatriFacul) as [VATRI FACUL],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052AA'){
          this.passDataCsv = data['listPolr052aa'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE],currencyCd as [CURRENCY],'+
          'lineCd as [LINE], policyId as [POLICY ID], policyNo || "/" || instNo as [POLICY NO/INST NO],'+
          'negFmt(currency(premQsMre)) as [PREM QS MRe], negFmt(currency(premQsNre)) as [PREM QS NRe], negFmt(currency(premQsRet1)) as [PREM QS RET1], negFmt(currency(premQsRet2)) as [PREM QS RET2],'+
          'negFmt(currency(prem1spMre)) as [PREM 1st SP MRe], negFmt(currency(prem1spNre)) as [PREM 1st SP NRe], negFmt(currency(prem2spMre)) as [PREM 2nd SP MRe], negFmt(currency(prem2spNre)) as [PREM 2nd SP NRe],'+
          'negFmt(currency(premFaculMre)) as [PREM FACUL MRe],negFmt(currency(premFaculNre)) as [PREM FACUL NRe],'+
          'negFmt(currency(commQsMre)) as [COMM QS MRe], negFmt(currency(commQsNre)) as [COMM QS NRe], negFmt(currency(commQsRet1)) as [COMM QS RET1], negFmt(currency(commQsRet2)) as [COMM QS RET2],'+
          'negFmt(currency(comm1spMre)) as [COMM 1st SP MRe], negFmt(currency(comm1spNre)) as [COMM 1st SP NRe], negFmt(currency(comm2spMre)) as [COMM 2nd SP MRe], negFmt(currency(comm2spNre)) as [COMM 2nd SP NRe],'+
          'negFmt(currency(commFaculMre)) as [COMM FACUL MRe],negFmt(currency(commFaculNre)) as [COMM FACUL NRe],'+
          'negFmt(currency(vatriQsMre)) as [VAT RI QS MRe], negFmt(currency(vatriQsNre)) as [VAT RI QS NRe], negFmt(currency(vatriQsRet1)) as [VAT RI QS RET1], negFmt(currency(vatriQsRet2)) as [VAT RI QS RET2],'+
          'negFmt(currency(vatri1spMre)) as [VAT RI 1st SP MRe], negFmt(currency(vatri1spNre)) as [VAT RI 1st SP NRe], negFmt(currency(vatri2spMre)) as [VAT RI 2nd SP MRe], negFmt(currency(vatri2spNre)) as [VAT RI 2nd SP NRe],'+
          'negFmt(currency(vatriFaculMre)) as [VAT RI FACUL MRe],negFmt(currency(vatriFaculNre)) as [VAT RI FACUL NRe],'+
          'negFmt(currency(netbalQsMre)) as [NET BAL QS MRe], negFmt(currency(netbalQsNre)) as [NET BAL QS NRe], negFmt(currency(netbalQsRet1)) as [NET BAL QS RET1], negFmt(currency(netbalQsRet2)) as [NET BAL QS RET2],'+
          'negFmt(currency(netbal1spMre)) as [NET BAL 1st SP MRe], negFmt(currency(netbal1spNre)) as [NET BAL 1st SP NRe], negFmt(currency(netbal2spMre)) as [NET BAL 2nd SP MRe], negFmt(currency(netbal2spNre)) as [NET BAL 2nd SP NRe],'+
          'negFmt(currency(netbalFaculMre)) as [NET BAL FACUL MRe],negFmt(currency(netbalFaculNre)) as [NET BAL FACUL NRe],'+
          'negFmt(currency(totalPremMre)) as [TOTAL PREM MRe], negFmt(currency(totalPremNre)) as [TOTAL PREM NRe], negFmt(currency(totalPremCedants)) as [TOTAL PREM CEDANTS], negFmt(currency(totalPrem)) as [TOTAL PREMIUM],'+
          'negFmt(currency(totalCommMre)) as [TOTAL COMM MRe], negFmt(currency(totalCommNre)) as [TOTAL COMM NRe], negFmt(currency(totalCommCedants)) as [TOTAL COMM CEDANTS], negFmt(currency(totalComm)) as [TOTAL COMM],'+
          'negFmt(currency(totalVatriMre)) as [TOTAL VAT RI MRe], negFmt(currency(totalVatriNre)) as [TOTAL VAT RI NRe], negFmt(currency(totalVatriCedants)) as [TOTAL VAT RI CEDANTS], negFmt(currency(totalVatri)) as [TOTAL VAT RI],'+
          'negFmt(currency(totalNetbalMre)) as [TOTAL NET BAL MRe], negFmt(currency(totalNetbalNre)) as [TOTAL NET BAL NRe], negFmt(currency(totalNetbalCedants)) as [TOTAL NET BAL CEDANTS], negFmt(currency(totalNetbal)) as [TOTAL NET BAL]';
        }else if(this.params.reportId == 'POLR052AB'){
          this.passDataCsv = data['listPolr052ab'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(lineCd) as [LINE CD],isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],checkNullNo(instNo) as [INST NO],'+
          'negFmt(prem1stRet) as [PREM 1ST RET],negFmt(prem2ndRet) as [PREM 2ND RET],negFmt(premTotalRet) as [PREM TOTAL RET],'+
          'negFmt(comm1stRet) as [COMM 1ST RET],negFmt(comm2ndRet) as [COMM 2ND RET],negFmt(commTotalRet) as [COMM TOTAL RET],'+
          'negFmt(vatri1stRet) as [VATRI 1ST RET],negFmt(vatri2ndRet) as [VATRI 2ND RET],negFmt(vatriTotalRet) as [VATRI TOTAL RET],'+
          'negFmt(netbal1stRet) as [NETBAL 1ST RET],negFmt(netbal2ndRet) as [NETBAL 2ND RET],negFmt(netbalTotalRet) as [NETBAL TOTAL RET],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052B'){
          this.passDataCsv = data['listPolr052b'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(lineCd) as [LINE CD],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],checkNullNo(instNo) as [INST NO],'+
          'isNull(coRefNo) as [CO REF NO],isNull(currencyCd) as [CURRENCY CD],isNull(cedingId) as [CEDING ID],'+
          'isNull(cedingAbbr) as [CEDING ABBR],isNull(insuredDesc) as [INSURED DESC],myFormat(inceptDate) as [INCEPT DATE],'+
          'myFormat(expiryDate) as [EXPIRY DATE],checkNullNo(ret1Lines) as [RET1 LINES],checkNullNo(ret2Lines) as [RET2 LINES],'+
          'negFmt(totalSi) as [TOTAL SI],negFmt(totalPrem) as [TOTAL PREM],negFmt(premQuota) as [PREM QUOTA],'+
          'negFmt(prem1stRet) as [PREM 1ST RET],negFmt(prem2ndRet) as [PREM 2ND RET],negFmt(prem1stSurplus) as [PREM 1ST SURPLUS],'+
          'negFmt(prem2ndSurplus) as [PREM 2ND SURPLUS],negFmt(premFacul) as [PREM FACUL],negFmt(totalComm) as [TOTAL COMM],'+
          'negFmt(commQuota) as [COMM QUOTA],negFmt(comm1stRet) as [COMM 1ST RET],negFmt(comm2ndRet) as [COMM 2ND RET],'+
          'negFmt(comm1stSurplus) as [COMM 1ST SURPLUS],negFmt(comm2ndSurplus) as [COMM 2ND SURPLUS],negFmt(commFacul) as [COMM FACUL],'+
          'negFmt(totalVatri) as [TOTAL VATRI],negFmt(vatriQuota) as [VATRI QUOTA],negFmt(vatri1stRet) as [VATRI 1ST RET],'+
          'negFmt(vatri2ndRet) as [VATRI 2ND RET],negFmt(vatri1stSurplus) as [VATRI 1ST SURPLUS],'+
          'negFmt(vatri2ndSurplus) as [VATRI 2ND SURPLUS],negFmt(vatriFacul) as [VATRI FACUL],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052BA'){
          this.passDataCsv = data['listPolr052ba'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE],currencyCd as [CURRENCY],'+
          'lineCd as [LINE], policyId as [POLICY ID], policyNo || "/" || instNo as [POLICY NO/INST NO], isNull(coRefNo) as [CO REF NO],'+
          'isNull(cedingId) as [CEDING ID], isNull(cedingAbbr) as [COMPANY], isNull(insuredDesc) as [INSURED], myFormat(inceptDate) || " to " || myFormat(expiryDate) as [PERIOD],'+
          'negFmt(currency(totalSi)) as [SUM INSURED], negFmt(currency(ret1Lines)) as [1st RET], negFmt(currency(ret2Lines)) as [2nd RET],'+
          'negFmt(currency(premQsMre)) as [PREM QS MRe], negFmt(currency(premQsNre)) as [PREM QS NRe], negFmt(currency(premQsRet1)) as [PREM QS RET1], negFmt(currency(premQsRet2)) as [PREM QS RET2],'+
          'negFmt(currency(prem1spMre)) as [PREM 1st SP MRe], negFmt(currency(prem1spNre)) as [PREM 1st SP NRe], negFmt(currency(prem2spMre)) as [PREM 2nd SP MRe], negFmt(currency(prem2spNre)) as [PREM 2nd SP NRe],'+
          'negFmt(currency(premFaculMre)) as [PREM FACUL MRe],negFmt(currency(premFaculNre)) as [PREM FACUL NRe],'+
          'negFmt(currency(commQsMre)) as [COMM QS MRe], negFmt(currency(commQsNre)) as [COMM QS NRe], negFmt(currency(commQsRet1)) as [COMM QS RET1], negFmt(currency(commQsRet2)) as [COMM QS RET2],'+
          'negFmt(currency(comm1spMre)) as [COMM 1st SP MRe], negFmt(currency(comm1spNre)) as [COMM 1st SP NRe], negFmt(currency(comm2spMre)) as [COMM 2nd SP MRe], negFmt(currency(comm2spNre)) as [COMM 2nd SP NRe],'+
          'negFmt(currency(commFaculMre)) as [COMM FACUL MRe],negFmt(currency(commFaculNre)) as [COMM FACUL NRe],'+
          'negFmt(currency(vatriQsMre)) as [VAT RI QS MRe], negFmt(currency(vatriQsNre)) as [VAT RI QS NRe], negFmt(currency(vatriQsRet1)) as [VAT RI QS RET1], negFmt(currency(vatriQsRet2)) as [VAT RI QS RET2],'+
          'negFmt(currency(vatri1spMre)) as [VAT RI 1st SP MRe], negFmt(currency(vatri1spNre)) as [VAT RI 1st SP NRe], negFmt(currency(vatri2spMre)) as [VAT RI 2nd SP MRe], negFmt(currency(vatri2spNre)) as [VAT RI 2nd SP NRe],'+
          'negFmt(currency(vatriFaculMre)) as [VAT RI FACUL MRe],negFmt(currency(vatriFaculNre)) as [VAT RI FACUL NRe],'+
          'negFmt(currency(netbalQsMre)) as [NET BAL QS MRe], negFmt(currency(netbalQsNre)) as [NET BAL QS NRe], negFmt(currency(netbalQsRet1)) as [NET BAL QS RET1], negFmt(currency(netbalQsRet2)) as [NET BAL QS RET2],'+
          'negFmt(currency(netbal1spMre)) as [NET BAL 1st SP MRe], negFmt(currency(netbal1spNre)) as [NET BAL 1st SP NRe], negFmt(currency(netbal2spMre)) as [NET BAL 2nd SP MRe], negFmt(currency(netbal2spNre)) as [NET BAL 2nd SP NRe],'+
          'negFmt(currency(netbalFaculMre)) as [NET BAL FACUL MRe],negFmt(currency(netbalFaculNre)) as [NET BAL FACUL NRe],'+
          'negFmt(currency(totalPremMre)) as [TOTAL PREM MRe], negFmt(currency(totalPremNre)) as [TOTAL PREM NRe], negFmt(currency(totalPremCedants)) as [TOTAL PREM CEDANTS], negFmt(currency(totalPrem)) as [TOTAL PREMIUM],'+
          'negFmt(currency(totalCommMre)) as [TOTAL COMM MRe], negFmt(currency(totalCommNre)) as [TOTAL COMM NRe], negFmt(currency(totalCommCedants)) as [TOTAL COMM CEDANTS], negFmt(currency(totalComm)) as [TOTAL COMM],'+
          'negFmt(currency(totalVatriMre)) as [TOTAL VAT RI MRe], negFmt(currency(totalVatriNre)) as [TOTAL VAT RI NRe], negFmt(currency(totalVatriCedants)) as [TOTAL VAT RI CEDANTS], negFmt(currency(totalVatri)) as [TOTAL VAT RI],'+
          'negFmt(currency(totalNetbalMre)) as [TOTAL NET BAL MRe], negFmt(currency(totalNetbalNre)) as [TOTAL NET BAL NRe], negFmt(currency(totalNetbalCedants)) as [TOTAL NET BAL CEDANTS], negFmt(currency(totalNetbal)) as [TOTAL NET BAL]';
        }else if(this.params.reportId == 'POLR052BB'){
          this.passDataCsv = data['listPolr052bb'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(lineCd) as [LINE CD],isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],checkNullNo(instNo) as [INST NO],'+
          'isNull(coRefNo) as [CO REF NO],isNull(polCedingId) as [POL CEDING ID],isNull(polCedingName) as [POL CEDING NAME],'+
          'isNull(insuredDesc) as [INSURED DESC],myFormat(inceptDate) as [INCEPT DATE],myFormat(expiryDate) as [EXPIRY DATE],'+
          'checkNullNo(polRet1Lines) as [POL RET1 LINES],checkNullNo(polRet2Lines) as [POL RET2 LINES],'+
          'checkNullNo(shrRet1Lines) as [SHR RET1 LINES],checkNullNo(shrRet2Lines) as [SHR RET2 LINES],'+
          'negFmt(totalSi) as [TOTAL SI],negFmt(prem1stRet) as [PREM 1ST RET],negFmt(prem2ndRet) as [PREM 2ND RET],'+
          'negFmt(premTotalRet) as [PREM TOTAL RET],negFmt(comm1stRet) as [COMM 1ST RET],negFmt(comm2ndRet) as [COMM 2ND RET],'+
          'negFmt(commTotalRet) as [COMM TOTAL RET],negFmt(vatri1stRet) as [VATRI 1ST RET],negFmt(vatri2ndRet) as [VATRI 2ND RET],'+
          'negFmt(vatriTotalRet) as [VATRI TOTAL RET],negFmt(netbal1stRet) as [NETBAL 1ST RET],negFmt(netbal2ndRet) as [NETBAL 2ND RET],'+
          'negFmt(netbalTotalRet) as [NETBAL TOTAL RET],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052C'){
          this.passDataCsv = data['listPolr052c'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(lineCd) as [LINE CD],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],checkNullNo(instNo) as [INST NO],'+
          'isNull(coRefNo) as [CO REF NO],isNull(currencyCd) as [CURRENCY CD],isNull(cedingId) as [CEDING ID],'+
          'isNull(cedingAbbr) as [CEDING ABBR],isNull(insuredDesc) as [INSURED DESC],myFormat(inceptDate) as [INCEPT DATE],'+
          'myFormat(expiryDate) as [EXPIRY DATE],checkNullNo(ret1Lines) as [RET1 LINES],checkNullNo(ret2Lines) as [RET2 LINES],'+
          'negFmt(totalSi) as [TOTAL SI],negFmt(totalPrem) as [TOTAL PREM],negFmt(premQuota) as [PREM QUOTA],'+
          'negFmt(prem1stRet) as [PREM 1ST RET],negFmt(prem2ndRet) as [PREM 2ND RET],negFmt(prem1stSurplus) as [PREM 1ST SURPLUS],'+
          'negFmt(prem2ndSurplus) as [PREM 2ND SURPLUS],negFmt(premFacul) as [PREM FACUL],negFmt(totalComm) as [TOTAL COMM],'+
          'negFmt(commQuota) as [COMM QUOTA],negFmt(comm1stRet) as [COMM 1ST RET],negFmt(comm2ndRet) as [COMM 2ND RET],'+
          'negFmt(comm1stSurplus) as [COMM 1ST SURPLUS],negFmt(comm2ndSurplus) as [COMM 2ND SURPLUS],'+
          'negFmt(commFacul) as [COMM FACUL],negFmt(totalVatri) as [TOTAL VATRI],negFmt(vatriQuota) as [VATRI QUOTA],'+
          'negFmt(vatri1stRet) as [VATRI 1ST RET],negFmt(vatri2ndRet) as [VATRI 2ND RET],'+
          'negFmt(vatri1stSurplus) as [VATRI 1ST SURPLUS],negFmt(vatri2ndSurplus) as [VATRI 2ND SURPLUS],'+
          'negFmt(vatriFacul) as [VATRI FACUL],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052CA'){
          this.passDataCsv = data['listPolr052ca'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE],currencyCd as [CURRENCY],'+
          'lineCd as [LINE], policyId as [POLICY ID], policyNo || "/" || instNo as [POLICY NO/INST NO], isNull(coRefNo) as [CO REF NO],'+
          'isNull(cedingId) as [CEDING ID], isNull(cedingAbbr) as [COMPANY], isNull(insuredDesc) as [INSURED], myFormat(inceptDate) || " to " || myFormat(expiryDate) as [PERIOD],'+
          'negFmt(currency(totalSi)) as [SUM INSURED], negFmt(currency(ret1Lines)) as [1st RET], negFmt(currency(ret2Lines)) as [2nd RET],'+
          'negFmt(currency(premQsMre)) as [PREM QS MRe], negFmt(currency(premQsNre)) as [PREM QS NRe], negFmt(currency(premQsRet1)) as [PREM QS RET1], negFmt(currency(premQsRet2)) as [PREM QS RET2],'+
          'negFmt(currency(prem1spMre)) as [PREM 1st SP MRe], negFmt(currency(prem1spNre)) as [PREM 1st SP NRe], negFmt(currency(prem2spMre)) as [PREM 2nd SP MRe], negFmt(currency(prem2spNre)) as [PREM 2nd SP NRe],'+
          'negFmt(currency(premFaculMre)) as [PREM FACUL MRe],negFmt(currency(premFaculNre)) as [PREM FACUL NRe],'+
          'negFmt(currency(commQsMre)) as [COMM QS MRe], negFmt(currency(commQsNre)) as [COMM QS NRe], negFmt(currency(commQsRet1)) as [COMM QS RET1], negFmt(currency(commQsRet2)) as [COMM QS RET2],'+
          'negFmt(currency(comm1spMre)) as [COMM 1st SP MRe], negFmt(currency(comm1spNre)) as [COMM 1st SP NRe], negFmt(currency(comm2spMre)) as [COMM 2nd SP MRe], negFmt(currency(comm2spNre)) as [COMM 2nd SP NRe],'+
          'negFmt(currency(commFaculMre)) as [COMM FACUL MRe],negFmt(currency(commFaculNre)) as [COMM FACUL NRe],'+
          'negFmt(currency(vatriQsMre)) as [VAT RI QS MRe], negFmt(currency(vatriQsNre)) as [VAT RI QS NRe], negFmt(currency(vatriQsRet1)) as [VAT RI QS RET1], negFmt(currency(vatriQsRet2)) as [VAT RI QS RET2],'+
          'negFmt(currency(vatri1spMre)) as [VAT RI 1st SP MRe], negFmt(currency(vatri1spNre)) as [VAT RI 1st SP NRe], negFmt(currency(vatri2spMre)) as [VAT RI 2nd SP MRe], negFmt(currency(vatri2spNre)) as [VAT RI 2nd SP NRe],'+
          'negFmt(currency(vatriFaculMre)) as [VAT RI FACUL MRe],negFmt(currency(vatriFaculNre)) as [VAT RI FACUL NRe],'+
          'negFmt(currency(netbalQsMre)) as [NET BAL QS MRe], negFmt(currency(netbalQsNre)) as [NET BAL QS NRe], negFmt(currency(netbalQsRet1)) as [NET BAL QS RET1], negFmt(currency(netbalQsRet2)) as [NET BAL QS RET2],'+
          'negFmt(currency(netbal1spMre)) as [NET BAL 1st SP MRe], negFmt(currency(netbal1spNre)) as [NET BAL 1st SP NRe], negFmt(currency(netbal2spMre)) as [NET BAL 2nd SP MRe], negFmt(currency(netbal2spNre)) as [NET BAL 2nd SP NRe],'+
          'negFmt(currency(netbalFaculMre)) as [NET BAL FACUL MRe],negFmt(currency(netbalFaculNre)) as [NET BAL FACUL NRe],'+
          'negFmt(currency(totalPremMre)) as [TOTAL PREM MRe], negFmt(currency(totalPremNre)) as [TOTAL PREM NRe], negFmt(currency(totalPremCedants)) as [TOTAL PREM CEDANTS], negFmt(currency(totalPrem)) as [TOTAL PREMIUM],'+
          'negFmt(currency(totalCommMre)) as [TOTAL COMM MRe], negFmt(currency(totalCommNre)) as [TOTAL COMM NRe], negFmt(currency(totalCommCedants)) as [TOTAL COMM CEDANTS], negFmt(currency(totalComm)) as [TOTAL COMM],'+
          'negFmt(currency(totalVatriMre)) as [TOTAL VAT RI MRe], negFmt(currency(totalVatriNre)) as [TOTAL VAT RI NRe], negFmt(currency(totalVatriCedants)) as [TOTAL VAT RI CEDANTS], negFmt(currency(totalVatri)) as [TOTAL VAT RI],'+
          'negFmt(currency(totalNetbalMre)) as [TOTAL NET BAL MRe], negFmt(currency(totalNetbalNre)) as [TOTAL NET BAL NRe], negFmt(currency(totalNetbalCedants)) as [TOTAL NET BAL CEDANTS], negFmt(currency(totalNetbal)) as [TOTAL NET BAL]';
        }else if(this.params.reportId == 'POLR052CB'){
          this.passDataCsv = data['listPolr052cb'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(lineCd) as [LINE CD],isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],checkNullNo(instNo) as [INST NO],'+
          'isNull(coRefNo) as [CO REF NO],isNull(polCedingId) as [POL CEDING ID],isNull(polCedingName) as [POL CEDING NAME],'+
          'isNull(insuredDesc) as [INSURED DESC],myFormat(inceptDate) as [INCEPT DATE],myFormat(expiryDate) as [EXPIRY DATE],'+
          'checkNullNo(polRet1Lines) as [POL RET1 LINES],checkNullNo(polRet2Lines) as [POL RET2 LINES],'+
          'checkNullNo(shrRet1Lines) as [SHR RET1 LINES],checkNullNo(shrRet2Lines) as [SHR RET2 LINES],'+
          'negFmt(totalSi) as [TOTAL SI],negFmt(prem1stRet) as [PREM 1ST RET],negFmt(prem2ndRet) as [PREM 2ND RET],'+
          'negFmt(premTotalRet) as [PREM TOTAL RET],negFmt(comm1stRet) as [COMM 1ST RET],negFmt(comm2ndRet) as [COMM 2ND RET],'+
          'negFmt(commTotalRet) as [COMM TOTAL RET],negFmt(vatri1stRet) as [VATRI 1ST RET],negFmt(vatri2ndRet) as [VATRI 2ND RET],'+
          'negFmt(vatriTotalRet) as [VATRI TOTAL RET],negFmt(netbal1stRet) as [NETBAL 1ST RET],negFmt(netbal2ndRet) as [NETBAL 2ND RET],'+
          'negFmt(netbalTotalRet) as [NETBAL TOTAL RET],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052D'){
          this.passDataCsv = data['listPolr052d'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE],isNull(lineCd) as [LINE],isNull(currencyCd) as [CURRENCY],'+
          'checkNullNo(policyId) as [POLICY ID], isNull(policyNo) as [POLICY NO], checkNullNo(instNo) as [INST NO],isNull(cedingName) as [COMPANY],myFormat(inceptDate) AS [INCEPT DATE], myFormat(expiryDate) as [EXPIRY DATE],isNull(insuredDesc) as [INSURED],'+
          'contractorName as [CONTRACTOR], negFmt(pctShare) as [% SHARE],negFmt(currency(totalSiAmt)) as [TOTAL SI], negFmt(currency(totalPremAmt)) as [TOTAL PREMIUM],'+
          'negFmt(currency(siFacul)) as [FACUL SI], negFmt(currency(premFacul)) as [FACUL PREMIUM]';
        }else if(this.params.reportId == 'POLR052E'){
          this.passDataCsv = data['listPolr052e'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(tranType) as [TRAN TYPE],'+
          'isNull(tranTypeDesc) as [TRAN TYPE DESC],isNull(currencyCd) as [CURRENCY CD],isNull(lineCd) as [LINE CD],'+
          'isNull(debitMemoNo) as [DEBIT MEMO NO],isNull(memoStatus) as [MEMO STATUS],checkNullNo(policyId) as [POLICY ID],'+
          'isNull(policyNo) as [POLICY NO],checkNullNo(instNo) as [INST NO],isNull(policyRef) as [POLICY REF],'+
          'isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],negFmt(dueFrom) as [DUE FROM],'+
          'negFmt(commAmt) as [COMM AMT],negFmt(vatriComm) as [VATRI COMM],negFmt(premAmt) as [PREM AMT],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052F'){
          this.passDataCsv = data['listPolr052f'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(tranType) as [TRAN TYPE],'+
          'isNull(tranTypeDesc) as [TRAN TYPE DESC],isNull(currencyCd) as [CURRENCY CD],isNull(lineCd) as [LINE CD],'+
          'isNull(debitMemoNo) as [DEBIT MEMO NO],isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],'+
          'checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],checkNullNo(instNo) as [INST NO],'+
          'isNull(policyRef) as [POLICY REF],isNull(insuredDesc) as [INSURED DESC],myFormat(inceptDate) as [INCEPT DATE],'+
          'myFormat(expDate) as [EXP DATE],myFormat(effDate) as [EFF DATE],negFmt(dueFrom) as [DUE FROM],'+
          'negFmt(commAmt) as [COMM AMT],negFmt(vatriComm) as [VATRI COMM],negFmt(premAmt) as [PREM AMT],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052G'){
          this.passDataCsv = data['listPolr052g'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(issuingCedId) as [ISSUING CED ID],isNull(issuingCedName) as [ISSUING CED NAME],isNull(issTinNo) as [ISS TIN NO],'+
          'isNull(issAddress) as [ISS ADDRESS],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],'+
          'checkNullNo(instNo) as [INST NO],isNull(sharingCedId) as [SHARING CED ID],isNull(sharingCedName) as [SHARING CED NAME],'+
          'isNull(shrTinNo) as [SHR TIN NO],isNull(shrAddress) as [SHR ADDRESS],negFmt(shareOnPrem) as [SHARE ON PREM],'+
          'negFmt(shareOnComm) as [SHARE ON COMM],negFmt(shareOnVat) as [SHARE ON VAT],negFmt(shareOnNet) as [SHARE ON NET],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052H'){
          this.passDataCsv = data['listPolr052h'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(sharingCedId) as [SHARING CED ID],isNull(sharingCedName) as [SHARING CED NAME],isNull(shrTinNo) as [SHR TIN NO],'+
          'isNull(shrAddress) as [SHR ADDRESS],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],'+
          'checkNullNo(instNo) as [INST NO],isNull(issuingCedId) as [ISSUING CED ID],isNull(issuingCedName) as [ISSUING CED NAME],'+
          'isNull(issTinNo) as [ISS TIN NO],isNull(issAddress) as [ISS ADDRESS],negFmt(cededPrem) as [CEDED PREM],'+
          'negFmt(cededComm) as [CEDED COMM],negFmt(cededVat) as [CEDED VAT],negFmt(cededNet) as [CEDED NET],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }else if(this.params.reportId == 'POLR052I'){
          this.passDataCsv = data['listPolr052i'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],checkNullNo(policyId) as [POLICY ID],'+
          'isNull(policyNo) as [POLICY NO],checkNullNo(instNo) as [INST NO],isNull(insuredDesc) as [INSURED DESC],'+
          'myFormat(inceptDate) as [INCEPT DATE],myFormat(expiryDate) as [EXPIRY DATE],negFmt(premAmt) as [PREM AMT],'+
          'negFmt(commAmt) as [COMM AMT],negFmt(vatRiComm) as [VAT RI COMM],negFmt(netDue) as [NET DUE],'+
          'myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE]';
        }

        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);

      });
  }

}
