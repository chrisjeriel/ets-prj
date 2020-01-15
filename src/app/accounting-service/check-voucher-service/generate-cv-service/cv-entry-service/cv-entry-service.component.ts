import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService,PrintService } from '@app/_services';
import { CVListing } from '@app/_models'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { environment } from '@environments/environment';
import { NgForm } from '@angular/forms';
import { OverrideLoginComponent } from '@app/_components/common/override-login/override-login.component';
import { UploaderComponent } from '@app/_components/common/uploader/uploader.component';

@Component({
  selector: 'app-cv-entry-service',
  templateUrl: './cv-entry-service.component.html',
  styleUrls: ['./cv-entry-service.component.css']
})
export class CvEntryServiceComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) success   : SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) cs         : ConfirmSaveComponent;
  @ViewChild('payeeLov') payeeLov             : LovComponent;
  @ViewChild('bankLov') bankLov               : LovComponent;
  @ViewChild('bankAcctLov') bankAcctLov       : LovComponent;
  @ViewChild('classLov') classLov             : LovComponent;
  @ViewChild('paytReqTypeLov') paytReqTypeLov : LovComponent;
  @ViewChild('currLov') currLov               : MtnCurrencyComponent;
  @ViewChild('prepUserLov') prepUserLov       : MtnUsersComponent;
  @ViewChild('certUserLov') certUserLov       : MtnUsersComponent;
  @ViewChild('confirmMdl') confirmMdl         : ModalComponent; 
  @ViewChild('printMdl') printMdl             : ModalComponent;
  @ViewChild('warnMdl') warnMdl               : ModalComponent;
  @ViewChild('myForm') form                   : NgForm;
  @ViewChild('override') overrideLogin        : OverrideLoginComponent;
  @ViewChild('AcctEntries') upAcctEntMdl      : ModalComponent;
  @ViewChild(UploaderComponent) up            : UploaderComponent;


  @Output() cvData : EventEmitter<any> = new EventEmitter();
  @Input() passData: any = {
    tranId : ''
  };

  saveAcseCv : any = {
    bank          : '',
    bankAcct      : '',
    certifiedBy   : '',
    certifiedDate : '',
    checkClass    : '',
    checkDate     : '',
    checkId       : '',
    checkNo       : '',
    closeDate     : '',
    createDate    : '',
    createUser    : '',
    currCd        : '',
    currRate      : '',
    cvAmt         : '',
    cvDate        : '',
    cvNo          : '',
    cvStatus      : '',
    cvYear        : '',
    deleteDate    : '',
    localAmt      : '',
    mainTranId    : '',
    particulars   : '',
    paytReqType   : '',
    payee         : '',
    payeeCd       : '',
    payeeClassCd  : '',
    postDate      : '',
    preparedBy    : '',
    preparedDate  : '',
    tranId        : '',
    tranStat      : '',
    updateDate    : '',
    updateUser    : '',
    disbType: '',
    destBank: '',
    destAcctNo: '',
    destAcctName: '',
    btRefNo: '',
    swiftCd: ''
  };

  dialogMessage        : string = '';
  dialogIcon           : string = '';
  warnMsg              : string = '';
  cancelFlag           : boolean;
  fromCancel           : boolean;
  private sub          : any;
  cvStatList           : any;
  removeIcon           : boolean;
  fromBtn              : string = '';
  isTotPrlEqualCvAmt   : boolean = false;
  isTotDebCredBalanced : boolean = false;
  bankAcctList         : any;
  checkSeriesList      : any;
  existsInCvDtl        : boolean = false;
  fromSave             : boolean = false;
  spoiled              : any;
  approvalCd           : any;
  suggestCheckNo       : any;

  uploadLoading: boolean = false;
  acctEntryFile: any;
  fileName: string = '';
  emitMessage: string = '';
  canUploadAcctEnt: boolean = true;

  passDataLov  : any = {
    selector     : '',
    payeeClassCd : ''
  };

  printData : any = {
    selPrinter  : '',
    printers    : [],
    destination : 'screen',
    reportType  : 2,
    copyNo      : null,
    printCv     : true,
    printCheck  : ''
  };

  lovCheckBox:boolean = true;
  chkNoDigits: number = null;
  disbTypeList: any[] = [];
  fromBankLov: any = '';
  checkClassList: any[] = [];

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal, private ns: NotesService, 
              private mtnService: MaintenanceService,private activatedRoute: ActivatedRoute,  private router: Router, private decPipe: DecimalPipe, private ps : PrintService) { }

  ngOnInit() {
    this.mtnService.getMtnParameters('N', 'CHK_NO_DIGITS').subscribe(data => {
      this.chkNoDigits = Number(data['parameters'][0].paramValueN);
    });
    this.titleService.setTitle("Acct-Serv | CV Entry");

    this.canUploadAcctEntMethod();

    this.sub = this.activatedRoute.params.subscribe(params => {
      if(this.passData.tranId == '') {
        if(Object.keys(params).length != 0 ){
          this.saveAcseCv.tranId = params['tranId'];
        } else {
          //else
        }
      } else {
        this.saveAcseCv.tranId = this.passData.tranId;
      }

     this.getAcseCv();
    });
  }

  getAcseCv(){
    this.loadingFunc(true);
    const subResKey = ['pn','cl','stat','dt'];

    const arrSubRes = {
      'pn'  :this.mtnService.getMtnPrintableName(''),
      'cl'  :this.mtnService.getRefCode('CHECK_CLASS'),
      'stat':this.mtnService.getRefCode('ACSE_CHECK_VOUCHER.CV_STATUS'),
      'dt'  :this.mtnService.getRefCode('ACSE_CHECK_VOUCHER.DISB_TYPE')
    };

    if(this.saveAcseCv.tranId != '' && this.saveAcseCv.tranId != null && this.saveAcseCv.tranId != undefined){
      $.extend(arrSubRes,{
        'cv'  :this.accountingService.getAcseCv(this.saveAcseCv.tranId)
      });
      subResKey.push('cv');
    }

    var subRes  = forkJoin(Object.values(arrSubRes)).pipe(map((a) => { 
      var obj = {};
      subResKey.forEach((e,i) => {obj[e] = a[i];});
      return obj;
    }));
    
    subRes.subscribe(data => {
      console.log(data);
      this.loadingFunc(false);
      var recPn   = data['pn']['printableNames'];
      var recCl   = data['cl']['refCodeList'];
      this.checkClassList = data['cl']['refCodeList'];
      var recStat = data['stat']['refCodeList'];
      this.disbTypeList = data['dt']['refCodeList'];

      if(this.saveAcseCv.tranId == '' || this.saveAcseCv.tranId == null){
        this.loadingFunc(false);
        this.saveAcseCv.cvStatus = 'N';
        this.saveAcseCv.cvStatusDesc = recStat.filter(e => e.code == this.saveAcseCv.cvStatus).map(e => e.description);
        this.saveAcseCv.cvDate = this.ns.toDateTimeString(0);
        this.saveAcseCv.cvAmt = 0;
        this.saveAcseCv.currCd = 'PHP';
        this.saveAcseCv.currRate = 1;
        this.saveAcseCv.checkClass = 'LC';
        this.saveAcseCv.checkClassDesc = recCl.filter(e => e.code == this.saveAcseCv.checkClass).map(e => e.description);
        this.saveAcseCv.preparedDate = this.ns.toDateTimeString(0);
        this.saveAcseCv.checkDate = this.ns.toDateTimeString(0);
        this.saveAcseCv.disbType = 'CK';

        recPn.forEach(e => {
          if(e.userId.toUpperCase() == this.ns.getCurrentUser().toUpperCase()){
            this.saveAcseCv.preparedByName  = e.printableName;
            this.saveAcseCv.preparedBy   = e.userId;
            this.saveAcseCv.preparedByDes = e.designation;
          }
        });
      }else{
        var recCv = data['cv']['acseCvList'].map(e => {
          e.createDate = this.ns.toDateTimeString(e.createDate);
          e.updateDate = this.ns.toDateTimeString(e.updateDate);
          e.cvDate     = this.ns.toDateTimeString(e.cvDate);
          e.checkDate  = this.ns.toDateTimeString(e.checkDate);
          e.checkNo = String(e.checkNo).padStart(this.chkNoDigits, '0');
          e.preparedDate = this.ns.toDateTimeString(e.preparedDate);
          e.certifiedDate = this.ns.toDateTimeString(e.certifiedDate);
          e.cvNo = e.cvNo.toString().padStart(6,'0');
          recPn.forEach(e2 => {
            if(e.preparedBy.toUpperCase() == e2.userId.toUpperCase()){
              e.preparedByName = e2.printableName;
              this.saveAcseCv.preparedBy = e2.userId;
              e.preparedByDes = e2.designation;
            }
            if(e.certifiedBy == e2.userId){
              e.certifiedByName = e2.printableName;
              this.saveAcseCv.certifiedBy = e2.userId;
              e.certifiedByDes = e2.designation;
            }
          });
          return e;
        });

        this.saveAcseCv = Object.assign(this.saveAcseCv,recCv[0]);
        console.log(recCv);
        console.log(this.saveAcseCv);
        this.existsInCvDtl = (this.saveAcseCv.prlExist == 'Y')?true:false;

        (this.saveAcseCv.cvStatus == 'A' || this.saveAcseCv.cvStatus == 'P') ? this.getPrinters() : '';

        this.saveAcseCv.checkNo = (this.suggestCheckNo == '' || this.suggestCheckNo == undefined || this.suggestCheckNo == null)?this.saveAcseCv.checkNo:this.suggestCheckNo;
      }

      this.saveAcseCv['from'] = 'cv';
      this.saveAcseCv['exitLink'] = 'check-voucher-service';
      this.cvData.emit(this.saveAcseCv);
      (this.spoiled)?'':((this.saveAcseCv.cvStatus == 'N' || this.saveAcseCv.cvStatus == 'F')?this.disableFlds(false):this.disableFlds(true));
      this.setLocalAmt();
      if(this.saveAcseCv.checkStatus == 'S'){
          this.spoiledFunc();
      }
    });
  }

  onClickNewCv(){
    this.saveAcseCv  = {
      bank          : '',
      bankAcct      : '',
      certifiedBy   : '',
      certifiedDate : '',
      checkClass    : '',
      checkDate     : '',
      checkId       : '',
      checkNo       : '',
      closeDate     : '',
      createDate    : '',
      createUser    : '',
      currCd        : '',
      currRate      : '',
      cvAmt         : '',
      cvDate        : '',
      cvNo          : '',
      cvStatus      : '',
      cvYear        : '',
      deleteDate    : '',
      localAmt      : '',
      mainTranId    : '',
      particulars   : '',
      paytReqType   : '',
      payee         : '',
      payeeCd       : '',
      payeeNo       : '',
      postDate      : '',
      preparedBy    : '',
      preparedDate  : '',
      tranId        : '',
      tranStat      : '',
      updateDate    : '',
      updateUser    : '',
      disbType: 'CK',
      destBank: '',
      destBankDesc: '',
      destAcctNo: '',
      destAcctName: '',
      btRefNo: '',
      swiftCd: ''
    };
    this.getAcseCv();
    this.disableFlds(false);
    this.existsInCvDtl = false;
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;

    if(this.saveAcseCv.cvDate == null || this.saveAcseCv.cvDate == '' || this.saveAcseCv.payee == '' ||  this.saveAcseCv.payee == null || this.saveAcseCv.payeeCd == '' ||  this.saveAcseCv.payeeCd == null || this.saveAcseCv.particulars == '' || 
       this.saveAcseCv.particulars == null || this.saveAcseCv.bank == '' || this.saveAcseCv.bank == null || this.saveAcseCv.bankAcct == '' || this.saveAcseCv.bankAcct == null ||
       this.saveAcseCv.cvAmt == '' || this.saveAcseCv.cvAmt == null || this.saveAcseCv.cvAmt < 0 ||  this.saveAcseCv.checkNo == '' || this.saveAcseCv.checkNo == null || this.saveAcseCv.currCd == '' || 
       this.saveAcseCv.currCd == null || this.saveAcseCv.currRate == '' || this.saveAcseCv.currRate == null || this.saveAcseCv.checkDate == '' || this.saveAcseCv.checkDate == null ||
       this.saveAcseCv.preparedBy == '' || this.saveAcseCv.preparedBy == null || this.saveAcseCv.preparedDate == '' || this.saveAcseCv.preparedDate == null || 
       this.saveAcseCv.checkClass == '' || this.saveAcseCv.checkClass == null || this.saveAcseCv.paytReqType == '' || this.saveAcseCv.paytReqType == null ){
        this.dialogIcon = 'error';
        this.success.open();
        this.saveAcseCv.checkDate == '' ? $('.checkDateWarn').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
        $('.warn').focus();
        $('.warn').blur();
        this.fromCancel = false;
    }else{
      this.fromCancel = true;
      if(this.cancelFlag == true){
        this.cs.showLoading(true);
        setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},500);
      }else{
        this.cs.confirmModal();
      }
    }
    console.log(this.saveAcseCv);
  }

  onSaveAcseCv(){
    var saveCv = {
      bank             : this.saveAcseCv.bank,
      bankAcct         : this.saveAcseCv.bankAcct,
      certifiedBy      : this.saveAcseCv.certifiedBy,
      certifiedDate    : (this.saveAcseCv.certifiedDate == '' || this.saveAcseCv.certifiedDate == null)?'':this.ns.toDateTimeString(this.saveAcseCv.certifiedDate),
      checkClass       : this.saveAcseCv.checkClass,
      checkDate        : (this.saveAcseCv.checkDate == '' || this.saveAcseCv.checkDate == null)?this.ns.toDateTimeString(0):this.saveAcseCv.checkDate,
      checkId          : this.saveAcseCv.checkId,
      checkNo          : Number(this.saveAcseCv.checkNo),
      closeDate        : this.ns.toDateTimeString(this.saveAcseCv.mainCloseDate),
      createDate       : (this.saveAcseCv.createDate == '' || this.saveAcseCv.createDate == null)?this.ns.toDateTimeString(0):this.saveAcseCv.createDate,
      createUser       : (this.saveAcseCv.createUser == '' || this.saveAcseCv.createUser == null)?this.ns.getCurrentUser():this.saveAcseCv.createUser,
      currCd           : this.saveAcseCv.currCd,
      currRate         : Number(String(this.saveAcseCv.currRate).replace(/\,/g,'')),
      cvAmt            : Number(String(this.saveAcseCv.cvAmt).replace(/\,/g,'')),
      cvDate           : (this.saveAcseCv.cvDate == '' || this.saveAcseCv.cvDate == null)?this.ns.toDateTimeString(0):this.saveAcseCv.cvDate,
      cvNo             : this.saveAcseCv.cvNo,
      cvStatus         : this.saveAcseCv.cvStatus,
      cvYear           : this.saveAcseCv.cvYear,
      deleteDate       : this.ns.toDateTimeString(this.saveAcseCv.mainDeleteDate),
      localAmt         : Number(String(this.saveAcseCv.localAmt).replace(/\,/g,'')),
      mainTranId       : this.saveAcseCv.mainTranId,
      particulars      : this.saveAcseCv.particulars,
      paytReqType      : this.saveAcseCv.paytReqType,
      payee            : this.saveAcseCv.payee,
      payeeCd          : this.saveAcseCv.payeeCd,
      payeeClassCd     : this.saveAcseCv.payeeClassCd,
      postDate         : this.ns.toDateTimeString(this.saveAcseCv.mainPostDate),
      preparedBy       : this.saveAcseCv.preparedBy,
      preparedDate     : (this.saveAcseCv.preparedDate == '' || this.saveAcseCv.preparedDate == null)?this.ns.toDateTimeString(0):this.saveAcseCv.preparedDate,
      tranId           : this.saveAcseCv.tranId,
      tranStat         : this.saveAcseCv.mainTranStat,
      updateDate       : this.ns.toDateTimeString(0),
      updateUser       : this.ns.getCurrentUser(),
      disbType: this.saveAcseCv.disbType,
      destBank: this.saveAcseCv.destBank,
      destBankDesc: this.saveAcseCv.destBankDesc,
      destAcctNo: this.saveAcseCv.destAcctNo,
      destAcctName: this.saveAcseCv.destAcctName,
      btRefNo: this.saveAcseCv.btRefNo,
      swiftCd: this.saveAcseCv.swiftCd
    };

    console.log(saveCv);
    (this.spoiled)?this.saveAcseCv.checkId='':'';
    this.accountingService.saveAcseCv(JSON.stringify(saveCv))
    .subscribe(data => {
      console.log(data);
      this.fromSave = true;
      this.spoiled = true;

      if(data['returnCode'] == -1){
        this.saveAcseCv.checkNo = '';
        this.saveAcseCv.tranId = data['tranIdOut'];
        this.saveAcseCv.mainTranId = data['mainTranIdOut'];
        this.getAcseCv();
        this.spoiled = false;
        this.form.control.markAsPristine();

        this.loadingFunc(false);
        this.dialogIcon = '';
        this.dialogMessage = '';
        this.success.open();
      }else if(data['returnCode'] == 0){
        this.dialogIcon = 'error';
        this.success.open();
      }else if(data['returnCode'] == 2){
        this.warnMsg = 'Unable to proceed. Check No is already been used or does not exist.\nThe lowest available Check No. is '+ String(data['checkNo']).padStart(this.chkNoDigits, '0') +'.';
        this.warnMdl.openNoClose();
        this.saveAcseCv.checkNo = String(Number(data['checkNo'])).padStart(this.chkNoDigits, '0');
      }else if(data['returnCode'] == -100){
        this.saveAcseCv.checkNo = '';
        this.warnMsg = 'There is no Check No available for this Account No.\nPlease proceed to maintenance module to generate Check No.';
        this.warnMdl.openNoClose();
      }else if(data['returnCode'] == -300){
        this.warnMsg = 'There is no Check Voucher No available as of the moment.\nPlease proceed to maintenance module to generate Check Voucher No.';
        this.warnMdl.openNoClose();
      }
    });
  }

  showLov(fromUser){
    console.log(fromUser);
    if(fromUser.toLowerCase() == 'payee'){
      this.passDataLov.selector = 'payee';
      this.passDataLov.payeeNo = '';
      this.payeeLov.openLOV();
    }else if(fromUser.toLowerCase() == 'bank'){
      this.fromBankLov = fromUser;
      this.passDataLov.selector = 'bankLov';
      this.passDataLov.glDepFor = 'acse';
      this.bankLov.openLOV();
    }else if(fromUser.toLowerCase() == 'dest-bank'){
      this.fromBankLov = fromUser;
      this.passDataLov.selector = 'mtnBank';
      this.bankLov.openLOV();
    }else if(fromUser.toLowerCase() == 'bank-acct'){
      this.passDataLov.selector = 'bankAcct';
      this.passDataLov.currCd = this.saveAcseCv.currCd;
      this.passDataLov.bankCd = this.saveAcseCv.bank;
      this.passDataLov.from   = 'acse';
      this.bankAcctLov.openLOV();
    }else if(fromUser.toLowerCase() == 'class'){
      this.passDataLov.selector = 'checkClass';
      this.classLov.openLOV();
    }else if(fromUser.toLowerCase() == 'paytreqtype'){
      this.passDataLov.selector = 'paytReqType';
      this.passDataLov.from = 'acse';
      this.paytReqTypeLov.openLOV();
    }else if(fromUser.toLowerCase() == 'curr'){
      this.currLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'prep-user'){
      this.prepUserLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'cert-user'){
      this.certUserLov.modal.openNoClose();
    }
  }

  getAcseCheckSeries(bank,bankAcct){
    if(this.saveAcseCv.disbType == 'CK') {
      this.loadingFunc(true);
      this.mtnService.getMtnAcseCheckSeries(bank,bankAcct)
      .subscribe(data => {
        this.loadingFunc(false);
        this.form.control.markAsDirty();
        var chckNo = data['checkSeriesList'].filter(e => e.usedTag == 'N').sort((a,b) => a.checkNo - b.checkNo);
        if(chckNo.length == 0){
          this.saveAcseCv.checkNo = '';
          this.suggestCheckNo = '';
          this.warnMsg = 'There is no Check No available for this Account No.\nPlease proceed to maintenance module to generate Check No.';
          this.warnMdl.openNoClose();  
        }else{
          this.saveAcseCv.checkNo = String(chckNo[0].checkNo).padStart(this.chkNoDigits, '0');
        }
      });
    }
  }

  getBankAcct(bankCd,currCd){
    this.loadingFunc(true);
    this.mtnService.getMtnBankAcct(bankCd)
    .subscribe(data => {
      console.log(data);
      this.loadingFunc(false);
      var ba = data['bankAcctList'].filter(e => e.currCd == currCd && e.acSeGlDepNo != null && e.acctStatus == 'A');
      if(ba.length == 1){
        this.saveAcseCv.bankAcctDesc   = ba[0].accountNo;
        this.saveAcseCv.bankAcct = ba[0].bankAcctCd;
        this.getAcseCheckSeries(this.saveAcseCv.bank,this.saveAcseCv.bankAcct);
      }else if(ba.length == 0){
        this.saveAcseCv.bankAcctDesc   = '';
        this.saveAcseCv.bankAcct = '';
        this.saveAcseCv.checkNo = '';
        this.suggestCheckNo = '';
        this.warnMsg = 'There is no Bank Account No available for this Bank.\nPlease proceed to maintenance module to generate Bank Account No.';
        this.warnMdl.openNoClose();
      }
    });
  }

  setData(data,from){
    setTimeout(() => {
      this.removeRedBackShad(from);
      this.ns.lovLoader(data.ev, 0);
      this.form.control.markAsDirty();
    },0);
    
    if(from.toLowerCase() == 'payee'){
      if(data.data == null){
        this.saveAcseCv.payee   = '';
        this.saveAcseCv.payeeCd = '';
        this.saveAcseCv.payeeClassCd = '';
      }else{
        this.saveAcseCv.payee   = data.data.payeeName;
        this.saveAcseCv.payeeCd = data.data.payeeNo;
        this.saveAcseCv.payeeClassCd = data.data.payeeClassCd;
      }
    }else if(from.toLowerCase() == 'bank'){
      this.saveAcseCv.bankDesc   = data.data.officialName;
      this.saveAcseCv.bank = data.data.bankCd;
      this.saveAcseCv.bankAcctDesc = '';
      this.saveAcseCv.bankAcct = '';
      this.saveAcseCv.checkNo = '';
      this.suggestCheckNo = '';
      this.getBankAcct(data.data.bankCd,this.saveAcseCv.currCd);
    }else if(from.toLowerCase() == 'dest-bank'){
      this.saveAcseCv.destBankDesc   = data.data.officialName;
      this.saveAcseCv.destBank = data.data.bankCd;
      this.saveAcseCv.destAcctNo = '';
      this.saveAcseCv.checkNo = '';
    }else if(from.toLowerCase() == 'bank-acct'){
      this.saveAcseCv.bankAcctDesc   = data.data.accountNo;
      this.saveAcseCv.bankAcct = data.data.bankAcctCd;
      this.getAcseCheckSeries(this.saveAcseCv.bank,this.saveAcseCv.bankAcct);
    }else if(from.toLowerCase() == 'class'){
      this.saveAcseCv.checkClassDesc   = data.data.description;
      this.saveAcseCv.checkClass = data.data.code;
    }else if(from.toLowerCase() == 'paytreqtype'){
      this.saveAcseCv.paytReqTypeDesc   = data.data.tranTypeName;
      this.saveAcseCv.paytReqType = data.data.tranTypeCd;
      this.saveAcseCv.particulars  = this.saveAcseCv.paytReqTypeDesc + ((this.saveAcseCv.paytReqType == 5 || this.saveAcseCv.paytReqType == 1 || this.saveAcseCv.paytReqType == 2)?' Payments ':'') + ' for : ';
    }else  if(from.toLowerCase() == 'curr'){
      this.saveAcseCv.currCd = data.currencyCd;
      this.saveAcseCv.currRate =  data.currencyRt;
      this.getBankAcct(this.saveAcseCv.bank,data.currencyCd);
      this.setLocalAmt();
    }else if(from.toLowerCase() == 'prep-user'){
      this.saveAcseCv.preparedByName = data.printableName;
      this.saveAcseCv.preparedBy  = data.userId;
      this.saveAcseCv.preparedByDes  = data.designation;
    }else if(from.toLowerCase() == 'cert-user'){
      this.saveAcseCv.certifiedByName = data.printableName;
      this.saveAcseCv.certifiedBy  = data.userId;
      this.saveAcseCv.certifiedByDes  = data.designation;
    }
  }

  setLocalAmt(){
    this.saveAcseCv.localAmt = Number(String(this.saveAcseCv.cvAmt).replace(/\,/g,'')) * Number(String(this.saveAcseCv.currRate).replace(/\,/g,''));
    this.saveAcseCv.cvAmt =  this.decPipe.transform(Number(String(this.saveAcseCv.cvAmt).replace(/\,/g,'')),'0.2-2');
    this.saveAcseCv.localAmt = this.decPipe.transform(Number(String(this.saveAcseCv.localAmt).replace(/\,/g,'')),'0.2-2');
    this.saveAcseCv.currRate = (this.saveAcseCv.currRate == 0)?'':this.decPipe.transform(Number(String(this.saveAcseCv.currRate).replace(/\,/g,'')),'0.6-6');
  }

  checkCode(event,from){
    this.ns.lovLoader(event, 1);
    if(from.toLowerCase() == 'curr'){
      this.currLov.checkCode(this.saveAcseCv.currCd.toUpperCase(),event);
    }else if(from.toLowerCase() == 'prep-user'){
      this.prepUserLov.checkCode(this.saveAcseCv.preparedBy.toUpperCase(),event);
    }else if(from.toLowerCase() == 'cert-user') {
      this.certUserLov.checkCode(this.saveAcseCv.certifiedByName.toUpperCase(), event);
    }else if(from.toLowerCase() == 'payee'){
      this.passDataLov.selector = 'payee';
      this.passDataLov.payeeNo = this.saveAcseCv.payeeCd;
      this.payeeLov.checkCode('payee',null,null,null,null,null,event,null,this.passDataLov.payeeClassCd);
    }
  }

  checkCancel(){
    if(this.cancelFlag == true){
      if(this.fromCancel){
        this.cancelBtn.onNo();
      }else{
        return;
      }
    }else{
      this.success.modal.modalRef.close();
    }
  }

  disableFlds(con:boolean){
    $('.warn').prop('readonly',con);
    this.removeIcon = (con)?true:false;
  }

  removeRedBackShad(fromClass){
    $('.'+fromClass).css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
  }

  setBankAcctData(){
    this.saveAcseCv.bankAcctDesc = '';
    this.saveAcseCv.bankAcct = '';
  }

  onClickOkPrint(){
    this.loadingFunc(true);
    var arrSum = function(arr){return parseFloat(arr.reduce((a,b) => a+b,0).toFixed(2));};
   
    var forkRes = forkJoin(this.accountingService.getAcseAcctEntries(this.saveAcseCv.tranId),this.accountingService.getAcseCvPaytReqList(this.saveAcseCv.tranId),this.accountingService.getAcseCv(this.saveAcseCv.tranId)).
                        pipe(map(([ae,prl,cv]) => { return { ae, prl, cv};}));

    forkRes.subscribe(data => {
      console.log(data);
      var totalPrl = arrSum(data['prl']['acseCvPaytReqList'].map(e => e.reqAmt));
      var totalCredit = arrSum(data['ae']['acctEntries'].map(e => e.foreignCreditAmt));
      var totalDebit = arrSum(data['ae']['acctEntries'].map(e => e.foreignDebitAmt));
      var cvAmt = data['cv']['acseCvList'][0].cvAmt;

      if((cvAmt != totalPrl) && (totalCredit != totalDebit)){
        this.warnMsg = 'Total amount of attached payments must be equal to CV amount and \nTotal Debit and Total Credit amounts in the Accounting Entries must be balanced.';
        this.warnMdl.openNoClose();
      }else if((cvAmt == totalPrl) && (totalCredit != totalDebit)){
        this.warnMsg = 'Total Debit and Credit amounts in the Accounting Entries must be balanced.';
        this.warnMdl.openNoClose();
      }else if((cvAmt != totalPrl) && (totalCredit == totalDebit)){
        this.warnMsg = 'Total amount of attached payments must be equal to CV amount.';
        this.warnMdl.openNoClose();
      }else{
        this.fromBtn = 'approve-req';
        this.approvalCd = 'AC003';
        this.overrideFunc('AC003');
      }
    });
  }

  print(){
    let params = {
          tranId: this.saveAcseCv.tranId,
          printerName: this.printData.selPrinter,
          pageOrientation: 'LANDSCAPE',
          paperSize: 'LETTER'
        };

    let cvParams    = Object.assign({},params);
    $.extend(cvParams,{reportName: 'ACSER_CV'});
    let checkParams = Object.assign({},params);
    $.extend(checkParams,{reportName: 'ACSER_CV_CHECK'});

    if(this.printData.printCv && this.printData.printCheck){
      if(this.printData.destination == 'screen'){
        window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACSER_CV' + '&userId=' + 
                      this.ns.getCurrentUser() + '&tranId=' + this.saveAcseCv.tranId + '&reportType=' + this.printData.reportType, '_blank');
        window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACSER_CV_CHECK' + '&tranId=' + this.saveAcseCv.tranId, '_blank');
      }else if(this.printData.destination == 'printer'){
        var subRes = forkJoin(this.ps.directPrint(cvParams),this.ps.directPrint(checkParams)).pipe(map(([cv,ck]) => { return { cv, ck };}));
        subRes.subscribe(data => {
          console.log(data);
        });
      }
    }else{
      if(this.printData.printCv){
        if(this.printData.destination == 'screen'){
          window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACSER_CV' + '&userId=' + 
                      this.ns.getCurrentUser() + '&tranId=' + this.saveAcseCv.tranId + '&reportType=' + this.printData.reportType, '_blank');
        }else if(this.printData.destination == 'printer'){
          this.ps.directPrint(cvParams).subscribe(data => {
            console.log(data);
          });
        }
      }else if(this.printData.printCheck){
        if(this.printData.destination == 'screen'){
          window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACSER_CV_CHECK' + '&tranId=' + this.saveAcseCv.tranId, '_blank');
        }else if(this.printData.destination == 'printer'){
          this.ps.directPrint(checkParams).subscribe(data => {
            console.log(data);
          });
        }
      }
    }
  }

  onClickYesConfirmed(stat){
    this.loadingFunc(true);
    this.confirmMdl.closeModal();
    var updateAcseCvStat = {
      tranId       : this.saveAcseCv.tranId,
      checkId      : this.saveAcseCv.checkId,
      cvStatus     : stat,
      printType    : (this.printData.printCv && this.printData.printCheck)?'ALL':(this.printData.printCv)?'PCV':'PCK',
      updateUser   : this.ns.getCurrentUser(),
      cancelReason : this.saveAcseCv.cancelReason
    };
    console.log(updateAcseCvStat);
    this.accountingService.updateAcseCvStat(JSON.stringify(updateAcseCvStat))
    .subscribe(data => {
      console.log(data);
      this.loadingFunc(false);
      this.fromSave = true;
      this.getAcseCv();
      (!this.spoiled)?this.disableFlds(true):this.form.control.markAsDirty();
      this.printData.destination = '';
      this.printData.selPrinter = '';
      this.printData.printCv = false;
      this.printData.printCheck = false;
      this.printData.reportType = 0;
    });
  }

  onYesConfirmed(){
    console.log(this.fromBtn);
    this.spoiled = false;
    if(this.fromBtn.toLowerCase() == 'print'){
      this.onClickYesConfirmed('P');
    }else if(this.fromBtn.toLowerCase() == 'cancel-req'){
      if(this.saveAcseCv.cancelReason == '' || this.saveAcseCv.cancelReason == null){
        this.dialogIcon = 'error';
        this.success.open();
        $('.warn').focus().blur();
      }else{
        this.onClickYesConfirmed('X');
      }
    }else if(this.fromBtn.toLowerCase() == 'approve-req'){
      this.onClickYesConfirmed('A');
    }else if(this.fromBtn.toLowerCase() == 'spoil'){
      this.onClickYesConfirmed('S');
      this.spoiledFunc();
    }
  }

  loadingFunc(bool){
    var str = bool?'block':'none';
    $('.globalLoading').css('display',str);
  }

  spoiledFunc(){
    this.suggestCheckNo = '';
    this.saveAcseCv.checkId = '';

    if(this.saveAcseCv.cvStatus == 'X'){
      this.spoiled = false;
      $('.cl-spoil').prop('readonly',true);
    }else{
      this.spoiled = true;
      $('.cl-spoil').prop('readonly',false);
      this.getAcseCheckSeries(this.saveAcseCv.bank,this.saveAcseCv.bankAcct);
    }
  }

  overrideFunc(approvalCd){
    this.loadingFunc(true);
    this.mtnService.getMtnApprovalFunction(approvalCd)
    .subscribe(data => {
      var approverList = data['approverFn'].map(e => e.userId);
      if(approverList.includes(this.ns.getCurrentUser())){
        if(this.fromBtn == 'print'){
          this.printData.destination = 'screen';
          this.printData.reportType  = 2;
          this.printData.printCv     = true;
          this.printMdl.openNoClose();
        }else{
          this.confirmMdl.openNoClose();
        }
      }else{
        this.overrideLogin.getApprovalFn();
        this.overrideLogin.overrideMdl.openNoClose();
      }
    });
  }

  onOkOverride(result){
    if(result){
      if(this.fromBtn == 'print'){
        this.printMdl.openNoClose();
      }else{
        this.confirmMdl.openNoClose();
      }
    }
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
      this.success.open();
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
     this.success.open();
   }else{
     this.uploadLoading = true;
     this.up.uploadMethod(this.acctEntryFile, 'acct_entries', 'ACSE', 'CV', this.saveAcseCv.tranId);
     /*setTimeout(()=>{
       if(this.emitMessage.length === 0){
         this.dialogIcon = 'info';
         this.dialogMessage = 'Upload successfully.';
         this.fileName = '';
         this.acctEntryFile = undefined;
         this.success.open();
       }else{
         this.dialogIcon = 'error-message';
         this.dialogMessage = this.emitMessage;
         this.success.open();
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
     this.success.open();
     this.uploadLoading = false;
    }else{
      if(event.toUpperCase() == 'UPLOAD DONE'){
            this.uploadLoading = false;
        }else if(event.toUpperCase() == 'SUCCESS'){
          this.dialogIcon = 'info';
          this.dialogMessage = 'Upload successfully.';
          this.fileName = '';
          this.acctEntryFile = undefined;
          this.success.open();
          this.uploadLoading = false;
          this.upAcctEntMdl.closeModal();
        }
    }
  }

  canUploadAcctEntMethod(){
    this.mtnService.getMtnParameters('V', 'ACSECV_ACCTENTRY_UPLOAD').subscribe(
       (data:any)=>{
         if(data.parameters.length !== 0){
            this.canUploadAcctEnt = data.parameters[0].paramValueV == 'Y';
         }
         else{
           this.canUploadAcctEnt = false;
         }
       }
    );
  }

  getPrinters(){
    this.ps.getPrinters()
    .subscribe(data => {
      this.printData.printers = data;
    });
  }

  validateCheck(){
    if(this.saveAcseCv.checkStatus == 'P' || this.saveAcseCv.checkStatus == 'S'){
      this.warnMsg = (this.saveAcseCv.checkStatus == 'P')?'This check has already been printed.\nPlease Spoil Check to generate new Check No.'
                                                         :'This check has been spoiled. \nPlease save your changes first before printing this check.';
      this.warnMdl.openNoClose();
      this.printData.printCheck = false;
      $('#checkCbId').prop('checked',false);
    }
  }

  clearPrinterName(){
    (this.printData.destination != 'printer')?this.printData.selPrinter='':''
  }

  padCheckNo() {
    if(this.saveAcseCv.checkNo !== null && this.saveAcseCv.checkNo !== '') {
      this.saveAcseCv.checkNo = String(this.saveAcseCv.checkNo).padStart(this.chkNoDigits, '0');
    }
  }

  onChangeDisbType() {
    if(this.saveAcseCv.disbType == 'BT') {
      this.saveAcseCv.checkNo = '';
      this.saveAcseCv.checkDate = '';
      this.saveAcseCv.checkClass = '';
      this.saveAcseCv.checkClassDesc = '';
    } else if(this.saveAcseCv.disbType == 'CK') {
      this.saveAcseCv.destBank = '';
      this.saveAcseCv.destBankDesc = '';
      this.saveAcseCv.destAcctNo = '';
      this.saveAcseCv.btRefNo = '';
      this.saveAcseCv.destAcctName = '';
      this.saveAcseCv.swiftCd = '';
      this.getAcseCheckSeries(this.saveAcseCv.bank, this.saveAcseCv.bankAcct);
      this.saveAcseCv.checkDate = this.ns.toDateTimeString(0);

      for(let x of this.checkClassList) {
        if(x.code == 'LC') {
          this.saveAcseCv.checkClass = x.code;
          this.saveAcseCv.checkClassDesc = x.description;

          break;
        }
      }
    }
  }

}
