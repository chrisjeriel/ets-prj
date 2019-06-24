import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ClaimsService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { MtnLossCdComponent } from '@app/maintenance/mtn-loss-cd/mtn-loss-cd.component';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';

@Component({
  selector: 'app-clm-gen-info-claim',
  templateUrl: './clm-gen-info-claim.component.html',
  styleUrls: ['./clm-gen-info-claim.component.css']
})
export class ClmGenInfoClaimComponent implements OnInit {
  @ViewChild('adjTblGI') adjTable: CustEditableNonDatatableComponent;
  @ViewChild('lossCdLOV') lossCdLOV: MtnLossCdComponent;

  line: string;
  sub: any;

  adjData: any = {
    tableData: [],
    tHeader: ['Adjuster No','Adjuster Name','Adjuster Reference No'],
    keys: ['adjId','adjName','adjRefNo'],
    dataTypes: ['lovInput-r','text','text'],
    uneditable: [false,true,true],
    addFlag: true,
    deleteFlag: true,
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
    }
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
    lossDesc: null,
    lossPeriod: null,
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
  lossCdType: any = null;

  constructor(private router: ActivatedRoute, private modalService: NgbModal, private titleService: Title, private cs: ClaimsService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | General Info");
    this.retrieveClmGenInfo();

    this.sub = this.router.params.subscribe(params => {
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

      this.claimData.prinId = this.claimData.prinId == '' || this.claimData.prinId == null ? '' : String(this.claimData.prinId).padStart(6, '0');
      this.claimData.contractorId = this.claimData.contractorId == '' || this.claimData.contractorId == null ? '' : String(this.claimData.contractorId).padStart(6, '0');
      this.claimData.project.objectId = this.claimData.project.objectId == '' || this.claimData.project.objectId == null ? '' : String(this.claimData.project.objectId).padStart(3, '0');

      if(this.claimData.clmAdjusterList.length > 0) {
        this.claimData.adjNames = this.claimData.clmAdjusterList.map(a => a.adjName).join(' / ');
        //add adjuster refs
        this.adjData.tableData = this.claimData.clmAdjusterList.map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
                                                                           a.updateDate = this.ns.toDateTimeString(a.updateDate);
                                                                           return a; });
        this.adjTable.refreshTable();
      }
    });
  }

  openAdjustersModal() {
    $('#adjustersModal #modalBtn').trigger('click');
  }

  showLossCdLOV(type) {
    this.lossCdType = type;
    this.lossCdFilter = function(a) { return a.activeTag == 'Y' && a.lossCdType == type };

    this.lossCdLOV.modal.openNoClose();
  }

  setLossCd(ev) {
    if(this.lossCdType == 'C') {
      this.claimData.lossCd = ev.lossCd;
      this.claimData.lossDesc = ev.lossAbbr;
    } else if(this.lossCdType == 'P') {
      this.claimData.lossPeriod = ev.lossAbbr;
    }
  }

  showUsersLOV() {
    $('#usersLOV #modalBtn').trigger('click');
  }

  setProcessedBy(ev) {
    this.claimData.processedBy = ev.userId;
  }

  dc(ev, data, type) {
    return this.ns.dateConstructor(ev, data, type);
  }

}
