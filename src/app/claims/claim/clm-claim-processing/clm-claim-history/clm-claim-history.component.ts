import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ClaimsHistoryInfo } from '@app/_models';
import { ClaimsService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { forkJoin } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';
import { MtnClaimStatusLovComponent } from '@app/maintenance/mtn-claim-status-lov/mtn-claim-status-lov.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-clm-claim-history',
  templateUrl: './clm-claim-history.component.html',
  styleUrls: ['./clm-claim-history.component.css']
})
export class ClmClaimHistoryComponent implements OnInit {
  @ViewChild('histTbl') histTbl                      : CustEditableNonDatatableComponent;
  @ViewChild('apAmtTbl') apAmtTbl                    : CustEditableNonDatatableComponent;
  @ViewChild('resStatTbl') resStatTbl                : CustEditableNonDatatableComponent;
  @ViewChild('cancelClmHist') cancelBtn              : CancelButtonComponent;
  @ViewChild('cancelAppAmt') cancelBtnAppAmt         : CancelButtonComponent;
  @ViewChild('cancelResStat') cancelBtnResStat       : CancelButtonComponent;
  @ViewChild('successClmHist') successClmHist        : SucessDialogComponent;
  @ViewChild('successAppAmt') successAppAmt          : SucessDialogComponent;
  @ViewChild('successResStat') successResStat        : SucessDialogComponent;
  @ViewChild('confirmClmHist') cs                    : ConfirmSaveComponent;
  @ViewChild('confirmAppAmt') csAppAmt               : ConfirmSaveComponent;
  @ViewChild('confirmResStat') csResStat             : ConfirmSaveComponent;
  @ViewChild(MtnClaimStatusLovComponent) clmStatsLov : MtnClaimStatusLovComponent;
  @ViewChild('resStatMdl') resStatMdl                : ModalComponent; 
  @ViewChild('resStatLov') resStatLov                : ModalComponent;
  @ViewChild('approvedAmtMdl') approvedAmtMdl        : ModalComponent;

  private claimsHistoryInfo = ClaimsHistoryInfo;

  passDataHistory: any = {
    tableData     : [],
    tHeader       : ['Hist. No.', 'Hist. Type', 'Type', 'Ex-Gratia', 'Curr', 'Curr Rt', 'Reserve', 'Payment Amount', 'Ref. No.', 'Ref. Date', 'Remarks'],
    dataTypes     : ['sequence-3', 'req-select', 'req-select', 'checkbox', 'text', 'percent', 'currency', 'currency', 'text', 'date', 'text'],
    nData: {
      newRec       : 1,
      claimId      : '',
      projId       : '',
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
      {selector   : 'histCatDesc', prev : [], vals: []},
      {selector   : 'histTypeDesc',prev : [], vals: []}
    ],
    keys          : ['histNo','histCatDesc','histTypeDesc','exGratia','currencyCd','currencyRt','reserveAmt','paytAmt','refNo','refDate','remarks'],
    uneditable    : [true,false,false,false,true,true,false,true,true,true,false],
    uneditableKeys: ['exGratia'], 
    pageLength    : 10,
    paginateFlag  : true,
    infoFlag      : true,
    addFlag       : true,
    disableAdd    : false,
    widths        : [1,150,147,1,67,'auto',91,118,78,1,'auto'],
    pageID        : 'clm-history',
  };

  passDataApprovedAmt: any = {
    tableData     : [],
    tHeader       : ['Hist. No.', 'Approved Amount', 'Approved By', 'Approved Date', 'Remarks'],
    dataTypes     : ['sequence-3', 'currency', 'text', 'date', 'text'],
    nData: {
      claimId      : '',
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

  passDataResStat : any = {
    tableData       : [],
      tHeader       : ['Reserve Status', 'Description'],
      dataTypes     : ['text', 'text'],
      pageLength    : 10,
      searchFlag    : true,
      infoFlag      : true,
      paginateFlag  : true,
      pageID        : 11,
      keys          : ['code','description'],
      widths        : [1,'auto'],
      uneditable    : [true,true]
  };

  clmHistoryData : any = {
    updateDate         : '',
    updateUser         : '',
    createDate         : '',
    createUser         : '',
    createDateRes      : '',
    createUserRes      : '',
    claimNo            : '',
    policyNo           : '',
    insuredDesc        : '',
    riskName           : '',
    lossResAmt         : '',
    lossStatCd         : '',
    lossPdAmt          : '',
    expResAmt          : '',
    expStatCd          : '',
    expPdAmt           : '',
    totalRes           : '',
    totalPayt          : '',
    claimStat          : '',
    approvedAmt        : '',
    approvedBy         : '',
    approvedDate       : '',

    allowMaxSi         : '',
    mtnParam           : '',
    claimId            : '',
    projId             : ''
  };

  dialogIcon        : string;
  dialogMessage     : string;
  cancelFlag        : boolean;
  cancelFlagAppAmt  : boolean;
  cancelFlagResStat : boolean;
  warnMsg           : string = '';
  lovData           : any;
  fromStat          : string = '';
  histTypeData      : any;
  fromCancelResStat : boolean;

  dirtyCounter : any = {
    hist     : 0,
    appAmt   : 0,
    resStats : 0  
  };

  preVal : any = {
    lossStatcd : '',
    expStatCd  : ''
  };

  params : any =    {
    saveClaimHistory   : []
  };

  paramsApvAmt : any =    {
    saveClaimApprovedAmt   : []
  };

  @Input() claimInfo = {
    claimId     : '',
    claimNo     : '',
    projId      : '',
    riskName    : '',
    insuredDesc : '',
    policyNo    : '',
  };

  constructor(private titleService: Title, private clmService: ClaimsService,private ns : NotesService, private mtnService: MaintenanceService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim History");
    this.clmHistoryData.claimId     = this.claimInfo.claimId;
    this.clmHistoryData.claimNo     = this.claimInfo.claimNo;
    this.clmHistoryData.policyNo    = this.claimInfo.policyNo;
    this.clmHistoryData.projId      = this.claimInfo.projId;
    this.clmHistoryData.riskName    = this.claimInfo.riskName;
    this.clmHistoryData.insuredDesc = this.claimInfo.insuredDesc; 
    this.getClaimHistory();
    this.getClaimApprovedAmt();
    this.getResStat();
    console.log(this.claimInfo);
    this.getClaimGenInfo();
  }

  getClaimGenInfo(){
    this.clmService.getClmGenInfo(this.clmHistoryData.claimId, this.claimInfo.claimNo)
    .subscribe(data => {
      console.log(data);
    });
  }

  getClaimHistory(){
    var subs = forkJoin(this.clmService.getClaimHistory(this.clmHistoryData.claimId,'',this.clmHistoryData.projId,''),this.mtnService.getRefCode('HIST_CATEGORY'),this.mtnService.getRefCode('HIST_TYPE'),
                        this.clmService.getClaimSecCover(this.clmHistoryData.claimId,''),this.mtnService.getMtnParameters('V'))
                       .pipe(map(([clmHist,histCat,histType,cov,param]) => { return { clmHist,histCat,histType,cov,param }; }));

    subs.subscribe(data => {
      console.log(data);

      var recHistCat   = data['histCat']['refCodeList'];
      var recHistType  = data['histType']['refCodeList'];
      var recCurr      = data['cov']['claims']['clmProject']['clmCoverage'];
      var recParam     = data['param']['parameters'].filter(el => el.paramName.toUpperCase() == 'ALLOW_MAX_SI').map(el => {return el});

      this.histTypeData = recHistType;

      this.clmHistoryData.mtnParam = String(recParam[0].paramValueV);
      this.clmHistoryData.allowMaxSi = data['cov']['claims']['clmProject']['clmCoverage'].allowMaxSi;
      console.log(this.clmHistoryData.allowMaxSi + ' >>>> this.clmHistoryData.allowMaxSi');
      this.passDataHistory.opts[0].vals = recHistCat.map(i => i.code);
      this.passDataHistory.opts[0].prev = recHistCat.map(i => i.description);

      this.passDataHistory.nData.currencyCd = recCurr.currencyCd;
      this.passDataHistory.nData.currencyRt = recCurr.currencyRt;

      try{
        if(data['clmHist']['claimReserveList'].length == 0){
          var recClmHist = data['clmHist']['claimReserveList'];
        }else{
          var res = data['clmHist']['claimReserveList'][0];
          this.clmHistoryData.lossStatCd    = res.lossStatus; 
          this.clmHistoryData.expStatCd     = res.expStatus;
          this.clmHistoryData.createUserRes = (res.createUser == '' || res.createUser == null)?this.ns.getCurrentUser():res.createUser;
          this.clmHistoryData.createDateRes = (res.createDate == '' || res.createDate == null)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(res.createDate);
          var recClmHist = data['clmHist']['claimReserveList'][0]['clmHistory']
                        .map(i => {  
                          i.claimID      = this.clmHistoryData.claimId;
                          i.projId       = this.clmHistoryData.projId;
                          i.refDate      = this.ns.toDateTimeString(i.refDate);
                          i.createDate   = this.ns.toDateTimeString(i.createDate);
                          i.updateDate   = this.ns.toDateTimeString(i.updateDate);
                          recHistCat.forEach(a => (a.description == i.histCatDesc)?i.histCategory=a.code:i.histCategory);
                          recHistType.forEach(a => (a.description == i.histTypeDesc)?i.histType=a.code:i.histType);
                          return i;
                        });
        }

        this.passDataHistory.tableData = recClmHist;
        console.log(this.passDataHistory.tableData);
        this.histTbl.refreshTable();
        this.histTbl.onRowClick(null, this.passDataHistory.tableData[0]);
        this.compResPayt();

      }catch(e){}
  
      });
  }

  getClaimApprovedAmt(){
    this.apAmtTbl.overlayLoader = true;
    this.clmService.getClaimApprovedAmt(this.clmHistoryData.claimId,'')
    .subscribe(data => {
      console.log(data);
      this.passDataApprovedAmt.tableData = [];
      var rec = data['claimApprovedAmtList'].map(i => { 
        i.claimID    = this.clmHistoryData.claimId;
        i.projId     = this.clmHistoryData.projId;
        i.createDate = this.ns.toDateTimeString(i.createDate);
        i.updateDate = this.ns.toDateTimeString(i.updateDate); 
        i.approvedDate = this.ns.toDateTimeString(i.approvedDate); 
        return i; 
      });
      this.passDataApprovedAmt.tableData = rec;
      this.apAmtTbl.refreshTable();
      this.apAmtTbl.onRowClick(null, this.passDataApprovedAmt.tableData[0]);
      if(this.passDataApprovedAmt.tableData.length != 0){
        var statsInfo = this.passDataApprovedAmt.tableData[0];
        this.clmHistoryData.approvedAmt  = statsInfo.approvedAmt;
        this.clmHistoryData.approvedBy   = statsInfo.approvedBy;
        this.clmHistoryData.approvedDate = this.ns.toDateTimeString(statsInfo.approvedDate);
      }
    });
  }

  getResStat(){
    this.resStatTbl.overlayLoader = true;
    this.mtnService.getRefCode('RESERVE_STATUS')
    .subscribe(data => {
      console.log(data);
      var rec = data['refCodeList'];
      this.passDataResStat.tableData = rec;
      this.resStatTbl.refreshTable();  
    });
  }

  onSaveClaimApprovedAmt(){
    if(this.dirtyCounter.appAmt != 0){
      this.clmService.saveClaimApprovedAmt(JSON.stringify(this.paramsApvAmt))
      .subscribe(data => {
        console.log(data);
        this.getClaimApprovedAmt();
        this.successAppAmt.open();
        this.paramsApvAmt.saveClaimApprovedAmt = [];
        this.dirtyCounter.appAmt = 0;
        this.addDirtyHistTbl();
      });
    }
  }

  onSaveResStat(){
    var saveResStat = {
        claimId     : this.clmHistoryData.claimId,
        expStatCd   : this.passDataResStat.tableData.filter(el => el.description.toUpperCase() == this.clmHistoryData.expStatCd.toUpperCase()).map(el => {return el.code})[0],
        lossStatCd  : this.passDataResStat.tableData.filter(el => el.description.toUpperCase() == this.clmHistoryData.lossStatCd.toUpperCase()).map(el => {return el.code})[0],
        projId      : this.clmHistoryData.projId,
        updateUser  : this.ns.getCurrentUser()
      };

    if(this.dirtyCounter.resStats != 0){
      this.clmService.saveClaimResStat(JSON.stringify(saveResStat))
      .subscribe(data => {
        console.log(data);
        this.successResStat.open();
        this.dirtyCounter.resStats = 0;
        this.addDirtyHistTbl();
      });
    }
  }

  onClickSaveResStat(cancelFlag?){
    this.cancelFlagResStat = cancelFlag !== undefined;
    this.dialogIcon = '';
   
    if(this.clmHistoryData.lossStatCd == '' || this.clmHistoryData.lossStatCd == null || this.clmHistoryData.expStatCd == '' || this.clmHistoryData.expStatCd == null){
      this.dialogIcon = 'error';
      this.successResStat.open();
      this.fromCancelResStat = true;
    }else{
      if(this.cancelFlagResStat){
        this.csResStat.showLoading(true);
        setTimeout(() => { try{this.csResStat.onClickYes();}catch(e){}},500);
      }else{
        if(this.dirtyCounter.resStats != 0){
          this.csResStat.saveModal.openNoClose();
        }else{
          this.removeDirtyHistTbl();
          this.csResStat.confirmModal();
        }
      }
    }
  }

  onClickSaveAppAmt(cancelFlag?){
    this.cancelFlagAppAmt = cancelFlag !== undefined;
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
          record.claimId       = this.clmHistoryData.claimId;
          record.projId        = this.clmHistoryData.projId;
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
      console.log(this.cancelFlagAppAmt + ' >> onClickSaveAppAmt this.cancelFlagAppAmt');
      console.log(this.paramsApvAmt.saveClaimApprovedAmt.length + " >> onClickSaveAppAmt  this.paramsApvAmt.saveClaimApprovedAmt.length");
      if(this.paramsApvAmt.saveClaimApprovedAmt.length == 0){
        this.removeDirtyAppTbl();
        this.removeDirtyHistTbl();
        this.csAppAmt.confirmModal();
        this.paramsApvAmt.saveClaimApprovedAmt   = [];
        this.passDataApprovedAmt.tableData = this.passDataApprovedAmt.tableData.filter(a => a.approvedAmt != '');
      }else{
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
    var saveReserve = {
      claimId     : this.clmHistoryData.claimId,
      createDate  : (this.clmHistoryData.createDateRes == '' || this.clmHistoryData.createDateRes == null)?this.ns.toDateTimeString(0):this.clmHistoryData.createDateRes,
      createUser  : (this.clmHistoryData.createUserRes == '' || this.clmHistoryData.createUserRes == null)?this.ns.getCurrentUser():this.clmHistoryData.createUserRes,
      expPdAmt    : this.clmHistoryData.expPdAmt,
      expResAmt   : this.clmHistoryData.expResAmt,
      expStatCd   : (this.clmHistoryData.expStatCd == '' || this.clmHistoryData.expStatCd == null)?'OP':this.passDataResStat.tableData.filter(el => el.description.toUpperCase() == this.clmHistoryData.expStatCd.toUpperCase()).map(el => {return el.code})[0],
      lossPdAmt   : this.clmHistoryData.lossPdAmt,
      lossResAmt  : this.clmHistoryData.lossResAmt,
      lossStatCd  : (this.clmHistoryData.lossStatCd == '' || this.clmHistoryData.lossStatCd == null)?'OP':this.passDataResStat.tableData.filter(el => el.description.toUpperCase() == this.clmHistoryData.lossStatCd.toUpperCase()).map(el => {return el.code})[0],
      projId      : this.clmHistoryData.projId,
      updateDate  : this.ns.toDateTimeString(0),
      updateUser  : this.ns.getCurrentUser()
    };

    var subs = forkJoin(this.clmService.saveClaimReserve(JSON.stringify(saveReserve)),this.clmService.saveClaimHistory(JSON.stringify(this.params)))
                       .pipe(map(([res,hist]) => {return [res,hist]} ));

    subs.subscribe(data => {
      console.log(data);
      this.getClaimHistory();
      this.getResStat();
      this.successClmHist.open();
      this.params.saveClaimHistory = [];
      this.passDataHistory.disableAdd = false;
    });

  }

  onClickNoSave(){
    console.log('Save? >>> No');
    this.params.saveClaimHistory = [];
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;
    var error1 = false;
    var error2 = false;

    for(let record of this.passDataHistory.tableData){
      if(record.histCategory == '' || record.histType == '' || record.currencyCd == '' || record.reserveAmt == '' || isNaN(record.reserveAmt)){
        if(!record.deleted){
          isEmpty = 1;
          record.fromCancel = false;
        }
      }else{
        record.fromCancel = true;
        if(record.edited && !record.deleted){
          record.claimId       = this.clmHistoryData.claimId;
          record.projId        = this.clmHistoryData.projId;
          record.createUser    = (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
          record.createDate    = (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):record.createDate;
          record.updateUser    = this.ns.getCurrentUser();
          record.updateDate    = this.ns.toDateTimeString(0);
          this.params.saveClaimHistory.push(record);
        }
      }
    }

    const arrSum = arr => arr.reduce((a,b) => a + b, 0);
    var catArr  = this.passDataHistory.tableData.filter(e => e.newRec != 1).map(e => e.histCategory);
    var totResAmt = arrSum(this.passDataHistory.tableData.filter(e => e.histType == 4 || e.histType == 5).map(e => e.reserveAmt));

    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.successClmHist.open();
      this.params.saveClaimHistory   = [];
    }else{
      if(this.params.saveClaimHistory.length == 0){
        this.removeDirtyHistTbl();
        this.cs.confirmModal();
        this.params.saveClaimHistory   = [];
        this.passDataHistory.tableData = this.passDataHistory.tableData.filter(a => a.histCategory != '');
      }else{
        if(Number(totResAmt) > Number(this.clmHistoryData.approvedAmt)){
          this.warnMsg = 'Invalid reserve amount. Total reserve amount must be less than or equal to the approved amount.';
          this.showWarnMsg();
          this.params.saveClaimHistory   = [];
        }else{
          if(this.clmHistoryData.mtnParam == 'Y'){
            if(Number(this.clmHistoryData.allowMaxSi) > Number(this.clmHistoryData.totalRes)){
              if(this.cancelFlag == true){
                this.cs.showLoading(true);
                setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},500);
              }else{
                this.cs.confirmModal();
              }
            }else{
              this.warnMsg = 'Invalid reserve amount. Total reserve amount must be less than or equal to the Allowable Maximum Sum Insured.';
              this.showWarnMsg();
              this.params.saveClaimHistory   = [];
            }
          }else{
            if(this.cancelFlag == true){
              this.cs.showLoading(true);
              setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},500);
            }else{
              this.cs.confirmModal();
            }
          }
        }
      }
    }
  }

  limitHistType(){
    var catArr  = this.passDataHistory.tableData.filter(e => e.newRec != 1).map(e => e.histCategory);
    var ths = this;
    
    this.passDataHistory.tableData.forEach(e => {
      if(e.newRec == 1){ 
        if(catArr.some(a =>  e.histCategory.toUpperCase() == a.toUpperCase())){
          this.passDataHistory.opts[1].vals = this.histTypeData.filter(e => e.code != 1).map(e => e.code);
          this.passDataHistory.opts[1].prev = this.histTypeData.filter(e => e.code != 1).map(e => e.description);
          this.passDataHistory.opts[1].vals.unshift(' ');
          this.passDataHistory.opts[1].prev.unshift(' ');
        }else{
          this.passDataHistory.opts[1].vals = this.histTypeData.filter(e => e.code == 1).map(e => e.code);
          this.passDataHistory.opts[1].prev = this.histTypeData.filter(e => e.code == 1).map(e => e.description);
          this.passDataHistory.opts[1].vals.unshift(' ');
          this.passDataHistory.opts[1].prev.unshift(' ');
        }
      }
    });

    if(this.passDataHistory.tableData.some(e => e.exGratia == 'Y')){
      this.passDataHistory.tableData.forEach(e => {(e.newRec == 1)?e.exGratia='Y':'';});
    }

    setTimeout(() => {      
      $('#histId').find('tbody').children().each(function(a){
        var cb = $(this).find('input[type=checkbox]');
        var histSelects = $(this).find('select');
        var histCat = $(histSelects[0]);
        var histType = $(histSelects[1]);
        (ths.passDataHistory.tableData.some(e => e.exGratia == 'Y'))?cb.prop('disabled',true):'';
        if(histCat.val() == '' || histCat.val() == null || histCat.val() == undefined){
          histType.addClass('unclickable');
        }else{
          histType.removeClass('unclickable');
          if((histType.val() == 4 || histType.val() == 5) && ths.passDataApprovedAmt.tableData.length == 0){
            ths.warnMsg = 'Please add Approved Amount before proceeding.';
            ths.showWarnMsg();
            histType.val('');
          }
        }

      });
    },0);
  }

  compResPayt(){
    const arrSum = arr => arr.reduce((a,b) => a + b, 0);

    this.passDataHistory.tableData.map(record => {
      this.passDataHistory.opts[0].vals.forEach((e,i) => {
        (record.histCatDesc == e)?record.histCategory = e:'';
      });
      this.passDataHistory.opts[1].vals.forEach((e,i) => {
        (record.histTypeDesc == e)?record.histType=e:'';
      });
      return record;
    });

    this.clmHistoryData.lossResAmt = arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'L').map(i => { return i.reserveAmt;}));
    this.clmHistoryData.expResAmt  = arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'A' || i.histCategory.toUpperCase() == 'O').map(i => { return i.reserveAmt;}));
  
    this.clmHistoryData.lossPdAmt  = arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'L').map(i => { return i.paytAmt;}));
    this.clmHistoryData.expPdAmt   = arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'A' || i.histCategory.toUpperCase() == 'O').map(i => { return i.paytAmt;}));
  
    this.clmHistoryData.totalRes   = this.clmHistoryData.lossResAmt + this.clmHistoryData.expResAmt;
    this.clmHistoryData.totalPayt  = this.clmHistoryData.lossPdAmt + this.clmHistoryData.expPdAmt;

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
    if(this.cancelFlagAppAmt == true){
      if(this.passDataApprovedAmt.tableData.some(i => i.fromCancel == false)){
        return;
      }else{
        this.approvedAmtMdl.closeModal();
        this.addDirtyHistTbl();
      }
    }else{
      this.addDirtyHistTbl();
    }
  }

  checkCancelResStat(){
    if(this.cancelFlagResStat == true){
      if(this.fromCancelResStat == true){
        return;
      }else{
        this.resStatMdl.closeModal();
        this.addDirtyHistTbl();
      }
    }else{
      this.addDirtyHistTbl();
    }
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  onClickCancelResStat(){
    if(this.dirtyCounter.resStats != 0){
      this.cancelBtnResStat.saveModal.openNoClose();
    }else{
      this.resStatMdl.closeModal();
    }
    this.addDirtyHistTbl();
  }

  onClickCancelAppAmt(){
    if(this.dirtyCounter.appAmt != 0){
      this.cancelBtnAppAmt.saveModal.openNoClose();
    }else{
      this.approvedAmtMdl.closeModal();
    }
    this.addDirtyHistTbl();
  }

  onClickNoAppAmt(){
    this.approvedAmtMdl.closeModal();
    this.addDirtyHistTbl();
    this.dirtyCounter.appAmt = 0;
  }

  onClickNoResStat(){
    this.resStatMdl.closeModal();
    this.addDirtyHistTbl();
    this.dirtyCounter.resStats = 0;
    this.clmHistoryData.lossStatCd = this.preVal.lossStatCd;
    this.clmHistoryData.expStatCd  = this.preVal.expStatCd;
  }

  showResStatMdl(){
    this.resStatMdl.openNoClose();
    this.removeDirtyAppTbl();
    this.removeDirtyHistTbl();
    this.preVal.lossStatCd = this.clmHistoryData.lossStatCd;
    this.preVal.expStatCd  = this.clmHistoryData.expStatCd;
  }

  showResStatLov(){
    this.resStatLov.openNoClose();
  }

  onRowClickResStat(event){
    this.lovData = event;
  }

  setResStat(){
    this.dirtyCounter.resStats++;
    (this.fromStat == 'loss')?this.clmHistoryData.lossStatCd=this.lovData.description:this.clmHistoryData.expStatCd=this.lovData.description;
  }

  checkLossStat(ev){
    this.dirtyCounter.resStats++;
    var a = this.passDataResStat.tableData.filter(rec => rec.code == this.clmHistoryData.lossStatCd).map(rec => rec.description)[0];
    if(a == '' || a == undefined){
      this.showResStatLov();
    }else{
      this.clmHistoryData.lossStatCd = a;
    }
  }

  checkExpStat(ev){
    this.dirtyCounter.resStats++;
    var a = this.passDataResStat.tableData.filter(rec => rec.code == this.clmHistoryData.expStatCd).map(rec => rec.description)[0];
    if(a == '' || a == undefined){
      this.showResStatLov();
    }else{
      this.clmHistoryData.expStatCd = a;
    }
  }

  showApprovedAmtMdl(){
    $('#approvedAmtMdl > #modalBtn').trigger('click');
    this.getClaimApprovedAmt();
    this.removeDirtyHistTbl();
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

  addDirtyHistTbl(){
    (this.dirtyCounter.hist != 0)?$('#histId .ng-untouched').addClass('ng-dirty'):'';
  }

  removeDirtyHistTbl(){
    $('#histId .ng-dirty').removeClass('ng-dirty');
  }

  addDirtyAppTbl(){
    $('#appAmtId .ng-untouched').addClass('ng-dirty');
  }

  removeDirtyAppTbl(){
    $('#appAmtId .ng-dirty').removeClass('ng-dirty');
  }

  checkDirtyTbl(){
    ($('#histId .ng-dirty').length != 0)?this.dirtyCounter.hist++:'';
    ($('#appAmtId .ng-dirty').length != 0)?this.dirtyCounter.appAmt++:'';
  }

  onClickAddHistTbl(){
    this.passDataHistory.disableAdd = true;
  }

  showWarnMsg(){
    $('#warnMdl #modalBtn').trigger('click');
  }
}
