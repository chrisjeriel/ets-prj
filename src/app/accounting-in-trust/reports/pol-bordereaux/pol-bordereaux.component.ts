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

    if(this.params.reportId == 'POLR052A'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.checkMonthYear();
    } else if(this.params.reportId == 'POLR052B'){
      this.paramsToggle.push('accountingDate', 'bookingDate', 'line', 'company', 'byMonthYear', 'currCd');
      this.params.dateParam = '5';
      this.params.dateRange = '2';
      this.checkMonthYear();
    } else if(this.params.reportId == 'POLR052C'){
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
          var date = new Date(d);
          var day = (date.getDate()<10)?"0"+date.getDate():date.getDate();
          var mos = months[date.getMonth()];
          return day+'-'+mos+'-'+date.getFullYear(); 
        };

        alasql.fn.negFmt = function(m){
          return (m==null || m=='')?0:(Number(String(m).replace(',',''))<0?('('+String(m).replace('-','')+')'):isNaN(Number(String(m).replace(',','')))?'0.00':m);
        };


        var name = this.params.reportId;
        var query = '';

        if(this.params.reportId == 'POLR052A'){
          this.passDataCsv = data['listPolr052a'];
          query = 'SELECT extractUser as [EXTRACT USER],lineCd as [LINE],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE],policyNo as [POLICY NO],currencyCd as [CURRENCY],'+
          'totalPrem as [TOTAL PREM],negFmt(currency(premQuota)) as [PREM QUOTA SHARE],negFmt(currency(prem1stRet)) as [PREM 1st RET],'+
          'negFmt(currency(prem2ndRet)) as [PREM 2nd RET], negFmt(currency(prem1stSurplus)) as [PREM 1st SURPLUS],negFmt(currency(prem2ndSurplus)) as [PREM 2nd SURPLUS],'+
          'negFmt(currency(premFacul)) as [PREM FACUL], totalComm as [TOTAL COMM],negFmt(currency(commQuota)) as [COMM QUOTA SHARE],negFmt(currency(comm1stRet)) as [COMM 1st RET],'+
          'negFmt(currency(comm2ndRet)) as [COMM 2nd RET], negFmt(currency(comm1stSurplus)) as [COMM 1st SURPLUS],negFmt(currency(comm2ndSurplus)) as [COMM 2nd SURPLUS],'+
          'negFmt(currency(commFacul)) as [COMM FACUL], totalVatRi as [TOTAL RI COMM VAT],negFmt(currency(vatriQuota)) as [RI COMM VAT QUOTA SHARE],negFmt(currency(vatri1stRet)) as [RI COMM VAT 1st RET],'+
          'negFmt(currency(vatri2ndRet)) as [RI COMM VAT 2nd RET], negFmt(currency(vatri1stSurplus)) as [RI COMM VAT 1st SURPLUS],negFmt(currency(vatri2ndSurplus)) as [RI COMM VAT 2nd SURPLUS],'+
          'negFmt(currency(vatriFacul)) as [RI COMM VAT FACUL]';
        }else if(this.params.reportId == 'POLR052B'){
          this.passDataCsv = data['listPolr052b'];
          query = 'SELECT extractUser as [EXTRACT USER],lineCd as [LINE],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE],policyNo as [POLICY NO],instNo as [INST NO],'+
          'cedingAbbr as [COMPANYY],insuredDesc as [INSURED],myFormat(inceptDate) || " to " ||myFormat(expiryDate) as [PERIOD],negFmt(currency(totalSi)) as [TOTAL SUM INSURED],'+
          'negFmt(ret1Lines) as [1st RET],negFmt(ret2Lines) as [2nd RET],negFmt(currency(totalPrem)) as [TOTAL PREMIUM],negFmt(currency(premQuota)) as [PREM QUOTA SHARE],negFmt(currency(prem1stRet)) as [PREM 1st RET],'+
          'negFmt(currency(prem2ndRet)) as [PREM 2ND RET],negFmt(currency(prem1stSurplus)) as [PREM 1ST SURPLUS],negFmt(currency(prem2ndSurplus)) as [PREM 2ND SURPLUS],'+
          'negFmt(currency(premFacul)) as [PREM FACUL],'+
          'negFmt(currency(totalComm)) as [TOTAL COMM],negFmt(currency(commQuota)) as [COMM QUOTA SHARE],negFmt(currency(comm1stRet)) as [COMM 1st RET],'+
          'negFmt(currency(comm2ndRet)) as [COMM 2ND RET],negFmt(currency(comm1stSurplus)) as [COMM 1ST SURPLUS],negFmt(currency(comm2ndSurplus)) as [COMM 2ND SURPLUS],'+
          'negFmt(currency(commFacul)) as [COMM FACUL],'+
          'negFmt(currency(totalVatri)) as [TOTAL RI VAT],negFmt(currency(vatriQuota)) as [RI VAT QUOTA SHARE],negFmt(currency(vatri1stRet)) as [RI VAT 1st RET],'+
          'negFmt(currency(vatri2ndRet)) as [RI VAT 2ND RET],negFmt(currency(vatri1stSurplus)) as [RI VAT 1ST SURPLUS],negFmt(currency(vatri2ndSurplus)) as [RI VAT 2ND SURPLUS],'+
          'negFmt(currency(vatriFacul)) as [RI VAT FACUL]';
        }else if(this.params.reportId == 'POLR052C'){
          this.passDataCsv = data['listPolr052c'];
          query = 'SELECT extractUser as [EXTRACT USER],lineCd as [LINE],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE],policyNo as [POLICY NO],instNo as [INST NO],'+
          'cedingAbbr as [COMPANYY],insuredDesc as [INSURED],myFormat(inceptDate) || " to " ||myFormat(expiryDate) as [PERIOD],negFmt(currency(totalSi)) as [TOTAL SUM INSURED],'+
          'negFmt(ret1Lines) as [1st RET],negFmt(ret2Lines) as [2nd RET],negFmt(currency(totalPrem)) as [TOTAL PREMIUM],negFmt(currency(premQuota)) as [PREM QUOTA SHARE],negFmt(currency(prem1stRet)) as [PREM 1st RET],'+
          'negFmt(currency(prem2ndRet)) as [PREM 2ND RET],negFmt(currency(prem1stSurplus)) as [PREM 1ST SURPLUS],negFmt(currency(prem2ndSurplus)) as [PREM 2ND SURPLUS],'+
          'negFmt(currency(premFacul)) as [PREM FACUL],'+
          'negFmt(currency(totalComm)) as [TOTAL COMM],negFmt(currency(commQuota)) as [COMM QUOTA SHARE],negFmt(currency(comm1stRet)) as [COMM 1st RET],'+
          'negFmt(currency(comm2ndRet)) as [COMM 2ND RET],negFmt(currency(comm1stSurplus)) as [COMM 1ST SURPLUS],negFmt(currency(comm2ndSurplus)) as [COMM 2ND SURPLUS],'+
          'negFmt(currency(commFacul)) as [COMM FACUL],'+
          'negFmt(currency(totalVatri)) as [TOTAL RI VAT],negFmt(currency(vatriQuota)) as [RI VAT QUOTA SHARE],negFmt(currency(vatri1stRet)) as [RI VAT 1st RET],'+
          'negFmt(currency(vatri2ndRet)) as [RI VAT 2ND RET],negFmt(currency(vatri1stSurplus)) as [RI VAT 1ST SURPLUS],negFmt(currency(vatri2ndSurplus)) as [RI VAT 2ND SURPLUS],'+
          'negFmt(currency(vatriFacul)) as [RI VAT FACUL]';
        }else if(this.params.reportId == 'POLR052E'){
          this.passDataCsv = data['listPolr052e'];
          query = 'SELECT extractUser as [EXTRACT USER],lineCd as [LINE],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE],debitMemoNo as [DEBIT MEMO NO],cedingName as [COMPANYY],'+
          'policyNo as [POLICY NO],instNo as [INST NO],negFmt(currency(dueFrom)) as [DUE FROM ],negFmt(currency(commAmt)) as [COMM AMT],negFmt(currency(vatriComm)) as [VAT on RI COMM],'+
          'negFmt(currency(premAmt)) as [PREMIUM]';
        }else if(this.params.reportId == 'POLR052F'){
          this.passDataCsv = data['listPolr052f'];
          query = 'SELECT extractUser as [EXTRACT USER],lineCd as [LINE],currencyCd as [CURRENCY],myFormat(fromDate) as [FROM DATE],myFormat(toDate) as [TO DATE],policyNo as [POLICY NO],instNo as [INST NO],'+
          'debitMemoNo as [DEBIT MEMO NO],(CASE WHEN policyRef IS NULL THEN "" ELSE policyRef END) as [POLICY REF NO],myFormat(inceptDate) as [INCEPTION DATE],myFormat(expDate) as [EXPIRY DATE],myFormat(effDate) as [EFF DATE],'+
          'negFmt(currency(dueFrom)) as [DUE FROM ],negFmt(currency(commAmt)) as [COMM AMT],negFmt(currency(vatriComm)) as [VAT on RI COMM],'+
          'negFmt(currency(premAmt)) as [PREMIUM]';
        }

        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);

      });
  }

}
