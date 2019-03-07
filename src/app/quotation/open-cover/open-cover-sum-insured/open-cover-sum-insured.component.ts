import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { QuotationService } from '@app/_services';
import { MaintenanceService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-open-cover-sum-insured',
  templateUrl: './open-cover-sum-insured.component.html',
  styleUrls: ['./open-cover-sum-insured.component.css']
})
export class OpenCoverSumInsuredComponent implements OnInit {
  quotationNo: string;
  insuredName: string;
  risk: string;
  sub: any;
  quoteNo:string = '';
  quoteIdOc: any;
  riskId: any;

  coverageOcData: any = {
    currencyCd: null,
    currencyRt: null,
    maxSi: null,
    pctShare: null,
    pctPml: null,
    totalValue: null,
    createUser: 'ETC',
    createDate:  new Date(),
    updateUser:  'MBM',
    updateDate:  new Date()
  }

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  dialogMessage:string ;
  dialogIcon: string;
  cancelFlag:boolean;

  constructor(private quotationService: QuotationService, private titleService: Title, private maintenanceService: MaintenanceService, 
    private route: ActivatedRoute) { }

  ngOnInit() {
      /*this.sub = this.route.params.subscribe(params => {
        this.quotationNo = params["quotationNo"];
        this.quoteNo = this.quotationNo.split(/[-]/g)[0]
        for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
         this.quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
       } 
      });*/
      this.getCoverageOc();
  }

  getCoverageOc(){
    this.quotationService.getCoverageOc('2', 'OC-EAR-2018-1001-2-2323').subscribe((data: any) => {
          this.coverageOcData.currencyCd = data.quotationOc.projectOc.coverageOc.currencyCd;
          this.coverageOcData.currencyRt = data.quotationOc.projectOc.coverageOc.currencyRt;
          this.coverageOcData.maxSi = data.quotationOc.projectOc.coverageOc.maxSi;
          this.coverageOcData.pctShare = data.quotationOc.projectOc.coverageOc.pctShare;
          this.coverageOcData.pctPml = data.quotationOc.projectOc.coverageOc.pctPml;
          this.coverageOcData.totalValue = data.quotationOc.projectOc.coverageOc.totalValue;
          this.quoteIdOc = data.quotationOc.quoteIdOc;
          this.riskId = data.quotationOc.projectOc.riskId;
          setTimeout(()=>{
            $('[appcurrencyrate]').focus();
            $('[appcurrencyrate]').blur();
            $('[appOtherRates]').focus();
            $('[appOtherRates]').blur();
            $('[appCurrency]').focus();
            $('[appCurrency]').blur();
            
          },0);
      });
  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.coverageOcData.quoteIdOc = this.quoteIdOc;
    this.coverageOcData.projId = 2;
    this.coverageOcData.riskId = this.riskId;
    this.quotationService.saveQuoteCoverageOc(2,2,this.coverageOcData).subscribe((data)=>{
      console.log(data)
      if(data['returnCode'] == 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            $('#sum-insured #successModalBtn').trigger('click');
          } else{
            this.dialogMessage="";
            this.dialogIcon = "";
            this.getCoverageOc();
            $('#sum-insured #successModalBtn').trigger('click');
            $('.ng-dirty').removeClass('ng-dirty');
          }
    });

  }

  showCurrencyModal(){
    $('#currencyModal #modalBtn').trigger('click');
  }

  setCurrency(data){
    this.coverageOcData.currencyAbbr = data.currencyAbbr;
    this.coverageOcData.currencyRt = data.currencyRt;
    this.coverageOcData.currencyCd = data.currencyCd;
  }



  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }


}
