import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaimPaymentRequests } from  '@app/_models';
import { Router } from '@angular/router';
import { ClaimsService, NotesService, UserService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-payment-requests',
  templateUrl: './payment-requests.component.html',
  styleUrls: ['./payment-requests.component.css']
})
export class PaymentRequestsComponent implements OnInit {

  btnDisabled: boolean;
  btnDisabled_neg: boolean;
  tableData: any[] = [];
  allData: any[] = [];
  tHeader: any[] = [];
  resizables: boolean[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];
  pageLength: number;

   passData: any = {
    tableData: [], 
    tHeader: ['Claim No', 'Hist No.', 'Policy No', 'Payment Request No', 'Payee', 'Payment Type', 'Status', 'Curr', 'Amount', 'Particulars','Request Date','Requested By','Acct. Ref. No.','Acct. Tran. Date','Insured','Risk','Loss Date'],
    dataTypes: ['text','text','text','text','text','text','text','text','currency','text','date','text','text','date','text','text','date'],
    keys:['claimNo','histNo','policyNo','paytReqNo','payee','paymentType','status','currCd','reqAmount','particulars','reqDate','requestedBy','acctRefNo','tranDate','insuredDesc','riskName','lossDate'],
    uneditable:[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    pageLength: 10,
    searchFlag:true,
    pagination: true,
    pageStatus: true,
    filters: [
      {
        key: 'claimNo',
        title:'Claim No.',
        dataType: 'text'
      },
      {
        key: 'histNo',
        title:'Hist No.',
        dataType: 'text'
      },
      {
        key: 'policyNo',
        title:'Policy No',
        dataType: 'text'
      },
      {
        key: 'paytReqNo',
        title:'Payt Req No',
        dataType: 'text'
      },
      {
        key: 'payee',
        title:'Payee',
        dataType: 'text'
      },
      {
        key: 'paytType',
        title:'Payment Type',
        dataType: 'text'
      },
      {
        key: 'currCd',
        title:'Curr',
        dataType: 'text'
      },
      {
        key: 'resAmt',
        title:'Amount',
        dataType: 'text'
      },
      {
        key: 'particulars',
        title:'Particulars',
        dataType: 'text'
      },
      {
        key: 'reqDate',
        title:'Requested Date',
        dataType: 'date'
      },
      {
        key: 'reqBy',
        title:'Requested By',
        dataType: 'text'
      },
      {
        key: 'acctRef',
        title:'Acct. Ref. No',
        dataType: 'text'
      },
      {
        key: 'tranDate',
        title:'Acct. Tran. Date',
        dataType: 'date'
      },
      {
        key: 'insuredDesc',
        title:'Insured',
        dataType: 'text'
      },
      {
        key: 'riskName',
        title:'Risk',
        dataType: 'text'
      },
      {
        key: 'lossDate',
        title:'Loss Date',
        dataType: 'date'
      }
    ],
    exportFlag: true
  }

  searchParams : any = {
    claimNo: ''
  }

  selected:any = null;

   @ViewChild('confirmation') confirmation;
   @ViewChild('inqTable') inqTable: LoadingTableComponent;
   
  constructor(private claimsService: ClaimsService, private router: Router, private modalService: NgbModal, private titleService: Title, private ns: NotesService, private userService: UserService) { }

  ngOnInit() {
  	this.btnDisabled = false;
  	this.btnDisabled_neg = true;
  	this.titleService.setTitle("Clm | Payment Request Inquiry");
    this.userService.emitModuleId("CLM010");

  	this.getList();
  }

  getList(){
    var recs = []
    this.claimsService.getClaimPaytReqInq(this.searchParams).subscribe((a:any)=>{
      this.inqTable.placeData(a['list']);
    })
  }

  searchQuery(searchParams){
    for(let key of Object.keys(searchParams)){
      this.searchParams[key] = searchParams[key];
    }
    this.getList();
   }

  open(content) {
        this.modalService.dismissAll();
        this.modalService.open(this.confirmation,  { centered: true, windowClass : 'modal-size'} );
    }


  toPaytReq(data){
    console.log(data)
    let line = data.policyNo.split('-')[0];
      this.router.navigate(
                      ['/claims-claim', {
                          from: 'edit',
                          readonly: true,
                          claimId: data.claimId,
                          claimNo: data.claimNo,
                          line: line,
                          exitLink: 'payment-request',
                          tab: 'paymentRequest',

                          clmStatus:data.clmStatus,
                          insuredDesc:data.insuredDesc,
                          policyId:data.policyId,
                          policyNo:data.policyNo,
                          projId:data.projId,
                          riskId:'',
                          riskName:data.riskName,
                      }],
                      { skipLocationChange: true }
        );
  }

  getRecords(printParams?){
    this.claimsService.getClaimPaytReqInq(this.searchParams).pipe(finalize(() => this.finalGetRecords())).subscribe((data:any)=>{
      this.passData.tableData = data.list;
    });
  }

  finalGetRecords(selection?){
    this.export(this.passData.tableData);
  };

  export(record?){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'ClaimPaymentRequestInquiry'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.nvl = function(text) {
        if (text === null){
          return '';
        } else {
          return text;
        }
      };

      alasql.fn.datetime = function(dateStr) {
             var date = new Date(dateStr);
             return date.toLocaleString().split(',')[0];
       };
    alasql('SELECT  claimNo AS [Claim No],  histNo AS [Hist No.],  policyNo AS [Policy No],  paytReqNo AS [Payment Request No],  payee AS [Payee],  paymentType AS [Payment Type],  status AS [Status],  currCd AS [Curr],  reqAmount AS [Amount],  particulars AS [Particulars],  datetime(reqDate) AS [Request Date],  requestedBy AS [Requested By],  acctRefNo AS [Acct. Ref. No.],  datetime(tranDate) AS [Acct. Tran. Date],  insuredDesc AS [Insured],  riskName AS [Risk],  datetime(lossDate) AS [Loss Date] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);    
  }
}
