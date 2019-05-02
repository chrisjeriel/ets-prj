import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService } from '../../../_services';
import { MtnIntermediaryComponent } from '@app/maintenance/mtn-intermediary/mtn-intermediary.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { FormsModule }   from '@angular/forms';

@Component({
  selector: 'app-pol-gen-info-open-cover',
  templateUrl: './pol-gen-info-open-cover.component.html',
  styleUrls: ['./pol-gen-info-open-cover.component.css']
})
export class PolGenInfoOpenCoverComponent implements OnInit {

  line: string;
  loading: boolean = false;
  cancelFlag: boolean = false;

  dialogMessage: string = '';
  dialogIcon: string = '';

  @Input() policyInfo : any;

  @ViewChild(MtnIntermediaryComponent) intermediaryLov: MtnIntermediaryComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('myForm') form:any;

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

  constructor( private modalService: NgbModal, private underwritingService: UnderwritingService, private ns: NotesService) { }

  ngOnInit() {
    this.line = this.policyInfo.line;
    //this.line = 'EAR';
    this.loading = true;
    this.retrievePolGenInfoOc(this.policyInfo.policyIdOc, this.policyInfo.policyNo);
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
          this.genInfoOcData.lapseFrom          =  data.policyOc.lapseFrom === null ? data.policyOc.inceptDate : data.policyOc.lapseFrom;
          this.genInfoOcData.lapseTo            =  data.policyOc.lapseTo === null ? data.policyOc.expiryDate : data.policyOc.lapseTo;
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
          this.inceptionDateParams.time         =  this.ns.toDateTimeString(this.genInfoOcData.inceptDate).split('T')[1];
          this.expiryDateParams.date            =  this.ns.toDateTimeString(this.genInfoOcData.expiryDate).split('T')[0];
          this.expiryDateParams.time            =  this.ns.toDateTimeString(this.genInfoOcData.expiryDate).split('T')[1];
          this.lapseFromParams.date             =  this.ns.toDateTimeString(this.genInfoOcData.lapseFrom).split('T')[0];
          this.lapseFromParams.time             =  this.ns.toDateTimeString(this.genInfoOcData.lapseFrom).split('T')[1];
          this.lapseToParams.date               =  this.ns.toDateTimeString(this.genInfoOcData.lapseTo).split('T')[0];
          this.lapseToParams.time               =  this.ns.toDateTimeString(this.genInfoOcData.lapseTo).split('T')[1];
          this.issueDateParams.date             =  this.ns.toDateTimeString(this.genInfoOcData.issueDate).split('T')[0];
          this.issueDateParams.time             =  this.ns.toDateTimeString(this.genInfoOcData.issueDate).split('T')[1];
          this.distributionDateParams.date      =  this.ns.toDateTimeString(this.genInfoOcData.distDate).split('T')[0];
          this.distributionDateParams.time      =  this.ns.toDateTimeString(this.genInfoOcData.distDate).split('T')[1];
          this.effDateParams.date               =  this.ns.toDateTimeString(this.genInfoOcData.effDate).split('T')[0];
          this.effDateParams.time               =  this.ns.toDateTimeString(this.genInfoOcData.effDate).split('T')[1];
          this.accDateParams.date               =  this.ns.toDateTimeString(this.genInfoOcData.acctDate).split('T')[0];
          this.accDateParams.time               =  this.ns.toDateTimeString(this.genInfoOcData.acctDate).split('T')[1];

          this.loading = false;
          setTimeout(a=>{
            this.form.control.markAsPristine();
            if(this.policyInfo.fromInq=='true'){
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
    this.genInfoOcData.lapseFrom = this.lapseFromParams.date + 'T' + this.lapseFromParams.time;
    this.genInfoOcData.lapseTo = this.lapseToParams.date + 'T' + this.lapseToParams.time;
    this.genInfoOcData.issueDate = this.issueDateParams.date + 'T' + this.issueDateParams.time;
    this.genInfoOcData.distDate = this.distributionDateParams.date + 'T' + this.distributionDateParams.time;
    this.genInfoOcData.effDate = this.effDateParams.date + 'T' + this.effDateParams.time;
    this.genInfoOcData.acctDate = this.accDateParams.date + 'T' + this.accDateParams.time;
    this.genInfoOcData.updateDate = this.ns.toDateTimeString(0);
    this.genInfoOcData.updateUser = this.currentUser;
    this.projectOcData.prUpdateDate = this.ns.toDateTimeString(0);
    this.projectOcData.prUpdateUser = this.currentUser;

  }

  onClickSave(){
    this.prepareParams();
    if(this.projectOcData.projDesc.length === 0 || this.genInfoOcData.insuredDesc.length === 0 ||
       this.projectOcData.site.length === 0 ||
       this.genInfoOcData.inceptDate.length < 16 || this.genInfoOcData.expiryDate.length < 16 ||
       this.genInfoOcData.lapseFrom.length < 16 || this.genInfoOcData.lapseTo.length < 16 ||
       this.genInfoOcData.issueDate.length < 16 || this.genInfoOcData.distDate.length < 16 ||
       this.genInfoOcData.effDate.length < 16 || this.genInfoOcData.acctDate.length < 16 ||
       ('CAR' === this.line.toUpperCase() && this.projectOcData.duration.length === 0) ||
       ('EAR' === this.line.toUpperCase() && (this.projectOcData.duration.length === 0 || this.projectOcData.testing.length === 0))){

      this.dialogMessage = 'Please fill all required fields';
      this.dialogIcon = 'info';
      $('#successDialog #modalBtn').trigger('click');
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

        "regionCd":this.projectOcData.regionCd,
        "provinceCd":this.projectOcData.provinceCd,
        "cityCd":this.projectOcData.cityCd,
        "districtCd":this.projectOcData.districtCd,
        "blockCd":this.projectOcData.blockCd,
        "latitude":this.projectOcData.latitude,
        "longitude":this.projectOcData.longitude,

      };

      $('#confirm-save #modalBtn2').trigger('click');
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
          $('#successDialog #modalBtn').trigger('click'); 
          //this.form.control.markAsPristine();
        }else{
          this.dialogIcon = '';
          this.dialogMessage = '';
          $('#successDialog #modalBtn').trigger('click'); 
          this.form.control.markAsPristine();
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

}
