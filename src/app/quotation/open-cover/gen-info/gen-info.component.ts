import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OcGenInfoInfo } from '@app/_models/QuotationOcGenInfo';
import { QuotationService, MaintenanceService, NotesService } from '@app/_services';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { MtnCedingCompanyComponent } from '@app/maintenance/mtn-ceding-company/mtn-ceding-company.component';
import { MtnIntermediaryComponent } from '@app/maintenance/mtn-intermediary/mtn-intermediary.component';
import { MtnInsuredComponent } from '@app/maintenance/mtn-insured/mtn-insured.component';
import { MtnObjectComponent } from '@app/maintenance/mtn-object/mtn-object.component';

@Component({
  selector: 'app-gen-info',
  templateUrl: './gen-info.component.html',
  styleUrls: ['./gen-info.component.css']
})
export class GenInfoComponent implements OnInit, OnDestroy {

  private sub: any;

   regionDesc: any;
  provinceDesc: any;
  cityDesc: any;
  districtDesc: any;
  blockDesc: any;
  lat: any;
  long: any;

  projectOc: any = {
     quoteIdOc: '',
     projId: 1,
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
     maxSi: '',
     pctShare: '',
     totalValue: '',
     objectId: '',
     objectDesc: '',
     site: '',
     duration: '',
     testing: '',
     createUser: '',
     createDate: '',
     updateUser: '',
     updateDate: ''
  }

  genInfoOcData: any = {
     quoteIdOc: '',
     cessionDesc: '',
     lineClassCdDesc: '',
     openQuotationNo: '',
     lineCd: '',
     lineCdDesc: '',
     year: '',
     seqNo: '',
     revNo: '',
     cedingId: '',
     cessionId: '',
     cedingName: '',
     lineClassCd: '',
     lineClassDesc: '',
     refPolNo: '',
     policyIdOc: '',
     openPolicyNo: '',
     prinId: '',
     principalName: '',
     contractorId: '',
     contractorName: '',
     insuredDesc: '',
     status: '',
     statusDesc: '',
     reinsurerId: '',
     reinsurerName: '',
     intmId: '',
     intmName: '',
     issueDate: '',
     expiryDate: '',
     reqBy: '',
     reqDate: '',
     reqMode: '',
     currencyCd: '',
     currencyRt: '',
     govtTag: '',
     indicativeTag: '',
     preparedBy: '',
     approvedBy: '',
     printedBy: '',
     printDate: '',
     openingParag: '',
     closingParag: '',
     reasonCd: '',
     reasonDesc: '',
     createUser: '',
     createDate: '',
     updateUser: '',
     updateDate: ''
  };

  routerParams: any;

  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(MtnCedingCompanyComponent) cedingCoNotMemberLov: CedingCompanyComponent;
  @ViewChild(MtnIntermediaryComponent) intermediaryLov: MtnIntermediaryComponent;
  @ViewChildren(MtnInsuredComponent) insuredLovs: QueryList<MtnInsuredComponent>;
  @ViewChild(MtnObjectComponent) objectLov: MtnObjectComponent;


  constructor(private route: ActivatedRoute, private quotationService: QuotationService, 
              private http: HttpClient, private mtnService: MaintenanceService, 
              private titleService:Title, private notes: NotesService) {
   }

  @Output() quoteData = new EventEmitter<any>();
  @Input() quoteInfo = {};

  @Input() inquiryFlag: boolean = false;
  loading: boolean = false;

  ngOnInit() {
    this.titleService.setTitle("Quo | General Info");
    //get params from open cover processing or inquiry
    this.sub = this.route.params.subscribe(params => {
      this.routerParams = params;
    });
    this.checkTransaction();
    console.log(this.routerParams);
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  //check if user is adding, editing or viewing general info
  checkTransaction(){
    if(this.routerParams.fromBtn === 'add'){
      console.log('add');
      this.genInfoOcData.issueDate = this.formatDateTime(new Date());
      this.genInfoOcData.expiryDate = this.formatDateTime(new Date().setMonth(new Date().getMonth() + 1));
      this.genInfoOcData.reqDate = this.formatDateTime(new Date());
      this.genInfoOcData.status = '1';
      this.genInfoOcData.statusDesc = 'Requested';
      this.genInfoOcData.cessionId = this.routerParams.cessionId;
      this.genInfoOcData.cessionDesc = this.routerParams.typeOfCession;
      this.genInfoOcData.govtTag = 'N';
      this.genInfoOcData.indicativeTag = 'N';
      this.projectOc.riskId = this.routerParams.riskId;
      this.getRiskMethod(this.routerParams.riskId);
    }else if(this.routerParams.fromBtn === 'edit' || this.routerParams.fromBtn === 'view'){
      this.getGeneralInfoData();
    }
  }

  //get Risk details
  getRiskMethod(risk: any){
      this.projectOc.riskName = this.routerParams.riskName;
      this.projectOc.regionDesc = this.routerParams.regionDesc;  
      this.projectOc.provinceDesc = this.routerParams.provinceDesc;
      this.projectOc.cityDesc = this.routerParams.cityDesc;
      this.projectOc.districtDesc = this.routerParams.districtDesc;
      this.projectOc.blockDesc  = this.routerParams.blockDesc;
      this.projectOc.latitude  = this.routerParams.latitude === 'null' ? '' : this.routerParams.latitude;
      this.projectOc.longitude = this.routerParams.longitude === 'null' ? '' : this.routerParams.longitude;
      if(this.routerParams.fromBtn === 'edit' || this.routerParams.fromBtn === 'view')
        this.quoteDataF();
  }

  getGeneralInfoData(){
    this.loading = true;
    this.quotationService.getOcGenInfoData('',this.plainOpenQuotationNo(this.routerParams.ocQuoteNo)).subscribe((data: any) =>{
          console.log(data);
         this.genInfoOcData.quoteIdOc           = data.quotationOc.quoteIdOc;
         this.projectOc.quoteIdOc           = data.quotationOc.quoteIdOc;
         this.genInfoOcData.cessionDesc         = data.quotationOc.cessionDesc;
         this.genInfoOcData.lineClassCdDesc     = data.quotationOc.lineClassCdDesc;
         this.genInfoOcData.openQuotationNo     = this.routerParams.ocQuoteNo;
         this.genInfoOcData.lineCd              = data.quotationOc.lineCd;
         this.genInfoOcData.lineCdDesc          = data.quotationOc.lineCdDesc;
         this.genInfoOcData.year                = data.quotationOc.year;
         this.genInfoOcData.seqNo               = data.quotationOc.seqNo;
         this.genInfoOcData.revNo               = data.quotationOc.revNo;
         this.genInfoOcData.cedingId            = data.quotationOc.cedingId;
         this.genInfoOcData.cessionId           = data.quotationOc.cessionId;
         this.genInfoOcData.cedingName          = data.quotationOc.cedingName;
         this.genInfoOcData.lineClassCd         = data.quotationOc.lineClassCd;
         this.genInfoOcData.lineClassDesc       = data.quotationOc.lineClassDesc;
         this.genInfoOcData.refPolNo            = data.quotationOc.refPolNo;
         this.genInfoOcData.policyIdOc          = data.quotationOc.policyIdOc;
         this.genInfoOcData.openPolicyNo        = data.quotationOc.openPolicyNo;
         this.genInfoOcData.prinId              = data.quotationOc.prinId;
         this.genInfoOcData.principalName       = data.quotationOc.principalName;
         this.genInfoOcData.contractorId        = data.quotationOc.contractorId;
         this.genInfoOcData.contractorName      = data.quotationOc.contractorName;
         this.genInfoOcData.insuredDesc         = data.quotationOc.insuredDesc;
         this.genInfoOcData.status              = data.quotationOc.status;
         this.genInfoOcData.reinsurerId         = data.quotationOc.reinsurerId;
         this.genInfoOcData.reinsurerName       = data.quotationOc.reinsurerName;
         this.genInfoOcData.intmId              = data.quotationOc.intmId;
         this.genInfoOcData.intmName            = data.quotationOc.intmName;
         this.genInfoOcData.issueDate           = this.formatDateTime(data.quotationOc.issueDate);
         this.genInfoOcData.expiryDate          = this.formatDateTime(data.quotationOc.expiryDate);
         this.genInfoOcData.reqBy               = data.quotationOc.reqBy;
         this.genInfoOcData.reqDate             = this.formatDateTime(data.quotationOc.reqDate);
         this.genInfoOcData.reqMode             = data.quotationOc.reqMode;
         this.genInfoOcData.currencyCd          = data.quotationOc.currencyCd;
         this.genInfoOcData.currencyRt          = data.quotationOc.currencyRt;
         this.genInfoOcData.govtTag             = data.quotationOc.govtTag;
         this.genInfoOcData.indicativeTag       = data.quotationOc.indicativeTag;
         this.genInfoOcData.preparedBy          = data.quotationOc.preparedBy;
         this.genInfoOcData.approvedBy          = data.quotationOc.approvedBy;
         this.genInfoOcData.printedBy           = data.quotationOc.printedBy;
         this.genInfoOcData.printDate           = this.formatDateTime(data.quotationOc.printDate);
         this.genInfoOcData.openingParag        = data.quotationOc.openingParag;
         this.genInfoOcData.closingParag        = data.quotationOc.closingParag;
         this.genInfoOcData.reasonCd            = data.quotationOc.reasonCd;
         this.genInfoOcData.reasonDesc          = data.quotationOc.reasonDesc;
         this.genInfoOcData.createUser          = data.quotationOc.createUser;
         this.genInfoOcData.createDate          = this.formatDateTime(data.quotationOc.createDate);
         this.genInfoOcData.updateUser          = data.quotationOc.updateUser;
         this.genInfoOcData.updateDate          = this.formatDateTime(data.quotationOc.updateDate);
         this.projectOc.projId                  = data.projectOc.projId;
         this.projectOc.projDesc                = data.projectOc.projDesc;
         this.projectOc.riskId                  = data.projectOc.riskId;
         this.projectOc.riskName                = data.projectOc.riskName;
         this.projectOc.regionCd                = data.projectOc.regionCd
         this.projectOc.regionDesc              = data.projectOc.regionDesc
         this.projectOc.provinceCd              = data.projectOc.provinceCd
         this.projectOc.provinceDesc            = data.projectOc.provinceDesc
         this.projectOc.cityCd                  = data.projectOc.cityCd
         this.projectOc.cityDesc                = data.projectOc.cityDesc
         this.projectOc.districtCd              = data.projectOc.districtCd
         this.projectOc.districtDesc            = data.projectOc.districtDesc
         this.projectOc.blockCd                 = data.projectOc.blockCd
         this.projectOc.blockDesc               = data.projectOc.blockDesc
         this.projectOc.latitude                = data.projectOc.latitude
         this.projectOc.longitude               = data.projectOc.longitude
         this.projectOc.maxSi                   = data.projectOc.maxSi;
         this.projectOc.pctShare                = data.projectOc.pctShare;
         this.projectOc.totalValue              = data.projectOc.totalValue;
         this.projectOc.objectId                = data.projectOc.objectId;
         this.projectOc.objectDesc              = data.projectOc.objectDesc;
         this.projectOc.site                    = data.projectOc.site;
         this.projectOc.duration                = data.projectOc.duration;
         this.projectOc.testing                 = data.projectOc.testing;
         this.projectOc.createUser              = data.projectOc.createUser;
         this.projectOc.createDate              = this.formatDateTime(data.projectOc.createDate);
         this.projectOc.updateUser              = data.projectOc.updateUser;
         this.projectOc.updateDate              = this.formatDateTime(data.projectOc.updateDate);
         //this.getRiskMethod(this.projectOc.riskId);
         this.quoteDataF();
         this.loading = false;
    });
    
  }

  //emit necessary data for other tabs
  quoteDataF(){
    this.quoteData.emit({
       quoteIdOc: this.genInfoOcData.quoteIdOc,
       openQuotationNo: this.genInfoOcData.openQuotationNo,
       insured: this.genInfoOcData.insuredDesc,
       riskName: this.projectOc.riskName,
       riskId: this.projectOc.riskId
    });
    console.log(this.genInfoOcData.quoteIdOc);
  }

  //Prepared by Lov
  setUser(data){
    this.genInfoOcData.preparedBy = data.userName;
  }

   getUsersLov(){
    $('#usersLov #modalBtn').trigger('click');
  }
  //end Prepared by Lov

  //line class lov
  getLineClassLov(){
    $('#lineClassIdLov #modalBtn').trigger('click');
  }
  setLineClass(data){
    this.genInfoOcData.lineCd = data.lineCd;
    this.genInfoOcData.lineClassCd  = data.lineClassCd;
    this.genInfoOcData.lineClassDesc  = data.lineClassCdDesc;
    this.loading = false;
  }
  //end line class Lov

  //ceding company lov
  getCedingCoLov(){
    $('#cedingCoIdLov #modalBtn').trigger('click');
  }
  setCedingCo(data){
    this.genInfoOcData.cedingId  = data.cedingId;
    this.genInfoOcData.cedingName  = data.cedingName;
    this.loading = false;
  }
  //end ceding company lov

  //reinsurance from lov
  getReinsurerLov(){
    $('#reinsurerCoIdLov #modalBtn').trigger('click');
  }
  setReinsurer(data){
    this.genInfoOcData.reinsurerId  = data.coNo;
    this.genInfoOcData.reinsurerName  = data.name;
    this.loading = false;
  }
  //end reinsurance from lov

  //intermediary lov
  getIntmLov(){
    $('#intmIdLov #modalBtn').trigger('click');
  }
  setIntm(data){
    this.genInfoOcData.intmId  = data.intmId;
    this.genInfoOcData.intmName  = data.intmName;
    this.loading = false;
  }
  //end intermediary lov

  //currency lov
  getCurrLov(){
    $('#currIdLov #modalBtn').trigger('click');
  }

  setCurr(data){
    this.genInfoOcData.currencyCd = data.currencyCd;
    this.genInfoOcData.currencyRt = data.currencyRt;
    this.loading = false;
  }
  //end currency lov

  //govtTag checker
  govtTagMethod(event){
    if(this.genInfoOcData.govtTag === 'Y'){
      this.genInfoOcData.govtTag = 'N';
    }else{
      this.genInfoOcData.govtTag = 'Y';
    }
  }
  //end govtTag checker

  //indicativeTag checker
  indTagMethod(event){
    if(this.genInfoOcData.indicativeTag === 'Y'){
      this.genInfoOcData.indicativeTag = 'N';
    }else{
      this.genInfoOcData.indicativeTag = 'Y';
    }
  }
  //end indicativeTag checker

  //principal and contractor lov
  getPrinLov(){
    $('#prinIdLov  #modalBtn').trigger('click');
  }
  setPrin(data){
   this.genInfoOcData.prinId  = data.insuredId;
   this.genInfoOcData.principalName  = data.insuredName;
   this.insuredContent();
   this.loading = false;
  }
  getConLov(){
    $('#conIdLov  #modalBtn').trigger('click');
  }
  setCon(data){
    this.genInfoOcData.contractorId  = data.insuredId;
    this.genInfoOcData.contractorName  = data.insuredName;
    this.insuredContent();
    this.loading = false;
  }
  insuredContent(){
    if(this.genInfoOcData.principalName != "" && this.genInfoOcData.contractorName != ""){
      this.genInfoOcData.insuredDesc = ((this.genInfoOcData.principalName === null) ? '' : this.genInfoOcData.principalName.trim()) +" / "+((this.genInfoOcData.contractorName === null) ? '': this.genInfoOcData.contractorName.trim());
    }
  }
  //end principal and contractor lov

  //object lov
  getObjLov(){
    $('#objIdLov #modalBtn').trigger('click');
  }
  setObj(data){
    //this.line = data.lineCd;
    this.projectOc.objectId  = data.objectId;
    this.projectOc.objectDesc  = data.description;
    this.loading = false;
  }
  //end object lov

  //quotation wordings lov
  showOpeningWordingLov(){
      $('#wordingOpeningIdLov #modalBtn').trigger('click');
      $('#wordingOpeningIdLov #modalBtn').addClass('ng-dirty');
    }

    setOpeningWording(data) {
      this.genInfoOcData.openingParag = data.wording;
    }

    showClosingWordingLov(){
      $('#wordingClosingIdLov #modalBtn').trigger('click');
      $('#wordingClosingIdLov #modalBtn').addClass('ng-dirty');
    }

    setClosingWording(data) {      
      this.genInfoOcData.closingParag = data.wording;
    }
  //end quotation wordings lov


  //check code for fetching data when you input
  checkCode(field) {
      if(field === 'cedingCo') {
        this.loading = true;
/*<<<<<<< HEAD*/
        this.cedingCoLov.checkCode(this.genInfoOcData.cedingId, 'a');
      } else if(field === 'cedingCoNotMember') { 
        this.cedingCoNotMemberLov.checkCode(this.genInfoOcData.reinsurerId, 'a');
      } else if(field === 'intermediary') {
        this.intermediaryLov.checkCode(this.genInfoOcData.intmId, 'a');
      } else if(field === 'principal') {
        this.insuredLovs['first'].checkCode(this.genInfoOcData.prinId, '#principalLOV', 'a');
      } else if(field === 'contractor') {
        this.insuredLovs['last'].checkCode(this.genInfoOcData.contractorId, '#contractorLOV', 'a');
      } else if(field === 'object') {
        this.objectLov.checkCode(this.routerParams.line, this.projectOc.objectId, 'a');
/*=======
        this.cedingCoLov.checkCode(this.cedingCoId, 'a');
      } else if(field === 'cedingCoNotMember') { 
        this.cedingCoNotMemberLov.checkCode(this.ocQuoteGenInfo.reinsurerId, 'a');
      } else if(field === 'intermediary') {
        this.intermediaryLov.checkCode(this.mtnIntmId, 'a');
      } else if(field === 'principal') {
        this.insuredLovs['first'].checkCode(this.prinId, '#principalLOV', 'a');
      } else if(field === 'contractor') {
        this.insuredLovs['last'].checkCode(this.conId, '#contractorLOV', 'a');
      } else if(field === 'object') {
        this.objectLov.checkCode(this.line, this.objId, 'a');
>>>>>>> 07dae9c6aa43f898fc3d6fcaad6c941a617680f5*/
      }
    }

  //format Date to DateTime
  formatDateTime(date){
      return this.notes.toDateTimeString(date);
  }

  //parse open quotation no
  plainOpenQuotationNo(data: string){
    var arr = data.split('-');
    if(parseInt(arr[5]) > 99){
      return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]) + '-' + parseInt(arr[5]);
    }else{
      return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]) + '-0' + parseInt(arr[5]);
    }
    
  }

  //save General Info
  saveOpenQuotation(){  
      let params:any = {
        "approvedBy": this.genInfoOcData.approvedBy,
        "cedingId": this.checkIdFormat(this.genInfoOcData.cedingId),
        "cessionId": this.genInfoOcData.cessionId,
        "closingParag": this.genInfoOcData.closingParag,
        "contractorId": this.genInfoOcData.contractorId,
        //"createDate": this.routerParams.fromBtn === 'add' ? new Date().toISOString() : this.genInfoOcData.createDate,
        "createDate": this.routerParams.fromBtn === 'add' ? this.notes.toDateTimeString(0) : this.genInfoOcData.createDate,
        "createUser": this.routerParams.fromBtn === 'add' ? JSON.parse(window.localStorage.currentUser).username : this.genInfoOcData.createUser,
        "currencyCd": this.genInfoOcData.currencyCd,
        "currencyRt": this.genInfoOcData.currencyRt,
        "duration": this.projectOc.duration,
        "expiryDate": this.genInfoOcData.expiryDate,
        "govtTag": this.genInfoOcData.govtTag,
        "indicativeTag": this.genInfoOcData.indicativeTag,
        "insuredDesc": this.genInfoOcData.insuredDesc,
        "intmId": this.genInfoOcData.intmId,
        "issueDate": this.genInfoOcData.issueDate,
        "lineCd": this.genInfoOcData.lineCd,
        "lineClassCd": this.genInfoOcData.lineClassCd,
        "maxSi": this.projectOc.maxSi,
        "objectId": this.checkIdFormat(this.projectOc.objectId),
        "openingParag": this.genInfoOcData.openingParag,
        "pctShare": this.projectOc.pctShare,
        "policyIdOc": this.genInfoOcData.policyIdOc,
        "preparedBy": this.genInfoOcData.preparedBy,
        "prinId": this.genInfoOcData.prinId,
        "printDate": this.genInfoOcData.printDate,
        "printedBy": this.genInfoOcData.printedBy,
        "prjCreateDate": this.routerParams.fromBtn === 'add' ? this.notes.toDateTimeString(0) : this.projectOc.createDate,
        "prjCreateUser": this.routerParams.fromBtn === 'add' ? JSON.parse(window.localStorage.currentUser).username : this.projectOc.createUser,
        "prjUpdateDate": this.notes.toDateTimeString(0),
        "prjUpdateUser": JSON.parse(window.localStorage.currentUser).username,
        "projDesc": this.projectOc.projDesc,
        "projId": this.projectOc.projId,
        "quoteIdOc": this.genInfoOcData.quoteIdOc,
        "reasonCd": /*this.genInfoOcData.reasonCd*/ 'REA',
        "refPolNo": this.genInfoOcData.refPolNo,
        "reinsurerId": this.genInfoOcData.reinsurerId,
        "reqBy": this.genInfoOcData.reqBy,
        "reqDate": this.genInfoOcData.reqDate,
        "reqMode": this.genInfoOcData.reqMode,
        "revNo": this.routerParams.fromBtn === 'add' ? '00' : this.genInfoOcData.revNo,
        "riskId": this.projectOc.riskId,
        "seqNo": this.routerParams.fromBtn === 'add' ? '00000' : this.genInfoOcData.seqNo,
        "site": this.projectOc.site,
        "status": this.genInfoOcData.status,
        "testing": this.projectOc.testing,
        "totalValue": this.projectOc.totalValue,
        "updateDate": this.notes.toDateTimeString(0),
        "updateUser": JSON.parse(window.localStorage.currentUser).username,
        "year": this.routerParams.fromBtn === 'add' ? new Date().getFullYear() : this.genInfoOcData.year
      }
    /*console.log('ProjectOc');
    console.log(this.projectOc);
    console.log('Quotation');
    console.log(this.genInfoOcData);*/
    console.log(params);
    console.log(JSON.stringify(params));
    if(this.validate()){
      this.quotationService.saveQuoteGeneralInfoOc(JSON.stringify(params)).subscribe((data: any) =>{
        console.log(data);
      });
    }else{
      console.log('Please fill all required fields');
    }
  }

  //validates params before going to web service
  validate(){
    //Validate Required fields on every line code
    if(this.genInfoOcData.issueDate == ''    || this.genInfoOcData.expiryDate == '' || this.genInfoOcData.lineClassCd == ''  ||
       this.genInfoOcData.cedingId == ''     || this.genInfoOcData.prinId == ''     || this.genInfoOcData.contractorId == '' ||
       this.genInfoOcData.insuredDesc == ''  || this.projectOc.objectId == ''       || this.projectOc.projectDesc == ''      ||
       this.projectOc.site == ''             || this.projectOc.duration == ''       || this.genInfoOcData.openingParag == '' ||
       this.genInfoOcData.closingParag == '' || this.genInfoOcData.currencyCd == '' || this.genInfoOcData.currencyRt == ''
      ){
      return false;
    }else{
      return true;
    }

    //Validate Required fields on a specific line code
    if(this.genInfoOcData.lineCd === 'CAR'){

    }
    else if(this.genInfoOcData.lineCd === 'EAR'){
      if(this.projectOc.testing == ''){
        return false;
      }else{
        return true;
      }
    }
  }


  //temporary fix for leading zeroes
  checkIdFormat(id: any){
    if(parseInt(id) > 99){
      return id;
    }else{
      if(parseInt(id) > 9){
        return '0'+id;
      }
      else if(parseInt(id) < 9){
        return '00'+id;
      }
    }
  }
}
