import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AgainstNegativeTreaty, AgainstLoss } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { DatePipe } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-jv-treaty-pull-out',
  templateUrl: './jv-treaty-pull-out.component.html',
  styleUrls: ['./jv-treaty-pull-out.component.css'],
  providers: [DatePipe]
})
export class JvTreatyPullOutComponent implements OnInit {
  
  @Output() emitData = new EventEmitter<any>();
  @Output() infoData = new EventEmitter<any>();
  @Input() cedingParams:any;
  @Input() jvDetail:any;
  @ViewChild('quarterTable') quarterTable: CustEditableNonDatatableComponent;
  @ViewChild('invTable') invTable: CustEditableNonDatatableComponent;
  @ViewChild(QuarterEndingLovComponent) quarterModal: QuarterEndingLovComponent; 
  @ViewChild('lov') lovMdl: LovComponent;
  @ViewChild('osQsoaLov') osQsoaLov: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  /*passData: any = {
      tableData: [],
      tHeader: ['Quarter Ending', 'Currency', 'Currency Rate', 'Amount', 'Amount(PHP)'],
      dataTypes: ['date', 'text', 'percent', 'currency', 'currency'],
      nData: {
        showMG:1,
        tranId:'',
        quarterNo : '',
        cedingId : '',
        quarterEnding : '',
        currCd : '',
        currRate : '',
        balanceAmt : '',
        localAmt : '',
        createUser : this.ns.getCurrentUser(),
        createDate : '',
        updateUser : this.ns.getCurrentUser(),
        updateDate : '',
        trtyInvmt: []
      },
      magnifyingGlass: ['quarterEnding'],
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      disableAdd: true,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 3,
      pageID: 'passDataNegative',
      uneditable: [true,true,true,false,true],
      total: [null, null, 'Total', 'balanceAmt', 'localAmt'],
      keys: ['quarterEnding', 'currCd', 'currRate', 'balanceAmt', 'localAmt'],
      widths: [203,50,130,130,130],
  };*/

  passData: any = {};

  /*invesmentData: any = {
    tableData:[],
    tHeader:['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value'],
    dataTypes:['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','maturityValue'],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true,
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
      pulloutType : '',
      currCd : '',
      currRate : '',
      invtAmt : '',
      incomeAmt : '',
      bankCharge : '',
      whtaxAmt : '',
      maturityValue : '',
      localAmt : '',
      createUser : this.ns.getCurrentUser(),
      createDate : '',
      updateUser : this.ns.getCurrentUser(),
      updateDate : '',
      showMG: 1
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 
           'invtAmt' , 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue'],
    uneditable: [false, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true ],
    checkFlag: true,
    pageID: 6,
    widths:[140, 150, 127, 130, 90, 83, 85, 1, 1, 1, 85, 120, 120, 120, 120, 120, 120]
  };*/

  invesmentData: any = {
    tableData: [],
    tHeaderWithColspan: [{header:'', span: 1},{header:'Maintenance Information', span: 17},{header: 'Pull-out Details', span: 7}],
    tHeader: ['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value' ,'Remaining||Income',
              'Pull-out Type','Investment','Investment Income','Bank Charge','Withholding Tax','Net Value','Income Balance'],
    dataTypes: ['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency' ,'currency',
                'select','currency','currency','currency','currency','currency','currency'],
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
      incomeBalance: '',
      createUser: this.ns.getCurrentUser(),
      updateUser: this.ns.getCurrentUser(),
      createDate: '',
      updateDate: ''
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 
           'invtAmt' , 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue','balIncome',
           'pulloutType','pullInvtAmt','pullIncomeAmt','pullBankCharge','pullWhtaxAmt','pullNetValue','incomeBalance'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true, true,
                 false,true,false,false,false,true,true],
    checkFlag: true,
    pageID: 'multOffInvtout',
    widths: [120,150,127,130,1,83,85,1,1,1,85,120,120,120,120,120,120],
    disableAdd: true,
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

  jvDetails: any = {
    cedingName: '',
    delaccTrty: [],
    deleteaccTrty: [],
    saveaccTrty:[],
    saveTrtyInvt: []
  }

  passLov: any = {
    selector: 'acitArInvPullout',
    cedingId: '',
    hide: []
  }

  passLov2 : any = {
    selector   : 'osQsoa',
    payeeNo    : '',
    hide       : []
  };

  readOnly: boolean = false;
  dialogIcon : any;
  dialogMessage : any;
  quarterNo: any = '';
  cancelFlag: boolean = false;
  cedingFlag: boolean = false;

  constructor(private ns: NotesService, private accountingService: AccountingService, private dp: DatePipe, private ms: MaintenanceService) { }

  ngOnInit() {
    this.passData = this.accountingService.getTreatyKeys('JV');
    this.passData.nData.currRate = this.jvDetail.currRate;
    this.passData.nData.currCd = this.jvDetail.currCd;
    this.passData.pageLength = 3;
    this.passData.disableAdd = true;
    this.invesmentData.disableAdd = true;
    if(this.jvDetail.statusType == 'N'){
      this.readOnly = false;
    }else {
      this.passData.tHeaderWithColspan = this.passData.tHeaderWithColspan.slice(1);
      this.readOnly = true;
      this.readOnly = true;
      this.passData.addFlag = false;
      this.passData.checkFlag = false;
      this.invesmentData.checkFlag = false;
      this.passData.deleteFlag = false;
      this.invesmentData.addFlag = false;
      this.invesmentData.deleteFlag = false;
      this.passData.uneditable = [true,true,true,true,true];
      this.passData.disableAdd = true;
      // this.invesmentData.uneditable = [true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true ],    
      this.invesmentData.disableAdd = true;
      this.invesmentData.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true, true,
                                       true,true,true,true,true,true,true];
      this.invesmentData.tHeaderWithColspan = this.invesmentData.tHeaderWithColspan.slice(1);
    }
  	this.retrieveInvPullOut();
  }

  // add forkjoin for charges from maintenance
  retrieveInvPullOut() {
    var join = forkJoin(this.accountingService.getTrtyInv(this.jvDetail.tranId),
                        this.jvDetail.currCd == 'PHP' ? this.ms.getMtnParameters('N', 'INVT_BANKCHRG_RT_PHP') : this.ms.getMtnParameters('N', 'INVT_BANKCHRG_RT_USD'),
                        this.jvDetail.currCd == 'PHP' ? this.ms.getMtnParameters('N', 'INVT_WHTAX_RT_PHP') : this.ms.getMtnParameters('N', 'INVT_WHTAX_RT_USD')
                            ).pipe(map(([invt, bc, wt]) => {return {invt, bc, wt}; }));

    join.subscribe((data: any) => {
      this.passData.tableData = [];
      this.cedingFlag = false;
      if(data['invt'].acctTreatyBal.length != 0){
        this.cedingFlag = true;
        this.jvDetails.cedingName = data['invt'].acctTreatyBal[0].cedingName
        this.jvDetails.cedingId = data['invt'].acctTreatyBal[0].cedingId;
        for (var i = 0; i < data['invt'].acctTreatyBal.length; i++) {
          data['invt'].acctTreatyBal[i].quarterEnding = this.dp.transform(this.ns.toDateTimeString(data['invt'].acctTreatyBal[i].quarterEnding), 'MM/dd/yyyy');
          this.passData.tableData.push(data['invt'].acctTreatyBal[i]);
        }
        this.quarterTable.refreshTable();
        this.quarterTable.onRowClick(null,this.passData.tableData[0]);
        if(this.jvDetail.statusType == 'N'){
          this.passData.disableAdd = false;
        }
      }

      this.invesmentData.bankChargeRt = (data['bc']['parameters'][0]['paramValueN'] / 100).toFixed(10);
      this.invesmentData.whtaxRt = (data['wt']['parameters'][0]['paramValueN'] / 100).toFixed(10);
    });

    /*this.accountingService.getTrtyInv(this.jvDetail.tranId).subscribe((data:any) =>{
      this.passData.tableData = [];
      this.cedingFlag = false;
      if(data.acctTreatyBal.length != 0){
        this.cedingFlag = true;
        this.jvDetails.cedingName = data.acctTreatyBal[0].cedingName
        this.jvDetails.cedingId = data.acctTreatyBal[0].cedingId;
        for (var i = 0; i < data.acctTreatyBal.length; i++) {
          data.acctTreatyBal[i].quarterEnding = this.dp.transform(this.ns.toDateTimeString(data.acctTreatyBal[i].quarterEnding), 'MM/dd/yyyy');
          this.passData.tableData.push(data.acctTreatyBal[i]);
        }
        this.quarterTable.refreshTable();
        this.quarterTable.onRowClick(null,this.passData.tableData[0]);
        if(this.jvDetail.statusType == 'N'){
          this.passData.disableAdd = false;
        }
      }
    });*/
  }

  showCedingCompanyLOV(){
  	$('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.payeeName;
    this.jvDetails.cedingId = data.payeeCd;
    this.passData.disableAdd = false;
    this.ns.lovLoader(data.ev, 0);
    this.check(this.jvDetails);
  }

  check(data){
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  /*quarterEndModal(data){
    this.quarterModal.modal.openNoClose();
  }*/

  showOsQsoaMdl() {
    this.passLov2.selector = 'osQsoa';
    this.passLov2.hide = this.passData.tableData.map(a => a.qsoaId);
    this.passLov2.params = {
      qsoaId: '',
      currCd: this.jvDetail.currCd,
      cedingId: this.jvDetails.cedingId
    }

    this.osQsoaLov.openLOV();
  }

  setOsQsoa(data) {
    data['data'].forEach(a => {
      if(this.passData.tableData.some(b => b.qsoaId != a.qsoaId)) {
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
        a.createDate = '';
        a.createUser = '';
        a.localAmt = +(parseFloat(a.remainingBal) * parseFloat(this.jvDetail.currRate)).toFixed(2);
        this.passData.tableData.push(a);
      }
    });

    this.passData.tableData = this.passData.tableData.filter(a => a.qsoaId != '');
    this.quarterTable.onRowClick(null,this.passData.tableData[0]);
    this.quarterTable.refreshTable();
    this.quarterTable.markAsDirty();
  }

  onrowClick(data){
    if(data !== null && data.qsoaId){
      this.invesmentData.qsoaId = data.qsoaId;
      this.invesmentData.nData.qsoaId = data.qsoaId;
      this.invesmentData.tableData = data.trtyInvmt == undefined ? [] : data.trtyInvmt;
      this.invesmentData.disableAdd = false;
    }else if(data!==null){
      this.invesmentData.disableAdd = false;
      this.invesmentData.tableData = [];
    }else{
      this.invesmentData.disableAdd = true;
      this.invesmentData.tableData = [];
    }
    this.invTable.refreshTable();
    this.infoData.emit(data);
  }

  invClick(data){
    this.infoData.emit(data);
  }

  setQuarter(data){
    var quarterNo = null;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
    this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
    this.passData.tableData[this.passData.tableData.length - 1].edited = true;
    this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = data;
    quarterNo = data.split('T');
    quarterNo = quarterNo[0].split('-');
    quarterNo = quarterNo[0]+quarterNo[1];
    this.passData.tableData[this.passData.tableData.length - 1].quarterNo = parseInt(quarterNo); 
    this.quarterTable.refreshTable();
    this.quarterTable.onRowClick(null, this.passData.tableData[0]);
  }

  updateTreaty(data){
    var deletedFlag = false;
    var table = ''
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].localAmt = isNaN(this.passData.tableData[i].currRate) ? 0:this.passData.tableData[i].currRate * this.passData.tableData[i].balanceAmt;

      this.passData.tableData[i].newPaytAmt = +(parseFloat(this.passData.tableData[i].prevPaytAmt) + parseFloat(this.passData.tableData[i].localAmt)).toFixed(2);
      this.passData.tableData[i].newBalance = +(parseFloat(this.passData.tableData[i].netQsoaAmt) - parseFloat(this.passData.tableData[i].newPaytAmt)).toFixed(2);

      if(this.passData.tableData[i].deleted){
        deletedFlag = true;
      }
    }

    if(deletedFlag){
      table = this.passData.tableData.filter((a)=>{return !a.deleted});
      if(table.length != 0){
        this.quarterTable.onRowClick(null, table[0]);
      }else{
        this.invesmentData.tableData = [];
        this.invTable.refreshTable();
      }
    }
    this.quarterTable.refreshTable();
  }

  setSelectedData(data){
    this.invesmentData.tableData = this.invesmentData.tableData.filter(a => a.showMG != 1);
    for(var  i=0; i < data.data.length;i++) {
      this.invesmentData.tableData.push(JSON.parse(JSON.stringify(this.invesmentData.nData)));
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].showMG = 0;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].edited  = true;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].itemNo = null;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].tranId = this.jvDetail.tranId; 
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].invtId = data.data[i].invtId;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].invtCode = data.data[i].invtCd;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].certNo = data.data[i].certNo;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].invtType = data.data[i].invtType;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].invtTypeDesc = data.data[i].invtTypeDesc;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].invtSecCd = data.data[i].invtSecCd;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].securityDesc = data.data[i].invtSecDesc;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].maturityPeriod = data.data[i].matPeriod;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].durationUnit = data.data[i].durUnit;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].interestRate = data.data[i].intRt;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].purchasedDate = data.data[i].purDate;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].maturityDate = data.data[i].matDate;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].pulloutType = 'F';
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].currCd = data.data[i].currCd;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].currRate = data.data[i].currRate;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].invtAmt = data.data[i].invtAmt;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].incomeAmt = data.data[i].incomeAmt;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].bankCharge = data.data[i].bankCharge;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].whtaxAmt = data.data[i].whtaxAmt;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].maturityValue = data.data[i].matVal;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].localAmt = data.data[i].matVal * this.jvDetail.currRate;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].uneditable = ['invtCode'];
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].balIncome      = data.data[i].balIncome;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].pullInvtAmt = data.data[i].invtAmt;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].pullIncomeAmt = data.data[i].balIncome;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].pullBankCharge = data.data[i].balIncome * this.invesmentData.bankChargeRt;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].pullWhtaxAmt = data.data[i].balIncome * this.invesmentData.whtaxRt;
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].pullNetValue = (data.data[i].invtAmt + data.data[i].balIncome) - (data.data[i].balIncome * this.invesmentData.bankChargeRt) - (data.data[i].balIncome * this.invesmentData.whtaxRt);
      this.invesmentData.tableData[this.invesmentData.tableData.length - 1].incomeBalance = 0;
    }
    this.invTable.refreshTable();
    this.invTable.onRowClick(null,this.invTable.indvSelect);

    console.log(this.quarterTable);

    this.quarterTable.indvSelect.trtyInvmt = this.invesmentData.tableData;
  }

  openLOV(data){
    this.passLov.searchParams = [{key: 'bankCd', search: ''}, {key:'invtStatus', search: 'M%'}, {key:'currCd', search: this.jvDetail.currCd}];
    this.passLov.hide = this.invesmentData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtCode});
    this.lovMdl.openLOV();
  }

  prepareData(){
    this.jvDetails.saveaccTrty = [];
    this.jvDetails.saveTrtyInvt = [];
    this.jvDetails.delaccTrty = [];
    this.jvDetails.delTrtyInvt = [];
    var quarterNo;
    var actualBalPaid = 0;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(!this.passData.tableData[i].deleted){
        this.jvDetails.saveaccTrty.push(this.passData.tableData[i]);
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].tranId = this.jvDetail.tranId;
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].cedingId = this.jvDetails.cedingId;
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].qsoaId      = this.passData.tableData[i].qsoaId;
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].quarterEnding = this.ns.toDateTimeString(this.passData.tableData[i].quarterEnding);
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].createUser = this.ns.getCurrentUser();
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].updateUser = this.ns.getCurrentUser();

        /*if(this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].quarterNo === ''){
          quarterNo = this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].quarterEnding.split('T');
          quarterNo = quarterNo[0].split('-');
          quarterNo = quarterNo[0]+quarterNo[1];
          this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].quarterNo =  parseInt(quarterNo); 
        }*/

        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].quarterNo = this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].qsoaId;
      }

      if(this.passData.tableData[i].deleted){
        //this.jvDetails.delaccTrty.push(this.passData.tableData[i]);
        for (var a = 0; a < this.passData.tableData[i].trtyInvmt.length; a++) {
          this.jvDetails.delaccTrty.push(this.passData.tableData[i].trtyInvmt[a]);
          this.jvDetails.delaccTrty[this.jvDetails.delaccTrty.length - 1].cedingId    =  this.jvDetails.cedingId;
          this.jvDetails.delaccTrty[this.jvDetails.delaccTrty.length - 1].qsoaId      =  this.passData.tableData[i].qsoaId;
          this.jvDetails.delaccTrty[this.jvDetails.delaccTrty.length - 1].updateDate  =  this.ns.toDateTimeString(0);

          this.jvDetails.delaccTrty[this.jvDetails.delaccTrty.length - 1].quarterNo  =  this.passData.tableData[i].qsoaId;
        }
      }
      
      for (var j = 0; j < this.passData.tableData[i].trtyInvmt.length; j++) {
        if(!this.passData.tableData[i].trtyInvmt[j].deleted && !this.passData.tableData[i].deleted){
          this.jvDetails.saveTrtyInvt.push(this.passData.tableData[i].trtyInvmt[j]);
          actualBalPaid += this.passData.tableData[i].trtyInvmt[j].maturityValue;
          this.jvDetails.saveTrtyInvt[this.jvDetails.saveTrtyInvt.length - 1].tranId  = this.jvDetail.tranId;
          this.jvDetails.saveTrtyInvt[this.jvDetails.saveTrtyInvt.length - 1].quarterNo  = this.passData.tableData[i].qsoaId;
          this.jvDetails.saveTrtyInvt[this.jvDetails.saveTrtyInvt.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].trtyInvmt[j].createDate);
          this.jvDetails.saveTrtyInvt[this.jvDetails.saveTrtyInvt.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].trtyInvmt[j].updateDate);
        }

        if(this.passData.tableData[i].trtyInvmt[j].deleted){
          this.jvDetails.delTrtyInvt.push(this.passData.tableData[i].trtyInvmt[j]);

          this.jvDetails.delTrtyInvt[this.jvDetails.delTrtyInvt.length - 1].quarterNo  =  this.passData.tableData[i].qsoaId;
        }
      }  
      if(!this.passData.tableData[i].deleted){
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].actualBalPaid = actualBalPaid;
      }
    }

    this.jvDetails.tranId = this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    this.accountingService.saveTrtyInv(this.jvDetails).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveInvPullOut();
      }
    });
  }

  onClickSave(){
    var netMaturity = 0;
    var errorFlag = false;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      netMaturity = 0;
      for (var j = 0; j < this.passData.tableData[i].trtyInvmt.length; j++) {
        netMaturity += this.passData.tableData[i].trtyInvmt[j].maturityValue;
        var a = this.passData.tableData[i].trtyInvmt[j];

        if(a.edited && !a.deleted && isNaN(a.pullIncomeAmt)) {
          this.dialogIcon = "error-message";
          this.dialogMessage = "Invalid Income Amount";
          this.successDiag.open();
          return;
        } else if(a.edited && !a.deleted && a.pullIncomeAmt > a.balIncome) {
          this.dialogIcon = "error-message";
          this.dialogMessage = "Income amount must not exceed income balance";
          this.successDiag.open();
          return;
        }
      }
      if(this.passData.tableData[i].balanceAmt < netMaturity){
        // temporarily removed after invt pullout revamp
        // errorFlag = true;
      }
    }

    if(errorFlag){
      this.dialogMessage = 'Payment Amount must not be less than Net Maturity Value.';
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  update(ev) {
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].maturityValue = this.passData.tableData[i].maturityValue * 1;
    }
    // this.invTable.refreshTable();

    var x = ev.lastEditedRow;

    if(ev.key == 'pulloutType') {
      x.pullInvtAmt = x.pulloutType == 'F' ? x.invtAmt : 0;
    }

    if(ev.key == 'pullIncomeAmt' || ev.key == 'pulloutType') {
      x.pullBankCharge = x.pullIncomeAmt * this.invesmentData.bankChargeRt;
      x.pullWhtaxAmt = x.pullIncomeAmt * this.invesmentData.whtaxRt;
      x.pullNetValue = (x.pullInvtAmt + x.pullIncomeAmt) - x.pullBankCharge - x.pullWhtaxAmt;
      x.incomeBalance = x.incomeAmt - x.pullIncomeAmt;
    }

    if(ev.key == 'pullBankCharge' || ev.key == 'pullWhtaxAmt') {
      x.pullNetValue = (x.pullInvtAmt + x.pullIncomeAmt) - x.pullBankCharge - x.pullWhtaxAmt;
    }

    this.invTable.refreshTable();
  }
}
