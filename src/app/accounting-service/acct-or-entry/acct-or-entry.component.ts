import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-acct-or-entry',
  templateUrl: './acct-or-entry.component.html',
  styleUrls: ['./acct-or-entry.component.css']
})
export class AcctOrEntryComponent implements OnInit {
@ViewChild('paytDtl') paytDtlTbl: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(LovComponent) lov: LovComponent;
  @ViewChild('cancelMdl') cancelMdl: ModalComponent;
  @ViewChild('printModal') printMdl: ModalComponent;
  @ViewChild("myForm") form: any;

  passData: any = {
        tableData: [],
        tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Bank Account No.','Check No.','Check Date','Check Class', 'Remarks'],
        dataTypes: ['reqSelect','text','percent','reqCurrency','reqSelect','text','reqTxt','reqDate','reqSelect', 'text'],
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
                   orNo: null,
                   payor: null,
                   orDate: null,
                   paymentType: null,
                   status: null,
                   particulars: null,
                   amount: null
                 };
  @Input() emittedValue: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() disableTab: EventEmitter<any> = new EventEmitter();
  @Output() emitOrInfo: EventEmitter<any> = new EventEmitter();

  sub: any;
  forkSub: any;
  isAdd: boolean = false;
  cancelFlag: boolean = false;
  isCancelled: boolean = false;
  dcbBankAcctCurrCd: string = '';
  disablePayor: boolean = false;
  isPrinted: boolean = false;
  loading: boolean = false;

  dialogIcon: string = '';
  dialogMessage: string = '';
  dcbStatus: string = '';

  orInfo: any = {
    tranId: '',
    tranClass: 'OR',
    orType: 'VAT',
    orNo: '',
    formattedOrNo: '',
    orNoDigits: '',
    orDate: '',
    orStatus: '',
    tranStat: '',
    orStatDesc: 'New',
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
    orAmt: '',
    currRate: '',
    particulars: '',
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: '',
    rstrctTranUp: '',
    orDtlSum: '',
    acctEntriesSum: '',
    allocTag: 'N'
  }

  orDate: any = {
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

  selectedCurrency: string = 'PHP';

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

  constructor(private route: ActivatedRoute, private as: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.loading = true;
    setTimeout(()=>{this.disableTab.emit(true);},0);
    this.retrievePaymentType();
    //this.retrieveCurrency();
    var tranId;
    var orNo;
    this.onChange.emit({ type: this.orInfo.tranTypeCd });
    this.sub = this.route.params.subscribe(
       data=>{
         if('add' === data['action'].trim()){
           this.isAdd = true;
         }else{
           this.isAdd = false;
           let params = JSON.parse(data['slctd']);
           tranId = params.tranId;
           orNo = params.orNo;
           if(params.status === 'Cancelled' || params.status === 'Deleted'){
             this.isCancelled = true;
             this.passData.addFlag = false;
             this.passData.genericBtn = undefined;
             this.passData.uneditable = [true,true,true,true,true,true,true,true,true];
             this.paytDtlTbl.refreshTable();
           }         
         }
       }
    );
    //NECO PLEASE OPTIMIZE THIS, THIS IS NOT OPTIMIZED -neco also
    //Aug 8, 2019 Thank you for optimizing 
    if(!this.isAdd){
      this.retrieveOrEntry(tranId, orNo);
    }else{  //edit
      if(this.emittedValue !== undefined){
        this.retrieveOrEntry(this.emittedValue.tranId, this.emittedValue.orNo);
        this.isAdd = false;
      }else{ //add
        //this.retrieveMtnBank();
        this.retrieveMtnAcseDCBNo(new Date().getFullYear(), this.ns.toDateTimeString(0));
        //this.retrieveMtnDCBUser();
        this.retrieveCurrency();
        this.setDefaultValues();
        this.orDate.date = this.ns.toDateTimeString(0).split('T')[0];
        this.orDate.time = this.ns.toDateTimeString(0).split('T')[1];
      }
    }
    if(this.emittedValue !== undefined && this.emittedValue.orStatus === 'X'){
      this.isCancelled = true;
      this.passData.addFlag = false;
      this.passData.genericBtn = undefined;
      this.passData.uneditable = [true,true,true,true,true,true,true,true,true];
      this.paytDtlTbl.refreshTable();
    }
  }

  newOr(){
    this.loading = true;
    this.isAdd = true;
    this.disableTab.emit(true);
    this.retrieveMtnAcseDCBNo(new Date().getFullYear(), this.ns.toDateTimeString(0));
    this.setDefaultValues();
    //this.retrieveMtnDCBUser();
    this.orDate.date = this.ns.toDateTimeString(0).split('T')[0];
    this.orDate.time = this.ns.toDateTimeString(0).split('T')[1];
    this.isCancelled = false;
    this.passData.uneditable = [];
    this.passData.addFlag = true;
    this.passData.genericBtn = 'Delete';
    this.paytDtlTbl.refreshTable();
    this.orInfo = {
      tranId: '',
      tranClass: 'OR',
      orType: 'VAT',
      orNo: '',
      orDate: '',
      orStatus: '',
      tranStat: '',
      orStatDesc: 'New',
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
      orAmt: '',
      currRate: '',
      particulars: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
      cedingId: '',
      bussTypeName: '',
      rstrctTranUp: '',
      orDtlSum: '',
      acctEntriesSum: '',
      allocTag: ''
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
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    if(this.forkSub !== undefined){
      this.forkSub.unsubscribe();
    }
  }

  openLOV(type){
    if(type === 'payor'){
      this.passLov.selector = 'payee';
      this.passLov.payeeClassCd = null;
    }else if(type === 'business'){
      this.passLov.selector = 'mtnBussType';
      this.passLov.activeTag = 'Y';
    }
    this.lov.openLOV();
  }

  openCancelModal(){
    this.cancelMdl.openNoClose();
  }

  cancelOr(){
    let params: any = {
      tranId: this.orInfo.tranId,
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0)
    };
    this.as.cancelOr(params).subscribe(
      (data: any)=>{
        if(data.returnCode !== 0){
          this.isCancelled = true;
          this.dialogIcon = 'success';
          this.successDiag.open();
          this.passData.addFlag = false;
          this.passData.genericBtn = undefined;
          this.passData.uneditable = [true,true,true,true,true,true,true,true,true];
          this.retrieveOrEntry(this.orInfo.tranId, this.orInfo.orNo);
          this.paytDtlTbl.refreshTable();
        }
      }
    );
  }

  tabController(event) {
    this.onChange.emit({ type: this.orInfo.tranTypeCd });
  }

  changeCurrency(data){
    this.selectedCurrency = data;
    this.passData.nData.currCd = data;
    this.orInfo.currCd = data;
    for(var i of this.currencies){
      if(i.currencyCd == data){
        this.orInfo.currRate = i.currencyRt;
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
      this.passData.tableData[j].currRate = this.orInfo.currRate;
      this.passData.tableData[j].edited = true;
    }
    this.paytDtlTbl.refreshTable();
    this.retrieveMtnBankAcct();
  }

  changeCurrencyRt(){
    for(var i = 0; i < this.passData.tableData.length; i++){
      this.passData.tableData[i].currRate = this.orInfo.currRate;
      this.passData.nData.currRate = this.orInfo.currRate;
      this.passData.tableData[i].edited = true;
    }
    this.paytDtlTbl.refreshTable();
  }

  changeDcbBank(data){
    this.selectedBank = data;
    this.orInfo.dcbBank = data.bankCd;
    this.orInfo.dcbBankName = data.officialName;
    this.retrieveMtnBankAcct();
  }

  changeDcbBankAcct(data){
    this.selectedBankAcct = data;
    this.orInfo.dcbBankAcct = data.bankAcctCd;
    this.orInfo.dcbBankAcctNo = data.accountNo;
    this.dcbBankAcctCurrCd = data.currCd;
    console.log(data.currCd);
  }

  changeOrAmt(data){
    this.orInfo.orAmt = (parseFloat(data.toString().split(',').join('')));
  }

  setLov(data){
    console.log(data);
    if(data.selector === 'payee'){
      this.orInfo.payeeNo = data.data.payeeNo;
      this.orInfo.payeeClassCd = data.data.payeeClassCd;
      this.orInfo.payor = data.data.payeeName;
      this.orInfo.tin = data.data.tin;
      this.orInfo.bussTypeCd = data.data.bussTypeCd;
      this.orInfo.mailAddress = data.data.mailAddress;
      this.orInfo.cedingId = data.data.cedingId;
      this.orInfo.bussTypeName = data.data.bussTypeName;
      this.form.control.markAsDirty();
      setTimeout(()=>{
        $('.payor').focus().blur();
      }, 0);
    }else if(data.selector === 'mtnBussType'){
      this.orInfo.bussTypeCd = data.data.bussTypeCd;
      this.orInfo.bussTypeName = data.data.bussTypeName;
      this.form.control.markAsDirty();
      setTimeout(()=>{
        $('.business').focus().blur();
      }, 0);
    }
    
  }

  retrieveOrEntry(tranId, orNo){
    var sub$ = forkJoin(this.as.getAcseOrEntry(tranId, orNo),
                        this.ms.getMtnBank(null,null,'Y',null),
                        this.ms.getMtnBankAcct(),
                        this.ms.getMtnCurrency('', 'Y', this.orDate.date)).pipe(map(([or, bank, bankAcct, curr]) => { return { or, bank, bankAcct, curr }; }));
    this.forkSub = sub$.subscribe(
      (forkData:any)=>{
        console.log('arEntry first');
        let data = forkData.or;
        let bankData = forkData.bank;
        let bankAcctData = forkData.bankAcct;
        let curr = forkData.curr;
        console.log(data);
        //ar
        if(data.or !== null){
          this.orInfo.tranId         = data.orEntry.tranId;
          this.orInfo.orType         = data.orEntry.orType;
          this.orInfo.orNo           = this.pad(data.orEntry.orNo, 'orNo');
          this.orInfo.formattedOrNo  = data.orEntry.formattedOrNo;
          this.orInfo.orNoDigits     = data.orEntry.orNoDigits;
          this.orInfo.orDate         = this.ns.toDateTimeString(data.orEntry.orDate);
          this.orDate.date           = this.orInfo.orDate.split('T')[0];
          this.orDate.time           = this.orInfo.orDate.split('T')[1];
          this.orInfo.orStatus       = data.orEntry.orStatus;
          this.orInfo.tranStat       = data.orEntry.tranStat;
          this.orInfo.orStatDesc     = data.orEntry.tranStat == 'P' ? data.orEntry.tranStatDesc : data.orEntry.orStatDesc;
          this.orInfo.dcbYear        = data.orEntry.dcbYear;
          this.orInfo.dcbUserCd      = data.orEntry.dcbUserCd;
          this.orInfo.dcbNo          = data.orEntry.dcbNo;
          this.orInfo.dcbStatus      = data.orEntry.dcbStatus;
          this.dcbStatus             = data.orEntry.dcbStatus;
          this.orInfo.dcbBank        = data.orEntry.dcbBank;
          this.orInfo.dcbBankName    = data.orEntry.dcbBankName;
          this.orInfo.dcbBankAcct    = data.orEntry.dcbBankAcct;
          this.orInfo.dcbBankAcctNo  = data.orEntry.dcbBankAcctNo;
          this.orInfo.refNo          = data.orEntry.refNo;
          this.orInfo.tranTypeCd     = data.orEntry.tranTypeCd;
          this.orInfo.tranTypeName   = data.orEntry.tranTypeName;
          this.orInfo.prNo           = data.orEntry.prNo;
          this.orInfo.prDate         = this.ns.toDateTimeString(data.orEntry.prDate);
          this.prDate.date           = this.orInfo.prDate.split('T')[0];
          this.prDate.time           = this.orInfo.prDate.split('T')[1];
          this.orInfo.prPreparedBy   = data.orEntry.prPreparedBy;
          this.orInfo.payeeNo        = data.orEntry.payeeNo;
          this.orInfo.payeeClassCd   = data.orEntry.payeeClassCd;
          this.orInfo.payor          = data.orEntry.payor;
          this.orInfo.mailAddress    = data.orEntry.mailAddress;
          this.orInfo.bussTypeCd     = data.orEntry.bussTypeCd;
          this.orInfo.tin            = data.orEntry.tin;
          this.orInfo.refCd          = data.orEntry.refCd;
          this.orInfo.currCd         = data.orEntry.currCd;
          this.orInfo.orAmt          = data.orEntry.orAmt;
          this.orInfo.currRate       = data.orEntry.currRate;
          this.orInfo.particulars    = data.orEntry.particulars;
          this.orInfo.createUser     = data.orEntry.createUser;
          this.orInfo.createDate     = this.ns.toDateTimeString(data.orEntry.createDate);
          this.orInfo.updateUser     = data.orEntry.updateUser;
          this.orInfo.updateDate     = this.ns.toDateTimeString(data.orEntry.updateDate);
          this.orInfo.cedingId       = data.orEntry.cedingId;
          this.orInfo.bussTypeName   = data.orEntry.bussTypeName;
          this.orInfo.rstrctTranUp   = data.orEntry.rstrctTranUp;
          this.orInfo.orDtlSum       = data.orEntry.orDtlSum;
          this.orInfo.acctEntriesSum = data.orEntry.acctEntriesSum;
          this.selectedCurrency       = data.orEntry.currCd;
          if(this.orInfo.orStatDesc.toUpperCase() === 'DELETED' || this.orInfo.orStatDesc.toUpperCase() === 'CANCELED'){
          //if(this.orInfo.orStatDesc.toUpperCase() !== 'NEW'){
            //this.passData.dataTypes = ['select','select','percent','currency','select','text','text','date','select'];
            this.passData.addFlag = false;
            this.passData.genericBtn = undefined;
            this.passData.uneditable = [true,true,true,true,true,true,true,true,true, true];
            this.isCancelled = true;
          }else if(this.orInfo.orStatDesc.toUpperCase() === 'PRINTED' || this.orInfo.orStatDesc.toUpperCase() === 'POSTED'){
            this.passData.addFlag = false;
            this.passData.genericBtn = undefined;
            this.passData.uneditable = [true,true,true,true,true,true,true,true,true, true];
            this.isPrinted = true;
          }

          if(this.orInfo.tranTypeCd == 7){
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
                this.orInfo.currCd = l.currencyCd;
                this.orInfo.currRate = l.currencyRt;
              }
              this.currencies.push({currencyCd: l.currencyCd, currencyRt: l.currencyRt});
              this.passData.opts[1].vals.push(l.currencyCd);
              this.passData.opts[1].prev.push(l.currencyCd);
            }
          }
          console.log(data.orEntry.paytDtl);
          //this.passData.tableData          = data.orEntry.paytDtl;
          //tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Bank Account No.','Check No.','Check Date','Check Class', 'Remarks'],
          //dataTypes: ['reqSelect','reqSelect','reqPercent','reqCurrency','reqSelect','reqTxt','reqTxt','reqDate','reqSelect', 'text'],
          this.passData.tableData = [];
          for(var i of data.orEntry.paytDtl){
            i.uneditable = [];
            if(i.paytMode !== 'BT' && i.paytMode !== 'CK' && i.paytMode !== 'CR'){
              i.uneditable.push('bank');
              i.uneditable.push('bankAcct');
              this.passData.dataTypes[4] = 'select';
              this.passData.dataTypes[5] = 'text'; 
            }
            if(i.paytMode !== 'CK'){
              if(i.paytMode !== 'CR'){
                i.uneditable.push('checkNo');
                this.passData.dataTypes[5] = 'text'; 
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
          this.selectedBank.bankCd         = data.orEntry.dcbBank;
          this.selectedBankAcct.bankAcctCd = data.orEntry.dcbBankAcct;
          this.paytDtlTbl.refreshTable();
          this.onChange.emit({ type: this.orInfo.tranTypeCd });
          this.disableTab.emit(false);
          let orDetailParams = {
            tranId: this.orInfo.tranId,
            formattedOrNo: this.orInfo.formattedOrNo,
            orNoDigits: this.orInfo.orNoDigits,
            orNo: this.orInfo.orNo,
            orStatus: this.orInfo.orStatus,
            orStatDesc: this.orInfo.orStatDesc,
            orDate: this.orInfo.orDate,
            dcbNo: this.orInfo.dcbYear+'-'+this.orInfo.dcbUserCd+'-'+this.pad(this.orInfo.dcbNo, 'dcbSeqNo'),
            tranTypeCd: this.orInfo.tranTypeCd,
            tranTypeName: this.orInfo.tranTypeName,
            currCd: this.orInfo.currCd,
            currRate: this.orInfo.currRate,
            orAmt: this.orInfo.orAmt,
            payeeNo: this.orInfo.payeeNo,
            payor: this.orInfo.payor,
            createUser: this.orInfo.createUser,
            createDate: this.orInfo.createDate,
            updateUser: this.orInfo.updateUser,
            updateDate: this.orInfo.updateDate,
            cedingId: this.orInfo.payeeNo,
            bussTypeName: this.orInfo.bussTypeName,
            refCd: this.orInfo.refCd,
            from: 'or'
          }
          this.emitOrInfo.emit(orDetailParams);

          setTimeout(()=>{
            $('#orNo').focus();
            $('#orNo').blur();
            $('#orAmt').focus();
            $('#orAmt').blur();
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
            this.bankAccts = bankAcctData.bankAcctList.filter(a=>{return a.bankCd == this.selectedBank.bankCd && a.currCd == this.selectedCurrency && a.acSeGlDepNo !== null && a.acItGlDepNo === null});
            if(this.bankAccts.map(a=>{return a.accountNo}).indexOf(this.orInfo.dcbBankAcctNo) == -1){
              this.orInfo.dcbBankAcct = '';
              this.orInfo.dcbBankAcctNo = '';
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
        this.loading = false;
      },
      (error: any)=>{
        console.log('error');
      }
    );
  }

  onClickSave(){
    if(this.checkOrInfoFields() || this.checkPaytDtlFields() || this.paytModeValidation() || this.passData.tableData.length === 0){ //empty required fields?
      this.dialogIcon = 'error';
      this.successDiag.open();
      $('.required').focus().blur();
      $('table input').focus().blur();
      $('table select').focus().blur();
    }
    /*else if(this.bankVsArCurr()){  //dcb bank account is not equal to selected ar currency?
      this.dialogIcon = 'info';
      this.dialogMessage = 'Allowable DCB Bank Account should match the AR Currency.';
      this.successDiag.open();
    }*/
    else if(this.orAmtEqualsPayt()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Total amount of payment details is not equal to the OR Amount.';
      this.successDiag.open();
    }else if(this.dcbStatusCheck()){

      this.dialogIcon = 'error-message';
      this.dialogMessage = 'O.R. cannot be saved. DCB No. is '; 
      this.dialogMessage += this.dcbStatus == 'T' ? 'temporarily closed.' : 'closed.';
      this.successDiag.open();
    }
    else{
      $('#confirm-save #modalBtn2').trigger('click');
    }
  }

  save(cancelFlag?){
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
    this.orInfo.orDate = this.orDate.date + 'T' + this.orDate.time;
    this.orInfo.prDate = this.prDate.date.length === 0 ? '' : this.prDate.date + 'T' + this.prDate.time;

    //prepare params
    let params: any = this.orInfo;
    params.tranDate = this.orInfo.orDate;
    params.tranClassNo = this.orInfo.orNo;
    params.tranStat = this.isAdd ? 'O' : this.orInfo.tranStat ;
    params.tranYear = new Date().getFullYear();
    params.orStatus = this.isAdd ? 'N' : this.orInfo.orStatus;
    params.createUser = this.ns.getCurrentUser();
    params.updateUser = this.ns.getCurrentUser();
    params.createDate = this.ns.toDateTimeString(0);
    params.updateDate = this.ns.toDateTimeString(0);
    params.delPaytDtl = this.deletedData;
    params.savePaytDtl = this.savedData;

    //save
    this.as.saveAcseOrEntry(params).subscribe(
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
          this.retrieveOrEntry(data.outTranId, '');
          this.paytDtlTbl.refreshTable();
          this.dialogIcon = 'success';
          this.successDiag.open();
          this.form.control.markAsPristine();
        }
      }
    );
  }

  print(){
    if(this.orAmtEqualsOrDtlPayt()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'OR cannot be printed. Total Payments in OR Details must be equal to OR Amount';
      this.successDiag.open();
    }else if(this.balanceAcctEntries()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'OR cannot be printed. Accounting Entries must have zero variance.';
      this.successDiag.open();
    }else{
      window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_AR' + '&userId=' + 
                      this.ns.getCurrentUser() + '&tranId=' + this.orInfo.tranId, '_blank');
      this.printMdl.openNoClose();
    }
  }

  updateOrStatus(){
    if(!this.isPrinted){
      let params: any = {
        tranId: this.orInfo.tranId,
        orNo: this.orInfo.orNo,
        updateUser: this.ns.getCurrentUser(),
        updateDate: this.ns.toDateTimeString(0)
      }
      this.as.printAr(params).subscribe(
        (data:any)=>{
          if(data.returnCode == 0){
            this.dialogIcon = 'error-message';
            this.dialogIcon = 'An error has occured when updating OR status';
          }else{
            this.retrieveOrEntry(this.orInfo.tranId, this.orInfo.orNo);
          }
        }
      );
    }
  }

  //ALL RETRIEVALS FROM MAINTENANCE IS HERE
  retrievePaymentType(){
    this.paymentTypes = [];
    this.ms.getMtnAcseTranType('OR',null,null,null,null,'Y').subscribe(
      (data:any)=>{
        if(data.tranTypeList.length !== 0){
          data.tranTypeList = data.tranTypeList.filter(a=>{return a.tranTypeCd !== 0});
          this.paymentTypes = data.tranTypeList;
        }
      }
    );
  }

  retrieveCurrency(){
    this.currencies = [];
    this.passData.opts[1].vals = [];
    this.passData.opts[1].prev = [];
    this.ms.getMtnCurrency('','Y', this.orDate.date).subscribe(
      (data:any)=>{
        console.log('currencies first');
        if(data.currency.length !== 0){
          for(var i of data.currency){
            if(this.isAdd && 'PHP' === i.currencyCd){
              this.selectedCurrency = i.currencyCd;
              this.orInfo.currCd = i.currencyCd;
              this.orInfo.currRate = i.currencyRt;
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
            this.bankAccts = this.bankAccts.filter(a=>{return a.bankCd == this.selectedBank.bankCd && a.currCd == this.selectedCurrency && a.acSeGlDepNo !== null && a.acItGlDepNo === null });
          }
          if(this.bankAccts.length == 1){
            this.selectedBankAcct = this.bankAccts[0];
            this.orInfo.dcbBankAcct = this.selectedBankAcct.bankAcctCd;
            this.orInfo.dcbBankAcctNo = this.selectedBankAcct.accountNo;
          }
          if(this.bankAccts.map(a=>{return a.accountNo}).indexOf(this.selectedBankAcct.accountNo) == -1){
            this.orInfo.dcbBankAcct = '';
            this.orInfo.dcbBankAcctNo = '';
            this.selectedBankAcct.bankAcctCd = '';
            this.selectedBankAcct.accountNo = '';
          }
        }
    );
  }

  retrieveMtnAcseDCBNo(dcbYear?, dcbDate?){
    this.ms.getMtnAcseDCBNo(dcbYear,null,dcbDate,null).subscribe(
      (data:any)=>{
        if(data.dcbNoList.length === 0){
          this.dialogIcon = 'info';
          this.dialogMessage = 'DCB No. was not yet generated for the selected date. A DCB No. will be automatically generated.';
          this.successDiag.open();
          this.generateDCBNo(dcbYear,dcbDate);
        }else{
          this.orInfo.dcbYear = data.dcbNoList[0].dcbYear;
          this.orInfo.dcbNo = data.dcbNoList[0].dcbNo;
          this.dcbStatus   = data.dcbNoList[0].dcbStatus;
        }
      }
    );
  }

  retrieveMtnDCBUser(){
    
    this.ms.getMtnDCBUser(this.ns.getCurrentUser()).subscribe(
       (data:any)=>{
         if(data.dcbUserList.length === 1){
           this.orInfo.dcbUserCd = data.dcbUserList[0].dcbUserCd;
           //set default dcb bank
           this.selectedBank.bankCd = data.dcbUserList[0].defaultOrBank;
           this.selectedBank.officialName = data.dcbUserList[0].orBankName;
           this.orInfo.dcbBank = this.selectedBank.bankCd;
           this.orInfo.dcbBankName = this.selectedBank.officialName;

           //set default dcb bank acct
           this.retrieveMtnBankAcct();
           this.selectedBankAcct.bankCd = data.dcbUserList[0].defaultOrBank;
           this.selectedBankAcct.bankAcctCd = data.dcbUserList[0].defaultOrBankAcct;
           this.selectedBankAcct.accountNo = data.dcbUserList[0].orBankAcctNo;
           this.orInfo.dcbBankAcct = this.selectedBankAcct.bankAcctCd;
           this.orInfo.dcbBankAcctNo = this.selectedBankAcct.accountNo;
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
      remarks: 'created from OR Entry',
      updateDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser()
    });

    this.ms.saveMtnAcseDCBNo([],saveDCBNo).subscribe(
      (data:any)=>{
        if(data.returnCode === 0){
          //when there's an error, pop something up idk
        }else{
          this.retrieveMtnAcseDCBNo(dcbYear,dcbDate);
        }
      },
      (error: any)=>{

      }
    );
  }

  //VALIDATION STARTS HERE
  checkOrInfoFields(): boolean{
    if(
       this.orDate.date.length === 0 || this.orDate.time.length === 0 ||
       this.orInfo.dcbYear.length === 0 || this.orInfo.dcbUserCd.length === 0 ||
       this.orInfo.dcbNo.length === 0 || this.orInfo.tranTypeCd.length === 0 ||
       this.orInfo.payeeNo.length === 0 || this.orInfo.payor.length === 0 ||
       this.orInfo.currCd.length === 0 || this.orInfo.orAmt.length === 0 ||
       this.orInfo.currRate.length === 0 || this.orInfo.particulars.length === 0 ||
       this.orInfo.dcbBank.length === 0 || this.orInfo.dcbBankAcct.length === 0
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
      if(i.paytMode == 'BT' && (i.bank == null || i.bankAcct == null || i.bank.length === 0 || i.bankAcct.length === 0)){
        return true;
      }else if(i.paytMode == 'CK' && (i.bank.length === 0 || i.checkNo.length === 0 || i.checkDate.length === 0 || i.checkClass.length === 0)){
        return true;
      }else if(i.paytMode == 'CR' && (i.bank.length === 0 || i.bankAcct.length === 0 || i.checkNo.length === 0)){
        return true;
      }
    }
    return false;
  }

  orAmtEqualsPayt(): boolean{
    let totalPayts = 0;
    for(var i of this.passData.tableData){
      if(!i.deleted){
        totalPayts += i.paytAmt * i.currRate;
      }
    }
    if(this.orInfo.orAmt * this.orInfo.currRate !== totalPayts){
      console.log(this.orInfo.orAmt * this.orInfo.currRate);
      console.log(totalPayts);
      return true;
    }else{
      return false;
    }
  }

  orAmtEqualsOrDtlPayt(): boolean{
    if(this.orInfo.orDtlSum != this.orInfo.orAmt * this.orInfo.currRate){
      return true;
    }
    return false;
  }

  balanceAcctEntries(): boolean{
    if(this.orInfo.acctEntriesSum != 0){
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

  changeTranType(data){
    //console.log(this.paymentTypes.map(a=>{return a.defaultParticulars}));
    this.orInfo.tranTypeCd = data;
    //this.orInfo.particulars = this.paymentTypes.map(a=>{return a.defaultParticulars}).indexOf(data)
    for(var i of this.paymentTypes){
      if(i.tranTypeCd == data){
        this.orInfo.particulars = i.defaultParticulars == null ? '' : i.defaultParticulars;
        break;
      }
    }
    if(data == 7){
      this.disablePayor = true;
      this.ms.getMtnPayee().subscribe(
        (data:any)=>{
          data.payeeList = data.payeeList.filter(a=>{return a.payeeName == 'Philippine Machinery Management Services Corporation'});
          this.orInfo.payeeClassCd = data.payeeList[0].payeeClassCd;
          this.orInfo.payeeNo = data.payeeList[0].payeeNo;
          this.orInfo.payor = data.payeeList[0].payeeName;
          this.orInfo.mailAddress = data.payeeList[0].mailAddress;
          this.orInfo.bussTypeCd = data.payeeList[0].bussTypeCd;
          this.orInfo.bussTypeName = data.payeeList[0].bussTypeName;
          this.orInfo.tin = data.payeeList[0].tin;
        }
      );
    }else{
      this.disablePayor = false;
      this.orInfo.payeeNo = '';
      this.orInfo.payor = '';
      this.orInfo.mailAddress = '';
      this.orInfo.bussTypeCd = '';
      this.orInfo.bussTypeName = '';
      this.orInfo.tin = '';
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
      if(field === 'orNo'){
        return String(str).padStart(this.orInfo.orNoDigits, '0');
      }else if(field === 'dcbSeqNo'){
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
    console.log(data);
    if(data.key === 'paytMode'){
      for(var i = 0; i < data.length; i++){
        data[i].uneditable = [];
        if(data[i].paytMode !== 'BT' && data[i].paytMode !== 'CK' && data[i].paytMode !== 'CR'){
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
        }
        console.log(data[i].uneditable);
        console.log(data[i].required);
        this.paytDtlTbl.refreshTable();
      }
    }else if(data.key === 'currCd'){
      for(var j = 0; j < data.length; j++){
        for(var k = 0; k < this.currencies.length; k++){
          if(data[j].currCd == this.currencies[k].currencyCd){
            data[j].currRate = this.currencies[k].currencyRt;
            data[j].paytAmt = data[j].currCd * data[j].currRate;
            break;
          }
        }
      }
    }else if(data.key === 'currRate'){
      for(var j = 0; j < data.length; j++){
      }
    }
    this.passData.tableData = data;
    //this.paytDtlTbl.refreshTable();
  }

  setDefaultValues(){
    this.banks = [];
    this.bankAccts = [];
    var sub$ = forkJoin(this.ms.getMtnDCBUser(this.ns.getCurrentUser()),
                        this.ms.getMtnBank(null,null, 'Y'),
                        this.ms.getMtnBankAcct(),
                        this.ms.getMtnParameters('N', 'OR_NO_DIGITS')).pipe(map(([dcb, bank, bankAcct, orNoDigits]) => { return { dcb, bank, bankAcct, orNoDigits }; }));
    this.forkSub = sub$.subscribe(
      (data:any)=>{
           this.orInfo.dcbUserCd = data.dcb.dcbUserList[0].dcbUserCd;
           this.orInfo.orNoDigits = parseInt(data.orNoDigits.parameters[0].paramValueN);
        //set default dcb bank
           this.selectedBank.bankCd = data.dcb.dcbUserList[0].defaultOrBank;
           this.selectedBank.officialName = data.dcb.dcbUserList[0].orBankName;
           this.orInfo.dcbBank = this.selectedBank.bankCd;
           this.orInfo.dcbBankName = this.selectedBank.officialName;
        //set default dcb bank account
           this.selectedBankAcct.bankCd = data.dcb.dcbUserList[0].defaultOrBank;
           this.selectedBankAcct.bankAcctCd = data.dcb.dcbUserList[0].defaultOrBankAcct;
           this.selectedBankAcct.accountNo = data.dcb.dcbUserList[0].orBankAcctNo;
           this.orInfo.dcbBankAcct = this.selectedBankAcct.bankAcctCd;
           this.orInfo.dcbBankAcctNo = this.selectedBankAcct.accountNo;

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
                 this.orInfo.dcbBankAcct = this.selectedBankAcct.bankAcctCd;
                 this.orInfo.dcbBankAcctNo = this.selectedBankAcct.accountNo;
               }
               if(this.bankAccts.map(a=>{return a.accountNo}).indexOf(this.selectedBankAcct.accountNo) == -1){
                 this.orInfo.dcbBankAcct = '';
                 this.orInfo.dcbBankAcctNo = '';
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

}
