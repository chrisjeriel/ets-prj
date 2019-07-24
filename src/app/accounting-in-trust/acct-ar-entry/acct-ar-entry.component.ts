import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-acct-ar-entry',
  templateUrl: './acct-ar-entry.component.html',
  styleUrls: ['./acct-ar-entry.component.css']
})
export class AcctArEntryComponent implements OnInit, OnDestroy {
  @ViewChild('paytDtl') paytDtlTbl: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;

  passData: any = {
        tableData: [],
        tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Bank Account No.','Check No.','Check Date','Check Class'],
        dataTypes: ['select','select','percent','currency','select','text','number','date','select'],
        paginateFlag: true,
        infoFlag: true,
        pageLength: 5,
        widths: [130,70,100,150,210,1,"auto",100,180],
        keys: ['paytMode', 'currCd', 'currRate', 'paytAmt', 'bank', 'bankAcct', 'checkNo', 'checkDate', 'checkClass'],
        uneditable: [false,false,true,false,false,false,false,false,false],
        pageID: 1,
        addFlag: true,
        genericBtn: 'Delete',
        nData: {
          paytMode: '',
          currCd: 'PHP',
          currRt: 1,
          paytAmt: 0,
          bank: '1',
          bankAcct: '',
          checkNo: '',
          checkDate: '',
          checkClass: ''
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
  isAdd: boolean = false;
  cancelFlag: boolean = false;

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

  selectedCurrency: any = {
    currencyCd: 'PHP',
    currencyRt: 1
  };

  selectedBank: any = {
    bankCd: '',
    officialName: ''
  }

  selectedBankAcct: any = {
    bankAcctCd: '',
    accountNo: ''
  }

  constructor(private route: ActivatedRoute, private as: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
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
           arNo = params.arNo;         }
       }
    );

    if(!this.isAdd){
      this.retrieveArEntry(tranId, arNo);
    }else{
      if(this.emittedValue !== undefined){
        this.retrieveArEntry(this.emittedValue.tranId, this.emittedValue.arNo);
      }else{
        this.retrieveMtnAcitDCBNo();
        this.retrieveMtnDCBUser();
        this.arDate.date = this.ns.toDateTimeString(0).split('T')[0];
        this.arDate.time = this.ns.toDateTimeString(0).split('T')[1];
      }
    }
    this.retrievePaymentType();
    this.retrieveCurrency();
    this.retrieveMtnBank();
  }

  newAr(){
    this.isAdd = true;
    this.disableTab.emit(true);
    this.retrieveMtnAcitDCBNo();
    this.retrieveMtnDCBUser();
    this.arDate.date = this.ns.toDateTimeString(0).split('T')[0];
    this.arDate.time = this.ns.toDateTimeString(0).split('T')[1];
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
      currCd: '',
      arAmt: '',
      currRate: '',
      particulars: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
    }
    this.prDate = {
      date: '',
      time: ''
    }
    this.passData.tableData = [];
    this.paytDtlTbl.refreshTable();
    this.retrieveCurrency();
    this.retrieveMtnBank();
    this.passData.disableGeneric = true;
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  tabController(event) {
  	this.onChange.emit({ type: this.arInfo.tranTypeCd });
  }

  changeCurrency(data){
    this.selectedCurrency = data;
    this.arInfo.currCd = data.currencyCd; 
    this.arInfo.currRate = data.currencyRt; 
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
  }

  changeArAmt(data){
    this.arInfo.arAmt = (parseFloat(data.toString().split(',').join('')));
  }

  retrieveArEntry(tranId, arNo){
    this.as.getArEntry(tranId, arNo).subscribe(
      (data:any)=>{
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
          this.arInfo.currCd         = data.ar.currCd;
          this.arInfo.arAmt          = data.ar.arAmt;
          this.arInfo.currRate       = data.ar.currRate;
          this.arInfo.particulars    = data.ar.particulars;
          this.arInfo.createUser     = data.ar.createUser;
          this.arInfo.createDate     = this.ns.toDateTimeString(data.ar.createDate);
          this.arInfo.updateUser     = data.ar.updateUser;
          this.arInfo.updateDate     = this.ns.toDateTimeString(data.ar.updateDate);

          //this.passData.tableData          = data.ar.paytDtl;
          this.passData.tableData = [];
          for(var i of data.ar.paytDtl){
            i.uneditable = [];
            if(i.paytMode !== 'BT' && i.paytMode !== 'CK'){
              i.uneditable.push('bank');
              i.uneditable.push('bankAcct');
            }
            if(i.paytMode !== 'CK'){
              i.uneditable.push('checkNo');
              i.uneditable.push('checkDate');
              i.uneditable.push('checkClass');
            }
            i.currCd = i.currCd+'T'+i.currRate;
            i.currRate = i.currCd.split('T')[1];
            this.passData.tableData.push(i);
          }
          this.selectedCurrency.currencyCd = data.ar.currCd;
          this.selectedCurrency.currencyRt = data.ar.currRate;
          this.selectedBank.bankCd         = data.ar.dcbBank;
          this.selectedBankAcct.bankAcctCd = data.ar.dcbBankAcct;
          this.retrieveMtnBankAcct();
          
          this.paytDtlTbl.refreshTable();
          this.onChange.emit({ type: this.arInfo.tranTypeCd });
          this.disableTab.emit(false);
          let arDetailParams = {
            tranId: this.arInfo.tranId,
            arNo: this.arInfo.arNo
          }
          this.emitArInfo.emit(arDetailParams);

          setTimeout(()=>{
            $('#arNo').focus();
            $('#arNo').blur();
            $('#arAmt').focus();
            $('#arAmt').blur();
          },0);

        }
      },
      (error)=>{

      }
    );
  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.savedData = [];
    this.deletedData = [];
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.passData.tableData[i].currCd = this.passData.tableData[i].currCd.split('T')[0]; 
          this.savedData.push(this.passData.tableData[i]);
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
          this.deletedData.push(this.passData.tableData[i]);
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
          this.dialogIcon = 'error-message';
          this.dialogMessage = data.errorList[0].errorMessage;
          this.successDiag.open();
        }
        else{
          this.retrieveArEntry(data.outTranId, '');
          this.paytDtlTbl.refreshTable();
          this.dialogIcon = 'success';
          this.successDiag.open();
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
        if(data.currency.length !== 0){
          for(var i of data.currency){
            if(this.isAdd && 'PHP' === i.currencyCd){
              this.selectedCurrency = {currencyCd: i.currencyCd, currencyRt: i.currencyRt};
              this.arInfo.currCd = i.currencyCd;
              this.arInfo.currRate = i.currencyRt;
            }
            this.currencies.push({currencyCd: i.currencyCd, currencyRt: i.currencyRt});
            this.passData.opts[1].vals.push(i.currencyCd+'T'+i.currencyRt);
            this.passData.opts[1].prev.push(i.currencyCd);
          }
        }
      }
    );
  }

  retrieveMtnBank(){
    this.banks = [];
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
          }
        }
    );
  }

  retrieveMtnAcitDCBNo(){
    this.ms.getMtnAcitDCBNo(new Date().getFullYear(),null,this.ns.toDateTimeString(0),null).subscribe(
      (data:any)=>{
        if(data.dcbNoList.length === 0){
          this.dialogIcon = 'info';
          this.dialogMessage = 'Currently, there is no DCB No. yet for today’s transaction. A DCB No. will be automatically generated.';
          this.successDiag.open();
          this.generateDCBNo();
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

  generateDCBNo(){
    let saveDCBNo: any[] = [];
    saveDCBNo.push({
      autoTag: 'Y',
      createDate: this.ns.toDateTimeString(0),
      createUser: this.ns.getCurrentUser(),
      dcbDate: this.ns.toDateTimeString(0),
      dcbNo: '',
      dcbStatus: 'O',
      dcbYear: new Date().getFullYear(),
      remarks: '',
      updateDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser()
    });

    this.ms.saveMtnAcitDCBNo([],saveDCBNo).subscribe(
      (data:any)=>{
        if(data.returnCode === 0){
          //when there's an error, pop something up idk
        }else{
          this.retrieveMtnAcitDCBNo();
        }
      },
      (error: any)=>{

      }
    );
  }

  //UTILITIES STARTS HERE

  compareCurrencyFn(c1: any, c2: any): boolean {
      return c1 && c2 ? c1.currencyCd === c2.currencyCd : c1 === c2;
  }

  compareBankFn(c1: any, c2: any): boolean {
      return c1 && c2 ? c1.bankCd === c2.bankCd : c1 === c2;
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
        if(data[i].paytMode !== 'BT' && data[i].paytMode !== 'CK'){
          data[i].uneditable.push('bank');
          data[i].uneditable.push('bankAcct');
          console.log('condition1');
        }
        if(data[i].paytMode !== 'CK'){
          data[i].uneditable.push('checkNo');
          data[i].uneditable.push('checkDate');
          data[i].uneditable.push('checkClass');
          console.log('condition2');
        }
      }
    }else if(data.key === 'currCd'){
      for(var j = 0; j < data.length; j++){
        data[j].currRate = data[j].currCd.split('T')[1];
      }
    }
    this.passData.tableData = data;
    this.paytDtlTbl.refreshTable();
  }
}
