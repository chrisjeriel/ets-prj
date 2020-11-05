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

  @ViewChild ('yearRangeTbl') table: CustEditableNonDatatableComponent;
  @ViewChild ('siRangeTbl') siTable: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild('ceding') cedingLov: CedingCompanyComponent;
  @ViewChild('appCancel') cancelBtn: CancelButtonComponent;
  @ViewChild('polReportsModal') polReportsModal: ModalComponent;
  @ViewChild('appDialog') appDialog: SucessDialogComponent;
  @ViewChild('success') success: SucessDialogComponent;

  @ViewChild('clmEventLOV') clmEventTypeLOV: MtnClmEventComponent;
  @ViewChild('adjusterLOVMain') adjusterLOVMain: MtnAdjusterComponent;
  @ViewChild('statusLOV') statusLOV: MtnClaimStatusLovComponent;
  @ViewChild('currencyModal') currLov: MtnCurrencyCodeComponent;
  @ViewChild('Range') rangeLOV: ModalComponent;
  @ViewChild('SiRange') siRangeLOV: ModalComponent;
  @ViewChild('success') openDialog: SucessDialogComponent;
  @ViewChild('yearRangeConf') confirm: ConfirmSaveComponent;
  @ViewChild('siRangeConf') confirmSi: ConfirmSaveComponent;

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

  repExtractions: Array<string> = ['CLMR010A', 'CLMR010B', 'CLMR010C', 'CLMR010D', 'CLMR010E', 'CLMR010F', 'CLMR010G', 'CLMR010H', 'CLMR010I', 'CLMR010J', 'CLMR010K', 'CLMR010ZBO', 'CLMR010ZBP'];

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


  passDataSi: any = {
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
                        dateParam:'10',
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
        if(this.params.reportName.toLowerCase().indexOf('o/s') != -1 || this.params.reportName.toLowerCase().indexOf('outstanding') != -1){
          this.params.dateRange = '3'
        }else{
          this.params.dateRange = '2'
        }


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
      } else if(this.params.reportId == 'CLMR010G' || this.params.reportId == 'CLMR010HA' || this.params.reportId == 'CLMR010IA'){
        this.paramsToggle.push('clmEvent')
      } else if(this.params.reportId =='CLMR010NE'){
        this.paramsToggle = ['line', 'company', 'currency', 'byMonthYear', 'accountingDate', 'bookingDate', 'extTypeTag','clmFileDate','lossDate']
        this.params.dateRange = '3'
      } else if(this.params.reportId == 'CLMR010A'){
        this.paramsToggle = ['line', 'company', 'currency','minLossAmt',
                                     'asOf', 'accountingDate', 'bookingDate', 'extTypeTag','clmFileDate','lossDate']
      } else if(this.params.reportId == 'CLMR010AP'){
        this.paramsToggle = ['line', 'company', 'currency','minLossAmt',
                                     'byDate', 'byMonthYear', 'accountingDate', 'bookingDate', 'extTypeTag','clmFileDate','lossDate']
      } else if(this.params.reportId == 'CLMR010ZO' || this.params.reportId == 'CLMR010ZP'){
        this.paramsToggle.push('siRange');
      } else if(this.params.reportId == 'CLMR010HA' || this.params.reportId == 'CLMR010IA'){
        this.paramsToggle.push('clmEvent')
      } else if(this.params.reportId == 'CLMR010ZAO' || this.params.reportId == 'CLMR010ZAP') {
        this.paramsToggle.push('siRange');
      } else if(this.params.reportId == 'CLMR010ZBO' || this.params.reportId == 'CLMR010ZBP') {
        this.paramsToggle = ['siRange', 'byDate', 'byMonthYear', 'currency','line', 'company'];
        this.params.dateParam = '6';
        this.params.dateRange = '1';
      } 

      setTimeout(()=> {
      	this.ns.lovLoader(data.ev, 0);
      }, 500);
    } else {
      this.params.reportId = '';
      this.params.reportName = '';
      this.params.dateParam = '';
      this.paramsToggle = [];
      this.params.dateRange = '';
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
    this.sendData.clmEvent = this.params.clmEvent;
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
      "clmr010Params.extTypeTag"  :   this.sendData.extTypeTag,
      "clmr010Params.clmEvent"  :   this.sendData.clmEvent
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

    alasql('SELECT INTO XLSX("'+filename+'",?) FROM ?', [opts, [tab1, tab2]]);

  }

  getExtractToCsv(){
    console.log(this.params.reportId);
      console.log(this.ns.getCurrentUser() + ' >> current user');
      this.loading = true;
      this.ms.getExtractToCsv(this.ns.getCurrentUser(),this.params.reportId,
        null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        this.params.dateParam, this.params.dateRange == 1 ? "D" : (this.params.dateRange == 2 ? "M" : "A"))
      .subscribe(data => {
        console.log(data);
        this.loading = false;
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
        if(this.params.reportId == 'CLMR010A'){
          var tab1 : any[] =[];
          var tab2 : any[] =[];
          var res1 =  data['listClmr010a'];
          var res2 =  data['listClmr010a2'];

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
        }else if(this.params.reportId == 'CLMR010AP'){
          var tab1 : any[] =[];
          var tab2 : any[] =[];
          var res1 =  data['listClmr010ap'];
          var res2 =  data['listClmr010ap2'];

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
        }else if(this.params.reportId == 'CLMR010B'){
          this.passDataCsv = data['listClmr010b'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'checkNullNo(claimId) as [CLAIM ID],isNull(claimNo) as [CLAIM NO],isNull(histCategory) as [HIST CATEGORY],'+
          'isNull(histCatDesc) as [HIST CAT DESC],isNull(histType) as [HIST TYPE],isNull(histTypeDesc) as [HIST TYPE DESC],'+
          'checkNullNo(adjId) as [ADJ ID],isNull(adjRefNo) as [ADJ REF NO],isNull(adjName) as [ADJ NAME],'+
          'isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],checkNullNo(policyId) as [POLICY ID],'+
          'isNull(policyNo) as [POLICY NO],isNull(polCoRefNo) as [POL CO REF NO],negFmt(insuredClm) as [INSURED CLM],'+
          'isNull(insuredDesc) as [INSURED DESC],negFmt(approvedAmt) as [APPROVED AMT],isNull(lossCd) as [LOSS CD],'+
          'isNull(lossAbbr) as [LOSS ABBR],myFormat(lossDate) as [LOSS DATE],isNull(clmCoRefNo) as [CLM CO REF NO],'+
          'checkNullNo(treatyId) as [TREATY ID],isNull(treatyName) as [TREATY NAME],isNull(trtyCedId) as [TRTY CED ID],'+
          'isNull(treatyCompany) as [TREATY COMPANY],checkNullNo(retLayer) as [RET LAYER],isNull(retName) as [RET NAME],'+
          'negFmt(origResAmt) as [ORIG RES AMT],negFmt(revResAmt) as [REV RES AMT],'+
          'myFormat(dateFrom) as [DATE FROM],myFormat(dateTo) as [DATE TO]';
        }else if(this.params.reportId == 'CLMR010C'){
          this.passDataCsv = data['listClmr010c'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'adjName as [ADJUSTER],claimNo AS [CLAIM NO], policyNo as [POLICY NO], cedingName as [COMPANY], isNull(coRefNo) as [CO POLICY NO],myFormat(lossDate) as [LOSS DATE],'+
          'lossAbbr as [LOSS CAUSE], insuredDesc as [INSURED], negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMT],'+
          'negFmt(currency(lossOsAmt)) as [OS LOSS],negFmt(currency(lossPdAmt)) as [PAID LOSS],negFmt(currency(adjFeeAmt)) as [ADJUSTERS FEE],clmStatDesc as [STATUS]';
        }else if(this.params.reportId == 'CLMR010D'){
          this.passDataCsv = data['listClmr010d'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],checkNullNo(claimId) as [CLAIM ID],'+
          'isNull(claimNo) as [CLAIM NO],isNull(histCategory) as [HIST CATEGORY],isNull(histCatDesc) as [HIST CAT DESC],'+
          'myFormat(lossDate) as [LOSS DATE],checkNullNo(adjId) as [ADJ ID],isNull(adjName) as [ADJ NAME],'+
          'isNull(cedingId) as [CEDING ID],isNull(cedingName) as [CEDING NAME],checkNullNo(policyId) as [POLICY ID],'+
          'isNull(policyNo) as [POLICY NO],isNull(coRefNo) as [CO REF NO],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(insuredDesc) as [INSURED DESC],negFmt(insuredClm) as [INSURED CLM],isNull(lossCd) as [LOSS CD],'+
          'isNull(lossAbbr) as [LOSS ABBR],negFmt(totalResAmt) as [TOTAL RES AMT],checkNullNo(treatyId) as [TREATY ID],'+
          'isNull(treatyName) as [TREATY NAME],isNull(trtyCedId) as [TRTY CED ID],isNull(treatyCompany) as [TREATY COMPANY],'+
          'negFmt(distributionShare) as [DISTRIBUTION SHARE],myFormat(dateFrom) as [DATE FROM],myFormat(dateTo) as [DATE TO]';
        }else if(this.params.reportId == 'CLMR010G'){
          this.passDataCsv = data['listClmr010g'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE], checkNullNo(eventCd) as [EVENT CD],'+
          'isNull(eventDesc) as [EVENT DESC], currencyCd AS [CURRENCY],'+
          'checkNullNo(claimId) as [CLAIM ID], claimNo as [CLAIM NO],checkNullNo(policyId) as [POLICY ID], policyNo as [POLICY NO],'+
          'cedingId as [CEDING ID],cedingName as [WRITING COMPANY], lineCd as [CLASS TYPE], checkNullNo(uwYear) as [UW YEAR], myFormat(distDate) as [DIST DATE], myFormat(inceptDate) || " to " || myFormat(expiryDate) as [PERIOD OF INS],'+
          'insuredDesc as [NAME OF INSURED], myFormat(lossDate) as [LOSS DATE],site as [LOCATION],negFmt(currency(tsiAmt)) as [TREATY CESSION],negFmt(pctShare) as [% OF TOTAL],'+
          'negFmt(currency(polQuCedRet1)) as [QUOTA 1st LAYER],negFmt(currency(polQuCedRet2)) as [QUOTA 2nd LAYER],negFmt(currency(polQuMre)) as [QUOTA MRe],'+
          'negFmt(currency(polQuNre)) as [QUOTA NRe],negFmt(currency(pol1spMre)) as [1SP MRe],negFmt(currency(pol1spNre)) as [1SP NRe],negFmt(currency(pol2spMre)) as [2SP MRe],'+
          'negFmt(currency(pol2spNre)) as [2SP NRe],negFmt(currency(polFacul)) as [FACULTATIVE],negFmt(currency(retLineAmt)) as [CEDANTS RETENTION],negFmt(currency(osAmt)) as [LOSS RESERVE],'+
          'negFmt(currency(pdAmt)) as [LOSS PAID],isNull(adjName) as [ADJUSTER], negFmt(currency(adjFee)) as [ADJUSTERS FEE],negFmt(currency(cedRet1Shr)) as [1st LAYER PARTICIPATION],'+
          'negFmt(currency(cedRet2Shr)) as [2nd LAYER PARTICIPATION],negFmt(currency(cedTotalShr)) as [TOTAL PARTICIPATION],negFmt(currency(clmQuMre)) as [CLM QUOTA MRe],'+
          'negFmt(currency(clmQuNre)) as [CLM QUOTA NRe],negFmt(currency(clm1spMre)) as [CLM 1SP MRe],negFmt(currency(clm1spNre)) as [CLM 1SP NRe],negFmt(currency(clm2spMre)) as [CLM 2SP MRe],'+
          'negFmt(currency(clm2spNre)) as [CLM 2SP NRe],negFmt(currency(clmFacul)) as [CLM FACULTATIVE],negFmt(currency(clmQuCedRet1)) as [1st RET LAYER],negFmt(currency(clmQuCedRet2)) as [2nd RET LAYER],'+
          'negFmt(currency(clmQuCedTotal)) as [TOTAL QUOTA SHR],myFormat(retEffDate) as [YEAR],negFmt(ret1Lines) as [RET 1 TOTAL], negFmt(ret2Lines) as [RET 2 TOTAL],' +
          'isNull(shrCoRetLines) as [CEDANT], negFmt(currency(clmQuCedTotal)) as [100% XL(before deduction of 1st Layer Priority)], isNull(remarks) as [REMARKS]';
        }else if(this.params.reportId == 'CLMR010E'){
          this.passDataCsv = data['listClmr010e'];
          query = 'SELECT isNull(extractUser) AS [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) AS [CURRENCY], isNull(lineCd) as [LINE],'+
          'checkNullNo(categoryCd) as [CATEGORY CD], isNull(ctgryCdDesc) as [CATEGORY DESC],checkNullNo(refYear) as [YEAR],negFmt(thisMthQty) as [THIS MTH QTY],'+
          'negFmt(currency(thisMthAmt)) as [THIS MTH AMT],negFmt(lastMthQty) as [LAST MTH QTY],'+
          'negFmt(currency(lastMthAmt)) as [LAST MTH AMT],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE]';
        }else if(this.params.reportId == 'CLMR010H'){
          this.passDataCsv = data['listClmr010h'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],treatyIdName as [TREATY],trtyCedIdName as [TREATY COMPANY],negFmt(currency(resAmt)) as [CLAIM]';
        }else if(this.params.reportId == 'CLMR010HA'){
          this.passDataCsv = data['listClmr010ha'];
          query = 'SELECT extractUser AS [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE], currencyCd AS [CURRENCY],lineCd AS [LINE], checkNullNo(uwYear) as [UW YEAR],'+
          'treaty as [TREATY], checkNullNo(treatyId) as [TREATY ID], treatyName as [TREATY NAME], isNull(trtyCedId) as [TRTY CED ID], isNull(treatyCompany) as [TREATY COMPANY],'+
          'isNull(retLayer) as [RET LAYER], negFmt(currency(clmAmt)) as [RES AMT], myFormat(dateFrom) as [DATE FROM], myFormat(dateTo) as [DATE TO],'+
          'isNull(eventCd) as [EVENT CD]';
        }else if(this.params.reportId == 'CLMR010I'){
          this.passDataCsv = data['listClmr010i'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],treatyIdName as [TREATY],trtyCedIdName as [TREATY COMPANY],negFmt(currency(resAmt)) as [CLAIM]';
        }else if(this.params.reportId == 'CLMR010IA'){
          this.passDataCsv = data['listClmr010ia'];
          query = 'SELECT extractUser AS [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE], currencyCd AS [CURRENCY],lineCd AS [LINE], checkNullNo(uwYear) as [UW YEAR],'+
          'treaty as [TREATY], checkNullNo(treatyId) as [TREATY ID], treatyName as [TREATY NAME], isNull(trtyCedId) as [TRTY CED ID], isNull(treatyCompany) as [TREATY COMPANY],'+
          'isNull(retLayer) as [RET LAYER], negFmt(currency(clmAmt)) as [RES AMT], myFormat(dateFrom) as [DATE FROM], myFormat(dateTo) as [DATE TO],'+
          'isNull(eventCd) as [EVENT CD]';
        }else if(this.params.reportId == 'CLMR010J'){
          this.passDataCsv = data['listClmr010j'];
          query = 'SELECT isNull(extractUser) AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'isNull(cedingId) AS [CEDING ID], isNull(cedingIdName) as [COMPANY], negFmt(currency(ret1ClmAmt)) as [1st RETENTION],negFmt(currency(ret2ClmAmt)) as [2nd RETENTION],'+
          'negFmt(currency(total)) as [TOTAL]';
        }else if(this.params.reportId == 'CLMR010K'){
          this.passDataCsv = data['listClmr010k'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'isNull(cedingId) AS [CEDING ID],cedingIdName as [COMPANY], negFmt(currency(ret1ClmAmt)) as [1st RETENTION],negFmt(currency(ret2ClmAmt)) as [2nd RETENTION],'+
          'negFmt(currency(total)) as [TOTAL]';
        }else if(this.params.reportId == 'CLMR010L'){
          this.passDataCsv = data['listClmr010l'];
          query = 'SELECT isNull(extractUser) AS [EXTRACT USER],isNull(currencyCd) AS [CURRENCY],isNull(lineCd) as [LINE],'+
          'isNull(lossCd) as [LOSS CD], isNull(lossDesc) as [LOSS DESC], isNull(lossAbbr) as [NATURE OF LOSS],'+
          'negFmt(lossOsQty) as [LOSS OS QTY],negFmt(currency(lossOsAmt)) as [LOSS OS AMT],negFmt(lossPdQty) as [LOSS PAID QTY],negFmt(currency(lossPdAmt)) as [LOSS PAID AMT],'+
          'negFmt(adjOsQty) as [ADJ OS QTY],negFmt(currency(adjOsAmt)) as [ADJ OS AMT],negFmt(adjPdQty) as [ADJ PAID QTY],negFmt(currency(adjPdAmt)) as [ADJ PAID AMT],'+
          'negFmt(othOsQty) as [OTHERS OS QTY],negFmt(currency(othOsAmt)) as [OTHERS OS AMT],negFmt(othPdQty) as [OTHERS PAID QTY],negFmt(currency(othPdAmt)) as [OTHERS PAID AMT],'+
          'negFmt(totalOsQty) as [TOTAL OS QTY],negFmt(currency(totalOsAmt)) as [TOTAL OS AMT],negFmt(totalPdQty) as [TOTAL PAID QTY],negFmt(currency(totalPdAmt)) as [TOTAL PAID AMT],'+
          'myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE]';
        }else if(this.params.reportId == 'CLMR010M'){
          this.passDataCsv = data['listClmr010m'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'checkNullNo(claimId) as [CLAIM ID], claimNo as [CLAIM NO],myFormat(lossDate) as [LOSS DATE],isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],checkNullNo(policyId) as [POLICY ID], policyNo as [POLICY NO],'+
          'checkNullNo(uwYear) as [UW YEAR], myFormat(effDate) as [EFF DATE], myFormat(distDate) as [DIST DATE],'+
          'insuredDesc as [INSURED],isNull(polCoRefNo) as [POLICY REF],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'treatyName as [TREATY],treatyCompany as [TREATY COMPANY],histCatDesc as [HIST CATEGORY],negFmt(currency(lossResAmt)) as [DISTRIBUTION SHARE]';
        }else if(this.params.reportId == 'CLMR010N'){
          this.passDataCsv = data['listClmr010n'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'checkNullNo(claimId) as [CLAIM ID],claimNo as [CLAIM NO],myFormat(lossDate) as [LOSS DATE],isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],checkNullNo(policyId) as [POLICY ID],policyNo as [POLICY NO],'+
          'checkNullNo(uwYear) as [UW YEAR], myFormat(effDate) as [EFF DATE], myFormat(distDate) as [DIST DATE],'+
          'insuredDesc as [INSURED],isNull(polCoRefNo) as [POLICY REF],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'treatyName as [TREATY],treatyCompany as [TREATY COMPANY],histCatDesc as [HIST CATEGORY],negFmt(currency(lossResAmt)) as [DISTRIBUTION SHARE]';
        }else if(this.params.reportId == 'CLMR010O'){
          this.passDataCsv = data['listClmr010o'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'checkNullNo(claimId) as [CLAIM ID],claimNo as [CLAIM NO],myFormat(lossDate) as [LOSS DATE],isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],checkNullNo(policyId) as [POLICY ID],policyNo as [POLICY NO],'+
          'insuredDesc as [INSURED],isNull(polCoRefNo) as [POLICY REF],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'treatyName as [TREATY],treatyCompany as [TREATY COMPANY],histCatDesc as [HIST CATEGORY],negFmt(currency(lossResAmt)) as [DISTRIBUTION SHARE]';
        }else if(this.params.reportId == 'CLMR010P'){
          this.passDataCsv = data['listClmr010p'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'checkNullNo(claimId) as [CLAIM ID],claimNo as [CLAIM NO],myFormat(lossDate) as [LOSS DATE],isNull(adjName) as [ADJUSTER],cedingName as [COMPANY],checkNullNo(policyId) as [POLICY ID],policyNo as [POLICY NO],'+
          'insuredDesc as [INSURED],isNull(polCoRefNo) as [POLICY REF],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS],'+
          'treatyName as [TREATY],treatyCompany as [TREATY COMPANY],histCatDesc as [HIST CATEGORY],negFmt(currency(lossResAmt)) as [DISTRIBUTION SHARE]';
        }else if(this.params.reportId == 'CLMR010S'){
          this.passDataCsv = data['listClmr010s'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],cedingId as [CEDING ID], cedingName as [COMPANY],negFmt(currency(lossResAmt)) as [O/S CLAIMS]';
        }else if(this.params.reportId == 'CLMR010T'){
          this.passDataCsv = data['listClmr010t'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],cedingId as [CEDING ID],cedingName as [COMPANY],negFmt(currency(lossResAmt)) as [PAID CLAIMS]';
        }else if(this.params.reportId == 'CLMR010U'){
          this.passDataCsv = data['listClmr010u'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) AS [CURRENCY],'+
          'isNull(lineCd) as [LINE],isNull(cedingId) as [CEDING ID], isNull(cedingName) as [INSURING COMPANY],'+
          'checkNullNo(claimId) as [CLAIM ID], isNull(claimNo) as [CLAIM NO],negFmt(currency(lossResAmt)) as [ESTIMATED RESERVE],'+
          'myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE]';
        }else if(this.params.reportId == 'CLMR010V'){
          this.passDataCsv = data['listClmr010v'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) AS [CURRENCY],'+
          'isNull(lineCd) as [LINE],isNull(cedingId) as [CEDING ID], isNull(cedingName) as [INSURING COMPANY],'+
          'checkNullNo(claimId) as [CLAIM ID], isNull(claimNo) as [CLAIM NO],negFmt(currency(lossPdAmt)) as [ACTUAL PAID],'+
          'myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE]';
        }else if(this.params.reportId == 'CLMR010W'){
          this.passDataCsv = data['listClmr010w'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE], isNull(currencyCd) AS [CURRENCY],'+
          'isNull(lineCd) as [LINE],isNull(cedingId) as [CEDING ID],isNull(cedingName) as [COMPANY], checkNullNo(claimId) as [CLAIM ID],'+
          'isNull(claimNo) as [CLAIM NO],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE]';
        }else if(this.params.reportId == 'CLMR010X'){
          this.passDataCsv = data['listClmr010x'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE], isNull(currencyCd) AS [CURRENCY],'+
          'isNull(lineCd) as [LINE],isNull(cedingId) as [CEDING ID],isNull(cedingName) as [COMPANY], checkNullNo(claimId) as [CLAIM ID],'+
          'isNull(claimNo) as [CLAIM NO],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE]';
        }else if(this.params.reportId == 'CLMR010Q'){
          this.passDataCsv = data['listClmr010q'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(lineCd) as [LINE CD],checkNullNo(claimId) as [CLAIM ID],isNull(claimNo) as [CLAIM NO],'+
          'isNull(histCategory) as [HIST CATEGORY],isNull(histCatDesc) as [HIST CAT DESC],negFmt(insuredClm) as [INSURED CLM],'+
          'isNull(insuredDesc) as [INSURED DESC],negFmt(approvedAmt) as [APPROVED AMT],negFmt(totalLossResAmt) as [TOTAL LOSS RES AMT],'+
          'checkNullNo(adjId) as [ADJ ID],isNull(adjName) as [ADJ NAME],isNull(cedingId) as [CEDING ID],'+
          'isNull(cedingName) as [CEDING NAME],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],'+
          'isNull(polCoRefNo) as [POL CO REF NO],isNull(lossCd) as [LOSS CD],isNull(lossAbbr) as [LOSS ABBR],'+
          'myFormat(lossDate) as [LOSS DATE],myFormat(dateTo) as [DATE TO],isNull(rangeCd) as [RANGE CD],'+
          'isNull(rangeDesc) as [RANGE DESC],myFormat(refDate) as [REF DATE],checkNullNo(treatyId) as [TREATY ID],'+
          'isNull(treatyName) as [TREATY NAME],isNull(trtyCedId) as [TRTY CED ID],isNull(treatyCompany) as [TREATY COMPANY],'+
          'checkNullNo(retLayer) as [RET LAYER],isNull(retName) as [RET NAME],negFmt(lossResAmt) as [LOSS RES AMT]';
        }else if(this.params.reportId == 'CLMR010R'){
          this.passDataCsv = data['listClmr010r'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],'+
          'isNull(lineCd) as [LINE CD],checkNullNo(claimId) as [CLAIM ID],isNull(claimNo) as [CLAIM NO],'+
          'isNull(histCategory) as [HIST CATEGORY],isNull(histCatDesc) as [HIST CAT DESC],negFmt(insuredClm) as [INSURED CLM],'+
          'isNull(insuredDesc) as [INSURED DESC],negFmt(approvedAmt) as [APPROVED AMT],negFmt(totalLossResAmt) as [TOTAL LOSS RES AMT],'+
          'checkNullNo(adjId) as [ADJ ID],isNull(adjName) as [ADJ NAME],isNull(cedingId) as [CEDING ID],'+
          'isNull(cedingName) as [CEDING NAME],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],'+
          'isNull(polCoRefNo) as [POL CO REF NO],isNull(lossCd) as [LOSS CD],isNull(lossAbbr) as [LOSS ABBR],'+
          'myFormat(lossDate) as [LOSS DATE],myFormat(dateTo) as [DATE TO],isNull(rangeCd) as [RANGE CD],'+
          'isNull(rangeDesc) as [RANGE DESC],myFormat(refDate) as [REF DATE],checkNullNo(treatyId) as [TREATY ID],'+
          'isNull(treatyName) as [TREATY NAME],isNull(trtyCedId) as [TRTY CED ID],isNull(treatyCompany) as [TREATY COMPANY],'+
          'checkNullNo(retLayer) as [RET LAYER],isNull(retName) as [RET NAME],negFmt(lossResAmt) as [LOSS RES AMT]';
        }else if(this.params.reportId == 'CLMR010F'){
          this.passDataCsv = data['listClmr010f'];
          query = 'SELECT extractUser as [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],checkNullNo(refYear) as [REF YEAR],negFmt(currency(premAmt)) as [PREMIUM],negFmt(osQty) as [OS QTY],negFmt(currency(osAmt)) as [OS AMT],'+
          'negFmt(pdQty) as [PAID QTY], negFmt(currency(pdAmt)) as [PAID AMT], negFmt(totalClmQty) as [TOTAL CLAIM QTY],negFmt(currency(totalClmAmt)) as [TOTAL CLAIM AMT],'+
          'checkNullNo(incurredYear) as [INCURED YEAR],negFmt(incurredQty) as [INCURED QTY], negFmt(currency(incurredAmt)) as [INCURED AMT],negFmt(lossRatio) as [U/W YEAR LOSS RATIO]';
        }else if(this.params.reportId == 'CLMR010BE'){
          this.passDataCsv = data['listClmr010be'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE], claimId as [CLAIM ID],'+
          'claimNo as [CLAIM NO],lineCd as [LINE], myFormat(lossDate) as [LOSS DATE], currencyCd as [CURRENCY], bookingMth AS [BOOKING MONTH],'+
          'bookingYear as [BOOKING YEAR],histType as [HIST TYPE], histTypeDesc as [RESERVE STATUS], histCategory as [HIST CATEGORY], histCatDesc as [HIST CATEGORY DESC],'+
          'negFmt(currency(lossOs)) as [LOSS OS],isNull(clmCoRefNo) as [COMPANY CLAIM NO],isNull(adjRefNo) as [ADJUSTER REF NO],isNull(adjName) as [ADJUSTER],'+
          'cedingName as [COMPANY],policyNo as [POLICY NO],isNull(polCoRefNo) as [COMPANY POLICY NO],insuredDesc as [INSURED],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],'+
          'negFmt(currency(origResAmt)) as [ORIGINAL RESERVE],negFmt(currency(revResAmt)) as [REVISED RESERVE],lossAbbr as [NATURE OF LOSS]'
        }else if(this.params.reportId == 'CLMR010NE'){
          this.passDataCsv = data['listClmr010ne'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],claimId as [CLAIM ID],'+
          'claimNo as [CLAIM NO],myFormat(createDate) AS [CREATE DATE], bookingMth AS [BOOKING MONTH],bookingYear as [BOOKING YEAR],histCategory as [HIST CATEGORY], histCatDesc as [HIST CATEGORY DESC],'+
          'lineCd as [LINE], currencyCd as [CURRENCY], negFmt(currency(lossPaid)) as [LOSS PAID], isNull(adjId) as [ADJUSTER ID],isNull(adjName) as [ADJUSTER NAME],'+
          'cedingId || "-" || cedingName as [COMPANY], policyId as [POLICY ID], policyNo as [POLICY NO],'+
          'checkNullNo(uwYear) as [UW YEAR], myFormat(effDate) as [EFF DATE], myFormat(distDate) as [DIST DATE],'+
          'isNull(insuredDesc) as [INSURED],isNull(polCoRefNo) as [COMPANY POLICY NO],'+
          'negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS]';
        }else if(this.params.reportId == 'CLMR010ME'){
          this.passDataCsv = data['listClmr010me'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],claimId as [CLAIM ID],'+
          'claimNo as [CLAIM NO],lineCd as [LINE], myFormat(lossDate) as [LOSS DATE],currencyCd as [CURRENCY],histCategory as [HIST CATEGORY], histCatDesc as [HIST CATEGORY DESC],'+
          'negFmt(currency(lossOs)) as [LOSS OS],isNull(adjId) as [ADJUSTER ID],isNull(adjName) as [ADJUSTER NAME],cedingId || "-" || cedingName as [COMPANY], policyId as [POLICY ID], policyNo as [POLICY NO],'+
          'checkNullNo(uwYear) as [UW YEAR], myFormat(effDate) as [EFF DATE], myFormat(distDate) as [DIST DATE],'+
          'isNull(insuredDesc) as [INSURED],isNull(polCoRefNo) as [COMPANY POLICY NO],negFmt(currency(insuredClm)) as [INSURED CLAIM],negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS]';
        }else if(this.params.reportId == 'CLMR010Y'){
          this.passDataCsv = data['listClmr010y'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(dateFrom) AS [FROM DATE], myFormat(dateTo) AS [TO DATE],claimId as [CLAIM ID],'+
          'claimNo as [CLAIM NO],lineCd as [LINE], myFormat(lossDate) as [LOSS DATE], lossYear as [LOSS YEAR],currencyCd as [CURRENCY], negFmt(currency(lossOs)) as [LOSS OS],'+
          'isNull(adjId) as [ADJUSTER ID],isNull(adjName) as [ADJUSTER NAME],cedingId || "-" || cedingName as [COMPANY],policyId as [POLICY ID], policyNo as [POLICY NO],'+
          'isNull(insuredDesc) as [INSURED],isNull(polCoRefNo) as [COMPANY POLICY NO],negFmt(currency(insuredClm)) as [INSURED CLAIM],'+
          'negFmt(currency(approvedAmt)) as [APPROVED AMOUNT],lossAbbr as [NATURE OF LOSS]';
        }else if(this.params.reportId == 'CLMR010ZO'){
          this.passDataCsv = data['listClmr010zo'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],isNull(lineCd) as [LINE CD],'+
          'checkNullNo(claimId) as [CLAIM ID],isNull(claimNo) as [CLAIM NO],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],negFmt(currency(tsiAmt)) as [TSI AMT],'+
          'isNull(trtyCedId) as [TRTY CED ID],isNull(trtyCedIdName) as [TRTY CED ID NAME],negFmt(currency(clmAmtTotal)) as [CLM AMT TOTAL],negFmt(currency(clmAmtQuota)) as [CLM AMT QUOTA],'+
          'negFmt(currency(clmAmtQuotaRet1)) as [CLM AMT QUOTA RET1],negFmt(currency(clmAmtQuotaRet2)) as [CLM AMT QUOTA RET2],negFmt(currency(clmAmt1stSurplus)) as [CLM AMT 1ST SURPLUS],'+
          'negFmt(currency(clmAmt2ndSurplus)) as [CLM AMT 2ND SURPLUS],negFmt(currency(clmAmtFacul)) as [CLM AMT FACUL],checkNullNo(siRange) as [SI RANGE],'+
          'negFmt(currency(amtRangeFrom)) as [AMT RANGE FROM],negFmt(currency(amtRangeTo)) as [AMT RANGE TO],'+
          'myFormat(dateFrom) as [DATE FROM],myFormat(dateTo) as [DATE TO]';
        }else if(this.params.reportId == 'CLMR010ZP'){
          this.passDataCsv = data['listClmr010zp'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],isNull(currencyCd) as [CURRENCY CD],isNull(lineCd) as [LINE CD],'+
          'checkNullNo(claimId) as [CLAIM ID],isNull(claimNo) as [CLAIM NO],checkNullNo(policyId) as [POLICY ID],isNull(policyNo) as [POLICY NO],negFmt(currency(tsiAmt)) as [TSI AMT],'+
          'isNull(trtyCedId) as [TRTY CED ID],isNull(trtyCedIdName) as [TRTY CED ID NAME],negFmt(currency(clmAmtTotal)) as [CLM AMT TOTAL],negFmt(currency(clmAmtQuota)) as [CLM AMT QUOTA],'+
          'negFmt(currency(clmAmtQuotaRet1)) as [CLM AMT QUOTA RET1],negFmt(currency(clmAmtQuotaRet2)) as [CLM AMT QUOTA RET2],negFmt(currency(clmAmt1stSurplus)) as [CLM AMT 1ST SURPLUS],'+
          'negFmt(currency(clmAmt2ndSurplus)) as [CLM AMT 2ND SURPLUS],negFmt(currency(clmAmtFacul)) as [CLM AMT FACUL],checkNullNo(siRange) as [SI RANGE],'+
          'negFmt(currency(amtRangeFrom)) as [AMT RANGE FROM],negFmt(currency(amtRangeTo)) as [AMT RANGE TO],'+
          'myFormat(dateFrom) as [DATE FROM],myFormat(dateTo) as [DATE TO]';
        } else if(this.params.reportId == 'CLMR010ZAO') {
          this.passDataCsv = data['listClmr010zao'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE], isNull(currencyCd) as [CURRENCY CD], isNull(lineCd) as [LINE CD], checkNullNo(claimId) as [CLAIM ID], ' +
          'isNull(claimNo) as [CLAIM NO], checkNullNo(policyId) as [POLICY ID], isNull(policyNo) as [POLICY NO], negFmt(currency(tsiAmt)) as [TSI AMT], isNull(shrCedId) as [SHR CED ID], isNull(shrCedIdName) as [SHR CED ID NAME], ' +
          'negFmt(currency(clmAmtQuota)) as [CLM AMT QUOTA], negFmt(currency(clmAmtQuotaRet1)) as [CLM AMT QUOTA RET1], negFmt(currency(clmAmtQuotaRet2)) as [CLM AMT QUOTA RET2], checkNullNo(siRange) as [SI RANGE], ' +
          'negFmt(currency(amtRangeFrom)) as [AMT RANGE FROM], negFmt(currency(amtRangeTo)) as [AMT RANGE TO], myFormat(dateFrom) as [DATE FROM], myFormat(dateTo) as [DATE TO]';
        } else if(this.params.reportId == 'CLMR010ZAP') {
          this.passDataCsv = data['listClmr010zap'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE], isNull(currencyCd) as [CURRENCY CD], isNull(lineCd) as [LINE CD], checkNullNo(claimId) as [CLAIM ID], ' +
          'isNull(claimNo) as [CLAIM NO], checkNullNo(policyId) as [POLICY ID], isNull(policyNo) as [POLICY NO], tsiAmt as [TSI AMT], isNull(shrCedId) as [SHR CED ID], isNull(shrCedIdName) as [SHR CED ID NAME], ' + 
          'negFmt(currency(clmAmtQuota)) as [CLM AMT QUOTA], negFmt(currency(clmAmtQuotaRet1)) as [CLM AMT QUOTA RET1], negFmt(currency(clmAmtQuotaRet2)) as [CLM AMT QUOTA RET2], checkNullNo(siRange) as [SI RANGE], ' +
          'negFmt(currency(amtRangeFrom)) as [AMT RANGE FROM], negFmt(currency(amtRangeTo)) as [AMT RANGE TO], myFormat(dateFrom) as [DATE FROM], myFormat(dateTo) as [DATE TO]';
        } else if(this.params.reportId == 'CLMR010ZBO') {
          this.passDataCsv = data['listClmr010zbo'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE], isNull(currencyCd) as [CURRENCY CD], isNull(lineCd) as [LINE CD], checkNullNo(claimId) as [CLAIM ID], ' +
          'isNull(claimNo) as [CLAIM NO], checkNullNo(policyId) as [POLICY ID], isNull(policyNo) as [POLICY NO], myFormat(distDate) as [DIST DATE], checkNullNo(uwYear) as [UW YEAR],' +
          'tsiAmt as [TSI AMT], isNull(trtyCedId) as [TRTY CED ID], isNull(trtyCedIdName) as [TRTY CED ID NAME], negFmt(currency(clmAmtTotal)) as [CLM AMT TOTAL],' + 
          'negFmt(currency(clmAmtQuota)) as [CLM AMT QUOTA], negFmt(currency(clmAmtQuotaRet1)) as [CLM AMT QUOTA RET1], negFmt(currency(clmAmtQuotaRet2)) as [CLM AMT QUOTA RET2], ' +
          'negFmt(currency(clmAmt1stSurplus)) as [CLM AMT 1ST SURPLUS], negFmt(currency(clmAmt2ndSurplus)) as [CLM AMT 2ND SURPLUS], negFmt(currency(clmAmtFacul)) as [CLM AMT FACUL], checkNullNo(siRange) as [SI RANGE], ' +
          'negFmt(currency(amtRangeFrom)) as [AMT RANGE FROM], negFmt(currency(amtRangeTo)) as [AMT RANGE TO], myFormat(dateFrom) as [DATE FROM], myFormat(dateTo) as [DATE TO]';
        } else if(this.params.reportId == 'CLMR010ZBP') {
          this.passDataCsv = data['listClmr010zbp'];
          query = 'SELECT isNull(extractUser) as [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE], isNull(currencyCd) as [CURRENCY CD], isNull(lineCd) as [LINE CD], checkNullNo(claimId) as [CLAIM ID], ' +
          'isNull(claimNo) as [CLAIM NO], checkNullNo(policyId) as [POLICY ID], isNull(policyNo) as [POLICY NO], myFormat(distDate) as [DIST DATE], checkNullNo(uwYear) as [UW YEAR],' +
          'tsiAmt as [TSI AMT], isNull(trtyCedId) as [TRTY CED ID], isNull(trtyCedIdName) as [TRTY CED ID NAME], negFmt(currency(clmAmtTotal)) as [CLM AMT TOTAL],' + 
          'negFmt(currency(clmAmtQuota)) as [CLM AMT QUOTA], negFmt(currency(clmAmtQuotaRet1)) as [CLM AMT QUOTA RET1], negFmt(currency(clmAmtQuotaRet2)) as [CLM AMT QUOTA RET2], ' +
          'negFmt(currency(clmAmt1stSurplus)) as [CLM AMT 1ST SURPLUS], negFmt(currency(clmAmt2ndSurplus)) as [CLM AMT 2ND SURPLUS], negFmt(currency(clmAmtFacul)) as [CLM AMT FACUL], checkNullNo(siRange) as [SI RANGE], ' +
          'negFmt(currency(amtRangeFrom)) as [AMT RANGE FROM], negFmt(currency(amtRangeTo)) as [AMT RANGE TO], myFormat(dateFrom) as [DATE FROM], myFormat(dateTo) as [DATE TO]';
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
        nextSiRange = parseInt(this.passData.tableData[this.passData.tableData.length - 1].rangeCd) + 1;
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
    var nextSiRange = parseInt(this.passData.tableData[this.passData.tableData.length - 1].rangeCd) +1;
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

  @ViewChild('yearLovCancel') siCancelBtn: CancelButtonComponent;
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
        this.success.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.success.open();
        this.table.markAsPristine();
        this.retrieveRange();
      }
    });
  }

  onRowClick(data){
      this.passData.disableGeneric = !this.passData.tableData.some(a=>a.checked);
  }
  fromSiRangeMdl: boolean = false;
  afterCancelSave() {
    this.fromSiRangeMdl = false;
    if(this.rangeLOV.modalRef != undefined){
      this.rangeLOV.closeModal();
    }else if(this.siRangeLOV.modalRef != undefined){
      this.siRangeLOV.closeModal();
    }
  }




////////////////////////////////////////////////////////////////////////////

  @ViewChild('siLovCancel') trueSiCancelBtn: CancelButtonComponent;
  retrieveSiRange(){
    this.siTable.loadingFlag = true;
    this.ms.retrieveReportRange(this.ns.getCurrentUser()).subscribe((data:any) => {
      this.passDataSi.tableData = [];
      var nextSiRange;
      if(data.reportsRange.length !== 0){
        for (var i = 0; i < data.reportsRange.length; i++) {
          this.passDataSi.tableData.push(data.reportsRange[i]);
          this.passDataSi.tableData[this.passDataSi.tableData.length - 1].uneditable = ['siRange'];
        }
        nextSiRange = parseInt(this.passDataSi.tableData[this.passDataSi.tableData.length - 1].siRange) + 1;
        this.passDataSi.nData = {siRange: nextSiRange, amount: ''};
      }else{
        this.passDataSi.nData = {siRange: 1, amount: ''};
      }

      this.siTable.refreshTable();
      this.siTable.loadingFlag = false;
      this.passDataSi.disableGeneric = true
    });
  }

  updateSi(data){
    var checkFlag = false;
    this.siTable.markAsDirty();
    var nextSiRange = parseInt(this.passDataSi.tableData[this.passDataSi.tableData.length - 1].siRange) +1;
    this.passDataSi.nData = {siRange: nextSiRange, amount: ''};
    for (var i = 0; i < this.passDataSi.tableData.length; i++) {
      if(this.passDataSi.tableData[i].checked){
        checkFlag = true;
        break;
      }
    }
    console.log(checkFlag)
    if(checkFlag){
      this.passDataSi.disableGeneric = false;
    }else{
      this.passDataSi.disableGeneric = true;
    }
  }

  onRowClickSi(data){
      this.passDataSi.disableGeneric = !this.passDataSi.tableData.some(a=>a.checked);
  }

  deleteCurrSi(){
    var notChecked = this.passDataSi.tableData.filter(a=> !a.deleted && !a.checked);
    var finalRange = notChecked.length > 0 ? notChecked[notChecked.length - 1].siRange : undefined;
    var errorFlag = false;

    for (var i = 0; i < this.passDataSi.tableData.length; i++) {
      if(this.passDataSi.tableData[i].checked ){
        if(finalRange != undefined && this.passDataSi.tableData[i].siRange < finalRange){
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
      this.siTable.confirmDelete();
    }
  }

  onClickSaveSi(){
    var errorFlag = false;
    for (var i = 0; i < this.passDataSi.tableData.length - 1; i++) {
      if(!this.passDataSi.tableData[i].deleted){
        if(this.passDataSi.tableData[i].amount >= this.passDataSi.tableData[i+1].amount && !this.passDataSi.tableData[i+1].deleted){
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
      this.confirmSi.confirmModal();
    }
    
  }

  saveSiRange(cancel?){
    this.cancelFlag = cancel !== undefined;
    // this.tableFlag = true;
    this.rangeParams.saveReportsRange = [];
    this.rangeParams.delReportsRange = [];
    for (var i = 0; i < this.passDataSi.tableData.length; i++) {
      if(this.passDataSi.tableData[i].edited && !this.passDataSi.tableData[i].deleted){
        this.passDataSi.tableData[i].userId = this.ns.getCurrentUser();
        this.rangeParams.saveReportsRange.push(this.passDataSi.tableData[i]);
      }

      if(this.passDataSi.tableData[i].deleted){
        this.passDataSi.tableData[i].userId = this.ns.getCurrentUser();
        this.rangeParams.delReportsRange.push(this.passDataSi.tableData[i]);
      }
    }

    this.ms.saveReportRange(this.rangeParams).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.success.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.success.open();
        this.siTable.markAsPristine();
        this.retrieveSiRange();
      }
    });
  }

  realSiClickCancel(){
    if(this.siTable.form.first.dirty) {
      this.trueSiCancelBtn.clickCancel();
    } else {
      this.siRangeLOV.closeModal();
    }
  }

  // afterCancelSave() {
  //   this.fromSiRangeMdl = false;
  //   this.siRangeLOV.closeModal();
  // }
}
