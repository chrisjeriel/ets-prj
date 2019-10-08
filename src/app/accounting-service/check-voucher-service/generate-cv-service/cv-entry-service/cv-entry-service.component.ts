import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
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
  @ViewChild('printmMdl') printmMdl           : ModalComponent;
  @ViewChild('warnMdl') warnMdl               : ModalComponent;
  @ViewChild('myForm') form                   : NgForm;

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
    updateUser    : ''
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
  passDataLov  : any = {
    selector     : '',
    payeeClassCd : ''
  };

  lovCheckBox:boolean = true;
 

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal, private ns: NotesService, 
              private mtnService: MaintenanceService,private activatedRoute: ActivatedRoute,  private router: Router, private decPipe: DecimalPipe) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-Serv | CV Entry");

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
    var subRes = forkJoin(this.accountingService.getAcseCv(this.saveAcseCv.tranId), this.mtnService.getMtnPrintableName(''), this.mtnService.getRefCode('CHECK_CLASS'),this.mtnService.getRefCode('ACSE_CHECK_VOUCHER.CV_STATUS'),this.mtnService.getRefCode('MTN_ACSE_TRAN_TYPE.GROUP_TAG'))
                          .pipe(map(([cv,pn,cl,stat,prt]) => { return { cv, pn, cl,stat, prt }; }));

    var subRes2 = forkJoin(this.accountingService.getAcseCvPaytReqList(this.saveAcseCv.tranId), this.accountingService.getAcseAcctEntries(this.saveAcseCv.tranId), this.mtnService.getMtnBankAcct(),this.mtnService.getMtnAcseCheckSeries())
                            .pipe(map(([prl,ae,ba,cn]) => { return { prl, ae, ba, cn }; }));

    var subRes3 = forkJoin(subRes,subRes2).pipe(map(([sub1,sub2]) => { return { sub1,sub2 }; }));

    subRes3.subscribe(data => {
      console.log(data);
      this.loadingFunc(false);
      var recPn   = data['sub1']['pn']['printableNames'];
      var recCl   = data['sub1']['cl']['refCodeList'];
      var recStat = data['sub1']['stat']['refCodeList'];
      var recPrt  = data['sub1']['prt']['refCodeList'];
      var recCn   = data['sub2']['cn']['checkSeriesList'];

      this.cvStatList      = recStat;
      this.checkSeriesList = recCn;

      this.bankAcctList = data['sub2']['ba']['bankAcctList'];
      var arrSum = function(arr){return arr.reduce((a,b) => a+b,0);};
       var totalPrl = arrSum(data['sub2']['prl']['acseCvPaytReqList'].map(e => e.reqAmt));
      // var totalCredit = arrSum(data['sub2']['ae']['list'].map(e => e.foreignCreditAmt));
      // var totalDebit = arrSum(data['sub2']['ae']['list'].map(e => e.foreignDebitAmt));

      var totalCredit = 0;
      var totalDebit = 0;


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

        recPn.forEach(e => {
          if(e.userId.toUpperCase() == this.ns.getCurrentUser().toUpperCase()){
            this.saveAcseCv.preparedByName  = e.printableName;
            this.saveAcseCv.preparedBy   = e.userId;
            this.saveAcseCv.preparedByDes = e.designation;
          }
        });
      }else{
        var recCv = data['sub1']['cv']['acseCvList'].map(e => {
          e.createDate = this.ns.toDateTimeString(e.createDate);
          e.updateDate = this.ns.toDateTimeString(e.updateDate);
          e.cvDate     = this.ns.toDateTimeString(e.cvDate);
          e.checkDate  = this.ns.toDateTimeString(e.checkDate);
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
        this.existsInCvDtl = ((data['sub2']['prl']['acseCvPaytReqList']).length == 0)?false:true;

        this.isTotPrlEqualCvAmt = (totalPrl==0)?false:((Number(totalPrl) == Number(recCv[0].cvAmt))?true:false);
        this.isTotDebCredBalanced = (Number(totalCredit) == Number(totalDebit))?true:false;

        if(this.fromSave){
          this.dialogIcon = '';
          this.dialogMessage = '';
          this.success.open();
          this.fromSave = false;
        }
      }

      this.saveAcseCv['from'] = 'cv';
      this.cvData.emit(this.saveAcseCv);
      ((this.saveAcseCv.cvStatus == 'N' || this.saveAcseCv.cvStatus == 'F')?this.disableFlds(false):this.disableFlds(true));
      this.setLocalAmt();
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
      payeeNo       : '',
      postDate      : '',
      preparedBy    : '',
      preparedDate  : '',
      tranId        : '',
      tranStat      : '',
      updateDate    : '',
      updateUser    : ''
    };
    this.getAcseCv();
    this.disableFlds(false);
    this.existsInCvDtl = false;
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;

    if(this.saveAcseCv.cvDate == null || this.saveAcseCv.cvDate == '' || this.saveAcseCv.payee == '' ||  this.saveAcseCv.payee == null || this.saveAcseCv.particulars == '' || 
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
      checkNo          : this.saveAcseCv.checkNo,
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
      updateUser       : this.ns.getCurrentUser()
    };

    console.log(saveCv);
    this.accountingService.saveAcseCv(JSON.stringify(saveCv))
    .subscribe(data => {
      console.log(data);
      this.fromSave = true;
      this.saveAcseCv.tranId = data['tranIdOut'];
      this.saveAcseCv.mainTranId = data['mainTranIdOut'];
      this.getAcseCv();
      this.form.control.markAsPristine();
    });
  }

  showLov(fromUser){
    console.log(fromUser);
    if(fromUser.toLowerCase() == 'payee'){
      this.passDataLov.selector = 'payee';
      // if(this.saveAcseCv.paytReqType == 'S'){
      //   this.passDataLov.payeeClassCd = 2;
      // }else if(this.saveAcseCv.paytReqType == 'I'){
      //   this.passDataLov.payeeClassCd = 3;
      // }else{
      //   this.passDataLov.payeeClassCd = (this.saveAcseCv.paytReqType == '' || this.saveAcseCv.paytReqType == null)?'':1;
      // }
      this.payeeLov.openLOV();
    }else if(fromUser.toLowerCase() == 'bank'){
      this.passDataLov.selector = 'mtnBank';
      this.bankLov.openLOV();
    }else if(fromUser.toLowerCase() == 'bank-acct'){
      this.passDataLov.selector = 'bankAcct';
      this.passDataLov.currCd = this.saveAcseCv.currCd;
      this.passDataLov.bankCd = this.saveAcseCv.bank;
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

  setData(data,from){
    this.removeRedBackShad(from);
    this.form.control.markAsDirty();
    this.ns.lovLoader(data.ev, 0);
    if(from.toLowerCase() == 'payee'){
      this.saveAcseCv.payee   = data.data.payeeName;
      this.saveAcseCv.payeeCd = data.data.payeeNo;
      this.saveAcseCv.payeeClassCd = data.data.payeeClassCd;
    }else if(from.toLowerCase() == 'bank'){
      this.saveAcseCv.bankDesc   = data.data.officialName;
      this.saveAcseCv.bank = data.data.bankCd;
      this.saveAcseCv.bankAcctDesc = '';
      this.saveAcseCv.bankAcct = '';
      var ba = this.bankAcctList.filter(e => e.bankCd == data.data.bankCd && e.currCd == this.saveAcseCv.currCd && e.acseGlDepNo != null);
      if(ba.length == 1){
        this.saveAcseCv.bankAcctDesc   = ba[0].accountNo;
        this.saveAcseCv.bankAcct = ba[0].bankAcctCd;
        var chkNo = this.checkSeriesList.filter(e => e.bank == this.saveAcseCv.bank && e.bankAcct == this.saveAcseCv.bankAcct && e.usedTag == 'N').sort((a,b) => a.checkNo - b.checkNo);
        if(this.saveAcseCv.checkNo == '' || this.saveAcseCv.checkNo == null){
          this.saveAcseCv.checkNo = chkNo[0].checkNo;
        } 
      }
    }else if(from.toLowerCase() == 'bank-acct'){
      this.saveAcseCv.bankAcctDesc   = data.data.accountNo;
      this.saveAcseCv.bankAcct = data.data.bankAcctCd;
      var chkNo = this.checkSeriesList.filter(e => e.bank == this.saveAcseCv.bank && e.bankAcct == this.saveAcseCv.bankAcct && e.usedTag == 'N').sort((a,b) => a.checkNo - b.checkNo);
      if(this.saveAcseCv.checkNo == '' || this.saveAcseCv.checkNo == null){
        this.saveAcseCv.checkNo = chkNo[0].checkNo;
      }
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
      var ba = this.bankAcctList.filter(e => e.bankCd == this.saveAcseCv.bank && e.currCd == data.currencyCd && e.acseGlDepNo != null);
      console.log(ba);
      if(ba.length == 1){
        this.saveAcseCv.bankAcctDesc   = ba[0].accountNo;
        this.saveAcseCv.bankAcct = ba[0].bankAcctCd; 
      }
      this.setLocalAmt();
    }else if(from.toLowerCase() == 'prep-user'){
      this.saveAcseCv.preparedByName = data.printableName;
      this.saveAcseCv.preparedBy  = data.userId;
      this.saveAcseCv.preparedDes  = data.designation;
    }else if(from.toLowerCase() == 'cert-user'){
      this.saveAcseCv.certifiedByName = data.printableName;
      this.saveAcseCv.certifiedBy  = data.userId;
      this.saveAcseCv.certifiedDes  = data.designation;
    }
  }

  setLocalAmt(){
    this.saveAcseCv.localAmt = Number(String(this.saveAcseCv.cvAmt).replace(/\,/g,'')) * Number(String(this.saveAcseCv.currRate).replace(/\,/g,''));
    this.saveAcseCv.cvAmt =  this.decPipe.transform(Number(String(this.saveAcseCv.cvAmt).replace(/\,/g,'')),'0.2-2');
    this.saveAcseCv.localAmt = this.decPipe.transform(Number(String(this.saveAcseCv.localAmt).replace(/\,/g,'')),'0.2-2');
    this.saveAcseCv.currRate = (this.saveAcseCv.currRate == 0)?'':this.decPipe.transform(Number(String(this.saveAcseCv.currRate).replace(/\,/g,'')),'0.9-9');
  }

  checkCode(event,from){
    this.ns.lovLoader(event.ev, 1);
    if(from.toLowerCase() == 'curr'){
      this.currLov.checkCode(this.saveAcseCv.currCd.toUpperCase(),event.ev);
    }else if(from.toLowerCase() == 'prep-user'){
      this.prepUserLov.checkCode(this.saveAcseCv.preparedBy.toUpperCase(),event.ev);
    }
  }

  checkCancel(){
    if(this.cancelFlag == true){
      if(this.fromCancel){
        this.cancelBtn.onNo();
      }else{
        return;
      }
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
    console.log('PRL=cvAmt? : ' + this.isTotPrlEqualCvAmt + ' AND ' + 'Credit=Debit? : ' + this.isTotDebCredBalanced);
    if(!this.isTotPrlEqualCvAmt && !this.isTotDebCredBalanced){
      this.warnMsg = 'Total amount of attached payments must be equal to CV amount and Total Debit and Credit amounts in the Accounting Entries must be balanced.';
      this.warnMdl.openNoClose();
    }else if(this.isTotPrlEqualCvAmt && !this.isTotDebCredBalanced){
      this.warnMsg = 'Total Debit and Credit amounts in the Accounting Entries must be balanced.';
      this.warnMdl.openNoClose();
    }else if(!this.isTotPrlEqualCvAmt && this.isTotDebCredBalanced){
      this.warnMsg = 'Total amount of attached payments must be equal to CV amount.';
      this.warnMdl.openNoClose();
    }else{
      this.fromBtn = 'approve-req';
      this.confirmMdl.openNoClose();
    }
  }

  print(){
    window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACseR_CV' + '&userId=' + 
                      this.ns.getCurrentUser() + '&tranId=' + this.saveAcseCv.tranId, '_blank');
  }

  onClickYesConfirmed(stat){
    this.loadingFunc(true);
    this.confirmMdl.closeModal();
    var updateAcseCvStat = {
      tranId       : this.saveAcseCv.tranId,
      cvStatus     : stat,
      updateUser  : this.ns.getCurrentUser()
    };
    console.log(updateAcseCvStat);
    this.accountingService.updateAcseCvStat(JSON.stringify(updateAcseCvStat))
    .subscribe(data => {
      console.log(data);
      this.loadingFunc(false);
      // this.saveAcseCv.cvStatus = stat;
      // this.saveAcseCv.cvStatusDesc = this.cvStatList.filter(e => e.code == this.saveAcseCv.cvStatus).map(e => e.description);
      // this.dialogIcon = '';
      // this.dialogMessage = '';
      // this.success.open();
      this.fromSave = true;
      this.getAcseCv();
      this.disableFlds(true);
    });
  }

  onYesConfirmed(){
    console.log(this.fromBtn);
    if(this.fromBtn.toLowerCase() == 'print'){
      this.onClickYesConfirmed('P');
    }else if(this.fromBtn.toLowerCase() == 'cancel-req'){
      this.onClickYesConfirmed('X');
    }else if(this.fromBtn.toLowerCase() == 'approve-req'){
      this.onClickYesConfirmed('A');
    }
  }

  loadingFunc(bool){
    var str = bool?'block':'none';
    $('.globalLoading').css('display',str);
  }

}
