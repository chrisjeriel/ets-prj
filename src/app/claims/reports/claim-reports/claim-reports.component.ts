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
import { MtnClmEventComponent } from '@app/maintenance/mtn-clm-event/mtn-clm-event.component';
import { MtnAdjusterComponent } from '@app/maintenance/mtn-adjuster/mtn-adjuster.component';
import { MtnClaimStatusLovComponent } from '@app/maintenance/mtn-claim-status-lov/mtn-claim-status-lov.component';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

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
  @ViewChild('appCancel') cancelBtn: CancelButtonComponent;
  @ViewChild('polReportsModal') polReportsModal: ModalComponent;
  @ViewChild('appDialog') appDialog: SucessDialogComponent;
  @ViewChild('clmEventLOV') clmEventTypeLOV: MtnClmEventComponent;
  @ViewChild('adjusterLOVMain') adjusterLOVMain: MtnAdjusterComponent;
  @ViewChild('statusLOV') statusLOV: MtnClaimStatusLovComponent;
  @ViewChild('currencyModal') currLov: MtnCurrencyCodeComponent;
  @ViewChild('Range') rangeLOV: ModalComponent;
  @ViewChild('success') openDialog: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;

  tableFlag: boolean = false;
  cancelFlag: boolean = false;

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
    destination: 'screen',
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
    extTypeTag: 'LE',
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

  passData: any = {
    tableData: [],
    tHeader: ['Range', 'Year Range'],
    dataTypes: ['string', 'number'],
    nData: {rangeCd: '', rangeValue: ''},
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
    keys: ['rangeCd', 'rangeValue'],
    widths: [110,140]
  };

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
        this.params = {
                        dateRange: '',
                        dateParam:'',
                        reportName : '',
                        byDateFrom:'',
                        byDateTo:'',
                        byAsOf:'',
                        reportId : '',
                        lineCd: '',
                        lineName: '',
                        destination: 'screen',
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
                        extTypeTag: 'LE',
                      };
        this.params.reportId = data.data.reportId;
        this.params.reportName = data.data.reportTitle;


        // if (this.repExtractions.indexOf(this.params.reportId) > -1) {
        //   this.extractDisabled = false;
        // } else {
        //   this.extractDisabled = true;
        // }
        this.extractDisabled = false;

    /*if (this.params.reportId == 'CLMR010A') {
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
    } else if((String(this.params.reportId).substr(0, 7) == 'CLMR010') && (['H','I','J','K'].includes(String(this.params.reportId).charAt(this.params.reportId.length-1)))) { */
      this.paramsToggle.push('line', 'company', 'currency',
                             'byDate', 'byMonthYear', 'asOf', 'accountingDate', 'bookingDate', 'extTypeTag','clmFileDate','lossDate');
    /*} else {
        this.params.reportId = '';
    }*/
      if(this.params.reportId == 'CLMR010Q' || this.params.reportId == 'CLMR010R' ){
        this.paramsToggle.push('siRangeBtnDisabled')
      } else if(this.params.reportId == 'CLMR010L'){
        this.paramsToggle= ['line', 'company', 'currency',
                             'byDate', 'byMonthYear', 'asOf', 'accountingDate', 'bookingDate', 'extTypeTag'];
      }else if(this.params.reportId == 'CLMR010C'){
        this.paramsToggle= ['line', 'clmAdj', 'currency','clmStat',
                             'byDate', 'byMonthYear', 'asOf', 'extTypeTag','clmStat','lossDate'];
      } else if(this.params.reportId == 'CLMR010A'){
        this.paramsToggle.push('minLossAmt');
      } else if(this.params.reportId == 'CLMR010G'){
        this.paramsToggle.push('clmEvent')
      }

    setTimeout(()=> {
    	this.ns.lovLoader(data.ev, 0);
    }, 500);
    } else {
      this.params.reportId = '';
      this.params.reportName = '';
      this.paramsToggle = [];
      this.extractDisabled = true;
      this.resetDates();
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

    this.params.clmEvent = ev.eventCd;
    this.params.clmEventName = ev.eventDesc;
  }

  setSelectedMainAdjuster(data) {
    this.ns.lovLoader(data.ev, 0);

    this.params.clmAdj = data.adjId;
    this.params.clmAdjName = data.adjName;
  }

  prepareData(){
    this.modalMode = "";
    let forceE = this.sendData.forceExtract;
    this.sendData = JSON.parse(JSON.stringify(this.params));
    this.sendData.forceExtract = forceE;
    this.sendData.extractUser = this.ns.getCurrentUser();
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

    this.tableFlag = true;
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
      // clmr010Params : this.sendData,
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
        this.clmEventTypeLOV.checkCode(this.params.clmEvent,'', ev);
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
          return (m==null || m=='')?0:(Number(String(m).replace(',',''))<0?('('+String(m).replace('-','')+')'):isNaN(Number(String(m).replace(',','')))?'0.00':m);
        };

        alasql.fn.isNull = function(n){
          return n==null?'':n;
        };


        var name = this.params.reportId;
        var query = '';
        if(this.params.reportId == 'CLMR010A'){
          this.passDataCsv = data['listClmr010a'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],claimNo AS [CLAIM NO],insuredDesc as [INSURED NAME],myFormat(lossDate) as [LOSS DATE],uwYear as [U/W YEAR],negFmt(currency(insuredClm)) as [INSURED CLAIM],'+
          'lossAbbr as [NATURE OF LOSS],negFmt(currency(minAmt)) as [MINIMUM AMOUNT],treatyCompany as [TREATY COMPANY],negFmt(currency(osAmt)) as OUTSTANDING,negFmt(currency(pdAmt)) as [PAID]';
        }else if(this.params.reportId == 'CLMR010B'){
          this.passDataCsv = data['listClmr010b'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'histCatDesc as [HIST CATEGORY],claimNo as [CLAIM NO],isNull(clmCoRefNo) as [COMPANY CLAIM NO],lossDate as [LOSS DATE],isNull(adjRefNo) as [ADJUSTER REF NO],'+
          'isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],policyNo as [POLICY NO],isNull(polCoRefNo) as [COMPANY POLICY NO],insuredDesc as [INSURED],'+
          'negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'histTypeDesc as [HIST TYPE],negFmt(currency(origResAmt)) as [ORIGINAL RESERVE],negFmt(currency(revResAmt)) as [REVISED RESERVE],'+
          'treatyCompany as [TREATY]';
        }else if(this.params.reportId == 'CLMR010C'){
          this.passDataCsv = data['listClmr010c'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'adjName as [ADJUSTER],claimNo AS [CLAIM NO], policyNo as [POLICY NO], cedingName as [COMPANY], coRefNo as [CO POLICY NO],myFormat(lossDate) as [LOSS DATE],'+
          'lossAbbr as [LOSS CAUSE], insuredDesc as [INSURED], negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMT],'+
          'negFmt(currency(lossOsAmt)) as [OS LOSS],negFmt(currency(lossPdAmt)) as [PAID LOSS],negFmt(currency(adjFeeAmt)) as [ADJUSTERS FEE],clmStatDesc as [STATUS]';
        }else if(this.params.reportId == 'CLMR010D'){
          this.passDataCsv = data['listClmr010d'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'claimNo as [CLAIM NO],myFormat(lossDate) as [LOSS DATE],isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],policyNo as [POLICY NO],'+
          'insuredDesc as [INSURED],isNull(coRefNo) as [POLICY REF],negFmt(currency(insuredClm)) as [INSURED CLAIM],lossAbbr as [NATURE OF LOSS],'+
          'treatyCompany as [TREATY],histCatDesc as [HIST CATEGORY],negFmt(currency(lossResAmt)) as [Distribution Share]';
        }else if(this.params.reportId == 'CLMR010G'){
          this.passDataCsv = data['listClmr010g'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'claimNo as [CLAIM NO],policyNo as [POLICY NO],cedingName as [WRITING COMPANY], lineCd as [CLASS TYPE],myFormat(inceptDate) || " to " myFormat(expiryDate) as [PERIOD OF INS],'+
          'insuredDesc as [NAME OF INSURED], myFormat(lossDate) as [LOSS DATE],site as [LOCATION],negFmt(currency(tsiAmt)) as [TREATY CESSION],pctShare as [% OF TOTAL],'+
          'negFmt(currency(polQuCedRet1)) as [QUOTA 1st LAYER],negFmt(currency(polQuCedRet2)) as [QUOTA 2nd LAYER],negFmt(currency(polQuMre)) as [QUOTA MRe],'+
          'negFmt(currency(polQuNre)) as [QUOTA NRe],negFmt(currency(pol1spMre)) as [1SP MRe],negFmt(currency(pol1spNre)) as [1SP NRe],negFmt(currency(pol2spMre)) as [2SP MRe],'+
          'negFmt(currency(pol2spNre)) as [2SP NRe],negFmt(currency(polFacul)) as [FACULTATIVE],negFmt(currency(retLineAmt)) as [CEDANTS RETENTION],negFmt(currency(osAmt)) as [LOSS RESERVE],'+
          'negFmt(currency(pdAmt)) as [LOSS PAID],adjName as [ADJUSTER], negFmt(currency(adjFee)) as [ADJUSTERS FEE],negFmt(currency(cedRet1Shr)) as [1st LAYER PARTICIPATION],'+
          'negFmt(currency(cedRet2Shr)) as [2nd LAYER PARTICIPATION],negFmt(currency(cedTotalShr)) as [TOTAL PARTICIPATION],negFmt(currency(clmQuMre)) as [CLM QUOTA MRe],'+
          'negFmt(currency(clmQuNre)) as [CLM QUOTA NRe],negFmt(currency(clm1spMre)) as [CLM 1SP MRe],negFmt(currency(clm1spNre)) as [CLM 1SP NRe],negFmt(currency(clm2spMre)) as [CLM 2SP MRe],'+
          'negFmt(currency(clm2spNre)) as [CLM 2SP NRe],negFmt(currency(clmFacul)) as [CLM FACULTATIVE],negFmt(currency(clmQuCedRet1)) as [1st RET LAYER],negFmt(currency(clmQuCedRet2)) as [2nd RET LAYER],'+
          'negFmt(currency(clmQuCedTotal)) as [TOTAL QUOTA SHR],myFormat(retEffDate) as [YEAR],negFmt(ret1Lines) as [RET 1 TOTAL], negFmt(ret2Lines) as [RET 2 TOTAL],' +
          'isNull(shrCoRetLines) as [CEDANT], negFmt(currency(clmQuCedTotal)) as [100% XL(before deduction of 1st Layer Priority)],remarks as [REMARKS]';
        }else if(this.params.reportId == 'CLMR010E'){
          this.passDataCsv = data['listClmr010e'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE], lineCd as [LINE],currencyCd AS [CURRENCY],'+
          'refYear as [YEAR],ctgryCdDesc as [CATEGORY],thisMthQty as [THIS MTH QTY],negFmt(currency(thisMthAmt)) as [THIS MTH AMT], lastMthQty as [LAST MTH QTY],'+
          'negFmt(currency(lastMthAmt)) as [LAST MTH AMT]';
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
          'negFmt(currency(total)) as [TOTAL]';
        }else if(this.params.reportId == 'CLMR010K'){
          this.passDataCsv = data['listClmr010k'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'cedingIdName as [COMPANY], negFmt(currency(ret1ClmAmt)) as [1st RETENTION],negFmt(currency(ret2ClmAmt)) as [2nd RETENTION],'+
          'negFmt(currency(total)) as [TOTAL]';
        }else if(this.params.reportId == 'CLMR010L'){
          this.passDataCsv = data['listClmr010l'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],lossAbbr as [NATURE OF LOSS],negFmt(lossOsQty) as [LOSS OS QTY],negFmt(currency(lossOsAmt)) as [LOSS OS AMT],negFmt(lossPdQty) as [LOSS PAID QTY],negFmt(currency(lossPdAmt)) as [LOSS PAID AMT],'+
          'negFmt(adjOsQty) as [ADJ OS QTY],negFmt(currency(adjOsAmt)) as [ADJ OS AMT],negFmt(adjPdQty) as [ADJ PAID QTY],negFmt(currency(adjPdAmt)) as [ADJ PAID AMT],'+
          'negFmt(othOsQty) as [OTHERS OS QTY],negFmt(currency(othOsAmt)) as [OTHERS OS AMT],negFmt(othPdQty) as [OTHERS PAID QTY],negFmt(currency(othPdAmt)) as [OTHERS PAID AMT],'+
          'negFmt(totalOsQty) as [TOTAL OS QTY],negFmt(currency(totalOsAmt)) as [TOTAL OS AMT],negFmt(totalPdQty) as [TOTAL PAID QTY],negFmt(currency(totalPdAmt)) as [TOTAL PAID AMT],'+
        }else if(this.params.reportId == 'CLMR010M'){
          this.passDataCsv = data['listClmr010m'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'claimNo as [CLAIM NO],myFormat(lossDate) as [LOSS DATE],isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],policyNo as [POLICY NO],'+
          'insuredDesc as [INSURED],isNull(polCoRefNo) as [POLICY REF],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'treatyName as [TREATY],treatyCompany as [TREATY COMPANY],histCatDesc as [HIST CATEGORY],negFmt(currency(lossResAmt)) as [DISTRIBUTION SHARE]';
        }else if(this.params.reportId == 'CLMR010N'){
          this.passDataCsv = data['listClmr010n'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'claimNo as [CLAIM NO],myFormat(lossDate) as [LOSS DATE],isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],policyNo as [POLICY NO],'+
          'insuredDesc as [INSURED],isNull(polCoRefNo) as [POLICY REF],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'treatyName as [TREATY],treatyCompany as [TREATY],histCatDesc as [HIST CATEGORY],negFmt(currency(lossResAmt)) as [DISTRIBUTION SHARE]';
        }else if(this.params.reportId == 'CLMR010O'){
          this.passDataCsv = data['listClmr010o'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'claimNo as [CLAIM NO],myFormat(lossDate) as [LOSS DATE],isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],policyNo as [POLICY NO],'+
          'insuredDesc as [INSURED],isNull(polCoRefNo) as [POLICY REF],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'treatyName as [TREATY],treatyCompany as [TREATY],histCatDesc as [HIST CATEGORY],negFmt(currency(lossResAmt)) as [DISTRIBUTION SHARE]';
        }else if(this.params.reportId == 'CLMR010P'){
          this.passDataCsv = data['listClmr010p'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'claimNo as [CLAIM NO],myFormat(lossDate) as [LOSS DATE],isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],policyNo as [POLICY NO],'+
          'insuredDesc as [INSURED],isNull(polCoRefNo) as [POLICY REF],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'treatyName as [TREATY],treatyCompany as [TREATY],histCatDesc as [HIST CATEGORY],negFmt(currency(lossResAmt)) as [DISTRIBUTION SHARE]';
        }else if(this.params.reportId == 'CLMR010S'){
          this.passDataCsv = data['listClmr010s'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],cedingName as [COMPANY],negFmt(currency(lossResAmt)) as [O/S CLAIMS]';
        }else if(this.params.reportId == 'CLMR010T'){
          this.passDataCsv = data['listClmr010t'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],cedingName as [COMPANY],negFmt(currency(lossResAmt)) as [PAID CLAIMS]';
        }else if(this.params.reportId == 'CLMR010U'){
          this.passDataCsv = data['listClmr010u'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],cedingName as [INSURING COMPANY],negFmt(currency(lossResAmt)) as [ESTIMATED RESERVE]';
        }else if(this.params.reportId == 'CLMR010V'){
          this.passDataCsv = data['listClmr010v'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],cedingName as [INSURING COMPANY],negFmt(currency(lossResAmt)) as [ESTIMATED RESERVE],negFmt(currency(lossPdAmt)) as [ACTUAL PAID]';
        }else if(this.params.reportId == 'CLMR010W'){
          this.passDataCsv = data['listClmr010w'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],cedingName as [COMPANY]';
        }else if(this.params.reportId == 'CLMR010X'){
          this.passDataCsv = data['listClmr010x'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],cedingName as [COMPANY]';
        }else if(this.params.reportId == 'CLMR010Q'){
          this.passDataCsv = data['listClmr010q'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],rangeDesc as [CATEGORY],clmCount as [COUNT],negFmt(currency(insuredClm)) as [INSUREDS CLAIM],treatyCompany as [TREATY/FACUL],'+
          'negFmt(currency(lossResAmt)) as [SHARE]';
        }else if(this.params.reportId == 'CLMR010R'){
          this.passDataCsv = data['listClmr010r'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],rangeDesc as [CATEGORY],clmCount as [COUNT],negFmt(currency(insuredClm)) as [INSUREDS CLAIM],treatyCompany as [TREATY/FACUL],'+
          'negFmt(currency(lossResAmt)) as [SHARE]';
        }else if(this.params.reportId == 'CLMR010F'){
          this.passDataCsv = data['listClmr010f'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],refYear as [REF YEAR],negFmt(currency(premAmt)) as [PREMIUM],negFmt(osQty) as [OS QTY],negFmt(currency(osAmt)) as [OS AMT],'+
          'negFmt(pdQty) as [PAID QTY], negFmt(currency(pdAmt)) as [PAID AMT], negFmt(totalClmQty) as [TOTAL CLAIM QTY],negFmt(currency(totalClmAmt)) as [TOTAL CLAIM AMT],'+
          'incuredYear as [INCURED YEAR],negFmt(incuredQty) as [INCURED QTY], negFmt(currency(incuredAmt)) as [INCURED AMT],negFmt(lossRatio) as [U/W YEAR LOSS RATIO]';
        }

        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);
      });
  }

  resetDates() {
    this.params.byDateFrom = '';
    this.params.byDateTo = '';
    this.params.byMonthFrom = '';
    this.params.byMonthFromYear = '';
    this.params.byMonthTo = '';
    this.params.byMonthToYear = '';
    this.params.byAsOf = '';
  }

  retrieveRange(){
    this.table.loadingFlag = true;
    this.ms.retrieveMtnClmReportsRange(this.ns.getCurrentUser()).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      var nextSiRange;
      if(data.reportsRange.length !== 0){
        for (var i = 0; i < data.reportsRange.length; i++) {
          this.passData.tableData.push(data.reportsRange[i]);
          this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['rangeCd'];
        }
        nextSiRange = this.passData.tableData[this.passData.tableData.length - 1].rangeCd + 1;
        this.passData.nData = {rangeCd: nextSiRange, rangeValue: ''};
      }else{
        this.passData.nData = {rangeCd: 1, rangeValue: ''};
      }

      this.table.refreshTable();
      this.table.loadingFlag = false;
      this.passData.disableGeneric = true
    });
  }

  deleteCurr(){
    var notChecked = this.passData.tableData.filter(a=> !a.deleted && !a.checked);
    var finalRange = notChecked.length > 0 ? notChecked[notChecked.length - 1].rangeCd : undefined;
    var errorFlag = false;

    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].checked ){
        if(finalRange != undefined && this.passData.tableData[i].rangeCd < finalRange){
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

  update(data){
    var checkFlag = false;
    this.table.markAsDirty();
    var nextSiRange = this.passData.tableData[this.passData.tableData.length - 1].rangeCd +1;
    this.passData.nData = {rangeCd: nextSiRange, amount: ''};
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

  @ViewChild('siLovCancel') siCancelBtn: CancelButtonComponent;
  siClickCancel(){
    if(this.table.form.first.dirty) {
      this.siCancelBtn.clickCancel();
    } else {
      this.rangeLOV.closeModal();
    }
  }

  rangeParams: any = {}
  onClickSave(){
    var errorFlag = false;
    for (var i = 0; i < this.passData.tableData.length - 1; i++) {
      if(!this.passData.tableData[i].deleted){
        if(this.passData.tableData[i].rangeValue >= this.passData.tableData[i+1].rangeValue && !this.passData.tableData[i+1].deleted){
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

    this.ms.saveMtnClmReportsRange(this.rangeParams).subscribe((data:any) => {
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

  onRowClick(data){
    if( data !==null){
      this.passData.disableGeneric = false;
    }
  }
  fromSiRangeMdl: boolean = false;
  afterCancelSave() {
    this.fromSiRangeMdl = false;
    this.rangeLOV.closeModal();
  }
}
