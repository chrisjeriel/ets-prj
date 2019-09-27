import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { AccountingService, NotesService } from '@app/_services';

@Component({
  selector: 'app-acct-ar-listings',
  templateUrl: './acct-ar-listings.component.html',
  styleUrls: ['./acct-ar-listings.component.css']
})
export class AcctArListingsComponent implements OnInit {

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  passData: any = {
    tableData: [],
    tHeader: ['A.R. No.','Payor','AR Date','Payment Type','Particulars','Amount'],
    dataTypes: ['sequence-6','text','date','text','text','currency'],
    keys: ['arNo', 'payor', 'arDate', 'tranTypeName', 'particulars', 'arAmt'],
    colSize:['25px', '80px', '40px', '100px', '200px', '125px'],
    filters: [
        {
          key: 'arNo',
          title: 'A.R. No.',
          dataType: 'text'
        },
        {
          key: 'payor',
          title: 'Payor',
          dataType: 'text'
        },
        {
          keys: {
            from: 'arDateFrom',
            to: 'arDateTo'
          },
          title: 'AR Date',
          dataType: 'datespan'
        },
        {
          key: 'tranTypeName',
          title: 'Payment Type',
          dataType: 'text'
        },
        /*{
          key: 'arStatDesc',
          title: 'Status',
          dataType: 'text'
        },*/
        {
          key: 'particulars',
          title: 'Particulars',
          dataType: 'text'
        },
        {
          keys: {
            from: 'arAmtFrom',
            to: 'arAmtTo'
          },
          title: 'Amount',
          dataType: 'textspan'
        }
    ],
    pageLength: 10,
    pageStatus: true,
    pagination: true,
    addFlag: true,
    editFlag: true,
    pageID: 1,
    btnDisabled: true,
    exportFlag: true
  }

  record: any = {
      arNo: null,
      payor: null,
      arDate: null,
      paymentType: null,
      status: null,
      particulars: null,
      amount: null
    }

  searchParams: any[] = [];
  selected: any;
  otherInfo: any = {
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: ''
  }

  tranStat: string = 'open';

  constructor(private router: Router,private titleService: Title, private as: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Acknowledgement Receipt");
    this.as.cvFilter = '';
    this.as.jvFilter = '';
    this.as.prqFilter = '';

    if(this.as.arFilter != '') {
      this.tranStat = this.as.arFilter;
    }

    setTimeout(() => {
      this.table.refreshTable();
      this.retrieveArList();
    }, 0);
  }

  retrieveArList(){
    this.table.overlayLoader = true;
    this.as.getArList(this.searchParams).subscribe(
      (data: any)=>{
        if(data.ar.length !== 0) {
          // this.passData.tableData = data.ar;
          this.passData.tableData = data.ar.filter(a => String(a.tranStatDesc).toUpperCase() == this.tranStat.toUpperCase());
        }
        this.table.refreshTable();
      },
      (error)=>{
        this.passData.tableData = [];
        this.table.refreshTable();
      }
    )
  }

  searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        //this.passData.btnDisabled = true;
        this.passData.btnDisabled = true;
        this.retrieveArList();

   }

  toGenerateARAdd() {
    this.as.arFilter = this.tranStat;
  	this.router.navigate(['/accounting-in-trust', { action: 'add' }], { skipLocationChange: true });
  }

  toGenerateAREdit(data) {
    this.as.arFilter = this.tranStat;
    console.log(data);
    this.record = {
      tranId: data.tranId,
      arNo: data.arNo == null ? '' : data.arNo,
      payor: data.payor,
      arDate: data.arDate,
      paymentType: data.tranTypeName,
      status: data.arStatDesc,
      particulars: data.particulars,
      amount: data.arAmt
    }

    this.router.navigate(['/accounting-in-trust', { slctd: JSON.stringify(this.record), action: 'edit', tranStat: this.tranStat }], { skipLocationChange: true });
  }

  onRowClick(data){
    if(data === null || (data !== null && Object.keys(data).length === 0)){
      this.otherInfo.createUser = '';
      this.otherInfo.createDate = '';
      this.otherInfo.updateUser = '';
      this.otherInfo.updateDate = '';
      this.selected = {};
    }else{
      this.selected = data;
      this.otherInfo.createUser = this.selected.createUser;
      this.otherInfo.createDate = this.ns.toDateTimeString(this.selected.createDate);
      this.otherInfo.updateUser = this.selected.updateUser;
      this.otherInfo.updateDate = this.ns.toDateTimeString(this.selected.updateDate);
    }
    
  }

  export(){
        //do something
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'AckgtReceipt'+currDate+'.xlsx'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}}
      };

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
      var tableData: any[] = [];
      for(var i of this.passData.tableData){
        i.arNo = i.arNo == null ? '' : i.formattedArNo.split('-')[1];
        tableData.push(i);
      }
      //alasql('SELECT paytReqNo AS PaytReqNo, payee AS Payee, tranTypeDesc AS PaymentType, reqStatusDesc AS Status, datetime(reqDate) AS RequestedDate, particulars AS Particulars, currCd AS Curr, reqAmt AS Amount, requestedBy AS RequestedBy INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
    alasql('SELECT arNo AS [A.R. No.], payor AS [Payor], datetime(arDate) AS [A.R. Date], tranTypeName AS [Payment Type], particulars AS [Particulars], currency(arAmt) AS [Amount] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,tableData]);
  }
}