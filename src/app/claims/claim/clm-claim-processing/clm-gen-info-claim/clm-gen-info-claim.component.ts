import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ClaimsService, NotesService, UnderwritingService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { MtnLossCdComponent } from '@app/maintenance/mtn-loss-cd/mtn-loss-cd.component';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { MtnClmEventComponent } from '@app/maintenance/mtn-clm-event/mtn-clm-event.component';
import { MtnClmEventTypeComponent } from '@app/maintenance/mtn-clm-event-type/mtn-clm-event-type.component';
import { MtnAdjusterComponent } from '@app/maintenance/mtn-adjuster/mtn-adjuster.component';
import { Router } from '@angular/router';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnClaimStatusLovComponent } from '@app/maintenance/mtn-claim-status-lov/mtn-claim-status-lov.component';
import { forkJoin, Subscription } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-clm-gen-info-claim',
  templateUrl: './clm-gen-info-claim.component.html',
  styleUrls: ['./clm-gen-info-claim.component.css']
})
export class ClmGenInfoClaimComponent implements OnInit, OnDestroy {
  @ViewChild('adjTblGI') adjTable: CustEditableNonDatatableComponent;
  @ViewChild('lossCdLOV') lossCdLOV: MtnLossCdComponent;
  @ViewChild('clmEventLOV') clmEventLOV: MtnClmEventComponent;
  @ViewChild('clmEventTypeLOV') clmEventTypeLOV: MtnClmEventComponent;
  @ViewChild('adjusterLOV') adjusterLOV: MtnAdjusterComponent;
  @ViewChild('adjConfirmSave') adjConfirmSave: ConfirmSaveComponent;
  @ViewChild('adjSuccessDialog') adjSuccessDialog: SucessDialogComponent;
  @ViewChild('adjCancelBtn') adjCancelBtn: CancelButtonComponent;
  @ViewChild('confirmSave') confirmSave: ConfirmSaveComponent;
  @ViewChild('successDialog') successDialog: SucessDialogComponent;
  @ViewChild('cancelBtn') cancelBtn: CancelButtonComponent;
  @ViewChild('statusLOV') statusLOV: MtnClaimStatusLovComponent;

  line: string;
  sub: any;

  @Input() claimInfo = {
    claimId: '',
    claimNo: ''
  }

  adjData: any = {
    tableData: [],
    tHeader: ['Adjuster No','Adjuster Name','Adjuster Reference No'],
    keys: ['adjId','adjName','adjRefNo'],
    dataTypes: ['lovInput-r','text','text'],
    uneditable: [false,true,true],
    addFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    magnifyingGlass: ['adjId'],
    widths: ['1','auto','auto'],
    nData: {
      showMG: 1,
      adjId: '',
      adjName: '',
      adjRefNo: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: ''
    },
    genericBtn: 'Delete',
    disableGeneric: true,
    disableAdd: false
  };

  claimData: any = {
    claimId: null,
    claimNo: null,
    lineCd: null,
    polYear: null,
    polSeqNo: null,
    cedingId: null,
    coSeriesNo: null,
    altNo: null,
    policyNo: null,
    cedingName: null,
    prinId: null,
    principalName: null,
    contractorId: null,
    contractorName: null,
    clmYear: null,
    clmSeqNo: null,
    clmStatCd: null,
    clmStatus: null,
    cessionId: null,
    cessionDesc: null,
    lineClassCd: null,
    lineClassDesc: null,
    mbiRefNo: null,
    coRefNo: null,
    inceptDate: null,
    expiryDate: null,
    coClaimNo: null,
    lossDate: null,
    lossCd: null,
    lossAbbr: null,
    lossPeriod: null,
    lossPdAbbr: null,
    lossDtl: null,
    eventTypeCd: null,
    eventTypeDesc: null,
    eventCd: null,
    eventDesc: null,
    insuredDesc: null,
    reportDate: null,
    reportedBy: null,
    processedBy: null,
    oldStatCd: null,
    oldClmStatus: null,
    closeDate: null,
    refreshSw: null,
    lapseFrom: null,
    lapseTo: null,
    maintenanceFrom: null,
    maintenanceTo: null,
    pctShare: null,
    totalSi: null,
    totalValue: null,
    riskId: null,
    riskName: null,
    currencyCd: null,
    totalLossExpRes: null,
    totalLossExpPd: null,
    createUser: null,
    createDate: null,
    updateUser: null,
    updateDate: null,
    project: {
      projId: null,
      projDesc: null,
      riskId: null,
      riskName: null,
      regionCd: null,
      regionDesc: null,
      provinceCd: null,
      provinceDesc: null,
      cityCd: null,
      cityDesc: null,
      districtCd: null,
      districtDesc: null,
      blockCd: null,
      blockDesc: null,
      latitude: null,
      longitude: null,
      objectId: null,
      objectDesc: null,
      site: null,
      duration: null,
      testing: null,
      ipl: null,
      timeExc: null,
      noClaimPd: null,
      createUser: null,
      createDate: null,
      updateUser: null,
      updateDate: null
    },
    clmAdjusterList: [],
    clmReserve: null,
    approvalInfo: null,
    adjNames: null,
    adjRefNos: null
  }

  lossCdFilter: any = null;
  clmEventFilter: any = null;
  clmEventTypeFilter: any = null;
  lossCdType: any = null;
  hiddenAdj: any[] = [];
  adjLOVRow: number;
  dialogIcon: string = "";
  dialogMessage: string = "";
  cancel: boolean = false;

  claimId: number = 0;
  claimNo: string = '';

  policyId: number = 0;
  policyNo: string = '';

  hideUnpaidMsg: boolean = true;
  disableAdjusterBtn: boolean = false;
  showCustLoader: boolean = false;
  mdlType: string = 'conf';
  tempLossDate: string = '';
  uneditableLossDate: boolean = false;
  @Input() isInquiry: boolean = false;

  @Output() emitClaimInfoId = new EventEmitter<any>();

  subscription: Subscription = new Subscription();

  constructor(private actRoute: ActivatedRoute, private modalService: NgbModal, private titleService: Title,
    private cs: ClaimsService, private ns: NotesService, private us: UnderwritingService, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | General Info");
    $('.globalLoading').css('display','block');

    this.sub = this.actRoute.params.subscribe(params => {
      this.line = params['line'];

      if(this.claimInfo.claimId != '' || this.claimInfo.claimNo != '') {
        this.claimId = Number(this.claimInfo.claimId);
        this.claimNo = this.claimInfo.claimNo;

        this.retrieveClmGenInfo();
      } else if(params['from'] == 'edit') {
        this.claimId = params['claimId'];
        this.claimNo = params['claimNo'];
        //neco
        if(this.isInquiry){
          //this.isInquiry = true;
          this.adjData.addFlag = false;
          this.adjData.deleteFlag = false;
          this.adjData.genericBtn = undefined;
          this.adjData.uneditable = [];
          for(var i in this.adjData.tHeader){
            this.adjData.uneditable.push(true);
          }
          this.adjTable.refreshTable();
        }
        //neco end
        this.retrieveClmGenInfo();
      } else if(params['from'] == 'add') {
        this.policyId = params['policyId'];
        this.policyNo = params['policyNo'];

        this.retrievePolDetails();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  retrieveClmGenInfo() {
    var sub$ = forkJoin(this.cs.getClmGenInfo(this.claimId, this.claimNo),
                        this.cs.getClaimApprovedAmt(this.claimId)).pipe(map(([clm, hist]) => { return { clm, hist }; }));

    this.subscription.add(sub$.subscribe(data => {
      $('.globalLoading').css('display','none');

      this.claimData = data['clm']['claim'];

      this.claimData.approvalInfo = data['hist']['claimApprovedAmtList'].length == 0 ? null : data['hist']['claimApprovedAmtList'].sort((a, b) => b.histNo - a.histNo)
                                                                                                                                  .map(a => {
                                                                                                                                    a.approvedDate = this.ns.toDateTimeString(a.approvedDate);
                                                                                                                                    return a;
                                                                                                                                  })[0];
      this.claimData.inceptDate = this.ns.toDateTimeString(this.claimData.inceptDate);
      this.claimData.expiryDate = this.ns.toDateTimeString(this.claimData.expiryDate);
      this.claimData.lossDate = this.ns.toDateTimeString(this.claimData.lossDate);
      this.claimData.reportDate = this.ns.toDateTimeString(this.claimData.reportDate);
      this.claimData.closeDate = this.ns.toDateTimeString(this.claimData.closeDate);
      this.claimData.createDate = this.ns.toDateTimeString(this.claimData.createDate);
      this.claimData.updateDate = this.ns.toDateTimeString(this.claimData.updateDate);
      this.claimData.lapseFrom = this.claimData.lapseFrom == '' || this.claimData.lapseFrom == null ? '' : this.ns.toDateTimeString(this.claimData.lapseFrom);
      this.claimData.lapseTo = this.claimData.lapseTo == '' || this.claimData.lapseTo == null ? '' : this.ns.toDateTimeString(this.claimData.lapseTo);
      this.claimData.maintenanceFrom = this.claimData.maintenanceFrom == '' || this.claimData.maintenanceFrom == null ? '' : this.ns.toDateTimeString(this.claimData.maintenanceFrom);
      this.claimData.maintenanceTo = this.claimData.maintenanceTo == '' || this.claimData.maintenanceTo == null ? '' : this.ns.toDateTimeString(this.claimData.maintenanceTo);

      this.claimData.prinId = this.pad(this.claimData.prinId, 6);
      this.claimData.contractorId = this.pad(this.claimData.contractorId, 6);
      this.claimData.project.objectId = this.pad(this.claimData.project.objectId, 3);

      if(this.claimData.clmReserve && this.claimData.clmReserve.claimId != null) {
        this.uneditableLossDate = true;
        this.tempLossDate = this.claimData.lossDate;
      }

      if(this.claimData.clmAdjusterList.length > 0) {
        this.adjNameAndRefs();
      }

      this.checkClmIdF(this.claimData.claimId);
    }));

    /*this.cs.getClmGenInfo(this.claimId, this.claimNo).subscribe(data => {
      $('.globalLoading').css('display','none');
      this.claimData = data['claim'];

      this.claimData.inceptDate = this.ns.toDateTimeString(this.claimData.inceptDate);
      this.claimData.expiryDate = this.ns.toDateTimeString(this.claimData.expiryDate);
      this.claimData.lossDate = this.ns.toDateTimeString(this.claimData.lossDate);
      this.claimData.reportDate = this.ns.toDateTimeString(this.claimData.reportDate);
      this.claimData.closeDate = this.ns.toDateTimeString(this.claimData.closeDate);
      this.claimData.createDate = this.ns.toDateTimeString(this.claimData.createDate);
      this.claimData.updateDate = this.ns.toDateTimeString(this.claimData.updateDate);
      this.claimData.lapseFrom = this.claimData.lapseFrom == '' || this.claimData.lapseFrom == null ? '' : this.ns.toDateTimeString(this.claimData.lapseFrom);
      this.claimData.lapseTo = this.claimData.lapseTo == '' || this.claimData.lapseTo == null ? '' : this.ns.toDateTimeString(this.claimData.lapseTo);
      this.claimData.maintenanceFrom = this.claimData.maintenanceFrom == '' || this.claimData.maintenanceFrom == null ? '' : this.ns.toDateTimeString(this.claimData.maintenanceFrom);
      this.claimData.maintenanceTo = this.claimData.maintenanceTo == '' || this.claimData.maintenanceTo == null ? '' : this.ns.toDateTimeString(this.claimData.maintenanceTo);

      this.claimData.prinId = this.claimData.prinId == '' || this.claimData.prinId == null ? '' : String(this.claimData.prinId).padStart(6, '0');
      this.claimData.contractorId = this.claimData.contractorId == '' || this.claimData.contractorId == null ? '' : String(this.claimData.contractorId).padStart(6, '0');
      this.claimData.project.objectId = this.claimData.project.objectId == '' || this.claimData.project.objectId == null ? '' : String(this.claimData.project.objectId).padStart(3, '0');

      if(this.claimData.clmReserve && this.claimData.clmReserve.claimId != null) {
        this.uneditableLossDate = true;
        this.tempLossDate = this.claimData.lossDate;
      }

      if(this.claimData.clmAdjusterList.length > 0) {
        this.adjNameAndRefs();
      }
    });*/
  }

  retrievePolDetails() {
    this.us.getPolGenInfo(this.policyId, this.policyNo).subscribe(data => {
      $('.globalLoading').css('display','none');
      this.disableAdjusterBtn = true;
      var pol = data['policy'];

      this.claimData.lineCd = pol['lineCd'];
      this.claimData.polYear = pol['polYear'];
      this.claimData.polSeqNo = pol['polSeqNo'];
      this.claimData.cedingId = pol['cedingId'];
      this.claimData.coSeriesNo = pol['coSeriesNo'];
      this.claimData.altNo = pol['altNo'];
      this.claimData.policyNo = pol['policyNo'];
      this.claimData.cedingName = pol['cedingName'];
      this.claimData.prinId = pol['principalId'];
      this.claimData.principalName = pol['principalName'];
      this.claimData.contractorId = pol['contractorId'];
      this.claimData.contractorName = pol['contractorName'];
      this.claimData.cessionId = pol['cessionId'];
      this.claimData.cessionDesc = pol['cessionDesc'];
      this.claimData.lineClassCd = pol['lineClassCd'];
      this.claimData.lineClassDesc = pol['lineClassDesc'];
      this.claimData.mbiRefNo = pol['mbiRefNo'];
      this.claimData.coRefNo = pol['coRefNo'];
      this.claimData.inceptDate = this.ns.toDateTimeString(pol['inceptDate']);
      this.claimData.expiryDate = this.ns.toDateTimeString(pol['expiryDate']);
      this.claimData.insuredDesc = pol['insuredDesc'];
      this.claimData.lapseFrom = this.ns.toDateTimeString(pol['lapseFrom']);
      this.claimData.lapseTo = this.ns.toDateTimeString(pol['lapseTo']);
      this.claimData.maintenanceFrom = this.ns.toDateTimeString(pol['maintenanceFrom']);
      this.claimData.maintenanceTo = this.ns.toDateTimeString(pol['maintenanceTo']);
      this.claimData.pctShare = pol['project']['coverage']['pctShare'];
      this.claimData.totalSi = pol['project']['coverage']['totalSi'];
      this.claimData.totalValue = pol['project']['coverage']['totalValue'];
      this.claimData.currencyCd = pol['currencyCd'];
      this.claimData.project.projId = pol['project']['projId'];
      this.claimData.project.projDesc = pol['project']['projDesc'];
      this.claimData.project.riskId = pol['project']['riskId'];
      this.claimData.project.riskName = pol['project']['riskName'];
      this.claimData.project.regionCd = pol['project']['regionCd'];
      this.claimData.project.regionDesc = pol['project']['regionDesc'];
      this.claimData.project.provinceCd = pol['project']['provinceCd'];
      this.claimData.project.provinceDesc = pol['project']['provinceDesc'];
      this.claimData.project.cityCd = pol['project']['cityCd'];
      this.claimData.project.cityDesc = pol['project']['cityDesc'];
      this.claimData.project.districtCd = pol['project']['districtCd'];
      this.claimData.project.districtDesc = pol['project']['districtDesc'];
      this.claimData.project.blockCd = pol['project']['blockCd'];
      this.claimData.project.blockDesc = pol['project']['blockDesc'];
      this.claimData.project.latitude = pol['project']['latitude'];
      this.claimData.project.longitude = pol['project']['longitude'];
      this.claimData.project.objectId = pol['project']['objectId'];
      this.claimData.project.objectDesc = pol['project']['objectDesc'];
      this.claimData.project.site = pol['project']['site'];
      this.claimData.project.duration = pol['project']['duration'];
      this.claimData.project.testing = pol['project']['testing'];
      this.claimData.project.ipl = pol['project']['ipl'];
      this.claimData.project.timeExc = pol['project']['timeExc'];
      this.claimData.project.noClaimPd = pol['project']['noClaimPd'];

      this.claimData.prinId = this.pad(this.claimData.prinId, 6);
      this.claimData.contractorId = this.pad(this.claimData.contractorId, 6);
      this.claimData.project.objectId = this.pad(this.claimData.project.objectId, 3);

      this.claimData.clmYear = new Date().getFullYear();
      this.claimData.clmStatCd = 'IP';
      this.claimData.clmStatus = 'In Progress';
      this.claimData.processedBy = this.ns.getCurrentUser();
    });
  }

  openAdjustersModal() {
    this.adjData.tableData = this.claimData.clmAdjusterList;
    this.adjTable.refreshTable();
    this.adjTable.onRowClick(null, this.adjData.tableData[0]);
    $('#adjustersModal #modalBtn').trigger('click');
  }

  showLossCdLOV(type) {
    this.lossCdType = type;
    this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == type };

    this.lossCdLOV.modal.openNoClose();
  }

  setLossCd(ev) {
    this.ns.lovLoader(ev.ev, 0);
    $('#hiddenInpClm').addClass('ng-touched ng-dirty');

    if(this.lossCdType == 'C' || ev.lossCdType == 'C') {
      this.claimData.lossCd = ev.lossCd;
      this.claimData.lossAbbr = ev.lossAbbr;
    } else if(this.lossCdType == 'P' || ev.lossCdType == 'P') {
      this.claimData.lossPeriod = ev.lossCd;
      this.claimData.lossPdAbbr = ev.lossAbbr;
    }
  }

  showUsersLOV() {
    $('#usersLOV #modalBtn').trigger('click');
  }

  setProcessedBy(ev) {
    this.claimData.processedBy = ev.userId;
  }

  showClmEventLOV() {
    var eventTypeCd = this.claimData.eventTypeCd;
    var line = this.line;

    this.clmEventFilter = function(a) { return a.activeTag == 'Y' && a.eventTypeCd == eventTypeCd && a.lineCd == line };
    this.clmEventLOV.modal.openNoClose();
  }

  setClmEvent(ev) {
    this.claimData.eventCd = ev.eventCd;
    this.claimData.eventDesc = ev.eventDesc;
  }

  showClmEventTypeLOV() {
    this.clmEventTypeFilter = function(a) { return a.activeTag == 'Y' };
    this.clmEventTypeLOV.modal.openNoClose();
  }

  setClmEventType(ev) {
    this.claimData.eventTypeCd = ev.eventTypeCd;
    this.claimData.eventTypeDesc = ev.eventTypeDesc;
  }

  adjNameAndRefs() {
    this.claimData.adjNames = this.claimData.clmAdjusterList.filter(a => !a.deleted).map(a => a.adjName).join(' / ');
    this.claimData.adjRefNos = this.claimData.clmAdjusterList.filter(a => !a.deleted).map(a => a.adjRefNo).join(' / ');
  }

  clmAdjTDataChange(data) {
    if(data.hasOwnProperty('lovInput')) {
      this.hiddenAdj = this.adjData.tableData.filter(a => a.adjId !== undefined && !a.deleted && a.showMG != 1).map(a => a.adjId);

      data.ev['index'] = data.index;
      this.adjusterLOV.checkCode(data.ev.target.value, data.ev);
    }
  }

  showAdjLOV(ev) {
    this.hiddenAdj = this.adjData.tableData.filter(a => a.adjId !== undefined && !a.deleted && a.showMG != 1).map(a => a.adjId);
    this.adjusterLOV.modal.openNoClose();
    this.adjLOVRow = ev.index;
  }

  setSelectedAdjuster(data) {
    if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
      this.adjLOVRow = data.ev.index;
      this.ns.lovLoader(data.ev, 0);

      if(data.adjId != '' && data.adjId != null && data.adjId != undefined) {
        this.adjData.tableData[this.adjLOVRow].showMG = 0;
        this.adjData.tableData[this.adjLOVRow].adjId = data.adjId;
        this.adjData.tableData[this.adjLOVRow].adjName = data.adjName;
        this.adjData.tableData[this.adjLOVRow].adjRefNo = data.adjRefNo;
        this.adjData.tableData[this.adjLOVRow].edited = true;
      } else {
        this.adjData.tableData[this.adjLOVRow].adjId = '';
        this.adjData.tableData[this.adjLOVRow].adjName = '';
        this.adjData.tableData[this.adjLOVRow].adjRefNo = '';
        this.adjData.tableData[this.adjLOVRow].edited = true;
      }
    } else {
      this.adjData.tableData = this.adjData.tableData.filter(a => a.showMG != 1);
        for(let i of data) {
          this.adjData.tableData.push(JSON.parse(JSON.stringify(this.adjData.nData)));
          this.adjData.tableData[this.adjData.tableData.length - 1].showMG = 0;
          this.adjData.tableData[this.adjData.tableData.length - 1].adjId = i.adjId;
          this.adjData.tableData[this.adjData.tableData.length - 1].adjName = i.adjName;
          this.adjData.tableData[this.adjData.tableData.length - 1].adjRefNo = i.adjRefNo;
          this.adjData.tableData[this.adjData.tableData.length - 1].edited = true;
        }
      }

    $('#cust-table-container').addClass('ng-dirty');

    this.adjTable.refreshTable();
  }

  adjTableRowClick(data) {
    this.adjData.disableGeneric = data == null || data == '';
  }

  clmAdjClickDelete(ev) {
    if(ev != undefined) {
      this.adjTable.confirmDelete();
    } else {
      this.adjData.disableGeneric = true;
      this.adjTable.indvSelect.edited = true;
      this.adjTable.indvSelect.deleted = true;
      this.adjTable.refreshTable();
    }
  }

  maintainAdjuster() {
    this.router.navigate(['/mtn-adjuster-list'], { skipLocationChange: false });
    this.modalService.dismissAll();
  }

  showStatusLOV() {
    this.statusLOV.modal.openNoClose();
  }

  setStatus(ev) {
    this.claimData.clmStatCd = ev.statusCode;
    this.claimData.clmStatus = ev.description;
  }

  onAdjClickCancel() {
    if($('#adj-table .ng-dirty:not([type="search"]):not(.not-form)').length != 0){
      this.adjCancelBtn.saveModal.openNoClose();
    } else {
      this.modalService.dismissAll();
    }
  }

  onAdjClickSave() {
    var td = this.adjData.tableData;

    if(td.filter(a => a.edited && !a.deleted && (a.adjId == '' || a.adjName == '')).length > 0) {
      this.dialogIcon = 'error';
      this.adjSuccessDialog.open();

      this.cancel = false;
      return;
    }

    if(!this.cancel) {
      this.adjConfirmSave.confirmModal();  
    } else {
      this.adjSave(false);
    }
  }

  adjSave(cancel?) {
    this.cancel = cancel !== undefined;

    if(this.cancel && cancel) {
      this.onAdjClickSave();
      return;
    }

    var td = this.adjData.tableData;

    var params = {
      saveAdjuster: [],
      deleteAdjuster: []
    }

    params.saveAdjuster = td.filter(a => a.edited && !a.deleted).map(a => {
                                                                   a.claimId = this.claimData.claimId;
                                                                   a.createUser = this.ns.getCurrentUser();
                                                                   a.createDate = this.ns.toDateTimeString(0);
                                                                   a.updateUser = this.ns.getCurrentUser();
                                                                   a.updateDate = this.ns.toDateTimeString(0);
                                                                   return a;
                                                                 });
    params.deleteAdjuster = td.filter(a => a.deleted);

    this.cs.saveClmAdjuster(params).subscribe(data => {
      if(data['returnCode'] == -1) {
        this.dialogIcon = "success";
        this.adjSuccessDialog.open();
        this.adjNameAndRefs();

        /*this.adjData.tableData.forEach(a => {
          if(a.edited && !a.deleted) {
            a.edited = false;
          }
        });*/
        this.claimData.clmAdjusterList = this.adjData.tableData;
      } else {
        this.dialogIcon = "error";
        this.adjSuccessDialog.open();
      }
    });
  }

  onClickSave() {
    var req = ['processedBy', 'lossCd', 'lossPeriod', 'lossDtl', 'clmStatCd'];

    var entries = Object.entries(this.claimData);

    for(var [key, val] of entries) {      
      if((val === '' || val == null) && req.includes(key)) {
        this.dialogIcon = 'error';
        this.successDialog.open();
        this.cancel = false;
        return;
      }

      if(key === 'lossDate' && String(val).split('T').includes('')) {
        this.dialogIcon = 'error';
        this.successDialog.open();
        this.cancel = false;
        return;
      }
    }

    if(this.claimData.eventTypeCd != null && this.claimData.eventTypeCd != '') {
      if(this.claimData.eventCd == null || this.claimData.eventCd == '') {
        this.dialogIcon = 'error';
        this.successDialog.open();
        this.cancel = false;
        return;
      }
    }

    if(!this.cancel) {
      this.confirmSave.confirmModal();  
    } else {
      this.save(false);
    }
  }

  save(cancel?) {
    this.cancel = cancel !== undefined;

    if(this.cancel && cancel) {
      this.onClickSave();
      return;
    }

    var entries = Object.entries(this.claimData.project);
    for(var [key, val] of entries) {      
      if(key === 'createDate') {
        this.claimData['prjCreateDate'] = this.ns.toDateTimeString(val);
      } else if(key === 'updateDate') {
        this.claimData['prjUpdateDate'] = this.ns.toDateTimeString(val);
      } else {
        this.claimData[key] = val;
      }
    }

    this.claimData.prjCreateUser = this.ns.getCurrentUser();
    this.claimData.prjUpdateUser = this.ns.getCurrentUser();

    this.claimData.createUser = this.ns.getCurrentUser();
    this.claimData.createDate = this.ns.toDateTimeString(0);
    this.claimData.updateUser = this.ns.getCurrentUser();
    this.claimData.updateDate = this.ns.toDateTimeString(0);

    this.cs.saveClmGenInfo(this.claimData).subscribe(data => {
      if(data['returnCode'] == 0) {
        this.dialogIcon = 'error';
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.successDialog.open();
      } else if(data['returnCode'] == -1) {
        this.dialogIcon = "success";
        this.successDialog.open();
        this.claimId = data['claimId'];
        this.claimNo = data['claimNo'];
        this.disableAdjusterBtn = false;

        this.retrieveClmGenInfo();

        setTimeout(() => { this.checkClmIdF(data['claimId']); });
      }
    });
  }

  checkClmIdF(ev) {
    this.emitClaimInfoId.emit({
      claimId: ev,
      claimNo: this.claimNo,
      policyNo: this.claimData.policyNo,
      riskName: this.claimData.project.riskName,
      insuredDesc: this.claimData.insuredDesc
    });
  }

  validateLossDate() {
    setTimeout(() => {
      if(this.uneditableLossDate) {
        this.claimData.lossDate = this.tempLossDate;
        this.mdlType = 'warn2';
        $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
        return;
      }

      if(!this.claimData.lossDate.split('T').includes('')) {
        var inceptD = new Date(this.claimData.inceptDate);
        var expiryD = new Date(this.claimData.expiryDate);
        var lapseF = this.claimData.lapseFrom == null || this.claimData.lapseFrom == '' ? '' : new Date(this.claimData.lapseFrom);
        var lapseT = this.claimData.lapseTo == null || this.claimData.lapseTo == '' ? '' : new Date(this.claimData.lapseTo);
        var lossD = new Date(this.claimData.lossDate);
        
        if(lapseF != '' && lapseT != '' && (lossD < inceptD || lossD > expiryD) && lossD >= lapseF && lossD <= lapseT) {
          this.mdlType = 'conf';
          $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
        } else if(lossD >= inceptD && lossD <= expiryD) {
          this.onClickConfYes();
        } else {
          this.mdlType = 'warn';
          $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
        }
      }
    }, 0);
  }

  onClickConfYes() {
    var pNo = this.claimData.policyNo.split('-');
    pNo[pNo.length-1] = '%';
    this.showCustLoader = true;

    var sub$ = this.us.getParListing([ { key: 'policyNo', search: pNo.join('-') }])
                      .pipe(tap(data => data['policyList'] = data['policyList'].filter(a => a.effDate <= new Date(this.claimData.lossDate))
                                                                               .sort((a, b) => b.altNo - a.altNo)),
                            mergeMap(data => this.us.getPolGenInfo(data['policyList'][0].policyId, data['policyList'][0].policyNo)));

    this.subscription.add(sub$.subscribe(data => {
      this.showCustLoader = false;

      var pol = data['policy'];
      var prj = pol['project'];

      this.claimData['refPolId'] = pol['policyId'];
      this.claimData.currencyCd = pol['currencyCd'];
      this.claimData.prinId = this.pad(pol['principalId'], 6);
      this.claimData.principalName = pol['principalName'];
      this.claimData.contractorId = this.pad(pol['contractorId'], 6);
      this.claimData.contractorName = pol['contractorName'];
      this.claimData.insuredDesc = pol['insuredDesc'];
      this.claimData.pctShare = prj['coverage']['pctShare'];
      this.claimData.totalSi = prj['coverage']['totalSi'];
      this.claimData.totalValue = prj['coverage']['totalValue'];
      this.claimData.project.projDesc = prj['projDesc'];
      this.claimData.project.riskId = prj['riskId'];
      this.claimData.project.riskName = prj['riskName'];
      this.claimData.project.objectId = this.pad(prj['objectId'], 3);
      this.claimData.project.objectDesc = prj['objectDesc'];
      this.claimData.project.regionCd = prj['regionCd'];
      this.claimData.project.regionDesc = prj['regionDesc'];
      this.claimData.project.provinceCd = prj['provinceCd'];
      this.claimData.project.provinceDesc = prj['provinceDesc'];
      this.claimData.project.cityCd = prj['cityCd'];
      this.claimData.project.cityDesc = prj['cityDesc'];
      this.claimData.project.districtCd = prj['districtCd'];
      this.claimData.project.districtDesc = prj['districtDesc'];
      this.claimData.project.blockCd = prj['blockCd'];
      this.claimData.project.blockDesc = prj['blockDesc'];
      this.claimData.project.latitude = prj['latitude'];
      this.claimData.project.longitude = prj['longitude'];
      this.claimData.project.site = prj['site'];
      this.claimData.project.testing = prj['testing'];
      this.claimData.project.timeExc = prj['timeExc'];
      this.claimData.project.ipl = prj['ipl'];
      this.claimData.project.noClaimPd = prj['noClaimPd'];
    }));
  }

  showRefModal() {
    this.mdlType = 'ref';
    $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
  }

  onClickConfRefYes() {
    var params = {
      claimId: this.claimData.claimId,
      refPolId: '',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0)
    }

    this.cs.updateClmDetails(params).subscribe(data => {
      if(data['returnCode'] == 0) {
        this.dialogIcon = 'error';
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.successDialog.open();
      } else if(data['returnCode'] == -1) {
        this.dialogIcon = 'success';
        this.successDialog.open();
        this.disableAdjusterBtn = false;

        this.retrieveClmGenInfo();
      }
    });
  }

  checkCode(ev, str) {
    this.ns.lovLoader(ev, 1);
    setTimeout(() => {
      if(str === 'lc') {
        this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == 'C' };
        this.lossCdLOV.checkCode('C', this.claimData.lossAbbr, ev);
      } else if(str === 'lp') {
        this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == 'P' };
        this.lossCdLOV.checkCode('P', this.claimData.lossPdAbbr, ev);
      }
    });
    // if(str === 'lc') {
    //   this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == 'C' };
    //   this.lossCdLOV.checkCode('C', this.claimData.lossAbbr, ev);
    // } else if(str === 'lp') {
    //   this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == 'P' };
    //   this.lossCdLOV.checkCode('P', this.claimData.lossPdAbbr, ev);
    // }
  }

  dc(ev, data, type) {
    return this.ns.dateConstructor(ev, data, type);
  }

  pad(val, num) {
    if(val == '' || val == null) {
      return '';
    }

    return String(val).padStart(num, '0');
  }
}
