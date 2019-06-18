import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ClaimsService, NotesService } from '@app/_services';


@Component({
  selector: 'app-clm-gen-info-claim',
  templateUrl: './clm-gen-info-claim.component.html',
  styleUrls: ['./clm-gen-info-claim.component.css']
})
export class ClmGenInfoClaimComponent implements OnInit {

  line: string;
  coClaimNo;
  lineClass;
  coRefNo;
  adjRefNo
  private sub: any;

  tableData: any[] = [
    ["001", "AArema Adjusters and Surveyors, Inc.", "PMMSC-MLP-2018-025"],
    ["002", "TLP Adj", "ADJ2 REF 001"],
    ["003", "ACD Co. Inc.", "ADJ3 REF 001"],
  ];

  tHeader: string[] = [];
  dataTypes: string[] = [];
  dataTypes2: string[] = [];
  magnifyingGlass;
  addFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  pageLength = 10;

  passData: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    magnifyingGlass: ['0'],
    widths: [],
    nData: [null, null, null]
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

  constructor(private router: ActivatedRoute, private modalService: NgbModal, private titleService: Title, private cs: ClaimsService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | General Info");
    this.retrieveClmGenInfo();

    this.sub = this.router.params.subscribe(params => {
      this.line = params['line'];
      // temporary data
      this.lineClass = this.line + " Wet Risk";
      this.coClaimNo = this.line + "-HO-2018-00015666";
      this.coRefNo = "EN-" + this.line + "-HO-2018-006792-01";
      this.adjRefNo = "PMMSC-" + this.line + "-2018-025 / ADJ2 REF 001 / ADJ3 REF 001";
      console.log(this.line);
      //end of temporary data
    });
    
    this.passData.tHeader.push("Adjuster No", "Adjuster Name", "Adjuster Reference No");
    this.passData.dataTypes.push("number", "text", "text");
    this.passData.widths.push("1", "auto", "auto");
    this.passData.tableData = this.tableData;
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
      }
    });
  }

  openAdjustersModal() {
    $('#adjustersModal #modalBtn').trigger('click');
  }

  dc(ev, data, type) {
    return this.ns.dateConstructor(ev, data, type);
  }
}
