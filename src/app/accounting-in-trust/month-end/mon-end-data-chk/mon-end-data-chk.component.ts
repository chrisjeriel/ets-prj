import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService, NotesService, AccountingService, PrintService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mon-end-data-chk',
  templateUrl: './mon-end-data-chk.component.html',
  styleUrls: ['./mon-end-data-chk.component.css']
})
export class MonEndDataChkComponent implements OnInit {
  @ViewChild('tbl') tbl: CustEditableNonDatatableComponent;
  @ViewChild('mdl') mdl: ModalComponent;
  
  passData: any = {
  	tHeader: ['Script No.', 'End of Month Checking Script', 'Solution'],
  	tableData: [],
  	dataTypes: ['number','text','text'],
  	checkFlag: true,
  	pageLength: 10,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: true,
    uneditable: [true, true, true],
    widths: [1, 'auto', 'auto'],
    keys: ['scriptNo', 'scriptTitle', 'scriptSoln']
  }

  unbookedMonths: any[] = [];
  monthOpts: any[] = [];
  yearOpts: any[] = [];
  // minYear: number = 2018;

  extractParam = {
    bookingMonth: '',
    bookingYear: '',
    dataCheckScriptList: [],
    extractUser: '',
    force: ''
  }

  modalBody: string = '';
  modalMode: string = '';

  constructor( private router: Router, private titleService: Title,private userService: UserService, private as: AccountingService,
        private ns: NotesService, public ps: PrintService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Data Checking");
    this.userService.emitModuleId("ACIT062");

    this.monthOpts = [];
    this.yearOpts = [];
    // var d = new Date();
    // for(let x = d.getFullYear(); x >= this.minYear; x--) {
    //   this.yearOpts.push(x);
    // }

    this.extractParam.extractUser = this.ns.getCurrentUser();
    this.getAcitDataCheckScripts();
  }

  getAcitDataCheckScripts() {
    this.as.getAcitDataCheckScripts().subscribe(data => {
      console.log(data);
      if(data['bookingMonthList'].length != 0) {
        this.unbookedMonths = data['bookingMonthList'];
        this.yearOpts = this.unbookedMonths.map(a => a.bookingYear);
        this.extractParam.bookingYear = this.yearOpts[0];
        this.monthOpts = this.unbookedMonths[0]['bookingMonthList'].map(a => a.bookingMonth);
        this.extractParam.bookingMonth = this.monthOpts[0];
      }

      this.passData.tableData = data['dataCheckScriptList'];
      this.tbl.refreshTable();
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }

  onClickGenerate(force?) {
    if(this.tbl.selected.length == 0) {
      this.modalBody = 'Please select script/s.';
      this.mdl.openNoClose();
      return;
    }

    this.extractParam.dataCheckScriptList = this.tbl.selected.map(a => {
      return {
        scriptNo: a['scriptNo'],
        scriptTitle: a['scriptTitle'],
        scriptSoln: a['scriptSoln']
      }
    });

    this.extractParam.force = force == undefined ? 'N' : 'Y';
    this.modalMode = '';

    console.log(this.extractParam);
    this.as.extractDataCheck(this.extractParam).subscribe(data => {
      console.log(data);

      if(data['recordsExist'] == 'Y' && this.extractParam.force !== 'Y') {
        this.modalMode = 'reExtract';
        this.mdl.openNoClose();
        return;
      }

      if(data['extractedRecords'] == 0) {
        this.modalBody = 'No record found.';
        this.mdl.openNoClose();
      } else if(data['extractedRecords'] > 0) {
        this.extractCsv(data['dataCheckExtList']);
      }
    });
  }

  extractCsv(data) {
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

    alasql.fn.negFmt = function(m) {
      return (m==null || m=='') ? 0 : Number(m);
    };

    alasql.fn.isNull = function(n) {
      return n==null?'':n;
    };

    alasql.fn.checkNullNo = function(o) {
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

    var name = 'DataChecking';
    var query = 'SELECT extractId AS [Extract ID], scriptNo AS [Script No], scriptTitle AS [Script Title], scriptSoln AS [Script Soln], checkNullNo(distId) AS [Dist ID], ' +
                'checkNullNo(histNo) AS [Hist No], checkNullNo(policyId) AS [Policy ID], isNull(policyNo) AS [Policy No], checkNullNo(instNo) AS [Inst No], ' +
                'isNull(extractUser) AS [Extract User], myFormat(extractDate) AS [Extract Date], checkNullNo(pBookingMm) AS [Param Booking Month], checkNullNo(pBookingYear) AS [Param Booking Year]';

    this.ns.export(name, query, data);
  }
}
