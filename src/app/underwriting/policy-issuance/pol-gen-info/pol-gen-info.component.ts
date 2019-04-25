import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService, MaintenanceService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { MtnObjectComponent } from '@app/maintenance/mtn-object/mtn-object.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { MtnCedingCompanyComponent } from '@app/maintenance/mtn-ceding-company/mtn-ceding-company.component';
import { MtnInsuredComponent } from '@app/maintenance/mtn-insured/mtn-insured.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnIntermediaryComponent } from '@app/maintenance/mtn-intermediary/mtn-intermediary.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';

@Component({
  selector: 'app-pol-gen-info',
  templateUrl: './pol-gen-info.component.html',
  styleUrls: ['./pol-gen-info.component.css']
})
export class PolGenInfoComponent implements OnInit, OnDestroy {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  //add by paul for deductibles
  @ViewChild('deductiblesTable') deductiblesTable :CustEditableNonDatatableComponent;
  @ViewChild('deductiblesModal') deductiblesModal :ModalComponent;
  @ViewChild('dedSuccess') successDlg: SucessDialogComponent;
  @ViewChild(MtnObjectComponent) objectLov: MtnObjectComponent;
  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChildren(MtnInsuredComponent) insuredLovs: QueryList<MtnInsuredComponent>;
  @ViewChild(MtnCedingCompanyComponent) cedingCoNotMemberLov: CedingCompanyComponent;
  @ViewChild(MtnCurrencyComponent) currencyLov: MtnCurrencyComponent;
  @ViewChild(MtnIntermediaryComponent) intermediaryLov: MtnIntermediaryComponent;
  @ViewChild(MtnUsersComponent) usersLov: MtnUsersComponent;
  @ViewChild('dedLov') lov :LovComponent;
  @ViewChild('riskLOV') riskLOV: MtnRiskComponent;
  lovCheckBox:boolean;
  passLOVData:any = {
    selector: '',

  }
  dialogMsg:string;

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
    optionId: null,
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
    coinsGrpId: null,
    wordings: null,
    createUser: null,
    createDate: null,
    updateUser: null,
    updateDate: null,
    showPolAlop: false,
    coInsuranceFlag: false,
    polWordings:{},
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

  passDataDeductibles: any = {
    tHeader: ["Deductible Code","Deductible Title", "Deductible Text", "Rate(%)", "Amount"],
    dataTypes: ["text","text","text", "percent", "currency"],
    pageLength:10,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    checkFlag: true,
    infoFlag: true,
    paginateFlag: true,
    widths: [1, 1, 1, 1, 1, 1],
    magnifyingGlass: ['deductibleCd'],
    keys:['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'],
    tableData:[],
    pageID:'deductibles',
    nData: {
      "coverCd": 0,
      "createDate": this.ns.toDateTimeString(0),
      "createUser": JSON.parse(window.localStorage.currentUser).username,
      "deductibleAmt": 0,
      "deductibleCd": null,
      "deductibleRt": 0,
      "deductibleTxt": '',
      "endtCd": "0",
      "updateDate": this.ns.toDateTimeString(0),
      "updateUser":JSON.parse(window.localStorage.currentUser).username,
      showMG : 1
    },
    uneditable: [true,true,false,false,false]
  };

  line: string;
  private sub: any;
  hcChecked: boolean = false;
  ocChecked: boolean = false;
  decChecked: boolean = false;
  typeOfCession: string = "";
  policyId: string;
  policyNo: string;
  prevPolicyId: string;
  dialogIcon: string = "";
  dialogMessage: string = "";
  loading: boolean = false;
  cancelFlag: boolean;
  saveBtnClicked: boolean = false;
  prevInceptDate: string;
  prevEffDate: string;
  refPolicyId: string = '';
  newAlt: boolean = false;
  fromInq:any = false;
  showPolicyNo: string;
  lineClasses: any[] = [];

  @Output() emitPolicyInfoId = new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private modalService: NgbModal,
    private underwritingService: UnderwritingService, private titleService: Title, private ns: NotesService,
    private mtnService: MaintenanceService) { }

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
      this.prevPolicyId = params['prevPolicyId'];

      if(params['alteration'] != undefined) {
        this.alteration = params['alteration'];
        this.newAlt = params['alteration'];
      }

      //edit by paul
      this.fromInq = params['fromInq']=='true';

      if(this.fromInq){
        this.passDataDeductibles.addFlag = false;
        this.passDataDeductibles.deleteFlag= false;
        this.passDataDeductibles.checkFlag = false;
        this.passDataDeductibles.uneditable = [true,true,true,true,true,true]
      }
      this.showPolicyNo = params['showPolicyNo'];
      this.getLineClass();
    });

    this.getPolGenInfo();
    if(this.newAlt) {
      setTimeout(() => { $('.req').addClass('ng-dirty') }, 0);
    } else {
      setTimeout(() => { $('.ng-dirty').removeClass('ng-dirty') }, 1000);  
    }        
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
        this.policyInfo.policyNo = this.showPolicyNo == undefined ? this.policyInfo.policyNo : this.showPolicyNo; // edit by paul for summarized policy info
        this.policyInfo.inceptDate = this.ns.toDateTimeString(this.setSec(this.policyInfo.inceptDate));
        this.policyInfo.expiryDate = this.ns.toDateTimeString(this.setSec(this.policyInfo.expiryDate));
        this.policyInfo.lapseFrom = this.policyInfo.lapseFrom == null ? '' : this.ns.toDateTimeString(this.setSec(this.policyInfo.lapseFrom));
        this.policyInfo.lapseTo = this.policyInfo.lapseTo == null ? '' : this.ns.toDateTimeString(this.setSec(this.policyInfo.lapseTo));
        this.policyInfo.maintenanceFrom = this.policyInfo.maintenanceFrom == null ? '' : this.ns.toDateTimeString(this.setSec(this.policyInfo.maintenanceFrom));
        this.policyInfo.maintenanceTo = this.policyInfo.maintenanceTo == null ? '' : this.ns.toDateTimeString(this.setSec(this.policyInfo.maintenanceTo));
        this.policyInfo.issueDate = this.ns.toDateTimeString(this.setSec(this.policyInfo.issueDate));
        this.policyInfo.effDate = this.ns.toDateTimeString(this.setSec(this.policyInfo.effDate));
        this.policyInfo.distDate = this.ns.toDateTimeString(this.setSec(this.policyInfo.distDate));
        this.policyInfo.acctDate = this.ns.toDateTimeString(this.setSec(this.policyInfo.acctDate));
        this.policyInfo.createDate = this.ns.toDateTimeString(this.policyInfo.createDate);
        this.policyInfo.updateDate = this.ns.toDateTimeString(this.policyInfo.updateDate);
        this.policyInfo.project.createDate = this.ns.toDateTimeString(this.policyInfo.project.createDate);
        this.policyInfo.project.updateDate = this.ns.toDateTimeString(this.policyInfo.project.updateDate);
        //edit by paul
        this.policyInfo.principalId = String(this.policyInfo.principalId).padStart(6,'0')
        this.policyInfo.contractorId = String(this.policyInfo.contractorId).padStart(6,'0')
        if(this.policyInfo.polWordings !== null){
          this.policyInfo.polWordings.text = "";
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText01 == null? '' : this.policyInfo.polWordings.polwText01;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText02 == null? '' : this.policyInfo.polWordings.polwText02;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText03 == null? '' : this.policyInfo.polWordings.polwText03;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText04 == null? '' : this.policyInfo.polWordings.polwText04;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText05 == null? '' : this.policyInfo.polWordings.polwText05;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText06 == null? '' : this.policyInfo.polWordings.polwText06;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText07 == null? '' : this.policyInfo.polWordings.polwText07;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText08 == null? '' : this.policyInfo.polWordings.polwText08;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText09 == null? '' : this.policyInfo.polWordings.polwText09;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText10 == null? '' : this.policyInfo.polWordings.polwText10;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText11 == null? '' : this.policyInfo.polWordings.polwText11;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText12 == null? '' : this.policyInfo.polWordings.polwText12;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText13 == null? '' : this.policyInfo.polWordings.polwText13;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText14 == null? '' : this.policyInfo.polWordings.polwText14;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText15 == null? '' : this.policyInfo.polWordings.polwText15;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText16 == null? '' : this.policyInfo.polWordings.polwText16;
          this.policyInfo.polWordings.text += this.policyInfo.polWordings.polwText17 == null? '' : this.policyInfo.polWordings.polwText17;
        }else{
          this.policyInfo.polWordings = {
            text: ''
          };
        }
        this.checkPolIdF(this.policyInfo.policyId);
        this.toggleRadioBtnSet();

        if(this.alteration) {
          if (this.prevPolicyId !== "undefined") {
            this.underwritingService.getPolGenInfo(this.prevPolicyId, null).subscribe((data:any) => {
              this.prevInceptDate = this.ns.toDateTimeString(this.setSec(data.policy.inceptDate));
              this.prevEffDate = this.ns.toDateTimeString(this.setSec(data.policy.expiryDate));
            });
          }
        }

        setTimeout(() => {  
          $('input[appCurrencyRate]').focus();
          $('input[appCurrencyRate]').blur();
          if(this.fromInq){
            $('input').attr('readonly','readonly');
            $('input[type="checkbox"]').attr('disabled','disabled');
            $('textarea').attr('readonly','readonly');
            $('select').attr('readonly','readonly');
          }
        },0) 
      }

      if(this.newAlt) {
        this.refPolicyId = this.policyInfo.policyId;
        this.policyInfo.policyNo = "";
        this.policyInfo.policyId = "";
      }
    });

  }

  showLineClassLOV(){
    $('#lineClassLOV #modalBtn').trigger('click');
    $('#lineClassLOV #modalBtn').addClass('ng-dirty')
  }

  setLineClass(data){
    this.policyInfo.lineClassCd = data.lineClassCd;
    this.policyInfo.lineClassDesc = data.lineClassCdDesc;
    this.focusBlur();
  }

  showRiskLOV(){
    $('#riskLOV #modalBtn').trigger('click');
    $('#riskLOV #modalBtn').addClass('ng-dirty')
  }

  setRisk(data){
    this.policyInfo.project.riskId = data.riskId;
    this.policyInfo.project.riskName = data.riskName;
    this.ns.lovLoader(data.ev, 0);
    this.focusBlur();
  }

  showOpeningWordingLov(){
    $('#wordingOpeningIdLov #modalBtn').trigger('click');
    $('#wordingOpeningIdLov #modalBtn').addClass('ng-dirty');
  }

  setOpeningWording(data) {
      this.policyInfo.wordings = data.wording;
      this.focusBlur();
  }

  checkCode(ev, field) {
    this.ns.lovLoader(ev, 1);
      $(ev.target).addClass('ng-dirty');

      if(field === 'cedingCo') {
        this.policyInfo.cedingId = this.pad(this.policyInfo.cedingId);              

        this.cedingCoLov.checkCode(this.policyInfo.cedingId, ev);
      } else if(field === 'cedingCoNotMember') {
        this.policyInfo.reinsurerId = this.pad(this.policyInfo.reinsurerId);

        this.cedingCoNotMemberLov.checkCode(this.policyInfo.reinsurerId, ev);
      } else if(field === 'intermediary') {
        this.intermediaryLov.checkCode(this.policyInfo.intmId, ev);
      } else if(field === 'principal') {
        this.insuredLovs['first'].checkCode(this.policyInfo.principalId, '#principalLOV', ev);
      } else if(field === 'contractor') {
        this.insuredLovs['last'].checkCode(this.policyInfo.contractorId, '#contractorLOV', ev);
      } else if(field === 'object') {
        this.objectLov.checkCode(this.line, this.policyInfo.project.objectId, ev);
      } else if(field === 'currency') {
        this.currencyLov.checkCode(this.policyInfo.currencyCd, ev);
      } else if(field === 'preparedBy') {
        this.usersLov.checkCode(this.policyInfo.preparedBy, ev);
      } else if(field === 'risk') {
        this.riskLOV.checkCode(this.policyInfo.project.riskId, '#riskLOV', ev);
      }
  }

  pad(str) {
    if(str === '' || str == null){
      return '';
    }
    
    return String(str).padStart(3, '0');
  }

  focusBlur() {
      if(this.saveBtnClicked){
        setTimeout(()=>{
          $('.req').focus();
        $('.req').blur();
        },0)  
      }
  }

  showPrincipalLOV() {
    $('#principalLOV #modalBtn').trigger('click');
    $('#principalLOV #modalBtn').addClass('ng-dirty');
  }

  showContractorLOV(){
    $('#contractorLOV #modalBtn').trigger('click');
    $('#contractorLOV #modalBtn').addClass('ng-dirty');
  }

  showObjectLOV() {
    $('#objIdLov #modalBtn').trigger('click');
    $('#objIdLov #modalBtn').addClass('ng-dirty');
  }

  setPrincipal(data){
    this.policyInfo.principalName = data.insuredName;
    this.policyInfo.principalId = data.insuredId;
    this.ns.lovLoader(data.ev, 0);

    this.updateInsuredDesc();
    this.focusBlur();
  }

  setObj(data){
      this.policyInfo.project.objectId = data.objectId;
      this.policyInfo.project.objectDesc = data.description;
      this.ns.lovLoader(data.ev, 0);

      this.focusBlur();
   }

  setContractor(data){
    this.policyInfo.contractorName = data.insuredName;
    this.policyInfo.contractorId = data.insuredId;
    this.ns.lovLoader(data.ev, 0);

    this.updateInsuredDesc();
    this.focusBlur();
    
  }

  updateInsuredDesc() {
      if(this.line == 'CAR' || this.line == 'EAR'){
        if(this.policyInfo.principalName != '' && this.policyInfo.contractorName != ''){
          this.policyInfo.insuredDesc = this.policyInfo.principalName.trim() + ' / ' + this.policyInfo.contractorName.trim();
        }
      } else {
        this.policyInfo.insuredDesc = this.policyInfo.principalName.trim();
      }
    }

  checkPolIdF(event){
    this.underwritingService.getUWCoverageInfos(null, this.policyId).subscribe((data:any)=>{
      if(data.policy !== null){
        let alopFlag = false;
        if(data.policy.project !== null){
          for(let sectionCover of data.policy.project.coverage.sectionCovers){
                if(sectionCover.section == 'III'){
                    alopFlag = true;
                   break;
                 }
          }
        }
            
               this.policyInfo.showPolAlop = alopFlag;
      }


    /*  this.emitPolicyInfoId.emit({
        policyId: event,
        policyNo: this.policyInfo.policyNo,
        riskName: this.policyInfo.project.riskName,
        insuredDesc: this.policyInfo.insuredDesc,
        riskId: this.policyInfo.project.riskId,
        showPolAlop: this.policyInfo.showPolAlop,
        principalId: this.policyInfo.principalId
      });  */  

      this.underwritingService.getPolCoInsurance(this.policyInfo.policyId, '') .subscribe((data: any) => {
           this.policyInfo.coInsuranceFlag = (data.policy.length > 0)? true : false;

           this.emitPolicyInfoId.emit({
            policyId: event,
            policyNo: this.policyInfo.policyNo,
            riskName: this.policyInfo.project.riskName,
            insuredDesc: this.policyInfo.insuredDesc,
            riskId: this.policyInfo.project.riskId,
            showPolAlop: this.policyInfo.showPolAlop,
            coInsuranceFlag: this.policyInfo.coInsuranceFlag,
            principalId: this.policyInfo.principalId
          }); 
      });   

    });
  }

  updateExpiryDate() {
    var d = new Date(this.policyInfo.inceptDate);
    d.setFullYear(d.getFullYear() + 1);

    this.policyInfo.expiryDate = this.ns.toDateTimeString(d);
  }

  prepareParam(cancelFlag?) {
    this.cancelFlag = cancelFlag !== undefined;
    this.saveBtnClicked = true;

    var savePolGenInfoParam = {
      "savingType"      : this.alteration ? 'alteration' : 'normal',
      "refPolicyId"     : this.refPolicyId,
      "acctDate"        : this.policyInfo.acctDate,
      "altNo"           : this.policyInfo.altNo,
      "altTag"          : this.newAlt ? 'Y' : this.policyInfo.altTag,
      "bookedTag"       : this.policyInfo.bookedTag,
      "cedingId"        : this.policyInfo.cedingId,
      "cessionId"       : this.policyInfo.cessionId,
      "coinsGrpId"      : this.policyInfo.coinsGrpId,
      "coRefNo"         : this.policyInfo.coRefNo,
      "coSeriesNo"      : this.policyInfo.coSeriesNo,
      "contractorId"    : this.policyInfo.contractorId,
      "createDate"      : this.newAlt ? this.ns.toDateTimeString(0) : this.policyInfo.createDate,
      "createUser"      : this.newAlt ? this.ns.getCurrentUser() : this.policyInfo.createUser,
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
      "optionId"        : this.policyInfo.optionId,
      "polSeqNo"        : this.policyInfo.polSeqNo,
      "polYear"         : this.policyInfo.polYear,
      "policyId"        : this.policyInfo.policyId,
      "policyIdOc"      : this.policyInfo.policyIdOc,
      "principalId"     : this.policyInfo.principalId,
      "prjCreateDate"   : this.newAlt ? this.ns.toDateTimeString(0) : this.policyInfo.createDate,
      "prjCreateUser"   : this.newAlt ? this.ns.getCurrentUser() : this.policyInfo.createUser,
      "prjUpdateDate"   : this.ns.toDateTimeString(0),
      "prjUpdateUser"   : this.ns.getCurrentUser(),
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
      "updateUser"      : this.ns.getCurrentUser(),
      "wordings"        : this.policyInfo.wordings.trim()
    }

    //ADD VALIDATION
   this.loading = true;
   if(this.validate(savePolGenInfoParam)){
     this.underwritingService.savePolGenInfo(savePolGenInfoParam).subscribe((data: any) => {
       if(data.returnCode === 0){
         this.dialogMessage="The system has encountered an unspecified error.";
         this.dialogIcon = "error";
         $('#polGenInfo > #successModalBtn').trigger('click');
       }else{
         // this.policyInfo.policyId = data['policyId'];
         // this.policyInfo.policyNo = data['policyNo'];
         // this.policyInfo.altNo = data['policyNo'].split('-')[5];

         this.policyId = data['policyId'];
         this.policyNo = data['policyNo'];
         this.newAlt = false;
         this.getPolGenInfo();

         this.dialogMessage="";
         this.dialogIcon = "";
         $('#polGenInfo > #successModalBtn').trigger('click');        
         /*this.form.control.markAsPristine();*/
       }
     });
   }else{
     this.dialogMessage="Please check field values.";
     this.dialogIcon = "error";
     $('#polGenInfo > #successModalBtn').trigger('click');

     setTimeout(()=>{$('.globalLoading').css('display','none');},0);
   }
  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');  
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  showDeductiblesModal(deductibles){
    // setTimeout(()=>{this.getDeductibles();},0);
    // this.modalService.open(deductibles, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    this.getDeductibles();
    this.deductiblesModal.openNoClose();
  }

  getDeductibles(){
    this.deductiblesTable.loadingFlag = true;
    let params : any = {
      policyId:this.policyId,
      policyNo:'',
      coverCd:0,
      endtCd: 0
    }
    this.underwritingService.getUWCoverageDeductibles(params).subscribe(data=>{
      console.log(data);
      if(data['policy']!==null){
        this.passDataDeductibles.tableData = data['policy']['deductibles'].filter(a=>{
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.updateDate = this.ns.toDateTimeString(a.updateDate);
          a.updateUser = JSON.parse(window.localStorage.currentUser).username;
          return true;
        });
      }
      else
        this.passDataDeductibles.tableData = [];
      this.deductiblesTable.refreshTable();
    });
  }

  saveDeductibles(){
    let params:any = {
      policyId:this.policyId,
      saveDeductibleList: [],
      deleteDeductibleList:[]
    };
    params.saveDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && !a.deleted && a.deductibleCd!==null);
    params.deleteDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && a.deleted && a.deductibleCd!==null);
    if(params.saveDeductibleList.length==0 && params.deleteDeductibleList.length==0){
      this.dialogMsg = 'Nothing to save.'
      this.dialogIcon = 'info'
      this.successDlg.open();
      return;
    }
    for(let ded of params.saveDeductibleList){
      if((isNaN(ded.deductibleRt) || ded.deductibleRt=="" || ded.deductibleRt==null) && (isNaN(ded.deductibleAmt) || ded.deductibleAmt=="" || ded.deductibleAmt==null)){
        this.dialogIcon = "error";
        setTimeout(a=>this.successDlg.open(),0);
        return null;
      }
    }
    this.deductiblesTable.loadingFlag = true;
    this.underwritingService.savePolDeductibles(params).subscribe(data=>{
        if(data['returnCode'] == -1){
          this.dialogIcon = '';
          this.successDlg.open();
          this.getDeductibles();
        }else{
          this.deductiblesTable.loadingFlag = false;
          this.dialogIcon = 'error';
          this.successDlg.open();
        }
      });
  }

  setSelected(data){
    if(data.selector == 'deductibles'){
      this.passDataDeductibles.tableData = this.passDataDeductibles.tableData.filter(a=>a.showMG!=1);
      for(var i = 0; i<data.data.length;i++){
        this.passDataDeductibles.tableData.push(JSON.parse(JSON.stringify(this.passDataDeductibles.nData)));
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleTitle = data.data[i].deductibleTitle;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleRt = data.data[i].deductibleRate;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleAmt = data.data[i].deductibleAmt;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleTxt = data.data[i].deductibleText;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].edited = true;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleCd = data.data[i].deductibleCd;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length - 1].showMG = 0;
      }
    }else if (data == 'polWordings'){

    }
    this.deductiblesTable.refreshTable();
  }

  clickDeductiblesLOV(data){
    if(data.key=="deductibleCd"){
      this.lovCheckBox = true;
      this.passLOVData.selector = 'deductibles';
      this.passLOVData.lineCd = this.policyInfo.lineCd;
      this.passLOVData.params = {
        coverCd : 0,
        endtCd: '0',
        activeTag:'Y'
      }
      this.passLOVData.hide = this.passDataDeductibles.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
    }else if(data == 'polWordings'){
      this.passLOVData.selector = 'polWordings';
      this.passLOVData.params = {
        activeTag:'Y',
        ocTag : 'N',
        lineCd : this.policyInfo.lineCd,
      }
    }
    this.lov.openLOV();
  }

  setSec(d) {
    d = new Date(d);
    return d.setSeconds(0);
  }

  cbToggle(ev) {
    $(ev.target).addClass('ng-dirty');
  }

  //validates params before going to web service
  validate(obj) {
   var req = ['cedingId', 'coSeriesNo', 'cessionId', 'lineClassCd', 'quoteId', 'status', 'principalId', 'insuredDesc',
              'inceptDate', 'expiryDate', 'issueDate', 'effDate', 'distDate', 'acctDate', 'currencyCd', 'currencyRt',
              'projDesc', 'site'];

   switch(obj.lineCd) {
     case 'CAR':
       //req.push('contractorId', 'duration');
       break;
     case 'EAR':
       req.push('testing');
       break;
     case 'MLP':
       req.push('ipl', 'timeExc', 'mbiRefNo');
       break;
     case 'DOS':
       req.push('noClaimPd', 'mbiRefNo');
   }

   if(obj.cessionId == 2) {
     req.push('reinsurerId');
   }

   if(this.alteration) {
     req.push('insuredId', 'insuredName', 'objectId', 'projDesc', 'wordings');
   }

   var entries = Object.entries(obj);

   for(var[key, val] of entries) {
     if((val === '' || val == null) && req.includes(key)) {
       return false;
     }
   }

   return true;
 }

  showIntLOV(){
    $('#intLOV #modalBtn').trigger('click');
    $('#intLOV #modalBtn').addClass('ng-dirty')
  }

  setInt(event){
        this.policyInfo.intmId = event.intmId;
        this.policyInfo.intmName = event.intmName;
        this.ns.lovLoader(event.ev, 0);
        this.focusBlur();
  }

  //edit by paul
  getLineClass(){
    this.mtnService.getLineClassLOV(this.line).subscribe(a=>{
      this.lineClasses = a['lineClass'];
    })
  }

}
