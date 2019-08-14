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
  @ViewChild(ModalComponent) cancelMdl: ModalComponent;
  @ViewChild("myForm") form: any;

  passData: any = {
        tableData: [],
        tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Bank Account No.','Check/Card No.','Check Date','Check Class'],
        dataTypes: ['reqSelect','reqSelect','reqPercent','reqCurrency','reqSelect','reqNum','reqNum','reqDate','reqSelect'],
        paginateFlag: true,
        infoFlag: true,
        pageLength: 5,
        widths: [130,70,100,150,210,1,"auto",100,180],
        keys: ['paytMode', 'currCd', 'currRate', 'paytAmt', 'bank', 'bankAcct', 'checkNo', 'checkDate', 'checkClass'],
        uneditable: [false,false,false,false,false,false,false,false,false],
        pageID: 1,
        addFlag: true,
        genericBtn: 'Delete',
        nData: {
          paytMode: '',
          currCd: 'PHP',
          currRate: 1,
          paytAmt: 0,
          bank: '',
          bankAcct: '',
          checkNo: '',
          checkDate: '',
          checkClass: '',
          uneditable: ['bank', 'bankAcct', 'checkNo', 'checkDate', 'checkClass']
        },
        disableGeneric: true,
        opts:[
          {
            selector: 'paytMode',
            vals: ['BT', 'CA', 'CK', 'CR'],
            prev: ['Bank Transfer', 'Cash', 'Check', 'Credit Card']
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

  dialogIcon: string = '';
  dialogMessage: string = '';

  arInfo: any = {
    tranId: '',
    tranClass: 'AR',
    arNo: '',
    arDate: '',
    arStatus: '',
    arStatDesc: '',
    dcbYear: '',
    dcbUserCd: '',
    dcbNo: '',
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
    payeeNo: '1',
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
    payeeClassCd: 1
  };

  constructor(private route: ActivatedRoute, private as: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.retrievePaymentType();
    //this.retrieveCurrency();
    var tranId;
    var arNo;
    this.onChange.emit({ type: this.arInfo.tranTypeCd });
    this.sub = this.route.params.subscribe(
       data=>{
         if('add' === data['action'].trim()){
           this.isAdd = true;
         }else{
           this.isAdd = false;
           let params = JSON.parse(data['slctd']);
           tranId = params.tranId;
           arNo = params.arNo;
           if(params.status === 'Cancelled' || params.status === 'Deleted'){
             this.isCancelled = true;
             this.passData.uneditable = [true,true,true,true,true,true,true,true,true];
             this.paytDtlTbl.refreshTable();
           }         
         }
       }
    );
    //NECO PLEASE OPTIMIZE THIS, THIS IS NOT OPTIMIZED -neco also
    //Aug 8, 2019 Thank you for optimizing 
    if(!this.isAdd){
      this.retrieveArEntry(tranId, arNo);
    }else{  //edit
      if(this.emittedValue !== undefined){
        this.retrieveArEntry(this.emittedValue.tranId, this.emittedValue.arNo);
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

  newAr(){
    this.isAdd = true;
    this.disableTab.emit(true);
    this.retrieveMtnAcitDCBNo();
    this.setDefaultValues();
    //this.retrieveMtnDCBUser();
    this.arDate.date = this.ns.toDateTimeString(0).split('T')[0];
    this.arDate.time = this.ns.toDateTimeString(0).split('T')[1];
    this.isCancelled = false;
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
      arStatDesc: '',
      dcbYear: '',
      dcbUserCd: '',
      dcbNo: '',
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
      payeeNo: '1',
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
      bussTypeName: ''
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

  openPayorLOV(){
    this.passLov.selector = 'payee';
    if(this.arInfo.tranTypeCd == '5'){
      this.passLov.payeeClassCd = 3;
    }else{
      this.passLov.payeeClassCd = 1;
    }
    this.lov.openLOV();
  }

  openCancelModal(){
    this.cancelMdl.openNoClose();
  }

  cancelAr(){
    let params: any = {
      tranId: this.arInfo.tranId,
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0)
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

  changeCurrency(data){
    this.selectedCurrency = data;
    this.arInfo.currCd = data;
    for(var i of this.currencies){
      if(i.currencyCd == data){
        this.arInfo.currRate = i.currencyRt;
        setTimeout(()=>{
          $('.rate').focus().blur();
        },0);
        break;
      }
    }
    this.retrieveMtnBankAcct();
  }

  changeDcbBank(data){
    this.selectedBank = data;
    this.arInfo.dcbBank = data.bankCd;
    this.arInfo.dcbBankName = data.officialName;
    this.retrieveMtnBankAcct();
  }

  changeDcbBankAcct(data){
    this.selectedBankAcct = data;
    this.arInfo.dcbBankAcct = data.bankAcctCd;
    this.arInfo.dcbBankAcctNo = data.accountNo;
    this.dcbBankAcctCurrCd = data.currCd;
    console.log(data.currCd);
  }

  changeArAmt(data){
    this.arInfo.arAmt = (parseFloat(data.toString().split(',').join('')));
  }

  setLov(data){
    console.log(data);
    this.arInfo.payeeNo = data.data.payeeNo;
    this.arInfo.payor = data.data.payeeName;
    this.arInfo.tin = data.data.tin;
    this.arInfo.bussTypeCd = data.data.bussTypeCd;
    this.arInfo.mailAddress = data.data.mailAddress;
    this.arInfo.cedingId = data.data.cedingId;
    this.arInfo.bussTypeName = data.data.bussTypeName;
    this.form.control.markAsDirty();
    setTimeout(()=>{
      $('.payor').focus().blur();
    }, 0);
    
  }

  retrieveArEntry(tranId, arNo){
    var sub$ = forkJoin(this.as.getArEntry(tranId, arNo),
                        this.ms.getMtnBank(),
                        this.ms.getMtnBankAcct(),
                        this.ms.getMtnCurrency('', 'Y')).pipe(map(([ar, bank, bankAcct, curr]) => { return { ar, bank, bankAcct, curr }; }));
    this.forkSub = sub$.subscribe(
      (forkData:any)=>{
        console.log('arEntry first');
        let data = forkData.ar;
        let bankData = forkData.bank;
        let bankAcctData = forkData.bankAcct;
        let curr = forkData.curr;
        //ar
        if(data.ar !== null){
          this.arInfo.tranId         = data.ar.tranId;
          this.arInfo.arNo           = data.ar.arNo;
          this.arInfo.arDate         = this.ns.toDateTimeString(data.ar.arDate);
          this.arDate.date           = this.arInfo.arDate.split('T')[0];
          this.arDate.time           = this.arInfo.arDate.split('T')[1];
          this.arInfo.arStatus       = data.ar.arStatus;
          this.arInfo.arStatDesc     = data.ar.arStatDesc;
          this.arInfo.dcbYear        = data.ar.dcbYear;
          this.arInfo.dcbUserCd      = data.ar.dcbUserCd;
          this.arInfo.dcbNo          = data.ar.dcbNo;
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
          this.arInfo.payor          = data.ar.payor;
          this.arInfo.mailAddress    = data.ar.mailAddress;
          this.arInfo.bussTypeCd     = data.ar.bussTypeCd;
          this.arInfo.tin            = data.ar.tin;
          this.arInfo.refCd            = data.ar.refCd;
          this.arInfo.currCd         = data.ar.currCd;
          this.arInfo.arAmt          = data.ar.arAmt;
          this.arInfo.currRate       = data.ar.currRate;
          this.arInfo.particulars    = data.ar.particulars;
          this.arInfo.createUser     = data.ar.createUser;
          this.arInfo.createDate     = this.ns.toDateTimeString(data.ar.createDate);
          this.arInfo.updateUser     = data.ar.updateUser;
          this.arInfo.updateDate     = this.ns.toDateTimeString(data.ar.updateDate);
          this.arInfo.cedingId       = data.ar.cedingId;
          this.arInfo.bussTypeName   = data.ar.bussTypeName;
          this.arInfo.rstrctTranUp   = data.ar.rstrctTranUp;
          this.selectedCurrency       = data.ar.currCd;
          //currencies
          this.currencies = [];
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
          this.passData.tableData = [];
          for(var i of data.ar.paytDtl){
            i.uneditable = [];
            i.required = ['paytMode', 'currCd', 'currRate', 'paytAmt'];
            if(i.paytMode !== 'BT' && i.paytMode !== 'CK' && i.paytMode !== 'CR'){
              i.uneditable.push('bank');
              i.uneditable.push('bankAcct');
              i.required.push('bank');
              i.required.push('bankAcct');
            }
            if(i.paytMode !== 'CK'){
              if(i.paytMode !== 'CR'){
                i.uneditable.push('checkNo');
                i.required.push('checkNo');
              }
              i.uneditable.push('checkDate');
              i.uneditable.push('checkClass');
              i.required.push('checkDate');
              i.required.push('checkClass');

            }
            if(i.paytMode !== 'CR'){
              i.uneditable.push('checkNo');
              i.required.push('checkNo');
            }
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
            arNo: this.arInfo.arNo,
            arStatus: this.arInfo.arStatus,
            arStatDesc: this.arInfo.arStatDesc,
            arDate: this.arInfo.arDate,
            dcbNo: this.arInfo.dcbYear+'-'+this.arInfo.dcbUserCd+'-'+this.pad(this.arInfo.dcbNo, 'dcbSeqNo'),
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
            cedingId: this.arInfo.cedingId,
            bussTypeName: this.arInfo.bussTypeName,
            refCd: this.arInfo.refCd
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
            this.banks.push(i);
            this.passData.opts[2].vals.push(i.bankCd);
            this.passData.opts[2].prev.push(i.officialName);
          }
          this.banks = bankData.bankList;
        }
        //bankAcct
        if(bankAcctData.bankAcctList.length !== 0){
            this.bankAccts = bankAcctData.bankAcctList.filter(a=>{return a.bankCd == this.selectedBank.bankCd && a.currCd == this.selectedCurrency});
        }
        for(var i of this.bankAccts){
          if(i.bankAcctCd == this.selectedBankAcct.bankAcctCd){
            this.dcbBankAcctCurrCd = i.currCd;
            break;
          }
        }
        this.form.control.markAsPristine();
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
          this.savedData[this.savedData.length-1].checkDate = this.ns.toDateTimeString(this.savedData[this.savedData.length-1].checkDate);
      }
    }

    //set up dates
    this.arInfo.arDate = this.arDate.date + 'T' + this.arDate.time;
    this.arInfo.prDate = this.prDate.date.length === 0 ? '' : this.prDate.date + 'T' + this.prDate.time;

    //prepare params
    let params: any = this.arInfo;
    params.tranDate = this.arInfo.arDate;
    params.tranClassNo = this.arInfo.arNo;
    params.tranStat = 'O';
    params.tranYear = new Date().getFullYear();
    params.arStatus = 'N';
    params.createUser = this.ns.getCurrentUser();
    params.updateUser = this.ns.getCurrentUser();
    params.createDate = this.ns.toDateTimeString(0);
    params.updateDate = this.ns.toDateTimeString(0);
    params.delPaytDtl = this.deletedData;
    params.savePaytDtl = this.savedData;

    //save
    this.as.saveAcitArTrans(params).subscribe(
      (data:any)=>{
        if(data.returnCode === 0){
          if(data.errorList !== null || (data.errorList !== null && data.errorList.length !== 0)){
            this.dialogMessage = data.errorList[0].errorMessage;
            this.dialogIcon = 'error-message';
          }else{
            this.dialogIcon = 'error';
          }
          this.successDiag.open();
        }
        else{
          this.retrieveArEntry(data.outTranId, '');
          this.paytDtlTbl.refreshTable();
          this.dialogIcon = 'success';
          this.successDiag.open();
          this.form.control.markAsPristine();
        }
      }
    );
  }

  //ALL RETRIEVALS FROM MAINTENANCE IS HERE
  retrievePaymentType(){
    this.paymentTypes = [];
    this.ms.getMtnAcitTranType('AR').subscribe(
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
    this.ms.getMtnCurrency('','Y').subscribe(
      (data:any)=>{
        console.log('currencies first');
        if(data.currency.length !== 0){
          for(var i of data.currency){
            if(this.isAdd && 'PHP' === i.currencyCd){
              this.selectedCurrency = i.currencyCd;
              this.arInfo.currCd = i.currencyCd;
              this.arInfo.currRate = i.currencyRt;
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
    
    this.banks = [];
    this.passData.opts[2].vals = [];
    this.passData.opts[2].prev = [];
    this.ms.getMtnBank().subscribe(
      (data:any)=>{
        if(data.bankList.length !== 0){
          for(var i of data.bankList){
            this.banks.push(i);
            this.passData.opts[2].vals.push(i.bankCd);
            this.passData.opts[2].prev.push(i.officialName);
          }
          this.banks = data.bankList;
        }
      }
    );
  }

  retrieveMtnBankAcct(){
    this.bankAccts = [];
    this.ms.getMtnBankAcct(this.selectedBank.bankCd).subscribe(
        (data:any)=>{
          if(data.bankAcctList.length !== 0){
            this.bankAccts = data.bankAcctList;
            this.bankAccts = this.bankAccts.filter(a=>{return a.currCd == this.selectedCurrency});
          }
        }
    );
  }

  retrieveMtnAcitDCBNo(dcbYear?, dcbDate?){
    this.ms.getMtnAcitDCBNo(dcbYear,null,dcbDate,null).subscribe(
      (data:any)=>{
        if(data.dcbNoList.length === 0){
          this.dialogIcon = 'info';
          this.dialogMessage = 'DCB No. was not yet generated for the selected date. A DCB No. will be automatically generated.';
          this.successDiag.open();
          this.generateDCBNo(dcbYear,dcbDate);
        }else{
          this.arInfo.dcbYear = data.dcbNoList[0].dcbYear;
          this.arInfo.dcbNo = data.dcbNoList[0].dcbNo;
        }
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
      updateUser: this.ns.getCurrentUser()
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
      if(i.paytMode == 'BT' && (i.bank.length === 0 || i.bankAcct.length === 0)){
        return true;
      }else if(i.paytMode == 'CK' && (i.bank.length === 0 || i.bankAcct.length === 0 || i.checkNo.length === 0 || i.checkDate.length === 0 || i.checkClass.length === 0)){
        return true;
      }else if(i.paytMode == 'CR' && (i.bank.length === 0 || i.bankAcct.length === 0 || i.checkNo.length === 0)){
        return true;
      }
    }
    return false;
  }

  arAmtEqualsPayt(): boolean{
    let totalPayts = 0;
    for(var i of this.passData.tableData){
      totalPayts += i.paytAmt;
    }
    if(this.arInfo.arAmt !== totalPayts){
      return true;
    }else{
      return false;
    }
  }

  //UTILITIES STARTS HERE

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
        return String(str).padStart(6, '0');
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
        data[i].required = [];
        if(data[i].paytMode !== 'BT' && data[i].paytMode !== 'CK' && data[i].paytMode !== 'CR'){
          data[i].uneditable.push('bank');
          data[i].uneditable.push('bankAcct');
          data[i].required.push('bank');
          data[i].required.push('bankAcct');
          data[i].bank = '';
          data[i].bankAcct = '';
        }
        if(data[i].paytMode !== 'CK'){
          //data[i].uneditable = []
          if(data[i].paytMode !== 'CR'){
            data[i].uneditable.push('checkNo');
            data[i].required.push('checkNo');
          }
          data[i].uneditable.push('checkDate');
          data[i].uneditable.push('checkClass');
          data[i].required.push('checkDate');
          data[i].required.push('checkClass');
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
    var sub$ = forkJoin(this.ms.getMtnDCBUser(this.ns.getCurrentUser()),
                        this.ms.getMtnBank(),
                        this.ms.getMtnBankAcct()).pipe(map(([dcb, bank, bankAcct]) => { return { dcb, bank, bankAcct }; }));
    this.forkSub = sub$.subscribe(
      (data:any)=>{
           this.arInfo.dcbUserCd = data.dcb.dcbUserList[0].dcbUserCd;
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
               this.banks.push(i);
               this.passData.opts[2].vals.push(i.bankCd);
               this.passData.opts[2].prev.push(i.officialName);
             }
             //this.banks = data.bank.bankList;
           }
           //bankAcct
           if(data.bankAcct.bankAcctList.length !== 0){
               this.bankAccts = data.bankAcct.bankAcctList.filter(a=>{return a.bankCd == this.selectedBank.bankCd && a.currCd == this.selectedCurrency});
               
           }
      },
      (error: any)=>{
        console.log('error');
      }
    );
  }
}
