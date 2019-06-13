import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaimsHistoryInfo } from '@app/_models';
import { ClaimsService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clm-claim-history',
  templateUrl: './clm-claim-history.component.html',
  styleUrls: ['./clm-claim-history.component.css']
})
export class ClmClaimHistoryComponent implements OnInit {
  @ViewChild('histTbl') histTbl    : CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn       : CancelButtonComponent;

  private claimsHistoryInfo = ClaimsHistoryInfo;

  passDataHistory: any = {
    tableData     : [],
    tHeader       : ['Hist. No.', 'Hist. Type', 'Type', 'Ex-Gratia', 'Curr', 'Reserve', 'Payment Amount', 'Ref. No.', 'Ref. Date', 'Remarks'],
    dataTypes     : ['number', 'select', 'select', 'checkbox', 'select', 'currency', 'currency', 'text', 'date', 'text'],
    nData: {
      histNo       : '',
      histCategory : '',
      histType     : '',
      exGratia     : '',
      currencyCd   : '',
      reserveAmt   : '',
      paytAmt      : 0,
      refNo        : '',
      refDate      : '',
      remarks      : ''
    },
    opts: [
      {selector   : 'histCategory',prev : [], vals: []},
      {selector   : 'histType',    prev : [], vals: []},
      {selector   : 'currencyCd',  prev : [], vals: []}
    ],
    keys          : ['histNo','histCategory','histType','exGratia','currencyCd','reserveAmt','paytAmt','refNo','refDate','remarks'],
    uneditable    : [true,false,false,false,false,false,true,true,true,false],
    pageLength    : 10,
    paginateFlag  : true,
    infoFlag      : true,
    addFlag       : true,
    widths        : [1,150,147,1,67,91,118,78,1,'auto'],
    pageID        : 'clm-history',
  };

  passDataApprovedAmt: any = {
    tableData     : [],
    tHeader       : ['Hist. No.', 'Approved Amount', 'Approved By', 'Approved Date', 'Remarks'],
    dataTypes     : ['sequence-3', 'currency', 'text', 'date', 'text'],
    nData: {
      histNo       : '',
      approvedAmt  : '',
      approvedBy   : '',
      approvedDate : '',
      remarks      : ''
    },
    keys          : ['histNo','approvedAmt','approvedBy','approvedDate','remarks'],
    uneditable    : [true,false,false,false,false],
    pageLength    : 10,
    paginateFlag  : true,
    infoFlag      : true,
    addFlag       : true,
    widths        : [1,150,147,1,'auto'],
    pageID        : 'clm-app-amt',
  };

  clmHistoryData : any ={
    updateDate   : null,
    updateUser   : null,
    createDate   : null,
    createUser   : null,
    claimNo      : null,
    policyNo     : null,
    insured      : null,
    risk         : null,
    lossResAmt   : null,
    lossStatCd   : null,
    lossPdAmt    : null,
    expResAmt    : null,
    expStatCd    : null,
    expPdAmt     : null,
    totalRes     : null,
    totalPayt    : null,
    claimStat    : null,
    approvedAmt  : null,
    approvedBy   : null,
    approvedDate : null
  };

  constructor(private titleService: Title, private clmService: ClaimsService,private ns : NotesService, private mtnService: MaintenanceService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim History");
    this.getClaimHistory();
  }

  getClaimHistory(){
    var subs = forkJoin(this.clmService.getClaimHistory(),this.mtnService.getRefCode('HIST_CATEGORY'),this.mtnService.getRefCode('HIST_TYPE'),this.mtnService.getMtnCurrencyList(''))
                       .pipe(map(([clmHist,histCat,histType,curr]) => { return { clmHist,histCat,histType,curr }; }));
    subs.subscribe(data => {
      console.log(data);

      var recHistCat = data['histCat']['refCodeList'];
      this.passDataHistory.opts[0].vals = recHistCat.map(i => i.code);
      this.passDataHistory.opts[0].prev = recHistCat.map(i => i.description);

      var recHistType = data['histType']['refCodeList'];
      this.passDataHistory.opts[1].vals = recHistType.map(i => i.code);
      this.passDataHistory.opts[1].prev = recHistType.map(i => i.description);

      var recCurr = data['curr']['currency'];
      this.passDataHistory.opts[2].vals = recCurr.map(i => i.currencyCd);
      this.passDataHistory.opts[2].prev = recCurr.map(i => i.currencyCd);      

      var recClmHist = data['clmHist']['claimHistoryList'].map(i => { i.refDate = this.ns.toDateTimeString(i.refDate); i.createDate = this.ns.toDateTimeString(i.createDate);
                                                                      i.updateDate = this.ns.toDateTimeString(i.updateDate); return i;});
      this.passDataHistory.tableData = recClmHist;
      this.histTbl.refreshTable();
      this.compResPayt();
    });
  }

  compResPayt(){
    const arrSum = arr => arr.reduce((a,b) => a + b, 0);
    this.clmHistoryData.lossResAmt = arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'L').map(i => { return i.reserveAmt;}));
    this.clmHistoryData.expResAmt = arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'A' || i.histCategory.toUpperCase() == 'O').map(i => { return i.reserveAmt;}));
  
    this.clmHistoryData.lossPdAmt  = arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'L').map(i => { return i.paytAmt;}));
    this.clmHistoryData.expPdAmt  = arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'A' || i.histCategory.toUpperCase() == 'O').map(i => { return i.paytAmt;}));
  
    this.clmHistoryData.totalRes = this.clmHistoryData.lossResAmt + this.clmHistoryData.expResAmt;
    this.clmHistoryData.totalPayt = this.clmHistoryData.lossPdAmt + this.clmHistoryData.expPdAmt;
  }

  clickRow(event){
    if(event != null){
      this.clmHistoryData.updateDate  = event.updateDate;
      this.clmHistoryData.updateUser  = event.updateUser;
      this.clmHistoryData.createDate  = event.createDate;
      this.clmHistoryData.createUser  = event.createUser;
    }else{
      this.clmHistoryData.updateDate  = '';
      this.clmHistoryData.updateUser  = '';
      this.clmHistoryData.createDate  = '';
      this.clmHistoryData.createUser  = '';
    }
  }

  showResStatMdl(){
    $('#resStatMdl > #modalBtn').trigger('click');
  }

  showApprovedAmtMdl(){
    $('#approvedAmtMdl > #modalBtn').trigger('click');
  }

}
