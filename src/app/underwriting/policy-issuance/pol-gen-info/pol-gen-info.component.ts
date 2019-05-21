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

import { SpecialLovComponent } from '@app/_components/special-lov/special-lov.component';

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
  @ViewChild('dedLov') lov : LovComponent;
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
  @Input() polInfo: any = {
    policyId: '',
    policyNo: '',
    riskName: '',
    insuredDesc: '',
    riskId: '',
    showPolAlop: '',
    coInsuranceFlag: false,
    principalId: ''
  }

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
    polWordings:{
      text: '',
      altText: ''
    },
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
      "createUser": this.ns.getCurrentUser(),
      "deductibleAmt": 0,
      "deductibleCd": null,
      "deductibleRt": 0,
      "deductibleTxt": '',
      "endtCd": "0",
      "updateDate": this.ns.toDateTimeString(0),
      "updateUser":this.ns.getCurrentUser(),
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
  prevExpiryDate: string;
  refPolicyId: string = '';
  newAlt: boolean = false;
  fromInq:any = false;
  showPolicyNo: string;
  lineClasses: any[] = [];

  wordingsKeys:string[] = [
    'polwText01',
    'polwText02',
    'polwText03',
    'polwText04',
    'polwText05',
    'polwText06',
    'polwText07',
    'polwText08',
    'polwText09',
    'polwText10',
    'polwText11',
    'polwText12',
    'polwText13',
    'polwText14',
    'polwText15',
    'polwText16',
    'polwText17',
    'altwText01',
    'altwText02',
    'altwText03',
    'altwText04',
    'altwText05',
    'altwText06',
    'altwText07',
    'altwText08',
    'altwText09',
    'altwText10',
    'altwText11',
    'altwText12',
    'altwText13',
    'altwText14',
    'altwText15',
    'altwText16',
    'altwText17'
  ]

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
      this.policyId = this.polInfo.policyId === '' ? params['policyId'] : this.polInfo.policyId;
      this.policyNo = this.polInfo.policyNo === '' ? params['policyNo'] : this.polInfo.policyNo;
      this.prevPolicyId = params['prevPolicyId'] == undefined ? '' : params['prevPolicyId'];

      if(this.underwritingService.fromCreateAlt) {
        this.alteration = true;
        this.newAlt = true;
      }

      //edit by paul
      this.fromInq = params['fromInq'] == 'true';

      if(this.fromInq){
        this.passDataDeductibles.addFlag = false;
        this.passDataDeductibles.deleteFlag = false;
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

  getPolGenInfo(fromSave?) {
    if(fromSave === undefined) {
      $('.globalLoading').css('display','block');
    }

    this.underwritingService.getPolGenInfo(this.policyId, this.policyNo).subscribe((data:any) => {
      $('.globalLoading').css('display','none');
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
        this.policyInfo.project.totalSi = String(this.policyInfo.project.totalSi).indexOf('.') === -1 && this.policyInfo.project.totalSi != null ? String(this.policyInfo.project.totalSi) + '.00' : this.policyInfo.project.totalSi;
        //edit by paul
        this.policyInfo.principalId = String(this.policyInfo.principalId).padStart(6,'0')
        this.policyInfo.contractorId = this.policyInfo.contractorId != null ? String(this.policyInfo.contractorId).padStart(6,'0'):null;
        this.policyInfo.intmId = this.pad(this.policyInfo.intmId, 6);
        if(this.policyInfo.polWordings !== null){
          this.policyInfo.polWordings.text = "";
          this.policyInfo.polWordings.altText = "";

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

          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText01 == null? '' : this.policyInfo.polWordings.altwText01;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText02 == null? '' : this.policyInfo.polWordings.altwText02;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText03 == null? '' : this.policyInfo.polWordings.altwText03;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText04 == null? '' : this.policyInfo.polWordings.altwText04;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText05 == null? '' : this.policyInfo.polWordings.altwText05;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText06 == null? '' : this.policyInfo.polWordings.altwText06;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText07 == null? '' : this.policyInfo.polWordings.altwText07;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText08 == null? '' : this.policyInfo.polWordings.altwText08;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText09 == null? '' : this.policyInfo.polWordings.altwText09;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText10 == null? '' : this.policyInfo.polWordings.altwText10;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText11 == null? '' : this.policyInfo.polWordings.altwText11;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText12 == null? '' : this.policyInfo.polWordings.altwText12;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText13 == null? '' : this.policyInfo.polWordings.altwText13;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText14 == null? '' : this.policyInfo.polWordings.altwText14;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText15 == null? '' : this.policyInfo.polWordings.altwText15;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText16 == null? '' : this.policyInfo.polWordings.altwText16;
          this.policyInfo.polWordings.altText += this.policyInfo.polWordings.altwText17 == null? '' : this.policyInfo.polWordings.altwText17;


          // EDIT BY PAUL 05/19/2019
          if(this.policyInfo.endtText[0].endtCd != null){
            this.policyInfo.polWordings.altText += "\n\n===================ENDORSEMENTS==================="
            for(let endt of this.policyInfo.endtText){
              this.policyInfo.polWordings.altText += "\n\nEndorsement Code "+endt.endtCd+": "+endt.endtTitle+"\n\n\t"
              this.policyInfo.polWordings.altText += (endt.endtText.endtText01 === null ? '' :endt.endtText.endtText01) + 
                                     (endt.endtText.endtText02 === null ? '' :endt.endtText.endtText02) + 
                                     (endt.endtText.endtText03 === null ? '' :endt.endtText.endtText03) + 
                                     (endt.endtText.endtText04 === null ? '' :endt.endtText.endtText04) + 
                                     (endt.endtText.endtText05 === null ? '' :endt.endtText.endtText05) + 
                                     (endt.endtText.endtText06 === null ? '' :endt.endtText.endtText06) + 
                                     (endt.endtText.endtText07 === null ? '' :endt.endtText.endtText07) + 
                                     (endt.endtText.endtText08 === null ? '' :endt.endtText.endtText08) + 
                                     (endt.endtText.endtText09 === null ? '' :endt.endtText.endtText09) + 
                                     (endt.endtText.endtText10 === null ? '' :endt.endtText.endtText10) + 
                                     (endt.endtText.endtText11 === null ? '' :endt.endtText.endtText11) + 
                                     (endt.endtText.endtText12 === null ? '' :endt.endtText.endtText12) + 
                                     (endt.endtText.endtText13 === null ? '' :endt.endtText.endtText13) + 
                                     (endt.endtText.endtText14 === null ? '' :endt.endtText.endtText14) + 
                                     (endt.endtText.endtText15 === null ? '' :endt.endtText.endtText15) + 
                                     (endt.endtText.endtText16 === null ? '' :endt.endtText.endtText16) + 
                                     (endt.endtText.endtText17 === null ? '' :endt.endtText.endtText17) ;
            }

          }
        }else{
          this.policyInfo.polWordings = {
            text: '',
            altText: ''
          };
        }
        this.checkPolIdF(this.policyInfo.policyId);
        this.toggleRadioBtnSet();


        if(this.alteration && !this.newAlt) {
          var polNo = this.policyInfo.policyNo.split('-');
          polNo[polNo.length-1] = String(Number(polNo[polNo.length-1]) - 1).padStart(3, '0');
          // if (this.prevPolicyId !== '') {
            this.underwritingService.getPolGenInfo(null, polNo.join('-')).subscribe((data:any) => {
              this.prevInceptDate = this.ns.toDateTimeString(this.setSec(data.policy.inceptDate));
              this.prevEffDate = this.ns.toDateTimeString(this.setSec(data.policy.effDate));
              this.prevExpiryDate = this.ns.toDateTimeString(this.setSec(data.policy.expiryDate));
            });
          // }
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
        this.policyInfo.statusDesc = "";
        this.policyInfo.polWordings.altText = "";
        this.prevInceptDate = this.policyInfo.inceptDate;
        this.prevEffDate = this.policyInfo.effDate;

        this.mtnService.getMtnPolWordings({ wordType: 'A', activeTag: 'Y', ocTag: this.policyInfo.openCoverTag, lineCd: this.policyInfo.lineCd })
                       .subscribe(data =>{
                         var wordings = data['mtnPolWordings'].filter(a => a.defaultTag === 'Y');

                         this.policyInfo.polWordings.wordingCd = wordings[0].wordingCd;
                         var altText = '';
                         Object.keys(wordings[0]).forEach(function(key) {
                           if(/wordText/.test(key)) {
                             altText += wordings[0][key] === null ? '' : wordings[0][key];
                           }
                         });

                         this.policyInfo.polWordings.altText = altText;
                       });

        this.policyInfo.issueDate = this.ns.toDateTimeString(0);
        this.policyInfo.effDate = this.ns.toDateTimeString(0);
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

  pad(str, num?) {
    if(str === '' || str == null){
      return '';
    }

    return String(str).padStart(num != undefined ? num : 3, '0');
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
    this.insuredLovs.first.openLOV();
    //$('#principalLOV #modalBtn').trigger('click');
    $('#principalLOV #modalBtn').addClass('ng-dirty');
  }

  showContractorLOV(){
    this.insuredLovs.last.openLOV();
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
    let parameters = this.policyInfo.policyNo.split(/[-]/g);
    if(this.alteration)
      {this.underwritingService.getUWCoverageAlt(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5]).subscribe((data: any) => {
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
                    refPolicyId: this.refPolicyId,
                    policyId: event,
                    policyNo: this.policyNo,
                    riskName: this.policyInfo.project.riskName,
                    insuredDesc: this.policyInfo.insuredDesc,
                    riskId: this.policyInfo.project.riskId,
                    showPolAlop: this.policyInfo.showPolAlop,
                    coInsuranceFlag: this.policyInfo.coInsuranceFlag,
                    principalId: this.policyInfo.principalId,
                    cedingName: this.policyInfo.cedingName //add by paul
                  });
              });

            });}
    else{
      this.underwritingService.getUWCoverageInfos(null, this.policyInfo.policyId).subscribe((data: any) => {
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
              refPolicyId: this.refPolicyId,
              policyId: event,
              policyNo: this.policyNo,
              riskName: this.policyInfo.project.riskName,
              insuredDesc: this.policyInfo.insuredDesc,
              riskId: this.policyInfo.project.riskId,
              showPolAlop: this.policyInfo.showPolAlop,
              coInsuranceFlag: this.policyInfo.coInsuranceFlag,
              principalId: this.policyInfo.principalId,
              cedingName: this.policyInfo.cedingName //add by paul
            });
        });

      });
    }
  }

  updateExpiryDate() {
    var d = new Date(this.policyInfo.inceptDate);
    d.setFullYear(d.getFullYear() + 1);

    this.policyInfo.expiryDate = this.policyInfo.inceptDate.split('T').includes('') ? 'T' : this.ns.toDateTimeString(d);
  }

  updateDate(str) {
    if(str === 'lapseFrom') {
      this.policyInfo.lapseFrom = this.ns.toDateTimeString(new Date(this.policyInfo.issueDate));
    } else if(str === 'lapseTo') {
      this.policyInfo.lapseTo = this.ns.toDateTimeString(new Date(this.policyInfo.effDate));
    }
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
      "lapseFrom"       : this.policyInfo.lapseFrom == 'T' ? '' : this.policyInfo.lapseFrom,
      "lapseTo"         : this.policyInfo.lapseTo == 'T' ? '' : this.policyInfo.lapseTo,
      "lineCd"          : this.policyInfo.lineCd,
      "lineClassCd"     : this.policyInfo.lineClassCd,
      "maintenanceFrom" : this.policyInfo.maintenanceFrom == 'T' ? '' : this.policyInfo.maintenanceFrom,
      "maintenanceTo"   : this.policyInfo.maintenanceTo == 'T' ? '' : this.policyInfo.maintenanceTo,
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
      //" wordings"        : this.policyInfo.wordings.trim(),
      "polWordings"     : this.policyInfo.polWordings,
      "regionCd"        : this.policyInfo.project.regionCd,
      "provinceCd"      : this.policyInfo.project.provinceCd,
      "cityCd"          : this.policyInfo.project.cityCd,
      "districtCd"      : this.policyInfo.project.districtCd,
      "blockCd"         : this.policyInfo.project.blockCd,
      "latitude"        : this.policyInfo.project.latitude,
      "longitude"       : this.policyInfo.project.longitude
    }

    var mfArr = savePolGenInfoParam.maintenanceFrom.split('T');
    var mfTo = savePolGenInfoParam.maintenanceTo.split('T');

    if(mfArr[0] == 'undefined' || mfArr[0] == '') {
      savePolGenInfoParam.maintenanceFrom = '';
    } else if(mfArr[1] == 'undefined' || mfArr[1] == '') {
      savePolGenInfoParam.maintenanceFrom = mfArr[0];
    }

    if(mfTo[0] == 'undefined' || mfTo[0] == '') {
      savePolGenInfoParam.maintenanceTo = '';
    } else if(mfTo[1] == 'undefined' || mfTo[1] == '') {
      savePolGenInfoParam.maintenanceTo = mfTo[0];
    }

    let wordingSplit = this.policyInfo.polWordings.text.match(/(.|[\r\n]){1,2000}/g);
    if(savePolGenInfoParam.polWordings.createUser == undefined){
      savePolGenInfoParam.polWordings.createUser = this.ns.getCurrentUser();
      savePolGenInfoParam.polWordings.createDate = this.ns.toDateTimeString(0);
    }else{
      savePolGenInfoParam.polWordings.createDate = this.ns.toDateTimeString(savePolGenInfoParam.polWordings.createDate);
    }
    for(let key of this.wordingsKeys){
      savePolGenInfoParam.polWordings[key]='';
    }
    if(wordingSplit != null)
      for(let i=0;i<wordingSplit.length;i++){
        savePolGenInfoParam.polWordings[this.wordingsKeys[i]] = wordingSplit[i];
      }

    let wordingSplitAlt = this.policyInfo.polWordings.altText.split('===================ENDORSEMENTS===================')[0].trim().match(/(.|[\r\n]){1,2000}/g);
    var x = this.wordingsKeys.length/2;
    if(wordingSplitAlt != null)
      for(let i=0;i<wordingSplitAlt.length;i++){
        savePolGenInfoParam.polWordings[this.wordingsKeys[x]] = wordingSplitAlt[i];
        x++;
      }

   if(this.validate(savePolGenInfoParam)){
     if(this.alteration && new Date(this.prevExpiryDate) < new Date(this.policyInfo.inceptDate) && this.policyInfo.inceptDate === this.policyInfo.effDate) {
       savePolGenInfoParam['extensionTag'] = 'Y';
     }

     this.underwritingService.savePolGenInfo(savePolGenInfoParam).subscribe((data: any) => {
       if(data.returnCode === 0){
         this.dialogMessage="The system has encountered an unspecified error.";
         this.dialogIcon = "error";
         $('#polGenInfo > #successModalBtn').trigger('click');
       }else{
         this.policyId = data['policyId'];
         this.policyNo = data['policyNo'];

         if(this.newAlt) {
           this.newAlt = false;
           this.underwritingService.fromCreateAlt = false;
         }

         this.dialogMessage = "";
         this.dialogIcon = "";
         $('#polGenInfo > #successModalBtn').trigger('click');
         /*this.form.control.markAsPristine();*/
         this.getPolGenInfo('noLoading');
       }
     });
   }else{
     this.dialogMessage = "Please check field values.";
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
    }else if (data.selector == 'polWordings'){
      this.policyInfo.polWordings.text = data.data.text;
      this.policyInfo.polWordings.wordingCd = data.data.wordingCd;

    }else if (data.selector == 'polWordingsAlt'){
      this.policyInfo.polWordings.altText = data.data.text;
      this.policyInfo.polWordings.wordingCd = data.data.wordingCd;

    }else{
      this.setLocation(data)
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
      this.lovCheckBox = false;
      this.passLOVData.selector = 'polWordings';
      this.passLOVData.params = {
        wordType: 'P',
        activeTag:'Y',
        ocTag : 'N',
        lineCd : this.policyInfo.lineCd,
      }
    }else if(data == 'polWordingsAlt'){
      this.lovCheckBox = false;
      this.passLOVData.selector = 'polWordingsAlt';
      this.passLOVData.params = {
        wordType: 'A',
        activeTag:'Y',
        ocTag : 'N',
        lineCd : this.policyInfo.lineCd,
      }
    }else{

    }
    $('#lov').addClass('ng-dirty');
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
               'currencyCd', 'currencyRt', 'projDesc', 'site'];
   var reqDates = ['inceptDate', 'expiryDate', 'issueDate', 'effDate', 'distDate', 'acctDate'];

   switch(obj.lineCd) {
     case 'CAR':
       req.push('contractorId', 'duration');
       break;
     case 'EAR':
       req.push('contractorId', 'duration', 'testing');
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

   if(this.policyInfo.openCoverTag === 'Y') {
     req.push('riskId', 'regionCd', 'provinceCd', 'cityCd');
   }

   var entries = Object.entries(obj);

   for(var[key, val] of entries) {
     if(key === 'polWordings') {
       if(this.alteration && val['altText'].trim() === '') {
         return false;
       }
     } else if(reqDates.includes(key)) {
       if(String(val).split('T').includes('')) {
         return false;
       }
     }

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
        this.policyInfo.intmId = this.pad(event.intmId, 6);
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

  // ----------------------------from risk-----------------------------------------------------------
  oldValue:any;
  checkCodeLoc(ev, field){
        $(ev).addClass('ng-dirty');
        if(field === 'region'){
            this.oldValue = this.policyInfo.project.regionCd;
            if (this.policyInfo.project.regionCd == null || this.policyInfo.project.regionCd == '') {
                this.policyInfo.project.regionCd = '';
                this.policyInfo.project.regionDesc = '';
                this.policyInfo.project.provinceCd = '';
                this.policyInfo.project.provinceDesc = '';
                this.policyInfo.project.cityCd = '';
                this.policyInfo.project.cityDesc = '';
                this.policyInfo.project.districtCd = '';
                this.policyInfo.project.districtDesc = '';
                this.policyInfo.project.blockCd = '';
                this.policyInfo.project.blockDesc = '';
                this.policyInfo.project.zoneCd = '';
                this.policyInfo.project.zoneDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lov.checkCode('region', this.policyInfo.project.regionCd, '', '', '', '', ev);
            }
        } else if(field === 'province'){
            this.oldValue = this.policyInfo.project.provinceCd;
            if (this.policyInfo.project.provinceCd == null || this.policyInfo.project.provinceCd == '') {
                this.policyInfo.project.provinceCd = '';
                this.policyInfo.project.provinceDesc = '';
                this.policyInfo.project.cityCd = '';
                this.policyInfo.project.cityDesc = '';
                this.policyInfo.project.districtCd = '';
                this.policyInfo.project.districtDesc = '';
                this.policyInfo.project.blockCd = '';
                this.policyInfo.project.blockDesc = '';
                this.policyInfo.project.zoneCd = '';
                this.policyInfo.project.zoneDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lov.checkCode('province', this.policyInfo.project.regionCd, this.policyInfo.project.provinceCd, '', '', '', ev);
            }
        } else if(field === 'city'){
            this.oldValue = this.policyInfo.project.cityCd;
            if (this.policyInfo.project.cityCd == null || this.policyInfo.project.cityCd == '') {
                this.policyInfo.project.cityCd = '';
                this.policyInfo.project.cityDesc = '';
                this.policyInfo.project.districtCd = '';
                this.policyInfo.project.districtDesc = '';
                this.policyInfo.project.blockCd = '';
                this.policyInfo.project.blockDesc = '';
                this.policyInfo.project.zoneCd = '';
                this.policyInfo.project.zoneDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lov.checkCode('city', this.policyInfo.project.regionCd, this.policyInfo.project.provinceCd, this.policyInfo.project.cityCd, '', '', ev);
            }
        } else if(field === 'district') {
            this.oldValue = this.policyInfo.project.districtCd;
            if (this.policyInfo.project.districtCd == null || this.policyInfo.project.districtCd == '') {
                this.policyInfo.project.districtCd = '';
                this.policyInfo.project.districtDesc = '';
                this.policyInfo.project.blockCd = '';
                this.policyInfo.project.blockDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lov.checkCode('district',this.policyInfo.project.regionCd, this.policyInfo.project.provinceCd, this.policyInfo.project.cityCd, this.policyInfo.project.districtCd, '', ev);
            }
        } else if(field === 'block') {
            this.oldValue = this.policyInfo.project.blockCd;
            if (this.policyInfo.project.blockCd == null || this.policyInfo.project.blockCd == '') {
                this.policyInfo.project.blockCd = '';
                this.policyInfo.project.blockDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lov.checkCode('block',this.policyInfo.project.regionCd, this.policyInfo.project.provinceCd, this.policyInfo.project.cityCd, this.policyInfo.project.districtCd, this.policyInfo.project.blockCd, ev);
            }
        } /*else if(field === 'risk') {
            this.riskLov.checkCode(this.riskCd, ev);
        }      */
    }

     setLocation(data){
        this.ns.lovLoader(data.ev, 0);
        var resetSucceedingFields = false;

        if(data.selector == 'region'){
            if (data.data == null) {
                this.setRegion(data);
                if (this.oldValue = data.regionCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                if (this.oldValue = data.data.regionCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.policyInfo.project.provinceCd = '';
                this.policyInfo.project.provinceDesc = '';
                this.policyInfo.project.cityCd = '';
                this.policyInfo.project.cityDesc = '';
                this.policyInfo.project.districtCd = '';
                this.policyInfo.project.districtDesc = '';
                this.policyInfo.project.blockCd = '';
                this.policyInfo.project.blockDesc = '';
                this.policyInfo.project.zoneCd = '';
                this.policyInfo.project.zoneDesc = '';
            }

        } else if(data.selector == 'province'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                if (this.oldValue = data.provinceList[0].provinceCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                if (this.oldValue = data.data.provinceCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.policyInfo.project.cityCd = '';
                this.policyInfo.project.cityDesc = '';
                this.policyInfo.project.districtCd = '';
                this.policyInfo.project.districtDesc = '';
                this.policyInfo.project.blockCd = '';
                this.policyInfo.project.blockDesc = '';
                this.policyInfo.project.zoneCd = '';
                this.policyInfo.project.zoneDesc = '';
            }

        } else if(data.selector == 'city'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                this.setCity(data.provinceList[0].cityList[0]);
                if (this.oldValue = data.provinceList[0].cityList[0].cityCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                this.setCity(data.data);
                if (this.oldValue = data.data.cityCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.policyInfo.project.districtCd = '';
                this.policyInfo.project.districtDesc = '';
                this.policyInfo.project.blockCd = '';
                this.policyInfo.project.blockDesc = '';
            }

        } else if(data.selector == 'district'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                this.setCity(data.provinceList[0].cityList[0]);
                this.setDistrict(data.provinceList[0].cityList[0].districtList[0]);
                if (this.oldValue = data.provinceList[0].cityList[0].districtList[0].districtCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                this.setCity(data.data);
                this.setDistrict(data.data);
                if (this.oldValue = data.data.cityCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.policyInfo.project.blockCd = '';
                this.policyInfo.project.blockDesc = '';
            }

        } else if(data.selector == 'block'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                this.setCity(data.provinceList[0].cityList[0]);
                this.setDistrict(data.provinceList[0].cityList[0].districtList[0]);
                this.setBlock(data.provinceList[0].cityList[0].districtList[0].blockList[0]);
                if (this.oldValue = data.provinceList[0].cityList[0].districtList[0].blockList[0].blockCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                this.setCity(data.data);
                this.setDistrict(data.data);
                this.setBlock(data.data);
                if (this.oldValue = data.data.blockCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {

            }
        }

        this.ns.lovLoader(data.ev, 0);
    }


    setDistrict(data){
        this.policyInfo.project.districtCd = data.districtCd;
        this.policyInfo.project.districtDesc = data.districtDesc;
    }
    setCity(data){
        this.policyInfo.project.cityCd = data.cityCd;
        this.policyInfo.project.cityDesc = data.cityDesc;
    }
    setBlock(data){
        this.policyInfo.project.blockCd = data.blockCd;
        this.policyInfo.project.blockDesc = data.blockDesc;
    }

    setRegion(data){
        this.policyInfo.project.regionCd = data.regionCd;
        this.policyInfo.project.regionDesc = data.regionDesc;
    }
    setProvince(data){
        this.policyInfo.project.provinceCd = data.provinceCd;
        this.policyInfo.project.provinceDesc = data.provinceDesc;
    }

    openGenericLOV(selector){
        this.lovCheckBox = false;
        if(selector == 'province'){
            this.passLOVData.regionCd = this.policyInfo.project.regionCd;
        }else if(selector == "city"){
            this.passLOVData.regionCd = this.policyInfo.project.regionCd;
            this.passLOVData.provinceCd = this.policyInfo.project.provinceCd;
        }else if(selector == 'district'){
            this.passLOVData.regionCd = this.policyInfo.project.regionCd;
            this.passLOVData.provinceCd = this.policyInfo.project.provinceCd;
            this.passLOVData.cityCd = this.policyInfo.project.cityCd;
        }else if(selector == 'block'){
            this.passLOVData.regionCd = this.policyInfo.project.regionCd;
            this.passLOVData.provinceCd = this.policyInfo.project.provinceCd;
            this.passLOVData.cityCd = this.policyInfo.project.cityCd;
            this.passLOVData.districtCd = this.policyInfo.project.districtCd;
        }
        this.passLOVData.selector = selector;
        this.lov.openLOV();
    }
}
