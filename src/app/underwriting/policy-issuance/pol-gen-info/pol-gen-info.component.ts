import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-pol-gen-info',
  templateUrl: './pol-gen-info.component.html',
  styleUrls: ['./pol-gen-info.component.css']
})
export class PolGenInfoComponent implements OnInit, OnDestroy {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  tableData: any;
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];

  @Input() mode;
  @Input() alteration: boolean = false;

  policyInfo:any = {
    policyId: null,
    policyNo: null,
    lineCd: null,
    lineCdDesc: null,
    polYear: null,
    polSeqNo: null,
    cedingId: null,
    cedingName: null,
    coSeriesNo: null,
    altNo: null,
    cessionId: null,
    cessionDesc: null,
    lineClassCd: null,
    lineClassDesc: null,
    quoteId: null,
    quotationNo: null,
    holdCoverNo: null,
    status: null,
    statusDesc: null,
    coRefNo: null,
    reinsurerId: null,
    reinsurerName: null,
    riBinderNo: null,
    mbiRefNo: null,
    policyIdOc: null,
    openPolicyNo: null,
    refOpenPolNo: null,
    intmId: null,
    intmName: null,
    principalId: null,
    principalName: null,
    contractorId: null,
    contractorName: null,
    insuredDesc: null,
    inceptDate: null,
    expiryDate: null,
    lapseFrom: null,
    lapseTo: null,
    maintenanceFrom: null,
    maintenanceTo: null,
    issueDate: null,
    effDate: null,
    distDate: null,
    acctDate: null,
    currencyCd: null,
    currencyRt: null,
    bookedTag: null,
    govtTag: null,
    openCoverTag: null,
    holdCoverTag: null,
    declarationTag: null,
    minDepTag: null,
    altTag: null,
    specialPolicyTag: null,
    instTag: null,
    extensionTag: null,
    excludeDistTag: null,
    wordings: null,
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
      totalSi: null,
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
    alop: {
      insId: null,
      insuredName: null,
      insuredDesc: null,
      address: null,
      insBusiness: null,
      annSi: null,
      maxIndemPdSi: null,
      issueDate: null,
      expiryDate: null,
      maxIndemPd: null,
      indemFromDate: null,
      timeExc: null,
      repInterval: null,
      createUser: null,
      createDate: null,
      updateUser: null,
      updateDate: null
    }
  };
  line: string;
  private sub: any;
  hcChecked: boolean = false;
  ocChecked: boolean = false;
  decChecked: boolean = false;
  typeOfCession: string = "";
  policyId: string;
  policyNo: string;
  dialogIcon: string = "";
  dialogMessage: string = "";
  loading: boolean = false;
  cancelFlag: boolean;

  @Output() emitPolicyInfoId = new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private modalService: NgbModal,
    private underwritingService: UnderwritingService, private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | General Info");
    this.tHeader.push("Item No", "Description of Items");
    this.dataTypes.push("text", "text");
    this.filters.push("Item No", "Desc. of Items");
    this.tableData = this.underwritingService.getItemInfoData();

    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
      this.policyId = params['policyId'];
      this.policyNo = params['policyNo'];
    });

    this.getPolGenInfo();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showItemInfoModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  toggleRadioBtnSet() {
    $('#radioBtnSet').css('backgroundColor', (this.policyInfo.declarationTag === 'Y') ? '#ffffff' : '#f5f5f5');
  }

  getPolGenInfo() {
    this.underwritingService.getPolGenInfo(this.policyId, this.policyNo).subscribe((data:any) => {
      if(data.policy != null) {
        this.policyInfo = data.policy;
        this.policyInfo.inceptDate = this.ns.toDateTimeString(this.policyInfo.inceptDate);
        this.policyInfo.expiryDate = this.ns.toDateTimeString(this.policyInfo.expiryDate);
        this.policyInfo.lapseFrom = this.policyInfo.lapseFrom == null ? '' : this.ns.toDateTimeString(this.policyInfo.lapseFrom);
        this.policyInfo.lapseTo = this.policyInfo.lapseTo == null ? '' : this.ns.toDateTimeString(this.policyInfo.lapseTo);
        this.policyInfo.maintenanceFrom = this.policyInfo.maintenanceFrom == null ? '' : this.ns.toDateTimeString(this.policyInfo.maintenanceFrom);
        this.policyInfo.maintenanceTo = this.policyInfo.maintenanceTo == null ? '' : this.ns.toDateTimeString(this.policyInfo.maintenanceTo);
        this.policyInfo.issueDate = this.ns.toDateTimeString(this.policyInfo.issueDate);
        this.policyInfo.effDate = this.ns.toDateTimeString(this.policyInfo.effDate);
        this.policyInfo.distDate = this.ns.toDateTimeString(this.policyInfo.distDate);
        this.policyInfo.acctDate = this.ns.toDateTimeString(this.policyInfo.acctDate);
        this.policyInfo.createDate = this.ns.toDateTimeString(this.policyInfo.createDate);
        this.policyInfo.updateDate = this.ns.toDateTimeString(this.policyInfo.updateDate);
        this.policyInfo.project.createDate = this.ns.toDateTimeString(this.policyInfo.project.createDate);
        this.policyInfo.project.updateDate = this.ns.toDateTimeString(this.policyInfo.project.updateDate);
        this.checkPolIdF(this.policyInfo.policyId);
        this.toggleRadioBtnSet();

        setTimeout(() => {
          $('input[appCurrencyRate]').focus();
          $('input[appCurrencyRate]').blur();
        },0) 
      }
    });
  }

  checkPolIdF(event){
      this.emitPolicyInfoId.emit({
        policyId: event,
        policyNo: this.policyInfo.policyNo,
        riskName: this.policyInfo.project.riskName,
        insuredDesc: this.policyInfo.insuredDesc,
        riskId: this.policyInfo.project.riskId
      });    
    }

  updateExpiryDate() {
    var d = new Date(this.policyInfo.inceptDate);
    d.setFullYear(d.getFullYear() + 1);

    this.policyInfo.expiryDate = this.ns.toDateTimeString(d);
  }

  prepareParam(cancelFlag?) {
    this.cancelFlag = cancelFlag !== undefined;

    var savePolGenInfoParam = {
      "acctDate"        : this.policyInfo.acctDate,
      "altNo"           : this.policyInfo.altNo,
      "altTag"          : this.policyInfo.altTag,
      "bookedTag"       : this.policyInfo.bookedTag,
      "cedingId"        : this.policyInfo.cedingId,
      "cessionId"       : this.policyInfo.cessionId,
      "coRefNo"         : this.policyInfo.coRefNo,
      "coSeriesNo"      : this.policyInfo.coSeriesNo,
      "contractorId"    : this.policyInfo.contractorId,
      "createDate"      : this.policyInfo.createDate,
      "createUser"      : this.policyInfo.createUser,
      "currencyCd"      : this.policyInfo.currencyCd,
      "currencyRt"      : this.policyInfo.currencyRt,
      "declarationTag"  : this.policyInfo.declarationTag,
      "distDate"        : this.policyInfo.distDate,
      "duration"        : this.policyInfo.project.duration,
      "effDate"         : this.policyInfo.effDate,
      "excludeDistTag"  : this.policyInfo.excludeDistTag,
      "expiryDate"      : this.policyInfo.expiryDate,
      "extensionTag"    : this.policyInfo.extensionTag,
      "govtTag"         : this.policyInfo.govtTag,
      "holdCoverTag"    : this.policyInfo.holdCoverTag,
      "inceptDate"      : this.policyInfo.inceptDate,
      "instTag"         : this.policyInfo.instTag,
      "insuredDesc"     : this.policyInfo.insuredDesc,
      "intmId"          : this.policyInfo.intmId,
      "ipl"             : this.policyInfo.project.ipl,
      "issueDate"       : this.policyInfo.issueDate,
      "lapseFrom"       : this.policyInfo.lapseFrom,
      "lapseTo"         : this.policyInfo.lapseTo,
      "lineCd"          : this.policyInfo.lineCd,
      "lineClassCd"     : this.policyInfo.lineClassCd,
      "maintenanceFrom" : this.policyInfo.maintenanceFrom,
      "maintenanceTo"   : this.policyInfo.maintenanceTo,
      "mbiRefNo"        : this.policyInfo.mbiRefNo,
      "minDepTag"       : this.policyInfo.minDepTag,
      "noClaimPd"       : this.policyInfo.project.noClaimPd,
      "objectId"        : this.policyInfo.project.objectId,
      "openCoverTag"    : this.policyInfo.openCoverTag,
      "polSeqNo"        : this.policyInfo.polSeqNo,
      "polYear"         : this.policyInfo.polYear,
      "policyId"        : this.policyInfo.policyId,
      "policyIdOc"      : this.policyInfo.policyIdOc,
      "principalId"     : this.policyInfo.principalId,
      "prjCreateDate"   : this.policyInfo.project.createDate,
      "prjCreateUser"   : this.policyInfo.project.createUser,
      "prjUpdateDate"   : this.ns.toDateTimeString(0),
      "prjUpdateUser"   : JSON.parse(window.localStorage.currentUser).username,
      "projDesc"        : this.policyInfo.project.projDesc,
      "projId"          : this.policyInfo.project.projId,
      "quoteId"         : this.policyInfo.quoteId,
      "refOpenPolNo"    : this.policyInfo.refOpenPolNo,
      "reinsurerId"     : this.policyInfo.reinsurerId,
      "riBinderNo"      : this.policyInfo.riBinderNo,
      "riskId"          : this.policyInfo.project.riskId,
      "site"            : this.policyInfo.project.site,
      "specialPolicyTag": this.policyInfo.specialPolicyTag,
      "status"          : this.policyInfo.status,
      "testing"         : this.policyInfo.project.testing,
      "timeExc"         : this.policyInfo.project.timeExc,
      "totalSi"         : this.policyInfo.project.totalSi,
      "updateDate"      : this.ns.toDateTimeString(0),
      "updateUser"      : JSON.parse(window.localStorage.currentUser).username,
      "wordings"        : this.policyInfo.wordings
    }

    console.log(savePolGenInfoParam);
    //ADD VALIDATION
    this.loading = true;
    this.underwritingService.savePolGenInfo(savePolGenInfoParam).subscribe(data => {
      console.log(data);
      this.loading = false;

      if(data['returnCode'] === 0) {
          this.dialogIcon = 'error';
          this.dialogMessage = data['errorList'][0].errorMessage;

          $('#polGenInfo #successModalBtn').trigger('click');
        } else if (data['returnCode'] === -1) {               
          this.policyInfo.updateUser = JSON.parse(window.localStorage.currentUser).username;
          this.policyInfo.updateDate  = this.ns.toDateTimeString(0);

          $('#polGenInfo #successModalBtn').trigger('click');
        }
    });
  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }
}