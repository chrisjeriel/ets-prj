import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService } from '../../../_services';

@Component({
  selector: 'app-pol-gen-info-open-cover',
  templateUrl: './pol-gen-info-open-cover.component.html',
  styleUrls: ['./pol-gen-info-open-cover.component.css']
})
export class PolGenInfoOpenCoverComponent implements OnInit {

  line: string;

  @Input() policyInfo : any;

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

  constructor( private modalService: NgbModal, private underwritingService: UnderwritingService, private ns: NotesService) { }

  ngOnInit() {
    console.log(this.policyInfo);
    this.line = this.policyInfo.line;
    this.retrievePolGenInfoOc(this.policyInfo.policyIdOc, this.policyInfo.policyNo);
  }

  showItemInfoModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  retrievePolGenInfoOc(policyIdOc: string, openPolicyNo: string){
      this.underwritingService.getPolGenInfoOc(policyIdOc, openPolicyNo).subscribe((data: any)=>{
          console.log(data);
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
          this.projectOcData.prCreateDate       =  data.policyOc.project.prCreateDate;
          this.projectOcData.prUpdateUser       =  data.policyOc.project.prUpdateUser;
          this.projectOcData.prUpdateDate       =  data.policyOc.project.prUpdateDate;

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

          console.log(this.genInfoOcData);
          console.log(this.projectOcData);
        });
  }

}
