import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';

@Component({
  selector: 'app-payment-request-entry',
  templateUrl: './payment-request-entry.component.html',
  styleUrls: ['./payment-request-entry.component.css']
})
export class PaymentRequestEntryComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) success   : SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) cs         : ConfirmSaveComponent;

  @Input() data: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  paymentData: any = {};
  paymentType: any;
  private sub: any;

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

  constructor(private titleService: Title,  private acctService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService,private route: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Acct-IT | Request Entry');
    this.getTranType();
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
      preparedDate    : this.saveAcitPaytReq.preparedDate,
      reqAmt          : this.saveAcitPaytReq.reqAmt,
      reqDate         : this.saveAcitPaytReq.reqDate,
      reqId           : this.saveAcitPaytReq.reqId,
      reqMm           : this.saveAcitPaytReq.reqMm,
      reqPrefix       : this.saveAcitPaytReq.reqPrefix,
      reqSeqNo        : this.saveAcitPaytReq.reqSeqNo,
      reqStatus       : this.saveAcitPaytReq.reqStatus,
      reqYear         : this.saveAcitPaytReq.reqYear,
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
      this.saveAcitPaytReq.paytReqNo = data['paytReqNo'];
    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    // no payment type validation yet
    if(this.reqDateDate == '' || this.reqDateDate == null || this.reqDateTime == '' || this.reqDateTime == null || this.saveAcitPaytReq.payee == '' || 
      this.saveAcitPaytReq.payee == null || this.saveAcitPaytReq.currCd == '' || this.saveAcitPaytReq.currCd == null || this.saveAcitPaytReq.particulars == '' ||
      this.saveAcitPaytReq.particulars == null || this.saveAcitPaytReq.preparedBy == '' || this.saveAcitPaytReq.preparedBy == null || 
      this.saveAcitPaytReq.requestedBy == '' || this.saveAcitPaytReq.requestedBy == null ){
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

  prepareData(){
    console.log(this.reqDateDate);
    console.log(this.reqDateTime);
    this.saveAcitPaytReq.reqStatus = (this.saveAcitPaytReq.reqStatus == '' || this.saveAcitPaytReq.reqStatus == null)?'N':this.saveAcitPaytReq.reqStatus;
    this.saveAcitPaytReq.reqDate = this.reqDateDate+'T'+this.reqDateTime;
    this.saveAcitPaytReq.reqYear = (this.saveAcitPaytReq.reqYear == '' || this.saveAcitPaytReq.reqYear == null)?this.reqDateDate.split('-')[0]:this.saveAcitPaytReq.reqYear;
    this.saveAcitPaytReq.reqMm   = (this.saveAcitPaytReq.reqMm == '' || this.saveAcitPaytReq.reqMm == null)?Number(this.reqDateDate.split('-')[1]):Number(this.saveAcitPaytReq.reqMm);
  }

  sample(){
     this.saveAcitPaytReq.reqPrefix = this.tranTypeList.filter(i => i.tranTypeCd == this.saveAcitPaytReq.tranTypeCd).map(i => i.typePrefix).toString();
     console.log(this.saveAcitPaytReq.reqPrefix);
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

  tabController(event) {
  	this.onChange.emit(this.data.paymentType);
  }
}

