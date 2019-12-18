import { Component, OnInit, ViewChild, Input,Output ,EventEmitter} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService} from '@app/_services';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-change-to-new-ar',
  templateUrl: './change-to-new-ar.component.html',
  styleUrls: ['./change-to-new-ar.component.css']
})
export class ChangeToNewArComponent implements OnInit {
  @ViewChild('ARTable') ARTable: CustNonDatatableComponent;
  @ViewChild('JVTable') JVTable: CustNonDatatableComponent;
  @ViewChild('CVTable') CVTable: CustNonDatatableComponent;

  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("confirmSave") confirmSave: ConfirmSaveComponent;
  @Input() tranFlag : any;


  passDataAR: any = {
  	tableData:[],
    tHeader: ['A.R. No.','Payor','AR Date','Payment Type','Status','Particulars','Amount'],
  	dataTypes:['sequence-6','text','date','text','text','text','currency'],
  	uneditable:[true, true, true, true, true, true, true],
    keys: ['arNo', 'payor', 'arDate', 'tranTypeName', 'arStatDesc', 'particulars', 'arAmt'],
  	widths:[1, 1, 1, 1, 1, 1, 1],
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
    btnDisabled: false,
    genericBtn1: 'Change Status to New',
    checkFlag : true,
    pageLength: 10,
    pageStatus: true,
    pagination: true,
    pageID: 1,
    paginateFlag: true,
    exportFlag: true,
  }

  passDataJV: any = {
    tableData:[],
    tHeader:['JV No.','JV Date', 'Particulars', 'JV Type','JV Ref. No', 'Prepared By','JV Status', 'Amount'],
    dataTypes:['text','date','text','text','text','text','text','currency'],
    uneditable:[true, true, true, true, true, true, true, true],
    keys:['jvNo','jvDate','particulars','tranTypeName','refNo','preparedName','jvStatusName','jvAmt'],
    widths:[1, 1, 1, 1, 1, 1, 1, 1],
    filters: [
      {
        key: 'jvNo',
        title: 'J.V. No.',
        dataType: 'text'
      },
      {
        key: 'jvDate',
        title: 'JV Date',
        dataType: 'date'
      },
      {
        key: 'particulars',
        title: 'Particulars',
        dataType: 'text'
      },
      {
        key: 'jvType',
        title: 'J.V Type',
        dataType: 'text'
      },
      {
        key: 'jvRefNo',
        title: 'J.V Ref No',
        dataType: 'text'
      },
      {
        key: 'preparedBy',
        title: 'Prepared By',
        dataType: 'text'
      },
      /*{
        key: 'jvStatus',
        title: 'J.V Status',
        dataType: 'text'
      },*/
      {
        key: 'amount',
        title: 'Amount',
        dataType: 'text'
      }
    ],
      checkFlag : true,
      pageLength: 10,
      pageStatus: true,
      pagination: true,
      pageID: 1,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      genericBtn1:'Change Status to New',
      exportFlag: true,
      addFlag: false
  }

  passDataCV: any = {
      tableData: [],
      tHeader: ["CV No", "Payee", "CV Date", "Status","Particulars","Amount"],
      dataTypes: ['text','text','date','text','text','currency',],
      uneditable:[true, true, true, true, true, true],
      keys:['cvGenNo','payee','cvDate','cvStatusDesc','particulars','cvAmt'],
      widths:[1, 1, 1, 1, 1, 1],
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
      checkFlag : true,
      pageLength: 10,
      pageStatus: true,
      pagination: true,
      pageID: 1,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      genericBtn1:'Change Status to New',
      exportFlag: true
  }

   record: any = {
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: ''
  }


  searchParams: any[] = [];
  selected: any;
  selectedData: any[] = [];
  selectedAcitData  : any = { 
                "updateAcitStatusList": []};
  dialogIcon: string = '';
  dialogMessage: string = '';

  btnDisabled: boolean = false;
  tranStat: string = 'new';

  constructor(private router: Router,private titleService: Title, private as: AccountingService, private ns: NotesService, public modalService: NgbModal) { }

  ngOnInit() {
    this.as.arFilter = '';
    this.as.jvFilter = '';
    this.as.prqFilter = '';

    if(this.as.cvFilter != '') {
      this.tranStat = this.as.cvFilter;
      console.log(this.tranStat);
    }

    if (this.tranFlag === 'AR'){
       this.titleService.setTitle("Acct-IT | Change Transaction Status to New | Acknowledgement Receipt");
       // this.passDataAR.btnDisabled = false;
       this.retrieveArList();
    } else if (this.tranFlag === 'JV'){
        this.titleService.setTitle("Acct-IT | Change Transaction Status to New | Journal Voucher");
        this.retrieveJVlist();
    } else if (this.tranFlag === 'CV'){
        this.titleService.setTitle("Acct-IT | Change Transaction Status to New | Check Voucher");
        this.retrieveCVlist();
    }
   
  }

  retrieveArList(){
    this.as.getArList(this.searchParams).subscribe(
      (data: any)=>{
        if(data.ar.length !== 0){
          console.log(data);
          for(var i:number = 1; i<data.ar.length; i++){
              if (data.ar[i].arStatDesc === 'Cancelled' ){
                this.passDataAR.tableData.push(data.ar[i]);
              }
          }
          this.ARTable.refreshTable();
          this.passDataAR.btnDisabled = false;
        }
      },
      (error)=>{
        this.passDataAR.tableData = [];
        this.ARTable.refreshTable();
      }
    )
  }

  retrieveJVlist(){
    this.as.getJVListing(this.searchParams).subscribe((data:any) => {
      for(var i=0; i< data.transactions.length;i++){
        if (data.transactions[i].jvListings.jvStatusName === 'For Approval' || data.transactions[i].jvListings.jvStatusName === 'Approved'
           || data.transactions[i].jvListings.jvStatusName === 'Printed' || data.transactions[i].jvListings.jvStatusName === 'Cancelled'){
            this.passDataJV.tableData.push(data.transactions[i].jvListings);
          this.passDataJV.tableData[this.passDataJV.tableData.length - 1].jvNo = String(data.transactions[i].jvListings.jvYear) + '-' +  String(data.transactions[i].jvListings.jvNo).padStart(8,'0');
          this.passDataJV.tableData[this.passDataJV.tableData.length - 1].transactions = data.transactions[i];
         }
      }
      this.JVTable.refreshTable();
    });
  }


  retrieveCVlist(){
 
    this.as.getAcitCvList(this.searchParams).subscribe(data => {

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

      this.passDataCV.tableData = rec.filter(a => String(a.cvStatus).toUpperCase() === 'X' ||
                                                  String(a.cvStatus).toUpperCase() === 'P' 
                                            );
      this.CVTable.refreshTable();

    });
  }

   onRowClick(data){
    if(data === null || (data !== null && Object.keys(data).length === 0)){
      this.record.createUser = '';
      this.record.createDate = '';
      this.record.updateUser = '';
      this.record.updateDate = '';
      this.selected = {};
    }else{
      this.selected = data;
      this.record.createUser = data[0].createUser;
      this.record.createDate = this.ns.toDateTimeString(data[0].createDate);
      this.record.updateUser = data[0].updateUser;
      this.record.updateDate = this.ns.toDateTimeString(data[0].updateDate);
      console.log(this.record);
    }

   if(this.tranFlag === 'AR'){
     setTimeout(a=>{this.ARTable.btnDisabled = false,0});
   }else if (this.tranFlag === 'CV'){
     setTimeout(a=>{this.CVTable.btnDisabled = false,0});
   }else if (this.tranFlag === 'JV'){
     setTimeout(a=>{this.JVTable.btnDisabled = false,0});
   };
   
  }

  onChange(obj){
      this.selectedData = [];
      this.selectedAcitData.updateAcitStatusList = [];

      if(obj === 'AR'){
        for(var i= 0; i< this.passDataAR.tableData.length; i++){
            if(this.passDataAR.tableData[i].checked){
              this.selectedData.push({ tranId : this.passDataAR.tableData[i].tranId,
                                       arNo   : this.passDataAR.tableData[i].arNo,
                                       status : 'N',
                                       tranClass : 'AR',
                                       updateUser : this.ns.getCurrentUser()
                                     });
            }
        }
      } else if (obj === 'JV'){
        for(var i= 0; i< this.passDataJV.tableData.length; i++){
            if(this.passDataJV.tableData[i].checked){
              this.selectedData.push({ tranId : this.passDataJV.tableData[i].tranId,
                                       arNo   : this.passDataJV.tableData[i].arNo,
                                       status : 'N',
                                       tranClass : 'JV',
                                       updateUser : this.ns.getCurrentUser()
                                     });
            }
        }
      } else if (obj === 'CV'){
        for(var i= 0; i< this.passDataCV.tableData.length; i++){
            if(this.passDataCV.tableData[i].checked){
              this.selectedData.push({ tranId : this.passDataCV.tableData[i].tranId,
                                       arNo   : this.passDataCV.tableData[i].arNo,
                                       status : 'N',
                                       tranClass : 'CV',
                                       updateUser : this.ns.getCurrentUser()
                                     });
            }
        }
      }
      

      if (this.selectedData.length !== 0) {
         $('#confirmModal > #modalBtn').trigger('click');
      }  else {
          if (obj === 'AR'){
            this.dialogMessage="Please choose at least one AR record";
          } else if (obj === 'JV'){
            this.dialogMessage="Please choose at least one JV record";
          } else if (obj === 'CV'){
            this.dialogMessage="Please choose at least one CV record";
          }
          this.dialogIcon = "error-message";
          this.successDialog.open();
      } 
  }

  onChangeStatus(obj,tranClass){
     this.selectedAcitData.updateAcitStatusList = obj;
     console.log(this.selectedAcitData);

      if (tranClass === 'AR'){
          this.passDataAR.tableData = [];
          this.ARTable.overlayLoader = true;
      } else if (tranClass === 'JV'){
          this.passDataJV.tableData = [];
          this.JVTable.overlayLoader = true;
      } else if (tranClass === 'CV'){
          this.passDataCV.tableData = [];
          this.CVTable.overlayLoader = true;
      }
    
       this.as.updateAcitStatus(this.selectedAcitData).subscribe((data:any) => {
        if(data['returnCode'] != -1) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            this.successDialog.open();
        }else{
            this.dialogIcon = "success";
            this.successDialog.open();
            this.record = [];
            if (tranClass === 'AR'){
              this.ARTable.overlayLoader = false;
              this.retrieveArList();
            } else if (tranClass === 'JV'){
              this.JVTable.overlayLoader = false;
              this.retrieveJVlist();
            } else if (tranClass === 'CV'){
              this.CVTable.overlayLoader = false;
              this.retrieveCVlist();
            }            
        }
     });
   }

   toViewRecord(data,tranflag){
    if(this.tranFlag === 'AR') {
      console.log(data);
     let record = {
        tranId: data.tranId,
        arNo: data.arNo == null ? '' : data.arNo,
        payor: data.payor,
        arDate: data.arDate,
        paymentType: data.tranTypeName,
        status: data.arStatDesc,
        particulars: data.particulars,
        amount: data.arAmt
      }
      this.router.navigate(['/accounting-in-trust', { slctd: JSON.stringify(record), action: 'edit' }], { skipLocationChange: true });
    }else if (this.tranFlag === 'CV'){
       console.log(data);
     let record = {
        tranId: data.tranId,
        arNo: data.arNo == null ? '' : data.arNo,
        payor: data.payor,
        arDate: data.arDate,
        paymentType: data.tranTypeName,
        status: data.arStatDesc,
        particulars: data.particulars,
        amount: data.arAmt
      }
      setTimeout(() => {
        this.router.navigate(['/generate-cv', { tranId :data.tranId , from: 'cv-list' }], { skipLocationChange: true });
      },100);}
  }

  searchCVQuery(searchParams){
    this.searchParams = searchParams;
    this.passDataCV.tableData = [];
    console.log(this.searchParams);
    this.retrieveCVlist();
  }

  searchARQuery(searchParams){
        this.searchParams = searchParams;
        this.passDataAR.tableData = [];
        this.retrieveArList();
  }

  searchJVQuery(searchParams){
        this.searchParams = searchParams;
        this.passDataAR.tableData = [];
        this.retrieveJVlist();
  }

  exportCV(){
     var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var hr = String(today.getHours()).padStart(2,'0');
      var min = String(today.getMinutes()).padStart(2,'0');
      var sec = String(today.getSeconds()).padStart(2,'0');
      var ms = today.getMilliseconds()
      var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'CheckVoucherList_'+currDate+'.xls'
    var mystyle = {
      headers:true, 
      column: {style:{Font:{Bold:"1"}}}
    };

    alasql.fn.datetime = function(dateStr) {
      var date = new Date(dateStr);
      return date.toLocaleString();
    };


    alasql('SELECT cvGenNo AS [C.V. No], payee AS Payee, datetime(cvDate) AS [C.V. Date], cvStatusDesc AS Status, particulars AS Particulars, cvAmt AS Amount INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passDataCV.tableData]);
  }

  exportAR(){
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
    var filename = 'AckgtReceipt'+currDate+'.xls'
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
      for(var i of this.passDataAR.tableData){
        i.arNo = i.arNo == null ? '' : i.formattedArNo.split('-')[1];
        tableData.push(i);
      }
      //alasql('SELECT paytReqNo AS PaytReqNo, payee AS Payee, tranTypeDesc AS PaymentType, reqStatusDesc AS Status, datetime(reqDate) AS RequestedDate, particulars AS Particulars, currCd AS Curr, reqAmt AS Amount, requestedBy AS RequestedBy INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
    alasql('SELECT arNo AS [A.R. No.], payor AS [Payor], datetime(arDate) AS [A.R. Date], tranTypeName AS [Payment Type], particulars AS [Particulars], currency(arAmt) AS [Amount] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,tableData]);
  }

  exportJV(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'JournalVoucherList_'+currDate+'.xls'

    var mystyle = {
      headers:true, 
      column: {style:{Font:{Bold:"1"}}}
    };

    alasql.fn.datetime = function(dateStr) {
      var date = new Date(dateStr);
      return date.toLocaleString();
    };

    alasql('SELECT jvNo AS [J.V. No], datetime(jvDate) AS [J.V. Date], particulars AS Particulars, tranTypeName AS [JV Type], refNo AS [JV Ref. No.], preparedName AS [Prepared By],jvAmt AS Amount INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passDataJV.tableData]);
  }

}
