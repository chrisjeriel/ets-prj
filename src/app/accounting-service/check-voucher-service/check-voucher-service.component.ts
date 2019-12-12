import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService,NotesService } from '../../_services';
import { CVListing } from '@app/_models'
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Location } from '@angular/common';
import * as alasql from 'alasql';

@Component({
  selector: 'app-check-voucher',
  templateUrl: './check-voucher-service.component.html',
  styleUrls: ['./check-voucher-service.component.css']
})
export class CheckVoucherServiceComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table:CustNonDatatableComponent;

  private routeData: any;
 
  passData: any = {
        tableData: [],
        tHeader: ["CV No", "Payee", "Payment Request No", "CV Date", "Status","Particulars","Amount"],
        dataTypes: ['text','text','text','date','text','text','currency',],
        filters: [
        {
          key: 'cvGenNo',
          title: 'C.V. No.',
          dataType: 'text'
        },
        {
          key: 'payee',
          title: 'Payee',
          dataType: 'text'
        },
        {
          key: 'cvDate',
          title: 'CV Date',
          dataType: 'date'
        },
        /*{
          key: 'cvStatusDesc',
          title: 'Status',
          dataType: 'text'
        },*/
        {
          key: 'particulars',
          title: 'Particulars',
          dataType: 'text'
        },
        {
          key: 'cvAmt',
          title: 'Amount',
          dataType: 'text'
        }
        ],
        btnDisabled  : true,
        pagination   : true,
        pageStatus   : true,
        addFlag      : true,
        editFlag     : true,
        pageLength   : 10,
        exportFlag   : true,
        keys         : ['cvGenNo','payee','refNo','cvDate','cvStatusDesc','particulars','cvAmt']
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

  constructor(private titleService: Title, private router: Router, private location: Location, private acctService: AccountingService, private ns : NotesService) { }

  ngOnInit() {
    /*this.titleService.setTitle("Acct-Service | Check Voucher"); Commented out by Totz, already handled in module-access.guard.ts*/

    this.acctService.arFilter = '';
    this.acctService.jvFilter = '';
    this.acctService.prqFilter = '';

    if(this.acctService.cvFilter != '') {
      this.tranStat = this.acctService.cvFilter;
    }

    setTimeout(() => {
      this.table.refreshTable();
      this.getAcseCv();
    }, 0);
  }

  getAcseCv(){
    this.table.overlayLoader = true;
    this.acctService.getAcseCvList(this.searchParams)
    .subscribe(data => {
      console.log(data);
      var rec = data['acseCvList'].map(i => { 
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

      this.passData.tableData = rec.filter(a => String(a.cvStatusDesc).toUpperCase() == this.tranStat.toUpperCase());
      this.table.refreshTable();
    });
  }

  searchQuery(searchParams){
    this.searchParams = searchParams;
    this.passData.tableData = [];
    console.log(this.searchParams);
    this.getAcseCv();
  }


  export(){
     var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var hr = String(today.getHours()).padStart(2,'0');
      var min = String(today.getMinutes()).padStart(2,'0');
      var sec = String(today.getSeconds()).padStart(2,'0');
      var ms = today.getMilliseconds()
      var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'CheckVoucherList_'+currDate+'.xlsx'
    var mystyle = {
      headers:true, 
      column: {style:{Font:{Bold:"1"}}}
    };

    alasql.fn.datetime = function(dateStr) {
      var date = new Date(dateStr);
      return date.toLocaleString();
    };


    alasql('SELECT cvGenNo AS [C.V. No], payee AS Payee, datetime(cvDate) AS [C.V. Date], cvStatusDesc AS Status, particulars AS Particulars, cvAmt AS Amount INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
  }




  onClickAdd(event){
    this.acctService.cvFilter = this.tranStat;
    setTimeout(() => {
      this.router.navigate(['/generate-cv-service'], { skipLocationChange: true });
    },100);
  }

  onClickEdit(event){
    this.acctService.cvFilter = this.tranStat;
    setTimeout(() => {
      this.router.navigate(['/generate-cv-service', { tranId : this.rowData.tranId , from: 'cv-list' }], { skipLocationChange: true });
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
        this.router.navigate(['/generate-cv-service', { tranId : data.tranId , from: 'cv-list' }], { skipLocationChange: true });
      },100);
    }  
  }


}
