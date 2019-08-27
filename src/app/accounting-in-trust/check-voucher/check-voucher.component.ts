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
  templateUrl: './check-voucher.component.html',
  styleUrls: ['./check-voucher.component.css']
})
export class CheckVoucherComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table:CustNonDatatableComponent;

  private routeData: any;

  passData: any = {
        tableData: [],
        tHeader: ["CV No", "Payee", "CV Date", "Status","Particulars","Amount"],
        dataTypes: ['text','text','date','text','text','currency',],
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
        {
          key: 'cvStatusDesc',
          title: 'Status',
          dataType: 'text'
        },
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
        keys         : ['cvGenNo','payee','cvDate','cvStatusDesc','particulars','cvAmt']
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

  constructor(private titleService: Title, private router: Router, private location: Location, private acctService: AccountingService, private ns : NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Check Voucher");
    this.getAcitCv();
  }

  getAcitCv(){
    this.acctService.getAcitCvList(this.searchParams)
    .subscribe(data => {
      console.log(data);
      var rec = data['acitCvList'].map(i => { 
        i.createDate     = this.ns.toDateTimeString(i.createDate); 
        i.updateDate     = this.ns.toDateTimeString(i.updateDate);
        i.checkDate      = this.ns.toDateTimeString(i.checkDate);
        i.preparedDate   = this.ns.toDateTimeString(i.preparedDate);
        i.certifiedDate  = this.ns.toDateTimeString(i.certifiedDate);
        return i; 
      });
      this.passData.tableData = rec;
      this.table.refreshTable();
    });
  }

  searchQuery(searchParams){
    this.searchParams = searchParams;
    this.passData.tableData = [];
    console.log(this.searchParams);
    this.getAcitCv();
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


    alasql('SELECT cvGenNo AS CvNo, payee AS Payee, datetime(cvDate) AS CvDate, cvStatusDesc AS Status, particulars AS Particulars, cvAmt AS Amount, INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
  }




  onClickAdd(event){
    setTimeout(() => {
      this.router.navigate(['/generate-cv'], { skipLocationChange: true });
    },100);
  }

  onClickEdit(event){
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
    console.log(data);
    if(data !== null){
      setTimeout(() => {
        this.router.navigate(['/generate-cv', { tranId : data.tranId , from: 'cv-list' }], { skipLocationChange: true });
      },100);
    }  
  }

}
