import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService } from '../../../_services';
import { MtnIntermediaryComponent } from '@app/maintenance/mtn-intermediary/mtn-intermediary.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { FormsModule }   from '@angular/forms';
import { CustEditableNonDatatableComponent, SucessDialogComponent, ModalComponent, ConfirmSaveComponent, LovComponent} from '@app/_components/common';

@Component({
  selector: 'app-pol-gen-info-open-cover',
  templateUrl: './pol-gen-info-open-cover.component.html',
  styleUrls: ['./pol-gen-info-open-cover.component.css']
})
export class PolGenInfoOpenCoverComponent implements OnInit {

  line: string;
  loading: boolean = false;
  cancelFlag: boolean = false;
  cancelFailed: boolean = false;

  dialogMessage: string = '';
  dialogIcon: string = '';

  @Input() policyInfo : any;

  @ViewChild(MtnIntermediaryComponent) intermediaryLov: MtnIntermediaryComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('myForm') form:any;
  @ViewChild('mainSuccess') mainSuccess : SucessDialogComponent;
  @ViewChild('mainCancel') mainCancel : CancelButtonComponent;
  @ViewChild('mainConfirmSave') mainConfirmSave : ConfirmSaveComponent;

  currentUser: string = JSON.parse(window.localStorage.currentUser).username;

  genInfoOcData: any = {
    policyIdOc: '',
    openPolicyNo: '',
    lineCd: '',
    lineCdDesc: '',
    ocYear: '',
    ocSeqNo: '',
    cedingId: '',
    cedingName: '',
    coSeriesNo: '',
    altNo: '',
    cessionId: '',
    cessionDesc: '',
    lineClassCd: '',
    quoteId: '',
    quoteNo: '',
    lineClassDesc: '',
    refOpPolNo: '',
    prinId: '',
    prinName: '',
    contractorId: '',
    contractorName: '',
    insuredDesc: '',
    status: '',
    statusDesc: '',
    reinsurerId: '',
    reinsurerName: '',
    intmId: '',
    intmName: '',
    inceptDate: '',
    expiryDate: '',
    lapseFrom: '',
    lapseTo: '',
    issueDate: '',
    effDate: '',
    distDate: '',
    acctDate: '',
    currencyCd: '',
    currencyRt: '',
    coRefNo: '',
    riBinderNo: '',
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: ''
  };

  projectOcData: any = {
    projId: '',
    projDesc: '',
    riskId: '',
    riskName: '',
    regionCd: '',
    regionDesc: '',
    provinceCd: '',
    provinceDesc: '',
    cityCd: '',
    cityDesc: '',
    districtCd: '',
    districtDesc: '',
    blockCd: '',
    blockDesc: '',
    latitude: '',
    longitude: '',
    totalSi: '',
    objectId: '',
    objectDesc: '',
    site: '',
    duration: '',
    testing: '',
    prCreateUser: '',
    prCreateDate: '',
    prUpdateUser: '',
    prUpdateDate: ''
  }

  inceptionDateParams: any = {
    date: '',
    time: ''
  }

  expiryDateParams: any = {
    date: '',
    time: ''
  }

  lapseFromParams: any = {
    date: '',
    time: ''
  }

  lapseToParams: any = {
    date: '',
    time: ''
  }

  issueDateParams: any = {
    date: '',
    time: ''
  }

  distributionDateParams: any = {
    date: '',
    time: ''
  }

  effDateParams: any = {
    date: '',
    time: ''
  }

  accDateParams: any = {
    date: '',
    time: ''
  }

  saveParams: any = {};

  alterationFlag:boolean = false;

  constructor( private modalService: NgbModal, private underwritingService: UnderwritingService, private ns: NotesService) { }

  ngOnInit() {
    this.line = this.policyInfo.line;
    //this.line = 'EAR';
    this.loading = true;
    this.retrievePolGenInfoOc(this.policyInfo.policyIdOc, this.policyInfo.policyNo);
    if(this.policyInfo.fromInq =='true'){
      this.passDataDeductibles.addFlag = false;
      this.passDataDeductibles.deleteFlag = false;
      this.passDataDeductibles.checkFlag = false;
      this.passDataDeductibles.uneditable = [true,true,true,true,true,true]
    }
  }

  showItemInfoModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  retrievePolGenInfoOc(policyIdOc: string, openPolicyNo: string){
      this.underwritingService.getPolGenInfoOc(policyIdOc, openPolicyNo).subscribe((data: any)=>{
          this.genInfoOcData.policyIdOc         =  data.policyOc.policyIdOc;
          this.genInfoOcData.openPolicyNo       =  data.policyOc.openPolicyNo;
          this.genInfoOcData.lineCd             =  data.policyOc.lineCd;
          this.genInfoOcData.lineCdDesc         =  data.policyOc.lineCdDesc;
          this.genInfoOcData.ocYear             =  data.policyOc.ocYear;
          this.genInfoOcData.ocSeqNo            =  data.policyOc.ocSeqNo;
          this.genInfoOcData.cedingId           =  data.policyOc.cedingId;
          this.genInfoOcData.cedingName         =  data.policyOc.cedingName;
          this.genInfoOcData.coSeriesNo         =  data.policyOc.coSeriesNo;
          this.genInfoOcData.altNo              =  data.policyOc.altNo;
          this.alterationFlag                   = data.policyOc.altNo != 0;
          this.genInfoOcData.cessionId          =  data.policyOc.cessionId;
          this.genInfoOcData.cessionDesc        =  data.policyOc.cessionDesc;
          this.genInfoOcData.lineClassCd        =  data.policyOc.lineClassCd;
          this.genInfoOcData.quoteId            =  data.policyOc.quoteId;
          this.genInfoOcData.quoteNo            =  data.policyOc.quoteNo;
          this.genInfoOcData.lineClassDesc      =  data.policyOc.lineClassDesc;
          this.genInfoOcData.refOpPolNo         =  data.policyOc.refOpPolNo;
          this.genInfoOcData.prinId             =  data.policyOc.prinId;
          this.genInfoOcData.prinName           =  data.policyOc.prinName;
          this.genInfoOcData.contractorId       =  data.policyOc.contractorId;
          this.genInfoOcData.contractorName     =  data.policyOc.contractorName;
          this.genInfoOcData.insuredDesc        =  data.policyOc.insuredDesc;
          this.genInfoOcData.status             =  data.policyOc.status;
          this.genInfoOcData.statusDesc         =  data.policyOc.statusDesc;
          this.genInfoOcData.reinsurerId        =  data.policyOc.reinsurerId;
          this.genInfoOcData.reinsurerName      =  data.policyOc.reinsurerName;
          this.genInfoOcData.intmId             =  data.policyOc.intmId;
          this.genInfoOcData.intmName           =  data.policyOc.intmName;
          this.genInfoOcData.inceptDate         =  data.policyOc.inceptDate;
          this.genInfoOcData.expiryDate         =  data.policyOc.expiryDate;
          this.genInfoOcData.lapseFrom          =  data.policyOc.lapseFrom; //=== null ? data.policyOc.inceptDate : data.policyOc.lapseFrom;
          this.genInfoOcData.lapseTo            =  data.policyOc.lapseTo; //=== null ? data.policyOc.expiryDate : data.policyOc.lapseTo;
          this.genInfoOcData.issueDate          =  data.policyOc.issueDate;
          this.genInfoOcData.effDate            =  data.policyOc.effDate;
          this.genInfoOcData.distDate           =  data.policyOc.distDate;
          this.genInfoOcData.acctDate           =  data.policyOc.acctDate;
          this.genInfoOcData.currencyCd         =  data.policyOc.currencyCd;
          this.genInfoOcData.currencyRt         =  data.policyOc.currencyRt;
          this.genInfoOcData.coRefNo            =  data.policyOc.coRefNo;
          this.genInfoOcData.riBinderNo         =  data.policyOc.riBinderNo;
          this.genInfoOcData.createUser         =  data.policyOc.createUser;
          this.genInfoOcData.createDate         =  this.ns.toDateTimeString(data.policyOc.createDate);
          this.genInfoOcData.updateUser         =  data.policyOc.updateUser;
          this.genInfoOcData.updateDate         =  this.ns.toDateTimeString(data.policyOc.updateDate);
          this.genInfoOcData.remarks            = data.policyOc.remarks;

          this.projectOcData.projId             =  data.policyOc.project.projId;
          this.projectOcData.projDesc           =  data.policyOc.project.projDesc;
          this.projectOcData.riskId             =  data.policyOc.project.riskId;
          this.projectOcData.riskName           =  data.policyOc.project.riskName;
          this.projectOcData.regionCd           =  data.policyOc.project.regionCd;
          this.projectOcData.regionDesc         =  data.policyOc.project.regionDesc;
          this.projectOcData.provinceCd         =  data.policyOc.project.provinceCd;
          this.projectOcData.provinceDesc       =  data.policyOc.project.provinceDesc;
          this.projectOcData.cityCd             =  data.policyOc.project.cityCd;
          this.projectOcData.cityDesc           =  data.policyOc.project.cityDesc;
          this.projectOcData.districtCd         =  data.policyOc.project.districtCd;
          this.projectOcData.districtDesc       =  data.policyOc.project.districtDesc;
          this.projectOcData.blockCd            =  data.policyOc.project.blockCd;
          this.projectOcData.blockDesc          =  data.policyOc.project.blockDesc;
          this.projectOcData.latitude           =  data.policyOc.project.latitude;
          this.projectOcData.longitude          =  data.policyOc.project.longitude;
          this.projectOcData.totalSi            =  data.policyOc.project.totalSi;
          this.projectOcData.objectId           =  data.policyOc.project.objectId;
          this.projectOcData.objectDesc         =  data.policyOc.project.objectDesc;
          this.projectOcData.site               =  data.policyOc.project.site;
          this.projectOcData.duration           =  data.policyOc.project.duration;
          this.projectOcData.testing            =  data.policyOc.project.testing;
          this.projectOcData.prCreateUser       =  data.policyOc.project.prCreateUser;
          this.projectOcData.prCreateDate       =  this.ns.toDateTimeString(data.policyOc.project.prCreateDate);
          this.projectOcData.prUpdateUser       =  data.policyOc.project.prUpdateUser;
          this.projectOcData.prUpdateDate       =  this.ns.toDateTimeString(data.policyOc.project.prUpdateDate);

          this.inceptionDateParams.date         =  this.ns.toDateTimeString(this.genInfoOcData.inceptDate).split('T')[0];
          this.inceptionDateParams.time         =  this.ns.toDateTimeString(this.genInfoOcData.inceptDate).split('T')[1].slice(0,-2) + '00'; //temp fix
          this.expiryDateParams.date            =  this.ns.toDateTimeString(this.genInfoOcData.expiryDate).split('T')[0];
          this.expiryDateParams.time            =  this.ns.toDateTimeString(this.genInfoOcData.expiryDate).split('T')[1].slice(0,-2) + '00'; //temp fix
          this.lapseFromParams.date             =  this.genInfoOcData.lapseFrom === null ? '' : this.ns.toDateTimeString(this.genInfoOcData.lapseFrom).split('T')[0];
          this.lapseFromParams.time             =  this.genInfoOcData.lapseFrom === null ? '' : this.ns.toDateTimeString(this.genInfoOcData.lapseFrom).split('T')[1].slice(0,-2) + '00'; //temp fix
          this.lapseToParams.date               =  this.genInfoOcData.lapseTo === null ? '' : this.ns.toDateTimeString(this.genInfoOcData.lapseTo).split('T')[0];
          this.lapseToParams.time               =  this.genInfoOcData.lapseTo === null ? '' : this.ns.toDateTimeString(this.genInfoOcData.lapseTo).split('T')[1].slice(0,-2) + '00'; //temp fix
          this.issueDateParams.date             =  this.ns.toDateTimeString(this.genInfoOcData.issueDate).split('T')[0];
          this.issueDateParams.time             =  this.ns.toDateTimeString(this.genInfoOcData.issueDate).split('T')[1].slice(0,-2) + '00'; //temp fix
          this.distributionDateParams.date      =  this.ns.toDateTimeString(this.genInfoOcData.distDate).split('T')[0];
          this.distributionDateParams.time      =  this.ns.toDateTimeString(this.genInfoOcData.distDate).split('T')[1].slice(0,-2) + '00'; //temp fix
          this.effDateParams.date               =  this.ns.toDateTimeString(this.genInfoOcData.effDate).split('T')[0];
          this.effDateParams.time               =  this.ns.toDateTimeString(this.genInfoOcData.effDate).split('T')[1].slice(0,-2) + '00'; //temp fix
          this.accDateParams.date               =  this.ns.toDateTimeString(this.genInfoOcData.acctDate).split('T')[0];
          this.accDateParams.time               =  this.ns.toDateTimeString(this.genInfoOcData.acctDate).split('T')[1].slice(0,-2) + '00'; //temp fix

          console.log(this.issueDateParams.time);

          this.loading = false;
          setTimeout(a=>{
            this.form.control.markAsPristine();
            this.ns.formGroup.markAsPristine();
            if(this.policyInfo.fromInq=='true' || this.genInfoOcData.status != 1){
              $('input').attr('readonly','readonly');
              $('input[type="checkbox"]').attr('disabled','disabled');
              $('textarea').attr('readonly','readonly');
              $('select').attr('readonly','readonly');
            }
          },0)

          $('#intm').focus();
          $('#intm').blur();
          
        });
  }

  prepareParams(){
    this.genInfoOcData.inceptDate = this.inceptionDateParams.date + 'T' + this.inceptionDateParams.time;
    this.genInfoOcData.expiryDate = this.expiryDateParams.date + 'T' + this.expiryDateParams.time;

    this.genInfoOcData.lapseFrom = this.lapseFromParams.date + 
                                   (String(this.lapseFromParams.date).length === 0 || String(this.lapseFromParams.time).length === 0 ? '' : 'T') + 
                                   this.lapseFromParams.time;

    this.genInfoOcData.lapseTo = this.lapseToParams.date + 
                                 (String(this.lapseToParams.date).length === 0 || String(this.lapseToParams.time).length === 0 ? '' : 'T') + 
                                 this.lapseToParams.time;

    this.genInfoOcData.issueDate = this.issueDateParams.date + 'T' + this.issueDateParams.time;
    this.genInfoOcData.distDate = this.distributionDateParams.date + 'T' + this.distributionDateParams.time;
    this.genInfoOcData.effDate = this.effDateParams.date + 'T' + this.effDateParams.time;
    this.genInfoOcData.acctDate = this.accDateParams.date + 'T' + this.accDateParams.time;
    this.genInfoOcData.updateDate = this.ns.toDateTimeString(0);
    this.genInfoOcData.updateUser = this.currentUser;
    this.projectOcData.prUpdateDate = this.ns.toDateTimeString(0);
    this.projectOcData.prUpdateUser = this.currentUser;

  }

  onClickSave(fromCancel?){
    this.prepareParams();
    if((this.alterationFlag && !this.genInfoOcData.remarks) ||
      this.projectOcData.projDesc.length === 0 || this.genInfoOcData.insuredDesc.length === 0 ||
       this.projectOcData.site.length === 0 ||
       this.genInfoOcData.inceptDate.length < 16 || this.genInfoOcData.expiryDate.length < 16 ||
       this.genInfoOcData.issueDate.length < 16 || this.genInfoOcData.distDate.length < 16 ||
       this.genInfoOcData.effDate.length < 16 || this.genInfoOcData.acctDate.length < 16 ||
       ('CAR' === this.line.toUpperCase() && this.projectOcData.duration.length === 0) ||
       ('EAR' === this.line.toUpperCase() && (this.projectOcData.duration.length === 0 || this.projectOcData.testing.length === 0
         ))){

      //this.dialogMessage = 'Please fill all required fields';
      this.dialogIcon = 'error';
      this.mainSuccess.open();
    }else{
      this.saveParams = {
        "acctDate": this.genInfoOcData.acctDate,
        "altNo": this.genInfoOcData.altNo,
        "cedingId": this.genInfoOcData.cedingId,
        "cessionId": this.genInfoOcData.cessionId,
        "coRefNo": this.genInfoOcData.coRefNo,
        "coSeriesNo": this.genInfoOcData.coSeriesNo,
        "contractorId": this.genInfoOcData.contractorId,
        "createDate": this.genInfoOcData.createDate,
        "createUser": this.genInfoOcData.createUser,
        "currencyCd": this.genInfoOcData.currencyCd,
        "currencyRt": this.genInfoOcData.currencyRt,
        "distDate": this.genInfoOcData.distDate,
        "duration": this.projectOcData.duration,
        "effDate": this.genInfoOcData.effDate,
        "expiryDate": this.genInfoOcData.expiryDate,
        "inceptDate": this.genInfoOcData.inceptDate,
        "insuredDesc": this.genInfoOcData.insuredDesc,
        "intmId": this.genInfoOcData.intmId,
        "issueDate": this.genInfoOcData.issueDate,
        "lapseFrom": this.genInfoOcData.lapseFrom,
        "lapseTo": this.genInfoOcData.lapseTo,
        "lineCd": this.genInfoOcData.lineCd,
        "lineClassCd": this.genInfoOcData.lineClassCd,
        "maxSi": this.projectOcData.totalSi,
        "objectId": this.projectOcData.objectId,
        "ocSeqNo": this.genInfoOcData.ocSeqNo,
        "ocYear": this.genInfoOcData.ocYear,
        "policyIdOc": this.genInfoOcData.policyIdOc,
        "prinId": this.genInfoOcData.prinId,
        "projUpdateDate": this.projectOcData.prUpdateDate,
        "projUpdateUser": this.projectOcData.prCreateUser,
        "projCreateDate": this.projectOcData.prCreateDate,
        "projCreateUser": this.projectOcData.prCreateUser,
        "projDesc": this.projectOcData.projDesc,
        "projId": this.projectOcData.projId,
        "quoteId": this.genInfoOcData.quoteId,
        "refOpPolNo": this.genInfoOcData.refOpPolNo,
        "reinsurerId": this.genInfoOcData.reinsurerId,
        "riBinderNo": this.genInfoOcData.riBinderNo,
        "riskId": this.projectOcData.riskId,
        "site": this.projectOcData.site,
        "status": this.genInfoOcData.status,
        "testing": this.projectOcData.testing,
        "updateDate": this.genInfoOcData.updateDate,
        "updateUser":this.genInfoOcData.updateUser,
        "remarks":this.genInfoOcData.remarks,

        "regionCd":this.projectOcData.regionCd,
        "provinceCd":this.projectOcData.provinceCd,
        "cityCd":this.projectOcData.cityCd,
        "districtCd":this.projectOcData.districtCd,
        "blockCd":this.projectOcData.blockCd,
        "latitude":this.projectOcData.latitude,
        "longitude":this.projectOcData.longitude,

      };
      if(fromCancel === undefined){
        this.mainConfirmSave.confirmModal();
      }else{
        this.saveQuoteGenInfoOc('save');
      }
    }
  }

  saveQuoteGenInfoOc(cancelFlag?){
      this.cancelFlag = cancelFlag !== undefined;
      /*setTimeout(()=>{
        this.dialogIcon = '';
        this.dialogMessage = '';
        $('#successDialog #modalBtn').trigger('click'); 
        this.form.control.markAsPristine();
      }, 100);*/
      this.underwritingService.savePolGenInfoOc(this.saveParams).subscribe((data: any)=>{
        if(data.returnCode === 0){
          this.dialogIcon = 'error';
          this.dialogMessage = 'An unspecified error has occured';
          this.mainSuccess.open();
          if(this.cancelFlag){
            this.cancelFailed = true;
          }else{
            this.cancelFailed = false;
          }
          //this.form.control.markAsPristine();
        }else{
          this.cancelFailed = false;
          this.dialogIcon = '';
          this.dialogMessage = '';
          this.mainSuccess.open();
          this.form.control.markAsPristine();
          this.ns.formGroup.markAsPristine();
        }
      });
  }

  showIntLOV(){
      $('#intLOV #modalBtn').trigger('click');
      $('#intLOV #modalBtn').addClass('ng-dirty')
  }

  setInt(data){
    this.genInfoOcData.intmId = data.intmId;
    this.genInfoOcData.intmName = data.intmName;
    this.ns.lovLoader(data.ev, 0);
    $('#intm').focus();
    $('#intm').blur();
  }

  pad(str, field) {
    if(str === '' || str == null){
      return '';
    }else{
      if(field === 'intm'){
        return String(str).padStart(6, '0');
      }else if(field === 'insured'){
        return String(str).padStart(6, '0');
      }
    }
    
  }

  checkCode(ev, field) {
      this.ns.lovLoader(ev, 1);
      $(ev.target).addClass('ng-dirty');
      if(field === 'intermediary') {
        this.intermediaryLov.checkCode(this.genInfoOcData.intmId, ev);
      }
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  updateExpiryDate() {
    var d = new Date(this.inceptionDateParams.date);
    d.setFullYear(d.getFullYear() + 1);

    this.expiryDateParams.date = this.ns.toDateTimeString(d).split('T')[0];
  }

  // Add deductibles

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


  @ViewChild('dedCancel') dedCancelBtn : CancelButtonComponent;
  @ViewChild('deductiblesTable') deductiblesTable :CustEditableNonDatatableComponent;
  @ViewChild('deductiblesModal') deductiblesModal :ModalComponent;
  @ViewChild('dedSuccess') successDlg: SucessDialogComponent;
  @ViewChild('dedConSave') dedConSave: ConfirmSaveComponent;
  @ViewChild(LovComponent) lov: LovComponent;

  lovCheckBox: Boolean = true;
  passLOVData:any = {
    selector: '',

  }

  showDeductiblesModal(deductibles){
    // setTimeout(()=>{this.getDeductibles();},0);
    // this.modalService.open(deductibles, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    this.getDeductibles();
    this.deductiblesModal.openNoClose();
  }

  getDeductibles(){
    //this.deductiblesTable.loadingFlag = true;
    let params : any = {
      policyId:this.policyInfo.policyIdOc,
      policyNo:'',
      coverCd:0,
      endtCd: 0
    }
    this.underwritingService.getPolDeductiblesOc(params).subscribe(data=>{
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
      this.deductiblesTable.markAsPristine();
    });
  }

  saveDeductibles(cancel?){
    let params:any = {
      policyId:this.policyInfo.policyIdOc,
      saveDeductibleList: [],
      deleteDeductibleList:[]
    };
    params.saveDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && !a.deleted && a.deductibleCd!==null);
    params.deleteDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && a.deleted && a.deductibleCd!==null);
    
    for(let ded of params.saveDeductibleList){
      if((isNaN(ded.deductibleRt) || ded.deductibleRt=="" || ded.deductibleRt==null) && (isNaN(ded.deductibleAmt) || ded.deductibleAmt=="" || ded.deductibleAmt==null)){
        this.dialogIcon = "error";
        setTimeout(a=>this.successDlg.open(),0);
        return null;
      }
    }
    //this.deductiblesTable.loadingFlag = true;
    this.underwritingService.savePolDeductiblesOc(params).subscribe(data=>{
        if(data['returnCode'] == -1){
          this.dialogIcon = '';
          this.successDlg.open();
          if(cancel == undefined)
            this.getDeductibles();
          else
            this.deductiblesModal.closeModal();
        }else{
          this.deductiblesTable.loadingFlag = false;
          this.dialogIcon = 'error';
          this.successDlg.open();
        }
      });
  }

  onDedCancel(){
      if(this.passDataDeductibles.tableData.filter(a=>a.edited || a.deleted).length != 0 ){
        this.dedCancelBtn.saveModal.openNoClose();
      }else{
        this.deductiblesModal.closeModal();
      }
    }


   clickDeductiblesLOV(data){
    if(data.key=="deductibleCd"){
      this.lovCheckBox = true;
      this.passLOVData.selector = 'deductibles';
      this.passLOVData.lineCd = this.genInfoOcData.lineCd;
      this.passLOVData.params = {
        coverCd : 0,
        endtCd: '0',
        activeTag:'Y'
      }
      this.passLOVData.hide = this.passDataDeductibles.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
    }
    this.form.control.markAsDirty();
    this.lov.openLOV();
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
    }
    this.deductiblesTable.refreshTable();
  }

  onClickOkDed(){
    if(this.cancelFlag && this.dialogIcon != 'error'){
     this.dedCancelBtn.onNo()
    }
  }
}
