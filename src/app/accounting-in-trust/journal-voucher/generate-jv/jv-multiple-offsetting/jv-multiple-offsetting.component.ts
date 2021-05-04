import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { LoadingLovComponent } from '@app/_components/common/loading-lov/loading-lov.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { MtnPayeeCedingComponent } from '@app/maintenance/mtn-payee-ceding/mtn-payee-ceding.component';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { DatePipe, DecimalPipe } from '@angular/common';
import { NegativeAmountPipe } from '@app/_pipes/negative-amount.pipe';
import { NgForm } from '@angular/forms';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-jv-multiple-offsetting',
  templateUrl: './jv-multiple-offsetting.component.html',
  styleUrls: ['./jv-multiple-offsetting.component.css'],
  providers: [DatePipe, DecimalPipe, NegativeAmountPipe]
})
export class JvMultipleOffsettingComponent implements OnInit, OnDestroy {
  @Input() jvDetail: any;
  @Output() emitData = new EventEmitter<any>();
  @Output() infoData = new EventEmitter<any>();

  @ViewChild(NgbTabset) tabset: NgbTabset;
  @ViewChild('form') form:  NgForm;
  @ViewChild('ipbTbl') ipbTbl: CustEditableNonDatatableComponent;
  @ViewChild('clmTbl') clmTbl: CustEditableNonDatatableComponent;
  @ViewChild('trtyTbl') trtyTbl: CustEditableNonDatatableComponent;
  @ViewChild('unappTbl') unappTbl: CustEditableNonDatatableComponent;
  @ViewChild('invPoTbl') invPoTbl: CustEditableNonDatatableComponent;
  @ViewChild('invPlTbl') invPlTbl: CustEditableNonDatatableComponent;
  @ViewChild('lrdTbl') lrdTbl: CustEditableNonDatatableComponent;
  @ViewChild('othTbl') othTbl: CustEditableNonDatatableComponent;
  @ViewChild('lov') lov: LovComponent;
  @ViewChild('cedingLov') cedingLov: MtnPayeeCedingComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild('lovTbl') lovTbl : CustNonDatatableComponent;
  @ViewChild('loadingLov') loadingLov : LoadingLovComponent;

  passDataIpb: any = {};
  passDataClm: any = {
    tableData: [],
    tHeader: ['Company', 'Claim No', 'Hist No','Hist Category', 'Hist Type', 'Payment For', 'Insured', 'Ex-Gratia', 'Curr','Curr Rate', 'Hist Amount','Cumulative Payment','Paid Amount',' Paid Amount(PHP)'],
    dataTypes: ['text', 'text', 'sequence-2', 'text', 'text', 'text', 'text','checkbox', 'text', 'percent', 'currency','currency', 'currency', 'currency'],
    nData: {
      showMG: 1,
      claimNo: '',
      claimId: '',
      quarterNo: '',
      histNo: '',
      histCategoryDesc: '',
      histTypeDesc: '',
      paymentFor: '',
      insuredDesc: '',
      exGratia: null,
      currCd: '',
      currRate: '',
      reserveAmt: '',
      currAmt: '',
      localAmt: ''
    },
    magnifyingGlass: ['claimNo'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 'multOffClaims',
    disableAdd: false,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    uneditable: [true,true,true,true,true,false,true,true,true,true,true,true,false,true],
    total: [null,null, null,null, null, null,null, null, null, 'Total', 'reserveAmt', 'paytAmt', 'clmPaytAmt', 'localAmt'],
    widths: [1,100,1,100,125,78,115,62,50,64,110,110,110,110],
    keys:['cedingAbbr', 'claimNo','histNo','histCategoryDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currCd','currRate','reserveAmt','paytAmt','clmPaytAmt','localAmt']
  };

  passDataTrty: any = {};

  passDataUnapp: any = {
  	tableData: [],
    tHeaderWithColspan: [{header:'', span:1},{header: 'Unapplied Collection Info', span: 11}, {header: 'Payment Details', span: 2}, {header: '', span: 2}],
  	tHeader: ['Company', 'Return', 'Type', 'Item', 'Reference No', 'Description', 'Curr', 'Curr Rate', 'Unapplied Amt', 'Previous Payment','Balance','Payment Amount','Payment Amount(PHP)','Total Payment', 'Remaining Bal'],
  	dataTypes: ['text', 'checkbox','text', 'text', 'text', 'text', 'text', 'percent', 'currency',  'currency', 'currency',  'currency', 'currency', 'currency', 'currency'],
  	nData: {
  	  showMG: 1,
  	  tranId:'',
      refTranId:'',
      refBillId: '',
      refItemNo: '',
  	  transdtlName :'',
      itemName :'',
      refNo :'',
      remarks :'',
      currCd :'',
      currRate:'',
      prevPaytAmt :'',
      prevBalance :'',
      unappliedAmt :'',
      actualBalPaid:'',
      localAmt:'',
      newPaytAmt :'',
      newBalance:'',
      unappliedId: '',
      returnTag: 'N',
      cedingAbbr: ''
  	},
  	magnifyingGlass: ['transdtlName'],
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	disableAdd: false,
  	searchFlag: true,
  	infoFlag: true,
  	paginateFlag: true,
  	pageLength: 10,
  	pageID: 'multOffUnapplied',
  	uneditable: [true, false,true,true,true,true,true,true,true,true,true,false,true,true,true],
  	total: [null,null,null, null, null, null, null, 'Total', 'unappliedAmt', 'prevPaytAmt', 'prevBalance','actualBalPaid','localAmt','newPaytAmt','newBalance'],
  	keys: ['cedingAbbr','returnTag','transdtlName','itemName','refNo','remarks','currCd','currRate','unappliedAmt','prevPaytAmt','prevBalance','actualBalPaid','localAmt','newPaytAmt','newBalance'],
  	widths: [1,1,100,100,85,110,1,65,105,85,90,100,130,90,90],
  };

  passDataInvPo: any = {
    tableData: [],
    tHeaderWithColspan: [{header:'', span: 1},{header:'Maintenance Information', span: 17},{header: 'Pull-out Details', span: 7}],
    tHeader: ['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value' ,'Remaining||Income',
              'Pull-out Type','Investment','Investment Income','Bank Charge','Withholding Tax','Net Value','Income Balance'],
    dataTypes: ['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency' ,'currency',
                'row-select','currency','currency','currency','currency','currency','currency'],
    total: [null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','maturityValue',null,
            null,'pullInvtAmt','pullIncomeAmt','pullBankCharge','pullWhtaxAmt','pullNetValue','incomeBalance'],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    magnifyingGlass: ['invtCode'],
    nData: {
      tranId: '',
      itemNo: '',
      invtId: '',
      invtCode: '',
      certNo: '',
      invtType: '',
      invtTypeDesc: '',
      invtSecCd: '',
      securityDesc: '',
      maturityPeriod: '',
      durationUnit: '',
      interestRate: '',
      purchasedDate: '',
      maturityDate: '',
      destInvtId: '',
      bank: '',
      bankName: '',
      bankAcct: '',
      pulloutType: '',
      currCd: '',
      currRate: '',
      invtAmt: '',
      incomeAmt: '',
      bankCharge: '',
      whtaxAmt: '',
      maturityValue: '',
      localAmt: '',
      showMG: 1,
      pullInvtAmt: '',
      pullIncomeAmt: '',
      pullBankCharge: '',
      pullWhtaxAmt: '',
      pullNetValue: '',
      incomeBalance: ''
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 
           'invtAmt' , 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue','balIncome',
           'pulloutType','pullInvtAmt','pullIncomeAmt','pullBankCharge','pullWhtaxAmt','pullNetValue','incomeBalance'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true, true,
                 false,true,false,false,false,true,true],
    checkFlag: true,
    pageID: 'multOffInvtout',
    widths: [120,150,127,130,1,83,85,1,1,1,85,120,120,120,120,120,120],
    disableAdd: false,
    opts: [
      {
        selector: 'pulloutType',
        prev: ['Full Pull-out', 'Income Only'],
        vals: ['F', 'I']
      }
    ],
    bankChargeRt: 0,
    whtaxRt: 0
  };

  passDataInvPl: any = {
    tableData: [],
    tHeader: ['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment'],
    dataTypes: ['text','text','text','text','number','text','percent','date','date','text','percent','currency'],
    total: [null,null,null,null,null,null,null,null,null,null,'Total','invtAmt'],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    magnifyingGlass: ['invtCode'],
    nData: {
      tranId : '',
      itemNo : '',
      invtId : '',
      invtCode : '',
      certNo : '',
      invtType : '',
      invtTypeDesc : '',
      invtSecCd : '',
      securityDesc : '',
      maturityPeriod : '',
      durationUnit : '',
      interestRate : '',
      purchasedDate : '',
      maturityDate : '',
      bank : '',
      bankName : '',
      bankAcct : '',
      pulloutType : '',
      currCd : '',
      currRate : '',
      invtAmt : '',
      showMG: 1
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 'invtAmt' ],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true],
    checkFlag: true,
    pageID: 'multOffInvtplace',
    widths: [140,150,127,130,90,83,85,1,1,1,85,120]
  };

  passDataLrd: any = {
    tableData: [],
    tHeader: ['Company','Currency','Total Loss Reserve Deposit','Offset Payment','Net Loss Reserve Deposit'],
    dataTypes: ['text','text','currency','currency','currency'],
    nData: {
      showMG: 1,
      tranId: '',
      cedingId: '',
      cedingAbbr: '',
      totalLossresdep: 0,
      offsetPayt: 0,
      netLossresdep: 0
    },
    total: [null,'Total','totalLossresdep','offsetPayt','netLossresdep'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    pageLength: 10,
    widths: [1,1,120,120,120],
    magnifyingGlass: ['cedingAbbr'],
    keys: ['cedingAbbr', 'currCd', 'totalLossresdep', 'offsetPayt', 'netLossresdep'],
    uneditable: [true,true,true,false,true],
    paginateFlag: true,
    infoFlag: true,
    disableAdd: false,
    pageID: 'multOffLossReserve',
  }

  passDataOth: any = {
    tableData: [],
    tHeader: ['Company', 'Item','Reference No.','Description','Curr','Curr Rate','Amount','Amount (PHP)'],
    dataTypes: ['text', 'text','text','text','text','percent','currency','currency'],
    nData: {  
      showMG: 1,
      tranId: '',
      billId: '',
      itemNo: '',
      itemName: '',
      refNo: '',
      remarks: '',
      currCd: '',
      currRate: '',
      currAmt: 0,
      localAmt: 0,
      cedingId: '',
      cedingAbbr: ''
    },
    total: [null,null,null,null,null,'Total','currAmt','localAmt'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    pageLength: 10,
    widths: [1,210,160,'auto',80,100,120,120],
    magnifyingGlass: ['cedingAbbr'],
    keys: ['cedingAbbr','itemName', 'refNo', 'remarks', 'currCd', 'currRate', 'currAmt', 'localAmt'],
    uneditable: [true,false,false,false,true,true,false,true],
    paginateFlag: true,
    infoFlag: true,
    disableAdd: false,
    pageID: 'multOffOthers',
  }

  passLov: any = {
    selector: '',
    cedingId: '',
    hide: []
  };

  multOffDetails: any = {
  	cedingId: '',
  	cedingName: ''
  };

  params: any = {
    tranId: null,
    tranType: null,
    saveIpb: [],
    delIpb: [],
    saveClm: [],
    delClm: [],
    saveTrty: [],
    delTrty: [],
    saveUnapp: [],
    delUnapp: [],
    saveInvPo: [],
    delInvPo: [],
    saveInvPl: [],
    delInvPl: [],
    saveLrd: [],
    delLrd: [],
    saveOth: [],
    delOth: []
  };

  dialogIcon: string = '';
  dialogMessage: string = '';
  cancelFlag: boolean = false;
  readOnly: boolean = false;
  currentTab: string = '';
  lrdLoader: boolean = false;
  withExtCed: boolean = false;
  subscription: Subscription = new Subscription();
  modalOpen: boolean = false;

  passDataLov: any = {
    tableData: [],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 'multiOffsetLov',
  }

  constructor(private ns: NotesService, private as: AccountingService, private ngb: NgbModal,
  			  private dp: DatePipe, private ms: MaintenanceService, private dcp: DecimalPipe,
  			  private np: NegativeAmountPipe) { }

  ngOnInit() {
  	this.passDataIpb = this.as.getInwardPolicyKeys('JV');
  	this.passDataIpb.nData['soaNo'] = null;
    this.passDataIpb.nData['cedingAbbr'] = null;
    this.passDataIpb.tHeaderWithColspan = this.passDataIpb.tHeaderWithColspan.slice();
    this.passDataIpb.tHeader = this.passDataIpb.tHeader.slice();
    this.passDataIpb.dataTypes = this.passDataIpb.dataTypes.slice();
    this.passDataIpb.keys = this.passDataIpb.keys.slice();
    this.passDataIpb.total = this.passDataIpb.total.slice();
    this.passDataIpb.widths = this.passDataIpb.widths.slice();
    this.passDataIpb.uneditable = this.passDataIpb.uneditable.slice();
    this.passDataIpb.tHeaderWithColspan[1].span = 13;
    this.passDataIpb.tHeader.splice(0, 0, 'Company');
    this.passDataIpb.dataTypes.splice(0, 0, 'text');
    this.passDataIpb.keys.splice(0, 0, 'cedingAbbr');
    this.passDataIpb.total.splice(0, 0, null);
    this.passDataIpb.widths.splice(0, 0, 1);
    this.passDataIpb.uneditable.splice(0, 0, true);

  	this.passDataTrty = this.as.getTreatyKeys('JV');
  	this.passDataTrty.nData.currRate = this.jvDetail.currRate;
    this.passDataTrty.nData.currCd = this.jvDetail.currCd;
    this.passDataTrty.tHeaderWithColspan = this.passDataTrty.tHeaderWithColspan.slice();
    this.passDataTrty.tHeader = this.passDataTrty.tHeader.slice();
    this.passDataTrty.dataTypes = this.passDataTrty.dataTypes.slice();
    this.passDataTrty.keys = this.passDataTrty.keys.slice();
    this.passDataTrty.total = this.passDataTrty.total.slice();
    this.passDataTrty.widths = this.passDataTrty.widths.slice();
    this.passDataTrty.uneditable = this.passDataTrty.uneditable.slice();
    this.passDataTrty.tHeaderWithColspan[1].span = 7;
    this.passDataTrty.tHeader.splice(0, 0, 'Company');
    this.passDataTrty.dataTypes.splice(0, 0, 'text');
    this.passDataTrty.keys.splice(0, 0, 'cedingAbbr');
    this.passDataTrty.total.splice(0, 0, null);
    this.passDataTrty.widths.splice(0, 0, 1);
    this.passDataTrty.uneditable.splice(0, 0, true);

    this.passDataLrd.nData.currCd = this.jvDetail.currCd;

    this.passDataOth.nData.currRate = this.jvDetail.currRate;
    this.passDataOth.nData.currCd = this.jvDetail.currCd;

  	this.getAcitJVMultiOffset('ipbTab', true);
  	this.currentTab = 'ipbTab';

    if(this.jvDetail.statusType == 'A' || this.jvDetail.statusType == 'X' || this.jvDetail.statusType == 'P') {
      this.passDataIpb.addFlag = false;
      this.passDataIpb.deleteFlag = false;
      this.passDataIpb.checkFlag = false;	
      this.passDataIpb.tHeaderWithColspan = this.passDataIpb.tHeaderWithColspan.slice(1);
	    this.passDataIpb.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];

	    this.passDataClm.addFlag = false;
	    this.passDataClm.deleteFlag = false;
	    this.passDataClm.checkFlag = false;
	    this.passDataClm.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true];

	    this.passDataTrty.addFlag = false;
	    this.passDataTrty.deleteFlag = false;
	    this.passDataTrty.checkFlag = false;
	    this.passDataTrty.tHeaderWithColspan = this.passDataTrty.tHeaderWithColspan.slice(1);
	    this.passDataTrty.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true];

	    this.passDataUnapp.addFlag = false;
	    this.passDataUnapp.deleteFlag = false;
	    this.passDataUnapp.checkFlag = false;
	    this.passDataUnapp.tHeaderWithColspan = this.passDataUnapp.tHeaderWithColspan.slice(1);
	    this.passDataUnapp.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];

	    this.passDataInvPo.addFlag = false;
	    this.passDataInvPo.deleteFlag = false;
	    this.passDataInvPo.checkFlag = false;
      this.passDataInvPo.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true, true,
                                       true,true,true,true,true,true,true];
      this.passDataInvPo.tHeaderWithColspan = this.passDataInvPo.tHeaderWithColspan.slice(1);

	    this.passDataInvPl.addFlag = false;
	    this.passDataInvPl.deleteFlag = false;
	    this.passDataInvPl.checkFlag = false;

      this.passDataLrd.addFlag = false;
      this.passDataLrd.deleteFlag = false;
      this.passDataLrd.checkFlag = false;
      this.passDataLrd.uneditable = [true,true,true,true,true];

	    this.passDataOth.addFlag = false;
	    this.passDataOth.deleteFlag = false;
	    this.passDataOth.checkFlag = false;
      this.passDataOth.uneditable = [true,true,true,true,true,true,true,true];

	    this.readOnly = true;
    }
  }

  ngOnDestroy() {
  	this.subscription.unsubscribe();
  }

  getAcitJVMultiOffset(from?, initial?) {
  	var params = {
  	  tranId: this.jvDetail.tranId,
  	  from: from.split('Tab')[0]
  	}

  	if(from == 'ipbTab') {
  	  this.passDataIpb.tableData = [];
  	  if(initial == undefined) {
  	  	this.ipbTbl.overlayLoader = true;
  	  } else {
  	  	setTimeout(() => {
  	      this.ipbTbl.refreshTable();
  	      this.ipbTbl.overlayLoader = true;
  	    }, 0);
  	  }

  	  this.as.getAcitJVMultiOffset(params).subscribe(data => {
	    this.withExtCed = data['existing'] !== null;
	    if(data['existing'] !== null) {
	      this.multOffDetails.cedingId = data['existing']['cedingId'];
	      this.multOffDetails.cedingName = data['existing']['cedingName'];
	    }
	    this.passDataIpb.tableData = data['ipbList'].map(a => {
	      a.prevPaytAmt = a.cumPayment;
	      return a;
	    });

      this.passDataIpb.disableAdd = false;

	    if(data['ipbList'].length > 0) {
	      this.ipbTbl.onRowClick(null, this.passDataIpb.tableData[0]);
	    }

	    this.ipbTbl.refreshTable();
	  });
  	} else if(from == 'clmTab') {
  	  this.passDataClm.tableData = [];
  	  if(initial == undefined) {
  	  	this.clmTbl.overlayLoader = true;
  	  } else {
  	  	setTimeout(() => {
	      this.clmTbl.refreshTable();
	      this.clmTbl.overlayLoader = true;
	    }, 0);
  	  }

  	  this.as.getAcitJVMultiOffset(params).subscribe(data => {
	    this.withExtCed = data['existing'] !== null;
	    if(data['existing'] !== null) {
	      this.multOffDetails.cedingId = data['existing']['cedingId'];
	      this.multOffDetails.cedingName = data['existing']['cedingName'];
	    }
	    this.passDataClm.tableData = data['clmList'];

	    if(data['clmList'].length > 0) {
	      this.passDataClm.disableAdd = false;
	      this.clmTbl.onRowClick(null, this.passDataClm.tableData[0]);
	    }

	    this.clmTbl.refreshTable();
	  });
  	} else if(from == 'trtyTab') {
  	  this.passDataTrty.tableData = [];
  	  if(initial == undefined) {
  	  	this.trtyTbl.overlayLoader = true;
  	  } else {
  	  	setTimeout(() => {
	      this.trtyTbl.refreshTable();
	      this.trtyTbl.overlayLoader = true;
	    }, 0);
  	  }

  	  this.as.getAcitJVMultiOffset(params).subscribe(data => {
  	  	this.withExtCed = data['existing'] !== null;
  	  	if(data['existing'] !== null) {
	      this.multOffDetails.cedingId = data['existing']['cedingId'];
	      this.multOffDetails.cedingName = data['existing']['cedingName'];
	    }
  	  	this.passDataTrty.tableData = data['trtyList'].map(a => {
  	  	  a.quarterEnding = this.dp.transform(this.ns.toDateTimeString(a.quarterEnding), 'MM/dd/yyyy');
  	  	  return a;
  	  	});

  	  	if(data['trtyList'].length > 0) {
  	  	  this.passDataTrty.disableAdd = false;
  	  	  this.trtyTbl.onRowClick(null, this.passDataTrty.tableData[0]);
  	  	}

  	  	this.trtyTbl.refreshTable();
  	  });
  	} else if(from == 'unappTab') {
  	  this.passDataUnapp.tableData = [];
  	  if(initial == undefined) {
  	  	this.unappTbl.overlayLoader = true;
  	  } else {
    	  	setTimeout(() => {
  	      this.unappTbl.refreshTable();
  	      this.unappTbl.overlayLoader = true;
  	    }, 0);
  	  }

  	  this.as.getAcitJVMultiOffset(params).subscribe(data => {
  	  	this.withExtCed = data['existing'] !== null;
  	  	if(data['existing'] !== null) {
	      this.multOffDetails.cedingId = data['existing']['cedingId'];
	      this.multOffDetails.cedingName = data['existing']['cedingName'];
	    }
  	  	this.passDataUnapp.tableData = data['unappList'];

  	  	if(data['unappList'].length > 0) {
  	  	  this.passDataUnapp.disableAdd = false;
  	  	  this.unappTbl.onRowClick(null, this.passDataUnapp.tableData[0]);
  	  	}

  	  	this.unappTbl.refreshTable();
  	  });
  	} else if(from == 'invPoTab') {
  	  this.passDataInvPo.tableData = [];
  	  if(initial == undefined) {
  	  	this.invPoTbl.overlayLoader = true;
  	  } else {
  	  	setTimeout(() => {
  	      this.invPoTbl.refreshTable();
  	      this.invPoTbl.overlayLoader = true;
  	    }, 0);
  	  }

  	  // this.as.getAcitJVMultiOffset(params).subscribe(data => {
  	  // 	this.passDataInvPo.tableData = data['invPoList'];

  	  // 	if(data['invPoList'].length > 0) {
  	  // 	  this.invPoTbl.onRowClick(null, this.passDataInvPo.tableData[0]);
  	  // 	}

  	  // 	this.invPoTbl.refreshTable();
  	  // });

      var sub$ = forkJoin(
                            this.as.getAcitJVMultiOffset(params),
                            this.jvDetail.currCd == 'PHP' ? this.ms.getMtnParameters('N', 'INVT_BANKCHRG_RT_PHP') : this.ms.getMtnParameters('N', 'INVT_BANKCHRG_RT_USD'),
                            this.jvDetail.currCd == 'PHP' ? this.ms.getMtnParameters('N', 'INVT_WHTAX_RT_PHP') : this.ms.getMtnParameters('N', 'INVT_WHTAX_RT_USD')
                         ).pipe(map(([rec, bc, wt]) => { return { rec, bc, wt }; }));

      sub$.subscribe(data => {
        var x = data['rec']['invPoList'];

        x.forEach(a => {
          a.opts = [{
            selector: 'pulloutType',
            prev: ['Full Pull-out', 'Income Only'],
            vals: ['F', 'I']
          }];

          if(a.invtStatus == 'T') {
            a.opts = [{
              selector: 'pulloutType',
              prev: ['Full Pull-out'],
              vals: ['F']
            }];
          }

          if(a.invtStatus == 'O') {
            a.opts = [{
              selector: 'pulloutType',
              prev: ['Income Only'],
              vals: ['I']
            }];
          }
        });

        this.passDataInvPo.tableData = x;

        if(data['rec']['invPoList'].length > 0) {
          this.invPoTbl.onRowClick(null, this.passDataInvPo.tableData[0]);
        }

        this.invPoTbl.refreshTable();

        this.passDataInvPo.bankChargeRt = (data['bc']['parameters'][0]['paramValueN'] / 100).toFixed(10);
        this.passDataInvPo.whtaxRt = (data['wt']['parameters'][0]['paramValueN'] / 100).toFixed(10);
      });
  	} else if(from == 'invPlTab') {
  	  this.passDataInvPl.tableData = [];
  	  if(initial == undefined) {
  	  	this.invPlTbl.overlayLoader = true;
  	  } else {
  	  	setTimeout(() => {
  	      this.invPlTbl.refreshTable();
  	      this.invPlTbl.overlayLoader = true;
  	    }, 0);
  	  }

  	  this.as.getAcitJVMultiOffset(params).subscribe(data => {
  	  	this.passDataInvPl.tableData = data['invPlList'];

  	  	if(data['invPlList'].length > 0) {
  	  	  this.invPlTbl.onRowClick(null, this.passDataInvPl.tableData[0]);
  	  	}

  	  	this.invPlTbl.refreshTable();
  	  });
  	} else if(from == 'lrdTab') {
  	  // this.resetLrd();
  	  // var retParams = {
  	  // 	cedingId: this.multOffDetails.cedingId
  	  // }

  	  // params['cedingId'] = this.multOffDetails.cedingId;

  	  // var sub$ = forkJoin(this.as.getAcitJVMultiOffset(params),
  	  // 					          this.as.getAcitJVCedRepLoss(retParams)).pipe(map(([rec, ret]) => { return { rec, ret }; }));

  	  // this.lrdLoader = true;
  	  // this.as.getAcitJVMultiOffset(params).subscribe(data => {
  	  // 	this.lrdLoader = false;
  	  // 	this.withExtCed = data['existing'] !== null;
  	  // 	if(data['existing'] !== null) {
	    //     this.multOffDetails.cedingId = data['existing']['cedingId'];
	    //     this.multOffDetails.cedingName = data['existing']['cedingName'];
	    //   }
  	  // 	var a = data['lrdList'];

  	  // 	if(data['lrdList'].length > 0) {
  	  // 	  this.multOffDetails.cedingId = a[0].cedingId;
	    //     this.multOffDetails.cedingName = a[0].cedingName;

     //      var b = a.filter(a => a.currCd == this.jvDetail.currCd);
     //      this.infoData.emit(b.length == 0 ? null : b[0]);
	    //   }
	    
	    //   this.setLrd(a); 
  	  // });

      this.passDataLrd.tableData = [];
      if(initial == undefined) {
        this.lrdTbl.overlayLoader = true;
      } else {
          setTimeout(() => {
          this.lrdTbl.refreshTable();
          this.lrdTbl.overlayLoader = true;
        }, 0);
      }

      this.as.getAcitJVMultiOffset(params).subscribe(data => {
        this.passDataLrd.tableData = data['lrdList'].map(a => {
          a.offsetPayt = a.lossresdepAmt;
          a.netLossresdep = +(parseFloat(a.totalLossresdep) + parseFloat(a.lossresdepAmt)).toFixed(2);
          return a;
        });

        if(data['lrdList'].length > 0) {
          this.lrdTbl.onRowClick(null, this.passDataLrd.tableData[0]);
        }

        this.lrdTbl.refreshTable();
      });
  	} else if(from == 'othTab') {
  	  this.passDataOth.tableData = [];
  	  if(initial == undefined) {
  	  	this.othTbl.overlayLoader = true;
  	  } else {
    	  	setTimeout(() => {
  	      this.othTbl.refreshTable();
  	      this.othTbl.overlayLoader = true;
  	    }, 0);
  	  }

  	  this.as.getAcitJVMultiOffset(params).subscribe(data => {
  	  	this.passDataOth.tableData = data['othList'];

  	  	if(data['othList'].length > 0) {
  	  	  this.passDataOth.disableAdd = false;
  	  	  this.othTbl.onRowClick(null, this.passDataOth.tableData[0]);
  	  	}

  	  	this.othTbl.refreshTable();
  	  });
  	}
  	
  }

  onTabChange(ev: NgbTabChangeEvent) {
  	if((ev.activeId == 'ipbTab' && this.ipbTbl.form.first.dirty)
		|| (ev.activeId == 'clmTab' && this.clmTbl.form.first.dirty)
		|| (ev.activeId == 'trtyTab' && this.trtyTbl.form.first.dirty)
		|| (ev.activeId == 'unappTab' && this.unappTbl.form.first.dirty)
		|| (ev.activeId == 'invPoTab' && this.invPoTbl.form.first.dirty)
		|| (ev.activeId == 'invPlTab' && this.invPlTbl.form.first.dirty)
		// || (ev.activeId == 'lrdTab' && this.form.dirty)
    || (ev.activeId == 'lrdTab' && this.lrdTbl.form.first.dirty)
		|| (ev.activeId == 'othTab' && this.othTbl.form.first.dirty)) {
  	  ev.preventDefault();

  	  const subject = new Subject<boolean>();
  	  const modal = this.ngb.open(ConfirmLeaveComponent,{
  	  	centered: true, 
  	    backdrop: 'static', 
  	    windowClass : 'modal-size'
  	  });
  	  modal.componentInstance.subject = subject;

  	  subject.subscribe(a=>{
  	    if(a) {
  	      switch(ev.activeId) {
  	      	case 'ipbTab':
  	      	  this.ipbTbl.markAsPristine();
  	      	break;

  	      	case 'clmTab':
  	      	  this.clmTbl.markAsPristine();
  	      	break;

  	      	case 'trtyTab':
  	      	  this.trtyTbl.markAsPristine();
  	      	break;

  	      	case 'unappTab':
  	      	  this.unappTbl.markAsPristine();
  	      	break;

  	      	case 'invPoTab':
  	      	  this.invPoTbl.markAsPristine();
  	      	break;

  	      	case 'invPlTab':
  	      	  this.invPlTbl.markAsPristine();
  	      	break;

  	      	case 'lrdTab':
  	      	  // this.form.control.markAsPristine();
              this.lrdTbl.markAsPristine();
  	      	break;

  	      	case 'othTab':
  	      	  this.othTbl.markAsPristine();
  	      	break;
  	      }
  	      
  	      this.currentTab = ev.nextId;
  	      this.tabset.select(ev.nextId);
  	    }
  	  });
  	} else {
  	  this.currentTab = ev.nextId;
  	  this.getAcitJVMultiOffset(ev.nextId, true);
  	}
  }

  showLov(ev?, from?) {
  	if(from == 'ipb') {
  	  this.passLov.selector = 'multOffSoa2';
  	  this.passLov.cedingId = this.multOffDetails.cedingId;
	    this.passLov.currCd = this.jvDetail.currCd;
      this.passLov.hide = this.passDataIpb.tableData.filter((a)=>{return a.soaNo !== null && !a.deleted}).map(a=>{return a.soaNo.toString()});
      this.passLov.from = 'jv';
  	} else if(from == 'clm') {
  	  this.passLov.selector = 'multOffClm';
  	  this.passLov.cedingId = this.multOffDetails.cedingId;
  	  this.passLov.currCd = this.jvDetail.currCd;
  	  this.passLov.params = {
  	    qsoaId: '',
  	    currCd: this.jvDetail.currCd,
  	    cedingId: this.multOffDetails.cedingId
  	  }
  	  this.passLov.hide = this.passDataClm.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return JSON.stringify({claimId: a.claimId, histNo:a.histNo})}); 
  	}else if(from == 'trty') {
  	  this.passLov.selector = 'multOffTrty';
  	  this.passLov.params = {
  	    qsoaId: '',
  	    currCd: this.jvDetail.currCd,
  	    cedingId: this.multOffDetails.cedingId
  	  }
  	  this.passLov.hide = this.passDataTrty.tableData.filter(a => !a.deleted).map(a => a.qsoaId);
  	} else if(from == 'unapp') {
  	  this.passLov.selector = 'multOffUnapp';
  	  this.passLov.cedingId = this.multOffDetails.cedingId;
  	  this.passLov.params = {
  	    unappliedId: '',
  	    cedingId: this.multOffDetails.cedingId,
  	    currCd: this.jvDetail.currCd
  	  }
	     this.passLov.hide = this.passDataUnapp.tableData.filter((a)=>{return a.unappliedId !== null && !a.deleted}).map(a=>{return a.unappliedId});
  	} else if(from == 'invPo') {
  	  this.passLov.selector = 'acitArInvPullout';
  	  this.passLov.searchParams = [{key:'invtStatus', search: 'M,R,T,O'},
  	  							   {key:'currCd', search: this.jvDetail.currCd}];
      this.passLov.hide = this.passDataInvPo.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtCode});
  	} else if(from == 'invPl') {
  	  this.passLov.selector = 'acitArInvPullout';
  	  this.passLov.searchParams = [{key:'invtStatus', search: 'F'},
  	  							   {key:'currCd', search: this.jvDetail.currCd}];
      this.passLov.hide = this.passDataInvPl.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtCode});
  	} else if(from == 'lrd') {
      this.passLov.selector = 'multOffLrd';
      this.passLov.cedingId = '';
      this.passLov.params = {
        unappliedId: '',
        cedingId: '',
        currCd: this.jvDetail.currCd
      }
      this.passLov.hide = this.passDataLrd.tableData.filter((a)=>{return a.cedingId !== '' && !a.deleted}).map(a=>{return a.cedingId});
    } else if(from == 'oth') {
      this.passLov.selector = 'multOffOth';
      this.passLov.cedingId = this.multOffDetails.cedingId;
      this.passLov.params = {
        unappliedId: '',
        cedingId: this.multOffDetails.cedingId,
        currCd: this.jvDetail.currCd
      }
    }

    
	  this.lov.openLOV();
  }

  setLov(ev) {
    console.log(ev);
  	if(ev.selector == 'multOffSoa2') {
  	  this.passDataIpb.tableData = this.passDataIpb.tableData.filter(a => a.showMG != 1);
  	  for (var i = 0; i < ev.data.length; i++) {
  	    this.passDataIpb.tableData.push(JSON.parse(JSON.stringify(this.passDataIpb.nData)));
  	    var len = this.passDataIpb.tableData.length - 1;
  	    var a = ev.data[i];

  	    this.passDataIpb.tableData[len].tranId          = this.jvDetail.tranId;
  	    this.passDataIpb.tableData[len].showMG          = 0;
  	    this.passDataIpb.tableData[len].edited          = true;
  	    this.passDataIpb.tableData[len].policyId        = a.policyId;
  	    this.passDataIpb.tableData[len].soaNo           = a.soaNo;
  	    this.passDataIpb.tableData[len].policyNo        = a.policyNo;
  	    this.passDataIpb.tableData[len].coRefNo         = a.coRefNo;
  	    this.passDataIpb.tableData[len].instNo          = a.instNo;
  	    this.passDataIpb.tableData[len].effDate         = a.effDate;
  	    this.passDataIpb.tableData[len].dueDate         = a.dueDate;
  	    this.passDataIpb.tableData[len].currCd          = a.currCd;
  	    this.passDataIpb.tableData[len].currRate        = a.currRate;
  	    this.passDataIpb.tableData[len].prevPremAmt     = a.prevPremAmt;
  	    this.passDataIpb.tableData[len].prevRiComm      = a.prevRiComm;
  	    this.passDataIpb.tableData[len].prevRiCommVat 	= a.prevRiCommVat;
  	    this.passDataIpb.tableData[len].prevCharges     = a.prevCharges;
  	    this.passDataIpb.tableData[len].prevNetDue      = a.prevNetDue;
  	    this.passDataIpb.tableData[len].netDue          = a.netDue;
  	    this.passDataIpb.tableData[len].prevPaytAmt     = a.totalPayments;
  	    this.passDataIpb.tableData[len].cumPayment      = a.cumPayment;
  	    this.passDataIpb.tableData[len].balance         = a.prevBalance;
  	    this.passDataIpb.tableData[len].paytAmt         = a.prevBalance;
  	    this.passDataIpb.tableData[len].localAmt        = a.prevBalance * this.jvDetail.currRate;
  	    this.passDataIpb.tableData[len].premAmt         = a.balPremDue;
  	    this.passDataIpb.tableData[len].riComm          = a.balRiComm;
  	    this.passDataIpb.tableData[len].riCommVat       = a.balRiCommVat;
  	    this.passDataIpb.tableData[len].charges         = a.balChargesDue;
  	    this.passDataIpb.tableData[len].totalPayt       = a.cumPayment + a.prevBalance;
  	    this.passDataIpb.tableData[len].remainingBal    = a.prevNetDue - (a.cumPayment + a.prevBalance);
  	    this.passDataIpb.tableData[len].insuredDesc     = a.insuredDesc;
  	    this.passDataIpb.tableData[len].overdueInt      = a.balOverdueInt;
        this.passDataIpb.tableData[len].cedingId        = a.cedingId;
        this.passDataIpb.tableData[len].cedingAbbr      = a.cedingAbbr;
  	  }

	    this.ipbTbl.refreshTable();
  	} else if(ev.selector == 'multOffClm') {
  	  this.passDataClm.tableData = this.passDataClm.tableData.filter(a => a.showMG != 1);
  	  for(var  i = 0; i < ev.data.length; i++){
  	    this.passDataClm.tableData.push(JSON.parse(JSON.stringify(this.passDataClm.nData)));
  	    var len = this.passDataClm.tableData.length - 1;
  	    var a = ev.data[i];

  	    this.passDataClm.tableData[len].showMG 				= 0;
  	    this.passDataClm.tableData[len].edited  			= true;
  	    this.passDataClm.tableData[len].itemNo 				= null;
  	    this.passDataClm.tableData[len].claimId 			= a.claimId;
  	    this.passDataClm.tableData[len].projId 				= a.projId;
  	    this.passDataClm.tableData[len].histNo 				= a.histNo;
  	    this.passDataClm.tableData[len].policyId 			= a.policyId;
  	    this.passDataClm.tableData[len].currCd 				= this.jvDetail.currCd;
  	    this.passDataClm.tableData[len].currRate 			= this.jvDetail.currRate;
  	    this.passDataClm.tableData[len].claimNo 			= a.claimNo;
  	    this.passDataClm.tableData[len].histCategoryDesc 	= a.histCategoryDesc;
  	    this.passDataClm.tableData[len].histCategory 		= a.histCategory;
  	    this.passDataClm.tableData[len].histType 			= a.histType;
  	    this.passDataClm.tableData[len].histTypeDesc		= a.histTypeDesc;
  	    this.passDataClm.tableData[len].insuredDesc 		= a.insuredDesc;
  	    this.passDataClm.tableData[len].reserveAmt 			= a.reserveAmt;
  	    this.passDataClm.tableData[len].paytAmt 			= a.cumulativeAmt;
  	    this.passDataClm.tableData[len].clmPaytAmt 			= a.reserveAmt;
  	    this.passDataClm.tableData[len].localAmt 			= a.reserveAmt * this.jvDetail.currRate;
        this.passDataClm.tableData[len].cedingId      = a.cedingId;
        this.passDataClm.tableData[len].cedingAbbr      = a.cedingAbbr;
        this.passDataClm.tableData[len].exGratia      = a.exGratia == null ? 'N' : a.exGratia;
  	  }

  	  this.clmTbl.refreshTable();
  	} else if(ev.selector == 'multOffTrty') {
  	  ev['data'].forEach(a => {
        if(this.passDataTrty.tableData.some(b => b.qsoaId != a.qsoaId)) {
    	  a.currCd = this.jvDetail.currCd;
    	  a.currRate = this.jvDetail.currRate;
    	  a.prevPaytAmt = a.cumPayt;
    	  a.prevBalance = a.remainingBal;
    	  a.balanceAmt = a.remainingBal;
    	  a.newPaytAmt = +(parseFloat(a.cumPayt) + parseFloat(a.balanceAmt)).toFixed(2);
    	  a.newBalance = 0;
    	  a.quarterEnding = this.dp.transform(a.quarterEnding, 'MM/dd/yyyy');
    	  a.edited = true;
    	  a.checked = false;
    	  a.add = true;
    	  a.localAmt = +(parseFloat(a.remainingBal) * parseFloat(this.jvDetail.currRate)).toFixed(2);
    	  this.passDataTrty.tableData.push(a);
    	}
      });
  	  this.passDataTrty.tableData = this.passDataTrty.tableData.filter(a => a.qsoaId != '');

      this.trtyTbl.refreshTable();
  	} else if(ev.selector == 'multOffUnapp') {
  	  this.passDataUnapp.tableData = this.passDataUnapp.tableData.filter(a => a.showMG != 1);
  	  for (var i = 0; i < ev.data.length; i++) {
  	  	this.passDataUnapp.tableData.push(JSON.parse(JSON.stringify(this.passDataUnapp.nData)));
  	  	var len = this.passDataUnapp.tableData.length - 1;
  	  	var a = ev.data[i];
  	    
  	    this.passDataUnapp.tableData[len].showMG         = 0;
  	    this.passDataUnapp.tableData[len].edited         = true;
  	    this.passDataUnapp.tableData[len].refTranId      = a.tranId;
  	    this.passDataUnapp.tableData[len].refBillId      = a.billId;
  	    this.passDataUnapp.tableData[len].refItemNo      = a.itemNo;
  	    this.passDataUnapp.tableData[len].transdtlName   = a.transdtlName;
  	    this.passDataUnapp.tableData[len].transdtlType   = a.transdtlType;
  	    this.passDataUnapp.tableData[len].itemNo         = a.itemNo;
  	    this.passDataUnapp.tableData[len].itemName       = a.itemName;
  	    this.passDataUnapp.tableData[len].refNo          = a.refNo;
  	    this.passDataUnapp.tableData[len].remarks        = a.remarks;
  	    this.passDataUnapp.tableData[len].currCd         = a.currCd;
  	    this.passDataUnapp.tableData[len].currRate       = a.currRate;
  	    this.passDataUnapp.tableData[len].prevPaytAmt    = a.totalApldAmt;
  	    this.passDataUnapp.tableData[len].prevBalance    = a.balUnapldAmt;
  	    this.passDataUnapp.tableData[len].unappliedAmt   = a.totalUnapldAmt;
  	    this.passDataUnapp.tableData[len].actualBalPaid  = a.balUnapldAmt;
  	    this.passDataUnapp.tableData[len].localAmt       = a.localAmt;
  	    this.passDataUnapp.tableData[len].newPaytAmt     = +(parseFloat(a.balUnapldAmt) + parseFloat(a.totalApldAmt)).toFixed(2);
  	    this.passDataUnapp.tableData[len].newBalance     = 0;
  	    this.passDataUnapp.tableData[len].unappliedId    = a.unappliedId;
        this.passDataUnapp.tableData[len].cedingId       = a.cedingId;
        this.passDataUnapp.tableData[len].cedingAbbr     = a.cedingAbbr;
  	  }

  	  this.unappTbl.refreshTable();
  	} else if(ev.selector == 'multOffLrd') {
      this.passDataLrd.tableData = this.passDataLrd.tableData.filter(a => a.showMG != 1);
      for (var i = 0; i < ev.data.length; i++) {
        this.passDataLrd.tableData.push(JSON.parse(JSON.stringify(this.passDataLrd.nData)));
        var len = this.passDataLrd.tableData.length - 1;
        var a = ev.data[i];
        
        this.passDataLrd.tableData[len].showMG          = 0;
        this.passDataLrd.tableData[len].edited          = true;        
        this.passDataLrd.tableData[len].cedingId        = a.cedingId;
        this.passDataLrd.tableData[len].cedingAbbr      = a.cedingAbbr;
        this.passDataLrd.tableData[len].currCd          = a.currCd;
        this.passDataLrd.tableData[len].currRate        = a.currRate;
        this.passDataLrd.tableData[len].totalLossresdep = a.totalLossresdep;
        this.passDataLrd.tableData[len].offsetPayt      = 0;
        this.passDataLrd.tableData[len].netLossresdep   = a.totalLossresdep;
      }

      this.lrdTbl.refreshTable();
    } else if(this.currentTab == 'othTab') {
      this.passDataOth.tableData = this.passDataOth.tableData.filter(a => a.showMG != 1);
      for (var i = 0; i < ev.data.length; i++) {
        this.passDataOth.tableData.push(JSON.parse(JSON.stringify(this.passDataOth.nData)));
        var len = this.passDataOth.tableData.length - 1;
        var a = ev.data[i];
        
        this.passDataOth.tableData[len].showMG          = 0;
        this.passDataOth.tableData[len].edited          = true;        
        this.passDataOth.tableData[len].cedingId        = a.cedingId;
        this.passDataOth.tableData[len].cedingAbbr      = a.cedingAbbr;
      }

      this.othTbl.refreshTable();
    } else if(ev.selector == 'acitArInvPullout') {
  	  if(this.currentTab == 'invPoTab') {
  	  	this.passDataInvPo.tableData = this.passDataInvPo.tableData.filter(a => a.showMG != 1);
  	  	for(var i = 0; i < ev.data.length; i++) {
  	  	  this.passDataInvPo.tableData.push(JSON.parse(JSON.stringify(this.passDataInvPo.nData)));
  	  	  var len = this.passDataInvPo.tableData.length - 1;
  	  	  var a = ev.data[i];

  	  	  this.passDataInvPo.tableData[len].tranId 			= this.jvDetail.tranId; 
  	  	  this.passDataInvPo.tableData[len].invtId 			= a.invtId; 
  	  	  this.passDataInvPo.tableData[len].invtCode 		= a.invtCd; 
  	  	  this.passDataInvPo.tableData[len].certNo 			= a.certNo;
  	  	  this.passDataInvPo.tableData[len].invtType 		= a.invtType;
  	  	  this.passDataInvPo.tableData[len].invtTypeDesc 	= a.invtTypeDesc;
  	  	  this.passDataInvPo.tableData[len].invtSecCd 		= a.invtSecCd;
  	  	  this.passDataInvPo.tableData[len].securityDesc 	= a.securityDesc;
  	  	  this.passDataInvPo.tableData[len].maturityPeriod 	= a.matPeriod;
  	  	  this.passDataInvPo.tableData[len].durationUnit 	= a.durUnit;
  	  	  this.passDataInvPo.tableData[len].purchasedDate 	= a.purDate;
  	  	  this.passDataInvPo.tableData[len].maturityDate 	= a.matDate;
  	  	  this.passDataInvPo.tableData[len].currCd 			= a.currCd;
  	  	  this.passDataInvPo.tableData[len].currRate 		= a.currRate;
  	  	  this.passDataInvPo.tableData[len].interestRate 	= a.intRt;
  	  	  this.passDataInvPo.tableData[len].invtAmt 		= a.invtAmt;
  	  	  this.passDataInvPo.tableData[len].incomeAmt 		= a.incomeAmt;
  	  	  this.passDataInvPo.tableData[len].bankCharge 		= a.bankCharge;
  	  	  this.passDataInvPo.tableData[len].whtaxAmt 		= a.whtaxAmt;
  	  	  this.passDataInvPo.tableData[len].maturityValue 	= a.matVal;
  	  	  this.passDataInvPo.tableData[len].localAmt 		= a.matVal * this.jvDetail.currRate;
  	  	  
  	  	  this.passDataInvPo.tableData[len].edited 			= true;
  	  	  this.passDataInvPo.tableData[len].showMG 			= 0;
          this.passDataInvPo.tableData[len].balIncome      = a.balIncome;
          this.passDataInvPo.tableData[len].pullInvtAmt = a.invtAmt;
          this.passDataInvPo.tableData[len].pullIncomeAmt = a.balIncome;
          this.passDataInvPo.tableData[len].pullBankCharge = a.balIncome * this.passDataInvPo.bankChargeRt;
          this.passDataInvPo.tableData[len].pullWhtaxAmt = a.balIncome * this.passDataInvPo.whtaxRt;
          this.passDataInvPo.tableData[len].incomeBalance = 0;

          this.passDataInvPo.tableData[len].opts = [{
            selector: 'pulloutType',
            prev: ['Full Pull-out', 'Income Only'],
            vals: ['F', 'I']
          }];

          this.passDataInvPo.tableData[len].pulloutType = 'F';

          if(a.invtStatus == 'T') {
            this.passDataInvPo.tableData[len].opts = [{
              selector: 'pulloutType',
              prev: ['Full Pull-out'],
              vals: ['F']
            }];
          }

          if(a.invtStatus == 'O') {
            this.passDataInvPo.tableData[len].opts = [{
              selector: 'pulloutType',
              prev: ['Income Only'],
              vals: ['I']
            }];

            this.passDataInvPo.tableData[len].pulloutType = 'I';
          }

          this.passDataInvPo.tableData[len].pullInvtAmt = this.passDataInvPo.tableData[len].pulloutType == 'F' ? a.invtAmt : 0;
          this.passDataInvPo.tableData[len].pullNetValue = (this.passDataInvPo.tableData[len].pullInvtAmt + a.balIncome) - (a.balIncome * this.passDataInvPo.bankChargeRt) - (a.balIncome * this.passDataInvPo.whtaxRt);
  	  	}

  	  	this.invPoTbl.refreshTable();
  	  } else if(this.currentTab == 'invPlTab') {
  	  	this.passDataInvPl.tableData = this.passDataInvPl.tableData.filter(a => a.showMG != 1);
  	  	for(var i = 0; i < ev.data.length; i++){
  	  	  this.passDataInvPl.tableData.push(JSON.parse(JSON.stringify(this.passDataInvPl.nData)));
  	  	  var len = this.passDataInvPl.tableData.length - 1;
  	  	  var a = ev.data[i];

  	  	  this.passDataInvPl.tableData[len].showMG 			= 0;
  	  	  this.passDataInvPl.tableData[len].tranId 			= this.jvDetail.tranId;
  	  	  this.passDataInvPl.tableData[len].itemNo 			= null;
  	  	  this.passDataInvPl.tableData[len].invtId 			= a.invtId;
  	  	  this.passDataInvPl.tableData[len].invtCode 		= a.invtCd;
  	  	  this.passDataInvPl.tableData[len].certNo 			= a.certNo;
  	  	  this.passDataInvPl.tableData[len].invtType 		= a.invtType;
  	  	  this.passDataInvPl.tableData[len].invtTypeDesc 	= a.invtTypeDesc;
  	  	  this.passDataInvPl.tableData[len].invtSecCd 		= a.invtSecCd;
  	  	  this.passDataInvPl.tableData[len].securityDesc 	= a.securityDesc;
  	  	  this.passDataInvPl.tableData[len].maturityPeriod 	= a.matPeriod;
  	  	  this.passDataInvPl.tableData[len].durationUnit 	= a.durUnit;
  	  	  this.passDataInvPl.tableData[len].interestRate 	= a.intRt;
  	  	  this.passDataInvPl.tableData[len].purchasedDate 	= a.purDate;
  	  	  this.passDataInvPl.tableData[len].maturityDate 	= a.matDate;
  	  	  this.passDataInvPl.tableData[len].currCd 			= a.currCd;
  	  	  this.passDataInvPl.tableData[len].currRate 		= a.currRate;
  	  	  this.passDataInvPl.tableData[len].invtAmt 		= a.invtAmt;
  	  	  this.passDataInvPl.tableData[len].localAmt 		= a.invtAmt * this.jvDetail.currRate;
  	  	  this.passDataInvPl.tableData[len].edited 			= true;
  	  	}

  	  	this.invPlTbl.refreshTable();
  	  }
  	  
  	}
  }

  showCedingLov(ev) {
  	if(this.withExtCed) {
  	  ev.preventDefault();
  	  this.dialogIcon = "warning-message";
  	  this.dialogMessage = "Offsetting is allowed only on records of one ceding company";
  	  this.successDialog.open();
  	} else {
  	  this.cedingLov.modal.openNoClose();
  	}
  }

  setCeding(ev) {
  	if(ev !== null) {
  	  this.passDataIpb.disableAdd = false;
  	  this.passDataTrty.disableAdd = false;
  	  this.passDataUnapp.disableAdd = false;
  	  this.passDataClm.disableAdd = false;
  	  this.passDataOth.disableAdd = false;
  	  this.multOffDetails.cedingId = ev.payeeCd;
  	  this.multOffDetails.cedingName = ev.payeeName;
  	  this.emitData.emit(this.multOffDetails);

  	  if(this.currentTab == 'lrdTab') {
  	  	var params = {
  	  		cedingId: this.multOffDetails.cedingId
  	  	};

  	  	this.lrdLoader = true;
  	  	this.as.getAcitJVCedRepLoss(params).subscribe(data => {
  	  	  this.lrdLoader = false;
  	  	  this.setLrd(data['cedRepLossList']);
  	  	});
  	  }
  	}
  }

  onTblDataChange(ev, from) {
  	if(from == 'ipb') {
      this.passDataIpb.tableData.forEach(a => {
      	a.premAmt = (a.paytAmt / a.prevNetDue) * a.prevPremAmt;
        a.riComm = (a.paytAmt / a.prevNetDue) * a.prevRiComm;
        a.riCommVat = (a.paytAmt / a.prevNetDue) * a.prevRiCommVat;
        a.charges = (a.paytAmt / a.prevNetDue) * a.prevCharges;
        a.netDue = a.remainingBal;

        a.totalPayt = (isNaN(a.paytAmt) ? 0 : a.paytAmt) + a.cumPayment;
        a.remainingBal = a.prevNetDue - a.totalPayt;
        a.localAmt = a.paytAmt * this.jvDetail.currRate;
      });

      this.ipbTbl.refreshTable();
  	} else if(from == 'clm') {
  	  this.passDataClm.tableData.forEach(a => {
  	  	a.localAmt = a.clmPaytAmt * this.jvDetail.currRate;
  	  });

  	  this.clmTbl.refreshTable();
  	} else if(from == 'trty') {
  	  this.passDataTrty.tableData.forEach(a => {
  	  	a.localAmt = a.currRate * a.balanceAmt;
        a.newPaytAmt = +(parseFloat(a.prevPaytAmt) + parseFloat(a.balanceAmt)).toFixed(2);
        a.newBalance = +(parseFloat(a.netQsoaAmt) - parseFloat(a.newPaytAmt)).toFixed(2);
  	  });

  	  this.trtyTbl.refreshTable();
  	} else if(from == 'unapp') {
  	  this.passDataUnapp.tableData.forEach(a => {
  	    a.localAmt = a.actualBalPaid * this.jvDetail.currRate;
  	    a.newPaytAmt = a.actualBalPaid + a.prevPaytAmt;
  	    a.newBalance = a.unappliedAmt - a.newPaytAmt;
  	  });

  	  this.unappTbl.refreshTable();
  	} else if(from == 'invPo') {
      var x = ev.lastEditedRow;

      if(ev.key == 'pulloutType') {
        x.pullInvtAmt = x.pulloutType == 'F' ? x.invtAmt : 0;
      }

      if(ev.key == 'pullIncomeAmt' || ev.key == 'pulloutType') {
        x.pullBankCharge = x.pullIncomeAmt * this.passDataInvPo.bankChargeRt;
        x.pullWhtaxAmt = x.pullIncomeAmt * this.passDataInvPo.whtaxRt;
        x.pullNetValue = (x.pullInvtAmt + x.pullIncomeAmt) - x.pullBankCharge - x.pullWhtaxAmt;
        x.incomeBalance = x.balIncome - x.pullIncomeAmt;
      }

      if(ev.key == 'pullBankCharge' || ev.key == 'pullWhtaxAmt') {
        x.pullNetValue = (x.pullInvtAmt + x.pullIncomeAmt) - x.pullBankCharge - x.pullWhtaxAmt;
      }

      this.invPoTbl.refreshTable();
    } else if(from == 'oth') {
    	  this.passDataOth.tableData.forEach(a => {
    	    a.localAmt = a.currAmt * this.jvDetail.currRate;
    	  });

  	  this.othTbl.refreshTable();
  	} else if(from == 'lrd') {
        this.passDataLrd.tableData.forEach(a => {
          a.netLossresdep = a.totalLossresdep + a.offsetPayt;
        });

      this.lrdTbl.refreshTable();
    }
  }

  onRowClick(data){
    this.infoData.emit(data !== null ? data : null);
  }

  onClickSave(from) {
  	var proceed = false;
  	function isNull(x) {
  	  return x == '' || x == null;
  	}

  	if(from == 'ipb') {
  	  for(var i = 0; i < this.passDataIpb.tableData.length; i++) {
  	  	var a = this.passDataIpb.tableData[i];

  	  	if(a.edited && !a.deleted && isNaN(a.paytAmt)) {
  	  	  this.dialogIcon = "error-message";
  	  	  this.dialogMessage = "Invalid Payment Amount";
  	  	  this.successDialog.open();
  	  	  return;
  	  	}

  	  	if(a.showMG !== undefined && a.showMG == 1) {
  	  	  this.dialogIcon = "error-message";
  	  	  this.dialogMessage = "Please check field values.";
  	  	  this.successDialog.open();
  	  	  return;
  	  	}
  	  }

  	  proceed = true;
  	} else if(from == 'clm') {
  	  for(var i = 0; i < this.passDataClm.tableData.length; i++) {
  	  	var a = this.passDataClm.tableData[i];

  	  	if(a.showMG !== undefined && a.showMG == 1) {
  	  	  this.dialogIcon = "error-message";
  	  	  this.dialogMessage = "Please check field values.";
  	  	  this.successDialog.open();
  	  	  return;
  	  	}

  	  	if(a.edited && !a.deleted && isNaN(a.clmPaytAmt)) {
  	  	  this.dialogIcon = "error-message";
  	  	  this.dialogMessage = "Invalid Payment Amount";
  	  	  this.successDialog.open();
  	  	  return;
  	  	}
  	  }

  	  proceed = true;
  	} else if(from == 'trty') {
  	  for(var i = 0; i < this.passDataTrty.tableData.length; i++) {
  	  	var a = this.passDataTrty.tableData[i];

  	  	if(a.edited && !a.deleted && isNaN(a.balanceAmt)) {
  	  	  this.dialogIcon = "error-message";
  	  	  this.dialogMessage = "Invalid Payment Amount";
  	  	  this.successDialog.open();
  	  	  return;
  	  	}

  	  	if(a.showMG !== undefined && a.showMG == 1) {
  	  	  this.dialogIcon = "error-message";
  	  	  this.dialogMessage = "Please check field values.";
  	  	  this.successDialog.open();
  	  	  return;
  	  	}
  	  }

  	  proceed = true;
  	} else if(from == 'unapp') {
  	  for(var i = 0; i < this.passDataUnapp.tableData.length; i++) {
  	  	var a = this.passDataUnapp.tableData[i];

  	  	if(a.edited && !a.deleted && isNaN(a.actualBalPaid)) {
  	  	  this.dialogIcon = "error-message";
  	  	  this.dialogMessage = "Invalid Payment Amount";
  	  	  this.successDialog.open();
  	  	  return;
  	  	}
  	  }

  	  proceed = true;
  	} else if(from == 'invPo') {

      for(var i = 0; i < this.passDataInvPo.tableData.length; i++) {
        var a = this.passDataInvPo.tableData[i];

        if(a.edited && !a.deleted && isNaN(a.pullIncomeAmt)) {
          this.dialogIcon = "error-message";
          this.dialogMessage = "Invalid Income Amount";
          this.successDialog.open();
          return;
        } else if(a.edited && !a.deleted && a.pullIncomeAmt > a.balIncome) {
          this.dialogIcon = "error-message";
          this.dialogMessage = "Income amount must not exceed income balance";
          this.successDialog.open();
          return;
        }
      }

  	  proceed = true;
  	} else if(from =='invPl') {
      proceed = true;
    } else if(from == 'lrd') {
  	  /*var a = this.passDataLrd.php.netLossresdep;
  	  var b = this.passDataLrd.usd.netLossresdep;
  	  var aa = (a.indexOf('(') !== -1 ? -1 : 1) * Number(a.replace(/\(|\)|\,/g, ''));
  	  var bb = (b.indexOf('(') !== -1 ? -1 : 1) * Number(b.replace(/\(|\)|\,/g, ''));

  	  if(aa < 0 || bb < 0) {
  	  	if(aa < 0) {
  	  	  this.dialogMessage = "You cannot allocate more than the current total Loss Reserve Deposit. It should not be more than " + this.passDataLrd.php.totalLossresdep + ".";
  	  	} else if(bb < 0) {
  	  	  this.dialogMessage = "You cannot allocate more than the current total Loss Reserve Deposit. It should not be more than " + this.passDataLrd.usd.totalLossresdep + ".";
  	  	}

  	  	this.dialogIcon = "error-message";
  	  	this.successDialog.open();
  	  	return;
  	  }*/

      for(var i = 0; i < this.passDataLrd.tableData.length; i++) {
        var a = this.passDataLrd.tableData[i];

        if(a.edited && !a.deleted && isNaN(a.offsetPayt)) {
          this.dialogIcon = "error-message";
          this.dialogMessage = "Invalid Payment Amount";
          this.successDialog.open();
          return;
        }

        if(a.showMG !== undefined && a.showMG == 1) {
          this.dialogIcon = "error-message";
          this.dialogMessage = "Please check field values.";
          this.successDialog.open();
          return;
        }

        if(a.offsetPayt < 0 && a.netLossresdep < 0) {
          this.dialogIcon = "error-message";
          this.dialogMessage = "You cannot allocate more than the current total Loss Reserve Deposit.";
          this.successDialog.open();
          return;
        }
      }

  	  proceed = true;
  	} else if(from == 'oth') {
  	  for(var i = 0; i < this.passDataOth.tableData.length; i++) {
  	  	var a = this.passDataOth.tableData[i];

        if(a.edited && !a.deleted && isNull(a.cedingAbbr)) {
          this.dialogIcon = "error-message";
          this.dialogMessage = "Company required";
          this.successDialog.open();
          return;
        } else if(a.edited && !a.deleted && isNull(a.itemName)) {
  	  	  this.dialogIcon = "error-message";
  	  	  this.dialogMessage = "Item required";
  	  	  this.successDialog.open();
  	  	  return;
  	  	} else if(a.edited && !a.deleted && isNaN(a.currAmt)) {
  	  	  this.dialogIcon = "error-message";
  	  	  this.dialogMessage = "Invalid Amount";
  	  	  this.successDialog.open();
  	  	  return;
  	  	}
  	  }

  	  proceed = true;
  	}

  	if(proceed) {
  	  if(this.cancelFlag) {
  	  	this.save(1);
  	  } else {
  	    this.confirmSave.confirmModal();
  	  }
  	}
  }

  save(cancel?) {
  	this.cancelFlag = cancel !== undefined;
  	if(cancel !== undefined && cancel !== 1) {
  	  this.onClickSave(this.currentTab.split('Tab')[0]);
  	  return;
  	}
  	this.prepareParams();

  	this.as.saveJVMultiOffset(this.params).subscribe(data => {
  	  if(data['returnCode'] == 0) {
  	  	this.dialogIcon = "error";
  	  	this.successDialog.open();
  	  } else if(data['returnCode'] == -1) {
  	    this.dialogIcon = "success";
  	    this.dialogMessage = "";
  	    this.successDialog.open();

  	    switch(this.currentTab) {
  	      case 'ipbTab':
  	        this.ipbTbl.markAsPristine();
  	      break;

  	      case 'clmTab':
  	        this.clmTbl.markAsPristine();
  	      break;

  	      case 'trtyTab':
  	    	this.trtyTbl.markAsPristine();
  	      break;

  	      case 'unappTab':
  	    	this.unappTbl.markAsPristine();
  	      break;

  	      case 'invPoTab':
  	    	this.invPoTbl.markAsPristine();
  	      break;

  	      case 'invPlTab':
  	    	this.invPlTbl.markAsPristine();
  	      break;

  	      case 'lrdTab':
  	    	// this.form.control.markAsPristine();
          this.lrdTbl.markAsPristine();
  	      break;

  	      case 'othTab':
  	    	this.othTbl.markAsPristine();
  	      break;
  	    }
  	    
  	    this.getAcitJVMultiOffset(this.currentTab);
  	  }
  	});
  }

  prepareParams() {
  	this.params.tranId = this.jvDetail.tranId;
    this.params.tranType = this.jvDetail.tranType;
    this.params.saveIpb = [];
    this.params.delIpb = [];
    this.params.saveClm = [];
    this.params.delClm = [];
    this.params.saveTrty = [];
    this.params.delTrty = [];
    this.params.saveUnapp = [];
    this.params.delUnapp = [];
    this.params.saveInvPo = [];
    this.params.delInvPo = [];
    this.params.saveInvPl = [];
    this.params.delInvPl = [];
    this.params.saveLrd = [];
    this.params.delLrd = [];
    this.params.saveOth = [];
    this.params.delOth = [];

    if(this.currentTab == 'ipbTab') {
      this.params.saveIpb = this.passDataIpb.tableData.filter(a => a.edited && !a.deleted).map(e => {
	    e.prevBalance = e.balance;
	    e.balPaytAmt = e.paytAmt;
	    e.newPaytAmt = e.totalPayt;
	    e.newBalance = e.remainingBal;
	    // e.cedingId = this.multOffDetails.cedingId;
	   	e.createUser = this.ns.getCurrentUser();
	    e.createDate = this.ns.toDateTimeString(0);
	    e.updateUser = this.ns.getCurrentUser();
	    e.updateDate = this.ns.toDateTimeString(0);

	    if(e.balance >= 0 && e.paytAmt >= 0) {
	      e.paytType = 1;
	    } else if(e.balance >= 0 && e.paytAmt < 0) {
	      e.paytType = 2;
	    } else if(e.balance <= 0 && e.paytAmt <= 0) {
	      e.paytType = 3;
	    } else if(e.balance <= 0 && e.paytAmt > 0) {
	      e.paytType = 4;
	    }

	    return e;
	  });

	  this.params.delIpb = this.passDataIpb.tableData.filter(a => a.deleted);
    } else if(this.currentTab == 'clmTab') {
      this.params.saveClm = this.passDataClm.tableData.filter(a => a.edited && !a.deleted).map(e => {
      	e.tranId = this.jvDetail.tranId;
      	// e.cedingId = this.multOffDetails.cedingId;
      	e.createUser = this.ns.getCurrentUser();
  	    e.createDate = this.ns.toDateTimeString(0);
  	    e.updateUser = this.ns.getCurrentUser();
  	    e.updateDate = this.ns.toDateTimeString(0);

	    return e;
      });

      this.params.delClm = this.passDataClm.tableData.filter(a => a.deleted);
    } else if(this.currentTab == 'trtyTab') {
      this.params.saveTrty = this.passDataTrty.tableData.filter(a => a.edited && !a.deleted).map(e => {
      	e.tranId = this.jvDetail.tranId;
      	e.quarterEnding = this.ns.toDateTimeString(e.quarterEnding);
      	// e.cedingId = this.multOffDetails.cedingId;
      	e.actualBalPaid = e.balanceAmt;
      	e.balanceAmt = e.netQsoaAmt;
      	e.createUser = this.ns.getCurrentUser();
  	    e.createDate = this.ns.toDateTimeString(0);
  	    e.updateUser = this.ns.getCurrentUser();
  	    e.updateDate = this.ns.toDateTimeString(0);

      	return e;
      });

      this.params.delTrty = this.passDataTrty.tableData.filter(a => a.deleted);
    } else if(this.currentTab == 'unappTab') {
      this.params.saveUnapp = this.passDataUnapp.tableData.filter(a => a.edited && !a.deleted).map(e => {
      	e.tranId = this.jvDetail.tranId;
      	// e.cedingId = this.multOffDetails.cedingId;
      	e.createUser = this.ns.getCurrentUser();
  	    e.createDate = this.ns.toDateTimeString(0);
  	    e.updateUser = this.ns.getCurrentUser();
  	    e.updateDate = this.ns.toDateTimeString(0);

      	return e;
      });

      this.params.delUnapp = this.passDataUnapp.tableData.filter(a => a.deleted);
    } else if(this.currentTab == 'invPoTab') {
      this.params.saveInvPo = this.passDataInvPo.tableData.filter(a => a.edited && !a.deleted).map(e => {
      	e.tranId = this.jvDetail.tranId;
      	e.createUser = this.ns.getCurrentUser();
  	    e.createDate = this.ns.toDateTimeString(0);
  	    e.updateUser = this.ns.getCurrentUser();
  	    e.updateDate = this.ns.toDateTimeString(0);

      	return e;
      });

      this.params.delInvPo = this.passDataInvPo.tableData.filter(a => a.deleted);
    } else if(this.currentTab == 'invPlTab') {
      this.params.saveInvPl = this.passDataInvPl.tableData.filter(a => a.edited && !a.deleted).map(e => {
      	e.tranId = this.jvDetail.tranId;
      	e.createUser = this.ns.getCurrentUser();
  	    e.createDate = this.ns.toDateTimeString(0);
  	    e.updateUser = this.ns.getCurrentUser();
  	    e.updateDate = this.ns.toDateTimeString(0);

      	return e;
      });

      this.params.delInvPl = this.passDataInvPl.tableData.filter(a => a.deleted);
    } else if(this.currentTab == 'lrdTab') {
      /*var a = this.passDataLrd.php;
      var b = this.passDataLrd.usd;
      var ap = a.offsetPayt.replace(/\(|\)|\,/g, '');
  	  var bp = b.offsetPayt.replace(/\(|\)|\,/g, '');
  	  var php = {
  	  	tranId: this.jvDetail.tranId,
  	  	cedingId: this.multOffDetails.cedingId,
  	  	currCd: 'PHP',
  	  	currRate: a.currRate,
  	  	lossresdepAmt: ap,
  	  	localAmt: ap * a.currRate,
  	  	createUser: this.ns.getCurrentUser(),
    		createDate: this.ns.toDateTimeString(0),
    		updateUser: this.ns.getCurrentUser(),
    		updateDate: this.ns.toDateTimeString(0),
  	  };
  	  var usd = {
  	  	tranId: this.jvDetail.tranId,
  	  	cedingId: this.multOffDetails.cedingId,
  	  	currCd: 'USD',
  	  	currRate: b.currRate,
  	  	lossresdepAmt: bp,
  	  	localAmt: bp * b.currRate,
  	  	createUser: this.ns.getCurrentUser(),
    		createDate: this.ns.toDateTimeString(0),
    		updateUser: this.ns.getCurrentUser(),
    		updateDate: this.ns.toDateTimeString(0),
  	  };

      if(Number(ap) !== 0 && !isNaN(ap) && this.form.control.controls['php-offset-payt'].dirty) {
      	this.params.saveLrd.push(php);
      }

      if(Number(bp) !== 0 && !isNaN(bp) && this.form.control.controls['usd-offset-payt'].dirty) {
      	this.params.saveLrd.push(usd);
      }

      if(Number(ap) == 0 && !isNaN(ap) && this.form.control.controls['php-offset-payt'].dirty) {
      	this.params.delLrd.push(php);
      }

      if(Number(bp) == 0 && !isNaN(bp) && this.form.control.controls['usd-offset-payt'].dirty) {
      	this.params.delLrd.push(usd);
      }*/

      this.params.saveLrd = this.passDataLrd.tableData.filter(a => a.edited && !a.deleted).map(e => {
        e.tranId = this.jvDetail.tranId;
        // e.cedingId = this.multOffDetails.cedingId;
        e.lossresdepAmt = e.offsetPayt;
        e.localAmt = e.offsetPayt * e.currRate;
        e.createUser = this.ns.getCurrentUser();
        e.createDate = this.ns.toDateTimeString(0);
        e.updateUser = this.ns.getCurrentUser();
        e.updateDate = this.ns.toDateTimeString(0);

      return e;
      });

      this.params.delLrd = this.passDataLrd.tableData.filter(a => a.deleted);
    } else if(this.currentTab == 'othTab') {
      this.params.saveOth = this.passDataOth.tableData.filter(a => a.edited && !a.deleted).map(e => {
      	e.tranId = this.jvDetail.tranId;
      	// e.cedingId = this.multOffDetails.cedingId;
      	e.createUser = this.ns.getCurrentUser();
	      e.createDate = this.ns.toDateTimeString(0);
	      e.updateUser = this.ns.getCurrentUser();
	      e.updateDate = this.ns.toDateTimeString(0);

      	return e;
      });

      this.params.delOth = this.passDataOth.tableData.filter(a => a.deleted);
    }
  }

  updateLrd(ev, from) {
  	function clean(x) {
  	  return x.replace(/\(|\)|\,/g, '');
  	}
  	var x = clean(ev.target.value);
  	var a;

  	if(from == 'php') {
  	  a = this.passDataLrd.php;
  	} else if(from == 'usd') {
  	  a = this.passDataLrd.usd;
  	}

  	if(isNaN(Number(clean(x)))) {
  	  ev.target.value = '';
  	  a.netLossresdep = this.np.transform(this.dcp.transform(clean(a.totalLossresdep), '1.2-2'));
  	} else {
  	  a.totalLossresdep = clean(a.totalLossresdep);
  	  a.netLossresdep = this.np.transform(this.dcp.transform(+(parseFloat(a.totalLossresdep) + parseFloat(x)).toFixed(2), '1.2-2'))
  	  a.offsetPayt = this.dcp.transform(x, '1.2-2');
  	  a.totalLossresdep = this.np.transform(this.dcp.transform(a.totalLossresdep, '1.2-2'));
  	}
  }

  setLrd(data) {
  	const _this = this;
  	function tf(x) {
  	  if(x == null || x == '') {
	    return _this.np.transform(_this.dcp.transform(0, '1.2-2'))  	  	  	  
  	  } else {
  	    return _this.np.transform(_this.dcp.transform(x, '1.2-2'))
  	  }
  	}

  	function isNull(x) {
  	  return x == undefined || x == null;
  	}

  	if(data.length > 0) {
  	  var a = data[0];
  	  var proceed = true;

  	  this.passDataLrd.address = a.address;
  	  this.passDataLrd.membershipDate = this.ns.toDateTimeString(a.membershipDate).split('T')[0];
  	  this.passDataLrd.bussTypeCd = a.bussTypeCd;
  	  this.passDataLrd.bussTypeName = a.bussTypeName;
  	  this.passDataLrd.tin = a.tin;
  	  this.passDataLrd.activetag = a.activetag;
  	  this.passDataLrd.cedingRep = a.cedingRep;
	    this.passDataLrd.contactNo = a.contactNo;
	    this.passDataLrd.emailAdd = a.emailAdd;

	  var currArr = data.filter(x => x.currCd !== null).map(x => x.currCd);

	  if(currArr.length == 0) {
	  	this.passDataLrd.php.currRate = 1; 
	  	this.passDataLrd.php.totalLossresdep = tf(0);
	  	this.passDataLrd.php.localAmt = 0;
	  	this.passDataLrd.php.offsetPayt = this.dcp.transform(0, '1.2-2');
	  	this.passDataLrd.php.netLossresdep = tf(0);

	  	this.passDataLrd.usd.currRate = 1; 
	  	this.passDataLrd.usd.totalLossresdep = tf(0);
	  	this.passDataLrd.usd.localAmt = 0;
	  	this.passDataLrd.usd.offsetPayt = this.dcp.transform(0, '1.2-2');
	  	this.passDataLrd.usd.netLossresdep = tf(0);

	  	proceed = false;
	  } else if(currArr.length == 1) {
	  	if(currArr[0] == 'PHP') {
	  	  this.passDataLrd.usd.currRate = 1; 
	  	  this.passDataLrd.usd.totalLossresdep = tf(0);
	  	  this.passDataLrd.usd.localAmt = 0;
	  	  this.passDataLrd.usd.offsetPayt = this.dcp.transform(0, '1.2-2');
	  	  this.passDataLrd.usd.netLossresdep = tf(0);
	  	} else if(currArr[0] == 'USD') {
	  	  this.passDataLrd.php.currRate = 1; 
	  	  this.passDataLrd.php.totalLossresdep = tf(0);
	  	  this.passDataLrd.php.localAmt = 0;
	  	  this.passDataLrd.php.offsetPayt = this.dcp.transform(0, '1.2-2');
	  	  this.passDataLrd.php.netLossresdep = tf(0);
	  	}

	  	proceed = true;
	  }

	  if(proceed) {
  	    data.forEach(a => {
  	  	  var x;

  	  	  if(a.currCd == 'PHP') {
  	  	    x = this.passDataLrd.php; 
  	  	  } else if(a.currCd == 'USD') {
  	  	    x = this.passDataLrd.usd;
  	  	  }

  	  	  x.currRate = a.currRate;
  	      x.totalLossresdep = tf(a.totalLossresdep);
  	      x.localAmt = a.localAmt;
  	      x.netLossresdep = tf(+(parseFloat(isNull(a.lossresdepAmt) ? 0 : a.lossresdepAmt) + parseFloat(isNull(a.totalLossresdep) ? 0 : a.totalLossresdep)).toFixed(2));
  	      x.offsetPayt = this.dcp.transform(isNull(a.lossresdepAmt) ? 0 : a.lossresdepAmt, '1.2-2');
  	    });
  	  }
  	}
  }

  resetLrd() {
  	this.passDataLrd = {
  	  address: '',
  	  membershipDate: '',
  	  bussTypeCd: '',
  	  bussTypeName: '',
  	  tin: '',
  	  activetag: '',
  	  cedingRep: '',
	    contactNo: '',
	    emailAdd: '',
	    php: {
	      currCd: 'PHP',
	      currRate: '',
	      totalLossresdep: '',
	      localAmt: '',
	      offsetPayt: 0,
	      netLossresdep: 0
	    },
	    usd: {
	      currCd: 'USD',
	      currRate: '',
	      totalLossresdep: '',
	      localAmt: '',
	      offsetPayt: 0,
	      netLossresdep: 0
	    }
    }
  }

  onClickExport() {
    var name = 'InwardPolicyBalances_PolicyList_' + this.jvDetail.jvYear + '-' + this.jvDetail.jvNo;
    var query = 'SELECT policyNo AS [Policy No], ' +
                       'CASE WHEN coRefNo IS NULL THEN \'\' ELSE coRefNo END AS [Co. Ref. No.], ' +
                       'instNo AS [Inst No.], ' +
                       'datetime(dueDate) AS [Due Date], ' +
                       'insuredDesc AS [Insured], ' +
                       'currency(prevPremAmt) AS [Premium], ' +
                       'currency(prevRiComm) AS [RI Comm], ' +
                       'currency(prevRiCommVat) AS [RI Comm Vat], ' +
                       'currency(prevCharges) AS [Charges], ' +
                       'currency(prevNetDue) AS [Net Due], ' +
                       'currency(cumPayment) AS [Cumulative Payments], ' +
                       'currency(balance) AS [Balance], ' +
                       'currency(paytAmt) AS [Payment Amount], ' +
                       'currency(premAmt) AS [Premium (Payment)], ' +
                       'currency(riComm) AS [RI Comm (Payment)], ' +
                       'currency(riCommVat) AS [RI Comm Vat (Payment)], ' +
                       'currency(charges) AS [Charges (Payment)], ' +
                       'currency(totalPayt) AS [Total Payments], ' +
                       'currency(remainingBal) AS [Remaining Balance], ' +
                       'currCd AS [Curr], ' +
                       'currRate AS [Curr Rate]';

    var x = this.passDataIpb.tableData.map(a => Object.create(a));
    this.ns.export(name, query, x);
  }

}
