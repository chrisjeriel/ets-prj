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

  inwardPolBalData: any = {
    tHeaderWithColspan : [{ header: "", span: 1 },
                          { header: "Policy Information", span: 14 },
                          { header: "Payment Details", span: 5 },
                          { header: "", span: 2 }],
    tableData     : [],
    tHeader: ['Policy No.','Inst No.','Co Ref No','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','RI Comm Vat','Charges','Net Due','Cumulative Payment','Balance',' Payment Amount','Premium','RI Comm','RI Comm VAT','Charges','Total Payments','Remaining Balance'],
    dataTypes: ['text','sequence-2','text','date','date','text','percent','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency'],
    magnifyingGlass : ['policyNo'],
    nData: {
      newRec         : 1,
      policyNo       : '',
      instNo         : '',
      dueDate        : '',
      currCd         : '',
      currRate       : '',
      netDue         : '',
      prevPaytAmt    : '',
      premAmt        : '',
      riComm         : '',
      riCommVat      : '',
      charges        : '',
      returnAmt      : '',
      showMG         : 1
    },
    paginateFlag  : true,
    infoFlag      : true,
    // uneditableKeys: ['returnAmt'], 
    pageID        : 'inwardPolBalData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    // uneditable    : [true,true,true,true,true,true,true,true,true,true,true,false],
    // total         : [null, null, null, null, 'Total', 'netDue', 'prevPaytAmt', 'premAmt', 'riComm', null, 'charges', 'returnAmt'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true],
    total:[null,null,null,null,null,null,'Total','prevPremAmt','prevRiComm','prevRiCommVat', 'prevCharges','prevNetDue','cumPayment','balance','returnAmt', 'premAmt','riComm','riCommVat','charges','totalPayt','remainingBal'],
    // widths        : [200,1,110,1,110,120,120,120,120,120,120,120,120],
    // keys          : ['policyNo','instNo','dueDate','currCd','currRate','netDue','prevPaytAmt','premAmt','riComm','riCommVat','charges','returnAmt']
    keys:['policyNo','instNo','coRefNo','effDate','dueDate','currCd', 'currRate','prevPremAmt', 'prevRiComm','prevRiCommVat', 'prevCharges','prevNetDue','cumPayment','balance','returnAmt', 'premAmt','riComm','riCommVat','charges','totalPayt','remainingBal']
  };

  treatyBalanceData: any = {
    tableData     : [],
    tHeader       : ['Quarter Ending', 'Currency', 'Currency Rate', 'Amount', 'Amount(PHP)'],
    dataTypes     : ['text', 'select', 'percent', 'currency', 'currency'],
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
    opts: [
      {selector   : 'currCd',  prev : [], vals: []},
    ],
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'treatyBalanceData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [true,false,true,false,true],
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
    dataTypes     : ['text', 'text', 'text', 'select', 'percent', 'currency', 'currency'],
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
    opts: [
      {selector   : 'currCd',  prev : [], vals: []},
    ],
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'othersData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [false,false,false,false,true,false,true],
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
    tHeader       : ['Main Company Distribution','Percent Share (%)','Curr','Curr Rate','Amount', 'Amount (PHP)'],
    dataTypes     : ['text','percent','text','percent','currency','currency'],
    keys          : ['groupName','groupShrPct','currCd','currRt','groupShrAmt','localAmt'],
    paginateFlag  : true,
    infoFlag      : true,
    checkFlag     : false,
    addFlag       : false,
    deleteFlag    : false,
    uneditable    : [true,true,true,true,true,true],
    total         : [null,null,null,'Total','groupShrAmt','localAmt'],
    widths        : ['400','100','1','100','auto','auto'],
    pageID        : 'serviceFeeMainData',
    pageLength    : 3,
  };

  serviceFeeSubData: any = {
    tableData     : [],
    tHeader       : ['Sub-Distribution of Pool & Munich Re','Percent Share (%)','Curr','Curr Rate','Amount', 'Amount (PHP)'],
    dataTypes     : ['text','percent','text','percent','currency','currency'],
    keys          : ['cedingName','actualShrPct','currCd','currRt','actualShrAmt','localAmt'],
    paginateFlag  : true,
    infoFlag      : true,
    checkFlag     : false,
    addFlag       : false,
    deleteFlag    : false,
    uneditable    : [true,true,true,true,true,true],
    total         : [null,null,null,'Total','actualShrAmt','localAmt'],
    widths        : ['400','100','1','100','auto','auto'],
    pageID        : 'serviceFeeSubData',
    pageLength    : 10,
  };

  passData : any = {
    selector   : '',
    payeeNo    : ''
  };

  tranTypeList       : any;
  tabTitle           : string = '';
  limitClmHistTbl    : any[] = [];
  limitHistCat       : string = '';
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
  allotedAmt         : any;
  totalBal           : any;
  variance           : any;
  allotedChanged     : boolean = false;
  currentTbl         : any;

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


  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService, 
              private clmService: ClaimsService, public modalService: NgbModal, private dp: DatePipe,private decPipe: DecimalPipe) {
  }

  ngOnInit() {
    setTimeout(() => {
      $('.globalLoading').removeClass('globalLoading;');
    },0);
    
    var d = new Date();
    this.qtrParam = Math.floor((d.getMonth() / 3) + 1);
    this.yearParam = d.getFullYear();

    for(let x = d.getFullYear(); x >= 2018; x--) {
      this.yearParamOpts.push(x);
    }

    this.getPaytReqPrqTrans();
  }

  getPaytReqPrqTrans(){    
    var subRes = forkJoin(this.acctService.getPaytReq(this.rowData.reqId),this.acctService.getAcitPrqTrans(this.rowData.reqId,''))
                 .pipe(map(([pr,prq]) => { return { pr, prq }; }));
    subRes.subscribe(data => {
      this.requestData = data['pr']['acitPaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate); return e; })[0];
      this.recPrqTrans = data['prq']['acitPrqTrans'];
      console.log(this.requestData);
      console.log(this.recPrqTrans);
      if(this.activeOthTab){
        this.othersData.tableData = [];
        this.getOthers();
      }else if(this.activeUnColTab){
        this.unappliedColData.tableData = [];
        this.getUnCol();
      }else{
        if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 2 || this.requestData.tranTypeCd == 3){
          this.cedingCompanyData.tableData = [];
          this.getClmHist();
        }else if(this.requestData.tranTypeCd == 4){
          this.inwardPolBalData.tableData = [];
          this.getAcitPrqInwPol();
        }else if(this.requestData.tranTypeCd == 5){
          this.getAcctPrqServFee();
        }else if(this.requestData.tranTypeCd == 6){
          this.treatyBalanceData.tableData = [];
          this.getTreaty();
        }else if(this.requestData.tranTypeCd == 7){
          this.investmentData.tableData = [];
          this.getAcitInvt();
        }else if(this.requestData.tranTypeCd == 8){
          this.othersData.tableData = [];
          this.getOthers();
        }
      }
    });
  }

  // getAcitPaytReq(){
  //   this.acctService.getPaytReq(this.rowData.reqId)
  //   .subscribe(data => {
  //     console.log(data);
  //     var rec = data['acitPaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
  //                                              e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
  //                                              e.approvedDate = this.ns.toDateTimeString(e.approvedDate); return e; });
  //     this.requestData = rec[0];
  //     console.log(this.requestData);
  //     console.log('from req entry');
  //   });
  // }

  // getPrqTrans(){
  //   this.acctService.getAcitPrqTrans(this.rowData.reqId,'')
  //   .subscribe(data => {
  //     console.log(data);
  //     console.log('from req details');
  //     this.recPrqTrans = data['acitPrqTrans'];
  //     if(this.activeOthTab){
  //       this.othersData.tableData = [];
  //       this.getOthers();
  //     }else if(this.activeUnColTab){
  //       this.unappliedColData.tableData = [];
  //       this.getUnCol();
  //     }else{
  //       if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 2 || this.requestData.tranTypeCd == 3){
  //         this.cedingCompanyData.tableData = [];
  //         this.getClmHist();
  //       }else if(this.requestData.tranTypeCd == 4){
  //         this.inwardPolBalData.tableData = [];
  //         this.getAcitPrqInwPol();
  //       }else if(this.requestData.tranTypeCd == 5){
  //         this.getAcctPrqServFee();
  //       }else if(this.requestData.tranTypeCd == 6){
  //         this.treatyBalanceData.tableData = [];
  //         this.getTreaty();
  //       }else if(this.requestData.tranTypeCd == 7){
  //         this.investmentData.tableData = [];
  //         this.getAcitInvt();
  //       }else if(this.requestData.tranTypeCd == 8){
  //         this.othersData.tableData = [];
  //         this.getOthers();
  //       }
  //     }
  //   });
  // }

  getUnCol(){
    this.mtnService.getRefCode('UNAPPLIED_COLLECTION_TYPE')
    .subscribe(data => {
      console.log(data);
      var rec = data['refCodeList'];
      this.unappliedColData.opts[0].vals = rec.map(e => e.code);
      this.unappliedColData.opts[0].prev = rec.map(e => e.description);
    });
    this.unappliedColData.tableData = this.recPrqTrans.filter(e => e.transdtlType != null).map(e => {
      e.reqId  = this.rowData.reqId;
      return e;
    });
    this.unColTbl.refreshTable();
  }

  getOthers(){
    this.mtnService.getMtnCurrency('','Y')
    .subscribe(data => {
      var rec = data['currency'];
      this.currData = rec;
      this.othersData.opts[0].vals = rec.map(i => i.currencyCd);
      this.othersData.opts[0].prev = rec.map(i => i.currencyCd);
    });

    this.othersData.tableData = this.recPrqTrans.filter(e => e.itemName != null && e.transdtlType == null).map(e => {
      e.reqId  = this.rowData.reqId; 
      e.currCd = (e.currCd == '' || e.currCd == null)?String(this.currData.filter(e2 => e.currCd == e2.currencyCd)):e.currCd;
      return e;
    });
    this.othTbl.refreshTable();
  }

  getAcitInvt(){
    this.acctService.getAccInvestments([])
    .subscribe(data => {
      var recACitInvt = data['invtList'];

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
      this.treatyBalanceData.opts[0].vals = rec.map(i => i.currencyCd);
      this.treatyBalanceData.opts[0].prev = rec.map(i => i.currencyCd);
    });

    this.treatyBalanceData.tableData = this.recPrqTrans.filter(e => e.itemName == null).map(e => { 
      e.reqId  = this.rowData.reqId; 
      e.currCd = (e.currCd == '' || e.currCd == null)?String(this.currData.filter(e2 => e.currCd == e2.currencyCd)):e.currCd;
      e.quarterEnding = this.dp.transform(this.ns.toDateTimeString(e.quarterEnding).split('T')[0], 'MM/dd/yyyy');
      return e; 
    });

    this.treatyTbl.refreshTable();
  }

  getAcitPrqInwPol(){
    var subRec = forkJoin(this.acctService.getAcitPrqInwPol(this.rowData.reqId,''), this.acctService.getAcitSoaDtlNew(this.requestData.currCd))
                         .pipe(map(([inwPol,soaDtl]) => { return { inwPol,soaDtl }; }));

    subRec.subscribe(data => {
      console.log(data);
      var recAcitPrqInwPol = data['inwPol']['acitPrqInwPolList'];
      var recAcitSoaDtl    = data['soaDtl']['soaDtlList'];

      this.recPrqTrans.forEach(e => {
          this.inwardPolBalData.tableData.push(recAcitPrqInwPol.filter(e2 => e2.itemNo == e.itemNo && e2.reqId == e.reqId)
                                                                      .map(e2 => {
                                                                        e2.policyId = e.policyId;
                                                                        e2.instNo   = e.instNo;
                                                                        e2.itemNo   = e.itemNo;
                                                                        e2.reqId    = e.reqId;
                                                                        return e2;
                                                                      }));
      });
      this.inwardPolBalData.tableData = this.inwardPolBalData.tableData.flatMap(e => { return e });
      recAcitSoaDtl.forEach(e => {
        this.inwardPolBalData.tableData.filter(e2 => e.policyId == e2.policyId && e.instNo == e2.instNo).map(e2 => Object.assign(e2,e));
      });
      console.log(this.inwardPolBalData.tableData);
      this.inwardTbl.refreshTable();
      this.reCompInw();
    });
  }

  getClmHist(){
    this.clmService.getClaimHistory()
    .subscribe(data => {
      var recClmHist  = data['claimReserveList'].map(e => e.clmHistory).flatMap(e => { return e }).filter(e => (this.requestData.tranTypeCd == 3)?e.histCategory == 'L':e.histCategory != 'L').map(e => { return e });

      this.recPrqTrans.forEach(e => {
        this.cedingCompanyData.tableData.push(recClmHist.filter(e2 => e2.claimId == e.claimId && e2.histNo == e.histNo && e2.projId == e.projId )
                                                              .map(e2 => { 
                                                                e2.paymentFor = e.paymentFor; 
                                                                e2.createUser = e.createUser;
                                                                e2.updateUser = e.updateUser;
                                                                e2.createDate = e.createDate;
                                                                e2.updateDate = e.updateDate;
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

  onChangeCurr(){
    if(this.requestData.tranTypeCd == 8 || this.activeOthTab){
      this.othersData.tableData.forEach(e => {
        e.currRate = (e.currCd != '' || e.currCd != null && e.currRate == '' || e.currRate == null)?String(this.currData.filter(e2 => e.currCd == e2.currencyCd).map(e2 => e2.currencyRt)):e.currRate;
        e.localAmt = (!isNaN(e.currAmt))?Number(e.currAmt)*Number(e.currRate):0;
      });
    }else{
      if(this.requestData.tranTypeCd == 6){
        this.treatyBalanceData.tableData.forEach(e => {
          e.currRate = (e.currCd != '' || e.currCd != null && e.currRate == '' || e.currRate == null)?String(this.currData.filter(e2 => e.currCd == e2.currencyCd).map(e2 => e2.currencyRt)):e.currRate;
          e.localAmt = (!isNaN(e.currAmt))?Number(e.currAmt)*Number(e.currRate):0;
        });
      }
    }
  }

  defaultData(){
    this.unappliedColData.tableData.map(e => {
      if(e.newRec == 1){
        e.currCd   = this.requestData.currCd;
        e.currRate = this.requestData.currRate;
        e.localAmt = (e.currAmt != null)?Number(e.currAmt) * Number(e.currRate):'';
      }
    });
  }

  showLOV(event, from){
    this.limitContent = [];

    if(from.toUpperCase() == 'LOVCEDTBL'){
      this.cedingCompanyData.tableData.forEach(e => {
        this.limitClmHistTbl.push(e);
      });
      (this.requestData.tranTypeCd == 3)?this.limitData.histCategory = ['L']:this.limitData.histCategory = ['A','O'];
      this.limitData.histType = [4,5];
      this.clmHistLov.modal.openNoClose();
    }else if(from.toUpperCase() == 'LOVINWARDTBL'){
      this.inwardPolBalData.tableData.forEach(e =>{
        this.limitContent.push(e);
      });
      this.passData.currCd = this.requestData.currCd;
      this.passData.selector = 'acitSoaDtlPrq';
      this.passData.payeeNo = this.requestData.payeeCd;
      this.aginSoaLov.openLOV();
    }else if(from.toUpperCase() == 'LOVTRTYTBL'){
      this.trtyIndx = event.index;
      this.trtyLov.modal.openNoClose();
    }else if(from.toUpperCase() == 'LOVINVTTBL'){
      this.investmentData.tableData.forEach(e =>{
        this.limitContent.push(e);
      });
      this.passData.selector = 'acitInvt';
      this.invtLov.openLOV();
    }
  }

  reCompInw(){
    this.warn = [];
    console.log(this.inwardPolBalData.tableData);
    this.inwardPolBalData.tableData.forEach(e => {
      e.premAmt      = Math.round(((e.returnAmt/e.balAmtDue)*e.balPremDue) * 100)/100;
      e.riComm       = Math.round(((e.returnAmt/e.balAmtDue)*e.balRiComm) * 100)/100;
      e.riCommVat    = Math.round(((e.returnAmt/e.balAmtDue)*e.balRiCommVat) * 100)/100;
      e.charges      = Math.round((e.returnAmt - (e.premAmt - e.riComm - e.riCommVat)) * 100)/100;
      e.totalPayt    = Math.round((e.returnAmt + e.cumPayment) * 100)/100;
      e.remainingBal = Math.round((e.prevNetDue - e.totalPayt) * 100)/100;

      if(e.prevBalance < 0) {
        if(e.returnAmt > 0){
          this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.cumPayment)))?1:0);
        }else{
          this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.prevBalance)))?2:0);
        }
      }else{
        if(e.returnAmt < 0){
          this.warn.push((Math.abs(Number(e.returnAmt)) > Math.abs(Number(e.cumPayment)))?1:0);
        }else{
          this.warn.push((e.returnAmt > e.prevBalance)?2:0);
        }
      }
      
      
    });

    // if(this.allotedAmt == 0 || this.allotedAmt == '' || this.allotedAmt == null){
    //   this.allotedAmt = (this.recPrqTrans.length == 0)?this.requestData.reqAmt:this.recPrqTrans[0].allotedAmt;  
    // }

    // var allAmt = (Number(String(this.allotedAmt).replace(/\,/g,'')) > 0)?Number(String(this.allotedAmt).replace(/\,/g,'')) * Number(-1):Number(String(this.allotedAmt).replace(/\,/g,''));
    // var returnAmtSum = Number(this.inwardPolBalData.tableData.map(e => e.returnAmt).reduce((a,b) => a+b ,0));
    // // this.inwardPolBalData.total[14] = (returnAmtSum > 0)?returnAmtSum * Number(-1):returnAmtSum;
    // this.totalBal = Math.abs(Number(returnAmtSum));
    // this.variance = Math.abs(Number(allAmt)) - Math.abs(Number(returnAmtSum));
    // this.allotedAmt = this.decPipe.transform(Number(allAmt), '0.2-2');
    // this.totalBal = Number(this.totalBal) * Number(-1);
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
    }else if(from.toUpperCase() == 'LOVINWARDTBL'){
      var recAgingSoaDtl = data['data'];
      recAgingSoaDtl.forEach(e => {
        if(this.inwardPolBalData.tableData.some(e2 => e2.policyId != e.policyId && e2.instNo != e.instNo)){
          this.inwardPolBalData.tableData.push(e);
          this.limitContent.push(e);
        }
      });
      this.inwardPolBalData.tableData = this.inwardPolBalData.tableData.filter(e => e.policyNo != '')
                                            .map(e => { 
                                                e.edited = true; e.checked = false; e.createDate = ''; e.createUser = '';
                                                e.premAmt   = '';
                                                e.riComm    = '';
                                                e.riCommVat = '';
                                                e.charges   = '';
                                                (e.returnAmt == '' || e.returnAmt == null)?e.newRec=1:'';
                                                e.returnAmt = (e.newRec==1)?0:e.returnAmt;
                                                return e;
                                            });
      this.inwardTbl.refreshTable();
      this.reCompInw();
    }else if(from.toUpperCase() == 'LOVTRTYTBL'){
      this.treatyBalanceData.tableData[this.trtyIndx].quarterEnding = this.dp.transform(this.ns.toDateTimeString(data).split('T')[0], 'MM/dd/yyyy');
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
    }
  }

  onClickSave(){
    // var totalAmt = this.recPrqTrans.reduce((a,b)=>a+(b.currAmt != null ?parseFloat(b.currAmt):0),0);
    // var ts = this;
    // function showWarning(tbl){
    //    var currAmt = tbl.filter(e => e.deleted != true && e.newRec == 1).reduce((a,b)=>a+(b.currAmt != null ?parseFloat(b.currAmt):0),0);
    //    if(Number(ts.requestData.reqAmt) < (currAmt + totalAmt)){
    //      ts.warnMsg = 'The sum of all payments under this request must not exceed the requested amount.';
    //      ts.warnMdl.openNoClose();
    //      return true;
    //    }else{
    //      return false;
    //    }
    // };    

      if(this.activeOthTab){
        // (!showWarning(this.othersData.tableData))?this.onClickSaveOth():'';
        this.onClickSaveOth();
      }else if(this.activeUnColTab){
        // (!showWarning(this.unappliedColData.tableData))?this.onClickSaveUnCol():'';
        this.onClickSaveUnCol();
      }else{
        if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 2 || this.requestData.tranTypeCd == 3){
          // (!showWarning(this.cedingCompanyData.tableData))?this.onClickSaveCPC():'';
          this.onClickSaveCPC();
        }else if(this.requestData.tranTypeCd == 4){
          // (!showWarning(this.inwardPolBalData.tableData))?this.onClickSaveInw():'';
          this.onClickSaveInw();
        }else if(this.requestData.tranTypeCd == 5){
          this.onClickSaveServFee();
        }else if(this.requestData.tranTypeCd == 6){
          this.onClickSaveTrty();
        }else if(this.requestData.tranTypeCd == 7){
          // (!showWarning(this.investmentData.tableData))?this.onClickSaveInvt():'';
          this.onClickSaveInvt();
        }else if(this.requestData.tranTypeCd == 8){
          // (!showWarning(this.othersData.tableData))?this.onClickSaveOth():'';
          this.onClickSaveOth();
        }
      }
  }

  onClickSaveUnCol(cancelFlag?){
    this.cancelFlagUnCol = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;

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
        if(e.edited && !e.deleted){ //['transdtlTypeDesc','itemName','refNo','remarks','currCd','currRate','currAmt','localAmt']
          // this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.transdtlType != e.transdtlType && i.itemName != e.itemName && i.refNo != e.refNo && i.remarks != e.remarks && 
          //                                                            i.currCd != e.currCd && i.currRate != e.currRate && i.currAmt != e.currAmt && i.localAmt != e.localAmt);
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

    var currAmt = this.unappliedColData.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.currAmt != null ?parseFloat(b.currAmt):0),0);
    var totalAmt = this.unappliedColData.tableData.filter(e => e.deleted != true && e.newRec == 1).reduce((a,b)=>a+(b.currAmt != null ?parseFloat(b.currAmt):0),0);
    console.log(currAmt);
    console.log(this.unappliedColData.tableData);

    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.sucUnCol.open();
      this.params.savePrqTrans   = [];
    }else{
      // if(Number(this.requestData.reqAmt) < (Number(totalAmt) + Number(this.totalReqAmt))){
      //   this.warnMsg = 'The Total payments for the Unapplied Collection, Unapplied Collection and Others must not exceed the Requested Amount.';
      //   this.warnMdl.openNoClose();
      //   this.params.savePrqTrans   = [];
      //   this.params.deletePrqTrans = [];
      // }else 
      // if(Number(this.requestData.reqAmt) < Number(currAmt)){
      //   this.warnMsg = 'The Total Amount for the Unapplied Collection must not exceed the Requested Amount.';
      //   this.warnMdl.openNoClose();
      //   this.params.savePrqTrans   = [];
      //   this.params.deletePrqTrans = [];
      // }else{
        if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
          $('.ng-dirty').removeClass('ng-dirty');
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
     // }
    }
  }

  onClickSaveOth(cancelFlag?){
    this.cancelFlagOth = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;

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
        if(e.edited && !e.deleted){ //['itemName','refNo','remarks','currCd','currRate','currAmt','localAmt']
          this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.itemName != e.itemName && i.refNo != e.refNo && i.remarks != e.remarks && 
                                                                     i.currCd != e.currCd && i.currRate != e.currRate && i.currAmt != e.currAmt && i.localAmt != e.localAmt);
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

    var currAmt = this.othersData.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.currAmt != null ?parseFloat(b.currAmt):0),0);
    var totalAmt = this.othersData.tableData.filter(e => e.deleted != true && e.newRec == 1).reduce((a,b)=>a+(b.currAmt != null ?parseFloat(b.currAmt):0),0);
    console.log(currAmt);
    console.log(this.othersData.tableData);

    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.sucOth.open();
      this.params.savePrqTrans   = [];
    }else{
      // if(Number(this.requestData.reqAmt) < (Number(totalAmt) + Number(this.totalReqAmt))){
      //   this.warnMsg = 'The Total payments for the Unapplied Collection, Unapplied Collection and Others must not exceed the Requested Amount.';
      //   this.warnMdl.openNoClose();
      //   this.params.savePrqTrans   = [];
      //   this.params.deletePrqTrans = [];
      // }else 
      // if(Number(this.requestData.reqAmt) < Number(currAmt)){
      //   this.warnMsg = 'The Total Amount for the Other Payments must not exceed the Requested Amount.';
      //   this.warnMdl.openNoClose();
      //   this.params.savePrqTrans   = [];
      //   this.params.deletePrqTrans = [];
      // }else{
        if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
          $('.ng-dirty').removeClass('ng-dirty');
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
      //}
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

    var invtAmt = this.investmentData.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.invtAmt != null ?parseFloat(b.invtAmt):0),0);
    var totalAmt = this.investmentData.tableData.filter(e => e.deleted != true && e.newRec == 1).reduce((a,b)=>a+(b.invtAmt != null ?parseFloat(b.invtAmt):0),0);

    // if(Number(this.requestData.reqAmt) < Number(invtAmt)){
    //     this.warnMsg = 'The Total Investment Amount for Placement must not exceed the Requested Amount.';
    //     this.warnMdl.openNoClose();
    //     this.params.savePrqTrans   = [];
    //     this.params.deletePrqTrans = [];
    // }else{
      // if(Number(this.requestData.reqAmt) < (Number(totalAmt) + Number(this.totalReqAmt))){
      //   this.warnMsg = 'The Total payments for the Investment, Unapplied Collection and Others must not exceed the Requested Amount.';
      //   this.warnMdl.openNoClose();
      //   this.params.savePrqTrans   = [];
      //   this.params.deletePrqTrans = [];
      // }else 
      if(isEmpty == 1){
        this.dialogIcon = 'error';
        this.sucInvt.open();
        this.params.savePrqTrans   = [];
      }else{
        if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
          $('.ng-dirty').removeClass('ng-dirty');
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
      
    //}
  }

  onClickSaveTrty(cancelFlag?){
    this.cancelFlagTrty = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isNotUnique : boolean ;
    var saveTrty = this.params.savePrqTrans;
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

    var currAmt = this.treatyBalanceData.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.currAmt != null ?parseFloat(b.currAmt):0),0);
    
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
        // if(Number(this.requestData.reqAmt) < Number(currAmt)){
        //   this.warnMsg = 'The Total Amount of Treaty Balance Due to Participants must not exceed the Requested Amount.';
        //   this.warnMdl.openNoClose();
        //   this.params.savePrqTrans   = [];
        //   this.params.deletePrqTrans = [];
        // }else{
          if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
            $('.ng-dirty').removeClass('ng-dirty');
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
        //}
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
    console.log(this.recPrqTrans.allotedAmt);
    this.inwardPolBalData.tableData.forEach(e => {
      if(e.returnAmt == '' || e.returnAmt == null){
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
          this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.policyId != e.policyId);
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
    var totalAmt = this.inwardPolBalData.tableData.filter(e => e.deleted != true && e.newRec == 1).reduce((a,b)=>a+(b.returnAmt != null ?parseFloat(b.returnAmt):0),0);
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
    }
    // else if(Number(this.requestData.reqAmt) < (Number(totalAmt) + Number(this.totalReqAmt))){
    //       this.warnMsg = 'The Total payments for Inward Policy Balance, Unapplied Collection, and Others must not exceed the Requested Amount.';
    //       this.warnMdl.openNoClose();
    //       this.params.savePrqTrans   = [];
    //       this.params.deletePrqTrans = [];
    // }
    // else if(Number(this.requestData.reqAmt) < Number(returnAmt)){
    //   this.warnMsg = 'The Total Inward Policy Balances Returns must not exceed the Requested Amount.';
    //   this.warnMdl.openNoClose();
    //   this.params.savePrqTrans   = [];
    //   this.params.deletePrqTrans = [];
    // }
    else{
      if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
        (!this.allotedChanged)?$('.ng-dirty').removeClass('ng-dirty'):'';
        this.conInw.confirmModal();
        this.params.savePrqTrans   = [];
        this.params.deletePrqTrans = [];
        this.inwardPolBalData.tableData = this.inwardPolBalData.tableData.filter(e => e.policyNo != '');
      }
      // else if(this.inwardPolBalData.tableData.some(e => e.returnAmt == 0)){
      //   this.warnMsg = 'Please enter a Payment Amount.';
      //   this.warnMdl.openNoClose();
      //   this.params.savePrqTrans = [];
      // }
      else{
        if(this.cancelFlagInw == true){
          this.conInw.showLoading(true);
          setTimeout(() => { try{this.conInw.onClickYes();}catch(e){}},500);
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
   // ['claimNo','histNo','histCatDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currencyCd','currencyRt','reserveAmt','paytAmt','localAmt']

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
        $('.ng-dirty').removeClass('ng-dirty');
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
      if(data['returnCode'] == -1){
        this.getPaytReqPrqTrans();  
      }else{
        this.dialogIcon = 'error';
      }
      this.sucUnCol.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
    });
  }

  onSaveOth(){
    console.log(this.params);
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == -1){
        this.getPaytReqPrqTrans();  
      }else{
        this.dialogIcon = 'error';
      }
      this.sucOth.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
    });
  }

  onSaveTrty(){
    this.params.savePrqTrans = this.params.savePrqTrans.map(e => { 
        e.quarterEnding = this.ns.toDateTimeString(e.quartEndingSave); 
      return e; 
    });
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      if(data['returnCode'] == -1){
        this.getPaytReqPrqTrans();  
      }else{
        this.dialogIcon = 'error';
      }
      this.sucTrty.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
    });
  }

  onSaveInvt(){
    console.log(this.params);
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == -1){
        this.getPaytReqPrqTrans();  
      }else{
        this.dialogIcon = 'error';
      }
      this.sucInvt.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
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
        netDue      : e.netDue,
        premAmt     : e.premAmt,
        prevPaytAmt : e.cumPayment,
        prevBalance : e.balance,
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

    // var saveSubs = forkJoin(this.acctService.saveAcitPrqTrans(JSON.stringify(this.params)),this.acctService.saveAcitPrqInwPol(JSON.stringify(prqInwPol)))
    //                        .pipe(map(([trans,inw]) => { return { trans,inw }; }));

    // saveSubs.subscribe(data =>{
    //   console.log(data);
    //   this.getPaytReqPrqTrans();
    //   this.sucInw.open();
    //   this.params.savePrqTrans  = [];
    //   this.params.deletePrqTrans  = [];
    // });
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == -1){
        this.getPaytReqPrqTrans();  
      }else{
        this.dialogIcon = 'error';
      }
      this.sucInw.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
    });
  }

  onSaveCPC(){
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == -1){
        this.getPaytReqPrqTrans();  
      }else{
        this.dialogIcon = 'error';
      }
      this.sucClm.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
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
      this.sucClm.modal.closeModal();
    }
  }

  checkCancelInw(){
    if(this.cancelFlagInw){
      this.canInw.onNo();
    }else{
      this.sucInw.modal.closeModal();
    }
  }

  checkCancelTrty(){
    if(this.cancelFlagTrty){
      this.canTrty.onNo();
    }else{
      this.sucTrty.modal.closeModal();
    }
  }

  checkCancelInvt(){
    if(this.cancelFlagInvt){
      this.canInvt.onNo();
    }else{
      this.sucInvt.modal.closeModal();
    }
  }

  checkCancelUncol(){
    if(this.cancelFlagUnCol){
      this.canUnCol.onNo();
    }else{
      this.sucUnCol.modal.closeModal();
    }
  }

  checkCancelOth(){
    if(this.cancelFlagOth){
      this.canOth.onNo();
    }else{
      this.sucOth.modal.closeModal();
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
    }else if(this.requestData.tranTypeCd == 7){
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
      $('#cedTbl').addClass('ng-dirty');
    }else if(from == 'inwTbl'){
      $('#inwTbl').addClass('ng-dirty'); 
    }else if(from == 'invtTbl'){
      $('#invtTbl').addClass('ng-dirty');
    }else if(from == 'trtyTbl'){
      $('#trtyTbl').addClass('ng-dirty');
    }else if(from == 'othTbl'){
      $('#othTbl').addClass('ng-dirty');
    }else if(from == 'unColTbl'){
      $('#unColTbl').addClass('ng-dirty');
    }
  }

  onChangeAllotedAmt(){
    this.allotedChanged = true;
    this.inwardPolBalData.tableData.map(e => { e.edited = true; return e; });
    console.log(this.inwardPolBalData.tableData);
    var allAmt = Number(String(this.allotedAmt).replace(/\,/g,''));
    if(Number(allAmt) > Number(this.requestData.reqAmt)){
      this.allotedAmt = '';
      this.warnMsg = 'Alloted Policy Balance Payments must not exceed the Requested Amount';
      this.warnMdl.openNoClose();
    }
  }

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
    // this.getAcitPaytReq();
    // this.getPrqTrans();
    this.getPaytReqPrqTrans();
  }

  getAcctPrqServFee(gnrt?) {
    setTimeout(() => {
      this.servFeeMainTbl.refreshTable();
      this.servFeeSubTbl.refreshTable();
      this.servFeeMainTbl.overlayLoader = true;
      this.servFeeSubTbl.overlayLoader = true;
    }, 0);

    if(gnrt == undefined) {
      this.acctService.getAcctPrqServFee('normal', this.requestData.reqId).subscribe(data => {
        this.serviceFeeMainData.tableData = data['mainDistList'];
        this.serviceFeeSubData.tableData = data['subDistList'].sort((a, b) => b.actualShrPct - a.actualShrPct);

        this.servFeeMainTbl.refreshTable();
        this.servFeeSubTbl.refreshTable();

        this.servFeeMainTbl.markAsDirty();
        this.servFeeSubTbl.markAsDirty();
      });
    } else {
      this.acctService.getAcctPrqServFee('generate', this.requestData.reqId, this.qtrParam, this.yearParam, this.requestData.reqAmt, this.requestData.currCd, this.requestData.currRate).subscribe(data => {
        this.serviceFeeMainData.tableData = data['mainDistList'];
        this.serviceFeeSubData.tableData = data['subDistList'].sort((a, b) => b.actualShrPct - a.actualShrPct);

        this.servFeeMainTbl.refreshTable();
        this.servFeeSubTbl.refreshTable();

        this.servFeeMainTbl.markAsDirty();
        this.servFeeSubTbl.markAsDirty();
      });
    }
  }

  onSaveServFee() {
    var param = {
      reqId: this.requestData.reqId,
      quarter: this.qtrParam,
      year: this.yearParam,
      servFeeAmt: this.requestData.reqAmt,
      currCd: this.requestData.currCd,
      currRt: this.requestData.currRate,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0)
    }

    this.acctService.saveAcctPrqServFee(param).subscribe(data => {
      if(data['returnCode'] == -1) {
        this.dialogIcon = "success";
        this.sucServFee.open();
        this.getAcctPrqServFee();
      } else {
        this.dialogIcon = "error";
        this.sucServFee.open();
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

}
