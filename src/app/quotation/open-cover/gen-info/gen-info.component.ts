import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OcGenInfoInfo } from '@app/_models/QuotationOcGenInfo';
import { QuotationService, MaintenanceService } from '@app/_services';
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
export class GenInfoComponent implements OnInit {
  private ocQuoteGenInfo: OcGenInfoInfo;

  typeOfCession: string = "";
  line: string;
  private sub: any;
  from: string;
  ocQuoteNo: string;

  currencyAbbr: string = "";
  currencyRt: number = 0;
  prinId: number;
  prinName: string;
  conId:number;
  conName:string;
  objId:number;
  objName:string;
  openingWording:string;
  closingWording:string;

  riskId:string;
  riskName:string;
  regionDesc:string;
  provinceDesc:string;
  cityDesc:string;
  districtDesc:string;
  blockDesc:string;
  lat:string;
  long:string;

  cedingCoId:number;
  cedingCoName:string;

  linee:string;
  lineClassCd:string;
  lineClassDescr:string;

  mtnIntmId:number;
  mtnIntmName:string;

  insured:string;

  loading:boolean = true;

  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(MtnCedingCompanyComponent) cedingCoNotMemberLov: CedingCompanyComponent;
  @ViewChild(MtnIntermediaryComponent) intermediaryLov: MtnIntermediaryComponent;
  @ViewChildren(MtnInsuredComponent) insuredLovs: QueryList<MtnInsuredComponent>;
  @ViewChild(MtnObjectComponent) objectLov: MtnObjectComponent;


  constructor(private route: ActivatedRoute, private quotationService: QuotationService, private http: HttpClient, private mtnService: MaintenanceService, private titleService:Title) {
   }

   sampleId:string ="";
   sampleNo:string ="OC-DOS-2018-1001-2-2323";
  b;
  infos:any = [];
  govCheckbox: boolean;
  indCheckbox: boolean;
  fromBtn:string;

  ngOnInit() {
    this.titleService.setTitle("Quo | General Info");
    this.ocQuoteGenInfo = new OcGenInfoInfo();

    this.sub = this.route.params.subscribe(params => {
          this.line = params['line'];
          this.from = params['from'];
          this.ocQuoteNo = (params['ocQuoteNo']);
          this.fromBtn  = params['fromBtn'];

          if (this.from === "oc-inquiry") {
            this.typeOfCession = params['typeOfCession'];
          }else if(this.from === "oc-processing"){
            this.typeOfCession = params['typeOfCession'];
            
            if(this.fromBtn === 'add'){
               this.riskId = params['riskId'];
               this.mtnService.getMtnRisk(this.riskId)
                            .subscribe(val => {
                              this.riskName = val['risk'].riskName;
                              this.regionDesc = val['risk'].regionDesc;
                              this.provinceDesc = val['risk'].provinceDesc;
                              this.cityDesc = val['risk'].cityDesc;
                              this.districtDesc = val['risk'].districtDesc;
                              this.blockDesc  = val['risk'].blockDesc;
                              this.lat  = val['risk'].latitude;
                              this.long = val['risk'].longitude;
                            });
                this.ocQuoteGenInfo.openQuotationNo = this.line +'-'+ new Date().getFullYear();
            }else{
                this.quotationService.getOcGenInfoData(this.sampleId,this.ocQuoteNo)
                    .subscribe(val => 
                        {
                          //this.ocQuoteGenInfo = new OcGenInfoInfo(i.openQuotationNo);
                          this.loading = false;
                          for(let i of val['quotationOc']) {
                            console.log(i.projectOc);
                              this.ocQuoteGenInfo.openQuotationNo = i.openQuotationNo;
                              this.ocQuoteGenInfo.refPolNo        = i.refPolNo;
                              this.ocQuoteGenInfo.openPolicyNo    = i.openPolicyNo;
                              this.ocQuoteGenInfo.lineClassDesc   = i.lineCdDesc;
                              this.ocQuoteGenInfo.status          = i.status;
                              this.ocQuoteGenInfo.cedingId        = i.cedingId;
                              this.ocQuoteGenInfo.cedingName      = i.cedingName;
                              this.ocQuoteGenInfo.reinsurerId     = i.reinsurerId;
                              this.ocQuoteGenInfo.reinsurerName   = i.reinsurerName;
                              this.ocQuoteGenInfo.intmId          = i.intmId;
                              this.ocQuoteGenInfo.intmName        = i.intmName;
                              this.ocQuoteGenInfo.issueDate       = this.formatDate(i.issueDate);
                              this.ocQuoteGenInfo.expiryDate      = this.formatDate(i.expiryDate);
                              this.ocQuoteGenInfo.reqBy           = i.reqBy;
                              this.ocQuoteGenInfo.reqDate         = this.formatDate(i.reqDate);
                              this.ocQuoteGenInfo.reqMode         = i.reqMode;
                              this.ocQuoteGenInfo.currencyCd      = i.currencyCd;
                              this.ocQuoteGenInfo.currencyRt      = i.currencyRt;
                              this.ocQuoteGenInfo.govtTag         = i.govtTag;
                              this.govCheckbox = ((this.ocQuoteGenInfo.govtTag === 'y' || this.ocQuoteGenInfo.govtTag ==='Y') ? true: false);
                              this.ocQuoteGenInfo.indicativeTag   = i.indicativeTag;
                              this.indCheckbox = ((this.ocQuoteGenInfo.indicativeTag === 'a' || this.ocQuoteGenInfo.indicativeTag === 'A') ? true : false);
                              this.ocQuoteGenInfo.prinId          = i.prinId;
                              this.ocQuoteGenInfo.principalName   = i.principalName;
                              this.ocQuoteGenInfo.contractorId    = i.contractorId;
                              this.ocQuoteGenInfo.contractorName  = i.contractorName;
                              this.ocQuoteGenInfo.insuredDesc     = i.insuredDesc;
                              this.ocQuoteGenInfo.projDesc        = i.projectOc.projDesc;
                              this.ocQuoteGenInfo.objectId        = i.projectOc.objectId;
                              this.ocQuoteGenInfo.site            = i.projectOc.site;
                              this.ocQuoteGenInfo.duration        = i.projectOc.duration;
                              this.ocQuoteGenInfo.testing         = i.projectOc.testing;
                              this.ocQuoteGenInfo.openingParag    = i.openingParag;
                              this.ocQuoteGenInfo.closingParag    = i.closingParag;
                              this.ocQuoteGenInfo.maxSi           = i.projectOc.maxSi;
                              this.ocQuoteGenInfo.pctShare        = i.projectOc.pctShare;
                              this.ocQuoteGenInfo.totalValue      = i.projectOc.totalValue;
                              this.ocQuoteGenInfo.preparedBy      = i.preparedBy;
                              this.ocQuoteGenInfo.approvedBy      = i.approvedBy;
                              this.ocQuoteGenInfo.printDate       = this.formatDate(i.printDate);
                              this.ocQuoteGenInfo.printedBy       = i.printedBy;
                              this.ocQuoteGenInfo.createUser      = i.createUser;
                              this.ocQuoteGenInfo.createDate      = this.formatDate(i.createDate);
                              this.ocQuoteGenInfo.updateUser      = i.updateUser;
                              this.ocQuoteGenInfo.updateDate      = this.formatDate(i.updateDate);
                              this.ocQuoteGenInfo.riskId          = i.projectOc.riskId;
                              this.ocQuoteGenInfo.cessionId       = i.cessionId;
                              this.ocQuoteGenInfo.lineClassCd     = i.lineClassCd;
                              this.ocQuoteGenInfo.lineCd          = i.lineCd;
                              this.ocQuoteGenInfo.lineClassDesc   = i.lineClassDesc;
                            }

                            this.lineClassDescr  = this.ocQuoteGenInfo.lineClassDesc;
                            this.cedingCoId   = Number(this.ocQuoteGenInfo.cedingId);
                            this.cedingCoName = this.ocQuoteGenInfo.cedingName;
                            this.currencyAbbr = this.ocQuoteGenInfo.currencyCd;
                            this.currencyRt   = Number(this.ocQuoteGenInfo.currencyRt);
                            this.mtnIntmId    = Number(this.ocQuoteGenInfo.intmId);
                            this.mtnIntmName  = this.ocQuoteGenInfo.intmName;
                            this.prinId       = Number(this.ocQuoteGenInfo.prinId);
                            this.prinName     = this.ocQuoteGenInfo.principalName;
                            this.conId        = Number(this.ocQuoteGenInfo.contractorId);
                            this.conName      = this.ocQuoteGenInfo.contractorName;
                            this.objId        = Number(this.ocQuoteGenInfo.objectId);
                            //this.line         = this.ocQuoteGenInfo.lineCd;
                            this.openingWording = this.ocQuoteGenInfo.openingParag;
                            this.closingWording = this.ocQuoteGenInfo.closingParag;

                            

                            this.mtnService.getMtnRisk(this.ocQuoteGenInfo.riskId)
                                    .subscribe(val => {
                                      this.riskName = val['risk'].riskName;
                                      this.regionDesc = val['risk'].regionDesc;  
                                      this.provinceDesc = val['risk'].provinceDesc;
                                      this.cityDesc = val['risk'].cityDesc;
                                      this.districtDesc = val['risk'].districtDesc;
                                      this.blockDesc  = val['risk'].blockDesc;
                                      this.lat  = val['risk'].latitude;
                                      this.long = val['risk'].longitude;
                                    });
                           
                            //  console.log(this.ocQuoteGenInfo.cessionId + ">>>> labas ");
                            // this.mtnService.getMtnTypeOfCession(this.ocQuoteGenInfo.cessionId)
                            //         .subscribe(val => {
                            //           //this.typeOfCession = val['cession'][0];
                            //           console.log(JSON.stringify(val) + ">>>> HERE !");
                            //                            //console.log(this.typeOfCession + ">>>> LOOB ");

                            //         });
                            this.mtnService.getMtnObject(this.line,this.objId)
                                    .subscribe(val => {
                                     this.objName  = (val['object'][0] === null || val['object'][0] === undefined) ? '' : val['object'][0].description;
                                    });

                            this.insuredContent();
                        }
                  );
                setTimeout(() => {
                $('input[appCurrencyRate]').focus();
                $('input[appCurrencyRate]').blur();
              },0) 
            }
          }
    });
    this.checkTypeOfCession();
   
  }

  insuredContent(){
    if(this.prinName != "" && this.conName != ""){
      this.insured = ((this.prinName === null) ? '' : this.prinName.trim()) +" / "+((this.conName === null) ? '': this.conName.trim());
    }
  }

  formatDate(date){
    console.log(date);
    if(date[1] < 9){
      return date[0] + "-" + '0'+ date[1] + "-" + date[2];
    }else{
      return date[0] + "-" +date[1] + "-" + date[2];
    }
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkTypeOfCession() {
    return (this.typeOfCession.trim().toUpperCase() === 'RETROCESSION') ? true : false;
  }

  getCurrLov(){
    $('#currIdLov #modalBtn').trigger('click');
  }

  setCurr(data){
    this.currencyAbbr = data.currencyAbbr;
    this.currencyRt = data.currencyRt;
    this.loading = false;
  }
  getPrinLov(){
    $('#prinIdLov  #modalBtn').trigger('click');
  }
  setPrin(data){
   this.prinId  = data.insuredId;
   this.prinName  = data.insuredName;
   this.insuredContent();
   this.loading = false;
  }
  getConLov(){
    $('#conIdLov  #modalBtn').trigger('click');
  }
  setCon(data){
    this.conId  = data.insuredId;
    this.conName  = data.insuredName;
    this.insuredContent();
    this.loading = false;
  }
  getObjLov(){
    $('#objIdLov #modalBtn').trigger('click');
  }
  setObj(data){
    this.line = data.lineCd;
    this.objId  = data.objectId;
    this.objName  = data.description;
    this.loading = false;
  }

  getOpeningWordingLov(){
    $('#wordingOpeningIdLov #modalBtn').trigger('click');
  }
  getClosingWordingLov(){
    $('#wordingClosingIdLov #modalBtn').trigger('click');
  }
  setOpeningWording(data){
    this.line = data.lineCd;
    this.openingWording  = data.wording;
  }
  setClosingWording(data){
    this.line = data.lineCd;
    this.closingWording  = data.wording;
  }

  getCedingCoLov(){
    $('#cedingCoIdLov #modalBtn').trigger('click');
  }
  setCedingCo(data){
    this.cedingCoId  = data.coNo;
    this.cedingCoName  = data.name;
    this.loading = false;
  }

  getLineClassLov(){
    $('#lineClassIdLov #modalBtn').trigger('click');
  }
  setLineClass(data){
    this.line = data.lineCd;
    this.lineClassCd  = data.lineClassCd;
    this.lineClassDescr  = data.lineClassCdDesc;
    this.loading = false;
  }

  getIntmLov(){
    $('#intmIdLov #modalBtn').trigger('click');
  }
  setIntm(data){
    this.mtnIntmId  = data.intmId;
    this.mtnIntmName  = data.intmName;
    this.loading = false;
  }


  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }

  checkCode(field) {
      if(field === 'cedingCo') {
        this.loading = true;
        this.cedingCoLov.checkCode(this.cedingCoId);
      } else if(field === 'cedingCoNotMember') { 
        this.cedingCoNotMemberLov.checkCode(this.ocQuoteGenInfo.reinsurerId);
      } else if(field === 'intermediary') {
        this.intermediaryLov.checkCode(this.mtnIntmId);
      } else if(field === 'principal') {
        this.insuredLovs['first'].checkCode(this.prinId, '#principalLOV');
      } else if(field === 'contractor') {
        this.insuredLovs['last'].checkCode(this.conId, '#contractorLOV');
      } else if(field === 'object') {
        this.objectLov.checkCode(this.line, this.objId);
      }
    }
}
