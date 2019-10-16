import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NotesService, AccountingService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import * as alasql from 'alasql';

@Component({
  selector: 'app-mon-end-trial-bal',
  templateUrl: './mon-end-trial-bal.component.html',
  styleUrls: ['./mon-end-trial-bal.component.css']
})
export class MonEndTrialBalComponent implements OnInit {
  @ViewChild('eomTbMdl') eomTbMdl: ModalComponent;
  @ViewChild('printMdl') printMdl: ModalComponent;
  @ViewChild('postMdl') postMdl: ModalComponent;
  @ViewChild('lovMdl') lovMdl: ModalComponent;
  @ViewChild('eomTbDialog') eomTbDialog: SucessDialogComponent;
  @ViewChild('eomTbDialog2') eomTbDialog2: SucessDialogComponent;
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

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

  constructor( private router: Router, private ns: NotesService, private as: AccountingService) { }

  ngOnInit() {
    this.getAcitMonthEndTrialBal(this.ns.toDateTimeString(0), true);
    this.getAcitMonthEndUnpostedMonths();
  }

  getAcitMonthEndTrialBal(eomDate, initial?) {
    $('.globalLoading').css('display', 'block');
    this.as.getAcitMonthEndTrialBal(eomDate).subscribe(data => {
      $('.globalLoading').css('display', 'none');
      this.monthlyTotals = data['monthlyTotalsList'].map(a => { a.eomDate = this.ns.toDateTimeString(a.eomDate); return a; });

      if(this.monthlyTotals.length > 0) {
        this.tranDate = this.monthlyTotals[0].eomDate.split('T')[0];

        if(initial === undefined) {
          this.onClickPrint();
        }
      }
    });
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

    this.as.saveAcitMonthEndTrialBal(params).subscribe(data => {
      $('.globalLoading').css('display', 'none');
      this.returnCode = data['returnCode'];
      if(this.returnCode == 1 || this.returnCode == 2) {
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
    this.printMdl.openNoClose();
  }

  onClickPost() {
    this.postMdl.openNoClose();
  }

  showLov() {
    this.lovMdl.openNoClose();
    this.table.refreshTable();
    this.table.overlayLoader = true;

    this.getAcitMonthEndUnpostedMonths(true);
  }

  getAcitMonthEndUnpostedMonths(lov?) {
    this.as.getAcitMonthEndUnpostedMonths().subscribe(data => {
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
        eomMm: this.eomMm,
        eomYear: this.eomYear,
        eomUser: this.ns.getCurrentUser()
      }

      this.as.postAcitMonthEndTrialBal(params).subscribe(data => {
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
    var filename = 'MonthlyTotalsList_'+currDate+'.xlsx'
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

    alasql('SELECT eomMm AS [Month], eomYear AS [Year], currCd AS [Currency], shortCode AS [GL Account No.], ' +
                  'longDesc AS [GL Account Name], transDebitBal AS [Trans Debit Bal], transCreditBal AS [Trans Credit Bal] ' +
             'INTO XLSX("'+filename+'",?) FROM ?', [opts, [phpList, usdList]]);
  }

}
