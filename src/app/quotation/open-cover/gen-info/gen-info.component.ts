import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OcGenInfoInfo } from '@app/_models/QuotationOcGenInfo';
import { QuotationService, MaintenanceService } from '@app/_services';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';

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


  constructor(private route: ActivatedRoute, private quotationService: QuotationService, private http: HttpClient, private mtnService: MaintenanceService) {
   }

   sampleId:string ="";
   sampleNo:string ="OC-DOS-2018-1001-2-2323";
  b;
  infos:any = [];
  govCheckbox: boolean;
  indCheckbox: boolean;
  
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
      this.from = params['from'];
      this.ocQuoteNo = (params['ocQuoteNo']);

      if (this.from === "oc-inquiry") {
        this.typeOfCession = params['typeOfCession'];
      }else if(this.from === "oc-processing"){
        this.typeOfCession = params['typeOfCession'];
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
      }
    });
    this.checkTypeOfCession();

    this.ocQuoteGenInfo = new OcGenInfoInfo();
    this.quotationService.getOcGenInfoData(this.sampleId,this.ocQuoteNo)
        .subscribe(val => 
            {
              //this.ocQuoteGenInfo = new OcGenInfoInfo(i.openQuotationNo);
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
                }
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
            }
      );
    

  }

  formatDate(date){
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
  }
  getPrinLov(){
    $('#prinIdLov  #modalBtn').trigger('click');
  }
  setPrin(data){
   this.prinId  = data.insuredId;
   this.prinName  = data.insuredName;
  }
  getConLov(){
    $('#conIdLov  #modalBtn').trigger('click');
  }
  setCon(data){
    this.conId  = data.insuredId;
    this.conName  = data.insuredName;
  }
  getObjLov(){
    $('#objIdLov #modalBtn').trigger('click');
  }
  setObj(data){
    this.line = data.lineCd;
    this.objId  = data.objectId;
    this.objName  = data.description;
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
  }

  getLineClassLov(){
    $('#lineClassIdLov #modalBtn').trigger('click');
  }
  setLineClass(data){
    this.line = data.lineCd;
    this.lineClassCd  = data.lineClassCd;
    this.lineClassDescr  = data.lineClassCdDesc;
  }

  getIntmLov(){
    $('#intmIdLov #modalBtn').trigger('click');
  }
  setIntm(data){
    this.mtnIntmId  = data.intmId;
    this.mtnIntmName  = data.intmName;
  }
}
