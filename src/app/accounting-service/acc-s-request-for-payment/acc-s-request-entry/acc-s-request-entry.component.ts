import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
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


@Component({
  selector: 'app-acc-s-request-entry',
  templateUrl: './acc-s-request-entry.component.html',
  styleUrls: ['./acc-s-request-entry.component.css']
})
export class AccSRequestEntryComponent implements OnInit {
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
  
  saveAcsePaytReq : any = {
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
  acsePaytReq       : any;
  tranTypeList      : any[] = [];
  private sub       : any;
  initDisabled      : boolean;
  fromBtn           : string = '';
  prqStatList       : any;
  isReqAmtEqDtlAmts : boolean = false;
  warnMsg           : string = '';
  existsInReqDtl      : boolean = false;
  removeIcon        : boolean = false;
  fromSave          : boolean = false;

  @Output() paytData : EventEmitter<any> = new EventEmitter();
  @Input() rowData   : any = {
    reqId : '',
    tranTypeCd: ''
  };

  paymentData  : any = {};
  paymentType  : any;
  passDataLov  : any = {
    selector     :'',
    payeeClassCd : ''
  };


  constructor(private titleService: Title,  private acctService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService,
              private activatedRoute: ActivatedRoute,  private router: Router,private decPipe: DecimalPipe) { }

  ngOnInit() {
    this.titleService.setTitle('Acct-Serv | Request Entry');
    this.getTranType();
    this.sub = this.activatedRoute.params.subscribe(params => {
      if(Object.keys(params).length != 0 || (this.rowData.reqId != null && this.rowData.reqId != '')){
        this.saveAcsePaytReq.reqId = Object.keys(params).length != 0 && this.rowData.reqId !== '' && params['reqId'] !== this.rowData.reqId  ? this.rowData.reqId : params['reqId'];
        this.initDisabled = false;
      }else{
        this.initDisabled = true;
      }


      this.getAcsePaytReq();
    });

    (this.saveAcsePaytReq.reqStatus == 'X')?this.cancelledStats():'';
  }

  getAcsePaytReq(){
    this.loadingFunc(true);
    console.log(this.saveAcsePaytReq.reqId);
    var subRes = forkJoin(this.acctService.getAcsePaytReq(this.saveAcsePaytReq.reqId),this.mtnService.getMtnPrintableName(''), this.mtnService.getRefCode('ACse_PAYMENT_REQUEST.STATUS'), this.acctService.getAcsePrqTrans(this.saveAcsePaytReq.reqId))
                         .pipe(map(([pr,pn,stat,prq]) => { return { pr,pn,stat,prq }; }));
    // var subRes = forkJoin(this.acctService.getAcsePaytReq(this.saveAcsePaytReq.reqId),this.mtnService.getMtnPrintableName(''), this.mtnService.getRefCode('ACSE_PAYMENT_REQUEST.STATUS'))
    //                      .pipe(map(([pr,pn,stat]) => { return { pr,pn,stat}; }));

    subRes.subscribe(data => {
      console.log(data);
      var recPn = data['pn']['printableNames'];
      var recStat = data['stat']['refCodeList'];
      var recPrq = data['prq']['acsePrqTrans'];
      var totalReqAmts = (recPrq.length == 0)?0:recPrq.map(e => e.currAmt).reduce((a,b) => Math.abs(a)+Math.abs(b),0);
      //var totalReqAmts = 0;
      this.prqStatList = recStat;

      this.loadingFunc(false);
      if(!this.initDisabled){
         var recPr =  data['pr']['acsePaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate);
                                               recPn.forEach(e2 => {
                                                if(e.requestedBy.toUpperCase() == e2.userId.toUpperCase()){
                                                  e.requestedName = e2.printableName;
                                                  this.saveAcsePaytReq.requestedBy = e2.userId;
                                                  e.requestedDes = e2.designation;
                                                }
                                                if(e.preparedBy.toUpperCase() == e2.userId.toUpperCase()){
                                                  e.preparedName = e2.printableName;
                                                  this.saveAcsePaytReq.preparedBy = e2.userId;
                                                  e.preparedDes = e2.designation;
                                                }
                                                if(e.approvedBy == '' || e.approvedBy == null){
                                                  e.approvedBy = ''
                                                }else{
                                                  if(e.approvedBy.toUpperCase() == e2.userId.toUpperCase()){
                                                    e.approvedName = e2.printableName;
                                                    this.saveAcsePaytReq.approvedBy = e2.userId;
                                                    e.approvedDes = e2.designation;
                                                  }
                                                }
                                               });
                                               return e; 
                                             });
        this.saveAcsePaytReq = recPr[0];
        this.splitPaytReqNo(this.saveAcsePaytReq.paytReqNo);
        this.reqDateDate = this.saveAcsePaytReq.reqDate.split('T')[0];
        this.reqDateTime = this.saveAcsePaytReq.reqDate.split('T')[1];
        this.existsInReqDtl = (this.saveAcsePaytReq.reqStatus == 'N')?false:true;
        console.log(this.existsInReqDtl);
        //console.log(recPrq.length);
        ((this.saveAcsePaytReq.reqStatus == 'N' || this.saveAcsePaytReq.reqStatus == 'F')?this.disableFlds(false):this.disableFlds(true));
        if(this.fromSave){
          this.dialogIcon = '';
          this.dialogMessage = '';
          this.success.open();
          this.fromSave = false;
        }
      }else{
        this.reqDateDate = this.ns.toDateTimeString(0).split('T')[0];
        this.reqDateTime = this.ns.toDateTimeString(0).split('T')[1];
        this.saveAcsePaytReq.reqStatus = 'N';
        this.saveAcsePaytReq.reqStatusDesc = recStat.filter(e => e.code == this.saveAcsePaytReq.reqStatus).map(e => e.description);
        this.saveAcsePaytReq.reqAmt = 0;
        this.saveAcsePaytReq.currCd  = 'PHP';
        this.saveAcsePaytReq.currRate = 1;
        recPn.forEach(e => {
          if(e.userId.toUpperCase() == this.ns.getCurrentUser().toUpperCase()){
            this.saveAcsePaytReq.preparedName  = e.printableName;
            this.saveAcsePaytReq.preparedBy   = e.userId;
            this.saveAcsePaytReq.preparedDes = e.designation;
          }
        });
        this.saveAcsePaytReq.preparedDate = this.ns.toDateTimeString(0);
        console.log(this.saveAcsePaytReq);
      }

      this.paytData.emit({reqId: this.saveAcsePaytReq.reqId, tranTypeCd:this.saveAcsePaytReq.tranTypeCd});
      this.setLocalAmt();
      console.log(Number(String(this.saveAcsePaytReq.reqAmt).replace(/\,/g,'')));
      console.log(totalReqAmts);
      
      this.isReqAmtEqDtlAmts = (Number(String(this.saveAcsePaytReq.reqAmt).replace(/\,/g,'')) == Number(Math.abs(totalReqAmts)))?true:false;
      
    });
  }

  disableFlds(con:boolean){
    $('.warn').prop('readonly',con);
    this.removeIcon = (con)?true:false;
    console.log(this.removeIcon + ' >>> removeIcon');
  }

  onClickNewReq(){
    this.saveAcsePaytReq  = {
      paytReqNo       : '',
      approvedName    : '',
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
      preparedName    : '',
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
    this.getAcsePaytReq();
    this.getTranType();
    this.removeRedBackShad('warn');
  }

  onSaveAcsePaytReq(){
    this.acsePaytReq = {
      approvedBy      : this.saveAcsePaytReq.approvedBy,
      approvedDate    : this.saveAcsePaytReq.approvedDate,
      createDate      : (this.saveAcsePaytReq.createDate == '' || this.saveAcsePaytReq.createDate == null)?this.ns.toDateTimeString(0):this.saveAcsePaytReq.createDate,
      createUser      : (this.saveAcsePaytReq.createUser == '' || this.saveAcsePaytReq.createUser == null)?this.ns.getCurrentUser():this.saveAcsePaytReq.createUser,
      currCd          : this.saveAcsePaytReq.currCd,
      currRate        : Number(String(this.saveAcsePaytReq.currRate).replace(/\,/g,'')),
      localAmt        : Number(String(this.saveAcsePaytReq.localAmt).replace(/\,/g,'')),
      particulars     : this.saveAcsePaytReq.particulars,
      payee           : this.saveAcsePaytReq.payee,
      payeeCd         : this.saveAcsePaytReq.payeeCd,
      payeeClassCd    : this.saveAcsePaytReq.payeeClassCd,
      preparedBy      : this.saveAcsePaytReq.preparedBy,
      preparedDate    : (this.saveAcsePaytReq.preparedDate == '' || this.saveAcsePaytReq.preparedDate == null)?this.ns.toDateTimeString(0):this.saveAcsePaytReq.preparedDate,
      reqAmt          : (this.saveAcsePaytReq.reqAmt == '' || this.saveAcsePaytReq.reqAmt == null)?0:Number(String(this.saveAcsePaytReq.reqAmt).replace(/\,/g,'')),
      reqDate         : this.reqDateDate+'T'+this.reqDateTime,
      reqId           : this.saveAcsePaytReq.reqId,
      reqMm           : (this.saveAcsePaytReq.reqMm == '' || this.saveAcsePaytReq.reqMm == null)?Number(this.reqDateDate.split('-')[1]):Number(this.saveAcsePaytReq.reqMm),
      reqPrefix       : this.tranTypeList.filter(i => i.tranTypeCd == this.saveAcsePaytReq.tranTypeCd).map(i => i.typePrefix).toString(),
      reqSeqNo        : this.saveAcsePaytReq.reqSeqNo,
      reqStatus       : (this.saveAcsePaytReq.reqStatusNew == 'A')?this.saveAcsePaytReq.reqStatusNew:this.saveAcsePaytReq.reqStatus,
      reqYear         : (this.saveAcsePaytReq.reqYear == '' || this.saveAcsePaytReq.reqYear == null)?this.reqDateDate.split('-')[0]:this.saveAcsePaytReq.reqYear,
      requestedBy     : this.saveAcsePaytReq.requestedBy,
      tranTypeCd      : this.saveAcsePaytReq.tranTypeCd,
      updateDate      : this.ns.toDateTimeString(0),
      updateUser      : this.ns.getCurrentUser()
    };

    console.log(this.saveAcsePaytReq);
    this.acctService.saveAcsePaytReq(JSON.stringify(this.acsePaytReq))
    .subscribe(data => {
      console.log(data);
      this.fromSave = true;
      this.saveAcsePaytReq.reqId =  data['reqIdOut'];
      this.paytData.emit({reqId: data['reqIdOut'], tranTypeCd: this.saveAcsePaytReq.tranTypeCd});
      this.saveAcsePaytReq.paytReqNo = data['paytReqNo'];
      this.splitPaytReqNo(this.saveAcsePaytReq.paytReqNo);
      this.initDisabled = false;
      this.getAcsePaytReq();
      this.form.control.markAsPristine();
    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    
    if(this.reqDateDate == '' || this.reqDateDate == null || this.reqDateTime == '' || this.reqDateTime == null || this.saveAcsePaytReq.payee == '' || 
      this.saveAcsePaytReq.payee == null || this.saveAcsePaytReq.currCd == '' || this.saveAcsePaytReq.currCd == null || this.saveAcsePaytReq.particulars == '' ||
      this.saveAcsePaytReq.particulars == null || this.saveAcsePaytReq.preparedBy == '' || this.saveAcsePaytReq.preparedBy == null || 
      this.saveAcsePaytReq.requestedBy == '' || this.saveAcsePaytReq.requestedBy == null || this.saveAcsePaytReq.tranTypeCd == '' || this.saveAcsePaytReq.tranTypeCd == null ||
      this.saveAcsePaytReq.currRate == '' || this.saveAcsePaytReq.currRate == null  || this.saveAcsePaytReq.reqAmt == '' || this.saveAcsePaytReq.reqAmt == null){
        this.dialogIcon = 'error';
        this.success.open();
        $('.warn').focus();
        $('.warn').blur();
        this.fromCancel = false;
    }else{
      if(Number(String(this.saveAcsePaytReq.reqAmt).replace(/\,/g,'')) < 0){
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
    this.mtnService.getMtnAcseTranType('PRQ','','','','', 'Y')
    .subscribe(data => {
      console.log(data);
      this.tranTypeList =(data['tranTypeList']).sort((a,b) => a.tranTypeCd-b.tranTypeCd);
      this.tranTypeList.unshift(' ');
    });
  }

  setDefPar(){
    this.saveAcsePaytReq.particulars = String(this.tranTypeList.filter(e => e.tranTypeCd == this.saveAcsePaytReq.tranTypeCd).map(e => e.defaultParticulars));
    this.removeRedBackShad('particulars');
    this.saveAcsePaytReq.payee = '';
  }

  cancelledStats(){
    this.disableFlds(true);
    this.initDisabled = true;
  }

  prepareData(){
    this.saveAcsePaytReq.reqDate = this.reqDateDate+'T'+this.reqDateTime;
  }

  splitPaytReqNo(paytReqNo){
    var prNoArr = paytReqNo.split('-');
    this.saveAcsePaytReq.reqPrefix = prNoArr[0];
    this.saveAcsePaytReq.reqYear   = prNoArr[1];
    this.saveAcsePaytReq.reqMm     = prNoArr[2].padStart(2,'0');
    this.saveAcsePaytReq.reqSeqNo  = prNoArr[3].padStart(4,'0');
  }

  setLocalAmt(){
    this.saveAcsePaytReq.localAmt = Number(String(this.saveAcsePaytReq.reqAmt).replace(/\,/g,'')) * Number(String(this.saveAcsePaytReq.currRate).replace(/\,/g,''));
    var reqAmt = this.decPipe.transform(Number(String(this.saveAcsePaytReq.reqAmt).replace(/\,/g,'')),'0.2-2');
    var currRate = this.decPipe.transform(Number(String(this.saveAcsePaytReq.currRate).replace(/\,/g,'')),'0.9-9');
    this.saveAcsePaytReq.localAmt = this.decPipe.transform(Number(String(this.saveAcsePaytReq.localAmt).replace(/\,/g,'')),'0.2-2');

    this.saveAcsePaytReq.reqAmt = reqAmt;
    this.saveAcsePaytReq.currRate = (Number(currRate) == 0)? '' : currRate;
  }

  removeRedBackShad(fromClass){
    $('.'+fromClass).css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
  }

  setData(data,from){
    this.removeRedBackShad(from);
    this.form.control.markAsDirty();
    this.ns.lovLoader(data.ev, 0);
    if(from.toLowerCase() == 'curr'){
      this.saveAcsePaytReq.currCd = data.currencyCd;
      this.saveAcsePaytReq.currRate =  data.currencyRt;
      this.setLocalAmt();
    }else if(from.toLowerCase() == 'prep-user'){
      this.saveAcsePaytReq.preparedName = data.printableName;
      this.saveAcsePaytReq.preparedBy  = data.userId;
      this.saveAcsePaytReq.preparedDes  = data.designation;
    }else if(from.toLowerCase() == 'req-user'){
      this.saveAcsePaytReq.requestedName = data.printableName;
      this.saveAcsePaytReq.requestedBy  = data.userId;
      this.saveAcsePaytReq.requestedDes  = data.designation;
    }else if(from.toLowerCase() == 'app-user'){
      this.saveAcsePaytReq.approvedName = data.printableName;
      this.saveAcsePaytReq.approvedBy  = data.userId;
      this.saveAcsePaytReq.approvedDes  = data.designation;
    }else if(from.toLowerCase() == 'payee'){
      this.saveAcsePaytReq.payee   = data.data.payeeName;
      this.saveAcsePaytReq.payeeCd = data.data.payeeNo;
      this.saveAcsePaytReq.payeeClassCd = data.data.payeeClassCd;
    }
  }

  checkCode(event,from){
    this.ns.lovLoader(event.ev, 1);
    if(from.toLowerCase() == 'curr'){
      this.currLov.checkCode(this.saveAcsePaytReq.currCd.toUpperCase(),event.ev);
    }else if(from.toLowerCase() == 'prep-user'){
      this.prepUserLov.checkCode(this.saveAcsePaytReq.preparedBy.toUpperCase(),event.ev);
    }else if(from.toLowerCase() == 'req-user'){
      this.reqUserLov.checkCode(this.saveAcsePaytReq.requestedBy.toUpperCase(),event.ev);
    }else if(from.toLowerCase() == 'app-user'){
      this.appUserLov.checkCode(this.saveAcsePaytReq.approvedBy.toUpperCase(),event.ev);
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
      // if(this.saveAcsePaytReq.tranTypeCd == 5){
      //   this.passDataLov.payeeClassCd = 2;
      // }else if(this.saveAcsePaytReq.tranTypeCd == 7){
      //   this.passDataLov.payeeClassCd = 3;
      // }else{
      //   this.passDataLov.payeeClassCd = (this.saveAcsePaytReq.tranTypeCd == '' || this.saveAcsePaytReq.tranTypeCd == null)?'':1;
      // }
      this.mainLov.openLOV();
    }
  }

  // onCancelReq(){
  //   this.fromBtn = 'cancel-req';
  // }

  onClickYesConfirmed(stat){
    this.loadingFunc(true);
    this.confirmMdl.closeModal();
    var updatePaytReqStats = {
      approvedBy   : (this.saveAcsePaytReq.approvedBy == '' || this.saveAcsePaytReq.approvedBy == null)?this.ns.getCurrentUser():this.saveAcsePaytReq.approvedBy,
      approvedDate : (this.saveAcsePaytReq.approvedDate == '' || this.saveAcsePaytReq.approvedDate == null)?this.ns.toDateTimeString(0):this.saveAcsePaytReq.approvedDate,
      reqId        : this.saveAcsePaytReq.reqId,
      reqStatus    : stat,
      updateUser   : this.ns.getCurrentUser()
    };

    console.log(JSON.stringify(updatePaytReqStats));
    this.acctService.updateAcsePaytReqStat(JSON.stringify(updatePaytReqStats))
    .subscribe(data => {
      console.log(data);
      this.loadingFunc(false);
      this.fromSave = true;
      this.disableFlds(true);
      this.getAcsePaytReq();
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
      this.saveAcsePaytReq.reqStatusNew = '';
      this.warnMsg = 'Requested Amount must be equal to the total payment amounts in Request Details.';
      this.warnMdl.openNoClose();
    }else{
      this.confirmMdl.openNoClose();
      this.fromBtn = from;
    }
    // (from.toLowerCase() == 'approve')?this.saveAcsePaytReq.reqStatusNew = '':'';
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

   //added by Neco 09/04/2019
   onClickPrint(){
     window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACseR_PAYT_REQ' + '&userId=' + 
                      this.ns.getCurrentUser() + '&reqId=' + this.saveAcsePaytReq.reqId, '_blank');
   }
   //end
}
