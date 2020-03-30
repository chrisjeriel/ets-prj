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
import { MtnClmEventTypeComponent } from '@app/maintenance/mtn-clm-event-type/mtn-clm-event-type.component';
import { MtnAdjusterComponent } from '@app/maintenance/mtn-adjuster/mtn-adjuster.component';
import { MtnClaimStatusLovComponent } from '@app/maintenance/mtn-claim-status-lov/mtn-claim-status-lov.component';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';

@Component({
  selector: 'app-claim-reports',
  templateUrl: './claim-reports.component.html',
  styleUrls: ['./claim-reports.component.css']
})
export class ClaimReportsComponent implements OnInit {

  @ViewChild (CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild('ceding') cedingLov: CedingCompanyComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild('polReportsModal') polReportsModal: ModalComponent;
  @ViewChild('appDialog') appDialog: SucessDialogComponent;
  @ViewChild('clmEventLOV') clmEventTypeLOV: MtnClmEventTypeComponent;
  @ViewChild('adjusterLOVMain') adjusterLOVMain: MtnAdjusterComponent;
  @ViewChild('statusLOV') statusLOV: MtnClaimStatusLovComponent;
  @ViewChild('currencyModal') currLov: MtnCurrencyCodeComponent;

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
    clmStat: '',
    clmStatName: '',
    clmAdj: '',
    clmAdjName: '',
    clmEvent: '',
    clmEventName: '',
    currCd: '',
    currency: '',
    extTypeTag: '',
  }

  sendData: any = {
    extractUser: JSON.parse(window.localStorage.currentUser).username,
    dateRange: '',
    dateParam:'',
    fromDate: '',
    toDate: '',
    cedingIdParam: '',
    lineCdParam: '',
    currCdParam: '',
    incRecTag: '',
    reportId : '',
    destination: '',
    forceExtract: 'N',
    extTypeTag: '',
  };

  repExtractions: Array<string> = ['CLMR010A', 'CLMR010B', 'CLMR010C', 'CLMR010D', 'CLMR010E', 'CLMR010F', 'CLMR010G', 'CLMR010H', 'CLMR010I', 'CLMR010J', 'CLMR010K'];

  paramsToggle: Array<string> = [];

  extractDisabled: boolean = true;
  modalHeader: string = "";
  modalBody: string = "";
  dialogIcon: string = "";
  dialogMessage: string = "";
  modalMode: string = "";
  loading : boolean = true;

  passDataCsv : any[] =[];

  constructor(private ms: MaintenanceService, private ns: NotesService, private printService: PrintService, public modalService: NgbModal) { }


  ngOnInit() {
    this.passLov.modReportId = 'CLMR010%';
    this.loading = false;
  }

  getReports(){
    this.passLov.reportId = 'CLMR010%';
  	this.lovMdl.openLOV();
  }

  setReport(data){
    if(data.data != null){
        this.paramsToggle = [];
        this.params = [];
        this.params.reportId = data.data.reportId;
        this.params.reportName = data.data.reportTitle;


        if (this.repExtractions.indexOf(this.params.reportId) > -1) {
          this.extractDisabled = false;
        } else {
          this.extractDisabled = true;
        }

    if (this.params.reportId == 'CLMR010A') {
      this.paramsToggle.push('line', 'company', 'currency',
                             'byDate', 'byMonthYear', 'asOf');
    } else if (this.params.reportId == 'CLMR010B') {
      this.paramsToggle.push('line', 'company', 'currency',
                             'byDate', 'byMonthYear', 'asOf', 'claimId');
    } else if (this.params.reportId == 'CLMR010C') {
      this.paramsToggle.push('line', 'company', 'currency',
                             'byDate', 'byMonthYear', 'asOf');
    } else if (this.params.reportId == 'CLMR010D') {
      this.paramsToggle.push('line', 'company', 'currency',
                             'byDate', 'byMonthYear', 'asOf');
    } else if((String(this.params.reportId).substr(0, 7) == 'CLMR010') && (['H','I','J','K'].includes(String(this.params.reportId).charAt(this.params.reportId.length-1)))) {
      this.paramsToggle.push('line', 'company', 'currency',
                             'byDate', 'byMonthYear', 'asOf', 'accountingDate', 'bookingDate', 'extTypeTag');
    } else{
        this.params.reportId = '';
      }

    setTimeout(()=> {
    	this.ns.lovLoader(data.ev, 0);
    }, 500);
/*=======
        if (this.params.reportId == 'CLMR010A') {
          this.paramsToggle.push('line', 'company',
                                 'byDate', 'byMonthYear', 'asOf');
        } else if (this.params.reportId == 'CLMR010B') {
          this.paramsToggle.push('line', 'company',
                                 'byDate', 'byMonthYear', 'asOf');
        }

        

        setTimeout(()=> {
          this.ns.lovLoader(data.ev, 0);
        }, 500)
      }else{
        this.params.reportId = '';
      }
>>>>>>> 80a0bd17d6aaecdaec0b569ee468cb0bb5b7924c*/
    }
  }

  getLine(){
    this.lineLov.modal.openNoClose();
  }

  openAdjusterLOV(){
    this.adjusterLOVMain.modal.openNoClose();
  }

  openClmEventLOV(){
    this.clmEventTypeLOV.modal.openNoClose();
  }
  
  openStatusLOV(){
    this.statusLOV.modal.openNoClose();
  }

  setLine(data){
    this.params.lineCd = data.lineCd;
    this.params.lineName = data.description;
    this.ns.lovLoader(data.ev, 0);
  }

  setStatus(ev){
    this.params.clmStat = ev.statusCode;
    this.params.clmStatName = ev.description;
    this.ns.lovLoader(ev.ev, 0);
  }

  showCedingCompanyLOV() {
    this.cedingLov.modal.openNoClose();
  }

  setCedingcompany(data){
    this.params.cedingId = data.cedingId;
    this.params.cedingName = data.cedingName; 
    this.ns.lovLoader(data.ev, 0);
  }

  setClmEvent(ev) {
    this.ns.lovLoader(ev.ev, 0);

    this.params.clmEvent = ev.eventTypeCd;
    this.params.clmEventName = ev.eventTypeDesc;
  }

  setSelectedMainAdjuster(data) {
    this.ns.lovLoader(data.ev, 0);

    this.params.clmAdj = data.adjId;
    this.params.clmAdjName = data.adjName;
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
    this.sendData.destination = this.params.destination;
    this.sendData.currCdParam = this.params.currCd;
    this.sendData.extTypeTag = this.params.extTypeTag;
  }

  extract(cancel?){
    this.loading = true;
    this.prepareData();

    this.printService.extractReport({ reportId: this.params.reportId, clmr010Params:this.sendData }).subscribe((data:any)=>{
        this.loading = false;
        console.log("extractReport return data");
        console.log(data);
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
      "clmr010Params.extractUser" :   this.sendData.extractUser,
      "clmr010Params.dateRange" :   this.sendData.dateRange,
      "clmr010Params.dateParam" :  this.sendData.dateParam,
      "clmr010Params.fromDate"  :   this.sendData.fromDate,
      "clmr010Params.toDate"    :     this.sendData.toDate,
      "clmr010Params.cedingIdParam" : this.sendData.cedingIdParam,
      "clmr010Params.lineCdParam" :   this.sendData.lineCdParam,
      "clmr010Params.reportId"  :   this.sendData.reportId,
      "clmr010Params.currCdParam"  :   this.sendData.currCdParam,
      "clmr010Params.extTypeTag"  :   this.sendData.extTypeTag
    }

    console.log(this.sendData);

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
      if(this.params.reportId.indexOf('CLMR010') == -1){
        this.passLov.code = 'CLMR010%';
      }else{
        this.passLov.code = this.params.reportId;
      }
      this.lovMdl.checkCode('reportId',ev);
      setTimeout(()=> {
	    	this.ns.lovLoader(ev, 0);
	  }, 500)
    }else if(field === 'clmEvent') {
        this.clmEventTypeLOV.checkCode(this.params.clmEvent, ev);
    }else if(field === 'clmAdj') {
        this.adjusterLOVMain.checkCode(this.params.clmAdj, ev);
    }else if(field === 'clmStat') {
        this.statusLOV.checkCode(this.params.clmStat, ev);
    } else if(field === 'currency') {
        this.currLov.checkCode(this.params.currCd, ev);
    }
    
  }

  showCurrencyLOV() {
    this.currLov.modal.openNoClose();
  }

  setCurr(data) {
    this.params.currCd = data.currencyCd;
    this.params.currency = data.description;
    this.ns.lovLoader(data.ev, 0);
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
          return m==null?0:(Number(String(m).replace(',',''))<0?'('+String(m).replace('-','')+')':m);
        };

        var name = this.params.reportId;
        var query = '';
        if(this.params.reportId == 'CLMR010B'){
          this.passDataCsv = data['listClmr010b'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'histCatDesc as [HIST CATEGORY],claimNo as [CLAIM NO],clmCoRefNo as [COMPANY CLAIM NO],lossDate as [LOSS DATE],adjRefNo as [ADJUSTER REF NO],'+
          'adjName as [ADJUSTER],cedingName as [COMPANY],policyNo as [POLICY NO],polCoRefNo as [COMPANY POLICY NO],insuredDesc as [INSURED],'+
          'negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'histTypeDesc as [HIST TYPE],negFmt(currency(origResAmt)) as [ORIGINAL RESERVE],negFmt(currency(revResAmt)) as [REVISED RESERVE],'+
          'treatyCompany as [TREATY]';
        }else if(this.params.reportId == 'CLMR010H'){
          this.passDataCsv = data['listClmr010h'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],treatyIdName as [TREATY],trtyCedIdName as [TREATY COMPANY],negFmt(currency(resAmt)) as [CLAIM]';
        }else if(this.params.reportId == 'CLMR010I'){
          this.passDataCsv = data['listClmr010i'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],treatyIdName as [TREATY],trtyCedIdName as [TREATY COMPANY],negFmt(currency(resAmt)) as [CLAIM]';
        }else if(this.params.reportId == 'CLMR010J'){
          this.passDataCsv = data['listClmr010j'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'cedingIdName as [COMPANY], negFmt(currency(ret1ClmAmt)) as [1st RETENTION],negFmt(currency(ret2ClmAmt)) as [2nd RETENTION],'+
          'negFmt(currency(ret1ClmAmt + ret2ClmAmt)) as [TOTAL]';
        }

        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);
      });
  }

}
