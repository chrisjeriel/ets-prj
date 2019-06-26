import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ClaimsService, NotesService } from '@app/_services';
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

@Component({
  selector: 'app-clm-gen-info-claim',
  templateUrl: './clm-gen-info-claim.component.html',
  styleUrls: ['./clm-gen-info-claim.component.css']
})
export class ClmGenInfoClaimComponent implements OnInit {
  @ViewChild('adjTblGI') adjTable: CustEditableNonDatatableComponent;
  @ViewChild('lossCdLOV') lossCdLOV: MtnLossCdComponent;
  @ViewChild('clmEventLOV') clmEventLOV: MtnClmEventComponent;
  @ViewChild('clmEventTypeLOV') clmEventTypeLOV: MtnClmEventComponent;
  @ViewChild('adjusterLOV') adjusterLOV: MtnAdjusterComponent;
  @ViewChild('adjConfirmSave') adjConfirmSave: ConfirmSaveComponent;
  @ViewChild('adjSuccessDialog') adjSuccessDialog: SucessDialogComponent;
  @ViewChild('adjCancelBtn') adjCancelBtn: CancelButtonComponent;

  line: string;
  sub: any;

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
  container: any;

  constructor(private actRoute: ActivatedRoute, private modalService: NgbModal, private titleService: Title,
    private cs: ClaimsService, private ns: NotesService, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | General Info");
    this.retrieveClmGenInfo();

    this.sub = this.actRoute.params.subscribe(params => {
      this.line = params['line'];
    });
  }

  retrieveClmGenInfo() {
    this.cs.getClmGenInfo(2,'').subscribe(data => {
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

      if(this.claimData.clmAdjusterList.length > 0) {
        this.adjNameAndRefs();
        this.adjData.tableData = this.claimData.clmAdjusterList.map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
                                                                           a.updateDate = this.ns.toDateTimeString(a.updateDate);
                                                                           return a; });
        this.adjTable.refreshTable();
      }
    });
  }

  openAdjustersModal() {
    /*setTimeout(() => {
      this.container = $('.ng-dirty');
      this.container.removeClass('ng-dirty');
    }, 0);*/

    this.adjTable.refreshTable();
    this.adjTable.onRowClick(null, this.adjData.tableData[0]);
    $('#adjustersModal #modalBtn').trigger('click');
  }

  adjCancelConfirmNo() {
    this.adjData.tableData.forEach(a => {
      a.edited = false;
      a.deleted = false;
    });
  }

  showLossCdLOV(type) {
    this.lossCdType = type;
    this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == type };

    this.lossCdLOV.modal.openNoClose();
  }

  setLossCd(ev) {
    if(this.lossCdType == 'C') {
      this.claimData.lossCd = ev.lossCd;
      this.claimData.lossAbbr = ev.lossAbbr;
    } else if(this.lossCdType == 'P') {
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

        this.adjData.tableData.forEach(a => {
          if(a.edited && !a.deleted) {
            a.edited = false;
          }
        });
      } else {
        this.dialogIcon = "error";
        this.adjSuccessDialog.open();
      }
    });
  }

  dc(ev, data, type) {
    return this.ns.dateConstructor(ev, data, type);
  }

}
