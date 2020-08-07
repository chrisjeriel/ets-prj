import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NotesService, AccountingService, UserService, PrintService, MaintenanceService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Title } from '@angular/platform-browser';
//import * as alasql from 'alasql';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';

@Component({
  selector: 'app-me-trial-bal-proc',
  templateUrl: './me-trial-bal-proc.component.html',
  styleUrls: ['./me-trial-bal-proc.component.css']
})
export class MeTrialBalProcComponent implements OnInit {
  @ViewChild('eomTbMdl') eomTbMdl: ModalComponent;
  @ViewChild('eomTbMdl2') eomTbMdl2: ModalComponent;
  @ViewChild('printMdl') printMdl: ModalComponent;
  @ViewChild('postMdl') postMdl: ModalComponent;
  @ViewChild('lovMdl') lovMdl: ModalComponent;
  @ViewChild('eomTbDialog') eomTbDialog: SucessDialogComponent;
  @ViewChild('eomTbDialog2') eomTbDialog2: SucessDialogComponent;
  @ViewChild('eomTbDialog3') eomTbDialog3: SucessDialogComponent;
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @ViewChild('reportMdl') reportMdl: LovComponent;
  @ViewChild('cedingMdl') cedingMdl: CedingCompanyComponent;
  @ViewChild('currencyMdl') currencyMdl: MtnCurrencyCodeComponent;

  tranDate: string = '';
  inclPrevMon: boolean = true;
  inclPrevYrs: boolean = true;
  adjEntsOnly: boolean = true;
  returnCode: number = null;
  dialogIcon: string = '';
  dialogMessage: string = '';
  dialogIcon2: string = '';
  dialogMessage2: string = '';
  showPrintDialog: boolean = false;
  printMethod: string = '1';
  monthlyTotals: any[] = [];
  eomDate: string = '';
  eomYear: number = null;
  eomMm: number = null;
  postReturnCode: number = null;
  returnMessage: string = '';
  selected: any = null;

  unpostedMonthsData: any = {
    tableData: [],
    tHeader: ['Month', 'Year', 'Date'],
    dataTypes: ['number', 'right', 'date'],
    pageLength: 5,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 'eomUnpostedMonths',
    keys:['eomMm', 'eomYear', 'eomDate']
  };

  canTempClose: boolean = false;
  canReopen: boolean = false;
  returnCode2: number = null;
  mdl2Type: string = '';

  params: any = {
    reportId: '',
    reportName: '',
    eomDate: '',
    cedingId: '',
    cedingName: '',
    currCd: '',
    currency: '',
    destination: 'screen'
  };

  paramsToggle: any[] = [];
  passLov: any = {
    selector: 'mtnReport',
    reportId: '',
    hide: []
  }
  allDest: boolean = true;
  dialogIcon3: string = '';
  dialogMessage3: string = '';

  passDataCsv : any[] = [];

  constructor( private router: Router, private ns: NotesService, private as: AccountingService, private titleService: Title, private userService: UserService, public ps: PrintService, private ms:MaintenanceService) { }

  ngOnInit() {
    this.passLov.modReportId = 'ACSER024%';
    this.titleService.setTitle("Acct-Service | Trial Balance Processing");
    this.userService.emitModuleId("ACIT024");

    this.getAcseMonthEndTrialBal(this.ns.toDateTimeString(0), true);
    this.getAcseMonthEndUnpostedMonths();
  }

  getAcseMonthEndTrialBal(eomDate, initial?) {
    $('.globalLoading').css('display', 'block');
    this.as.getAcseMonthEndTrialBal(eomDate).subscribe(data => {
      $('.globalLoading').css('display', 'none');
      this.monthlyTotals = data['monthlyTotalsList'].map(a => { a.eomDate = this.ns.toDateTimeString(a.eomDate); return a; });

      if(this.monthlyTotals.length > 0) {
        this.tranDate = this.monthlyTotals[0].eomDate.split('T')[0];
        this.params.eomDate = this.monthlyTotals[0].eomDate.split('T')[0];

        if(initial !== undefined) {
          this.onClickPrint();
        }
      }

      this.canTempClose = data['eom'] == 'Y';
      this.canReopen = data['eom'] == 'Y';
    },
    err => { $('.globalLoading').css('display', 'none'); });
  }
  
  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }

  onClickGenerate(force?) {
    $('.globalLoading').css('display', 'block');

    var params = {
      force: force === undefined ? 'N' : 'Y',
      eomDate: this.tranDate,
      eomUser: this.ns.getCurrentUser(),
      includeMonth: this.inclPrevMon ? 'Y' : 'N',
      includeYear: this.inclPrevYrs ? 'Y' : 'N',
      aeTag: this.adjEntsOnly ? 'Y' : 'N'
    }

    this.as.saveAcseMonthEndTrialBal(params).subscribe(data => {
      $('.globalLoading').css('display', 'none');
      this.returnCode = data['returnCode'];
      if([1,2,3].includes(this.returnCode)) {
        this.eomTbMdl.openNoClose();
      } else if(this.returnCode == -1) {
        this.dialogIcon = 'success-message';
        this.dialogMessage = 'Successfully generated Trial Balance.'
        this.eomTbDialog.open();
      } else if(this.returnCode == 0) {
        this.dialogIcon = 'error-message';
        this.dialogMessage = 'Generation of Trial Balance failed.'
        this.eomTbDialog.open();
      }
    });
  }

  onClickPrint() {
    this.resetParams();
    this.printMdl.openNoClose();
  }

  onClickPost() {
    this.eomMm = null;
    this.eomYear = null;
    this.postMdl.openNoClose();
  }

  showLov() {
    this.lovMdl.openNoClose();
    this.table.refreshTable();
    this.table.overlayLoader = true;

    this.getAcseMonthEndUnpostedMonths(true);
  }

  getAcseMonthEndUnpostedMonths(lov?) {
    this.as.getAcseMonthEndUnpostedMonths().subscribe(data => {
      this.unpostedMonthsData.tableData = data['unpostedMonthsList'].map(a => { a.eomDate = this.ns.toDateTimeString(a.eomDate); return a; });

      if(lov !== undefined) {
        this.table.refreshTable();
      }
    });
  }

  setSelected() {
    if(this.selected !== null) {
      this.eomMm = this.selected.eomMm;
      this.eomYear = this.selected.eomYear;
      this.eomDate = this.selected.eomDate;
    }
  }

  post() {
    var proceed = false;

    for(let a of this.unpostedMonthsData.tableData) {
      if(a.eomMm == this.eomMm && a.eomYear == this.eomYear) {
        proceed = true;
      }
    }

    if(proceed) {
      this.postMdl.closeModal();
      $('.globalLoading').css('display', 'block');
      var params = {
        eomDate: this.eomDate,
        eomMm: Number(this.eomMm),
        eomYear: Number(this.eomYear),
        eomUser: this.ns.getCurrentUser()
      }

      this.as.postAcseMonthEndTrialBal(params).subscribe(data => {
        $('.globalLoading').css('display', 'none');
        this.postReturnCode = data['returnCode'];

        if(this.postReturnCode == 1) {
          this.returnMessage = data['eomMessage'];
          this.dialogIcon2 = 'error-message';
          if(this.returnMessage === '1') {
            this.dialogMessage2 = 'Both PHP and USD GLs are inbalance. Please make the necessary Adjusting Entries.';
          } else if(this.returnMessage === 'PHP') {
            this.dialogMessage2 = 'PHP GLs are inbalance. Please make the necessary Adjusting Entries.';
          } else if(this.returnMessage === 'USD') {
            this.dialogMessage2 = 'USD GLs are inbalance. Please make the necessary Adjusting Entries.';
          } else if(this.returnMessage === 'NOT_ALLOWED') {
            this.dialogMessage2 = 'This month was already posted to Fiscal Year.';
          }
        } else if(this.postReturnCode == 2) {
          this.dialogIcon2 = 'error-message';
          this.dialogMessage2 = 'Halt process, needed to post the previous month.';
        } else if(this.postReturnCode == 0) {
          this.dialogIcon2 = 'error-message';
          this.dialogMessage2 = 'Posting to GL unsuccessful.';
        } else if(this.postReturnCode == -1) {
          this.dialogIcon2 = 'success-message';
          this.dialogMessage2 = 'Posting of GL to Fiscal Year was successful.';
        }

        this.eomTbDialog2.open();
      });
    } else {
      this.dialogIcon2 = 'error-message';
      this.dialogMessage2 = 'Invalid Month/Year';
      this.eomTbDialog2.open();
    }
    
  }

  export() {
    var eomMm;
    var eomYear;
    if(this.monthlyTotals.length > 0) {
      eomMm = String(this.monthlyTotals[0].eomMm).padStart(2, '0');
      eomYear = String(this.monthlyTotals[0].eomYear).padStart(2, '0');
    } else {
      eomMm = String(new Date(this.params.eomDate).getMonth() + 1).padStart(2, '0');
      eomYear = String(new Date(this.params.eomDate).getFullYear()).padStart(2, '0');
    }
    
    var phpList = this.monthlyTotals.filter(a => a.currCd == 'PHP');
    var usdList = this.monthlyTotals.filter(a => a.currCd == 'USD');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'ACSE-' + eomMm + '-' + eomYear + '_'+currDate+'.xls';
    var opts = [{
                sheetid: 'PHP',
                headers: true
               },
               {
                sheetid: 'USD',
                headers: true
               }];

    alasql.fn.datetime = function(dateStr) {
      var date = new Date(dateStr);
      return date.toLocaleString();
    };

    alasql.fn.currency = function(currency) {
      var parts = parseFloat(currency).toFixed(2).split(".");
      var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
          (parts[1] ? "." + parts[1] : "");
      return num
    };

    if(phpList.length == 0) {
      phpList = [{}];
    }

    if(usdList.length == 0) {
      usdList = [{}];
    }

    alasql('SELECT eomMm AS [Month], eomYear AS [Year], currCd AS [Currency], shortCode AS [GL Account No.], ' +
                  'longDesc AS [GL Account Name], begDebitAmt AS [Beg Debit Amt], begCreditAmt AS [Beg Credit Amt], totalDebitAmt AS [Total Debit Amt], ' +
                  'totalCreditAmt AS [Total Credit Amt], transDebitBal AS [Trans Debit Bal], transCreditBal AS [Trans Credit Bal], transBalance AS [Trans Balance], ' +
                  'endDebitAmt AS [End Debit Amt], endCreditAmt AS [End Credit Amt] ' +
             'INTO XLSX("'+filename+'",?) FROM ?', [opts, [phpList, usdList]]);
  }

  checkMonth(ev, fromPrint?) {
    if((ev !== '' && fromPrint === undefined) || (ev !== '' && fromPrint !== undefined && this.params.reportId === 'ACSER024E')) {
      this.getAcseMonthEndTrialBal(ev);
    }
  }

  onClickNewBtn(str) {
    $('.globalLoading').css('display', 'block');

    var params = {
      eomDate: this.tranDate,
      eomUser: this.ns.getCurrentUser()
    }

    if(str == 'tc') {
      this.as.saveAcseMonthEndTBTempClose(params).subscribe(data => {
        $('.globalLoading').css('display', 'none');
        this.returnCode2 = data['returnCode'];
        if([1,2].includes(this.returnCode2)) {
          this.mdl2Type = 'tc';
          this.eomTbMdl2.openNoClose();
        } else if(this.returnCode2 == -1) {
          this.dialogIcon = 'success-message';
          this.dialogMessage = 'Month closed temporarily.'
          this.eomTbDialog.open();
        } else if(this.returnCode2 == 0) {
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'Temporary closing failed.'
          this.eomTbDialog.open();
        }
      });
    } else if(str == 'ro') {
      this.as.saveAcseMonthEndTBReopen(params).subscribe(data => {
        $('.globalLoading').css('display', 'none');
        this.returnCode2 = data['returnCode'];
        if([1,2].includes(this.returnCode2)) {
          this.mdl2Type = 'ro';
          this.eomTbMdl2.openNoClose();
        } else if(this.returnCode2 == -1) {
          this.returnCode = null;
          this.dialogIcon = 'success-message';
          this.dialogMessage = 'Month reopened.';
          this.eomTbDialog.open();
        } else if(this.returnCode2 == 0) {
          this.returnCode = null;
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'Month reopening failed.';
          this.eomTbDialog.open();
        }
      });
    }
  }

  openReportMdl() {
    this.passLov.reportId = 'ACSER024%';
    this.reportMdl.openLOV();
  }

  setReport(data) {
    this.ns.lovLoader(data.ev, 0);
    this.resetParams();
    if(data.data !== null) {
      this.params.reportId = data.data.reportId;
      this.params.reportName = data.data.reportTitle;
      this.params.eomDate = this.tranDate;

      this.paramsToggle = ['eomDate', 'destination'];

      if(this.params.reportId !== 'ACSER024A') {
        this.paramsToggle.push('currCd');
      }

      if(this.params.reportId == 'ACSER024E') {
        this.params.destination = 'exl';
      }

      this.allDest = this.params.reportId !== 'ACSER024E';
    }
  }

  openCedingMdl() {
    this.cedingMdl.modal.openNoClose();
  }

  setCeding(data) {
    this.params.cedingId = data.cedingId;
    this.params.cedingName = data.cedingName; 
    this.ns.lovLoader(data.ev, 0);
  }

  openCurrencyMdl() {
    this.currencyMdl.modal.openNoClose();
  }

  setCurrency(data) {
    this.params.currCd = data.currencyCd;
    this.params.currency = data.description;
    this.ns.lovLoader(data.ev, 0);
  }

  checkCode(ev, from) {
    this.ns.lovLoader(ev, 1);
    if(from == 'report') {
      if(this.params.reportId.indexOf('ACSER024') == -1){
        this.passLov.code = 'ACSER024%';
      }else{
        this.passLov.code = this.params.reportId;
      }

      this.reportMdl.checkCode('reportId', ev);
    } else if(from == 'cedingId') {
      this.cedingMdl.checkCode(String(this.params.cedingId).padStart(3, '0'), ev);
    } else if(from == 'currCd') {
      this.currencyMdl.checkCode(this.params.currCd, ev);
    }
  }

  resetParams() {
    this.allDest = true;
    this.paramsToggle = [];
    this.params = {
      reportId: '',
      reportName: '',
      eomDate: '',
      cedingId: '',
      cedingName: '',
      currCd: '',
      currency: '',
      destination: 'screen'
    };
  }

  print() {
    if(this.params.destination == 'exl'){
      this.passDataCsv = [];
      this.getExtractToCsv();
      return;
    }

    this.ps.printLoader = true;
    let params: any = {
      "reportId": this.params.reportId,
      "acser024Params.reportId": this.params.reportId,
      "acser024Params.eomDate": this.params.eomDate,
      "acser024Params.cedingId": this.params.cedingId,
      "acser024Params.currCd": this.params.currCd,
      "fileName": this.params.reportId + '_' + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
    }

    this.ps.print(this.params.destination, this.params.reportId, params);
  }

  getExtractToCsv(){
    console.log('extract to csv from trial balance processing');
    this.ms.getExtractToCsv(this.ns.getCurrentUser(),this.params.reportId,null,this.params.eomDate,this.params.currCd,this.params.cedingId)
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

        if(this.params.reportId == 'ACSER024A'){
          this.passDataCsv = data['listAcser024a'];
          query = 'SELECT acctGroup as [ACCT GROUP], checkNullNo(groupNum) as [SORT SEQ 1], checkNullNo(itemNo) as [SORT SEQ 2], acctName as [ACCT NAME], negFmt(currency(acctAmt)) as [ACCT AMOUNT], negFmt(currency(currNetAmt)) as [NET AMOUNT(CURR YR)],'+
          'negFmt(currency(prevNetAmt)) as [NET AMOUNT(PREV YR)],myFormat(paramDate) AS [PARAM DATE]';
        }else if(this.params.reportId == 'ACSER024B'){
          this.passDataCsv = data['listAcser024b'];
          query = 'SELECT checkNullNo(itemNo) as [REC NO], itemName as [ACCOUNT NAME], negFmt(currency(currIncome)) as [CURRENT YEAR], negFmt(currency(prevIncome)) as [LAST YEAR], myFormat(paramDate) as [PARAM DATE]';
        }else if(this.params.reportId == 'ACSER024C'){
          this.passDataCsv = data['listAcser024c'];
          query = 'SELECT checkNullNo(eomMm) as [EOM MM], checkNullNo(eomYear) as [EOM YEAR], shortCode as [ACCT CODE], shortDesc  as [ACCT NAME],'+
          'negFmt(currency(begDebitAmt)) as [BEG DEBIT AMT], negFmt(currency(begCreditAmt)) as [BEG CREDIT AMT], negFmt(currency(totalDebitAmt)) as [TOTAL DEBIT AMT],'+
          'negFmt(currency(totalCreditAmt)) as [TOTAL CREDIT AMT], negFmt(currency(transDebitBal)) as [TRANS DEBIT BAL], negFmt(currency(transCreditBal)) as [TRANS CREDIT BAL],'+
          'negFmt(currency(transBalance)) as [TRANS BALANCE], negFmt(currency(endDebitAmt)) as [END DEBIT AMT], negFmt(currency(endCreditAmt)) as [END CREDIT AMT],'+
          'isNull(tbBase) as [TB BASE], myFormat(paramDate) AS [PARAM DATE], isNull(paramCurrency) as [PARAM CURRENCY]';
        }else if(this.params.reportId == 'ACSER024D'){
          this.passDataCsv = data['listAcser024d'];
          query = 'SELECT checkNullNo(eomMm) as [EOM MM], checkNullNo(eomYear) as [EOM YEAR], shortCode as [ACCT CODE], shortDesc  as [ACCT NAME],'+
          'negFmt(currency(begDebitAmt)) as [BEG DEBIT AMT], negFmt(currency(begCreditAmt)) as [BEG CREDIT AMT], negFmt(currency(totalDebitAmt)) as [TOTAL DEBIT AMT],'+
          'negFmt(currency(totalCreditAmt)) as [TOTAL CREDIT AMT], negFmt(currency(transDebitBal)) as [TRANS DEBIT BAL], negFmt(currency(transCreditBal)) as [TRANS CREDIT BAL],'+
          'negFmt(currency(transBalance)) as [TRANS BALANCE], negFmt(currency(endDebitAmt)) as [END DEBIT AMT], negFmt(currency(endCreditAmt)) as [END CREDIT AMT],'+
          'isNull(tbBase) as [TB BASE], myFormat(paramDate) AS [PARAM DATE], isNull(paramCurrency) as [PARAM CURRENCY]';
        }else if(this.params.reportId == 'ACSER024E'){
          console.log('entered acser024e');
          this.export();
          // this.passDataCsv = this.monthlyTotals;
          // query = 'SELECT checkNullNo(eomMm) AS [MONTH], checkNullNo(eomYear) AS [YEAR], currCd AS [CURRENCY], shortCode AS [GL ACCOUNT NO.], ' +
          //         'longDesc AS [GL ACCOUNT NAME], negFmt(currency(begDebitAmt)) AS [BEG DEBIT AMT], negFmt(currency(begCreditAmt)) AS [BEG CREDIT AMT],'+
          //         'negFmt(currency(totalDebitAmt)) AS [TOTAL DEBIT AMT], negFmt(currency(totalCreditAmt)) AS [TOTAL CREDIT AMT], negFmt(currency(transDebitBal)) AS [TRANS DEBIT BAL], negFmt(currency(transCreditBal)) AS [TRANS CREDIT BAL],'+
          //         'negFmt(currency(transBalance)) AS [TRANS BALANCE], negFmt(currency(endDebitAmt)) AS [END DEBIT AMT], negFmt(currency(endCreditAmt)) AS [END CREDIT AMT]';
        }else if(this.params.reportId.indexOf("ACSER024C")==0){
          this.passDataCsv = data['listAcser024cd'];
          query = 'SELECT checkNullNo(eomMm) AS [MONTH], checkNullNo(eomYear) AS [YEAR],currCd AS [CURRENCY], negFmt(currency(currRt)) AS [CURRENCY RT], isNull(glAcctId) AS [GL ACCT ID], isNull(shortCode) AS [SHORT CODE], isNull(shortDesc) AS [SHORT DESC], isNull(longDesc) AS [LONG DESC], isNull(slTypeCd) AS [SL TYPE CD], isNull(slTypeName) AS [SL TYPE NAME], isNull(slCd) AS [SL CD], isNull(slName) AS [SL NAME], isNull(begDebitAmt) AS [BEG DEBIT AMT], isNull(begCreditAmt) AS [BEG CREDIT AMT], isNull(transDebitBal) AS [TRANS DEBIT BAL], isNull(transCreditBal) AS [TRANS CREDIT BAL], isNull(transBalance) AS [TRANS BALANCE], isNull(endDebitAmt) AS [END DEBIT AMT], isNull(endCreditAmt) AS [END CREDIT AMT], isNull(localBegDebitAmt) AS [LOCAL BEG DEBIT AMT], isNull(localBegCreditAmt) AS [LOCAL BEG CREDIT AMT], isNull(localTransDebitBal) AS [LOCAL TRANS DEBIT BAL], isNull(localTransCreditBal) AS [LOCAL TRANS CREDIT BAL], isNull(localTransBalance) AS [LOCAL TRANS BALANCE], isNull(localEndDebitAmt) AS [LOCAL END DEBIT AMT], isNull(localEndCreditAmt) AS [LOCAL END CREDIT AMT], isNull(postTag) AS [POST TAG], isNull(eomUser) AS [EOM USER], isNull(tbBase) AS [TB BASE], isNull(glAcctCategory) AS [GL ACCT CATEGORY], isNull(glAcctControl) AS [GL ACCT CONTROL], isNull(glAcctSub1) AS [GL ACCT SUB1], isNull(glAcctSub2) AS [GL ACCT SUB2], isNull(glAcctSub3) AS [GL ACCT SUB3], isNull(parentGlId) AS [PARENT GL ID]';
        }else if(this.params.reportId.indexOf("ACSER024D")==0){
          this.passDataCsv = data['listAcser024cd'];
          query = 'SELECT checkNullNo(eomMm) AS [MONTH], checkNullNo(eomYear) AS [YEAR],currCd AS [CURRENCY], negFmt(currency(currRt)) AS [CURRENCY RT], isNull(glAcctId) AS [GL ACCT ID], isNull(shortCode) AS [SHORT CODE], isNull(shortDesc) AS [SHORT DESC], isNull(longDesc) AS [LONG DESC], isNull(slTypeCd) AS [SL TYPE CD], isNull(slTypeName) AS [SL TYPE NAME], isNull(slCd) AS [SL CD], isNull(slName) AS [SL NAME], isNull(begDebitAmt) AS [BEG DEBIT AMT], isNull(begCreditAmt) AS [BEG CREDIT AMT], isNull(transDebitBal) AS [TRANS DEBIT BAL], isNull(transCreditBal) AS [TRANS CREDIT BAL], isNull(transBalance) AS [TRANS BALANCE], isNull(endDebitAmt) AS [END DEBIT AMT], isNull(endCreditAmt) AS [END CREDIT AMT], isNull(localBegDebitAmt) AS [LOCAL BEG DEBIT AMT], isNull(localBegCreditAmt) AS [LOCAL BEG CREDIT AMT], isNull(localTransDebitBal) AS [LOCAL TRANS DEBIT BAL], isNull(localTransCreditBal) AS [LOCAL TRANS CREDIT BAL], isNull(localTransBalance) AS [LOCAL TRANS BALANCE], isNull(localEndDebitAmt) AS [LOCAL END DEBIT AMT], isNull(localEndCreditAmt) AS [LOCAL END CREDIT AMT], isNull(postTag) AS [POST TAG], isNull(eomUser) AS [EOM USER], isNull(tbBase) AS [TB BASE], isNull(glAcctCategory) AS [GL ACCT CATEGORY], isNull(glAcctControl) AS [GL ACCT CONTROL], isNull(glAcctSub1) AS [GL ACCT SUB1], isNull(glAcctSub2) AS [GL ACCT SUB2], isNull(glAcctSub3) AS [GL ACCT SUB3], isNull(parentGlId) AS [PARENT GL ID]';
        }

        console.log(this.passDataCsv);
        if(this.params.reportId !== 'ACSER024E') {
          this.ns.export(name, query, this.passDataCsv);  
        }
        
      });
    }

  onClickUpdateAgingSoa() {
    this.ps.printLoader = true;
    this.as.updateAgingSoa(this.params.eomDate).subscribe(data => {
      console.log(data);
      this.ps.printLoader = false;
      if(data['returnCode'] == 0) {
        this.dialogIcon3 = 'error-message';
        this.dialogMessage3 = 'Update failed';
        this.eomTbDialog3.open();
      } else if(data['returnCode'] == -1) {
        this.dialogIcon3 = 'success-message';
        this.dialogMessage3 = 'Aging SOA updated'
        this.eomTbDialog3.open();
      }
    });
  }

}
