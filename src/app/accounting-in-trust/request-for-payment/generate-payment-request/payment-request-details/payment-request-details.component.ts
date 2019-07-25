import { Component, OnInit, Input, ViewChild } from '@angular/core';
//import { PaymentToAdjusters, PaymentToOtherParty, PaymentToCedingCompany, PremiumReturn, AROthers, PaymentOfSeviceFee, TreatyBalance } from '@app/_models';
import { AccountingService, MaintenanceService, NotesService, ClaimsService } from '../../../../_services';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css']
})
export class PaymentRequestDetailsComponent implements OnInit {
  @Input() rowData : any;
  @ViewChild('clmLov') clmLov : ModalComponent;

  cedingCompanyData: any = {
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

  passDataClmHistoryLov  : any = {
    tableData     : [],
    tHeader       : ['Claim No.','Hist No.','Hist Category','Hist Type','Reserve','Paid Amount'],
    dataTypes     : ['text', 'sequence-2', 'text', 'text', 'currency', 'currency'],
    nData: {
      claimNo        : '',
      histNo         : '',
      histCatDesc    : '',
      histTypeDesc   : '',
      reserveAmt     : '',
      reqAmt         : ''
    },
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 1,
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [true,true,true,true,true,true],
    widths        : ['auto','auto','auto','auto','auto','auto'],
    keys          : ['claimNo','histNo','histCatDesc','histTypeDesc','reserveAmt','paytAmt']
  };

  tranTypeList : any;
  tabTitle     : string = '';

  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService, private clmService: ClaimsService) {
  }

  ngOnInit() {
    console.log(this.rowData);
    this.rowData.reqDate = this.ns.toDateTimeString(this.rowData.reqDate);
    this.getPrqTrans();
    this.getClmHistory();
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
    this.clmLov.openNoClose();  
  }

  getClmHistory(){
    this.clmService.getClaimHistory()
    .subscribe(data => {
      console.log(data);
      var rec = data['claimReserveList'].map(e => e.clmHistory);
      var list = [];
      //this.passDataClmHistoryLov.tableData = this.passDataClmHistoryLov.tableData.map(e => e.filter(e2 => e2.histCategory == 'L'));
      rec.forEach(e => {
        list.push(e.filter(el => el.histCategory == 'L').map(el => { return el }));
      });
      console.log(list);
      //console.log(this.passDataClmHistoryLov.tableData);
    });
  }
}
