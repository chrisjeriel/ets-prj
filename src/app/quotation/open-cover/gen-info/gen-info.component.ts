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


  constructor(private route: ActivatedRoute, private quotationService: QuotationService, private http: HttpClient) {
   }

  b;
  infos:any = [];
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
              //this.ocQuoteGenInfo = new OcGenInfoInfo(i.openQuotationNo);
              for(let i of val['quotationOc']) {
                console.log(i.projectOc);
                  this.ocQuoteGenInfo.openQuotationNo = i.openQuotationNo;
                  this.ocQuoteGenInfo.refPolNo        = i.refPolNo;
                  this.ocQuoteGenInfo.openPolicyNo    = i.openPolicyNo;
                  this.ocQuoteGenInfo.lineClassCd     = i.lineClassCd;
                  this.ocQuoteGenInfo.status          = i.status;
                  this.ocQuoteGenInfo.cedingName      = i.cedingName;
                  this.ocQuoteGenInfo.intmName        = i.intmName;
                  this.ocQuoteGenInfo.reqBy           = i.reqBy;
                  this.ocQuoteGenInfo.reqDate         = i.reqDate;
                  this.ocQuoteGenInfo.reqMode         = i.reqMode;
                  this.ocQuoteGenInfo.currencyCd      = i.currencyCd;
                  this.ocQuoteGenInfo.currencyRt      = i.currencyRt;
                  this.ocQuoteGenInfo.principalName   = i.principalName;
                  this.ocQuoteGenInfo.contactorName   = i.contactorName;
                  this.ocQuoteGenInfo.insuredDesc     = i.insuredDesc;
                  this.ocQuoteGenInfo.openingParag    = i.openingParag;
                  this.ocQuoteGenInfo.closingParag    = i.closingParag;
                  this.ocQuoteGenInfo.maxSi           = i.projectOc.maxSi;
                  this.ocQuoteGenInfo.pctShare        = i.projectOc.pctShare;
                  this.ocQuoteGenInfo.totalValue      = i.projectOc.totalValue;
                  this.ocQuoteGenInfo.preparedBy      = i.preparedBy;
                  this.ocQuoteGenInfo.approvedBy      = i.approvedBy;
                  this.ocQuoteGenInfo.printDate       = i.printDate;
                  this.ocQuoteGenInfo.printedBy       = i.printedBy;
                  this.ocQuoteGenInfo.createUser      = i.createUser;
                  this.ocQuoteGenInfo.createDate      = i.createDate;
                  this.ocQuoteGenInfo.updateUser      = i.updateUser;
                  this.ocQuoteGenInfo.updateDate      = i.updateDate;
             }

             //for(let i of val['quoationOc'])

            }
      );

    

  }



  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkTypeOfCession() {
    return (this.typeOfCession.trim().toUpperCase() === 'RETROCESSION') ? true : false;
  }
}
