import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { environment } from '@environments/environment';
import { NgForm } from '@angular/forms';

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
  @ViewChild('prepUserLov') prepUserLov       : MtnUsersComponent;
  @ViewChild('reqUserLov') reqUserLov         : MtnUsersComponent;
  @ViewChild('appUserLov') appUserLov         : MtnUsersComponent;
  @ViewChild('confirmMdl') confirmMdl         : ModalComponent;
  @ViewChild('warnMdl') warnMdl               : ModalComponent;
  @ViewChild('printMdl') printMdl             : ModalComponent;
  @ViewChild('mainLov') mainLov               : LovComponent;
  @ViewChild('myForm') form                   : NgForm;

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
  existsInReqDtl      : boolean = false;
  removeIcon        : boolean = false;

  @Output() paytData : EventEmitter<any> = new EventEmitter();
  @Input() rowData   : any = {
    reqId : ''
  };

  paymentData  : any = {};
  paymentType  : any;
  passDataLov  : any = {
    selector     :'',
    payeeClassCd : ''
  };

  savePrintables : any = {
    preparedBy  : '',
    requestedBy : '',
    approvedBy  : ''
  };

  constructor(private titleService: Title,  private acctService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService,
              private activatedRoute: ActivatedRoute,  private router: Router,private decPipe: DecimalPipe) { }

  ngOnInit() {
    this.titleService.setTitle('Acct-IT | Request Entry');
    this.getTranType();
    this.sub = this.activatedRoute.params.subscribe(params => {
      if(Object.keys(params).length != 0 || (this.rowData.reqId != null && this.rowData.reqId != '')){
        this.saveAcitPaytReq.reqId = (Object.keys(params).length != 0)?params['reqId']:this.rowData.reqId;
        this.initDisabled = false;
      }else{
        this.initDisabled = true;
      }

      this.getAcitPaytReq();
    });

    (this.saveAcitPaytReq.reqStatus == 'X')?this.cancelledStats():'';
  }

  getAcitPaytReq(){
    console.log(this.saveAcitPaytReq.reqId);
    var subRes = forkJoin(this.acctService.getPaytReq(this.saveAcitPaytReq.reqId),this.mtnService.getMtnPrintableName(''), this.mtnService.getRefCode('ACIT_PAYMENT_REQUEST.STATUS'), this.acctService.getAcitPrqTrans(this.saveAcitPaytReq.reqId))
                         .pipe(map(([pr,pn,stat,prq]) => { return { pr,pn,stat,prq }; }));

    subRes.subscribe(data => {
      console.log(data);
      var recPn = data['pn']['printableNames'];
      var recStat = data['stat']['refCodeList'];
      var recPrq = data['prq']['acitPrqTrans'];
      var totalReqAmts = (recPrq.length == 0)?0:recPrq.map(e => e.currAmt).reduce((a,b) => a+b,0);
      this.prqStatList = recStat;

      $('.globalLoading').css('display','none');
      if(!this.initDisabled){
         var recPr =  data['pr']['acitPaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate);
                                               recPn.forEach(e2 => {
                                                if(e.requestedBy.toUpperCase() == e2.userId.toUpperCase()){
                                                  e.requestedBy = e2.printableName;
                                                  this.savePrintables.requestedBy = e2.userId;
                                                  e.requestedDes = e2.designation;
                                                }
                                                if(e.preparedBy.toUpperCase() == e2.userId.toUpperCase()){
                                                  e.preparedBy = e2.printableName;
                                                  this.savePrintables.preparedBy = e2.userId;
                                                  e.preparedDes = e2.designation;
                                                }
                                                if(e.approvedBy == '' || e.approvedBy == null){
                                                  e.approvedBy = ''
                                                }else{
                                                  if(e.approvedBy.toUpperCase() == e2.userId.toUpperCase()){
                                                    e.approvedBy = e2.printableName;
                                                    this.savePrintables.approvedBy = e2.userId;
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
        console.log(this.existsInReqDtl);
        console.log(recPrq.length);
        (this.saveAcitPaytReq.tranTypeCd == 1 || this.saveAcitPaytReq.tranTypeCd == 2 || this.saveAcitPaytReq.tranTypeCd == 3)
            ?this.disableFlds(true)
            :((this.saveAcitPaytReq.reqStatus == 'N' || this.saveAcitPaytReq.reqStatus == 'F')?this.disableFlds(false):this.disableFlds(true));
        
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
            this.saveAcitPaytReq.preparedBy  = e.printableName;
            this.savePrintables.preparedBy   = e.userId;
            this.saveAcitPaytReq.preparedDes = e.designation;
          }
        });
        this.saveAcitPaytReq.preparedDate = this.ns.toDateTimeString(0);
      }

      this.paytData.emit({reqId: this.saveAcitPaytReq.reqId});
      this.setLocalAmt();
      console.log(Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')));
      console.log(totalReqAmts);
      if(this.saveAcitPaytReq.tranTypeCd == 5){
        this.isReqAmtEqDtlAmts = true;
      }else{
        this.isReqAmtEqDtlAmts = (Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')) == Number(Math.abs(totalReqAmts)))?true:false;
      }
    });
  }

  disableFlds(con:boolean){
    $('.warn').prop('readonly',con);
    this.removeIcon = (con)?true:false;
    console.log(this.removeIcon + ' >>> removeIcon');
  }

  onClickNewReq(){
    $('.globalLoading').css('display','block');
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
  }

  onSaveAcitPaytReq(){
    this.acitPaytReq = {
      approvedBy      : this.savePrintables.approvedBy,
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
      preparedBy      : this.savePrintables.preparedBy,
      preparedDate    : (this.saveAcitPaytReq.preparedDate == '' || this.saveAcitPaytReq.preparedDate == null)?this.ns.toDateTimeString(0):this.saveAcitPaytReq.preparedDate,
      reqAmt          : (this.saveAcitPaytReq.reqAmt == '' || this.saveAcitPaytReq.reqAmt == null)?0:Number(String(this.saveAcitPaytReq.reqAmt).replace(/\,/g,'')),
      reqDate         : this.reqDateDate+'T'+this.reqDateTime,
      reqId           : this.saveAcitPaytReq.reqId,
      reqMm           : (this.saveAcitPaytReq.reqMm == '' || this.saveAcitPaytReq.reqMm == null)?Number(this.reqDateDate.split('-')[1]):Number(this.saveAcitPaytReq.reqMm),
      reqPrefix       : this.tranTypeList.filter(i => i.tranTypeCd == this.saveAcitPaytReq.tranTypeCd).map(i => i.typePrefix).toString(),
      reqSeqNo        : this.saveAcitPaytReq.reqSeqNo,
      reqStatus       : (this.saveAcitPaytReq.reqStatusNew == 'A')?this.saveAcitPaytReq.reqStatusNew:this.saveAcitPaytReq.reqStatus,
      reqYear         : (this.saveAcitPaytReq.reqYear == '' || this.saveAcitPaytReq.reqYear == null)?this.reqDateDate.split('-')[0]:this.saveAcitPaytReq.reqYear,
      requestedBy     : this.savePrintables.requestedBy,
      tranTypeCd      : this.saveAcitPaytReq.tranTypeCd,
      updateDate      : this.ns.toDateTimeString(0),
      updateUser      : this.ns.getCurrentUser()
    };

    console.log(this.saveAcitPaytReq);
    this.acctService.saveAcitPaytReq(JSON.stringify(this.acitPaytReq))
    .subscribe(data => {
      console.log(data);
      this.dialogIcon = '';
      this.dialogMessage = '';
      this.success.open();
      this.saveAcitPaytReq.reqId =  data['reqIdOut'];
      this.saveAcitPaytReq.paytReqNo = data['paytReqNo'];
      this.splitPaytReqNo(this.saveAcitPaytReq.paytReqNo);
      this.initDisabled = false;
      this.getAcitPaytReq();
      this.form.control.markAsPristine();
    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    
    if(this.reqDateDate == '' || this.reqDateDate == null || this.reqDateTime == '' || this.reqDateTime == null || this.saveAcitPaytReq.payee == '' || 
      this.saveAcitPaytReq.payee == null || this.saveAcitPaytReq.currCd == '' || this.saveAcitPaytReq.currCd == null || this.saveAcitPaytReq.particulars == '' ||
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
    var currRate = this.decPipe.transform(Number(String(this.saveAcitPaytReq.currRate).replace(/\,/g,'')),'0.9-9');
    this.saveAcitPaytReq.localAmt = this.decPipe.transform(Number(String(this.saveAcitPaytReq.localAmt).replace(/\,/g,'')),'0.2-2');

    this.saveAcitPaytReq.reqAmt = reqAmt;
    this.saveAcitPaytReq.currRate = (Number(currRate) == 0)? '' : currRate;
  }

  setData(data,from){
    // $('input').addClass('ng-dirty');
    this.form.control.markAsDirty();
    this.ns.lovLoader(data.ev, 0);
    if(from.toLowerCase() == 'curr'){
      this.saveAcitPaytReq.currCd = data.currencyCd;
      this.saveAcitPaytReq.currRate =  data.currencyRt;
      this.setLocalAmt();
    }else if(from.toLowerCase() == 'prep-user'){
      this.saveAcitPaytReq.preparedBy = data.printableName;
      this.savePrintables.preparedBy  = data.userId;
      this.saveAcitPaytReq.preparedDes  = data.designation;
    }else if(from.toLowerCase() == 'req-user'){
      this.saveAcitPaytReq.requestedBy = data.printableName;
      this.savePrintables.requestedBy  = data.userId;
      this.saveAcitPaytReq.requestedDes  = data.designation;
    }else if(from.toLowerCase() == 'app-user'){
      this.saveAcitPaytReq.approvedBy = data.printableName;
      this.savePrintables.approvedBy  = data.userId;
      this.saveAcitPaytReq.approvedDes  = data.designation;
    }else if(from.toLowerCase() == 'payee'){
      this.saveAcitPaytReq.payee   = data.data.payeeName;
      this.saveAcitPaytReq.payeeCd = data.data.payeeNo;
      this.saveAcitPaytReq.payeeClassCd = data.data.payeeClassCd;
    }
  }

  checkCode(event,from){
    this.ns.lovLoader(event.ev, 1);
    if(from.toLowerCase() == 'curr'){
      this.currLov.checkCode(this.saveAcitPaytReq.currCd.toUpperCase(),event.ev);
    }else if(from.toLowerCase() == 'prep-user'){
      this.prepUserLov.checkCode(this.saveAcitPaytReq.preparedBy.toUpperCase(),event.ev);
    }else if(from.toLowerCase() == 'req-user'){
      this.reqUserLov.checkCode(this.saveAcitPaytReq.requestedBy.toUpperCase(),event.ev);
    }else if(from.toLowerCase() == 'app-user'){
      this.appUserLov.checkCode(this.saveAcitPaytReq.approvedBy.toUpperCase(),event.ev);
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
      if(this.saveAcitPaytReq.tranTypeCd == 5){
        this.passDataLov.showFirst = 2;
      }else if(this.saveAcitPaytReq.tranTypeCd == 7){
        this.passDataLov.showFirst = 3;
      }else{
        this.passDataLov.showFirst = 1;
      }
      this.mainLov.openLOV();
    }
  }

  // onCancelReq(){
  //   this.fromBtn = 'cancel-req';
  // }

  onClickYesConfirmed(stat){
    $('.globalLoading').css('display','block');
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
      $('.globalLoading').css('display','none');
      // this.saveAcitPaytReq.reqStatus = stat;
      // this.saveAcitPaytReq.reqStatusDesc = this.prqStatList.filter(e => e.code == this.saveAcitPaytReq.reqStatus).map(e => e.description);
      this.dialogIcon = '';
      this.dialogMessage = '';
      this.success.open();
      this.disableFlds(true);
      //this.initDisabled = (stat == 'X')?true:false;
      this.getAcitPaytReq();
    });
  }

  onYesConfirmed(){
    console.log(this.fromBtn);
    if(this.fromBtn.toLowerCase() == 'cancel-req'){
      this.onClickYesConfirmed('X');
    }else if(this.fromBtn.toLowerCase() == 'approve'){
      this.onClickYesConfirmed('A');
    }
  }

  // onYesCancelReq(){
  //   $('.globalLoading').css('display','block');
  //   this.confirmMdl.closeModal();
  //   var updatePaytReqStats = {
  //     approvedBy   : this.savePrintables.approvedBy,
  //     approvedDate : this.saveAcitPaytReq.approvedDate,
  //     reqId        : this.saveAcitPaytReq.reqId,
  //     reqStatus    : 'X',
  //     updateUser   : this.ns.getCurrentUser()
  //   };

  //   console.log(JSON.stringify(updatePaytReqStats));
  //   this.acctService.updateAcitPaytReqStat(JSON.stringify(updatePaytReqStats))
  //   .subscribe(data => {
  //     console.log(data);
  //     $('.globalLoading').css('display','none');
  //     this.saveAcitPaytReq.reqStatusDesc = 'Cancelled';
  //     this.saveAcitPaytReq.reqStatus = 'X';
  //     this.dialogIcon = '';
  //     this.dialogMessage = '';
  //     this.success.open();
  //     this.cancelledStats();
  //   });
  // }

  // onYesAppby(){   
  //     $('.globalLoading').css('display','block');
  //     this.confirmMdl.closeModal();
  //     var updatePaytReqStats = {
  //       approvedBy   : (this.saveAcitPaytReq.approvedBy == '' || this.saveAcitPaytReq.approvedBy == null)?this.ns.getCurrentUser():this.saveAcitPaytReq.approvedBy,
  //       approvedDate : (this.saveAcitPaytReq.approvedDate == '' || this.saveAcitPaytReq.approvedDate == null)?this.ns.toDateTimeString(0):this.saveAcitPaytReq.approvedDate,
  //       reqId        : this.saveAcitPaytReq.reqId,
  //       reqStatus    : 'A',
  //       updateUser   : this.ns.getCurrentUser()
  //     };

  //     console.log(JSON.stringify(updatePaytReqStats));
  //     this.acctService.updateAcitPaytReqStat(JSON.stringify(updatePaytReqStats))
  //     .subscribe(data => {
  //       console.log(data);
  //       $('.globalLoading').css('display','none');
  //       this.saveAcitPaytReq.reqStatus = 'A';
  //       this.saveAcitPaytReq.reqStatusDesc = this.prqStatList.filter(e => e.code == this.saveAcitPaytReq.reqStatus).map(e => e.description);
  //       this.dialogIcon = '';
  //       this.dialogMessage = '';
  //       this.success.open();
  //       this.disableFlds(true);
  //     });
  // }

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
    }else{
      this.confirmMdl.openNoClose();
      this.fromBtn = from;
    }
    // (from.toLowerCase() == 'approve')?this.saveAcitPaytReq.reqStatusNew = '':'';
  }

  onNoAppby(){
    this.saveAcitPaytReq.approvedBy = '';
    this.saveAcitPaytReq.approvedDate = '';
    this.savePrintables.approvedBy = '';
    this.saveAcitPaytReq.approvedDes = '';
    this.confirmMdl.closeModal();
  }

  onTabChange($event: NgbTabChangeEvent) {

      if($event.nextId === 'Exit'){
        $event.preventDefault();
      this.router.navigateByUrl('/maintenance-qu-pol');
      }

   }

   //added by Neco 09/04/2019
   onClickPrint(){
     window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_PAYT_REQ' + '&userId=' + 
                      this.ns.getCurrentUser() + '&reqId=' + this.saveAcitPaytReq.reqId, '_blank');
   }
   //end
}