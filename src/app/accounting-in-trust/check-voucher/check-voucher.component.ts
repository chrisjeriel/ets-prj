import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, UserService } from '../../_services';
import { CVListing } from '@app/_models'
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Location } from '@angular/common';
// import * as alasql from 'alasql';

@Component({
  selector: 'app-check-voucher',
  templateUrl: './check-voucher.component.html',
  styleUrls: ['./check-voucher.component.css']
})
export class CheckVoucherComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table:CustNonDatatableComponent;

  private routeData: any;

  passData: any = {
        tableData: [],
        tHeader: ["CV No", "Check No", "Payee", "Payment Request No", "CV Date", "Status","Particulars","Amount"],
        dataTypes: ['text','text','text','text','date','text','text','currency',],
        colSize: ['','','150px','120px','','','150px',''],
        filters: [
          { key: 'cvGenNo', title: 'C.V. No.', dataType: 'text'},
          { key: 'payee',   title: 'Payee',    dataType: 'text'},
          { keys: {
             from : 'cvDateFrom', to: 'cvDateTo'
          }, title: 'CV Date', dataType: 'datespan' },
          { key: 'particulars', title: 'Particulars', dataType: 'text'},
          { key: 'cvAmt',       title: 'Amount',      dataType: 'text'}
        ],
        btnDisabled  : true,
        pagination   : true,
        pageStatus   : true,
        addFlag      : true,
        editFlag     : true,
        pageLength   : 10,
        exportFlag   : true,
        keys         : ['cvGenNo','checkNo','payee','refNo','cvDate','cvStatusDesc','particulars','cvAmt']
    };

  searchParams: any[] = [];
  cvData : any = {
    createUser  : '',
    createDate  : '',
    updateUser  : '',
    updateDate  : ''
  };
  rowData : any = {
    tranId : ''
  };

  tranStat: string = 'new';

  constructor(private titleService: Title, private router: Router, private location: Location, private acctService: AccountingService, private ns : NotesService, private userService: UserService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Check Voucher");
    this.userService.emitModuleId("ACIT028");
    this.acctService.arFilter = '';
    this.acctService.jvFilter = '';
    this.acctService.prqFilter = '';

    if(this.acctService.cvFilter != '') {
      this.tranStat = this.acctService.cvFilter;
    }

    setTimeout(() => {
      this.table.refreshTable();
      this.getAcitCv();
    }, 0);
  }

  getAcitCv(){
    this.table.overlayLoader = true;
    this.acctService.getAcitCvList(this.searchParams)
    .subscribe(data => {
      console.log(data);
      var rec = data['acitCvList'].map(i => { 
        i.createDate     = this.ns.toDateTimeString(i.createDate); 
        i.updateDate     = this.ns.toDateTimeString(i.updateDate);
        i.checkDate      = this.ns.toDateTimeString(i.checkDate);
        i.preparedDate   = this.ns.toDateTimeString(i.preparedDate);
        i.certifiedDate  = this.ns.toDateTimeString(i.certifiedDate);

        if(i.mainTranStat != 'O' && i.mainTranStat != 'C') {
          i.cvStatus = i.mainTranStat;
          i.cvStatusDesc = i.mainTranStatDesc;
        }

        return i;
      });
      if(this.tranStat.toUpperCase() == 'CLOSED'){
        this.passData.tableData = rec.filter(a => String(a.mainTranStatDesc).toUpperCase() == this.tranStat.toUpperCase() && a.acctEntDate !== null);
      }else{
        this.passData.tableData = rec.filter(a => String(a.cvStatusDesc).toUpperCase() == this.tranStat.toUpperCase());
      }
      this.table.refreshTable();

      this.table.filterDisplay(this.table.filterObj, this.table.searchString);
    });
  }

  searchQuery(searchParams){
    this.searchParams = searchParams;
    this.passData.tableData = [];
    console.log(this.searchParams);
    this.getAcitCv();
  }


  export() {
    var name = 'CheckVoucherList';
    var query = 'SELECT cvGenNo AS [C.V. No], payee AS Payee, datetime(cvDate) AS [C.V. Date], cvStatusDesc AS Status, particulars AS Particulars, currency(cvAmt) AS Amount';

    this.ns.export(name, query, this.passData.tableData);
  }

  onClickAdd(event){
    this.acctService.cvFilter = this.tranStat;
    setTimeout(() => {
      this.router.navigate(['/generate-cv'], { skipLocationChange: true });
    },100);
  }

  onClickEdit(event){
    this.acctService.cvFilter = this.tranStat;
    setTimeout(() => {
      this.router.navigate(['/generate-cv', { tranId : this.rowData.tranId , from: 'cv-list' }], { skipLocationChange: true });
    },100);
  }

  onRowClick(event){
    if(event != null){
      this.cvData.createUser = event.createUser;
      this.cvData.createDate = event.createDate;
      this.cvData.updateUser = event.updateUser;
      this.cvData.updateDate = event.updateDate;
      this.rowData = event;
    }
  }

  onRowDblClick(data){
    this.acctService.cvFilter = this.tranStat;
    console.log(data);
    if(data !== null){
      setTimeout(() => {
        this.router.navigate(['/generate-cv', { tranId : data.tranId , from: 'cv-list' }], { skipLocationChange: true });
      },100);
    }  
  }

}
