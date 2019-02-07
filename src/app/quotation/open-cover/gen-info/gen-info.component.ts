import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OcGenInfoInfo } from '@app/_models/QuotationOcGenInfo';
import { QuotationService } from '@app/_services';
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

  currencyAbbr: string = "";
  currencyRt: number = 0;

  constructor(private route: ActivatedRoute, private quotationService: QuotationService, private http: HttpClient) {
   }

  b;
  infos:any = [];
  govCheckbox: boolean;
  indCheckbox: boolean;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
      this.from = params['from'];
      if (this.from == "oc-inquiry") {
        this.typeOfCession = params['typeOfCession'];
      }
    });

    this.checkTypeOfCession();

    this.ocQuoteGenInfo = new OcGenInfoInfo();
    //this.quotationService.getOcGenInfoData().subscribe(a => this.b = a);
    this.quotationService.getOcGenInfoData()
        .subscribe(val => 
            {
              console.log(val);
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
                  this.ocQuoteGenInfo.govtTag         = 'y';
                  this.govCheckbox = this.checkTag(this.ocQuoteGenInfo.govtTag);
                  this.ocQuoteGenInfo.indicativeTag   = "n";
                  this.indCheckbox = this.checkTag(this.ocQuoteGenInfo.indicativeTag);
                  this.ocQuoteGenInfo.prinId          = i.prinId;
                  this.ocQuoteGenInfo.principalName   = i.principalName;
                  this.ocQuoteGenInfo.contractorId    = i.contractorId;
                  this.ocQuoteGenInfo.contractorName  = i.contractorName;
                  this.ocQuoteGenInfo.insuredDesc     = i.insuredDesc;
                  this.ocQuoteGenInfo.projDesc        = i.projectOc.projDesc;
                  this.ocQuoteGenInfo.objectId        = i.projectOc.objectId;
                  this.ocQuoteGenInfo.site            = i.projectOc.site;
                  this.ocQuoteGenInfo.duration        = i.projectOc.duration;
                  this.ocQuoteGenInfo.testing        = i.projectOc.testing;
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
             }

            }
      );

    

  }

  checkTag(tag:string){
    if(tag === "Y" || tag === "y"){
      return true;
    }else{
      return false;
    }
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

  showCurrencyModal(){
    $('#currencyModal #modalBtn').trigger('click');
  }

  setCurrency(data){
    this.currencyAbbr = data.currencyAbbr;
    this.currencyRt = data.currencyRt;
  }
}
