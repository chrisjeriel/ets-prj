import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService, NotesService, AccountingService, PrintService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-mon-end-data-chk',
  templateUrl: './mon-end-data-chk.component.html',
  styleUrls: ['./mon-end-data-chk.component.css']
})
export class MonEndDataChkComponent implements OnInit {
  @ViewChild('tbl') tbl: CustEditableNonDatatableComponent;
  
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

  yearOpts: any[] = [];
  minYear: number = 2018;

  extractParam = {
    bookingMonth: '',
    bookingYear: '',
    scripts: [],
    extractUser: ''
  }

  constructor( private router: Router, private titleService: Title,private userService: UserService, private as: AccountingService,
        private ns: NotesService, public ps: PrintService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Data Checking");
    this.userService.emitModuleId("ACIT062");

    this.yearOpts = [];
    var d = new Date();
    for(let x = d.getFullYear(); x >= this.minYear; x--) {
      this.yearOpts.push(x);
    }

    this.getAcitDataCheckScripts();
  }

  getAcitDataCheckScripts() {
    this.as.getAcitDataCheckScripts().subscribe(data => {
      console.log(data);
      if(data['bookingMonthList'].length != 0) {
        this.extractParam.bookingMonth = data['bookingMonthList'][0]['bookingMm'];
        this.extractParam.bookingYear = data['bookingMonthList'][0]['bookingYear'];
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
}
