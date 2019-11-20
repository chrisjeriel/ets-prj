import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService, ClaimsService } from '../../../../_services';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { MtnClmHistoryLovComponent } from '@app/maintenance/mtn-clm-history-lov/mtn-clm-history-lov.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css'],
  providers: [DatePipe]
})

export class PaymentRequestDetailsComponent implements OnInit {
  @ViewChild('mtnClmHistLov') clmHistLov      : MtnClmHistoryLovComponent;
  @ViewChild('cedCompTbl') cedCompTbl         : CustEditableNonDatatableComponent;
  @ViewChild('inwardTbl') inwardTbl           : CustEditableNonDatatableComponent;
  @ViewChild('treatyTbl') treatyTbl           : CustEditableNonDatatableComponent;
  @ViewChild('invtTbl') invtTbl               : CustEditableNonDatatableComponent;
  @ViewChild('othersTbl') othTbl              : CustEditableNonDatatableComponent; 
  @ViewChild('unappliedTbl') unColTbl         : CustEditableNonDatatableComponent;
  @ViewChild('warnMdl') warnMdl               : ModalComponent;
  @ViewChild('quarEndLov') quarEndLov         : ModalComponent;
  @ViewChild('servfeeMdl') servfeeMdl         : ModalComponent;
  @ViewChild('aginSoaLov') aginSoaLov         : LovComponent; 
  @ViewChild('invtLov') invtLov               : LovComponent;
  @ViewChild('trtyLov') trtyLov               : QuarterEndingLovComponent;

  @ViewChild('canClm') canClm             : CancelButtonComponent;
  @ViewChild('conClm') conClm             : ConfirmSaveComponent;
  @ViewChild('sucClm') sucClm             : SucessDialogComponent;
  @ViewChild('canInw') canInw             : CancelButtonComponent;
  @ViewChild('conInw') conInw             : ConfirmSaveComponent;
  @ViewChild('sucInw') sucInw             : SucessDialogComponent;
  @ViewChild('canTrty') canTrty           : CancelButtonComponent;
  @ViewChild('conTrty') conTrty           : ConfirmSaveComponent;
  @ViewChild('sucTrty') sucTrty           : SucessDialogComponent;
  @ViewChild('canInvt') canInvt           : CancelButtonComponent;
  @ViewChild('conInvt') conInvt           : ConfirmSaveComponent;
  @ViewChild('sucInvt') sucInvt           : SucessDialogComponent;
  @ViewChild('canOth') canOth             : CancelButtonComponent;
  @ViewChild('conOth') conOth             : ConfirmSaveComponent;
  @ViewChild('sucOth') sucOth             : SucessDialogComponent;
  @ViewChild('canUnCol') canUnCol         : CancelButtonComponent;
  @ViewChild('conUnCol') conUnCol         : ConfirmSaveComponent;
  @ViewChild('sucUnCol') sucUnCol         : SucessDialogComponent;
  @ViewChild('canServFee') canServFee     : CancelButtonComponent;
  @ViewChild('conServFee') conServFee     : ConfirmSaveComponent;
  @ViewChild('sucServFee') sucServFee     : SucessDialogComponent;

  @ViewChild('servFeeMainTbl') servFeeMainTbl: CustEditableNonDatatableComponent;
  @ViewChild('servFeeSubTbl') servFeeSubTbl: CustEditableNonDatatableComponent;

  @Input() rowData : any = {
    reqId : ''
  };


  cedingCompanyData: any = {
    tableData     : [],
    tHeader       : ['Claim No.','Hist No.','Hist Category','Hist Type','Payment For', 'Insured', 'Ex-Gratia','Curr','Curr Rate','Reserve Amount','Approved Amount','Payment Amount','Payment Amount (PHP)'],
    dataTypes     : ['lov-input', 'sequence-2', 'text', 'text', 'text', 'text', 'checkbox','text', 'percent','currency','currency','currency','currency'],
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
    pageID        : 'cedingCompanyData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : false,
    addFlag       : false,
    deleteFlag    : false,
    uneditable    : [true,true,true,true,true,true,true,true,true,true,true,true,true],
    total         : [null, null, null, null,null, null, null,null, 'Total', 'reserveAmt','approvedAmt','paytAmt', 'localAmt'],
    widths        : [130,120, 120,200,200,1,1,1,1,85,120,120,120,120],
    keys          : ['claimNo','histNo','histCatDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currencyCd','currencyRt','reserveAmt','approvedAmt','paytAmt','localAmt']
  };

  inwardPolBalData: any = {};

  treatyBalanceData: any = {
    tableData     : [],
    tHeader       : ['Quarter Ending', 'Currency', 'Currency Rate', 'Amount', 'Amount(PHP)'],
    dataTypes     : ['text', 'text', 'percent', 'currency', 'currency'],
    magnifyingGlass : ['quarterEnding'],
    nData: {
      quarterEnding  : '',
      currCd         : '',
      currRate       : '',
      currAmt        : 0,
      localAmt       : 0,
      newRec         : 1,
      showMG         : 1
    },
    // opts: [
    //   {selector   : 'currCd',  prev : [], vals: []},
    // ],
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'treatyBalanceData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [true,true,true,false,true],
    total         : [null, null, 'Total', 'currAmt', 'localAmt'],
    widths        : ['auto','auto','auto','auto','auto'],
    keys          : ['quarterEnding','currCd','currRate','currAmt','localAmt']
  };

  investmentData: any = {
    tableData     : [],
    tHeader       : ['Investment Code', 'Investment Type', 'Security', 'Maturity Period', 'Duration Unit', 'Interest Rate', 'Date Purchased', 'Maturity Date', 'Curr', 'Curr Rate', 'Investment'],
    dataTypes     : ['lov-input','text','text','number','text','percent','date','date','text','percent','currency'],
    magnifyingGlass : ['invtCd'],
    nData: {
      invtCd      : '',
      invtType    : '',
      invtSecCd   : '',
      matPeriod   : '',
      durUnit     : '',
      intRt       : '',
      purDate     : '',
      matDate     : '',
      currCd      : '',
      currRate    : '',
      invtAmt     : '',
      showMG      : 1
    },
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'investmentData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [true,true,true,true,true,true,true,true,true,true,true],
    total         : [null,null, null, null, null,null, null, null,null, 'Total', 'invtAmt'],
    widths        : [150,200,150,1,1,120,1,1,1,120,150],
    keys          : ['invtCd','invtTypeDesc','securityDesc','matPeriod','durUnit','intRt','purDate','matDate','currCd','currRate','invtAmt']
  };

  othersData: any = {
    tableData     : [],
    tHeader       : ['Item', 'Reference No.', 'Description', 'Curr', 'Curr Rate', 'Amount', 'Amount(PHP)'],
    dataTypes     : ['text', 'text', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: {
      itemName  : '',
      refNo     : '',
      remarks   : '',
      currCd    : '',
      currRate  : '',
      currAmt   : 0,
      localAmt  : 0,
      newRec    : 1
    },
    // opts: [
    //   {selector   : 'currCd',  prev : [], vals: []},
    // ],
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'othersData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [false,false,false,true,true,false,true],
    total         : [null, null, null, null,'Total', 'currAmt', 'localAmt'],
    widths        : ['auto','auto','auto','auto','auto','auto','auto'],
    keys          : ['itemName','refNo','remarks','currCd','currRate','currAmt','localAmt']
  };

  unappliedColData: any = {
    tableData     : [],
    tHeader       : ['Type','Item','Reference No.', 'Description', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes     : ['req-select','text', 'text', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: {
      transdtlType : '',
      itemName     : '',
      refNo        : '',
      remarks      : '',
      currCd       : '',
      currRate     : '',
      currAmt      : 0,
      localAmt     : 0,
      newRec       : 1
    },
    opts: [
      {selector   : 'transdtlTypeDesc',  prev : [], vals: []},
    ],
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'unappliedColData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [false,false,false,false,true,true,false,true],
    total         : [null,null, null, null, null,'Total', 'currAmt', 'localAmt'],
    widths        : ['auto','auto','auto','auto','auto','auto','auto','auto'],
    keys          : ['transdtlTypeDesc','itemName','refNo','remarks','currCd','currRate','currAmt','localAmt']
  };

  serviceFeeMainData: any = {
    tableData     : [],
    tHeader       : ['Main Company Distribution','Percent Share (%)','Service Fee', 'VAT', 'WhTax', 'Net Due'],
    dataTypes     : ['text','percent','currency','currency','currency','currency'],
    keys          : ['groupName','groupShrPct','totalSfee','totalVat','totalWhtax','totalDue'],
    paginateFlag  : true,
    infoFlag      : true,
    checkFlag     : false,
    addFlag       : false,
    deleteFlag    : false,
    uneditable    : [true,true,true,true,true,true],
    total         : [null,'Total','totalSfee','totalVat','totalWhtax','totalDue'],
    widths        : ['400','100','auto','auto','auto','auto'],
    pageID        : 'serviceFeeMainData',
    pageLength    : 3,
  };

  serviceFeeSubData: any = {
    tableData     : [],
    tHeader       : ['Sub-Distribution of Pool & Munich Re','Net Prem Ceded','Total Net Prem','Percent Share (%)','Service Fee','VAT','WhTax','Net Due'],
    dataTypes     : ['text','currency','currency','percent','currency','currency','currency','currency'],
    keys          : ['cedingName','premWrtnCede','netPremWrtn','actualShrPct','actualShrAmt','vatAmt','whtaxAmt','netDue'],
    paginateFlag  : false,
    infoFlag      : true,
    checkFlag     : false,
    addFlag       : false,
    deleteFlag    : false,
    uneditable    : [true,true,true,true,true,true,true,true],
    total         : [null,null,null,'Total','actualShrAmt','vatAmt','whtaxAmt','netDue'],
    widths        : ['400','auto','auto','100','auto','auto','auto','auto'],
    pageID        : 'serviceFeeSubData',
    pageLength    : 'unli'
  };

  passData : any = {
    selector   : '',
    payeeNo    : '',
    hide       : []
  };

  //currentTbl         : any;
  //tabTitle           : string = '';
  limitClmHistTbl    : any[] = [];
  limitHistCat       : string = '';
  allotedAmt         : any;
  allotedChanged     : boolean = false;
  totalBal           : any;
  variance           : any;
  
  tranTypeList       : any;
  cancelFlag         : boolean;
  cancelFlagInw      : boolean;
  cancelFlagTrty     : boolean;
  cancelFlagInvt     : boolean;
  cancelFlagOth      : boolean;
  cancelFlagUnCol    : boolean;
  cancelFlagServFee  : boolean;
  dialogIcon         : string;
  dialogMessage      : string;
  warnMsg            : string = '';
  recPrqTrans        : any;
  activeOthTab       : boolean = false;
  activeUnColTab     : boolean = false;
  trtyIndx           : number;


  params : any =  {
    savePrqTrans     : [],
    deletePrqTrans   : []
  };

  limitData : any = {
    histCategory : [],
    histType     : []
  };

  requestData     : any;
  selectedTblData : any;
  limitContent    : any[] = [];
  monthEndList    : any;
  yearList        : any;
  currData        : any;

  gnrtType        : string = 'periodAsOf';
  periodAsOfParam : string = null;
  yearParam       : number = null;
  yearParamOpts   : any[] = [];
  qtrParam        : number = null;
  private sub     : any;
  warn            : any[] = [];

  sfeeAmts: any = {
    totalSfeeAmt: 0,
    mreSfeeAmt: 0,
    totalVatAmt: 0,
    totalWhTaxAmt: 0,
    totalDue: 0
  }

  sfeeReturnCode: number = null;
  sfeeMdlMsg: string = '';
  sfeeMdlRefNo: string = '';
  sfeeMdlAmount: any = null;


  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService, 
              private clmService: ClaimsService, public modalService: NgbModal, private dp: DatePipe,private decPipe: DecimalPipe) {
  }

  ngOnInit() {
    this.loadingFunc(true);

    var d = new Date();
    for(let x = d.getFullYear(); x >= 2018; x--) {
      this.yearParamOpts.push(x);
    }

    this.inwardPolBalData = this.acctService.getInwardPolicyKeys('PRQ');
    this.getPaytReqPrqTrans();
  }

  getPaytReqPrqTrans(){
    var subRes = forkJoin(this.acctService.getPaytReq(this.rowData.reqId),this.acctService.getAcitPrqTrans(this.rowData.reqId,''))
                 .pipe(map(([pr,prq]) => { return { pr, prq }; }));
    subRes.subscribe(data => {
      this.loadingFunc(false);
      this.requestData = data['pr']['acitPaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate); return e; })[0];
      this.recPrqTrans = data['prq']['acitPrqTrans'];
      console.log(this.requestData);
      console.log(this.recPrqTrans);
      if(this.activeOthTab){
        this.othersData.tableData = [];
        (this.requestData.reqStatus != 'F' && this.requestData.reqStatus != 'N')?this.removeAddDelBtn(this.othersData):'';
        this.getOthers();
      }else if(this.activeUnColTab){
        this.unappliedColData.tableData = [];
        (this.requestData.reqStatus != 'F' && this.requestData.reqStatus != 'N')?this.removeAddDelBtn(this.unappliedColData):'';
        this.getUnCol();
      }else{
        if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 2 || this.requestData.tranTypeCd == 3){
          this.cedingCompanyData.tableData = [];
          this.getClmHist();
        }else if(this.requestData.tranTypeCd == 4){
          this.inwardPolBalData.tableData = [];
          (this.requestData.reqStatus != 'F' && this.requestData.reqStatus != 'N')?this.removeAddDelBtn(this.inwardPolBalData):'';
          this.getAcitPrqInwPol();
        }else if(this.requestData.tranTypeCd == 5){
          this.getAcctPrqServFee();
        }else if(this.requestData.tranTypeCd == 6){
          this.treatyBalanceData.tableData = [];
          (this.requestData.reqStatus != 'F' && this.requestData.reqStatus != 'N')?this.removeAddDelBtn(this.treatyBalanceData):'';
          this.getTreaty();
        }else if(this.requestData.tranTypeCd == 7){
          this.investmentData.tableData = [];
          (this.requestData.reqStatus != 'F' && this.requestData.reqStatus != 'N')?this.removeAddDelBtn(this.investmentData):'';
          this.getAcitInvt();
        }else if(this.requestData.tranTypeCd == 8){
          this.othersData.tableData = [];
          (this.requestData.reqStatus != 'F' && this.requestData.reqStatus != 'N')?this.removeAddDelBtn(this.othersData):'';
          this.getOthers();
        }
      }
    });
  }

  getUnCol(){
    this.mtnService.getRefCode('UNAPPLIED_COLLECTION_TYPE')
    .subscribe(data => {
      console.log(data);
      var rec = data['refCodeList'];
      this.unappliedColData.opts[0].vals = rec.map(e => e.code);
      this.unappliedColData.opts[0].prev = rec.map(e => e.description);
    });
    this.unappliedColData.tableData = this.recPrqTrans.filter(e => e.transdtlType != null).map(e => {e.reqId  = this.rowData.reqId;return e;});
    this.unColTbl.refreshTable();
  }

  getOthers(){
    this.mtnService.getMtnCurrency('','Y')
    .subscribe(data => {
      var rec = data['currency'];
      this.currData = rec;
    });
    this.othersData.tableData = this.recPrqTrans.filter(e => e.itemName != null && e.transdtlType == null).map(e => { e.reqId  = this.rowData.reqId; return e;});
    setTimeout(() => {this.othTbl.refreshTable();},0);
  }

  getAcitInvt(){
    this.acctService.getAccInvestments([])
    .subscribe(data => {
      var recACitInvt = data['invtList'];

      this.investmentData.tableData = [];
      this.recPrqTrans.forEach(e => {
        this.investmentData.tableData.push(recACitInvt.filter(e2 => e2.invtId == e.invtId).map(e2 => { e2.itemNo = e.itemNo; return e2; }));
      });

      this.investmentData.tableData = this.investmentData.tableData.flatMap(e => { return e; });
      this.invtTbl.refreshTable();
    });
  }

  getTreaty(){
    this.mtnService.getMtnCurrency('','Y')
    .subscribe(data => {
      var rec = data['currency'];
      this.currData = rec;
    });

    this.treatyBalanceData.tableData = this.recPrqTrans.filter(e => e.itemName == null).map(e => { 
      e.reqId  = this.rowData.reqId; 
      e.quarterEnding = this.dp.transform(this.ns.toDateTimeString(e.quarterEnding).split('T')[0], 'MM/dd/yyyy');
      return e; 
    });
    setTimeout(() => {this.treatyTbl.refreshTable();},0);
  }

  getAcitPrqInwPol(){
    this.acctService.getAcitPrqInwPol(this.rowData.reqId,'')
    .subscribe(data => {
      console.log(data);
      var rec = data['acitPrqInwPolList'];
      this.inwardPolBalData.tableData = rec;
      this.inwardTbl.refreshTable();
    });
  }

  getClmHist(){
    this.clmService.getClaimHistory()
    .subscribe(data => {
      var recClmHist  = data['claimReserveList'].map(e => e.clmHistory).flatMap(e => { return e }).filter(e => (this.requestData.tranTypeCd == 3)?e.histCategory == 'L':e.histCategory != 'L').map(e => { return e });
      this.cedingCompanyData.tableData = [];
      this.recPrqTrans.forEach(e => {
        this.cedingCompanyData.tableData.push(recClmHist.filter(e2 => e2.claimId == e.claimId && e2.histNo == e.histNo && e2.projId == e.projId )
                                                              .map(e2 => { 
                                                                e2.paymentFor = this.requestData.particulars; 
                                                                e2.createUser = e.createUser;
                                                                e2.updateUser = e.updateUser;
                                                                e2.createDate = e.createDate;
                                                                e2.updateDate = e.updateDate;
                                                                e2.approvedAmt = (e.approvedAmt == '' || e.approvedAmt == null)?0:e.approvedAmt;
                                                                e2.paytAmt    = (e.currAmt == '' || e.currAmt == null)?0:e.currAmt;
                                                                e2.localAmt   = (e.localAmt == '' || e.localAmt == null)?0:e.localAmt; 
                                                                e2.itemNo     = e.itemNo;
                                                                return e2; 
                                                              }));
      });
      this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.flatMap(e => { return e });
      this.cedCompTbl.refreshTable();
    });
  }

  onChangeCurr(from){
    var tbl;
    if(from.toLowerCase() == 'oth' || this.activeOthTab){
      tbl = this.othersData.tableData;
    }else if(from.toLowerCase() == 'tbd'){
      tbl = this.treatyBalanceData.tableData;
    }else if(from.toLowerCase() == 'unc'){
      tbl = this.unappliedColData.tableData;
    }

    tbl.forEach(e => {
      e.currCd = this.requestData.currCd;
      e.currRate = this.requestData.currRate;
      e.localAmt = (!isNaN(e.currAmt))?Number(e.currAmt)*Number(e.currRate):0;
    });

  }

  // defaultData(){
  //   this.unappliedColData.tableData.map(e => {
  //     if(e.newRec == 1){
  //       e.currCd   = this.requestData.currCd;
  //       e.currRate = this.requestData.currRate;
  //       e.localAmt = (e.currAmt != null)?Number(e.currAmt) * Number(e.currRate):'';
  //     }
  //   });
  // }

  showLOV(event, from){
    if(from.toUpperCase() == 'LOVCEDTBL'){
      this.cedingCompanyData.tableData.forEach(e => {
        this.limitClmHistTbl.push(e);
      });
      (this.requestData.tranTypeCd == 3)?this.limitData.histCategory = ['L']:this.limitData.histCategory = ['A','O'];
      this.limitData.histType = [4,5];
      this.clmHistLov.modal.openNoClose();
    }else if(from.toUpperCase() == 'LOVINWARDTBL'){
      this.passData.currCd = this.requestData.currCd;
      this.passData.selector = 'acitSoaDtlPrq';
      this.passData.payeeNo = this.requestData.payeeCd;
      this.passData.hide = this.inwardPolBalData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
      this.aginSoaLov.openLOV();
    }else if(from.toUpperCase() == 'LOVTRTYTBL'){
      this.trtyIndx = event.index;
      this.trtyLov.modal.openNoClose();
    }else if(from.toUpperCase() == 'LOVINVTTBL'){
      this.passData.selector = 'acitInvt';
      this.passData.currCd = this.requestData.currCd;
      this.passData.payeeNo = this.requestData.payeeCd;
      this.passData.hide = this.investmentData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtId});
      this.invtLov.openLOV();
    }
  }

  reCompInw(){
    this.warn = [];
    console.log(this.inwardPolBalData.tableData);
    this.inwardPolBalData.tableData.forEach(e => {
      e.premAmt      = isNaN(Math.round(((e.returnAmt/e.prevNetDue)*e.prevPremAmt) * 100)/100)?0:Math.round(((e.returnAmt/e.prevNetDue)*e.prevPremAmt) * 100)/100;
      e.riComm       = isNaN(Math.round(((e.returnAmt/e.prevNetDue)*e.prevRiComm) * 100)/100)?0:Math.round(((e.returnAmt/e.prevNetDue)*e.prevRiComm) * 100)/100;
      e.riCommVat    = isNaN(Math.round(((e.returnAmt/e.prevNetDue)*e.prevRiCommVat) * 100)/100)?0:Math.round(((e.returnAmt/e.prevNetDue)*e.prevRiCommVat) * 100)/100;
      e.charges      = isNaN(Math.round(((e.returnAmt/e.prevNetDue)*e.prevCharges) * 100)/100)?0:Math.round(((e.returnAmt/e.prevNetDue)*e.prevCharges) * 100)/100;
      e.totalPayt    = isNaN(Math.round((e.returnAmt + e.cumPayment) * 100)/100)?0:Math.round((e.returnAmt + e.cumPayment) * 100)/100;
      e.remainingBal = isNaN(Math.round((e.prevNetDue - e.totalPayt) * 100)/100)?0:Math.round((e.prevNetDue - e.totalPayt) * 100)/100;

      // if(e.prevBalance < 0) {
      //   if(e.returnAmt > 0){
      //     this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.cumPayment)))?1:0);
      //   }else{
      //     this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.prevBalance)))?2:0);
      //   }
      // }else{
      //   if(e.returnAmt < 0){
      //     this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.cumPayment)))?1:0);
      //   }else{
      //     this.warn.push((e.returnAmt > e.prevBalance)?2:0);
      //   }
      // }

      // if(e.prevBalance > 0){
      //   (e.cumPayment > 0) ? (e.returnAmt < 0) ? this.warn.push((e.returnAmt > e.prevBalance)?2:0)
      //                                          : this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.cumPayment)))?1:0)
      //                      : 
      // }else{
      //   if(e.cumPayment < 0){
      //     (e.returnAmt < 0) ? this.warn.push((e.returnAmt > e.prevBalance)?2:0)
      //                       : this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.cumPayment)))?1:0);
      //   }else{
      //     (e.returnAmt < 0)?this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.cumPayment)))?1:0)
      //                      :this.warn.push((e.returnAmt > e.prevBalance)?2:0);
      //   }
      // }  

      (e.prevBalance < 0 || e.cumPayment < 0) 
        ? (e.returnAmt < 0) ? this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.prevBalance)))?2:0)
                            : this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.cumPayment)))?1:0)
        : (e.returnAmt < 0) ? this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.cumPayment)))?1:0) 
                            : this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.prevBalance)))?2:0);
    });
  }

  setData(data, from){
    console.log(this.limitContent);
    if(from.toUpperCase() == 'LOVCEDTBL'){
      data.forEach(e => {
        if(this.cedingCompanyData.tableData.some(e2 => e2.claimId != e.claimId && e2.histNo != e.histNo)){
          e.itemNo = '';
          this.cedingCompanyData.tableData.push(e);
          this.limitClmHistTbl.push(e);
        }
      });
      this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.filter(e => e.claimNo != '')
                                        .map(e => { 
                                          e.paytAmt = (e.paytAmt == '' || e.paytAmt == null)?0:e.paytAmt;
                                          e.localAmt = (e.localAmt == '' || e.localAmt == null)?Number(e.paytAmt)*Number(e.currencyRt):e.localAmt; 
                                          e.edited = true; e.checked = false; e.createDate = ''; e.createUser = ''; 
                                          return e; });
      this.cedCompTbl.refreshTable();
      this.cedCompTbl.markAsDirty();
    }else if(from.toUpperCase() == 'LOVINWARDTBL'){
      var recAgingSoaDtl = data['data'];
      recAgingSoaDtl.forEach(e => {
        if(this.inwardPolBalData.tableData.some(e2 => e2.policyId != e.policyId && e2.instNo != e.instNo)){
          this.inwardPolBalData.tableData.push(e);
          //this.limitContent.push(e);
        }
      });
      this.inwardPolBalData.tableData = this.inwardPolBalData.tableData.filter(e => e.policyNo != '')
                                            .map(e => { 
                                                //e.edited = true; 
                                                e.checked = false; e.createDate = ''; e.createUser = '';
                                                e.premAmt   = 0;
                                                e.riComm    = 0;
                                                e.riCommVat = 0;
                                                e.charges   = 0;
                                                (e.returnAmt == '' || e.returnAmt == null)?e.newRec=1:'';
                                                (e.newRec==1)?e.returnAmt=0:'';
                                                return e;
                                            });
      this.inwardTbl.refreshTable();
      this.inwardTbl.markAsDirty();
      this.reCompInw();
    }else if(from.toUpperCase() == 'LOVTRTYTBL'){
      this.treatyBalanceData.tableData[this.trtyIndx].quarterEnding = this.dp.transform(this.ns.toDateTimeString(data).split('T')[0], 'MM/dd/yyyy');
      this.treatyTbl.markAsDirty();
    }else if(from.toUpperCase() == 'LOVINVTTBL'){
      var recInvt = data['data'];
      recInvt.forEach(e => {
        if(this.investmentData.tableData.some(e2 => e2.invtId != e.invtId)){
          this.investmentData.tableData.push(e);
        }
      });
      this.investmentData.tableData = this.investmentData.tableData.filter(e => e.invtCd != '')
                                          .map(e => {
                                            e.edited = true; e.checked = false;e.createDate = ''; e.createUser = '';
                                            e.currAmt = e.invtAmt;
                                            return e;
                                          }); 
      this.invtTbl.refreshTable();
      this.invtTbl.markAsDirty();
    }
  }

  removeAddDelBtn(tbl){
    tbl.addFlag = false;
    tbl.deleteFlag = false;
    tbl.checkFlag = this.requestData.tranTypeCd == 4 ? true : false;
    tbl.uneditable = tbl.uneditable.map(e => e = true);
  }

  onClickSave(){  
      if(this.activeOthTab){
        this.onClickSaveOth();
      }else if(this.activeUnColTab){
        this.onClickSaveUnCol();
      }else{
        if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 2 || this.requestData.tranTypeCd == 3){
          this.onClickSaveCPC();
        }else if(this.requestData.tranTypeCd == 4){
          this.onClickSaveInw();
        }else if(this.requestData.tranTypeCd == 5){
          this.onClickSaveServFee();
        }else if(this.requestData.tranTypeCd == 6){
          this.onClickSaveTrty();
        }else if(this.requestData.tranTypeCd == 7){
          this.onClickSaveInvt();
        }else if(this.requestData.tranTypeCd == 8){
          this.onClickSaveOth();
        }
      }
  }

  onClickSaveUnCol(cancelFlag?){
    this.cancelFlagUnCol = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;
    this.params.savePrqTrans = [];
    this.unappliedColData.tableData.forEach(e => {
      e.reqId    = this.rowData.reqId;
      if(e.transdtlTypeDesc == '' || e.transdtlTypeDesc == null || e.itemName == '' || e.itemName == null || e.currAmt == '' || e.currAmt == null || isNaN(e.currAmt) || e.currAmt == 0){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.deletePrqTrans.push(e);
        }
      }else{
        e.fromCancel = true;
        if(e.edited && !e.deleted){
          e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
          e.createDate    = (e.createDate == '' || e.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate);
          e.quarterEnding = '';
          e.tranTypeCd    = (e.tranTypeCd == '' || e.tranTypeCd == null)?this.requestData.tranTypeCd:e.tranTypeCd;
          e.transdtlType  = (e.transdtlType == '' || e.transdtlType == null)?e.transdtlTypeDesc:e.transdtlType;
          e.updateUser    = this.ns.getCurrentUser();
          e.updateDate    = this.ns.toDateTimeString(0);
          this.params.savePrqTrans.push(e);
        }else if(e.edited && e.deleted){ 
          this.params.deletePrqTrans.push(e);  
        }
      } 
    });

    console.log(this.unappliedColData.tableData);
    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.sucUnCol.open();
      this.params.savePrqTrans   = [];
    }else{
      if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
          this.unColTbl.markAsPristine();
          this.conUnCol.confirmModal();
          this.params.savePrqTrans   = [];
          this.params.deletePrqTrans = [];
          this.unappliedColData.tableData = this.unappliedColData.tableData.filter(e => e.transdtlType != '');
      }else{
          console.log(this.cancelFlagUnCol);
          if(this.cancelFlagUnCol == true){
            this.conUnCol.showLoading(true);
            setTimeout(() => { try{this.conUnCol.onClickYes();}catch(e){}},500);
          }else{
            this.conUnCol.confirmModal();
          }
      }
    }
  }

  onClickSaveOth(cancelFlag?){
    this.cancelFlagOth = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;
    this.params.savePrqTrans = [];

    this.othersData.tableData.forEach(e => {
      e.reqId    = this.rowData.reqId;
      if(e.itemName == '' || e.itemName == null || e.currCd == '' || e.currCd == null || e.currRate == '' || e.currRate == null || 
         e.currAmt == '' || e.currAmt == null || isNaN(e.currAmt) || e.currAmt == 0){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.deletePrqTrans.push(e);
        }
      }else{
        e.fromCancel = true;
        if(e.edited && !e.deleted){
          e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
          e.createDate    = (e.createDate == '' || e.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate);
          e.quarterEnding = '';
          e.tranTypeCd    = (e.tranTypeCd == '' || e.tranTypeCd == null)?this.requestData.tranTypeCd:e.tranTypeCd;
          e.updateUser    = this.ns.getCurrentUser();
          e.updateDate    = this.ns.toDateTimeString(0);
          this.params.savePrqTrans.push(e);
        }else if(e.edited && e.deleted){ 
          this.params.deletePrqTrans.push(e);  
        }
      }
    });

    console.log(this.othersData.tableData);
    console.log(this.params.savePrqTrans);

    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.sucOth.open();
      this.params.savePrqTrans   = [];
    }else{
        if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
          this.othTbl.markAsPristine();
          this.conOth.confirmModal();
          this.params.savePrqTrans   = [];
          this.params.deletePrqTrans = [];
          this.othersData.tableData = this.othersData.tableData.filter(e => e.itemName != '');
        }else{
          console.log(this.cancelFlagOth);
          if(this.cancelFlagOth == true){
            this.conOth.showLoading(true);
            setTimeout(() => { try{this.conOth.onClickYes();}catch(e){}},500);
          }else{
            this.conOth.confirmModal();
          }
        }
    }
  }

  onClickSaveInvt(cancelFlag?){
    this.cancelFlagInvt = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;
    this.investmentData.tableData.forEach(e => {
      e.reqId    = this.rowData.reqId;
      if(e.invtCd == '' || e.invtCd == null){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.deletePrqTrans.push(e);
        }
      }else{
        e.fromCancel = true;
        if(e.edited && !e.deleted){
          this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.invtId != e.invtId);
          e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
          e.createDate    = (e.createDate == '' || e.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate);
          e.updateUser    = this.ns.getCurrentUser();
          e.updateDate    = this.ns.toDateTimeString(0);
          e.quarterEnding = '';
          e.tranTypeCd    = (e.tranTypeCd == '' || e.tranTypeCd == null)?this.requestData.tranTypeCd:e.tranTypeCd;
          e.currAmt       = e.invtAmt;
          e.itemNo        = e.itemNo;
          e.localAmt      = Number(e.invtAmt) * Number(e.currRate);
          this.params.savePrqTrans.push(e);
        }else if(e.edited && e.deleted){ 
          this.params.deletePrqTrans.push(e);  
        }
      }
    });

    console.log(this.params);

      if(isEmpty == 1){
        this.dialogIcon = 'error';
        this.sucInvt.open();
        this.params.savePrqTrans   = [];
      }else{
        if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
          this.invtTbl.markAsPristine();
          this.conInvt.confirmModal();
          this.params.savePrqTrans   = [];
          this.params.deletePrqTrans = [];
          this.investmentData.tableData = this.investmentData.tableData.filter(e => e.invtCd != '');
        }else{
            console.log(this.cancelFlagInvt);
            if(this.cancelFlagInvt == true){
              this.conInvt.showLoading(true);
              setTimeout(() => { try{this.conInvt.onClickYes();}catch(e){}},500);
            }else{
              this.conInvt.confirmModal();
            }
        }
      }
  }

  onClickSaveTrty(cancelFlag?){
    this.cancelFlagTrty = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isNotUnique : boolean ;
    var isEmpty = 0;
    var ts = this;
    this.treatyBalanceData.tableData.forEach(e => {
      e.reqId    = this.rowData.reqId;
      if(e.quarterEnding == '' || e.quarterEnding == null || e.currCd == '' || e.currCd == null || e.currRate == '' || e.currRate == null || 
         e.currAmt == '' || e.currAmt == null || isNaN(e.currAmt) || e.currAmt == 0){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.deletePrqTrans.push(e);
        }
      }else{
        e.fromCancel = true;
        if(e.edited && !e.deleted){
          this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.quarterEnding != e.quarterEnding);
          e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
          e.createDate    = (e.createDate == '' || e.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate);
          e.quarterEnding = e.quarterEnding;
          e.tranTypeCd    = (e.tranTypeCd == '' || e.tranTypeCd == null)?this.requestData.tranTypeCd:e.tranTypeCd;
          e.updateUser    = this.ns.getCurrentUser();
          e.updateDate    = this.ns.toDateTimeString(0);
          this.params.savePrqTrans.push(e);
        }else if(e.edited && e.deleted){ 
          this.params.deletePrqTrans.push(e);  
        }
      }
    });

    var saveTrty = this.params.savePrqTrans;

    this.treatyBalanceData.tableData.forEach(function(tblData){
      if(tblData.newRec != 1){
        saveTrty.forEach(function(stData){
          if(ts.ns.toDateTimeString(tblData.quarterEnding) == ts.ns.toDateTimeString(stData.quarterEnding)){
            if(stData.newRec == 1){
              isNotUnique = true;  
            }
          }
        });
      }
    }); 

    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.sucTrty.open();
      this.params.savePrqTrans   = [];
    }else{
      if(isNotUnique){
        this.warnMsg = 'Unable to save the record. Quarter Ending must be unique.';
        this.warnMdl.openNoClose();
        this.params.savePrqTrans = [];
      }else if(this.treatyBalanceData.tableData.filter(e => e.newRec == 1).some(e => e.currAmt <= 0)){
        this.warnMsg = 'Please enter amount greater than 0.';
        this.warnMdl.openNoClose();
        this.params.savePrqTrans = [];
      }else{
          if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
            this.treatyTbl.markAsPristine();
            this.conTrty.confirmModal();
            this.params.savePrqTrans   = [];
            this.params.deletePrqTrans = [];
            this.treatyBalanceData.tableData = this.treatyBalanceData.tableData.filter(e => e.quarterEnding != '');
          }else{
            if(this.cancelFlagTrty == true){
              this.conTrty.showLoading(true);
              setTimeout(() => { try{this.conTrty.onClickYes();}catch(e){}},500);
            }else{
              this.conTrty.confirmModal();
            }
          }
      }

      this.treatyBalanceData.tableData = this.treatyBalanceData.tableData.map(e => {
          e.quartEndingSave = e.quarterEnding;
          e.quarterEnding = this.dp.transform(this.ns.toDateTimeString(e.quarterEnding).split('T')[0], 'MM/dd/yyyy');
          if(e.currAmt < 0){e.currAmt=0; e.localAmt=0;};
        return e; 
      });
    }
  }

  onClickSaveInw(cancelFlag?){
    this.cancelFlagInw = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;
    this.inwardPolBalData.tableData.forEach(e => {
      if(e.returnAmt == '' || e.returnAmt == null || isNaN(e.returnAmt)){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.deletePrqTrans.push(e);
        }
      }else{
        var rec = {
            allotedAmt      : Math.abs(Number(String(this.allotedAmt).replace(/\,/g,''))),
            claimId         : '',
            createUser      : (e.createUser == '' || e.createUser == null)?this.ns.getCurrentUser():e.createUser,
            createDate      : (e.createDate == '' || e.createDate == null)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate),
            currAmt         : e.returnAmt,
            currCd          : e.currCd,
            currRate        : e.currRate,
            histNo          : '',
            instNo          : e.instNo,
            investmentId    : '',
            itemNo          : e.itemNo,
            localAmt        : Number(e.returnAmt) * Number(e.currRate),
            paymentFor      : '',
            policyId        : e.policyId,
            projId          : '',
            quarterEnding   : '',
            tranTypeCd      : (e.tranTypeCd == '' || e.tranTypeCd == null)?this.requestData.tranTypeCd:e.tranTypeCd,
            refNo           : '',
            remarks         : '',
            reqId           : this.rowData.reqId,
            updateUser      : this.ns.getCurrentUser(),
            updateDate      : this.ns.toDateTimeString(0)
        };

        if(e.edited && !e.deleted){
          //this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.instNo != e.instNo);
          this.params.savePrqTrans.push(rec);
        }else if(e.edited && e.deleted){
          this.params.deletePrqTrans.push(rec);
        }else{
          console.log('ELSE IN SAVE');
        }
      }
    });

    console.log(this.inwardPolBalData.tableData);
    console.log(this.params.savePrqTrans);
    var returnAmt = this.inwardPolBalData.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.returnAmt != null ?parseFloat(b.returnAmt):0),0);
    console.log(returnAmt);
    console.log(this.warn);
    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.sucInw.open();
      this.params.savePrqTrans   = [];
    }else if(Number(returnAmt) > 0){
      this.warnMsg = 'Net balance payment is positive. No value to be refunded. The net balance payments should be negative.';
      this.warnMdl.openNoClose();
      this.params.savePrqTrans   = [];
      this.params.deletePrqTrans = [];
    }else if(this.warn.some(e => e == 1)){
      this.warnMsg = 'Refund amount must not exceed the Cumulative Payment.';
      this.warnMdl.openNoClose();
      this.params.savePrqTrans   = [];
      this.params.deletePrqTrans = [];
    }else if(this.warn.some(e => e == 2)){
      this.warnMsg = 'Payment amount must not exceed the Balance amount.';
      this.warnMdl.openNoClose();
      this.params.savePrqTrans   = [];
      this.params.deletePrqTrans = [];
    }else{
      if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
        this.inwardTbl.markAsPristine();
        this.conInw.confirmModal();
        this.params.savePrqTrans   = [];
        this.params.deletePrqTrans = [];
        this.inwardPolBalData.tableData = this.inwardPolBalData.tableData.filter(e => e.policyNo != '');
      }else{
        if(this.cancelFlagInw == true){
          this.conInw.showLoading(true);
          setTimeout(() => { try{
            this.conInw.onClickYes();
          }catch(e){}},500);
        }else{
          this.conInw.confirmModal();
        }
      }
    }
  }

  onClickSaveCPC(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    this.cedingCompanyData.tableData.forEach(e => {
      var rec = {
            claimId         : e.claimId,
            createUser      : (e.createUser == '' || e.createUser == null)?this.ns.getCurrentUser():e.createUser,
            createDate      : (e.createDate == '' || e.createDate == null)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate),
            currAmt         : e.paytAmt,
            currCd          : e.currencyCd,
            currRate        : e.currencyRt,
            histNo          : e.histNo,
            instNo          : '',
            investmentId    : '',
            itemNo          : e.itemNo,
            localAmt        : Number(e.currencyRt) * Number(e.paytAmt),
            paymentFor      : e.paymentFor,
            policyId        : '',
            projId          : e.projId,
            quarterEnding   : '',
            tranTypeCd      : (e.tranTypeCd == '' || e.tranTypeCd == null)?this.requestData.tranTypeCd:e.tranTypeCd,
            refNo           : '',
            remarks         : '',
            reqId           : this.rowData.reqId,
            updateUser      : this.ns.getCurrentUser(),
            updateDate      : this.ns.toDateTimeString(0)
          };

      if(e.edited && !e.deleted){
        this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.claimId != e.claimId);
        this.params.savePrqTrans.push(rec);
      }else if(e.edited && e.deleted){
        this.params.deletePrqTrans.push(rec);
      }else{
        console.log('ELSE IN SAVE');
      }
    });

    console.log(this.cedingCompanyData.tableData);
    console.log(this.params.savePrqTrans);

    var paytAmt = this.cedingCompanyData.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.paytAmt != null ?parseFloat(b.paytAmt):0),0);
    console.log(paytAmt);

    if(Number(this.requestData.reqAmt) < Number(paytAmt)){
      this.warnMsg = 'The Total Payment Amount of Claim Histories must not exceed the Requested Amount.';
      this.warnMdl.openNoClose();
      this.params.savePrqTrans   = [];
      this.params.deletePrqTrans = [];
    }else{
      if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
        this.cedCompTbl.markAsPristine();
        this.conClm.confirmModal();
        this.params.savePrqTrans   = [];
        this.params.deletePrqTrans = [];
        this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.filter(e => e.claimNo != '');
      }else{
        if(this.cancelFlag == true){
          this.conClm.showLoading(true);
          setTimeout(() => { try{this.conClm.onClickYes();}catch(e){}},500);
        }else{
          this.conClm.confirmModal();
        }
      }
    }
  }

  onSaveUnCol(){
    console.log(this.params);
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == 0){
        this.dialogIcon = 'error';
      }else{
        this.getPaytReqPrqTrans();
      }
      this.sucUnCol.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
      this.unColTbl.markAsPristine();
    });
  }

  onSaveOth(){
    console.log(this.params);
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == 0){
        this.dialogIcon = 'error';
      }else{
        this.getPaytReqPrqTrans();
      }
      this.sucOth.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
      this.othTbl.markAsPristine();
    });
  }

  onSaveTrty(){
    this.params.savePrqTrans = this.params.savePrqTrans.map(e => { 
        e.quarterEnding = this.ns.toDateTimeString(e.quartEndingSave); 
      return e; 
    });
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      if(data['returnCode'] == 0){
        this.dialogIcon = 'error';
      }else{
        this.getPaytReqPrqTrans();
      }
      this.sucTrty.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
      this.treatyTbl.markAsPristine();
    });
  }

  onSaveInvt(){
    console.log(this.params);
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == 0){
        this.dialogIcon = 'error';
      }else{
        this.getPaytReqPrqTrans();
      }
      this.sucInvt.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
      this.invtTbl.markAsPristine();
    });
  }

  onSaveInw(){
    var prqInwPol = {
      deleteAcitPrqInwPol : [],
      saveAcitPrqInwPol   : []
    };

    this.inwardPolBalData.tableData.forEach((e,i) => {
      var rec = {
        charges     : e.charges,
        createUser  : (e.createUser == '' || e.createUser == null)?this.ns.getCurrentUser():e.createUser,
        createDate  : (e.createDate == '' || e.createDate == null)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate),
        itemNo      : e.itemNo,
        netDue      : e.prevNetDue,
        premAmt     : e.premAmt,
        prevPaytAmt : e.cumPayment,
        prevBalance : e.prevBalance,
        newPaytAmt  : e.totalPayt,
        newBalance  : e.remainingBal,
        reqId       : this.requestData.reqId,
        returnAmt   : e.returnAmt,
        riComm      : e.riComm,
        riCommVat   : e.riCommVat,
        updateDate  : this.ns.toDateTimeString(0),
        updateUser  : this.ns.getCurrentUser()
      };

      if(e.edited && !e.deleted){
        prqInwPol.saveAcitPrqInwPol.push(rec);
      }else if(e.edited && e.deleted){
        prqInwPol.deleteAcitPrqInwPol.push(rec);
      }else{
        console.log('ELSE IN SAVE');
      }
    });

    for(var i = 0; i < this.params.savePrqTrans.length; i++) {
      this.params.savePrqTrans[i]['inwPol'] = prqInwPol.saveAcitPrqInwPol[i];
    }

    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == 0){
        this.dialogIcon = 'error';
      }else{
        this.getPaytReqPrqTrans();
      }
      this.sucInw.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
      this.inwardTbl.markAsPristine();
    });
  }

  onSaveCPC(){
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == 0){
        this.dialogIcon = 'error';
      }else{
        this.getPaytReqPrqTrans();
      }
      this.sucClm.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
      this.cedCompTbl.markAsPristine();
    });
  }

  onRowClick(event){
    this.selectedTblData = event;
    if(event != null){
      this.selectedTblData.createDate = this.ns.toDateTimeString(event.createDate);
      this.selectedTblData.updateDate = this.ns.toDateTimeString(event.updateDate);  
    }
  }

  checkCancel(){
    if(this.cancelFlag){
      this.canClm.onNo();
    }else{
      this.sucClm.modal.modalRef.close();
    }
  }

  checkCancelInw(){
    if(this.cancelFlagInw){
      this.canInw.onNo();
    }else{
      this.sucInw.modal.modalRef.close();
    }
  }

  checkCancelTrty(){
    if(this.cancelFlagTrty){
      this.canTrty.onNo();
    }else{
      this.sucTrty.modal.modalRef.close();
    }
  }

  checkCancelInvt(){
    if(this.cancelFlagInvt){
      this.canInvt.onNo();
    }else{
      this.sucInvt.modal.modalRef.close();
    }
  }

  checkCancelUncol(){
    if(this.cancelFlagUnCol){
      this.canUnCol.onNo();
    }else{
      this.sucUnCol.modal.modalRef.close();
    }
  }

  checkCancelOth(){
    if(this.cancelFlagOth){
      this.canOth.onNo();
    }else{
      this.sucOth.modal.modalRef.close();
    }
  }

  cancel(){
    if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 2 || this.requestData.tranTypeCd == 3){
      this.canClm.clickCancel();  
    }else if(this.requestData.tranTypeCd == 4){
      this.canInw.clickCancel();
    }else if(this.requestData.tranTypeCd == 5){
      this.canServFee.clickCancel();
    }else if(this.requestData.tranTypeCd == 6){
      this.canTrty.clickCancel();
    }else if(this.requestData.tranTypeCd == 7){
      this.canInvt.clickCancel();
    }else if(this.requestData.tranTypeCd == 8){
      this.canOth.clickCancel();
    }
  }

  conLocAmt(){
    this.cedingCompanyData.tableData.forEach(e => {
      if(e.paytAmt != '' || e.paytAmt != null){
        e.localAmt = Number(e.currencyRt) * Number(e.paytAmt);
      }
    });
  }

  addDirty(from){
    console.log(from);
    if(from == 'cedTbl'){
      this.cedCompTbl.markAsDirty();
    }else if(from == 'inwTbl'){
      this.inwardTbl.markAsDirty();
    }else if(from == 'invtTbl'){
      this.invtTbl.markAsDirty();
    }else if(from == 'trtyTbl'){
      this.treatyTbl.markAsDirty();
    }else if(from == 'othTbl'){
      this.othTbl.markAsDirty();
    }else if(from == 'unColTbl'){
      this.unColTbl.markAsDirty();
    }
  }

  // onChangeAllotedAmt(){
  //   this.allotedChanged = true;
  //   this.inwardPolBalData.tableData.map(e => { e.edited = true; return e; });
  //   console.log(this.inwardPolBalData.tableData);
  //   var allAmt = Number(String(this.allotedAmt).replace(/\,/g,''));
  //   if(Number(allAmt) > Number(this.requestData.reqAmt)){
  //     this.allotedAmt = '';
  //     this.warnMsg = 'Alloted Policy Balance Payments must not exceed the Requested Amount';
  //     this.warnMdl.openNoClose();
  //   }
  // }

  onTabChange($event: NgbTabChangeEvent) {
    if($event.nextId.toUpperCase() == 'UNCOLTABID'){
      this.activeUnColTab = true;
      this.activeOthTab = false;
    }else if($event.nextId.toUpperCase() == 'OTHTABID') {
      this.activeOthTab = true;
      this.activeUnColTab = false;
    }else{
      this.activeOthTab = false;
      this.activeUnColTab = false;
    }
    this.getPaytReqPrqTrans();
  }

  getAcctPrqServFee(gnrt?, force?) {
    var d = new Date();

    setTimeout(() => {
      $('input[appCurrency]').focus().blur();
      this.servFeeMainTbl.refreshTable();
      this.servFeeSubTbl.refreshTable();
      this.servFeeMainTbl.overlayLoader = true;
      this.servFeeSubTbl.overlayLoader = true;
    }, 0);

    function numParser(x) {
      return +parseFloat(x).toFixed(2);
    }

    if(gnrt == undefined) {
      this.acctService.getAcctPrqServFee('N','normal', this.requestData.reqId).subscribe(data => {
        this.serviceFeeMainData.tableData = data['mainDistList'];
        this.serviceFeeSubData.tableData = data['subDistList'].sort((a, b) => b.actualShrPct - a.actualShrPct);

        if(data['subDistList'].length > 0) {

          this.sfeeAmts = data['subDistList'][0].servFeeTotals;

          setTimeout(() => {
            $('input[appCurrency]').focus().blur();
          }, 0);
        }

        if(this.serviceFeeMainData.tableData.length == 0 && this.serviceFeeSubData.tableData.length == 0) {
          this.qtrParam = Math.floor((d.getMonth() / 3) + 1);
          this.yearParam = d.getFullYear();
        } else {
          this.qtrParam = this.serviceFeeSubData.tableData[0].quarter;
          this.yearParam = this.serviceFeeSubData.tableData[0].sfeeYear;
        }

        this.servFeeMainTbl.refreshTable();
        this.servFeeSubTbl.refreshTable();
      });
    } else {
      var x = force === undefined ? 'N' : 'Y';
      this.acctService.getAcctPrqServFee(x, 'generate', this.requestData.reqId, this.qtrParam, this.yearParam,
                                         +parseFloat(this.sfeeAmts.totalSfeeAmt).toFixed(2), this.requestData.currCd,
                                         this.requestData.currRate, this.ns.getCurrentUser()).subscribe(data => {
        this.sfeeReturnCode = data['returnCode'];

        if(this.sfeeReturnCode == 0) {
          this.serviceFeeMainData.tableData = data['mainDistList'];
          this.serviceFeeSubData.tableData = data['subDistList'].sort((a, b) => b.actualShrPct - a.actualShrPct);

          this.sfeeAmts.mreSfeeAmt = data['mainDistList'][0].servFeeTotals.mreSfeeAmt;
          this.sfeeAmts.totalVatAmt = 0;
          this.sfeeAmts.totalWhTaxAmt = 0;
          this.sfeeAmts.totalDue = 0;

          this.serviceFeeMainData.tableData.forEach(a => {
            this.sfeeAmts.totalVatAmt = numParser(this.sfeeAmts.totalVatAmt) + numParser(a.totalVat);
            this.sfeeAmts.totalWhTaxAmt = numParser(this.sfeeAmts.totalWhTaxAmt) + numParser(a.totalWhtax);
          });

          this.sfeeAmts.totalDue = numParser(this.sfeeAmts.totalSfeeAmt) - numParser(this.sfeeAmts.mreSfeeAmt) + numParser(this.sfeeAmts.totalVatAmt) - numParser(this.sfeeAmts.totalWhTaxAmt);

          this.servFeeMainTbl.refreshTable();
          this.servFeeSubTbl.refreshTable();

          this.servFeeMainTbl.markAsDirty();
          this.servFeeSubTbl.markAsDirty();
        } else {
          if(this.sfeeReturnCode == 1) {
            //show unposted months
          } else if(this.sfeeReturnCode == 2) {
            this.sfeeMdlRefNo = data['refNo'];
          } else if(this.sfeeReturnCode == 3) {
            this.sfeeMdlRefNo = data['refNo'];
          } else if(this.sfeeReturnCode == 4) {
            this.sfeeMdlRefNo = data['refNo'];
            this.sfeeMdlAmount = data['amount'];
          }

          this.servfeeMdl.openNoClose();
        }
      });
    }
  }

  onSaveServFee() {
    var param = {
      reqId: this.requestData.reqId,
      quarter: this.qtrParam,
      year: this.yearParam,
      servFeeAmt: +parseFloat(this.sfeeAmts.totalSfeeAmt).toFixed(2),
      netServFee: this.sfeeAmts.totalDue,
      currCd: this.requestData.currCd,
      currRt: this.requestData.currRate,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0)
    }

    this.acctService.saveAcctPrqServFee(param).subscribe(data => {
      this.sfeeReturnCode = data['returnCode'];

      if(this.sfeeReturnCode == -1) {
        this.dialogIcon = "success";
        this.sucServFee.open();
        this.getAcctPrqServFee();
        this.getPaytReqPrqTrans();
      } else if(this.sfeeReturnCode == 0) {
        this.dialogIcon = 'error';
        this.sucServFee.open();
      } else {
        // if(this.sfeeReturnCode == 1) {
        //   //show unposted months
        // } else if(this.sfeeReturnCode == 2) {
        //   this.sfeeMdlRefNo = data['refNo'];
        // } else if(this.sfeeReturnCode == 3) {
        //   this.sfeeMdlRefNo = data['refNo'];
        // } else if(this.sfeeReturnCode == 4) {
        //   this.sfeeMdlRefNo = data['refNo'];
        //   this.sfeeMdlAmount = data['amount'];
        // }

        // this.servfeeMdl.openNoClose();
      }
    });
  }

  onClickSaveServFee(cancelFlag?) {
    this.cancelFlagServFee = cancelFlag !== undefined;
    this.conServFee.confirmModal();
  }

  checkCancelServFee() {
    if(this.cancelFlagServFee) {
      this.canServFee.onNo();
    }
  }

  loadingFunc(bool){
    var str = bool?'block':'none';
    $('.globalLoading').css('display',str);
  }

}
