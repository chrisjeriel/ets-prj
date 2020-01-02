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
  selector: 'app-cv-entry',
  templateUrl: './cv-entry.component.html',
  styleUrls: ['./cv-entry.component.css']
})
export class CvEntryComponent implements OnInit {
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
  @ViewChild('override') overrideLogin: OverrideLoginComponent;
  @ViewChild('AcctEntries') upAcctEntMdl      : ModalComponent;
  @ViewChild(UploaderComponent) up            : UploaderComponent;

  @Output() cvData : EventEmitter<any> = new EventEmitter();
  @Input() passData: any = {
    tranId : ''
  };

  saveAcitCv : any = {
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
  destination          : string = '';
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

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal, private ns: NotesService, 
              private mtnService: MaintenanceService,private activatedRoute: ActivatedRoute,  private router: Router, private decPipe: DecimalPipe, private ps : PrintService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | CV Entry");

    this.canUploadAcctEntMethod();

    this.sub = this.activatedRoute.params.subscribe(params => {
      if(this.passData.tranId == '') {
        if(Object.keys(params).length != 0 ){
          this.saveAcitCv.tranId = params['tranId'];
        } else {
        }
      } else {
        this.saveAcitCv.tranId = this.passData.tranId;
      }

     this.getAcitCv();
    });
  }

  getAcitCv(){
    this.loadingFunc(true);
    const subResKey = ['pn'];
    // const subResKey = ['pn','ba','cn'];
    //const subResKey2 = ['ba','cn'];

    const arrSubRes = {
      'pn'  :this.mtnService.getMtnPrintableName(''),
      //'ba'  : this.mtnService.getMtnBankAcct(),
      //'cn'  : this.mtnService.getMtnAcitCheckSeries()
      //'cl'  :this.mtnService.getRefCode('CHECK_CLASS'),
      //'stat':this.mtnService.getRefCode('ACIT_CHECK_VOUCHER.CV_STATUS'),
      //'prt' :this.mtnService.getRefCode('MTN_ACIT_TRAN_TYPE.GROUP_TAG')
    };

    // const arrSubRes2 = {
    //   'ba'  : this.mtnService.getMtnBankAcct(),
    //   'cn'  : this.mtnService.getMtnAcitCheckSeries()
    // };

    if(this.saveAcitCv.tranId != '' && this.saveAcitCv.tranId != null && this.saveAcitCv.tranId != undefined){
      $.extend(arrSubRes,{
        'cv'  :this.accountingService.getAcitCv(this.saveAcitCv.tranId)
      });
      // $.extend(arrSubRes2,{
      //   'ae'  : this.accountingService.getAcitAcctEntries(this.saveAcitCv.tranId),
      //   'prl' : this.accountingService.getAcitCvPaytReqList(this.saveAcitCv.tranId)
      // });
      subResKey.push('cv');
      //subResKey2.push('ae','prl');
    }

    var subRes  = forkJoin(Object.values(arrSubRes)).pipe(map((a) => { 
      var obj = {};
      subResKey.forEach((e,i) => {obj[e] = a[i];});
      return obj;
    }));
    
    // var subRes2 = forkJoin(Object.values(arrSubRes2)).pipe(map((b) => { 
    //   var obj = {};
    //   subResKey2.forEach((e,i) => {obj[e] = b[i];});
    //   return obj;
    // }));

    //var subRes3 = forkJoin(subRes,subRes2).pipe((map(([sub1,sub2]) => { return { sub1, sub2 }; })));

    subRes.subscribe(data => {
      console.log(data);
      this.loadingFunc(false);
      var recPn   = data['pn']['printableNames'];
      //var recCl   = data['sub1']['cl']['refCodeList'];
      //var recStat = data['sub1']['stat']['refCodeList'];
      //var recPrt  = data['sub1']['prt']['refCodeList'];
      //var recCn   = data['cn']['checkSeriesList'];

      //this.cvStatList      = recStat;
     // this.checkSeriesList = recCn;

      //this.bankAcctList = data['ba']['bankAcctList'];
      //var arrSum = function(arr){return parseFloat(arr.reduce((a,b) => a+b,0).toFixed(2));};
      
      if(this.saveAcitCv.tranId == '' || this.saveAcitCv.tranId == null){
        this.loadingFunc(false);
        this.saveAcitCv.cvStatus = 'N';
        //this.saveAcitCv.cvStatusDesc = recStat.filter(e => e.code == this.saveAcitCv.cvStatus).map(e => e.description);
        this.saveAcitCv.cvStatusDesc = 'New';
        this.saveAcitCv.cvDate = this.ns.toDateTimeString(0);
        this.saveAcitCv.cvAmt = 0;
        this.saveAcitCv.currCd = 'PHP';
        this.saveAcitCv.currRate = 1;
        this.saveAcitCv.checkClass = 'LC';
        this.saveAcitCv.checkClassDesc = 'Local Clearing';
        //this.saveAcitCv.checkClassDesc = recCl.filter(e => e.code == this.saveAcitCv.checkClass).map(e => e.description);
        this.saveAcitCv.preparedDate = this.ns.toDateTimeString(0);
        this.saveAcitCv.checkDate = this.ns.toDateTimeString(0);

        recPn.forEach(e => {
          if(e.userId.toUpperCase() == this.ns.getCurrentUser().toUpperCase()){
            this.saveAcitCv.preparedByName  = e.printableName;
            this.saveAcitCv.preparedBy   = e.userId;
            this.saveAcitCv.preparedDes = e.designation;
          }
        });
      }else{
        // var totalPrl = arrSum(data['sub2']['prl']['acitCvPaytReqList'].map(e => e.reqAmt));
        // var totalCredit = arrSum(data['sub2']['ae']['list'].map(e => e.foreignCreditAmt));
        // var totalDebit = arrSum(data['sub2']['ae']['list'].map(e => e.foreignDebitAmt));
        var recCv = data['cv']['acitCvList'].map(e => {
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
              this.saveAcitCv.preparedBy = e2.userId;
              e.preparedDes = e2.designation;
            }
            if(e.certifiedBy == e2.userId){
              e.certifiedByName = e2.printableName;
              this.saveAcitCv.certifiedBy = e2.userId;
              e.certifiedDes = e2.designation;
            }
          });
          return e;
        });

        this.saveAcitCv = Object.assign(this.saveAcitCv,recCv[0]);
        console.log(this.saveAcitCv);
        // this.existsInCvDtl = ((data['sub2']['prl']['acitCvPaytReqList']).length == 0)?false:true;
        this.existsInCvDtl = (this.saveAcitCv.prlExist == 'Y')?true:false;

        // console.log(totalCredit);
        // console.log(totalDebit);
        // this.isTotPrlEqualCvAmt = (totalPrl==0)?false:((Number(totalPrl) == Number(recCv[0].cvAmt))?true:false);
        // this.isTotDebCredBalanced = (Number(totalCredit) == Number(totalDebit))?true:false;

        (this.saveAcitCv.cvStatus == 'A' || this.saveAcitCv.cvStatus == 'P') ? this.getPrinters() : '';

        // if(this.fromSave){
        //   this.dialogIcon = '';
        //   this.dialogMessage = '';
        //   this.success.open();
        //   this.fromSave = false;
        // }

        this.saveAcitCv.checkNo = (this.suggestCheckNo == '' || this.suggestCheckNo == undefined || this.suggestCheckNo == null)?this.saveAcitCv.checkNo:this.suggestCheckNo;
      }

      this.saveAcitCv['from'] = 'cv';
      this.saveAcitCv['exitLink'] = 'check-voucher';
      this.cvData.emit(this.saveAcitCv);
      (this.spoiled)?'':((this.saveAcitCv.cvStatus == 'N' || this.saveAcitCv.cvStatus == 'F')?this.disableFlds(false):this.disableFlds(true));
      this.setLocalAmt();
      if(this.saveAcitCv.checkStatus == 'S'){
          this.spoiledFunc();
      }
    });
  }

  onClickNewCv(){
    this.saveAcitCv  = {
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
      payeeNo       : '',
      payeeCd       : '',
      postDate      : '',
      preparedBy    : '',
      preparedDate  : '',
      tranId        : '',
      tranStat      : '',
      updateDate    : '',
      updateUser    : ''
    };
    this.getAcitCv();
    this.disableFlds(false);
    this.existsInCvDtl = false;
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;

    if(this.saveAcitCv.cvDate == null || this.saveAcitCv.cvDate == '' || this.saveAcitCv.payeeCd == '' ||  this.saveAcitCv.payeeCd == null || this.saveAcitCv.payee == '' ||  this.saveAcitCv.payee == null || this.saveAcitCv.particulars == '' || 
       this.saveAcitCv.particulars == null || this.saveAcitCv.bank == '' || this.saveAcitCv.bank == null || this.saveAcitCv.bankAcct == '' || this.saveAcitCv.bankAcct == null ||
       this.saveAcitCv.cvAmt == '' || this.saveAcitCv.cvAmt == null || this.saveAcitCv.cvAmt < 0 ||  this.saveAcitCv.checkNo == '' || this.saveAcitCv.checkNo == null || this.saveAcitCv.currCd == '' || 
       this.saveAcitCv.currCd == null || this.saveAcitCv.currRate == '' || this.saveAcitCv.currRate == null || this.saveAcitCv.checkDate == '' || this.saveAcitCv.checkDate == null ||
       this.saveAcitCv.preparedBy == '' || this.saveAcitCv.preparedBy == null || this.saveAcitCv.preparedDate == '' || this.saveAcitCv.preparedDate == null || 
       this.saveAcitCv.checkClass == '' || this.saveAcitCv.checkClass == null || this.saveAcitCv.paytReqType == '' || this.saveAcitCv.paytReqType == null ){
        this.dialogIcon = 'error';
        this.success.open();
        this.saveAcitCv.checkDate == '' ? $('.checkDateWarn').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
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
    console.log(this.saveAcitCv);
  }

  onSaveAcitCv(){
    var saveCv = {
      bank             : this.saveAcitCv.bank,
      bankAcct         : this.saveAcitCv.bankAcct,
      certifiedBy      : this.saveAcitCv.certifiedBy,
      certifiedDate    : (this.saveAcitCv.certifiedDate == '' || this.saveAcitCv.certifiedDate == null)?'':this.ns.toDateTimeString(this.saveAcitCv.certifiedDate),
      checkClass       : this.saveAcitCv.checkClass,
      checkDate        : (this.saveAcitCv.checkDate == '' || this.saveAcitCv.checkDate == null)?this.ns.toDateTimeString(0):this.saveAcitCv.checkDate,
      checkId          : this.saveAcitCv.checkId,
      checkNo          : this.saveAcitCv.checkNo,
      closeDate        : this.ns.toDateTimeString(this.saveAcitCv.mainCloseDate),
      createDate       : (this.saveAcitCv.createDate == '' || this.saveAcitCv.createDate == null)?this.ns.toDateTimeString(0):this.saveAcitCv.createDate,
      createUser       : (this.saveAcitCv.createUser == '' || this.saveAcitCv.createUser == null)?this.ns.getCurrentUser():this.saveAcitCv.createUser,
      currCd           : this.saveAcitCv.currCd,
      currRate         : Number(String(this.saveAcitCv.currRate).replace(/\,/g,'')),
      cvAmt            : Number(String(this.saveAcitCv.cvAmt).replace(/\,/g,'')),
      cvDate           : (this.saveAcitCv.cvDate == '' || this.saveAcitCv.cvDate == null)?this.ns.toDateTimeString(0):this.saveAcitCv.cvDate,
      cvNo             : this.saveAcitCv.cvNo,
      cvStatus         : this.saveAcitCv.cvStatus,
      cvYear           : this.saveAcitCv.cvYear,
      deleteDate       : this.ns.toDateTimeString(this.saveAcitCv.mainDeleteDate),
      localAmt         : Number(String(this.saveAcitCv.localAmt).replace(/\,/g,'')),
      mainTranId       : this.saveAcitCv.mainTranId,
      particulars      : this.saveAcitCv.particulars,
      paytReqType      : this.saveAcitCv.paytReqType,
      payee            : this.saveAcitCv.payee,
      payeeCd          : this.saveAcitCv.payeeCd,
      payeeClassCd     : this.saveAcitCv.payeeClassCd,
      postDate         : this.ns.toDateTimeString(this.saveAcitCv.mainPostDate),
      preparedBy       : this.saveAcitCv.preparedBy,
      preparedDate     : (this.saveAcitCv.preparedDate == '' || this.saveAcitCv.preparedDate == null)?this.ns.toDateTimeString(0):this.saveAcitCv.preparedDate,
      tranId           : this.saveAcitCv.tranId,
      tranStat         : this.saveAcitCv.mainTranStat,
      updateDate       : this.ns.toDateTimeString(0),
      updateUser       : this.ns.getCurrentUser()
    };

    (this.spoiled)?this.saveAcitCv.checkId='':'';
    console.log(saveCv);

    this.accountingService.saveAcitCv(JSON.stringify(saveCv))
    .subscribe(data => {
      console.log(data);
      this.fromSave = true;
      this.spoiled = true;
      
      if(data['returnCode'] == -1){
        this.saveAcitCv.checkNo = '';
        this.saveAcitCv.tranId = data['tranIdOut'];
        this.saveAcitCv.mainTranId = data['mainTranIdOut'];

        this.getAcitCv();
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
        this.warnMsg = 'Unable to proceed. Check No is already been used or does not exist.\nThe lowest available Check No. is '+ data['checkNo'] +'.';
        this.warnMdl.openNoClose();
        this.saveAcitCv.checkNo = Number(data['checkNo']);
      }else if(data['returnCode'] == -100){
        this.saveAcitCv.checkNo = '';
        this.warnMsg = 'There is no Check No available for this Account No.\nPlease proceed to maintenance module to generate Check No.';
        this.warnMdl.openNoClose();
      }
      
    });
  }

  showLov(fromUser){
    console.log(fromUser);
    console.log(this.saveAcitCv.paytReqType);
    if(fromUser.toLowerCase() == 'payee'){
      this.passDataLov.selector = 'payee';
      this.passDataLov.payeeNo = '';
      if(this.saveAcitCv.paytReqType == 'S'){
        this.passDataLov.payeeClassCd = 2;
      }else if(this.saveAcitCv.paytReqType == 'I'){
        this.passDataLov.payeeClassCd = 3;
      }else{
        this.passDataLov.payeeClassCd = (this.saveAcitCv.paytReqType == '' || this.saveAcitCv.paytReqType == null || this.saveAcitCv.paytReqType == 'O')?'':1;
      }
      this.payeeLov.openLOV();
    }else if(fromUser.toLowerCase() == 'bank'){
      //this.passDataLov.selector = 'mtnBank';
      this.passDataLov.selector = 'bankLov';
      this.passDataLov.glDepFor = 'acit';
      this.bankLov.openLOV();
    }else if(fromUser.toLowerCase() == 'bank-acct'){
      this.passDataLov.selector = 'bankAcct';
      this.passDataLov.currCd = this.saveAcitCv.currCd;
      this.passDataLov.bankCd = this.saveAcitCv.bank;
      this.passDataLov.from = 'acit';
      this.bankAcctLov.openLOV();
    }else if(fromUser.toLowerCase() == 'class'){
      this.passDataLov.selector = 'checkClass';
      this.classLov.openLOV();
    }else if(fromUser.toLowerCase() == 'paytreqtype'){
      this.passDataLov.selector = 'paytReqType';
      this.passDataLov.from = 'acit';
      this.paytReqTypeLov.openLOV();
    }else if(fromUser.toLowerCase() == 'curr'){
      this.currLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'prep-user'){
      this.prepUserLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'cert-user'){
      this.certUserLov.modal.openNoClose();
    }
  }

  getAcitCheckSeries(bank,bankAcct){
    this.mtnService.getMtnAcitCheckSeries(bank,bankAcct)
    .subscribe(data => {
      this.loadingFunc(false);
      console.log(data);
      var chckNo = data['checkSeriesList'].filter(e => e.usedTag == 'N').sort((a,b) => a.checkNo - b.checkNo);
      if(chckNo.length == 0){
        this.saveAcitCv.checkNo = '';
        this.suggestCheckNo = '';
        this.warnMsg = 'There is no Check No available for this Account No.\nPlease proceed to maintenance module to generate Check No.';
        this.warnMdl.openNoClose();
      }else{
        this.saveAcitCv.checkNo = chckNo[0].checkNo;
      }
    });
  }

  getBankAcct(bankCd,currCd){
    this.loadingFunc(true);
    this.mtnService.getMtnBankAcct(bankCd)
    .subscribe(data => {
      console.log(data);
      var ba = data['bankAcctList'].filter(e => e.currCd == currCd && e.acItGlDepNo != null);
      if(ba.length == 1){
        this.saveAcitCv.bankAcctDesc   = ba[0].accountNo;
        this.saveAcitCv.bankAcct = ba[0].bankAcctCd;
        this.getAcitCheckSeries(this.saveAcitCv.bank,this.saveAcitCv.bankAcct);
      }else if(ba.length == 0){
        this.saveAcitCv.bankAcctDesc   = '';
        this.saveAcitCv.bankAcct = '';
        this.saveAcitCv.checkNo = '';
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
        this.saveAcitCv.payee   = '';
        this.saveAcitCv.payeeCd = '';
        this.saveAcitCv.payeeClassCd = '';
      }else{
        this.saveAcitCv.payee   = data.data.payeeName;
        this.saveAcitCv.payeeCd = data.data.payeeNo;
        this.saveAcitCv.payeeClassCd = data.data.payeeClassCd;
      }
    }else if(from.toLowerCase() == 'bank'){
      this.saveAcitCv.bankDesc   = data.data.officialName;
      this.saveAcitCv.bank = data.data.bankCd;
      this.saveAcitCv.bankAcctDesc = '';
      this.saveAcitCv.bankAcct = '';
      this.saveAcitCv.checkNo = '';
      this.suggestCheckNo = '';
      this.getBankAcct(data.data.bankCd,this.saveAcitCv.currCd);
      // var ba = this.bankAcctList;
      // var ba = this.bankAcctList.filter(e => e.bankCd == data.data.bankCd && e.currCd == this.saveAcitCv.currCd && e.acItGlDepNo != null);
      // if(ba.length == 1){
      //   this.saveAcitCv.bankAcctDesc   = ba[0].accountNo;
      //   this.saveAcitCv.bankAcct = ba[0].bankAcctCd;
      //   this.getAcitCheckSeries(this.saveAcitCv.bank,this.saveAcitCv.bankAcct);
      //   // var chkNo = this.checkSeriesList.filter(e => e.bank == this.saveAcitCv.bank && e.bankAcct == this.saveAcitCv.bankAcct && e.usedTag == 'N').sort((a,b) => a.checkNo - b.checkNo);
      //   // if(chkNo.length == 0){
      //   //   this.warnMsg = 'There is no Check No available for this Account No.\nPlease proceed to maintenance module to generate Check No.';
      //   //   this.warnMdl.openNoClose();
      //   // }else{
      //   //   this.saveAcitCv.checkNo = chkNo[0].checkNo;
      //   // }
      // }else if(ba.length == 0){
      //   this.warnMsg = 'There is no Bank Account No available for this Bank.\nPlease proceed to maintenance module to generate Bank Account No.';
      //   this.warnMdl.openNoClose();
      // }
    }else if(from.toLowerCase() == 'bank-acct'){
      this.saveAcitCv.bankAcctDesc   = data.data.accountNo;
      this.saveAcitCv.bankAcct = data.data.bankAcctCd;
      this.getAcitCheckSeries(this.saveAcitCv.bank,this.saveAcitCv.bankAcct);
      // var chkNo = this.checkSeriesList.filter(e => e.bank == this.saveAcitCv.bank && e.bankAcct == this.saveAcitCv.bankAcct && e.usedTag == 'N').sort((a,b) => a.checkNo - b.checkNo);
      // if(chkNo.length == 0){
      //   this.saveAcitCv.checkNo = '';
      //   this.suggestCheckNo = '';
      //   this.warnMsg = 'There is no Check No available for this Account No.\nPlease proceed to maintenance module to generate Check No.';
      //   this.warnMdl.openNoClose();
      // }else{
      //   this.saveAcitCv.checkNo = chkNo[0].checkNo;
      // }
    }else if(from.toLowerCase() == 'class'){
      this.saveAcitCv.checkClassDesc   = data.data.description;
      this.saveAcitCv.checkClass = data.data.code;
    }else if(from.toLowerCase() == 'paytreqtype'){
      this.saveAcitCv.paytReqTypeDesc   = data.data.description;
      this.saveAcitCv.paytReqType = data.data.code;
      this.saveAcitCv.particulars  = this.saveAcitCv.paytReqTypeDesc + ((this.saveAcitCv.paytReqType == 'O')?' Payments ':'') + ' for : ';
    }else  if(from.toLowerCase() == 'curr'){
      this.saveAcitCv.currCd = data.currencyCd;
      this.saveAcitCv.currRate =  data.currencyRt;
      this.getBankAcct(this.saveAcitCv.bank,data.currencyCd);
      // var ba = this.bankAcctList.filter(e => e.bankCd == this.saveAcitCv.bank && e.currCd == data.currencyCd && e.acItGlDepNo != null);
      // console.log(ba);
      // if(ba.length == 1){
      //   this.saveAcitCv.bankAcctDesc   = ba[0].accountNo;
      //   this.saveAcitCv.bankAcct = ba[0].bankAcctCd;
      //   this.getAcitCheckSeries(this.saveAcitCv.bank,this.saveAcitCv.bankAcct);
      //   // var chkNo = this.checkSeriesList.filter(e => e.bank == this.saveAcitCv.bank && e.bankAcct == this.saveAcitCv.bankAcct && e.usedTag == 'N').sort((a,b) => a.checkNo - b.checkNo);
      //   // if(chkNo.length == 0){
      //   //   this.saveAcitCv.checkNo = '';
      //   //   this.suggestCheckNo = '';
      //   //   this.warnMsg = 'There is no Check No available for this Account No.\nPlease proceed to maintenance module to generate Check No.';
      //   //   this.warnMdl.openNoClose();
      //   // }else{
      //   //   this.saveAcitCv.checkNo = chkNo[0].checkNo;
      //   // }
      // }else if(ba.length == 0){
      //   this.warnMsg = 'There is no Bank Account No available for this Bank.\nPlease proceed to maintenance module to generate Bank Account No.';
      //   this.warnMdl.openNoClose();
      // }
      this.setLocalAmt();
    }else if(from.toLowerCase() == 'prep-user'){
      this.saveAcitCv.preparedByName = data.printableName;
      this.saveAcitCv.preparedBy  = data.userId;
      this.saveAcitCv.preparedDes  = data.designation;
    }else if(from.toLowerCase() == 'cert-user'){
      this.saveAcitCv.certifiedByName = data.printableName;
      this.saveAcitCv.certifiedBy  = data.userId;
      this.saveAcitCv.certifiedDes  = data.designation;
    }
  }

  setLocalAmt(){
    this.saveAcitCv.localAmt = Number(String(this.saveAcitCv.cvAmt).replace(/\,/g,'')) * Number(String(this.saveAcitCv.currRate).replace(/\,/g,''));
    this.saveAcitCv.cvAmt =  this.decPipe.transform(Number(String(this.saveAcitCv.cvAmt).replace(/\,/g,'')),'0.2-2');
    this.saveAcitCv.localAmt = this.decPipe.transform(Number(String(this.saveAcitCv.localAmt).replace(/\,/g,'')),'0.2-2');
    this.saveAcitCv.currRate = (this.saveAcitCv.currRate == 0)?'':this.decPipe.transform(Number(String(this.saveAcitCv.currRate).replace(/\,/g,'')),'0.6-6');
  }

  checkCode(event,from){
    this.ns.lovLoader(event, 1);
    
    if(from.toLowerCase() == 'curr'){
      this.currLov.checkCode(this.saveAcitCv.currCd.toUpperCase(), event);
    }else if(from.toLowerCase() == 'prep-user'){
      this.prepUserLov.checkCode(this.saveAcitCv.preparedByName.toUpperCase(), event);
    }else if(from.toLowerCase() == 'cert-user') {
      this.certUserLov.checkCode(this.saveAcitCv.certifiedByName.toUpperCase(), event);
    }else if(from.toLowerCase() == 'payee'){
      this.passDataLov.selector = 'payee';
      this.passDataLov.payeeNo = this.saveAcitCv.payeeCd;
      if(this.saveAcitCv.paytReqType == 'S'){
        this.passDataLov.payeeClassCd = 2;
      }else if(this.saveAcitCv.paytReqType == 'I'){
        this.passDataLov.payeeClassCd = 3;
      }else{
        this.passDataLov.payeeClassCd = (this.saveAcitCv.paytReqType == '' || this.saveAcitCv.paytReqType == null || this.saveAcitCv.paytReqType == 'O')?'':1;
      }
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
    // $('.'+fromClass).css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
    $('.'+fromClass).focus().blur();
  }


  setBankAcctData(){
    this.saveAcitCv.bankAcctDesc = '';
    this.saveAcitCv.bankAcct = '';
  }

  onClickOkPrint(){
    console.log('PRL=cvAmt? : ' + this.isTotPrlEqualCvAmt + ' AND ' + 'Credit=Debit? : ' + this.isTotDebCredBalanced);
    console.log(this.saveAcitCv.totalAmtPrl);
    console.log(Number(String(this.saveAcitCv.cvAmt).replace(/\,/g,'')));

    var arrSum = function(arr){return parseFloat(arr.reduce((a,b) => a+b,0).toFixed(2));};
   
    var forkRes = forkJoin(this.accountingService.getAcitAcctEntries(this.saveAcitCv.tranId),this.accountingService.getAcitCvPaytReqList(this.saveAcitCv.tranId),this.accountingService.getAcitCv(this.saveAcitCv.tranId)).
                        pipe(map(([ae,prl,cv]) => { return { ae, prl, cv};}));

    forkRes.subscribe(data => {
      console.log(data);
      var totalPrl = arrSum(data['prl']['acitCvPaytReqList'].map(e => e.reqAmt));
      var totalCredit = arrSum(data['ae']['list'].map(e => e.foreignCreditAmt));
      var totalDebit = arrSum(data['ae']['list'].map(e => e.foreignDebitAmt));
      var cvAmt = data['cv']['acitCvList'][0].cvAmt;

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


    // if((this.saveAcitCv.totalAmtPrl != Number(String(this.saveAcitCv.cvAmt).replace(/\,/g,'')))
    //   && !this.isTotDebCredBalanced){
    //   this.warnMsg = 'Total amount of attached payments must be equal to CV amount and \nTotal Debit and Total Credit amounts in the Accounting Entries must be balanced.';
    //   this.warnMdl.openNoClose();
    // }else if(
    //   // this.isTotPrlEqualCvAmt
    //   (this.saveAcitCv.totalAmtPrl == Number(String(this.saveAcitCv.cvAmt).replace(/\,/g,'')))
    //   && !this.isTotDebCredBalanced){
    //   this.warnMsg = 'Total Debit and Credit amounts in the Accounting Entries must be balanced.';
    //   this.warnMdl.openNoClose();
    // }else if(
    //   // !this.isTotPrlEqualCvAmt
    //   (this.saveAcitCv.totalAmtPrl != Number(String(this.saveAcitCv.cvAmt).replace(/\,/g,'')))
    //    && this.isTotDebCredBalanced){
    //   this.warnMsg = 'Total amount of attached payments must be equal to CV amount.';
    //   this.warnMdl.openNoClose();
    // }else{
    //   this.fromBtn = 'approve-req';
    //   this.approvalCd = 'AC003';
    //   this.overrideFunc('AC003');
    // }
  }

  print(){
    let params = {
          tranId: this.saveAcitCv.tranId,
          printerName: this.printData.selPrinter,
          pageOrientation: 'LANDSCAPE',
          paperSize: 'LETTER'
        };

    let cvParams    = Object.assign({},params);
    $.extend(cvParams,{reportName: 'ACITR_CV'});
    let checkParams = Object.assign({},params);
    $.extend(checkParams,{reportName: 'ACITR_CV_CHECK'});

    if(this.printData.printCv && this.printData.printCheck){
      if(this.printData.destination == 'screen'){
        window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_CV' + '&userId=' + 
                      this.ns.getCurrentUser() + '&tranId=' + this.saveAcitCv.tranId + '&reportType=' + this.printData.reportType, '_blank');
        window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_CV_CHECK' + '&tranId=' + this.saveAcitCv.tranId, '_blank');
      }else if(this.printData.destination == 'printer'){
        var subRes = forkJoin(this.ps.directPrint(cvParams),this.ps.directPrint(checkParams)).pipe(map(([cv,ck]) => { return { cv, ck };}));
        subRes.subscribe(data => {
          console.log(data);
        });
      }
    }else{
      if(this.printData.printCv){
        if(this.printData.destination == 'screen'){
          window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_CV' + '&userId=' + 
                      this.ns.getCurrentUser() + '&tranId=' + this.saveAcitCv.tranId + '&reportType=' + this.printData.reportType, '_blank');
        }else if(this.printData.destination == 'printer'){
          this.ps.directPrint(cvParams).subscribe(data => {
            console.log(data);
          });
        }
      }else if(this.printData.printCheck){
        if(this.printData.destination == 'screen'){
          window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_CV_CHECK' + '&tranId=' + this.saveAcitCv.tranId, '_blank');
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
    var updateAcitCvStat = {
      tranId       : this.saveAcitCv.tranId,
      checkId      : this.saveAcitCv.checkId,
      cvStatus     : stat,
      printType    : (this.printData.printCv && this.printData.printCheck)?'ALL':(this.printData.printCv)?'PCV':'PCK',
      updateUser   : this.ns.getCurrentUser(),
      cancelReason : this.saveAcitCv.cancelReason
    };
    console.log(updateAcitCvStat);
    this.accountingService.updateAcitCvStat(JSON.stringify(updateAcitCvStat))
    .subscribe(data => {
      console.log(data);
      this.loadingFunc(false);
      this.fromSave = true;
      this.getAcitCv();
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
      if(this.saveAcitCv.cancelReason == '' || this.saveAcitCv.cancelReason == null){
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
    $('.cl-spoil').prop('readonly',false);
    this.spoiled = true;
    this.saveAcitCv.checkId = '';
    var chkNo = this.checkSeriesList.filter(e => e.bank == this.saveAcitCv.bank && e.bankAcct == this.saveAcitCv.bankAcct && e.usedTag == 'N').sort((a,b) => a.checkNo - b.checkNo);
    (chkNo.length == 0)?'':this.suggestCheckNo = chkNo[0].checkNo;
  }

  overrideFunc(approvalCd){
    this.loadingFunc(true);
    this.mtnService.getMtnApprovalFunction(approvalCd)
    .subscribe(data => {
      var approverList = data['approverFn'].map(e => e.userId);
      if(approverList.includes(this.ns.getCurrentUser())){
        if(this.fromBtn == 'print'){
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
     this.up.uploadMethod(this.acctEntryFile, 'acct_entries', 'ACIT', 'CV', this.saveAcitCv.tranId);
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
    this.mtnService.getMtnParameters('V', 'ACITCV_ACCTENTRY_UPLOAD').subscribe(
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

  test(){
    console.log(this.printData.printCv);
    console.log(this.printData.printCheck);
    
  }

  getPrinters(){
    this.ps.getPrinters()
    .subscribe(data => {
      this.printData.printers = data;
    });
  }

  validateCheck(){
    if(this.saveAcitCv.checkStatus == 'P' || this.saveAcitCv.checkStatus == 'S'){
      this.warnMsg = (this.saveAcitCv.checkStatus == 'P')?'This check has already been printed.\nPlease Spoil Check to generate new Check No.'
                                                         :'This check has been spoiled. \nPlease save your changes first before printing this check.';
      this.warnMdl.openNoClose();
      this.printData.printCheck = false;
      $('#checkCbId').prop('checked',false);
    }
  }

  clearPrinterName(){
    (this.printData.destination != 'printer')?this.printData.selPrinter='':''
  }


}
