import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaimsHistoryInfo } from '@app/_models';
import { ClaimsService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { MtnClaimStatusLovComponent } from '@app/maintenance/mtn-claim-status-lov/mtn-claim-status-lov.component';

@Component({
  selector: 'app-clm-claim-history',
  templateUrl: './clm-claim-history.component.html',
  styleUrls: ['./clm-claim-history.component.css']
})
export class ClmClaimHistoryComponent implements OnInit {
  @ViewChild('histTbl') histTbl                      : CustEditableNonDatatableComponent;
  @ViewChild('apAmtTbl') apAmtTbl                    : CustEditableNonDatatableComponent;
  @ViewChild('cancelClmHist') cancelBtn              : CancelButtonComponent;
  @ViewChild('cancelAppAmt') cancelBtnAppAmt         : CancelButtonComponent;
  @ViewChild('successClmHist') successClmHist        : SucessDialogComponent;
  @ViewChild('successAppAmt') successAppAmt          : SucessDialogComponent;
  @ViewChild('confirmClmHist') cs                    : ConfirmSaveComponent;
  @ViewChild('confirmAppAmt') csAppAmt               : ConfirmSaveComponent;
  @ViewChild(MtnClaimStatusLovComponent) clmStatsLov : MtnClaimStatusLovComponent;

  private claimsHistoryInfo = ClaimsHistoryInfo;

  passDataHistory: any = {
    tableData     : [],
    tHeader       : ['Hist. No.', 'Hist. Type', 'Type', 'Ex-Gratia', 'Curr', 'Curr Rt', 'Reserve', 'Payment Amount', 'Ref. No.', 'Ref. Date', 'Remarks'],
    dataTypes     : ['sequence-3', 'select', 'select', 'checkbox', 'text', 'percent', 'currency', 'currency', 'text', 'date', 'text'],
    nData: {
      claimId      : '2',
      projId       : '2',
      histNo       : '',
      histCategory : '',
      histType     : '',
      exGratia     : '',
      currencyCd   : '',
      currencyRt   : '',
      reserveAmt   : '',
      paytAmt      : 0,
      refNo        : '',
      refDate      : '',
      remarks      : ''
    },
    opts: [
      {selector   : 'histCategory',prev : [], vals: []},
      {selector   : 'histType',    prev : [], vals: []}
    ],
    keys          : ['histNo','histCategory','histType','exGratia','currencyCd','currencyRt','reserveAmt','paytAmt','refNo','refDate','remarks'],
    uneditable    : [true,false,false,false,true,true,false,true,true,true,false],
    pageLength    : 10,
    paginateFlag  : true,
    infoFlag      : true,
    addFlag       : true,
    widths        : [1,150,147,1,67,'auto',91,118,78,1,'auto'],
    pageID        : 'clm-history',
  };

  passDataApprovedAmt: any = {
    tableData     : [],
    tHeader       : ['Hist. No.', 'Approved Amount', 'Approved By', 'Approved Date', 'Remarks'],
    dataTypes     : ['sequence-3', 'currency', 'text', 'date', 'text'],
    nData: {
      claimId      : '2',
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
    updateDate   : '',
    updateUser   : '',
    createDate   : '',
    createUser   : '',
    claimNo      : '',
    policyNo     : '',
    insured      : '',
    risk         : '',
    lossResAmt   : '',
    lossStatCd   : '',
    lossPdAmt    : '',
    expResAmt    : '',
    expStatCd    : '',
    expPdAmt     : '',
    totalRes     : '',
    totalPayt    : '',
    claimStat    : '',
    approvedAmt  : '',
    approvedBy   : '',
    approvedDate : ''
  };

  dialogIcon        : string;
  dialogMessage     : string;
  cancelFlag        : boolean;
  cancelFlagAppAmt  : boolean;

  params : any =    {
    saveClaimHistory   : []
  };

  paramsApvAmt : any =    {
    saveClaimApprovedAmt   : []
  };

  constructor(private titleService: Title, private clmService: ClaimsService,private ns : NotesService, private mtnService: MaintenanceService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim History");
    this.getClaimHistory();
    this.getClaimApprovedAmt();
  }

  getClaimHistory(){
    var subs = forkJoin(this.clmService.getClaimHistory('2','','2',''),this.mtnService.getRefCode('HIST_CATEGORY'),this.mtnService.getRefCode('HIST_TYPE'),this.clmService.getClaimSecCover(2,''))
                       .pipe(map(([clmHist,histCat,histType,curr]) => { return { clmHist,histCat,histType,curr }; }));
    subs.subscribe(data => {
      console.log(data);

      var recHistCat = data['histCat']['refCodeList'];
      this.passDataHistory.opts[0].vals = recHistCat.map(i => i.code);
      this.passDataHistory.opts[0].prev = recHistCat.map(i => i.description);

      var recHistType = data['histType']['refCodeList'];
      this.passDataHistory.opts[1].vals = recHistType.map(i => i.code);
      this.passDataHistory.opts[1].prev = recHistType.map(i => i.description);

      var recCurr = data['curr']['claims']['clmProject']['clmCoverage'];
      this.passDataHistory.nData.currencyCd = recCurr.currencyCd;
      this.passDataHistory.nData.currencyRt = recCurr.currencyRt;

      var recClmHist = data['clmHist']['claimReserveList'][0]['clmHistory'].map(i => { i.refDate = this.ns.toDateTimeString(i.refDate); i.createDate = this.ns.toDateTimeString(i.createDate);
                                                                      i.updateDate = this.ns.toDateTimeString(i.updateDate); return i;});
      this.passDataHistory.tableData = recClmHist;
      this.histTbl.refreshTable();
      this.compResPayt();
    });
  }

  getClaimApprovedAmt(){
    this.apAmtTbl.overlayLoader = true;
    this.clmService.getClaimApprovedAmt('2','')
    .subscribe(data => {
      console.log(data);
      this.passDataApprovedAmt.tableData = [];
      var rec = data['claimApprovedAmtList'].map(i => { 
        i.createDate = this.ns.toDateTimeString(i.createDate);
        i.updateDate = this.ns.toDateTimeString(i.updateDate); 
        i.approvedDate = this.ns.toDateTimeString(i.approvedDate); 
        return i; 
      });
      this.passDataApprovedAmt.tableData = rec;
      this.apAmtTbl.refreshTable();
      this.apAmtTbl.onRowClick(null, this.passDataApprovedAmt.tableData[0]);
      console.log(this.passDataApprovedAmt.tableData[0]);
      var statsInfo = this.passDataApprovedAmt.tableData[0];
      this.clmHistoryData.approvedAmt  = statsInfo.approvedAmt;
      this.clmHistoryData.approvedBy   = statsInfo.approvedBy;
      this.clmHistoryData.approvedDate = this.ns.toDateTimeString(statsInfo.approvedDate);
    });
  }

  onSaveClaimApprovedAmt(){
    console.log(JSON.parse(JSON.stringify(this.paramsApvAmt)));
    this.clmService.saveClaimApprovedAmt(JSON.stringify(this.paramsApvAmt))
    .subscribe(data => {
      console.log(data);
      this.getClaimApprovedAmt();
      this.successAppAmt.open();
      this.paramsApvAmt.saveClaimApprovedAmt = [];
    });
  }

  onClickSaveAppAmt(cancelFlag?){
    this.cancelFlagAppAmt = cancelFlag !== undefined;
    console.log(this.cancelFlagAppAmt);
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;

    for(let record of this.passDataApprovedAmt.tableData){
      if(record.approvedAmt == '' || record.approvedBy == '' || record.approvedDate == ''){
        if(!record.deleted){
          isEmpty = 1;
          record.fromCancel = false;
        }
      }else{
        record.fromCancel = true;
        if(record.edited && !record.deleted){
          record.approvedDate  = (record.approvedDate == '' || record.approvedDate == undefined)?this.ns.toDateTimeString(0):record.approvedDate;
          record.createUser    = (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
          record.createDate    = (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):record.createDate;
          record.updateUser    = this.ns.getCurrentUser();
          record.updateDate    = this.ns.toDateTimeString(0);
          this.paramsApvAmt.saveClaimApprovedAmt.push(record);
        }
      }
    }

    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.successAppAmt.open();
      this.paramsApvAmt.saveClaimApprovedAmt   = [];
    }else{
      if(this.paramsApvAmt.saveClaimApprovedAmt.length == 0){
        console.log('this.paramsApvAmt.saveClaimApprovedAmt');
        //this.successAppAmt.open();
        $('#appAmtId .ng-dirty').removeClass('ng-dirty');
        this.csAppAmt.confirmModal();
        this.paramsApvAmt.saveClaimApprovedAmt   = [];
        this.passDataApprovedAmt.tableData = this.passDataApprovedAmt.tableData.filter(a => a.approvedAmt != '');
      }else{
        console.log('ELSE this.paramsApvAmt.saveClaimApprovedAmt');
        if(this.cancelFlagAppAmt == true){
          this.csAppAmt.showLoading(true);
          setTimeout(() => { try{this.csAppAmt.onClickYes();}catch(e){}},500);
        }else{
          this.csAppAmt.confirmModal();
        }
      }  
    }
  }


  onSaveClaimHistory(){
    console.log(JSON.parse(JSON.stringify(this.params)));

    this.clmService.saveClaimHistory(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      this.getClaimHistory();
      this.successClmHist.open();
      this.params.saveClaimHistory = [];
    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';

    var isEmpty = 0;

    for(let record of this.passDataHistory.tableData){
      if(record.histCategory == '' || record.histType == '' || record.currencyCd == '' || record.reserveAmt == ''){
        if(!record.deleted){
          isEmpty = 1;
          record.fromCancel = false;
        }
      }else{
        record.fromCancel = true;
        if(record.edited && !record.deleted){
          record.createUser    = (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
          record.createDate    = (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):record.createDate;
          record.updateUser    = this.ns.getCurrentUser();
          record.updateDate    = this.ns.toDateTimeString(0);
          this.params.saveClaimHistory.push(record);
        }
      }
    }

    console.log(this.passDataHistory.tableData);

    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.successClmHist.open();
      this.params.saveClaimHistory   = [];
    }else{
      if(this.params.saveClaimHistory.length == 0){
        $('.ng-dirty').removeClass('ng-dirty');
        this.cs.confirmModal();
        this.params.saveClaimHistory   = [];
        this.passDataHistory.tableData = this.passDataHistory.tableData.filter(a => a.histCategory != '');
      }else{
        if(this.cancelFlag == true){
          this.cs.showLoading(true);
          setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},500);
        }else{
          this.cs.confirmModal();
        }
      }
    }
     console.log(this.cancelFlag + ' onClickSave cancelFlag');
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

  checkCancel(){
    if(this.cancelFlag == true){
      if(this.passDataHistory.tableData.some(i => i.fromCancel == false)){
        return;
      }else{
        this.cancelBtn.onNo();
      }
    }
  }

  checkCancelAppAmt(){
    console.log(this.cancelFlagAppAmt + ' checkCancelAppAmt cancelFlagAppAmt');

    if(this.cancelFlagAppAmt == true){
      if(this.passDataApprovedAmt.tableData.some(i => i.fromCancel == false)){
        return;
      }else{
        this.cancelBtnAppAmt.onNo();
      }
    }
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  onClickCancelAppAmt(){
    this.cancelBtnAppAmt.clickCancel();
  }

  showResStatMdl(){
    $('#resStatMdl > #modalBtn').trigger('click');
  }

  showApprovedAmtMdl(){
    $('#approvedAmtMdl > #modalBtn').trigger('click');
    this.getClaimApprovedAmt();
  }

  setStats(event){
    this.clmHistoryData.claimStat = event.description;
    this.ns.lovLoader(event.ev, 0);
  }

  checkCodeStats(event){
    this.ns.lovLoader(event, 1);
    this.clmStatsLov.checkCode(this.clmHistoryData.claimStat.toUpperCase(), event);
  }

  showStatsLov(){
    $('#clmStatsLov #modalBtn').trigger('click');
  }

  addHistTblDirty(){
    $('#histId .ng-untouched').addClass('ng-dirty');
  }

  removeHistTblDirty(){
    $('#histId .ng-dirty').removeClass('ng-dirty');
  }


}
