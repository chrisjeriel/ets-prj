import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { AccCVPayReqList} from '@app/_models';

@Component({
  selector: 'app-cv-payment-request-list',
  templateUrl: './cv-payment-request-list.component.html',
  styleUrls: ['./cv-payment-request-list.component.css']
})
export class CvPaymentRequestListComponent implements OnInit {

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];


  passData: any = {
    tableData: [],
    tHeader       : ['Payment Request No.','Payment Type','Request Date','Particulars','Requested By','Curr','Amount'],
    resizable     : [true, true, true, true, true, true, true],
    dataTypes     : ['lov-input','text','date','text','text','text','currency'],
    magnifyingGlass : ['paytReqNo'],
    nData : {
      paytReqNo     : '',
      tranTypeDesc  : '',
      reqDate       : '',
      particulars   : '',
      requestedBy   : '',
      currCd        : '',
      reqAmt        : '',
      showMG        : 1
    },
    total         : [null,null,null,null,null,'Total','amount'],
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    infoFlag      : true,
    paginateFlag  : true,
    searchFlag    : true,
    pageLength    : 10,
    widths        : [120,250,100,250,150,1,150],
    genericBtn    : 'Save',
    pageID        : 'passDataCvPaytReq',
  };



  constructor(private titleService: Title,private accountingService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle(" Acct | CV | Payment Request List");
  	this.passData.tableData = this.accountingService.getAccCVPayReqList();
  }

  getPaytReqList(){
    this.accountingService.getPaytReqList([])
    .subscribe(data => {
      console.log(data);
      var rec = data['acitPaytReq']
    });
  }

}
