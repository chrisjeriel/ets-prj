import { Component, OnInit, Input } from '@angular/core';
//import { PaymentToAdjusters, PaymentToOtherParty, PaymentToCedingCompany, PremiumReturn, AROthers, PaymentOfSeviceFee, TreatyBalance } from '@app/_models';
import { AccountingService, MaintenanceService,NotesService } from '../../../../_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css']
})
export class PaymentRequestDetailsComponent implements OnInit {
  @Input() rowData : any;

  CedingCompanyData: any = {
  	tableData     : [],
  	tHeader       : ['Claim No.','Hist No.','Hist Category','Hist Type','Payment For', 'Insured', 'Ex-Gratia','Curr','Curr Rate','Reserve Amount','Payment Amount','Payment Amount (PHP)'],
    dataTypes     : ['lov-input', 'sequence-2', 'text', 'text', 'text', 'text', 'checkbox','text', 'percent','currency', 'currency', 'currency'],
    magnifyingGlass : ['claimNo'],
  	nData: {
      claimNo        : '',
      histNo         : '',
      histCatDesc    : '',
      histTypeDesc   : '',
      paymentFor     : '',
      insuredDesc    : '',
      exGratia       : '',
      currCd         : '',
      currRate       : '',
      reserveAmt     : '',
      reqAmt         : '',
      localAmt       : '',
      showMG         : 1
    },
  	paginateFlag  : true,
  	infoFlag      : true,
  	pageID        : 1,
  	checkFlag     : true,
  	addFlag       : true,
  	deleteFlag    : true,
    uneditable    : [false,true,true,true,false,true,true,true,true,true,false,false],
  	total         : [null, null, null, null,null, null, null,null, 'Total', 'reserveAmt', 'reqAmt', 'localAmt'],
    widths        : [130,120, 120,200,200,1,1,1,1,85,120,120,120],
    keys          : ['claimNo','histNo','histCatDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currCd','currRate','reserveAmt','reqAmt','localAmt']
  };

  tranTypeList : any;
  tabTitle     : string = '';

  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService) {
  }

  ngOnInit() {
    console.log(this.rowData);
    this.rowData.reqDate = this.ns.toDateTimeString(this.rowData.reqDate);
    this.getPrqTrans();
  }

  getPrqTrans(){
    this.acctService.getAcitPrqTrans(this.rowData.reqId,'')
    .subscribe(data => {
      console.log(data);
    });
  }

  showLOV(event){
    console.log(event);
    console.log('LOV');
  }
}
