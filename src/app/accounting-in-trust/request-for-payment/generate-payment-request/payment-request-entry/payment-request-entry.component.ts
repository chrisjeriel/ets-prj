import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { AccountingService, NotesService, MaintenanceService,PrintService } from '@app/_services';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { MtnPrintableNamesComponent } from '@app/maintenance/mtn-printable-names/mtn-printable-names.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { environment } from '@environments/environment';
import { NgForm } from '@angular/forms';
import { OverrideLoginComponent } from '@app/_components/common/override-login/override-login.component';


@Component({
  selector: 'app-payment-request-entry',
  templateUrl: './payment-request-entry.component.html',
  styleUrls: ['./payment-request-entry.component.css']
})
export class PaymentRequestEntryComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) success   : SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) cs         : ConfirmSaveComponent;
  @ViewChild('currLov') currLov               : MtnCurrencyComponent;
  @ViewChild('prepUserLov') prepUserLov       : MtnPrintableNamesComponent;
  @ViewChild('reqUserLov') reqUserLov         : MtnPrintableNamesComponent;
  @ViewChild('appUserLov') appUserLov         : MtnPrintableNamesComponent;
  @ViewChild('confirmMdl') confirmMdl         : ModalComponent;
  @ViewChild('warnMdl') warnMdl               : ModalComponent;
  @ViewChild('printMdl') printMdl             : ModalComponent;
  @ViewChild('mainLov') mainLov               : LovComponent;
  @ViewChild('myForm') form                   : NgForm;
  @ViewChild('override') overrideLogin        : OverrideLoginComponent;


  saveAcitPaytReq : any = {
    paytReqNo       : '',
    approvedBy      : '',
    approvedDes     : '',
    approvedDate    : '',
    createDate      : '',
    createUser      : '',
    currCd          : '',
    currRate        : '',
    localAmt        : '',
    particulars     : '',
    payee           : '',
    payeeNo         : '',
    preparedBy      : '',
    preparedDes     : '',
    preparedDate    : '',
    reqAmt          : '',
    reqDate         : '',
    reqId           : '',
    reqMm           : '',
    reqPrefix       : '',
    reqSeqNo        : '',
    reqStatus       : '',
    reqStatusDesc   : '',
    reqYear         : '',
    requestedBy     : '',
    requestedDes    : '',
    tranTypeCd      : '',
    updateDate      : '',
    updateUser      : ''
  };

  dialogMessage     : string = '';
  dialogIcon        : string = '';
  cancelFlag        : boolean;
  reqDateDate       : string = '';
  reqDateTime       : string = '';
  fromCancel        : boolean;
  acitPaytReq       : any;
  tranTypeList      : any[] = [];
  private sub       : any;
  initDisabled      : boolean;
  fromBtn           : string = '';
  prqStatList       : any;
  isReqAmtEqDtlAmts : boolean = false;
  warnMsg           : string = '';
  existsInReqDtl    : boolean = false;
  removeIcon        : boolean = false;
  fromSave          : boolean = false;
  approvalCd        : any;

  @Output() paytData : EventEmitter<any> = new EventEmitter();
  @Input() rowData   : any = {
    reqId : ''
  };

  paymentData  : any = {};
  paymentType  : any;
  passDataLov  : any = {
    selector     : '',
    payeeClassCd : ''
  };

  printData : any = {
    selPrinter  : '',
    printers    : [],
    destination : ''
  };

  constructor(private titleService: Title,  private acctService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService,
              private activatedRoute: ActivatedRoute,  private router: Router,private decPipe: DecimalPipe, private ps : PrintService) { }

  ngOnInit() {
    this.titleService.setTitle('Acct-IT | Request Entry');
    this.getTranType();
    this.sub = this.activatedRoute.params.subscribe(params => {
      if(this.rowData.reqId == ''){
        if(Object.keys(params).length != 0){
          this.saveAcitPaytReq.reqId = params['reqId'];
          this.initDisabled = false;
        }else{
          this.initDisabled = true;
        }
      }else{
        this.saveAcitPaytReq.reqId = this.rowData.reqId;
      }

      // if(Object.keys(params).length != 0 || (this.rowData.reqId != null && this.rowData.reqId != '')){
      //   this.saveAcitPaytReq.reqId = Object.keys(params).length != 0 && this.rowData.reqId !== '' && params['reqId'] !== this.rowData.reqId  ? this.rowData.reqId : params['reqId'];
      //   this.initDisabled = false;
      // }else{
      //   this.initDisabled = true;
      //   this.saveAcitPaytReq.reqId = this.rowData.reqId;
      // }

      this.getAcitPaytReq();
    });

    (this.saveAcitPaytReq.reqStatus == 'X')?this.cancelledStats():'';
  }

  getAcitPaytReq(){
    this.loadingFunc(true);
    // var subRes = forkJoin(this.acctService.getPaytReq(this.saveAcitPaytReq.reqId),this.mtnService.getMtnPrintableName(''), this.mtnService.getRefCode('ACIT_PAYMENT_REQUEST.STATUS'), 
    //                       this.acctService.getAcitPrqTrans(this.saveAcitPaytReq.reqId))
    //                      .pipe(map(([pr,pn,stat,prq]) => { return { pr,pn,stat,prq }; }));

    const subResKey = ['pn','stat'];
    const arrSubRes = {
      'pn'   : this.mtnService.getMtnPrintableName(''),
      'stat' : this.mtnService.getRefCode('ACIT_PAYMENT_REQUEST.STATUS')
    };

    if(this.saveAcitPaytReq.reqId != '' && this.saveAcitPaytReq.reqId != null && this.saveAcitPaytReq.reqId != undefined){
      $.extend(arrSubRes,{
        'pr'  : this.acctService.getPaytReq(this.saveAcitPaytReq.reqId),
        'prq' : this.acctService.getAcitPrqTrans(this.saveAcitPaytReq.reqId)
      });
      subResKey.push('pr','prq');
    }

    var subRes  = forkJoin(Object.values(arrSubRes)).pipe(map((a) => { 
      var obj = {};
      subResKey.forEach((e,i) => {obj[e] = a[i];});
      return obj;
    }));

    subRes.subscribe(data => {
      console.log(data);
      var recPn = data['pn']['printableNames'];
      var recStat = data['stat']['refCodeList'];
      this.prqStatList = recStat;
      
      this.loadingFunc(false);
      if(!this.initDisabled){
        var recPrq = data['prq']['acitPrqTrans'];
        var totalReqAmts = Math.round((recPrq.length == 0)?0:recPrq.map(e => e.currAmt).reduce((a,b) => a+b,0) * 100)/100;

        console.log(totalReqAmts);
        var recPr =  data['pr']['acitPaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate);
                                               recPn.forEach(e2 => {
                                                if(e.requestedBy.toUpperCase() == e2.userId.toUpperCase()){
                                                  e.requestedName = e2.printableName;
                                                  this.saveAcitPaytReq.requestedBy = e2.userId;
                                                  e.requestedDes = e2.designation;
                                                }
                                                if(e.preparedBy.toUpperCase() == e2.userId.toUpperCase()){
                                                  e.preparedName = e2.printableName;
                                                  this.saveAcitPaytReq.preparedBy = e2.userId;
                                                  e.preparedDes = e2.designation;
                                                }
                                                if(e.approvedBy == '' || e.approvedBy == null){
                                                  e.approvedBy = ''
                                                }else{
                                                  if(e.approvedBy.toUpperCase() == e2.userId.toUpperCase()){
                                                    e.approvedName = e2.printableName;
                                                    this.saveAcitPaytReq.approvedBy = e2.userId;
                                                    e.approvedDes = e2.designation;
                                                  }
                                                }
                                               });
                                               return e; 
                                             });
        this.saveAcitPaytReq = recPr[0];
        this.splitPaytReqNo(this.saveAcitPaytReq.paytReqNo);
        this.reqDateDate = this.saveAcitPaytReq.reqDate.split('T')[0];
        this.reqDateTime = this.saveAcitPaytReq.reqDate.split('T')[1];
        this.existsInReqDtl = (this.saveAcitPaytReq.reqStatus == 'N')?false:true;
        console.log(this.saveAcitPaytReq);
        (this.saveAcitPaytReq.tranTypeCd == 1 || this.saveAcitPaytReq.tranTypeCd == 2 || this.saveAcitPaytReq.tranTypeCd == 3)
            ?this.disableFlds(true)
            :((this.saveAcitPaytReq.reqStatus == 'N' || this.saveAcitPaytReq.reqStatus == 'F')?this.disableFlds(false):this.disableFlds(true));
        if(this.fromSave){
          this.dialogIcon = '';
          this.dialogMessage = '';
          this.success.open();
          this.fromSave = false;
        }
      }else{
        this.reqDateDate = this.ns.toDateTimeString(0).split('T')[0];
        this.reqDateTime = this.ns.toDateTimeString(0).split('T')[1];
        this.saveAcitPaytReq.reqStatus = 'N';
        this.saveAcitPaytReq.reqStatusDesc = recStat.filter(e => e.code == this.saveAcitPaytReq.reqStatus).map(e => e.description);
        this.saveAcitPaytReq.reqAmt = 0;
        this.saveAcitPaytReq.currCd  = 'PHP';
        this.saveAcitPaytReq.currRate = 1;
        recPn.forEach(e => {
          if(e.userId.toUpperCase() == this.ns.getCurrentUser().toUpperCase()){
            this.saveAcitPaytReq.preparedName  = e.printableName;
            this.saveAcitPaytReq.preparedBy   = e.userId;
            this.saveAcitPaytReq.preparedDes = e.designation;
          }
        });
        this.saveAcitPaytReq.preparedDate = this.ns.toDateTimeString(0);
        console.log(this.saveAcitPaytReq);
      }

      this.setLocalAmt();
      console.log(Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')));
      if(this.saveAcitPaytReq.tranTypeCd == 5){
        this.isReqAmtEqDtlAmts = true;
      } else if(this.saveAcitPaytReq.tranTypeCd == 6) {
        var unapplied = ((recPrq.filter(x => x.transdtlType !== null).map(e => e.currAmt).reduce((a,b) => a+b,0) * 100)/100) * 2;

        this.isReqAmtEqDtlAmts = (Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')) == (Number(Math.abs(totalReqAmts))-unapplied));
      } else {
        this.isReqAmtEqDtlAmts = (Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')) == Number(Math.abs(totalReqAmts)))?true:false;
      }

      (this.saveAcitPaytReq.reqStatus != 'X' && this.saveAcitPaytReq.reqId != '')?this.getPrinters():'';
    });
  }

  disableFlds(con:boolean){
    $('.warn').prop('readonly',con);
    this.removeIcon = (con)?true:false;
    console.log(this.removeIcon + ' >>> removeIcon');
  }

  onClickNewReq(){
    this.rowData.reqId = '';
    this.saveAcitPaytReq  = {
      paytReqNo       : '',
      approvedBy      : '',
      approvedDes     : '',
      approvedDate    : '',
      createDate      : '',
      createUser      : '',
      currCd          : '',
      currRate        : '',
      localAmt        : '',
      particulars     : '',
      payee           : '',
      payeeNo         : '',
      payeeCd         : '',
      preparedBy      : '',
      preparedDes     : '',
      preparedDate    : '',
      reqAmt          : '',
      reqDate         : '',
      reqId           : '',
      reqMm           : '',
      reqPrefix       : '',
      reqSeqNo        : '',
      reqStatus       : '',
      reqStatusDesc   : '',
      reqYear         : '',
      requestedBy     : '',
      requestedDes    : '',
      tranTypeCd      : '',
      updateDate      : '',
      updateUser      : ''
    };
    this.initDisabled = true;
    this.existsInReqDtl = false;
    this.disableFlds(false);
    this.getAcitPaytReq();
    this.getTranType();
    this.removeRedBackShad('warn');
  }

  onSaveAcitPaytReq(){
    this.acitPaytReq = {
      approvedBy      : this.saveAcitPaytReq.approvedBy,
      approvedDate    : this.saveAcitPaytReq.approvedDate,
      createDate      : (this.saveAcitPaytReq.createDate == '' || this.saveAcitPaytReq.createDate == null)?this.ns.toDateTimeString(0):this.saveAcitPaytReq.createDate,
      createUser      : (this.saveAcitPaytReq.createUser == '' || this.saveAcitPaytReq.createUser == null)?this.ns.getCurrentUser():this.saveAcitPaytReq.createUser,
      currCd          : this.saveAcitPaytReq.currCd,
      currRate        : Number(String(this.saveAcitPaytReq.currRate).replace(/\,/g,'')),
      localAmt        : Number(String(this.saveAcitPaytReq.localAmt).replace(/\,/g,'')),
      particulars     : this.saveAcitPaytReq.particulars,
      payee           : this.saveAcitPaytReq.payee,
      payeeCd         : this.saveAcitPaytReq.payeeCd,
      payeeClassCd    : this.saveAcitPaytReq.payeeClassCd,
      preparedBy      : this.saveAcitPaytReq.preparedBy,
      preparedDate    : (this.saveAcitPaytReq.preparedDate == '' || this.saveAcitPaytReq.preparedDate == null)?this.ns.toDateTimeString(0):this.saveAcitPaytReq.preparedDate,
      reqAmt          : (this.saveAcitPaytReq.reqAmt == '' || this.saveAcitPaytReq.reqAmt == null)?0:Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')),
      reqDate         : this.reqDateDate+'T'+this.reqDateTime,
      reqId           : this.saveAcitPaytReq.reqId,
      reqMm           : (this.saveAcitPaytReq.reqMm == '' || this.saveAcitPaytReq.reqMm == null)?Number(this.reqDateDate.split('-')[1]):Number(this.saveAcitPaytReq.reqMm),
      reqPrefix       : this.tranTypeList.filter(i => i.tranTypeCd == this.saveAcitPaytReq.tranTypeCd).map(i => i.typePrefix).toString(),
      reqSeqNo        : this.saveAcitPaytReq.reqSeqNo,
      reqStatus       : (this.saveAcitPaytReq.reqStatusNew == 'A')?this.saveAcitPaytReq.reqStatusNew:this.saveAcitPaytReq.reqStatus,
      reqYear         : (this.saveAcitPaytReq.reqYear == '' || this.saveAcitPaytReq.reqYear == null)?this.reqDateDate.split('-')[0]:this.saveAcitPaytReq.reqYear,
      requestedBy     : this.saveAcitPaytReq.requestedBy,
      tranTypeCd      : this.saveAcitPaytReq.tranTypeCd,
      updateDate      : this.ns.toDateTimeString(0),
      updateUser      : this.ns.getCurrentUser()
    };

    console.log(this.saveAcitPaytReq);
    this.acctService.saveAcitPaytReq(JSON.stringify(this.acitPaytReq))
    .subscribe(data => {
      console.log(data);
      this.fromSave = true;
      this.saveAcitPaytReq.reqId =  data['reqIdOut'];
      this.paytData.emit({reqId: data['reqIdOut']});
      this.saveAcitPaytReq.paytReqNo = data['paytReqNo'];
      this.splitPaytReqNo(this.saveAcitPaytReq.paytReqNo);
      this.initDisabled = false;
      this.getAcitPaytReq();
      this.form.control.markAsPristine();

      if(this.fromBtn.toLowerCase() == 'new-req'){
        this.onClickNewReq();
        this.rowData.reqId = '';
        this.fromBtn = '';
      }

    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    
    if(this.reqDateDate == '' || this.reqDateDate == null || this.reqDateTime == '' || this.reqDateTime == null || this.saveAcitPaytReq.payeeCd == '' || 
      this.saveAcitPaytReq.payeeCd == null || this.saveAcitPaytReq.payee == '' || this.saveAcitPaytReq.payee == null || this.saveAcitPaytReq.currCd == '' || this.saveAcitPaytReq.currCd == null || this.saveAcitPaytReq.particulars == '' ||
      this.saveAcitPaytReq.particulars == null || this.saveAcitPaytReq.preparedBy == '' || this.saveAcitPaytReq.preparedBy == null || 
      this.saveAcitPaytReq.requestedBy == '' || this.saveAcitPaytReq.requestedBy == null || this.saveAcitPaytReq.tranTypeCd == '' || this.saveAcitPaytReq.tranTypeCd == null ||
      this.saveAcitPaytReq.currRate == '' || this.saveAcitPaytReq.currRate == null  || this.saveAcitPaytReq.reqAmt == '' || this.saveAcitPaytReq.reqAmt == null){
        this.dialogIcon = 'error';
        this.success.open();
        $('.warn').focus();
        $('.warn').blur();
        this.fromCancel = false;
    }else{
      if(Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')) < 0){
        this.warnMsg = 'Request Amount should be positive.';
        this.warnMdl.openNoClose();
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
    }
  }

  getTranType(){
    this.mtnService.getMtnAcitTranType('PRQ','','','','', 'Y')
    .subscribe(data => {
      console.log(data);
      this.tranTypeList = (this.initDisabled)
                             ?(data['tranTypeList']).filter(e => e.tranTypeCd != 1 && e.tranTypeCd != 2 && e.tranTypeCd != 3).sort((a,b) => a.tranTypeCd-b.tranTypeCd)
                             :(data['tranTypeList']).sort((a,b) => a.tranTypeCd-b.tranTypeCd);
      this.tranTypeList.unshift(' ');
    });
  }

  setDefPar(){
    this.saveAcitPaytReq.particulars = String(this.tranTypeList.filter(e => e.tranTypeCd == this.saveAcitPaytReq.tranTypeCd).map(e => e.defaultParticulars));
    this.removeRedBackShad('particulars');
    this.saveAcitPaytReq.payee   = '';
    this.saveAcitPaytReq.payeeCd = '';
  }

  cancelledStats(){
    this.disableFlds(true);
    this.initDisabled = true;
  }

  prepareData(){
    this.saveAcitPaytReq.reqDate = this.reqDateDate+'T'+this.reqDateTime;
  }

  splitPaytReqNo(paytReqNo){
    var prNoArr = paytReqNo.split('-');
    this.saveAcitPaytReq.reqPrefix = prNoArr[0];
    this.saveAcitPaytReq.reqYear   = prNoArr[1];
    this.saveAcitPaytReq.reqMm     = prNoArr[2].padStart(2,'0');
    this.saveAcitPaytReq.reqSeqNo  = prNoArr[3].padStart(4,'0');
  }

  setLocalAmt(){
    this.saveAcitPaytReq.localAmt = Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')) * Number(String(this.saveAcitPaytReq.currRate).replace(/\,/g,''));
    var reqAmt = this.decPipe.transform(Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')),'0.2-2');
    var currRate = this.decPipe.transform(Number(String(this.saveAcitPaytReq.currRate).replace(/\,/g,'')),'0.6-6');
    this.saveAcitPaytReq.localAmt = this.decPipe.transform(Number(String(this.saveAcitPaytReq.localAmt).replace(/\,/g,'')),'0.2-2');

    this.saveAcitPaytReq.reqAmt = reqAmt;
    this.saveAcitPaytReq.currRate = (Number(currRate) == 0)? '' : currRate;
  }

  removeRedBackShad(fromClass){
    $('.'+fromClass).css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
    // $('.'+fromClass).focus().blur();
  }

  setData(data,from){
    console.log(data);
    console.log(from);
    this.removeRedBackShad(from);
    this.form.control.markAsDirty();
    this.ns.lovLoader(data.ev, 0);
    
    if(from.toLowerCase() == 'curr'){
      this.saveAcitPaytReq.currCd = data.currencyCd;
      this.saveAcitPaytReq.currRate =  data.currencyRt;
      this.setLocalAmt();
    }else if(from.toLowerCase() == 'prep-user'){
      this.saveAcitPaytReq.preparedName = data.printableName;
      this.saveAcitPaytReq.preparedBy  = data.userId;
      this.saveAcitPaytReq.preparedDes  = data.designation;
    }else if(from.toLowerCase() == 'req-user'){
      this.saveAcitPaytReq.requestedName = data.printableName;
      this.saveAcitPaytReq.requestedBy  = data.userId;
      this.saveAcitPaytReq.requestedDes  = data.designation;
    }else if(from.toLowerCase() == 'app-user'){
      this.saveAcitPaytReq.approvedName = data.printableName;
      this.saveAcitPaytReq.approvedBy  = data.userId;
      this.saveAcitPaytReq.approvedDes  = data.designation;
    }else if(from.toLowerCase() == 'payee'){
      if(data.data == null){
        this.saveAcitPaytReq.payee   = '';
        this.saveAcitPaytReq.payeeCd = '';
        this.saveAcitPaytReq.payeeClassCd = '';
      }else{
        this.saveAcitPaytReq.payee   = data.data.payeeName;
        this.saveAcitPaytReq.payeeCd = data.data.payeeNo;
        this.saveAcitPaytReq.payeeClassCd = data.data.payeeClassCd;
      }
    }
  }

  checkCode(event,from){
    this.ns.lovLoader(event, 1);
    if(from.toLowerCase() == 'curr'){
      this.currLov.checkCode(this.saveAcitPaytReq.currCd.toUpperCase(),event);
    } else if(from.toLowerCase() == 'prep-user') {
      this.prepUserLov.checkCode(this.saveAcitPaytReq.preparedName.toUpperCase(), event);
    } else if(from.toLowerCase() == 'req-user') {
      this.reqUserLov.checkCode(this.saveAcitPaytReq.requestedName.toUpperCase(), event);
    } else if(from.toLowerCase() == 'app-user') {
      this.appUserLov.checkCode(this.saveAcitPaytReq.approvedName.toUpperCase(), event);
    } else if(from.toLowerCase() == 'payee'){
      this.passDataLov.selector = 'payee';
      this.passDataLov.payeeNo = this.saveAcitPaytReq.payeeCd;

      if(this.saveAcitPaytReq.tranTypeCd == 5){
        this.passDataLov.payeeClassCd = 2;
      }else if(this.saveAcitPaytReq.tranTypeCd == 7){
        this.passDataLov.payeeClassCd = 3;
      }else{
        this.passDataLov.payeeClassCd = (this.saveAcitPaytReq.tranTypeCd == '' || this.saveAcitPaytReq.tranTypeCd == null || this.saveAcitPaytReq.tranTypeCd == 8)?'':1;
      }
      this.mainLov.checkCode('payee',null,null,null,null,null,event,null,this.passDataLov.payeeClassCd);
    }
  }

  showLov(fromUser){
    if(fromUser.toLowerCase() == 'curr'){
      this.currLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'prep-user'){
      this.prepUserLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'req-user'){
      this.reqUserLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'app-user'){
      this.appUserLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'payee'){
      this.passDataLov.selector = 'payee';
      this.passDataLov.payeeNo = '';
      if(this.saveAcitPaytReq.tranTypeCd == 5){
        this.passDataLov.payeeClassCd = 2;
      }else if(this.saveAcitPaytReq.tranTypeCd == 7){
        this.passDataLov.payeeClassCd = 3;
      }else{
        this.passDataLov.payeeClassCd = (this.saveAcitPaytReq.tranTypeCd == '' || this.saveAcitPaytReq.tranTypeCd == null || this.saveAcitPaytReq.tranTypeCd == 8)?'':1;
      }
      this.mainLov.openLOV();
    }
  }

  onClickYesConfirmed(stat){
    this.loadingFunc(true);
    this.confirmMdl.closeModal();
    var updatePaytReqStats = {
      approvedBy   : (this.saveAcitPaytReq.approvedBy == '' || this.saveAcitPaytReq.approvedBy == null)?this.ns.getCurrentUser():this.saveAcitPaytReq.approvedBy,
      approvedDate : (this.saveAcitPaytReq.approvedDate == '' || this.saveAcitPaytReq.approvedDate == null)?this.ns.toDateTimeString(0):this.saveAcitPaytReq.approvedDate,
      reqId        : this.saveAcitPaytReq.reqId,
      reqStatus    : stat,
      updateUser   : this.ns.getCurrentUser()
    };

    console.log(JSON.stringify(updatePaytReqStats));
    this.acctService.updateAcitPaytReqStat(JSON.stringify(updatePaytReqStats))
    .subscribe(data => {
      console.log(data);
      this.loadingFunc(false);
      this.fromSave = true;
      this.disableFlds(true);
      this.getAcitPaytReq();
    });
  }

  onYesConfirmed(){
    console.log(this.fromBtn);
    if(this.fromBtn.toLowerCase() == 'cancel-req'){
      this.onClickYesConfirmed('X');
    }else if(this.fromBtn.toLowerCase() == 'approve'){
      this.onClickYesConfirmed('A');
    }else if(this.fromBtn.toLowerCase() == 'new-req'){
      this.confirmMdl.closeModal();
      this.form.control.markAsPristine();
      this.onClickSave();
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

  showConfirmMdl(from){
    console.log(from);
    console.log(this.isReqAmtEqDtlAmts);
    if(from.toLowerCase() == 'approve' && !this.isReqAmtEqDtlAmts){
      this.saveAcitPaytReq.reqStatusNew = '';
      this.warnMsg = 'Requested Amount must be equal to the total payment amounts in Request Details.';
      this.warnMdl.openNoClose();
    }else if(from.toLowerCase() == 'new-req'){
      if(this.form.dirty){
        this.confirmMdl.openNoClose();
        this.fromBtn = from; 
      }else{
        this.onClickNewReq();
      }
    }else{
      if(this.saveAcitPaytReq.processing == null){
        // this.confirmMdl.openNoClose();
        this.fromBtn = from;
        this.overrideFunc(this.approvalCd);
      }else{
        this.warnMsg = 'Please delete or cancel the transaction with Check Voucher No. ' + this.saveAcitPaytReq.processing + 
                       ' \nbefore cancelling this payment request.';
        this.warnMdl.openNoClose();
      }
      
    }
    // (from.toLowerCase() == 'approve')?this.saveAcitPaytReq.reqStatusNew = '':'';
  }

  onNoAppby(){
    this.saveAcitPaytReq.approvedDate = '';
    this.saveAcitPaytReq.approvedBy = '';
    this.saveAcitPaytReq.approvedName = '';
    this.saveAcitPaytReq.approvedDes = '';
    this.confirmMdl.closeModal();
  }

  onTabChange($event: NgbTabChangeEvent) {
    if($event.nextId === 'Exit'){
      $event.preventDefault();
      this.router.navigateByUrl('/maintenance-qu-pol');
    }

   }

  loadingFunc(bool){
    var str = bool?'block':'none';
    $('.globalLoading').css('display',str);
  }

   
   onClickPrint(){
     if(this.printData.destination == 'screen'){
       //added by Neco 09/04/2019
       window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_PAYT_REQ' + '&userId=' + 
                      this.ns.getCurrentUser() + '&reqId=' + this.saveAcitPaytReq.reqId, '_blank');
       //end
     }else if(this.printData.destination == 'printer'){
       let params = {
          reportName : 'ACITR_PAYT_REQ',
          reqId: this.saveAcitPaytReq.reqId,
          printerName: this.printData.selPrinter,
          pageOrientation: 'LANDSCAPE',
          paperSize: 'LETTER'
        };
        this.ps.directPrint(params).subscribe(data => {
            console.log(data);
        });
     }
   }

  overrideFunc(approvalCd){
    this.loadingFunc(true);
    this.mtnService.getMtnApprovalFunction(approvalCd)
    .subscribe(data => {
      var approverList = data['approverFn'].map(e => e.userId);
      if(approverList.includes(this.ns.getCurrentUser())){
        this.confirmMdl.openNoClose();
      }else{
        this.overrideLogin.getApprovalFn();
        this.overrideLogin.overrideMdl.openNoClose();
      }
    });
  }

  onOkOverride(result){
    if(result){
      this.confirmMdl.openNoClose();
    }
  }

  getPrinters(){
    this.ps.getPrinters()
    .subscribe(data => {
      this.printData.printers = data;
    });
  }

  clearPrinterName(){
    (this.printData.destination != 'printer')?this.printData.selPrinter='':''
  }
}