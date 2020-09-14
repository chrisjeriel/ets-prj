import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountingService, NotesService, MaintenanceService, PrintService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { OverrideLoginComponent } from '@app/_components/common/override-login/override-login.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { UploaderComponent } from '@app/_components/common/uploader/uploader.component';

@Component({
  selector: 'app-acct-ar-entry',
  templateUrl: './acct-ar-entry.component.html',
  styleUrls: ['./acct-ar-entry.component.css']
})
export class AcctArEntryComponent implements OnInit, OnDestroy {
  @ViewChild('paytDtl') paytDtlTbl: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(LovComponent) lov: LovComponent;
  @ViewChild('cancelMdl') cancelMdl: ModalComponent;
  @ViewChild('specCancelMdl') specCancelMdl: ModalComponent;
  @ViewChild('reprintModal') reprintMdl: ModalComponent;
  @ViewChild('printModal') printMdl: ModalComponent;
  @ViewChild('leaveMdl') leaveMdl: ModalComponent;
  @ViewChild("myForm") form: any;
  @ViewChild("myForm2") form2: any;
  @ViewChild('override') overrideLogin: OverrideLoginComponent;
  @ViewChild('AcctEntries') upAcctEntMdl      : ModalComponent;
  @ViewChild('successPrintMdl') successPrintMdl      : ModalComponent;
  @ViewChild(UploaderComponent) up            : UploaderComponent;

  passData: any = {
        tableData: [],
        tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Bank Account No.','Check No.','Check Date','Check Class', 'Remarks'],
        dataTypes: ['reqSelect','text','percent','reqCurrency','select','text','reqTxt','reqDate','reqSelect', 'text'],
        paginateFlag: true,
        infoFlag: true,
        pageLength: 5,
        widths: [130,70,100,130,180,1,150,100,180,210],
        keys: ['paytMode', 'currCd', 'currRate', 'paytAmt', 'bank', 'bankAcct', 'checkNo', 'checkDate', 'checkClass', 'remarks'],
        uneditable: [false,true,true,false,false,false,false,false,false, false],
        pageID: 1,
        addFlag: true,
        genericBtn: 'Delete',
        nData: {
          paytMode: 'CK',
          currCd: 'PHP',
          currRate: 1,
          paytAmt: 0,
          bank: '',
          bankAcct: '',
          checkNo: '',
          checkDate: '',
          checkClass: 'LC',
          remarks: ''
          //uneditable: ['bank', 'bankAcct', 'checkNo', 'checkDate', 'checkClass']
        },
        disableGeneric: true,
        opts:[
          {
            selector: 'paytMode',
            vals: ['BT', 'CA', 'CK'],
            prev: ['Bank Transfer', 'Cash', 'Check']
          },
          {
            selector: 'currCd',
            vals: [],
            prev: []
          },
          {
            selector: 'bank',
            vals: [],
            prev: []
          },
          {
            selector: 'checkClass',
            vals: ['LC', 'RC', 'MC', 'OU'],
            prev: ['Local Clearing', 'Regional Clearing', 'Manager\'s Check','On-Us']
          },
        ]
    };

  @Input() record: any = {
                   arNo: null,
                   payor: null,
                   arDate: null,
                   paymentType: null,
                   status: null,
                   particulars: null,
                   amount: null
                 };
  @Input() emittedValue: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() disableTab: EventEmitter<any> = new EventEmitter();
  @Output() emitArInfo: EventEmitter<any> = new EventEmitter();

  sub: any;
  forkSub: any;
  isAdd: boolean = false;
  cancelFlag: boolean = false;
  isCancelled: boolean = false;
  dcbBankAcctCurrCd: string = '';
  disablePayor: boolean = false;
  isPrinted: boolean = false;
  isReopen: boolean = false;
  loading: boolean = false;
  screenPrint: boolean = false;
  canOverride: boolean = false;

  dialogIcon: string = '';
  dialogMessage: string = '';
  dcbStatus: string = '';
  generatedArNo: string = '';
  printMethod: string = '2';
  approvalCd: string = '';

  uploadLoading: boolean = false;
  acctEntryFile: any;
  fileName: string = '';
  emitMessage: string = '';
  canUpAcctEnt: boolean = true;
  canReprint: boolean = true;
  printLoading: boolean = false;
  genAcctEnt: boolean = false;

  arInfo: any = {
    tranId: '',
    tranClass: 'AR',
    arNo: '',
    formattedArNo: '',
    arNoDigits: '',
    arDate: '',
    arStatus: '',
    tranStat: '',
    arStatDesc: 'New',
    tranStatDesc: '',
    dcbYear: '',
    dcbUserCd: '',
    dcbNo: '',
    dcbStatus: '',
    dcbBank: '',
    dcbBankName: '',
    dcbBankAcct: '',
    dcbBankAcctNo: '',
    refNo: '',
    tranTypeCd: '',
    tranTypeName: '',
    prNo: '',
    prDate: '',
    prPreparedBy: '',
    payeeNo: '',
    payeeClassCd: '',
    payor: '',
    mailAddress: '',
    bussTypeCd: '',
    tin: '',
    currCd: '',
    arAmt: '',
    currRate: '',
    particulars: '',
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: '',
    rstrctTranUp: '',
    arDtlSum: '',
    acctEntriesSum: '',
    acctEntriesSumF: '',
    acctEntDate: '',
    allocTag: 'N',
    reopenTag: '',
    reopenDate: ''
  }

  arDate: any = {
    date: '',
    time: ''
  }

  prDate: any = {
    date: '',
    time: ''
  }

  //maintenance variables
  paymentTypes: any[] = [];
  currencies: any[] = [];
  banks: any[] = [];
  bankAccts: any[] = [];
  savedData: any[] = [];
  deletedData: any[] = [];
  printers: string[] = [];

  selectedCurrency: string = 'PHP';
  selectedPrinter: string = "";

  selectedBank: any = {
    bankCd: '',
    officialName: ''
  }

  selectedBankAcct: any = {
    bankAcctCd: '',
    accountNo: ''
  }

  passLov:any = {
    selector:'',
    payeeClassCd: 1,
    activeTag: ''
  };

  constructor(private route: ActivatedRoute, private as: AccountingService, private ns: NotesService, private ms: MaintenanceService, private ps : PrintService) { }

  ngOnInit() {
    this.loading = true;
    setTimeout(()=>{this.disableTab.emit(true);},0);
    this.getPrinters();
    //this.retrievePaymentType();
    this.canUploadAcctEntry();
    this.canReprintMethod();
    //this.retrieveCurrency();
    var tranId;
    var arNo;
    this.onChange.emit({ type: this.arInfo.tranTypeCd });
    if(this.emittedValue == undefined){
      this.sub = this.route.params.subscribe(
         data=>{
           if(data.from === 'CancelledTran'){
             
             tranId = data.tranId;
             arNo = '';
             this.isCancelled = true;
             this.passData.addFlag = false;
             this.passData.genericBtn = undefined;
             this.passData.uneditable = [true,true,true,true,true,true,true,true,true];
             this.paytDtlTbl.refreshTable();
           }else{
             if('add' === data['action'].trim()){
               
               this.isAdd = true;
             }else{
               
               this.isAdd = false;
               let params = JSON.parse(data['slctd']);
               tranId = params.tranId;
               arNo = params.arNo;
               if(params.status === 'Cancelled' || params.status === 'Deleted'){
                 
                 this.isCancelled = true;
                 this.passData.addFlag = false;
                 this.passData.genericBtn = undefined;
                 this.passData.uneditable = [true,true,true,true,true,true,true,true,true];
                 this.paytDtlTbl.refreshTable();
               }         
             }
           }
         }
      );
    }
    //NECO PLEASE OPTIMIZE THIS, THIS IS NOT OPTIMIZED -neco also
    //Aug 8, 2019 Thank you for optimizing 
    if(!this.isAdd && this.emittedValue === undefined){
      
      this.retrieveArEntry(tranId, arNo);
    }else{  //edit
      if(this.emittedValue !== undefined){
        this.retrieveArEntry(this.emittedValue.tranId, this.emittedValue.arNo);
        this.isAdd = false;
        
      }else{ //add
        //this.retrieveMtnBank();
        this.retrieveMtnAcitDCBNo(new Date().getFullYear(), this.ns.toDateTimeString(0));
        //this.retrieveMtnDCBUser();
        
        this.retrieveCurrency();
        this.setDefaultValues();
        this.arDate.date = this.ns.toDateTimeString(0).split('T')[0];
        this.arDate.time = this.ns.toDateTimeString(0).split('T')[1];
      }
    }
    if(this.emittedValue !== undefined && this.emittedValue.arStatus === 'X'){
      
      this.isCancelled = true;
      this.passData.addFlag = false;
      this.passData.genericBtn = undefined;
      this.passData.uneditable = [true,true,true,true,true,true,true,true,true];
      this.paytDtlTbl.refreshTable();
    }
  }

  confirmNewAr(){
    if(this.form.dirty){
      this.leaveMdl.openNoClose();
    }else{
      this.newAr();
    }
  }

  newAr(){
    this.loading = true;
    this.isAdd = true;
    this.isReopen = false;
    this.disableTab.emit(true);
    this.retrieveMtnAcitDCBNo(new Date().getFullYear(), this.ns.toDateTimeString(0));
    this.setDefaultValues();
    //this.retrieveMtnDCBUser();
    this.arDate.date = this.ns.toDateTimeString(0).split('T')[0];
    this.arDate.time = this.ns.toDateTimeString(0).split('T')[1];
    this.isCancelled = false;
    this.isPrinted = false;
    this.passData.uneditable = [];
    this.passData.addFlag = true;
    this.passData.genericBtn = 'Delete';
    this.paytDtlTbl.refreshTable();
    this.arInfo = {
      tranId: '',
      tranClass: 'AR',
      arNo: '',
      arDate: '',
      arStatus: '',
      tranStat: '',
      arStatDesc: 'New',
      tranStatDesc: '',
      dcbYear: '',
      dcbUserCd: '',
      dcbNo: '',
      dcbStatus: '',
      dcbBank: '',
      dcbBankName: '',
      dcbBankAcct: '',
      dcbBankAcctNo: '',
      refNo: '',
      tranTypeCd: '',
      tranTypeName: '',
      prNo: '',
      prDate: '',
      prPreparedBy: '',
      payeeNo: '',
      payeeClassCd: '',
      payor: '',
      mailAddress: '',
      bussTypeCd: '',
      tin: '',
      refCd: '',
      currCd: '',
      arAmt: '',
      currRate: '',
      particulars: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
      cedingId: '',
      bussTypeName: '',
      rstrctTranUp: '',
      arDtlSum: '',
      acctEntriesSum: '',
      acctEntriesSumF: '',
      acctEntDate: '',
      allocTag: '',
      reopenTag: '',
      reopenDate: ''
    }
    this.prDate = {
      date: '',
      time: ''
    }

    this.passData.tableData = [];
    this.paytDtlTbl.refreshTable();
    this.retrieveCurrency();
    //this.retrieveMtnBank();
    this.passData.disableGeneric = true;
    this.form.control.markAsPristine();
    this.form2.control.markAsPristine();
  }

  ngOnDestroy(){
    this.ns.clearFormGroup();
    if(this.sub != undefined){
      this.sub.unsubscribe();
    }
    if(this.forkSub !== undefined){
      this.forkSub.unsubscribe();
    }
  }

  openLOV(type){
    if(type === 'payor'){
      this.passLov.selector = 'payee';
      this.passLov.payeeNo = '';
      if(this.arInfo.tranTypeCd == '5'){ //get only the banks if investment pullout
        this.passLov.payeeClassCd = 3;
      }else if(this.arInfo.tranTypeCd == '8'){ //get everyone if others
        this.passLov.payeeClassCd = null;
      }else{
        this.passLov.payeeClassCd = 1; //get only cedants
      }
    }else if(type === 'business'){
      this.passLov.selector = 'mtnBussType';
      this.passLov.activeTag = 'Y';
    }
    this.lov.openLOV();
  }

  openCancelModal(){
    this.approvalCd = 'AC006';
    this.ms.getMtnApprovalFunction(this.approvalCd).subscribe(
      (data:any)=>{
        if(data.approverFn.map(a=>{return a.userId}).includes(this.ns.getCurrentUser())){
          //User has the authority to cancel AR
          if([1,2,3,5].includes(this.arInfo.tranTypeCd) && this.arInfo.arStatDesc.toUpperCase() == 'PRINTED'){
            this.specCancelMdl.openNoClose();
          }else{
            this.cancelMdl.openNoClose();
          }
        }else{
          //User has no authority. Open Override Login
          this.overrideLogin.getApprovalFn();
          this.overrideLogin.overrideMdl.openNoClose();
        }
      }
    );
  }

  toCancelAr(auth){
    if(auth){
      if([1,2,3,5].includes(this.arInfo.tranTypeCd) && this.arInfo.arStatDesc.toUpperCase() == 'PRINTED'){
        this.specCancelMdl.openNoClose();
      }else{
        this.cancelMdl.openNoClose();
      }
    }
  }

  cancelAr(reopen?){
    let params: any = {
      tranId: this.arInfo.tranId,
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      reopen: reopen == undefined ? 'N' : 'Y'
    };
    this.as.cancelAr(params).subscribe(
      (data: any)=>{
        if(data.returnCode !== 0){
          this.isCancelled = true;
          this.dialogIcon = 'success';
          this.successDiag.open();
          this.passData.addFlag = false;
          this.passData.genericBtn = undefined;
          this.passData.uneditable = [true,true,true,true,true,true,true,true,true];
          this.retrieveArEntry(this.arInfo.tranId, this.arInfo.arNo);
          this.paytDtlTbl.refreshTable();
        }
      }
    );
  }

  tabController(event) {
  	this.onChange.emit({ type: this.arInfo.tranTypeCd });
  }

  changePayeeNo(event){
  this.ns.lovLoader(event, 1);
  this.passLov.selector = 'payee';
    if(this.arInfo.tranTypeCd == '5'){ //get only the banks if investment pullout
      this.passLov.payeeClassCd = 3;
    }else if(this.arInfo.tranTypeCd == '8'){ //get everyone if others
      console.log('test')
      this.passLov.payeeClassCd = '';
    }else{
      this.passLov.payeeClassCd = 1; //get only cedants
      this.arInfo.payeeNo = this.pad(this.arInfo.payeeNo, 'payeeNo');
    }
    this.passLov.payeeNo = this.arInfo.payeeNo;
    this.lov.checkCode('payee',null,null,null,null,null,event);
  }

  changeCurrency(data){
    this.genAcctEnt = true;
    this.selectedCurrency = data;
    this.passData.nData.currCd = data;
    this.arInfo.currCd = data;
    for(var i of this.currencies){
      if(i.currencyCd == data){
        this.arInfo.currRate = i.currencyRt;
        this.passData.nData.currRate = i.currencyRt;
        setTimeout(()=>{
          $('.rate').focus().blur();
        },0);
        break;
      }
    }
    //apply changes to payment details
    for(var j = 0; j < this.passData.tableData.length; j++){
      this.passData.tableData[j].currCd = this.selectedCurrency;
      this.passData.tableData[j].currRate = this.arInfo.currRate;
      this.passData.tableData[j].edited = true;
    }
    this.paytDtlTbl.refreshTable();
    this.retrieveMtnBankAcct();
  }

  changeCurrencyRt(){
    this.genAcctEnt = true;
    this.passData.nData.currRate = this.arInfo.currRate;
    for(var i = 0; i < this.passData.tableData.length; i++){
      this.passData.tableData[i].currRate = this.arInfo.currRate;
      this.passData.tableData[i].edited = true;
    }
    this.paytDtlTbl.refreshTable();
  }

  changeDcbBank(data){
    this.genAcctEnt = true;
    this.selectedBank = data;
    this.arInfo.dcbBank = data.bankCd;
    this.arInfo.dcbBankName = data.officialName;
    this.retrieveMtnBankAcct();
  }

  changeDcbBankAcct(data){
    this.genAcctEnt = true;
    this.selectedBankAcct = data;
    this.arInfo.dcbBankAcct = data.bankAcctCd;
    this.arInfo.dcbBankAcctNo = data.accountNo;
    this.dcbBankAcctCurrCd = data.currCd;
    console.log(data.currCd);
  }

  changeArAmt(data){
    console.log(data);
    this.genAcctEnt = true;
    this.arInfo.arAmt = this.arInfo.arAmt.length == 0 || this.arInfo.arAmt == null ? '' : Math.round(parseFloat(this.arInfo.arAmt.split(',').join(''))*100) / 100;
  }

  setLov(data){
    console.log(data);
    if(data.selector === 'payee'){
      if(data.ev != undefined){
        this.ns.lovLoader(data.ev, 0);
      }
      if(data.data == null){
        this.arInfo.payeeNo      = '';
        this.arInfo.payeeClassCd = '';
        this.arInfo.payor        = '';
        this.arInfo.tin          = '';
        this.arInfo.bussTypeCd   = '';
        this.arInfo.mailAddress  = '';
        this.arInfo.cedingId     = '';
        this.arInfo.bussTypeName = '';
      }else{
        this.arInfo.payeeNo = data.data.payeeNo;
        this.arInfo.payeeClassCd = data.data.payeeClassCd;
        this.arInfo.payor = data.data.payeeName;
        this.arInfo.tin = data.data.tin;
        this.arInfo.bussTypeCd = data.data.bussTypeCd;
        this.arInfo.mailAddress = data.data.mailAddress;
        this.arInfo.cedingId = data.data.cedingId;
        this.arInfo.bussTypeName = data.data.bussTypeName;
      }
      this.genAcctEnt = true;
      this.form.control.markAsDirty();
      setTimeout(()=>{
        $('.payor').focus().blur();
      }, 0);
    }else if(data.selector === 'mtnBussType'){
      this.arInfo.bussTypeCd = data.data.bussTypeCd;
      this.arInfo.bussTypeName = data.data.bussTypeName;
      this.form.control.markAsDirty();
      setTimeout(()=>{
        $('.business').focus().blur();
      }, 0);
    }
    
  }

  retrieveArEntry(tranId, arNo){
    var sub$ = forkJoin(this.as.getArEntry(tranId, arNo),
                        this.ms.getMtnBank(null,null,'Y',null),
                        this.ms.getMtnBankAcct(),
                        this.ms.getMtnCurrency('', 'Y', this.arDate.date),
                        this.ms.getMtnAcitTranType('AR',null,null,null,null,'Y')).pipe(map(([ar, bank, bankAcct, curr, paymentType]) => { return { ar, bank, bankAcct, curr, paymentType }; }));
    this.forkSub = sub$.subscribe(
      (forkData:any)=>{
        this.genAcctEnt = false;
        console.log('arEntry first');
        let data = forkData.ar;
        let bankData = forkData.bank;
        let bankAcctData = forkData.bankAcct;
        let curr = forkData.curr;
        let paymentType = forkData.paymentType;
        if(paymentType.tranTypeList.length !== 0){
          paymentType.tranTypeList = paymentType.tranTypeList.filter(a=>{return a.tranTypeCd !== 0});
          this.paymentTypes = paymentType.tranTypeList;
          this.arInfo.tranTypeCd = this.paymentTypes.filter(a=>{return a.autoTag == 'Y'}).length == 0 ? '' : this.paymentTypes.filter(a=>{return a.autoTag == 'Y'})[0].tranTypeCd;
        }
        console.log(data);
        //ar
        if(data.ar !== null){
          this.arInfo.acctEntDate    = data.ar.acctEntDate;
          this.arInfo.tranId         = data.ar.tranId;
          this.arInfo.arNo           = this.pad(data.ar.arNo, 'arNo');
          this.arInfo.formattedArNo  = parseInt(data.ar.formattedArNo.split('-')[1]) == 0 ? '' : data.ar.formattedArNo;
          this.arInfo.arNoDigits     = data.ar.arNoDigits;
          this.arInfo.arDate         = this.ns.toDateTimeString(data.ar.arDate);
          this.arDate.date           = this.arInfo.arDate.split('T')[0];
          this.arDate.time           = this.arInfo.arDate.split('T')[1];
          this.arInfo.arStatus       = data.ar.arStatus;
          this.arInfo.tranStat       = data.ar.tranStat;
          this.arInfo.arStatDesc     = data.ar.tranStat == 'P' ? data.ar.tranStatDesc : data.ar.arStatDesc;
          this.arInfo.dcbYear        = data.ar.dcbYear;
          this.arInfo.dcbUserCd      = data.ar.dcbUserCd;
          this.arInfo.dcbNo          = data.ar.dcbNo;
          this.arInfo.dcbStatus      = data.ar.dcbStatus;
          this.dcbStatus             = data.ar.dcbStatus;
          this.arInfo.dcbBank        = data.ar.dcbBank;
          this.arInfo.dcbBankName    = data.ar.dcbBankName;
          this.arInfo.dcbBankAcct    = data.ar.dcbBankAcct;
          this.arInfo.dcbBankAcctNo  = data.ar.dcbBankAcctNo;
          this.arInfo.refNo          = data.ar.refNo;
          this.arInfo.tranTypeCd     = data.ar.tranTypeCd;
          this.arInfo.tranTypeName   = data.ar.tranTypeName;
          this.arInfo.prNo           = data.ar.prNo;
          this.arInfo.prDate         = this.ns.toDateTimeString(data.ar.prDate);
          this.prDate.date           = this.arInfo.prDate.split('T')[0];
          this.prDate.time           = this.arInfo.prDate.split('T')[1];
          this.arInfo.prPreparedBy   = data.ar.prPreparedBy;
          this.arInfo.payeeNo        = data.ar.payeeNo;
          this.arInfo.payeeClassCd   = data.ar.payeeClassCd;
          this.arInfo.payor          = data.ar.payor;
          this.arInfo.mailAddress    = data.ar.mailAddress;
          this.arInfo.bussTypeCd     = data.ar.bussTypeCd;
          this.arInfo.tin            = data.ar.tin;
          this.arInfo.refCd          = data.ar.refCd;
          this.arInfo.currCd         = data.ar.currCd;
          this.passData.nData.currCd = data.ar.currCd;
          this.arInfo.arAmt          = data.ar.arAmt;
          this.arInfo.currRate       = data.ar.currRate;
          this.passData.nData.currRate = data.ar.currRate;
          this.arInfo.particulars    = data.ar.particulars;
          this.arInfo.createUser     = data.ar.createUser;
          this.arInfo.createDate     = this.ns.toDateTimeString(data.ar.createDate);
          this.arInfo.updateUser     = data.ar.updateUser;
          this.arInfo.updateDate     = this.ns.toDateTimeString(data.ar.updateDate);
          this.arInfo.cedingId       = data.ar.cedingId;
          this.arInfo.bussTypeName   = data.ar.bussTypeName;
          this.arInfo.rstrctTranUp   = data.ar.rstrctTranUp;
          this.arInfo.arDtlSum       = data.ar.arDtlSum;
          this.arInfo.acctEntriesSum = data.ar.acctEntriesSum;
          this.arInfo.acctEntriesSumF = data.ar.acctEntriesSumF;
          this.arInfo.reopenTag       = data.ar.reopenTag;
          this.arInfo.reopenDate     = this.ns.toDateTimeString(data.ar.reopenDate);
          this.isReopen              = this.arInfo.reopenTag != null;
          this.selectedCurrency       = data.ar.currCd;
          if(this.arInfo.arStatDesc.toUpperCase() === 'DELETED' || this.arInfo.arStatDesc.toUpperCase() === 'CANCELED'){
          //if(this.arInfo.arStatDesc.toUpperCase() !== 'NEW'){
            //this.passData.dataTypes = ['select','select','percent','currency','select','text','text','date','select'];
            
            this.passData.addFlag = false;
            this.passData.genericBtn = undefined;
            this.passData.uneditable = [true,true,true,true,true,true,true,true,true, true];
            this.isCancelled = true;
          }else if(this.arInfo.arStatDesc.toUpperCase() === 'PRINTED' || this.arInfo.arStatDesc.toUpperCase() === 'POSTED'){
            
            this.passData.addFlag = false;
            this.passData.genericBtn = undefined;
            this.passData.uneditable = [true,true,true,true,true,true,true,true,true, true];
            this.isPrinted = true;
          }else if(this.isReopen){
            
            this.passData.addFlag = false;
            this.passData.genericBtn = undefined;
            this.passData.uneditable = [true,true,true,true,true,true,true,true,true, true];
          }

          if(this.arInfo.tranTypeCd == 7){
            this.disablePayor = true;
          }else{
            this.disablePayor = false;
          }

          //currencies
          this.currencies = [];
          this.passData.opts[1].vals = [];
          this.passData.opts[1].prev = [];
          if(curr.currency.length !== 0){
            for(var l of curr.currency){
              if(this.isAdd && 'PHP' === l.currencyCd){
                this.selectedCurrency = l.currencyCd;
                this.arInfo.currCd = l.currencyCd;
                this.arInfo.currRate = l.currencyRt;
              }
              this.currencies.push({currencyCd: l.currencyCd, currencyRt: l.currencyRt});
              this.passData.opts[1].vals.push(l.currencyCd);
              this.passData.opts[1].prev.push(l.currencyCd);
            }
          }
          console.log(data.ar.paytDtl);
          //this.passData.tableData          = data.ar.paytDtl;
          //tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Bank Account No.','Check No.','Check Date','Check Class', 'Remarks'],
          //dataTypes: ['reqSelect','reqSelect','reqPercent','reqCurrency','reqSelect','reqTxt','reqTxt','reqDate','reqSelect', 'text'],
          this.passData.tableData = [];
          for(var i of data.ar.paytDtl){
            i.uneditable = [];
            if(i.paytMode !== 'BT' && i.paytMode !== 'CK' && i.paytMode !== 'CR'){
              i.uneditable.push('bank');
              i.uneditable.push('bankAcct');
              //this.passData.dataTypes[4] = 'select';
              //this.passData.dataTypes[5] = 'text'; 
            }
            if(i.paytMode !== 'CK'){
              if(i.paytMode !== 'CR'){
                i.uneditable.push('checkNo');
                //this.passData.dataTypes[5] = 'text'; 
              }
              i.uneditable.push('checkDate');
              i.uneditable.push('checkClass');

            }
            /*if(i.paytMode !== 'CR' && i.paytMode !== 'CK'){
              i.uneditable.push('checkNo');
            }*/
            if(i.checkDate  == null){
              i.checkDate = '';
            }
            this.passData.tableData.push(i);
          }
          this.selectedBank.bankCd         = data.ar.dcbBank;
          this.selectedBankAcct.bankAcctCd = data.ar.dcbBankAcct;
          this.paytDtlTbl.refreshTable();
          this.onChange.emit({ type: this.arInfo.tranTypeCd });
          this.disableTab.emit(false);
          let arDetailParams = {
            tranId: this.arInfo.tranId,
            formattedArNo: this.arInfo.formattedArNo,
            arNoDigits: this.arInfo.arNoDigits,
            arNo: this.arInfo.arNo,
            arStatus: this.arInfo.arStatus,
            arStatDesc: this.arInfo.arStatDesc,
            arDate: this.arInfo.arDate,
            dcbNo: this.arInfo.dcbYear+/*'-'+this.arInfo.dcbUserCd+*/'-'+this.pad(this.arInfo.dcbNo, 'dcbSeqNo'),
            dcbStatus: this.arInfo.dcbStatus,
            tranTypeCd: this.arInfo.tranTypeCd,
            tranTypeName: this.arInfo.tranTypeName,
            currCd: this.arInfo.currCd,
            currRate: this.arInfo.currRate,
            arAmt: this.arInfo.arAmt,
            payeeNo: this.arInfo.payeeNo,
            payor: this.arInfo.payor,
            createUser: this.arInfo.createUser,
            createDate: this.arInfo.createDate,
            updateUser: this.arInfo.updateUser,
            updateDate: this.arInfo.updateDate,
            cedingId: this.arInfo.payeeNo,
            bussTypeName: this.arInfo.bussTypeName,
            refCd: this.arInfo.refCd,
            reopenTag: this.arInfo.reopenTag,
            from: 'ar',
            exitLink: 'acct-ar-listings'
          }
          this.emitArInfo.emit(arDetailParams);

          setTimeout(()=>{
            $('#arNo').focus();
            $('#arNo').blur();
            $('#arAmt').focus();
            $('#arAmt').blur();
            $('.rate').focus().blur();
          },0);

        }
        //bank
        if(bankData.bankList.length !== 0){
          for(var i of bankData.bankList){
            //this.banks.push(i);
            this.passData.opts[2].vals.push(i.bankCd);
            this.passData.opts[2].prev.push(i.officialName);
          }
          this.banks = bankData.bankList.filter(a=>{return a.dcbTag == 'Y'});
        }
        //bankAcct
        if(bankAcctData.bankAcctList.length !== 0){
            this.bankAccts = bankAcctData.bankAcctList.filter(a=>{return a.bankCd == this.selectedBank.bankCd && a.currCd == this.selectedCurrency && a.acSeGlDepNo === null && a.acItGlDepNo !== null});
            if(this.bankAccts.map(a=>{return a.accountNo}).indexOf(this.arInfo.dcbBankAcctNo) == -1){
              this.arInfo.dcbBankAcct = '';
              this.arInfo.dcbBankAcctNo = '';
              this.selectedBankAcct.bankAcctCd = '';
              this.selectedBankAcct.accountNo = '';
            }
        }
        for(var i of this.bankAccts){
          if(i.bankAcctCd == this.selectedBankAcct.bankAcctCd){
            this.dcbBankAcctCurrCd = i.currCd;
            break;
          }
        }
        this.form.control.markAsPristine();
        this.form2.control.markAsPristine();
        this.loading = false;
      },
      (error: any)=>{
        console.log('error');
      }
    );
  }

  onClickSave(){
    if(this.checkArInfoFields() || this.checkPaytDtlFields() || this.paytModeValidation() || this.passData.tableData.length === 0){ //empty required fields?
      this.dialogIcon = 'error';
      this.successDiag.open();
      $('.required').focus().blur();
      $('table input:not(.tbl-dp)').focus().blur();
      $('table select').focus().blur();
    }
    /*else if(this.bankVsArCurr()){  //dcb bank account is not equal to selected ar currency?
      this.dialogIcon = 'info';
      this.dialogMessage = 'Allowable DCB Bank Account should match the AR Currency.';
      this.successDiag.open();
    }*/
    else if(this.arAmtEqualsPayt()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Total amount of payment details is not equal to the AR Amount.';
      this.successDiag.open();
    }else if(this.dcbStatusCheck()){

      this.dialogIcon = 'error-message';
      this.dialogMessage = 'A.R. cannot be saved. DCB No. is '; 
      this.dialogMessage += this.dcbStatus == 'T' ? 'temporarily closed.' : 'closed.';
      this.successDiag.open();
    }
    else{
      $('#confirm-save #modalBtn2').trigger('click');
    }
  }

  save(cancelFlag?, isPrint?){
    this.cancelFlag = cancelFlag !== undefined;
    this.savedData = [];
    this.deletedData = [];
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].checkDate = this.savedData[this.savedData.length-1].checkDate == null || 
                                                              this.savedData[this.savedData.length-1].checkDate.length == 0 ? '' : 
                                                              this.ns.toDateTimeString(this.savedData[this.savedData.length-1].checkDate);
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
          this.deletedData.push(this.passData.tableData[i]);
          this.deletedData[this.deletedData.length-1].checkDate = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].checkDate);
      }
    }

    //set up dates
    this.arInfo.arDate = this.arDate.date + 'T' + this.arDate.time;
    this.arInfo.prDate = this.prDate.date.length === 0 ? '' : this.prDate.date + 'T' + this.prDate.time;

    //prepare params
    let params: any = this.arInfo;
    params.tranDate = this.arInfo.arDate;
    params.tranClassNo = this.arInfo.arNo;
    params.tranStat = this.isAdd ? 'O' : this.arInfo.tranStat ;
    params.tranYear = new Date().getFullYear();
    params.arStatus = this.isAdd ? 'N' : this.arInfo.arStatus;
    params.createUser = this.ns.getCurrentUser();
    params.updateUser = this.ns.getCurrentUser();
    params.createDate = this.ns.toDateTimeString(0);
    params.updateDate = this.ns.toDateTimeString(0);
    params.delPaytDtl = this.deletedData;
    params.savePaytDtl = this.savedData;
    params.isPrint = isPrint !== undefined ? '1' : null;
    params.genAcctEnt = this.genAcctEnt ? 'Y' : 'N';

    //save
    this.as.saveAcitArTrans(params).subscribe(
      (data:any)=>{
        if(data.returnCode === 0){
          if(data.errorList !== undefined || (data.errorList !== undefined && data.errorList.length !== 0)){
            this.dialogMessage = data.errorList[0] === undefined ? '' : data.errorList[0].errorMessage;
            this.dialogIcon = data.errorList[0] === undefined  ? 'error' : 'error-message';
          }else{
            this.dialogIcon = 'error';
          }
          this.successDiag.open();
        }
        else{
          this.isAdd = false;
          this.paytDtlTbl.refreshTable();
          if(isPrint == undefined){

            this.retrieveArEntry(data.outTranId, '');
            this.dialogIcon = 'success';
            this.successDiag.open();
          }
          this.form.control.markAsPristine();
          this.form2.control.markAsPristine();
          this.ns.formGroup.markAsPristine();
          this.paytDtlTbl.markAsPristine();
          if(isPrint !== undefined){
            this.reprintMethod();
           
          }
        }
        this.loading = false;
      }
    );
  }

  printStatus(){
    //Update Transactions to Closed and AR Status to Printed
    let params: any = {
      tranId: this.arInfo.tranId,
      arNo: this.arInfo.arNo,
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0)
    }
    setTimeout(()=>{
      this.as.printAr(params).subscribe(
        (data:any)=>{
          if(data.returnCode == 0){
            this.dialogIcon = 'error-message';
            this.dialogIcon = 'An error has occured when updating AR status';
          }else{
            console.log(data);
            console.log('printed');
            this.retrieveArEntry(this.arInfo.tranId, this.arInfo.arNo);
            this.printMdl.closeModal();
          }
          this.printLoading = false;
        }
      );
    },1000);
  }

  whichProcess(mainAuth){
    if(mainAuth){
      if(this.approvalCd == 'AC001'){ //Print AR process
        this.toPrintAr(mainAuth);
      }else if(this.approvalCd == 'AC006'){ //Cancel AR process
        this.toCancelAr(mainAuth);
      }
    }
  }

  print(){
    this.canPrintScreen();
    if(this.arAmtEqualsArDtlPayt()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'AR cannot be printed. Total Payments in AR Details must be equal to AR Amount';
      this.successDiag.open();
    }else if(this.balanceAcctEntries()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'AR cannot be printed. Accounting Entries must have zero variance.';
      this.successDiag.open();
    }else if(this.checkArInfoFields() || this.checkPaytDtlFields() || this.paytModeValidation() || this.passData.tableData.length === 0){ //empty required fields?
      this.dialogIcon = 'error';
      this.successDiag.open();
      $('.required').focus().blur();
      $('table input').focus().blur();
      $('table select').focus().blur();
    }
    else if(this.arAmtEqualsPayt()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Total amount of payment details is not equal to the AR Amount.';
      this.successDiag.open();
    }else if(this.dcbStatusCheck()){

      this.dialogIcon = 'error-message';
      this.dialogMessage = 'A.R. cannot be saved. DCB No. is '; 
      this.dialogMessage += this.dcbStatus == 'T' ? 'temporarily closed.' : 'closed.';
      this.successDiag.open();
    }else{
      if(this.isPrinted){
        /*window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_AR' + '&userId=' + 
                      this.ns.getCurrentUser() + '&tranId=' + this.arInfo.tranId, '_blank');
        this.printMdl.openNoClose();*/
        this.reprintMdl.openNoClose();
      }else{
        /*this.loading = true;
        this.retrieveMtnAcitArSeries();*/
        this.approvalCd = 'AC001';
        this.ms.getMtnApprovalFunction(this.approvalCd).subscribe(
          (data:any)=>{
            if(data.approverFn.map(a=>{return a.userId}).includes(this.ns.getCurrentUser())){
              //User has the authority to print AR
              this.loading = true;
              this.retrieveMtnAcitArSeries();
            }else{
              //User has no authority. Open Override Login
              this.overrideLogin.getApprovalFn();
              this.overrideLogin.overrideMdl.openNoClose();
            }
          }
        );
      }
    }
  }

  toPrintAr(auth){
    if(auth){
      this.loading = true;
      this.retrieveMtnAcitArSeries();
    }
  }

  reprintMethod(isReprint?){
    this.printLoading = true;
    if(this.printMethod == '1'){
      window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_AR' + '&userId=' + 
                            this.ns.getCurrentUser() + '&tranId=' + this.arInfo.tranId, '_blank');
      //this.printMdl.openNoClose();
      if(isReprint == undefined){
        this.successPrintMdl.openNoClose();
      }else{
        this.reprintMdl.closeModal();
        this.printLoading = false;
      }
    }else if(this.printMethod == '2'){
      if(this.selectedPrinter.length == 0){
        this.dialogIcon = 'info';
        this.dialogMessage = 'Please select a printer.';
        this.successDiag.open();
        this.printLoading = false;
      }else{
        let params = {
          reportName: 'ACITR_AR',
          tranId: this.arInfo.tranId,
          printerName: this.selectedPrinter,
          pageOrientation: 'PORTRAIT',
          paperSize: 'HALFLETTER'
        }
        this.ps.directPrint(params).subscribe(
          (data:any)=>{
            console.log(data);
            if(data.errorList.length == 0 && data.messageList.length != 0){
              if(isReprint == undefined){
                this.successPrintMdl.openNoClose();
                
              }else{
                this.reprintMdl.closeModal();  
                 this.printLoading = false;
              }
            }else{
              this.dialogIcon = 'error-message';
              this.dialogMessage = 'An error has occured. AR was not printed.';
              this.successDiag.open();
              this.printLoading = false;
            }
          }
        );
      }
      /*this.as.acitGenerateReport('ACITR_AR', this.arInfo.tranId).subscribe(
        (data:any)=>{
          var newBlob = new Blob([data as BlobPart], { type: "application/pdf" });
                       var downloadURL = window.URL.createObjectURL(data);
                       const iframe = document.createElement('iframe');
                       iframe.style.display = 'none';
                       iframe.src = downloadURL;
                       document.body.appendChild(iframe);
                       iframe.contentWindow.print();
                       console.log(this.reprintMdl)
                       if(isReprint == undefined){
                         this.printStatus();
                       }else{
                         this.reprintMdl.closeModal();  
                          this.printLoading = false;
                       }
        },
        (error)=>{
          console.log(error);
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'An error has occured. AR was not printed.';
          this.successDiag.open();
          this.printLoading = false;
        });*/
    }
  }

  updateArStatus(){
    if(!this.isPrinted){
      this.loading = true;
      //Save Ar Entry first
      //if(this.arInfo.arNo === null || (this.arInfo.arNo !== null && this.arInfo.arNo.length === 0)){
        this.arInfo.arNo = parseInt(this.generatedArNo);
        console.log(this.arInfo.arNo);
      //}
      this.save(undefined, true);
      /*window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_AR' + '&userId=' + 
                      this.ns.getCurrentUser() + '&tranId=' + this.arInfo.tranId, '_blank');*/
      
    }
  }

  //ALL RETRIEVALS FROM MAINTENANCE IS HERE
  retrievePaymentType(){
    this.paymentTypes = [];
    this.ms.getMtnAcitTranType('AR',null,null,null,null,'Y').subscribe(
      (data:any)=>{
        if(data.tranTypeList.length !== 0){
          data.tranTypeList = data.tranTypeList.filter(a=>{return a.tranTypeCd !== 0});
          this.paymentTypes = data.tranTypeList;
          this.arInfo.tranTypeCd = this.paymentTypes.filter(a=>{return a.autoTag == 'Y'}).length == 0 ? '' : this.paymentTypes.filter(a=>{return a.autoTag == 'Y'})[0].tranTypeCd;
        }
      }
    );
  }

  retrieveCurrency(){
    this.currencies = [];
    this.passData.opts[1].vals = [];
    this.passData.opts[1].prev = [];
    this.ms.getMtnCurrency('','Y', this.arDate.date).subscribe(
      (data:any)=>{
        console.log('currencies first');
        if(data.currency.length !== 0){
          for(var i of data.currency){
            if(this.isAdd && 'PHP' === i.currencyCd){
              this.selectedCurrency = i.currencyCd;
              this.arInfo.currCd = i.currencyCd;
              this.arInfo.currRate = i.currencyRt;
              this.passData.nData.currCd = i.currencyCd;
              this.passData.nData.currRate = i.currencyRt;
            }
            this.currencies.push({currencyCd: i.currencyCd, currencyRt: i.currencyRt});
            this.passData.opts[1].vals.push(i.currencyCd);
            this.passData.opts[1].prev.push(i.currencyCd);
          }
        }
        setTimeout(()=>{
          $('.rate').focus().blur();
        },0);
      }
    );
  }

  retrieveMtnBank(){
    
    //this.banks = [];
    this.passData.opts[2].vals = [];
    this.passData.opts[2].prev = [];
    this.ms.getMtnBank(null,null,'Y', null).subscribe(
      (data:any)=>{
        if(data.bankList.length !== 0){
          for(var i of data.bankList){
            //this.banks.push(i);
            this.passData.opts[2].vals.push(i.bankCd);
            this.passData.opts[2].prev.push(i.officialName);
          }
          //this.banks = data.bankList;
        }
      }
    );
  }

  retrieveDCBBanks(){
    this.banks = [];
    this.ms.getMtnBank(null,null, 'Y', 'Y').subscribe(
      (data:any)=>{
        if(data.bankList.length !== 0){
          this.banks = data.bankList;
        }
      }
    );
  }

  retrieveMtnBankAcct(){
    this.bankAccts = [];
    this.ms.getMtnBankAcct(this.selectedBank.bankCd,null,null,'Y').subscribe(
        (data:any)=>{
          if(data.bankAcctList.length !== 0){
            this.bankAccts = data.bankAcctList;
            this.bankAccts = this.bankAccts.filter(a=>{return a.bankCd == this.selectedBank.bankCd && a.currCd == this.selectedCurrency && a.acSeGlDepNo === null && a.acItGlDepNo !== null });
          }
          if(this.bankAccts.length == 1){
            this.selectedBankAcct = this.bankAccts[0];
            this.arInfo.dcbBankAcct = this.selectedBankAcct.bankAcctCd;
            this.arInfo.dcbBankAcctNo = this.selectedBankAcct.accountNo;
          }
          if(this.bankAccts.map(a=>{return a.accountNo}).indexOf(this.selectedBankAcct.accountNo) == -1){
            this.arInfo.dcbBankAcct = '';
            this.arInfo.dcbBankAcctNo = '';
            this.selectedBankAcct.bankAcctCd = '';
            this.selectedBankAcct.accountNo = '';
          }
        }
    );
  }

  retrieveMtnAcitDCBNo(dcbYear?, dcbDate?){
    this.ms.getMtnAcitDCBNo(dcbYear,null,dcbDate,null).subscribe(
      (data:any)=>{
        /*if(data.dcbNoList.length === 0){
          this.dialogIcon = 'info';
          this.dialogMessage = 'DCB No. was not yet generated for the selected date. A DCB No. will be automatically generated.';
          this.successDiag.open();
          this.generateDCBNo(dcbYear,dcbDate);
        }else{*/
          if(data.dcbNoList[0].dcbNo == null){
            this.dialogIcon = 'info';
            this.dialogMessage = 'DCB No. was not yet generated for the selected date. A DCB No. will be automatically generated.';
            this.successDiag.open();
          }
          this.arInfo.dcbYear = data.dcbNoList[0].dcbYear == null ? dcbYear : data.dcbNoList[0].dcbYear;
          this.arInfo.dcbNo = data.dcbNoList[0].dcbNo == null ? data.dcbNoList[0].nextDcbNo : data.dcbNoList[0].dcbNo;
          this.dcbStatus   = data.dcbNoList[0].dcbStatus == null ? 'O' : data.dcbNoList[0].dcbStatus;
        //}
      }
    );
  }

  retrieveMtnDCBUser(){
    
    this.ms.getMtnDCBUser(this.ns.getCurrentUser()).subscribe(
       (data:any)=>{
         if(data.dcbUserList.length === 1){
           this.arInfo.dcbUserCd = data.dcbUserList[0].dcbUserCd;
           //set default dcb bank
           this.selectedBank.bankCd = data.dcbUserList[0].defaultArBank;
           this.selectedBank.officialName = data.dcbUserList[0].arBankName;
           this.arInfo.dcbBank = this.selectedBank.bankCd;
           this.arInfo.dcbBankName = this.selectedBank.officialName;

           //set default dcb bank acct
           this.retrieveMtnBankAcct();
           this.selectedBankAcct.bankCd = data.dcbUserList[0].defaultArBank;
           this.selectedBankAcct.bankAcctCd = data.dcbUserList[0].defaultArBankAcct;
           this.selectedBankAcct.accountNo = data.dcbUserList[0].arBankAcctNo;
           this.arInfo.dcbBankAcct = this.selectedBankAcct.bankAcctCd;
           this.arInfo.dcbBankAcctNo = this.selectedBankAcct.accountNo;
         }
       }
    );
  }

  generateDCBNo(dcbYear, dcbDate){
    let saveDCBNo: any[] = [];
    saveDCBNo.push({
      autoTag: 'Y',
      createDate: this.ns.toDateTimeString(0),
      createUser: this.ns.getCurrentUser(),
      dcbDate: dcbDate,
      dcbNo: '',
      dcbStatus: 'O',
      dcbYear: dcbYear,
      remarks: 'created from AR Entry',
      updateDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
    });

    this.ms.saveMtnAcitDCBNo([],saveDCBNo).subscribe(
      (data:any)=>{
        if(data.returnCode === 0){
          //when there's an error, pop something up idk
        }else{
          this.retrieveMtnAcitDCBNo(dcbYear,dcbDate);
        }
      },
      (error: any)=>{

      }
    );
  }

  retrieveMtnAcitArSeries(){
    if(this.arInfo.arNo == null || (this.arInfo.arNo != null && this.arInfo.arNo.length == 0)){
      this.ms.getMtnAcitArSeries('N', 1).subscribe(
        (data:any)=>{
          if(data.arSeriesList.length !== 0){
            this.generatedArNo = this.pad(data.arSeriesList[0].minArNo, 'arNo');
            this.printMdl.openNoClose();
          }else{
            this.dialogIcon = 'info';
            this.dialogMessage = 'No A.R. number is available for use.';
            this.successDiag.open();
          }
          this.loading = false;
        }
      );
    }else{
      this.generatedArNo = this.pad(this.arInfo.arNo, 'arNo');
      this.printMdl.openNoClose();
      this.loading = false;
    }
  }

  //VALIDATION STARTS HERE
  checkArInfoFields(): boolean{
    if(
       this.arDate.date.length === 0 || this.arDate.time.length === 0 ||
       this.arInfo.dcbYear.length === 0 || this.arInfo.dcbUserCd.length === 0 ||
       this.arInfo.dcbNo.length === 0 || this.arInfo.tranTypeCd.length === 0 ||
       this.arInfo.payeeNo.length === 0 || this.arInfo.payor.length === 0 ||
       this.arInfo.currCd.length === 0 || this.arInfo.arAmt.length === 0 ||
       this.arInfo.currRate.length === 0 || this.arInfo.particulars.length === 0 ||
       this.arInfo.dcbBank.length === 0 || this.arInfo.dcbBankAcct.length === 0
    ){
      return true;
    }
    return false;
  }

  checkPaytDtlFields(): boolean{
    for(var i of this.passData.tableData){
      if(i.paytMode.length === 0 || i.currCd.length === 0 || i.currRate.length === 0 ||
         i.paytAmt.length === 0){
         return true;
      }
    }
    return false;
  }

  bankVsArCurr(): boolean{
    if(this.selectedCurrency != this.dcbBankAcctCurrCd){
      return true;
    }
    return false;
  }

  paytModeValidation(): boolean{
    for(var i of this.passData.tableData){
      /*if(i.paytMode == 'BT' && (i.bank == null || i.bank.length === 0)){
        return true;
      }else */

      if(i.paytMode == 'CK' && (i.bank == null || i.bank.length === 0 || i.checkNo == null || i.checkNo.length === 0 || i.checkDate == null || i.checkDate.length === 0 || i.checkClass == null || i.checkClass.length === 0)){
        return true;
      }
    }
    return false;
  }

  arAmtEqualsPayt(): boolean{
    let totalPayts = 0;
    for(var i of this.passData.tableData){
      if(!i.deleted){
        totalPayts += i.paytAmt * i.currRate;
      }
    }
    if(this.arInfo.arAmt * this.arInfo.currRate !== totalPayts){
      console.log(this.arInfo.arAmt * this.arInfo.currRate);
      console.log(totalPayts);
      return true;
    }else{
      return false;
    }
  }

  arAmtEqualsArDtlPayt(): boolean{
    console.log(Math.round((this.arInfo.arAmt * this.arInfo.currRate)*100) / 100);
    console.log(this.arInfo.arDtlSum);
    if(this.arInfo.arDtlSum != Math.round((this.arInfo.arAmt * this.arInfo.currRate)*100) / 100){
      return true;
    }
    return false;
  }

  balanceAcctEntries(): boolean{
    if(this.arInfo.acctEntriesSum != 0 || this.arInfo.acctEntriesSumF != 0){
      return true;
    }
    return false;
  }

  dcbStatusCheck(): boolean {
    if(this.dcbStatus !== 'O'){
      return true;
    }
    return false;
  }

  //UTILITIES STARTS HERE

  getPrinters(){
    this.ps.getPrinters().subscribe(
      (data:any)=>{
        console.log(data);
        this.printers = data;
      }
    );
  }

  canPrintScreen(){
    this.ms.getMtnParameters('V', 'ALLOW_AR_PRINT_TO_SCREEN').subscribe(
        (data:any)=>{
          if(data.parameters.length !== 0){
            this.screenPrint = data.parameters[0].paramValueV == 'Y';
            this.printMethod = '2';
          }
        }
    );
  }

  canUploadAcctEntry(){
    this.ms.getMtnParameters('V', 'ACITAR_ACCTENTRY_UPLOAD').subscribe(
      (data:any)=>{
        if(data.parameters.length !== 0){
            this.canUpAcctEnt = data.parameters[0].paramValueV == 'Y';
         }
         else{
           this.canUpAcctEnt = false;
         }
      });
  }

  canReprintMethod(){
    this.ms.getMtnParameters('V', 'ALLOW_AR_REPRINTING').subscribe(
      (data:any)=>{
        if(data.parameters.length !== 0){
            this.canReprint = data.parameters[0].paramValueV == 'Y';
            console.log(this.canReprint);
         }
         else{
           this.canReprint = false;
         }
      });
  }

  changeTranType(data){
    //console.log(this.paymentTypes.map(a=>{return a.defaultParticulars}));
    this.arInfo.tranTypeCd = data;
    //this.arInfo.particulars = this.paymentTypes.map(a=>{return a.defaultParticulars}).indexOf(data)
    for(var i of this.paymentTypes){
      if(i.tranTypeCd == data){
        this.arInfo.particulars = i.defaultParticulars == null ? '' : i.defaultParticulars;
        break;
      }
    }
    if(data == 7){
      this.disablePayor = true;
      this.ms.getMtnPayee().subscribe(
        (data:any)=>{
          data.payeeList = data.payeeList.filter(a=>{return a.payeeName == 'Philippine Machinery Management Services Corporation'});
          this.arInfo.payeeClassCd = data.payeeList[0].payeeClassCd;
          this.arInfo.payeeNo = data.payeeList[0].payeeNo;
          this.arInfo.payor = data.payeeList[0].payeeName;
          this.arInfo.mailAddress = data.payeeList[0].mailAddress;
          this.arInfo.bussTypeCd = data.payeeList[0].bussTypeCd;
          this.arInfo.bussTypeName = data.payeeList[0].bussTypeName;
          this.arInfo.tin = data.payeeList[0].tin;
        }
      );
    }else{
      this.disablePayor = false;
      this.arInfo.payeeNo = '';
      this.arInfo.payor = '';
      this.arInfo.mailAddress = '';
      this.arInfo.bussTypeCd = '';
      this.arInfo.bussTypeName = '';
      this.arInfo.tin = '';
    }
  }

  compareCurrencyFn(c1: any, c2: any): boolean {
      return c1 && c2 ? c1.currencyCd === c2.currencyCd : c1 === c2;
  }

  compareBankFn(c1: any, c2: any): boolean {
      return c1.bankCd === c2.bankCd;
  }

  compareBankAcctFn(c1: any, c2: any): boolean {
      return c1 && c2 ? c1.bankAcctCd === c2.bankAcctCd : c1 === c2;
  }

  pad(str, field) {
    if(str === '' || str == null){
      return '';
    }else{
      if(field === 'arNo'){
        return String(str).padStart(this.arInfo.arNoDigits, '0');
      }else if(field === 'dcbSeqNo'){
        return String(str).padStart(3, '0');
      }else if(field === 'payeeNo'){
        return String(str).padStart(3, '0');
      }
    }
  }

  onClickDelete(event){
    this.paytDtlTbl.selected = [this.paytDtlTbl.indvSelect];
    this.paytDtlTbl.confirmDelete();
  }

  onRowClick(data){
    console.log(data);
    if(data !== null){
      this.passData.disableGeneric = false;
    }else{
      this.passData.disableGeneric = true;
    }
  }

  onTableDataChange(data){
    if(data.key !== 'remarks'){
      this.genAcctEnt = true;
    }
    console.log(data);
    if(data.key === 'paytMode'){
      for(var i = 0; i < data.length; i++){
        /*data[i].uneditable = [];
        data[i].bank = '';
        data[i].bankAcct = '';
        data[i].checkNo = '';
        data[i].checkDate = '';
        data[i].checkClass = '';
        data[i].uneditable = [];*/
        switch(data[i].paytMode){
          case 'BT':
            data[i].uneditable = ['checkNo', 'checkDate', 'checkClass'];
            data[i].checkNo = '';
            data[i].checkDate = '';
            data[i].checkClass = ''
            break;
          case 'CK':
            data[i].uneditable = [];
            data[i].checkClass = 'LC';
            break;
          case 'CA':
            data[i].bank = '';
            data[i].bankAcct = '';
            data[i].checkNo = '';
            data[i].checkDate = '';
            data[i].checkClass = '';
            data[i].uneditable = ['bank', 'bankAcct', 'checkNo', 'checkDate', 'checkClass'];
            break;
        }
        /*if(data[i].paytMode !== 'BT' && data[i].paytMode !== 'CK' && data[i].paytMode !== 'CR'){
          data[i].uneditable.push('bank');
          data[i].uneditable.push('bankAcct');
          data[i].bank = '';
          data[i].bankAcct = '';
        }
        if(data[i].paytMode !== 'CK'){
          //data[i].uneditable = []
          if(data[i].paytMode !== 'CR'){
            data[i].uneditable.push('checkNo');
          }
          data[i].uneditable.push('checkDate');
          data[i].uneditable.push('checkClass');
          data[i].checkNo = '';
          data[i].checkDate = '';
          data[i].checkClass = '';
          console.log('condition2');
        }*/
        console.log(data[i].uneditable);
        console.log(data[i].required);
        this.paytDtlTbl.refreshTable();
      }
    }
    this.passData.tableData = data;
    this.paytDtlTbl.refreshTable();
  }

  setDefaultValues(){
    this.banks = [];
    this.bankAccts = [];
    this.paymentTypes = [];
    var sub$ = forkJoin(this.ms.getMtnDCBUser(this.ns.getCurrentUser()),
                        this.ms.getMtnBank(null,null, 'Y'),
                        this.ms.getMtnBankAcct(),
                        this.ms.getMtnParameters('N', 'AR_NO_DIGITS'),
                        this.ms.getAcitTranType('AR',null,null,null,null,'Y')).pipe(map(([dcb, bank, bankAcct, arNoDigits, paymentType]) => { return { dcb, bank, bankAcct, arNoDigits, paymentType }; }));
    this.forkSub = sub$.subscribe(
      (data:any)=>{
           let paymentType = data.paymentType;
           if(paymentType.tranTypeList.length !== 0){
             paymentType.tranTypeList = paymentType.tranTypeList.filter(a=>{return a.tranTypeCd !== 0});
             this.paymentTypes = paymentType.tranTypeList;
             this.arInfo.tranTypeCd = this.paymentTypes.filter(a=>{return a.autoTag == 'Y'}).length == 0 ? '' : this.paymentTypes.filter(a=>{return a.autoTag == 'Y'})[0].tranTypeCd;
             console.log('TRAN_TYPE_CD => ' + this.arInfo.tranTypeCd);
           }

           this.arInfo.dcbUserCd = data.dcb.dcbUserList[0].dcbUserCd;
           this.arInfo.arNoDigits = parseInt(data.arNoDigits.parameters[0].paramValueN);
        //set default dcb bank
           this.selectedBank.bankCd = data.dcb.dcbUserList[0].defaultArBank;
           this.selectedBank.officialName = data.dcb.dcbUserList[0].arBankName;
           this.arInfo.dcbBank = this.selectedBank.bankCd;
           this.arInfo.dcbBankName = this.selectedBank.officialName;
        //set default dcb bank account
           this.selectedBankAcct.bankCd = data.dcb.dcbUserList[0].defaultArBank;
           this.selectedBankAcct.bankAcctCd = data.dcb.dcbUserList[0].defaultArBankAcct;
           this.selectedBankAcct.accountNo = data.dcb.dcbUserList[0].arBankAcctNo;
           this.arInfo.dcbBankAcct = this.selectedBankAcct.bankAcctCd;
           this.arInfo.dcbBankAcctNo = this.selectedBankAcct.accountNo;

           //bank
           if(data.bank.bankList.length !== 0){
             this.passData.opts[2].vals = [];
             this.passData.opts[2].prev = [];
             for(var i of data.bank.bankList){
               //this.banks.push(i);
               this.passData.opts[2].vals.push(i.bankCd);
               this.passData.opts[2].prev.push(i.officialName);
             }
             this.banks = data.bank.bankList.filter(a=>{return a.dcbTag == 'Y'});
           }
           //bankAcct
           if(data.bankAcct.bankAcctList.length !== 0){
               this.bankAccts = data.bankAcct.bankAcctList.filter(a=>{return a.bankCd == this.selectedBank.bankCd && a.currCd == this.selectedCurrency && a.acSeGlDepNo === null && a.acItGlDepNo !== null && a.dcbTag == 'Y'});
               if(this.bankAccts.length == 1){
                 this.selectedBankAcct = this.bankAccts[0];
                 this.arInfo.dcbBankAcct = this.selectedBankAcct.bankAcctCd;
                 this.arInfo.dcbBankAcctNo = this.selectedBankAcct.accountNo;
               }
               if(this.bankAccts.map(a=>{return a.accountNo}).indexOf(this.selectedBankAcct.accountNo) == -1){
                 this.arInfo.dcbBankAcct = '';
                 this.arInfo.dcbBankAcctNo = '';
                 this.selectedBankAcct.bankAcctCd = '';
                 this.selectedBankAcct.accountNo = '';
               }
           }
           this.loading = false;
      },
      (error: any)=>{
        console.log('error');
      }
    );
  }


upload(){
    this.upAcctEntMdl.openNoClose();
  }

  //open file box
  openFile(){
    $('#upload').trigger('click');
  }

//validate file to be uploaded
  validateFile(event){
    console.log(event.target.files);
    var validate = '';
    validate = this.up.validateFiles(event);

    if(validate.length !== 0 ){
      this.acctEntryFile = undefined;
      this.fileName = '';
      this.dialogIcon = 'error-message';
      this.dialogMessage = validate;
      this.successDiag.open();
    }else{
      this.acctEntryFile = event;
      this.fileName = event.target.files[0].name;
    }
  }

//upload accounting entries
uploadAcctEntries(){
  var result = '';
  this.emitMessage = '';
   if(this.acctEntryFile == undefined){
     this.dialogIcon = 'info';
     this.dialogMessage = 'No file selected.';
     this.successDiag.open();
   }else{
     this.uploadLoading = true;
     this.up.uploadMethod(this.acctEntryFile, 'acct_entries', 'ACIT', 'AR', this.arInfo.tranId);
     /*setTimeout(()=>{
       if(this.emitMessage.length === 0){
         this.dialogIcon = 'info';
         this.dialogMessage = 'Upload successfully.';
         this.fileName = '';
         this.acctEntryFile = undefined;
         this.successDiag.open();
       }else{
         this.dialogIcon = 'error-message';
         this.dialogMessage = this.emitMessage;
         this.successDiag.open();
       }

       this.acctEntryMdl.closeModal(); 
     }, 0);*/
   }
  }

  uploaderActivity(event){
    console.log(event);
    if(event instanceof Object){ //If theres an error regarding the upload
      this.dialogIcon = 'error-message';
     this.dialogMessage = event.message;
     this.successDiag.open();
     this.uploadLoading = false;
    }else{
      if(event.toUpperCase() == 'UPLOAD DONE'){
            this.uploadLoading = false;
        }else if(event.toUpperCase() == 'SUCCESS'){
          this.dialogIcon = 'info';
          this.dialogMessage = 'Upload successfully.';
          this.fileName = '';
          this.acctEntryFile = undefined;
          this.successDiag.open();
          this.uploadLoading = false;
          this.upAcctEntMdl.closeModal();
        }
    }
  }


}
