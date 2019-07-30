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

  // @Input() data: any = {};
  // @Output() onChange: EventEmitter<any> = new EventEmitter();

  saveAcitPaytReq : any = {
    paytReqNo       : '',
    approvedBy      : '',
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
    tranTypeCd      : '',
    updateDate      : '',
    updateUser      : ''
  };

  dialogMessage   : string = '';
  dialogIcon      : string = '';
  cancelFlag      : boolean;
  reqDateDate     : string = '';
  reqDateTime     : string = '';
  fromCancel      : boolean;
  acitPaytReq     : any;
  tranTypeList    : any[] = [];
  private sub     : any;
  initDisabled    : boolean;
  fromBtn         : string = '';

  @Output() paytData : EventEmitter<any> = new EventEmitter();
  @Input() rowData: any = {
    reqId : ''
  };

  paymentData: any = {};
  paymentType: any;

  constructor(private titleService: Title,  private acctService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService,private activatedRoute: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Acct-IT | Request Entry');
    this.getTranType();

    this.sub = this.activatedRoute.params.subscribe(params => {
      if(Object.keys(params).length != 0 || (this.rowData.reqId != null && this.rowData.reqId != '')){
        this.saveAcitPaytReq.reqId = params['reqId'];
        this.getAcitPaytReq();
        this.initDisabled = false;
      }else{
        this.initDisabled = true;
        this.reqDateDate = this.ns.toDateTimeString(0).split('T')[0];
        this.reqDateTime = this.ns.toDateTimeString(0).split('T')[1];
        this.saveAcitPaytReq.reqStatusDesc = 'New';
        this.saveAcitPaytReq.reqStatus = 'N';
        this.saveAcitPaytReq.currCd  = 'PHP';
        this.saveAcitPaytReq.currRate = 1;
        this.saveAcitPaytReq.preparedBy = this.ns.getCurrentUser();
        this.saveAcitPaytReq.preparedDate = this.ns.toDateTimeString(0);
      }
    });

    (this.saveAcitPaytReq.reqStatusDesc.toUpperCase() == 'CANCELLED')?this.cancelledStats():'';
  }

  getAcitPaytReq(){
    this.acctService.getPaytReq(this.saveAcitPaytReq.reqId)
    .subscribe(data => {
      console.log(data);
      var rec = data['acitPaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate); return e; });
      this.saveAcitPaytReq = rec[0];
      this.splitPaytReqNo(this.saveAcitPaytReq.paytReqNo);
      this.reqDateDate = this.saveAcitPaytReq.reqDate.split('T')[0];
      this.reqDateTime = this.saveAcitPaytReq.reqDate.split('T')[1];
      console.log(this.saveAcitPaytReq);
    });
  }

  onSaveAcitPaytReq(){
    this.acitPaytReq = {
      approvedBy      : this.saveAcitPaytReq.approvedBy,
      approvedDate    : this.saveAcitPaytReq.approvedDate,
      createDate      : (this.saveAcitPaytReq.createDate == '' || this.saveAcitPaytReq.createDate == null)?this.ns.toDateTimeString(0):this.saveAcitPaytReq.createDate,
      createUser      : (this.saveAcitPaytReq.createUser == '' || this.saveAcitPaytReq.createUser == null)?this.ns.getCurrentUser():this.saveAcitPaytReq.createUser,
      currCd          : this.saveAcitPaytReq.currCd,
      currRate        : this.saveAcitPaytReq.currRate,
      localAmt        : this.saveAcitPaytReq.localAmt,
      particulars     : this.saveAcitPaytReq.particulars,
      payee           : this.saveAcitPaytReq.payee,
      payeeNo         : this.saveAcitPaytReq.payeeNo,
      preparedBy      : this.saveAcitPaytReq.preparedBy,
      preparedDate    : (this.saveAcitPaytReq.preparedDate == '' || this.saveAcitPaytReq.preparedDate == null)?this.ns.toDateTimeString(0):this.saveAcitPaytReq.preparedDate,
      reqAmt          : this.saveAcitPaytReq.reqAmt,
      reqDate         : this.reqDateDate+'T'+this.reqDateTime,
      reqId           : this.saveAcitPaytReq.reqId,
      reqMm           : (this.saveAcitPaytReq.reqMm == '' || this.saveAcitPaytReq.reqMm == null)?Number(this.reqDateDate.split('-')[1]):Number(this.saveAcitPaytReq.reqMm),
      reqPrefix       : this.tranTypeList.filter(i => i.tranTypeCd == this.saveAcitPaytReq.tranTypeCd).map(i => i.typePrefix).toString(),
      reqSeqNo        : this.saveAcitPaytReq.reqSeqNo,
      reqStatus       : this.saveAcitPaytReq.reqStatus,
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
      this.dialogIcon = '';
      this.dialogMessage = '';
      this.success.open();
      this.saveAcitPaytReq.reqId =  data['reqIdOut'];
      this.paytData.emit({reqId:data['reqIdOut']});
      this.saveAcitPaytReq.paytReqNo = data['paytReqNo'];
      this.splitPaytReqNo(this.saveAcitPaytReq.paytReqNo);
      this.initDisabled = false;
    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    // no payment type validation yet
    if(this.reqDateDate == '' || this.reqDateDate == null || this.reqDateTime == '' || this.reqDateTime == null || this.saveAcitPaytReq.payee == '' || 
      this.saveAcitPaytReq.payee == null || this.saveAcitPaytReq.currCd == '' || this.saveAcitPaytReq.currCd == null || this.saveAcitPaytReq.particulars == '' ||
      this.saveAcitPaytReq.particulars == null || this.saveAcitPaytReq.preparedBy == '' || this.saveAcitPaytReq.preparedBy == null || 
      this.saveAcitPaytReq.requestedBy == '' || this.saveAcitPaytReq.requestedBy == null || this.saveAcitPaytReq.tranTypeCd == '' || this.saveAcitPaytReq.tranTypeCd == null ||
      this.saveAcitPaytReq.reqAmt == '' || this.saveAcitPaytReq.reqAmt == null || this.saveAcitPaytReq.currRate == '' || this.saveAcitPaytReq.currRate == null){
        this.dialogIcon = 'error';
        this.success.open();
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
  }

  getTranType(){
    this.mtnService.getMtnAcitTranType('PRQ')
    .subscribe(data => {
      console.log(data);
      this.tranTypeList = (data['tranTypeList']).sort((a,b) => a.tranTypeCd-b.tranTypeCd);
    });
  }

  cancelledStats(){
    $('.warn').prop('readonly',true);
    $('.magni-icon').remove();
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
    this.saveAcitPaytReq.localAmt = (this.saveAcitPaytReq.localAmt == '' || this.saveAcitPaytReq.localAmt == null)?this.saveAcitPaytReq.reqAmt:this.saveAcitPaytReq.localAmt;
  }

  setData(data,from){
    this.ns.lovLoader(data.ev, 0);
    if(from.toLowerCase() == 'curr'){
      this.saveAcitPaytReq.currCd = data.currencyCd;
      this.saveAcitPaytReq.currRate =  data.currencyRt;
    }else if(from.toLowerCase() == 'prep-user'){
      this.saveAcitPaytReq.preparedBy = data.userId;
    }else if(from.toLowerCase() == 'req-user'){
      this.saveAcitPaytReq.requestedBy = data.userId;
    }else if(from.toLowerCase() == 'app-user'){
      this.saveAcitPaytReq.approvedBy = data.userId;
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
    console.log(fromUser);
    if(fromUser.toLowerCase() == 'curr'){
      this.currLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'prep-user'){
      this.prepUserLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'req-user'){
      this.reqUserLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'app-user'){
      this.appUserLov.modal.openNoClose();
      this.saveAcitPaytReq.approvedBy = this.ns.getCurrentUser();
    }
  }

  onCancelReq(){
    this.fromBtn = 'cancel-req';
  }

  onYesCancelReq(){
    $('.globalLoading').css('display','block');
    this.confirmMdl.closeModal();
    var updatePaytReqStats = {
      reqId       : this.saveAcitPaytReq.reqId,
      reqStatus   : 'X',
      updateUser  : this.ns.getCurrentUser()
    };

    console.log(JSON.stringify(updatePaytReqStats));
    this.acctService.updateAcitPaytReqStat(JSON.stringify(updatePaytReqStats))
    .subscribe(data => {
      console.log(data);
      $('.globalLoading').css('display','none');
      this.saveAcitPaytReq.reqStatusDesc = 'Cancelled';
      this.dialogIcon = '';
      this.dialogMessage = '';
      this.success.open();
      this.cancelledStats();
    });
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
    this.confirmMdl.openNoClose();
    this.fromBtn = from;
  }

  onNoAppby(){
    this.saveAcitPaytReq.approvedBy = '';
    this.saveAcitPaytReq.approvedDate = '';
    this.confirmMdl.closeModal();
  }

  onTabChange($event: NgbTabChangeEvent) {

      if($event.nextId === 'Exit'){
        $event.preventDefault();
      this.router.navigateByUrl('/maintenance-qu-pol');
      }

   }
}

