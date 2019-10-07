import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ClaimsHistoryInfo } from '@app/_models';
import { ClaimsService, NotesService, MaintenanceService, UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { forkJoin,concat } from 'rxjs';
import { using } from 'rxjs/index';
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
  @ViewChild('overMdl') overMdl                      : ModalComponent;
  @ViewChild('clmHistWarnMdl') clmHistWarnMdl        : ModalComponent;


  private claimsHistoryInfo = ClaimsHistoryInfo;

  @Input() isInquiry: boolean = false;

  passDataHistory: any = {
    tableData     : [],
    tHeader       : ['Hist. No.', 'Hist. Date','Booking Mth-Yr','Hist. Type', 'Type', 'Ex-Gratia', 'Curr', 'Curr Rt', 'Amount', 'Ref. No','Ref. Date', 'Payment Amount', 'Remarks'],
    dataTypes     : ['sequence-3','date','select', 'req-select', 'req-select', 'checkbox', 'text', 'percent', 'currency', 'text', 'text', 'currency', 'text-editor'],
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
      reserveAmt   : 0,
      paytAmt      : 0,
      refNo        : '',
      refDate      : '',
      remarks      : ''
    },
    opts: [
      {selector   : 'histCatDesc',  prev : [], vals: []},
      {selector   : 'histTypeDesc', prev : [], vals: []},
      {selector   : 'bookingMthYr', prev : [], vals: []},
    ],
    keys          : ['histNo','histDate','bookingMthYr','histCatDesc','histTypeDesc','exGratia','currencyCd','currencyRt','reserveAmt','refNo','refDate','paytAmt','remarks'],
    uneditable    : [true,true,false,false,false,false,true,true,false,true,true,true,false],
    uneditableKeys: ['exGratia'], 
    pageLength    : 10,
    paginateFlag  : true,
    infoFlag      : true,
    addFlag       : true,
    disableAdd    : false,
    widths        : [1,1,140,145,200,1,1,140,120,1,1,120,200],
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
  proceed           : boolean = true;
  initFetch         : boolean = false;
  arrExpStats       : any[] = [];
  arrlossStats      : any[] = [];
  adjRate           : any;
  months            : any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


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
    clmStatus   : '',
    policyId    : '',
    upUserGi    : ''
  };

  recCheckHistGl: any;

  @Output() disableNextTabs = new EventEmitter<any>();
  @Output() preventHistory = new EventEmitter<any>();

  resStats:any[];

  constructor(private titleService: Title, private clmService: ClaimsService,private ns : NotesService, private mtnService: MaintenanceService, 
              private polService: UnderwritingService, public modalService: NgbModal) {
  }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim History");
    this.clmHistoryData.claimId     = this.claimInfo.claimId;
    this.clmHistoryData.claimNo     = this.claimInfo.claimNo;
    this.clmHistoryData.policyNo    = this.claimInfo.policyNo;
    this.clmHistoryData.projId      = this.claimInfo.projId;
    this.clmHistoryData.riskName    = this.claimInfo.riskName;
    this.clmHistoryData.insuredDesc = this.claimInfo.insuredDesc; 
    this.clmHistoryData.claimStat   = this.claimInfo.clmStatus;
    this.initFetch = true;
    //neco
    if(this.isInquiry){
      this.passDataHistory.uneditable = [];
      this.passDataApprovedAmt.uneditable = [];

      this.passDataHistory.addFlag = false;
      this.passDataHistory.deleteFlag = false;
      this.passDataHistory.disableGeneric = true;

      this.passDataApprovedAmt.addFlag = false;
      this.passDataApprovedAmt.deleteFlag = false;
      this.passDataApprovedAmt.disableGeneric = true;
      
      for(var i in this.passDataHistory.tHeader){
        this.passDataHistory.uneditable.push(true);
      }
      for(var j in this.passDataApprovedAmt.tHeader){
        this.passDataApprovedAmt.uneditable.push(true);
      }
    }
    //end neco
    this.getClaimHistory();
    this.getClaimApprovedAmt();
    this.getResStat();
    //console.log(this.claimInfo);
  }


  getClaimHistory(){
    var arrDisRes  = [];
    var subs = forkJoin(this.clmService.getClaimHistory(this.clmHistoryData.claimId,'',this.clmHistoryData.projId,''),this.mtnService.getRefCode('HIST_CATEGORY'),this.mtnService.getRefCode('HIST_TYPE'),
                        this.clmService.getClaimSecCover(this.clmHistoryData.claimId,''),this.mtnService.getMtnParameters('V'), this.mtnService.getMtnBookingMonth())
                       .pipe(map(([clmHist,histCat,histType,cov,param,bookingMth]) => { return { clmHist,histCat,histType,cov,param,bookingMth }; }));

    subs.subscribe(data => {
      //console.log(data);

      var recHistCat     = data['histCat']['refCodeList'];
      var recHistType    = data['histType']['refCodeList'];
      var recCurr        = data['cov']['claims']['project']['clmCoverage'];
      var recParam       = data['param']['parameters'].filter(el => el.paramName.toUpperCase() == 'ALLOW_MAX_SI').map(el => {return el});
      var recBookingMth  = data['bookingMth']['bookingMonthList'].filter(e => e.bookedTag != 'Y').map(e => {return e});
      recBookingMth.sort((a,b) => a.bookingMm - b.bookingMm);

      this.histTypeData = recHistType;

      this.adjRate = (data['clmHist']['adjRate'] == null)?0:data['clmHist']['adjRate'];
      this.clmHistoryData.mtnParam = String(recParam[0].paramValueV);
      this.clmHistoryData.allowMaxSi = data['cov']['claims']['project']['clmCoverage'].allowMaxSi;

      //console.log(this.clmHistoryData.allowMaxSi + ' >>>> allowMaxSi');

      this.passDataHistory.opts[0].vals = recHistCat.map(i => i.code);
      this.passDataHistory.opts[0].prev = recHistCat.map(i => i.description);

      this.passDataHistory.opts[2].vals = recBookingMth.map(i => {
        return this.months[i.bookingMm - 1].toUpperCase() + '-' + i.bookingYear;
      });
      this.passDataHistory.opts[2].prev = recBookingMth.map(i => {
        return this.months[i.bookingMm - 1].toUpperCase() + '-' + i.bookingYear;
      });

      this.passDataHistory.nData.currencyCd = recCurr.currencyCd;
      this.passDataHistory.nData.currencyRt = recCurr.currencyRt;

      try{

          if(data['clmHist']['claimReserveList'].length == 0){
            var recClmHist = data['clmHist']['claimReserveList'];

            if(this.initFetch){
              var recCheckHist   = data['clmHist']['checkHistList'];
              this.recCheckHistGl = recCheckHist;
              this.histFunction(1);
            }
          }else{
            var res = data['clmHist']['claimReserveList'][0];
            this.clmHistoryData.createUserRes = (res.createUser == '' || res.createUser == null)?this.ns.getCurrentUser():res.createUser;
            this.clmHistoryData.createDateRes = (res.createDate == '' || res.createDate == null)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(res.createDate);
            var recClmHist = data['clmHist']['claimReserveList'][0]['clmHistory']
                              .map(i => {  
                                i.claimID      = this.clmHistoryData.claimId;
                                i.projId       = this.clmHistoryData.projId;
                                i.bookingMthYr = i.bookingMth.toUpperCase()+'-'+i.bookingYear;
                                //i.refDate      = this.ns.toDateTimeString(i.refDate);
                                i.histDate     = this.ns.toDateTimeString(i.createDate);
                                i.createDate   = this.ns.toDateTimeString(i.createDate);
                                i.updateDate   = this.ns.toDateTimeString(i.updateDate);
                                i.paytAmt      = (i.paytAmt == '' || i.paytAmt == null)?0:i.paytAmt;
                                recHistCat.forEach(a => (a.description == i.histCatDesc)?i.histCategory=a.code:i.histCategory);
                                recHistType.forEach(a => (a.description == i.histTypeDesc)?i.histType=a.code:i.histType);
                                if(i.refDate != null){
                                  i.uneditable = ['bookingMthYr','reserveAmt']
                                }
                                
                                return i;
                              });


            this.clmHistoryData.lossStatCd = res.lossStatCd == null ? 'OP' : res.lossStatCd; 
            this.clmHistoryData.expStatCd  = res.expStatCd == null ? 'OP' : res.expStatCd; 

            this.preVal.lossStatCd = this.clmHistoryData.lossStatCd;
            this.preVal.expStatCd = this.clmHistoryData.expStatCd;

            this.clmHistoryData.lossResAmt = res.lossResAmt;
            this.clmHistoryData.lossPdAmt  = res.lossPdAmt;
            this.clmHistoryData.expResAmt  = res.expResAmt;
            this.clmHistoryData.expPdAmt   = res.expPdAmt;
            this.clmHistoryData.totalRes   = Number(this.clmHistoryData.lossResAmt) + Number(this.clmHistoryData.expResAmt);
            this.clmHistoryData.totalPayt  = Number(this.clmHistoryData.lossPdAmt) + Number(this.clmHistoryData.expPdAmt);
          }

          this.passDataHistory.tableData = recClmHist;
          this.histTbl.refreshTable();
          this.histTbl.onRowClick(null, this.passDataHistory.tableData[0]);
          this.compResPayt(null);

          this.passDataHistory.tableData.forEach((e,i) => {
            (e.enableRes  == 'N' || e.enablePayt == 'N')?arrDisRes.push({indx:i,type:e.histTypeDesc}):'';
          });

          setTimeout(() => {
            $('#histId').find('tbody').children().each(function(indx){
              var amt = $(this).find('input.number');
              var resAmt = $(amt[0]);
              var hType = $(this).find('span')[3];

              arrDisRes.forEach(eRes => {
                if(eRes.indx == indx && eRes.type == hType.innerText){                  
                  resAmt.prop('readonly',true);
                  resAmt.attr('style', 'background: transparent !important');
                }
              });
            });
          },0);

      }catch(e){''}
        
    });

  }

  getClaimApprovedAmt(){
    this.apAmtTbl.overlayLoader = true;
    this.clmService.getClaimApprovedAmt(this.clmHistoryData.claimId,'')
    .subscribe(data => {
      //console.log(data);
      this.passDataApprovedAmt.tableData = [];
      var rec = data['claimApprovedAmtList'].map(i => { 
        i.claimID    = this.clmHistoryData.claimId;
        i.projId     = this.clmHistoryData.projId;
        i.createDate = this.ns.toDateTimeString(i.createDate);
        i.updateDate = this.ns.toDateTimeString(i.updateDate); 
        i.approvedDate = this.ns.toDateTimeString(i.approvedDate); 
        i.uneditable =['histNo','approvedAmt','approvedBy','approvedDate','remarks'];
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
      //console.log(data);
      // var rec = data['refCodeList'];
      // this.arrlossStats = rec;
      // this.arrExpStats  = rec.filter(e => e.code == 'OP' || e.code == 'CD').map(e => {return e});
      // //this.passDataResStat.tableData = rec;
      // this.resStatTbl.refreshTable();  
      this.resStats = data['refCodeList'];
    });


  }

  onSaveClaimApprovedAmt(){
    if(this.dirtyCounter.appAmt != 0){
      this.clmService.saveClaimApprovedAmt(JSON.stringify(this.paramsApvAmt))
      .subscribe(data => {
        //console.log(data);
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
        expStatCd   : this.clmHistoryData.expStatCd,//this.passDataResStat.tableData.filter(el => el.description.toUpperCase() == this.clmHistoryData.expStatCd.toUpperCase()).map(el => {return el.code})[0],
        lossStatCd  : this.clmHistoryData.lossStatCd,//this.passDataResStat.tableData.filter(el => el.description.toUpperCase() == this.clmHistoryData.lossStatCd.toUpperCase()).map(el => {return el.code})[0],
        projId      : this.clmHistoryData.projId,
        updateUser  : this.ns.getCurrentUser()
      };

      this.clmService.saveClaimResStat(JSON.stringify(saveResStat))
      .subscribe(data => {
        //console.log(data);
        this.preVal.lossStatCd = this.clmHistoryData.lossStatCd;
        this.preVal.expStatCd = this.clmHistoryData.expStatCd;    
        this.successResStat.open();
        this.dirtyCounter.resStats = 0;
        this.limitHistType();
        this.addDirtyHistTbl();
      });
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
          this.paramsApvAmt.saveClaimApprovedAmt =  this.paramsApvAmt.saveClaimApprovedAmt.filter(e => e.claimId != record.claimId);
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
      expStatCd   : this.clmHistoryData.expStatCd,//(this.clmHistoryData.expStatCd == '' || this.clmHistoryData.expStatCd == null)?'OP':this.arrExpStats.filter(el => el.description.toUpperCase() == this.clmHistoryData.expStatCd.toUpperCase()).map(el => {return el.code})[0],
      lossPdAmt   : this.clmHistoryData.lossPdAmt,
      lossResAmt  : this.clmHistoryData.lossResAmt,
      lossStatCd  : this.clmHistoryData.lossStatCd,//(this.clmHistoryData.lossStatCd == '' || this.clmHistoryData.lossStatCd == null)?'OP':this.arrlossStats.filter(el => el.description.toUpperCase() == this.clmHistoryData.lossStatCd.toUpperCase()).map(el => {return el.code})[0],
      projId      : this.clmHistoryData.projId,
      updateDate  : this.ns.toDateTimeString(0),
      updateUser  : this.ns.getCurrentUser(),
      upUserGi    : (this.claimInfo.upUserGi == '' || this.claimInfo.upUserGi == undefined || this.claimInfo.upUserGi == null)?'':this.claimInfo.upUserGi
    };
    
    //console.log(saveReserve);
      this.clmService.saveClaimReserve(JSON.stringify(saveReserve))
      .subscribe(data => {
        //console.log(data);

        this.clmService.saveClaimHistory(JSON.stringify(this.params))
        .subscribe(data => {
          //console.log(data);
              this.getClaimHistory();
              this.getResStat();
              this.successClmHist.open();
              this.params.saveClaimHistory = [];
              this.passDataHistory.disableAdd = false;
              this.initFetch = false;

              var chk1 = 0;
              var chk2 = 0;

              if(this.clmHistoryData.lossResAmt == 0  && this.passDataHistory.tableData.some(e => (e.histCategory == 'L') && e.histType == 4 || e.histType == 5) && 
                this.clmHistoryData.lossPdAmt == this.arrSum(this.passDataHistory.tableData.filter(e => e.histCategory == 'L' && (e.histType == 4 || e.histType == 5)).map(e => e.reserveAmt))){
                this.clmHistoryData.lossStatCd = 'CD';
                chk1 = 1;
              }else{
                this.clmHistoryData.lossStatCd = this.arrlossStats.filter(el => el.description.toUpperCase() == this.clmHistoryData.lossStatCd.toUpperCase()).map(el => {return el.code})[0];
              }

              if(this.clmHistoryData.expResAmt == 0 && this.passDataHistory.tableData.some(e => (e.histCategory == 'A' || e.histCategory == 'O') && (e.histType == 4 || e.histType == 5)) &&
                this.clmHistoryData.expPdAmt == this.arrSum(this.passDataHistory.tableData.filter(e => (e.histCategory == 'A' || e.histCategory == 'O') && (e.histType == 4 || e.histType == 5)).map(e => e.reserveAmt))){
                this.clmHistoryData.expStatCd = 'CD';
                chk2 = 1;
              }else{
                this.clmHistoryData.expStatCd = this.arrExpStats.filter(el => el.description.toUpperCase() == this.clmHistoryData.expStatCd.toUpperCase()).map(el => {return el.code})[0];
              }
             
              if(chk1 != 0 || chk2 != 0){
                var resStatParams = { 
                  claimId     : this.clmHistoryData.claimId,
                  expStatCd   : this.clmHistoryData.expStatCd,
                  lossStatCd  : this.clmHistoryData.lossStatCd,
                  projId      : this.clmHistoryData.projId,
                  updateUser  : this.ns.getCurrentUser()
                };

                this.clmService.saveClaimResStat(JSON.stringify(resStatParams))
                  .subscribe(data => {
                  //console.log(data);
                });
              } 
                
              setTimeout(() => {
                if(data['returnCode'] == -1) {
                  var disableNextTabs = false;
                  var disablePaytReq = this.passDataHistory.tableData.filter(a => a.histType == '4' || a.histType == '5').length == 0;
                  this.disableNextTabs.emit({ disableNextTabs: disableNextTabs, disablePaytReq: disablePaytReq });
                }
              }, 0);
        });
      });
  }

  onClickNoSave(){
    //console.log('Save? >>> No');
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
      if(record.histCategory == '' || record.histCategory == null || record.histType == '' || record.histType == null || 
        record.currencyCd == '' || record.currencyCd == null || record.reserveAmt == '' || record.reserveAmt == null  || isNaN(record.reserveAmt) ||
        record.bookingMthYr == '' || record.bookingMthYr == null){
        //console.log(record);
        if(!record.deleted){
          isEmpty = 1;
          record.fromCancel = false;
        }
      }else{
        record.fromCancel = true;
        if(record.edited && !record.deleted){
          record.claimId       = this.clmHistoryData.claimId;
          record.projId        = this.clmHistoryData.projId;
          record.bookingMth    = record.bookingMthYr.split('-')[0];
          record.bookingYear   = record.bookingMthYr.split('-')[1];
          record.createUser    = (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
          record.createDate    = (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):record.createDate;
          record.updateUser    = this.ns.getCurrentUser();
          record.updateDate    = this.ns.toDateTimeString(0);
          this.params.saveClaimHistory.push(record);
        }
      }
    }

    //console.log(this.passDataHistory.tableData);

    var catArr  = this.passDataHistory.tableData.filter(e => e.newRec != 1).map(e => e.histCategory);
    var totResAmt = this.arrSum(this.passDataHistory.tableData.filter(e => e.histType == 4 || e.histType == 5).map(e => e.reserveAmt));
    var sumLossPayt = this.arrSum(this.passDataHistory.tableData.filter(e => e.histCategory == 'L' && (e.histType == 4 || e.histType == 5)).map(e => e.reserveAmt));
    //console.log(sumLossPayt + ' - ' + this.clmHistoryData.approvedAmt);

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
          if(this.clmHistoryData.mtnParam == 'Y'){
            if(Number(this.clmHistoryData.allowMaxSi) >= Number(this.clmHistoryData.totalRes)){
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
            if((Number(sumLossPayt) > Number(this.clmHistoryData.approvedAmt)) && this.passDataApprovedAmt.tableData.length != 0){
              this.warnMsg = 'Unable to save. The total payment for loss must be less than or equal to the approved amount.';
              this.showWarnMsg();
              this.params.saveClaimHistory   = [];
            }
            else{
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

  arrSum(arr){
    return arr.reduce((a,b) => a + b, 0);
  }

  limitHistType(){
    var ths = this;
    var trigWarn1 = false;
    var catArr  = this.passDataHistory.tableData.filter(e => e.newRec != 1).map(e => e.histCategory);
    var adjAmt =  Number(this.passDataHistory.tableData.filter(e => e.histCategory == 'L' && e.histType == 1).map(e => e.reserveAmt).toString()) * (Number(this.adjRate)/100);
    var totOthExpRes = this.arrSum(this.passDataHistory.tableData.filter(e => e.newRec != 1 && e.histCategory == 'O' && (e.histType != 4 || e.histType != 5)).map(e => e.reserveAmt));
    var totAdjExpRes = this.arrSum(this.passDataHistory.tableData.filter(e => e.newRec != 1 && e.histCategory == 'A' && (e.histType != 4 || e.histType != 5)).map(e => e.reserveAmt));
    var totOthExpPd = this.arrSum(this.passDataHistory.tableData.filter(e => e.newRec != 1 && e.histCategory == 'O').map(e => e.paytAmt));
    var totAdjExpPd = this.arrSum(this.passDataHistory.tableData.filter(e => e.newRec != 1 && e.histCategory == 'A').map(e => e.paytAmt));

    this.passDataHistory.tableData.forEach((e,i) => {
      if(e.newRec == 1){
        // if(catArr.some(a =>  e.histCategory.toUpperCase() == a.toUpperCase())){
        //   this.passDataHistory.opts[1].vals = this.histTypeData.filter(e => e.code != 1).map(e => e.code);
        //   this.passDataHistory.opts[1].prev = this.histTypeData.filter(e => e.code != 1).map(e => e.description);
        //   this.passDataHistory.opts[1].vals.unshift(' ');
        //   this.passDataHistory.opts[1].prev.unshift(' ');
        // }else{
        //   this.passDataHistory.opts[1].vals = this.histTypeData.filter(e => e.code == 1 || e.code == 4 || e.code == 5 || e.code == 9).map(e => e.code);
        //   this.passDataHistory.opts[1].prev = this.histTypeData.filter(e => e.code == 1 || e.code == 4 || e.code == 5 || e.code == 9).map(e => e.description);
        //   this.passDataHistory.opts[1].vals.unshift(' ');
        //   this.passDataHistory.opts[1].prev.unshift(' ');
        // }

        //edit by paul 9/5/2019
        let validHistTypes:any[] = this.histTypeData;

        if((e.histCategory == 'L' && this.preVal.lossStatCd=='CD') || ((e.histCategory == 'O' || e.histCategory == 'A') && this.preVal.expStatCd=='CD')){
          validHistTypes = validHistTypes.filter(a=>a.code != 2 && a.code != 3 && a.code != 1 && a.code != 6);
        }


        if(
            this.passDataHistory.tableData.filter(a=>a.newRec!= 1 && e.histCategory == a.histCategory && a.histType==1 ).length != 0
          ){
          validHistTypes = validHistTypes.filter(a=>a.code != 1);
        }else{
          validHistTypes = validHistTypes.filter(a=>a.code != 2 && a.code != 3);
        }

        if(this.passDataHistory.tableData.filter(a=>a.newRec!= 1 && e.histCategory == a.histCategory && (a.histType==4 || a.histType == 5)).length == 0){
          validHistTypes = validHistTypes.filter(a=>a.code != 6 && a.code != 7&& a.code != 8);
        }

        if(this.passDataHistory.tableData.filter(a=>a.newRec!= 1 && e.histCategory == a.histCategory && (a.histType==9)).length == 0){
          validHistTypes = validHistTypes.filter(a=>a.code != 10);
        }

        if(e.histCategory == 'L'){
          validHistTypes = validHistTypes.filter(a=>a.code != 8);
        }else{
          validHistTypes = validHistTypes.filter(a=>a.code != 7);
        }
        //console.log(this.histTypeData)

        this.passDataHistory.opts[1].vals = validHistTypes.map(e => e.code);
        this.passDataHistory.opts[1].prev = validHistTypes.map(e => e.description);
        this.passDataHistory.opts[1].vals.unshift(' ');
        this.passDataHistory.opts[1].prev.unshift(' ');

        // end
        if(e.histType == 4 || e.histType == 5){
          if(this.passDataApprovedAmt.tableData.length == 0){
            this.warnMsg = 'Please add Approved Amount before proceeding.';
            this.showWarnMsg();
            e.histType = '';
            e.histTypeDesc = ''; 
          }else{
            if((e.histCategory == 'L' && (e.reserveAmt > this.clmHistoryData.lossResAmt)) || 
               (e.histCategory == 'A' && (e.reserveAmt > totAdjExpRes)) || 
               (e.histCategory == 'O' && (e.reserveAmt > totOthExpRes))){
                this.warnMsg = 'Payment amount is more than the reserve amount.';
                this.showWarnMsg();
            }
          }
        }else if(e.histType == 6){
          if(this.passDataHistory.tableData.filter(e => e.newRec != 1).some(e => e.histType == 4 || e.histType == 5)){
            if((e.histCategory == 'L' && e.reserveAmt != 0 && this.clmHistoryData.lossPdAmt == 0) || 
               (e.histCategory == 'A' && e.reserveAmt != 0 && totAdjExpPd == 0) || 
               (e.histCategory == 'O' && e.reserveAmt != 0 && totOthExpPd == 0)){
               this.warnMsg = 'Request for payment is not yet fully paid.';
               this.showWarnMsg();
            }
          }
        }

        if(e.histType == 1 && (Number(e.reserveAmt) > Number(this.clmHistoryData.allowMaxSi))){
          this.warnMsg = 'Initial Reserve must be less than or equal to the Allowable Maximum Sum Insured.';
          this.showWarnMsg();
          e.reserveAmt = '';
        }

        if(this.passDataHistory.tableData.some(el => el.histCategory == 'L' && el.histType == 1 && el.newRec != 1) &&  e.histCategory == 'A' && e.histType == 1 && (e.reserveAmt == 0 || e.reserveAmt == '' || isNaN(e.reserveAmt)) ){
          e.reserveAmt = adjAmt;
          this.clmHistoryData.expResAmt = adjAmt;
        }
      }

    });

    if(this.passDataHistory.tableData.some(e => e.exGratia == 'Y')){
      this.passDataHistory.tableData.forEach(e => {(e.newRec == 1)?e.exGratia='Y':'';});
    }

    setTimeout(() => {
      $('#histId').find('tbody').children().each(function(indx){
        var cb = $(this).find('input[type=checkbox]');
        var histSelects = $(this).find('select');
        var histCat = $(histSelects[1]);  
        var histType = $(histSelects[2]);
        var resAmt = $($(this).find('input.number')[0]).val();

        (ths.passDataHistory.tableData.some(e => e.exGratia == 'Y' && e.newRec != 1))?cb.prop('disabled',true):'';
        if(histCat.val() == '' || histCat.val() == null || histCat.val() == undefined){
          histType.addClass('unclickable');
        }else{
          histType.removeClass('unclickable');
        }

        // histType.change(e => {
        //   if(histType.val() == 6 && resAmt != 0 && trigWarn1){
        //     ths.modalService.dismissAll();
        //     ths.warnMsg = 'Request for payment is not yet fully paid.';
        //     ths.showWarnMsg();
        //   }
        // });     
      });
    },0);
  }

  compResPayt(data?){
    this.passDataHistory.tableData.map(record => {
      this.passDataHistory.opts[0].vals.forEach((e,i) => {
        (record.histCatDesc == e)?record.histCategory = e:'';
      });
      this.passDataHistory.opts[1].vals.forEach((e,i) => {
        (record.histTypeDesc == e)?record.histType=e:'';
      });
      return record;
    });

    this.passDataHistory.tableData.forEach(i => {

      i.reserveAmt = (isNaN(i.reserveAmt))?0:i.reserveAmt;
      if(Number(i.reserveAmt) != 0){
        if((i.histType == 3 || i.histType == 6 || i.histType == 7 || i.histType == 8 || i.histType == 9)){
          var a = String(i.reserveAmt).split('');
          if(a.some(e2 => e2 == '-')){
            i.reserveAmt = Number(-Number(a.filter(e => e != '-').join('')));
          }else{
            i.reserveAmt = Number(-i.reserveAmt);
          }
        }else{
          var a = String(i.reserveAmt).split('');
          if(a.some(e2 => e2 == '-')){
            i.reserveAmt = Number(a.filter(e => e != '-').join(''));
          }else{
            i.reserveAmt = i.reserveAmt;
          }
        }
      }

      //if(i.newRec == 1){
        if((i.histCategory != '' || i.histCategory != null) && (i.histType != '' || i.histType != null) && (i.reserveAmt != '' || i.reserveAmt != null)){
          
          var sumLossRes = this.arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'L' && (i.histType == 1 || i.histType == 2)).map(i => { return i.reserveAmt; }));
          var difLossRes = this.arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'L'  && (i.histType == 3 || i.histType == 6)).map(i => { return Math.abs(i.reserveAmt); }));

          var sumExpRes  = this.arrSum(this.passDataHistory.tableData.filter(i => (i.histCategory.toUpperCase() == 'A' || i.histCategory.toUpperCase() == 'O') && (i.histType == 1 || i.histType == 2)).map(i => { return i.reserveAmt; })); 
          var difExpRes  = this.arrSum(this.passDataHistory.tableData.filter(i => (i.histCategory.toUpperCase() == 'A' || i.histCategory.toUpperCase() == 'O') && (i.histType == 3 || i.histType == 6)).map(i => { return Math.abs(i.reserveAmt); })); 

          this.clmHistoryData.lossResAmt = Number(sumLossRes) - Number(difLossRes);
          this.clmHistoryData.expResAmt  = Number(sumExpRes)  - Number(difExpRes);


          this.clmHistoryData.lossPdAmt  = this.arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'L').map(i => { return i.paytAmt; }));
          this.clmHistoryData.expPdAmt   = this.arrSum(this.passDataHistory.tableData.filter(i => (i.histCategory.toUpperCase() == 'A' || i.histCategory.toUpperCase() == 'O')).map(i => { return i.paytAmt; })); 
       
        
          if(Number(this.clmHistoryData.lossResAmt) < 0){
            this.warnMsg = 'Invalid amount. Cumulative amount of reserve must be greater than or equal to zero.';
            this.clmHistWarnMdl.openNoClose();
            if(data!= undefined)
              data.lastEditedRow.reserveAmt = 0;

            var sumLossRes = this.arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'L' && i.newRec != 1 && (i.histType == 1 || i.histType == 2)).map(i => { return i.reserveAmt; }));
            var difLossRes = this.arrSum(this.passDataHistory.tableData.filter(i => i.histCategory.toUpperCase() == 'L' && i.newRec != 1 && (i.histType == 3 || i.histType == 6)).map(i => { return Math.abs(i.reserveAmt); }));
            this.clmHistoryData.lossResAmt = Number(sumLossRes) - Number(difLossRes);

          }

          if(Number(this.clmHistoryData.expResAmt) < 0){
            this.warnMsg = 'Invalid amount. Cumulative amount of reserve must be greater than or equal to zero.';
            this.clmHistWarnMdl.openNoClose();
            if(data!= undefined)
              data.lastEditedRow.reserveAmt = 0;

            var sumExpRes  = this.arrSum(this.passDataHistory.tableData.filter(i => (i.histCategory.toUpperCase() == 'A' || i.histCategory.toUpperCase() == 'O') && i.newRec != 1 && (i.histType == 1 || i.histType == 2)).map(i => { return i.reserveAmt; })); 
            var difExpRes  = this.arrSum(this.passDataHistory.tableData.filter(i => (i.histCategory.toUpperCase() == 'A' || i.histCategory.toUpperCase() == 'O') && i.newRec != 1 && (i.histType == 3 || i.histType == 6)).map(i => { return Math.abs(i.reserveAmt); })); 
            this.clmHistoryData.expResAmt  = Number(sumExpRes)  - Number(difExpRes);
          }

          this.clmHistoryData.totalRes   = Number(this.clmHistoryData.lossResAmt) + Number(this.clmHistoryData.expResAmt);
          this.clmHistoryData.totalPayt  = Number(this.clmHistoryData.lossPdAmt) + Number(this.clmHistoryData.expPdAmt);
        }
      //}

    });
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
    this.passDataApprovedAmt.tableData = [];
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
    this.clmHistoryData.lossStatCd = this.preVal.lossStatCd;
    this.clmHistoryData.expStatCd = this.preVal.expStatCd;
    this.removeDirtyAppTbl();
    this.removeDirtyHistTbl();
    this.preVal.lossStatCd = this.clmHistoryData.lossStatCd;
    this.preVal.expStatCd  = this.clmHistoryData.expStatCd;
  }

  showResStatLov(){
    this.passDataResStat.tableData = (this.fromStat == 'exp')?this.arrExpStats:this.arrlossStats;
    this.resStatTbl.refreshTable();
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
    this.passDataHistory.tableData.forEach(e => {
      (e.newRec == 1)?e.bookingMthYr = this.passDataHistory.opts[2].prev[0]:'';
    });
  }

  showWarnMsg(){
    //$('#warnMdl #modalBtn').trigger('click');
    this.clmHistWarnMdl.openNoClose();
  }

  histFunction(str) {
    var msg;

    switch (str) {
      case 1:
      //console.log('here 1');
      //console.log(this.recCheckHistGl);
        if(this.recCheckHistGl[0].distPolStat != 'Y'){
          msg = 'The status of the policy distribution must be Posted before creating reserve';
          this.preventHistory.emit({val:1,msg:msg,show: true});
        } else {
          this.preventHistory.emit({val:2,show: false});
        }

        break;

      case 2:
      //console.log('here 2');
        if(this.recCheckHistGl[0].withinLapse != 'Y'){
          msg = 'Loss Date is within the lapse period (Inception to Effective Date) of policy. Do you want to proceed?';
          this.preventHistory.emit({val:2,msg:msg,apvlCd:'CLM004A', show: true});
        } else {
          this.preventHistory.emit({val:3,show: false});
        }
        
        break;

      case 3:
      //console.log('here 3');
        if(this.recCheckHistGl[0].withinPolTerm != 'Y'){
          msg = 'Loss Date is not within the period of insurance(Inception Date and Expiry Date) of policy. Do you want to proceed?';
          this.preventHistory.emit({val:3,msg:msg,apvlCd:'CLM004B', show: true});
        } else {
          this.preventHistory.emit({val:4,show: false});
        }
        
        break;
      
      case 4:
      //console.log('here 4');
        if(this.recCheckHistGl[0].hasUnpaidPrem != 'Y'){
          msg = 'The policy has unpaid premiums. Do you want to proceed?';
          this.preventHistory.emit({val:4,msg:msg,apvlCd:'CLM004C', show: true});
        }else{
          return;
        }
        
        break;

      default:
        // code...
        break;
    }
  }
}
