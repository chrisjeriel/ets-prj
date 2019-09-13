import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountingService, NotesService } from '../../_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Location } from '@angular/common';
import * as alasql from 'alasql';

@Component({
  selector: 'app-request-for-payment',
  templateUrl: './request-for-payment.component.html',
  styleUrls: ['./request-for-payment.component.css']
})
export class RequestForPaymentComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table:CustNonDatatableComponent;
  
  passData: any = {
  	tableData    : [],
  	tHeader      : ['Payment Request No.', 'Payee', 'Payment Type', 'Reference No', 'Request Date', 'Particulars', 'Curr', 'Amount', 'Requested By'],
  	dataTypes    : ['text', 'text', 'text', 'text', 'date', 'text', 'text', 'currency', 'text'],
  	colSize      : ['120px', '', '', '', '', '', '30px', '', ''],
    btnDisabled  : true,
  	pagination   : true,
  	pageStatus   : true,
  	addFlag      : true,
  	editFlag     : true,
  	pageLength   : 10,
    exportFlag   : true,
    keys         : ['paytReqNo','payee','tranTypeDesc','refNo','reqDate','particulars','currCd','reqAmt','requestedBy'],
    filters: [
      { key: 'paytReqNo',    title: 'Payt Req. No.',      dataType: 'text'},
      { key: 'payee',        title: 'Payee',              dataType: 'text'},
      { key: 'tranTypeDesc', title: 'Payment Type',       dataType: 'text'},
      // { key: 'reqStatusDesc',title: 'Status',             dataType: 'text'},
      { keys: {
           from : 'reqDateFrom', to: 'reqDateTo'
      },   title: 'Request Date', dataType: 'datespan'},
      { key: 'particulars',  title: 'Particulars',         dataType: 'text'},
      { key: 'currCd',       title: 'Curr',                dataType: 'text'},
      { key: 'reqAmt',       title: 'Amount',              dataType: 'text'},
      { key: 'requestedBy',  title: 'Requested By',        dataType: 'text'},
    ]
  };

  reqPaytData : any = {
    createUser  : '',
    createDate  : '',
    updateUser  : '',
    updateDate  : ''
  };

  rowData : any = {
    reqId : ''
  };

  searchParams: any[] = [];

  tranStat: string = 'new';

  constructor(private titleService: Title, private router: Router, private location: Location, private acctService: AccountingService, private ns : NotesService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Request for Payment");
    // this.getPaytReq();

    setTimeout(() => {
      this.table.refreshTable();
      this.getPaytReq();
    }, 0);
  }

  getPaytReq() {
    this.table.overlayLoader = true;
    this.acctService.getPaytReqList(this.searchParams)
    .subscribe(data => {
      console.log(data);
      var rec = data['acitPaytReq'].map(i => {
        i.createDate = this.ns.toDateTimeString(i.createDate);
        i.updateDate = this.ns.toDateTimeString(i.updateDate);

        /*if(i.tranStat != null && i.tranStat != 'O') {
          i.reqStatus = i.tranStat;
          i.reqStatusDesc = i.tranStatDesc;
        }*/

        return i;
      });
      this.passData.tableData = rec.filter(a => String(a.reqStatusDesc).toUpperCase() == this.tranStat.toUpperCase());
      if(this.passData.tableData.length > 0){
        this.table.onRowClick(null, this.passData.tableData[0],0);
        this.passData.btnDisabled = false;
      }else{
        this.passData.btnDisabled = true;
      }
      this.table.refreshTable();
    });
  }

  searchQuery(searchParams){
    this.searchParams = searchParams;
    this.passData.tableData = [];
    console.log(this.searchParams);
    this.getPaytReq();
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
    var filename = 'RequestForPaymentList_'+currDate+'.xlsx'
    var mystyle = {
      headers:true, 
      column: {style:{Font:{Bold:"1"}}}
    };

    alasql.fn.datetime = function(dateStr) {
      var date = new Date(dateStr);
      return date.toLocaleString();
    };


    alasql('SELECT paytReqNo AS PaytReqNo, payee AS Payee, tranTypeDesc AS PaymentType, reqStatusDesc AS Status, datetime(reqDate) AS RequestedDate, particulars AS Particulars, currCd AS Curr, reqAmt AS Amount, requestedBy AS RequestedBy INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
  }

  onClickAdd(event){
    setTimeout(() => {
      this.router.navigate(['/generate-payt-req'], { skipLocationChange: true });
    },100);
  }

  onClickEdit(event){
    setTimeout(() => {
      this.router.navigate(['/generate-payt-req', { reqId : this.rowData.reqId , from: 'req-payt-list' }], { skipLocationChange: true });
    },100);
  }

  onRowClick(event){
    if(event != null){
      this.reqPaytData.createUser = event.createUser;
      this.reqPaytData.createDate = event.createDate;
      this.reqPaytData.updateUser = event.updateUser;
      this.reqPaytData.updateDate = event.updateDate;
      this.rowData = event;
    }
  }

  onRowDblClick(data){
    console.log(data);
    if(data !== null){
      setTimeout(() => {
        this.router.navigate(['/generate-payt-req', { reqId : data.reqId , from: 'req-payt-list' }], { skipLocationChange: true });
      },100);
    }  
  }
}
