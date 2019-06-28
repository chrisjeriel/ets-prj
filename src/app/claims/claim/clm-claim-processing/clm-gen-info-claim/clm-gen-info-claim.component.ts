import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('confirmSave') confirmSave: ConfirmSaveComponent;
  @ViewChild('successDialog') successDialog: SucessDialogComponent;
  @ViewChild('cancelBtn') cancelBtn: CancelButtonComponent;

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

  claimId: number = 2;
  claimNo: string = '';

  policyId: number = 0;
  policyNo: string = '';

  hideUnpaidMsg: boolean = true;
  disableAdjusterBtn: boolean = false;

  constructor(private actRoute: ActivatedRoute, private modalService: NgbModal, private titleService: Title,
    private cs: ClaimsService, private ns: NotesService, private us: UnderwritingService, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | General Info");

    this.sub = this.actRoute.params.subscribe(params => {
      this.line = params['line'];
      if(params['from'] == 'edit') {
        this.claimId = params['claimId'];
        this.claimNo = params['claimNo'];

        this.retrieveClmGenInfo();
      } else if(params['from'] == 'add') {
        this.policyId = params['policyId'];
        this.policyNo = params['policyNo'];

        this.retrievePolDetails();
      }

    });

    
  }

  retrieveClmGenInfo() {
    this.cs.getClmGenInfo(this.claimId, this.claimNo).subscribe(data => {
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
        // this.adjData.tableData = this.claimData.clmAdjusterList.map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
        //                                                                    a.updateDate = this.ns.toDateTimeString(a.updateDate);
        //                                                                    return a; });
        // this.adjTable.refreshTable();
      }
    });
  }

  retrievePolDetails() {
    this.us.getPolGenInfo(this.policyId, this.policyNo).subscribe(data => {
      this.disableAdjusterBtn = true;
      var pol = data['policy'];

      this.claimData.lineCd = pol['lineCd'];
      this.claimData.polYear = pol['polYear'];
      this.claimData.polSeqNo = pol['polSeqNo'];
      this.claimData.cedingId = pol['cedingId'];
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

      this.claimData.prinId = this.claimData.prinId == '' || this.claimData.prinId == null ? '' : String(this.claimData.prinId).padStart(6, '0');
      this.claimData.contractorId = this.claimData.contractorId == '' || this.claimData.contractorId == null ? '' : String(this.claimData.contractorId).padStart(6, '0');
      this.claimData.project.objectId = this.claimData.project.objectId == '' || this.claimData.project.objectId == null ? '' : String(this.claimData.project.objectId).padStart(3, '0');

      this.claimData.clmStatCd = 'IP';
      this.claimData.clmStatus = 'In Progress';
      this.claimData.processedBy = this.ns.getCurrentUser();
    });
  }

  openAdjustersModal() {
    console.log(this.adjData.tableData);
    console.log(this.claimData.clmAdjusterList);
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
    //dirty sa event
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
      if(key === 'createUser') {
        this.claimData['prjCreateUser'] = val;
      } else if(key === 'createDate') {
        this.claimData['prjCreateDate'] = this.ns.toDateTimeString(val);
      } else if(key === 'updateUser') {
        this.claimData['prjUpdateUser'] = val;
      } else if(key === 'updateDate') {
        this.claimData['prjUpdateDate'] = this.ns.toDateTimeString(val);
      } else {
        this.claimData[key] = val;
      }
    }

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
        this.retrieveClmGenInfo();
      }
    });
  }

  dc(ev, data, type) {
    return this.ns.dateConstructor(ev, data, type);
  }

}
