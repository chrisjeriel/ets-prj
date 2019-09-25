import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ClaimsService, NotesService, UnderwritingService, MaintenanceService } from '@app/_services';
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
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-clm-gen-info-claim',
  templateUrl: './clm-gen-info-claim.component.html',
  styleUrls: ['./clm-gen-info-claim.component.css']
})
export class ClmGenInfoClaimComponent implements OnInit, OnDestroy {
  @ViewChild('adjTblGI') adjTable: CustEditableNonDatatableComponent;
  @ViewChild('lossCdLOV') lossCdLOV: MtnLossCdComponent;
  @ViewChild('clmEventLOV') clmEventLOV: MtnClmEventComponent;
  @ViewChild('clmEventTypeLOV') clmEventTypeLOV: MtnClmEventTypeComponent;
  @ViewChild('adjusterLOV') adjusterLOV: MtnAdjusterComponent;
  @ViewChild('adjusterLOVMain') adjusterLOVMain: MtnAdjusterComponent;
  @ViewChild('adjConfirmSave') adjConfirmSave: ConfirmSaveComponent;
  @ViewChild('adjSuccessDialog') adjSuccessDialog: SucessDialogComponent;
  @ViewChild('adjCancelBtn') adjCancelBtn: CancelButtonComponent;
  @ViewChild('confirmSave') confirmSave: ConfirmSaveComponent;
  @ViewChild('successDialog') successDialog: SucessDialogComponent;
  @ViewChild('cancelBtn') cancelBtn: CancelButtonComponent;
  @ViewChild('statusLOV') statusLOV: MtnClaimStatusLovComponent;
  @ViewChild('usersLov') usersLov: MtnUsersComponent;
  @ViewChild(NgForm) myForm: NgForm;

  line: string;
  sub: any;

  @Input() claimInfo = {
    claimId: '',
    claimNo: ''
  }

  adjData: any = {
    tableData: [],
    tHeader: ['Adjuster No','Adjuster Name','Adjuster File No'],
    keys: ['adjId','adjName','adjRefNo'],
    dataTypes: ['lovInput-r','text','text'],
    uneditable: [false,true,false],
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
    policyId: null,
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
    insuredClm: null,
    cessionId: null,
    cessionDesc: null,
    lineClassCd: null,
    lineClassDesc: null,
    mbiRefNo: null,
    coRefNo: null,
    inceptDate: null,
    expiryDate: null,
    coClmNo: null,
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
    issueDate: null,
    effDate: null,
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
    lapsePdTag: null,
    polTermTag: null,
    premTag: null,
    remarks: null,
    approvedBy: null,
    approvedDate: null,
    adjId: null,
    adjName: null,
    adjFileNo: null,
    createUser: null,
    createDate: null,
    updateUser: null,
    updateDate: null,
    preventRefresh: null,
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
  cancelAdj: boolean = false;
  cancel: boolean = false;

  claimId: number = 0;
  claimNo: string = '';

  policyId: number = 0;
  policyNo: string = '';

  showUnpaidMsg: boolean = false;
  disableAdjusterBtn: boolean = false;
  showCustLoader: boolean = false;
  mdlType: string = 'conf';
  tempLossDate: string = '';
  uneditableLossDate: boolean = false;
  disableClmHistory: boolean = true;
  disableNextTabs: boolean = true;
  disablePaytReq: boolean = true;
  maxDate: string = '';
  beforePolTerm: boolean = false;

  @Input() isInquiry: boolean = false;

  @Output() emitClaimInfoId = new EventEmitter<any>();

  subscription: Subscription = new Subscription();

  constructor(private actRoute: ActivatedRoute, public modalService: NgbModal, private titleService: Title,
    private cs: ClaimsService, private ns: NotesService, private us: UnderwritingService, private router: Router, private ms: MaintenanceService,
    private cd: ChangeDetectorRef) { }

  ngAfterViewInit() {
        this.cd.detectChanges();
  }

  ngOnInit() {
    this.maxDate = this.ns.toDateTimeString(0).split('T')[0];

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
                        this.cs.getClaimApprovedAmt(this.claimId),
                        this.cs.getClaimSecCover(this.claimId, this.claimNo),
                        this.cs.getClaimHistory(this.claimId, this.claimNo)).pipe(map(([clm, hist, vldSC, vldH]) => { return { clm, hist, vldSC, vldH }; }));

    this.subscription.add(sub$.subscribe(data => {
      $('.globalLoading').css('display','none');

      this.claimData = data['clm']['claim'];
      this.claimData['statusChanged'] = 0;

      this.claimData.approvalInfo = data['hist']['claimApprovedAmtList'].length == 0 ? null : data['hist']['claimApprovedAmtList'].sort((a, b) => b.histNo - a.histNo)
                                                                                                                                  .map(a => {
                                                                                                                                    a.approvedDate = this.ns.toDateTimeString(a.approvedDate);
                                                                                                                                    return a;
                                                                                                                                  })[0];
      this.showUnpaidMsg = this.claimData.premTag == 'N';
      this.claimData.inceptDate = this.ns.toDateTimeString(this.claimData.inceptDate);
      this.claimData.expiryDate = this.ns.toDateTimeString(this.claimData.expiryDate);
      this.claimData.lossDate = this.ns.toDateTimeString(this.claimData.lossDate);
      this.claimData.reportDate = this.ns.toDateTimeString(this.claimData.reportDate);
      this.claimData.closeDate = this.ns.toDateTimeString(this.claimData.closeDate);
      this.claimData.createDate = this.ns.toDateTimeString(this.claimData.createDate);
      this.claimData.updateDate = this.ns.toDateTimeString(this.claimData.updateDate);
      this.claimData.issueDate = this.ns.toDateTimeString(this.claimData.issueDate);
      this.claimData.effDate = this.ns.toDateTimeString(this.claimData.effDate);
      this.claimData.lapseFrom = this.claimData.lapseFrom == '' || this.claimData.lapseFrom == null ? '' : this.ns.toDateTimeString(this.claimData.lapseFrom);
      this.claimData.lapseTo = this.claimData.lapseTo == '' || this.claimData.lapseTo == null ? '' : this.ns.toDateTimeString(this.claimData.lapseTo);
      this.claimData.maintenanceFrom = this.claimData.maintenanceFrom == '' || this.claimData.maintenanceFrom == null ? '' : this.ns.toDateTimeString(this.claimData.maintenanceFrom);
      this.claimData.maintenanceTo = this.claimData.maintenanceTo == '' || this.claimData.maintenanceTo == null ? '' : this.ns.toDateTimeString(this.claimData.maintenanceTo);

      this.claimData.prinId = this.pad(this.claimData.prinId, 6);
      this.claimData.contractorId = this.pad(this.claimData.contractorId, 6);
      this.claimData.project.objectId = this.pad(this.claimData.project.objectId, 3);

      if(this.claimData.preventRefresh == 'Y') {
        this.uneditableLossDate = true;
        this.tempLossDate = this.claimData.lossDate;
      }

      if(this.claimData.clmAdjusterList.length > 0) {
        // this.adjNameAndRefs();
      }

      this.disableClmHistory = data['vldSC']['claims'] == null || data['vldSC']['claims']['project']['clmCoverage']['allowMaxSi'] == null;
      this.disableNextTabs = data['vldH']['claimReserveList'].length == 0;
      if(!this.disableNextTabs && data['vldH']['claimReserveList'][0]['clmHistory'].length > 0) {
        this.disablePaytReq = data['vldH']['claimReserveList'][0]['clmHistory'].filter(a => a.histTypeDesc == 'Partial Payment' || a.histTypeDesc == 'Final Payment').length == 0;
      }

      this.checkClmIdF(this.claimData.claimId);

      setTimeout(() => {
        $('input[appCurrency]').focus();
        $('input[appCurrency]').blur();
      }, 0);
    }));
  }

  retrievePolDetails() {
    var pNo = this.policyNo.split('-');
    pNo[pNo.length-1] = '%';

    var sub$ = forkJoin(this.us.getParListing([ { key: 'policyNo', search: pNo.join('-') }])
                             .pipe(tap(data => data['policyList'] = data['policyList'].filter(a => a.statusDesc == 'In Force')
                                                                                      .sort((a, b) => b.altNo - a.altNo)),
                                   mergeMap(data => this.us.getPolGenInfo(data['policyList'][0].policyId, data['policyList'][0].policyNo))),
                      this.us.getPolGenInfo(this.policyId, this.policyNo)).pipe(map(([alt, base]) => { return { alt, base }; }));

    this.subscription.add(sub$.subscribe(data => {
      $('.globalLoading').css('display','none');
      var alt = data['alt']['policy'];
      var base = data['base']['policy'];

      this.disableAdjusterBtn = true;
      this.showUnpaidMsg = base['premTag'] == 'N';
      this.claimData.premTag = base['premTag'];
      this.claimData['statusChanged'] = 0;
      this.claimData.lineCd = base['lineCd'];
      this.claimData.polYear = base['polYear'];
      this.claimData.polSeqNo = base['polSeqNo'];
      this.claimData.cedingId = base['cedingId'];
      this.claimData.coSeriesNo = base['coSeriesNo'];
      this.claimData.altNo = base['altNo'];
      this.claimData.policyNo = base['policyNo'];
      this.claimData.cedingName = base['cedingName'];
      this.claimData.cessionId = base['cessionId'];
      this.claimData.cessionDesc = base['cessionDesc'];
      this.claimData.lineClassCd = base['lineClassCd'];
      this.claimData.lineClassDesc = base['lineClassDesc'];
      this.claimData.mbiRefNo = base['mbiRefNo'];
      this.claimData.effDate = this.ns.toDateTimeString(base['effDate']);

      this.claimData.coRefNo = alt['coRefNo'];
      this.claimData.prinId = alt['principalId'];
      this.claimData.principalName = alt['principalName'];
      this.claimData.contractorId = alt['contractorId'];
      this.claimData.contractorName = alt['contractorName'];
      this.claimData.insuredDesc = alt['insuredDesc'];
      this.claimData.project.projId = alt['project']['projId'];
      this.claimData.project.projDesc = alt['project']['projDesc'];
      this.claimData.project.riskId = alt['project']['riskId'];
      this.claimData.project.riskName = alt['project']['riskName'];
      this.claimData.project.regionCd = alt['project']['regionCd'];
      this.claimData.project.regionDesc = alt['project']['regionDesc'];
      this.claimData.project.provinceCd = alt['project']['provinceCd'];
      this.claimData.project.provinceDesc = alt['project']['provinceDesc'];
      this.claimData.project.cityCd = alt['project']['cityCd'];
      this.claimData.project.cityDesc = alt['project']['cityDesc'];
      this.claimData.project.districtCd = alt['project']['districtCd'];
      this.claimData.project.districtDesc = alt['project']['districtDesc'];
      this.claimData.project.blockCd = alt['project']['blockCd'];
      this.claimData.project.blockDesc = alt['project']['blockDesc'];
      this.claimData.project.latitude = alt['project']['latitude'];
      this.claimData.project.longitude = alt['project']['longitude'];
      this.claimData.project.objectId = alt['project']['objectId'];
      this.claimData.project.objectDesc = alt['project']['objectDesc'];
      this.claimData.project.site = alt['project']['site'];
      this.claimData.project.duration = alt['project']['duration'];
      this.claimData.project.testing = alt['project']['testing'];
      this.claimData.project.ipl = alt['project']['ipl'];
      this.claimData.project.timeExc = alt['project']['timeExc'];
      this.claimData.project.noClaimPd = alt['project']['noClaimPd'];
      this.claimData.inceptDate = this.ns.toDateTimeString(alt['inceptDate']);
      this.claimData.expiryDate = this.ns.toDateTimeString(alt['expiryDate']);
      this.claimData.issueDate = this.ns.toDateTimeString(alt['issueDate']);
      this.claimData.lapseFrom = this.ns.toDateTimeString(alt['lapseFrom']);
      this.claimData.lapseTo = this.ns.toDateTimeString(alt['lapseTo']);
      this.claimData.maintenanceFrom = this.ns.toDateTimeString(alt['maintenanceFrom']);
      this.claimData.maintenanceTo = this.ns.toDateTimeString(alt['maintenanceTo']);
      this.claimData.pctShare = alt['project']['coverage']['pctShare'];
      this.claimData.totalSi = alt['project']['coverage']['totalSi'];
      this.claimData.totalValue = alt['project']['coverage']['totalValue'];
      this.claimData.currencyCd = alt['currencyCd'];

      this.claimData.prinId = this.pad(this.claimData.prinId, 6);
      this.claimData.contractorId = this.pad(this.claimData.contractorId, 6);
      this.claimData.project.objectId = this.pad(this.claimData.project.objectId, 3);

      this.claimData.clmYear = new Date().getFullYear();
      this.claimData.clmStatCd = 'IP';
      this.claimData.clmStatus = 'In Progress';
      this.claimData.processedBy = this.ns.getCurrentUser();

      var d = this.ns.toDateTimeString(0).split('T');
      this.claimData.reportDate = d.join('T');

      d[0] = '';
      this.claimData.lossDate = d.join('T');

      this.checkClmIdF('');
    }));
  }

  openAdjustersModal() {
    this.adjData.tableData = JSON.parse(JSON.stringify(this.claimData.clmAdjusterList));
    this.adjTable.refreshTable();
    this.adjTable.onRowClick(null, this.adjData.tableData[0]);
    $('#adjustersModal #modalBtn').trigger('click');
  }

  onCancelNo() {
    this.adjTable.markAsPristine();
  }

  showLossCdLOV(type) {
    this.claimData.clmAdjusterList = this.lossCdType = type;
    this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == type };

    this.lossCdLOV.modal.openNoClose();
  }

  setLossCd(ev) {
    this.ns.lovLoader(ev.ev, 0);
    this.myForm.control.markAsDirty();

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
    this.ns.lovLoader(ev.ev, 0);
  }

  showClmEventLOV() {
    var eventTypeCd = this.claimData.eventTypeCd;
    var ld = this.claimData.lossDate.split('T');
    var d = ld[0] == '' ? new Date() : ld[1] == '' ? new Date(ld[1]) : new Date(ld.join('T'));

    this.clmEventFilter = function(a) { return a.activeTag == 'Y' && a.eventTypeCd == eventTypeCd && a.lossDateFrom >= d && d <= a.lossDateTo };
    this.clmEventLOV.modal.openNoClose();
  }

  setClmEvent(ev) {
    this.ns.lovLoader(ev.ev, 0);
    this.myForm.control.markAsDirty();

    this.claimData.eventCd = ev.eventCd;
    this.claimData.eventDesc = ev.eventDesc;
  }

  showClmEventTypeLOV() {
    this.clmEventTypeFilter = function(a) { return a.activeTag == 'Y' };
    this.clmEventTypeLOV.modal.openNoClose();
  }

  setClmEventType(ev) {
    this.ns.lovLoader(ev.ev, 0);
    this.myForm.control.markAsDirty();

    this.claimData.eventTypeCd = ev.eventTypeCd;
    this.claimData.eventTypeDesc = ev.eventTypeDesc;

    if(ev.eventTypeCd == '') {
      this.claimData.eventCd = '';
      this.claimData.eventDesc = '';
    }
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
    this.hiddenAdj.push(this.claimData.adjId);
    this.adjLOVRow = ev.index;
    
    this.adjusterLOV.modal.openNoClose();
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

      this.adjTable.markAsDirty();

    this.adjTable.refreshTable();
  }

  showAdjLOVMain(ev) {
    this.adjusterLOVMain.modal.openNoClose();
  }

  setSelectedMainAdjuster(data) {
    this.ns.lovLoader(data.ev, 0);
    this.myForm.control.markAsDirty();

    this.claimData.adjId = data.adjId;
    this.claimData.adjName = data.adjName;

    for(var i of this.claimData.clmAdjusterList) {
      if(i.adjId == data.adjId) {
        this.claimData.adjFileNo = i.adjRefNo;
        return;
      } else {
        this.claimData.adjFileNo = '';
      }
    }
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
    this.myForm.control.markAsDirty();

    if(this.claimData.claimId != null) {
      this.claimData.statusChanged = 1;
    }
    
    this.claimData.clmStatCd = ev.statusCode;
    this.claimData.clmStatus = ev.description;
  }

  onAdjClickCancel() {
    if(this.adjTable.form.first.dirty){
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

      this.cancelAdj = false;
      return;
    }

    if(!this.cancelAdj) {
      this.adjConfirmSave.confirmModal();  
    } else {
      this.adjSave(false);
    }
  }

  adjSave(cancel?) {
    this.cancelAdj = cancel !== undefined;

    if(this.cancelAdj && cancel) {
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
    params.deleteAdjuster.forEach(a => {
      if(a.claimId == undefined) {
        a['claimId'] = this.claimData.claimId;
      }
    });

    this.cs.saveClmAdjuster(params).subscribe(data => {
      if(data['returnCode'] == -1) {
        this.dialogIcon = "success";
        this.adjSuccessDialog.open();

        this.claimData.clmAdjusterList = this.adjData.tableData.filter(a => !a.deleted).slice();

        if(!this.claimData.clmAdjusterList.map(a => Number(a.adjId)).includes(this.claimData.adjId)) {
          this.claimData.adjId = '';
          this.claimData.adjName = '';
          this.claimData.adjFileNo = '';
        }
        this.adjTable.markAsPristine();
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

      if(key === 'lossDate' && String(val).split('T')[0] == '') {
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
      if(key !== 'clmReserve') {
        if(key === 'createDate') {
          this.claimData['prjCreateDate'] = this.ns.toDateTimeString(val);
        } else if(key === 'updateDate') {
          this.claimData['prjUpdateDate'] = this.ns.toDateTimeString(val);
        } else {
          this.claimData[key] = val;
        }
      }
    }

    this.claimData.prjCreateUser = this.ns.getCurrentUser();
    this.claimData.prjUpdateUser = this.ns.getCurrentUser();

    this.claimData.createUser = this.ns.getCurrentUser();
    this.claimData.createDate = this.ns.toDateTimeString(0);
    this.claimData.updateUser = this.ns.getCurrentUser();
    this.claimData.updateDate = this.ns.toDateTimeString(0);

    this.cs.saveClmGenInfo(this.claimData).subscribe(data => {
      if(data['returnCode'] == -1) {
        this.dialogIcon = "success";
        this.successDialog.open();
        this.claimId = data['claimId'];
        this.claimNo = data['claimNo'];
        this.disableAdjusterBtn = false;

        this.retrieveClmGenInfo();
        this.myForm.control.markAsPristine();
      } else if(data['returnCode'] == 0) {
        this.dialogIcon = 'error';
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.successDialog.open();
      } else if(data['returnCode'] == 1) {
        this.mdlType = 'warn3';        
        $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
      } else if(data['returnCode'] == 2) {
        this.mdlType = 'warn4';
        $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
      }
    });
  }

  checkClmIdF(ev) {
    this.emitClaimInfoId.emit({
      claimId: ev,
      claimNo: this.claimNo,
      projId : this.claimData.project.projId,
      policyId: this.policyId == 0 ? this.claimData.policyId : this.policyId,
      policyNo: this.claimData.policyNo,
      riskName: this.claimData.project.riskName,
      insuredDesc: this.claimData.insuredDesc,
      clmStatus : this.claimData.clmStatus,
      disableClmHistory: this.disableClmHistory,
      disableNextTabs: this.disableNextTabs,
      disablePaytReq: this.disablePaytReq
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

      if(this.claimData.lossDate.split('T')[0] != '') {
        /*var inceptD = new Date(this.claimData.inceptDate).setSeconds(0);
        var expiryD = new Date(this.claimData.expiryDate).setSeconds(0);
        var effD = new Date(this.claimData.effDate).setSeconds(0);
        var lossD = this.claimData.lossDate.split('T')[1] == '' ? new Date(this.claimData.lossDate + '00:00').setSeconds(0) : new Date(this.claimData.lossDate).setSeconds(0);
        var lapseFD = this.claimData.lapseFrom == null || this.claimData.lapseFrom == '' ? null : new Date(this.claimData.lapseFrom).setSeconds(0);
        var lapseTD = this.claimData.lapseTo == null || this.claimData.lapseTo == '' ? null : new Date(this.claimData.lapseTo).setSeconds(0);
        var maintFD = this.claimData.maintenanceFrom == null || this.claimData.maintenanceFrom == '' ? null : new Date(this.claimData.maintenanceFrom).setSeconds(0);
        var maintTD = this.claimData.maintenanceTo == null || this.claimData.maintenanceTo == '' ? null : new Date(this.claimData.maintenanceTo).setSeconds(0);

        this.claimData.lapsePdTag = lapseFD != null && lapseTD != null && lossD >= lapseFD && lossD <= lapseTD ? 'Y' : 'N';
        this.claimData.polTermTag = lossD >= inceptD && lossD <= expiryD ? 'Y' : 'N';

        if(lossD >= inceptD && lossD <= effD) {
          this.mdlType = 'warn5';
          // $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
        } else if(lossD < inceptD || lossD > expiryD) {
          this.beforePolTerm = lossD < inceptD;

          this.mdlType = maintFD != null && maintTD != null && lossD >= maintFD && lossD <= maintTD ? 'warn7' : 'warn6';;
          // $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
        }*/

        this.onClickConfYes();
      }
    }, 0);
  }

  onClickConfYes() {
    var pNo = this.claimData.policyNo.split('-');
    pNo[pNo.length-1] = '%';
    this.showCustLoader = true;

    // var inceptD = new Date(this.claimData.inceptDate).setSeconds(0);
    // var effD = new Date(this.claimData.effDate).setSeconds(0);
    var lossD = this.claimData.lossDate.split('T')[1] == '' ? new Date(this.claimData.lossDate + '00:00').setSeconds(0) : new Date(this.claimData.lossDate).setSeconds(0);
    // var dCheck = this.claimData.polTermTag == 'Y' && effD <= lossD ? lossD : lossD >= inceptD && lossD <= effD ? effD : this.claimData.createDate == null || this.claimData.createDate == '' ? new Date() : new Date(this.claimData.createDate);
    var dCheck = lossD;

    var sub$ = this.us.getParListing([ { key: 'policyNo', search: pNo.join('-') }])
                      .pipe(tap(data => { 
                                          data['policyList'].sort((a, b) => a.altNo - b.altNo);
                                          data['filtPolicy'] = data['policyList'].filter(a => new Date(a.effDate).setSeconds(0) <= dCheck && a.statusDesc == 'In Force')
                                                                                 .sort((a, b) => b.altNo - a.altNo);
                                          this.beforePolTerm = data['filtPolicy'].length == 0;
                                          return data;
                                        }),
                            mergeMap(data => this.us.getPolGenInfo(this.beforePolTerm ? data['policyList'][0].policyId : data['filtPolicy'][0].policyId, this.beforePolTerm ? data['policyList'][0].policyNo : data['filtPolicy'][0].policyNo)));

    this.subscription.add(sub$.subscribe(data => {
      this.showCustLoader = false;

      var pol = data['policy'];
      var prj = pol['project'];

      this.claimData.inceptDate = this.ns.toDateTimeString(pol['inceptDate']);
      this.claimData.expiryDate = this.ns.toDateTimeString(pol['expiryDate']);
      this.claimData.effDate = this.ns.toDateTimeString(pol['effDate']);
      this.claimData.lapseFrom = this.ns.toDateTimeString(pol['lapseFrom']);
      this.claimData.lapseTo = this.ns.toDateTimeString(pol['lapseTo']);
      this.claimData.maintenanceFrom = this.ns.toDateTimeString(pol['maintenanceFrom']);
      this.claimData.maintenanceTo = this.ns.toDateTimeString(pol['maintenanceTo']);

      this.claimData['refPolId'] = pol['policyId'];
      this.claimData.policyId = pol['policyId'];
      this.claimData.coRefNo = pol['coRefNo'];
      this.claimData.currencyCd = pol['currencyCd'];
      this.claimData.issueDate = this.ns.toDateTimeString(pol['issueDate']);
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
      this.claimData.project.duration = prj['duration'];
      this.claimData.project.testing = prj['testing'];
      this.claimData.project.timeExc = prj['timeExc'];
      this.claimData.project.ipl = prj['ipl'];
      this.claimData.project.noClaimPd = prj['noClaimPd'];

      var inceptD = new Date(this.claimData.inceptDate).setSeconds(0);
      var expiryD = new Date(this.claimData.expiryDate).setSeconds(0);
      var effD = new Date(this.claimData.effDate).setSeconds(0);
      var lossD = this.claimData.lossDate.split('T')[1] == '' ? new Date(this.claimData.lossDate + '00:00').setSeconds(0) : new Date(this.claimData.lossDate).setSeconds(0);
      var lapseFD = this.claimData.lapseFrom == null || this.claimData.lapseFrom == '' ? null : new Date(this.claimData.lapseFrom).setSeconds(0);
      var lapseTD = this.claimData.lapseTo == null || this.claimData.lapseTo == '' ? null : new Date(this.claimData.lapseTo).setSeconds(0);
      var maintFD = this.claimData.maintenanceFrom == null || this.claimData.maintenanceFrom == '' ? null : new Date(this.claimData.maintenanceFrom).setSeconds(0);
      var maintTD = this.claimData.maintenanceTo == null || this.claimData.maintenanceTo == '' ? null : new Date(this.claimData.maintenanceTo).setSeconds(0);

      this.claimData.lapsePdTag = lapseFD != null && lapseTD != null && lossD >= lapseFD && lossD <= lapseTD ? 'Y' : 'N';
      this.claimData.polTermTag = lossD >= inceptD && lossD <= expiryD ? 'Y' : 'N';

      this.ms.getMtnLossCodeLov('P', 'Basic Period').subscribe(data => {
        if(data['lossCdList'].length > 0) {
          this.claimData.lossPeriod = data['lossCdList'][0].lossCd;  
          this.claimData.lossPdAbbr = data['lossCdList'][0].lossAbbr;
        }
      });

      if(lapseFD != null && lapseTD != null && lossD >= lapseFD && lossD <= lapseTD) {
        this.mdlType = 'warn5';
        $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
      } else if(lossD < inceptD || lossD > expiryD) {
        this.beforePolTerm = lossD < inceptD;

        if(maintFD != null && maintTD != null && lossD >= maintFD && lossD <= maintTD) {
          this.mdlType = 'warn7';
          this.ms.getMtnLossCodeLov('P', 'Maintenance').subscribe(data => {
            if(data['lossCdList'].length > 0) {
              this.claimData.lossPeriod = data['lossCdList'][0].lossCd;  
              this.claimData.lossPdAbbr = data['lossCdList'][0].lossAbbr;
            }
          });
        } else {
          this.mdlType = 'warn6';
        }

        $('#clmGenInfoConfirmationModal #modalBtn').trigger('click');
      }
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
        this.lossCdType = 'C';
        this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == 'C' };
        this.lossCdLOV.checkCode('C', this.claimData.lossAbbr, ev);
      } else if(str === 'lp') {
        this.lossCdType = 'P';
        this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == 'P' };
        this.lossCdLOV.checkCode('P', this.claimData.lossPeriod, ev, true);
      } else if(str === 'eventType') {
        this.clmEventTypeLOV.checkCode(this.claimData.eventTypeDesc, ev);
      } else if(str === 'event') {
        var eventTypeCd = this.claimData.eventTypeCd;

        this.clmEventFilter = function(a) { return a.activeTag == 'Y' && a.eventTypeCd == eventTypeCd };
        var ld = this.claimData.lossDate.split('T');
        var d = ld[0] == '' ? new Date() : ld[1] == '' ? new Date(ld[1]) : new Date(ld.join('T'));
        var filt = function(a) { return a.activeTag == 'Y' && a.eventTypeCd == eventTypeCd && a.lossDateFrom >= d && d <= a.lossDateTo }

        this.clmEventLOV.checkCode(eventTypeCd, this.claimData.eventDesc, ev, d, filt);
      } else if(str === 'mainAdj') {
        this.adjusterLOVMain.checkCode(this.claimData.adjId, ev);
      } else if(str === 'processedBy') {
        this.usersLov.checkCode(this.claimData.processedBy, ev);
      }
    });
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
