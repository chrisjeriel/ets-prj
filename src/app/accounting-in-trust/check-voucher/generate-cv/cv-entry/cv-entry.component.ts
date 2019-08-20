import { Component, OnInit,ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cv-entry',
  templateUrl: './cv-entry.component.html',
  styleUrls: ['./cv-entry.component.css']
})
export class CvEntryComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) success   : SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) cs         : ConfirmSaveComponent;
  @ViewChild('payeeLov') payeeLov  : LovComponent;
  @ViewChild('bankLov') bankLov    : LovComponent;
  @ViewChild('classLov') classLov  : LovComponent;
  @ViewChild('currLov') currLov    : MtnCurrencyComponent;
  @ViewChild('prepUserLov') prepUserLov       : MtnUsersComponent;

  saveAcitCv : any = {
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

  dialogMessage   : string = '';
  dialogIcon      : string = '';
  cancelFlag      : boolean;
  fromCancel      : boolean;
  private sub     : any;

  passDataLov  : any = {
    selector     : '',
    payeeClassCd : ''
  };

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal, private ns: NotesService, private mtnService: MaintenanceService,private activatedRoute: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | CV Entry");
    this.getAcitCv();

    this.sub = this.activatedRoute.params.subscribe(params => {
      if(Object.keys(params).length != 0 ){
      //|| (this.rowData.reqId != null && this.rowData.reqId != '')){
        this.saveAcitCv.tranId = params['tranId'];
        //this.initDisabled = false;
      }else{
        //this.initDisabled = true;
      }

      this.getAcitCv();
    });
  }

  getAcitCv(){
    console.log(this.saveAcitCv.tranId);
    var subRes = forkJoin(this.accountingService.getAcitCv(this.saveAcitCv.tranId), this.mtnService.getMtnPrintableName(''))
                          .pipe(map(([cv,pn]) => { return { cv, pn }; }));

    subRes.subscribe(data => {
      console.log(data);
      var recPn = data['pn']['printableNames'];

      if(this.saveAcitCv.tranId == '' || this.saveAcitCv.tranId == null){
        this.saveAcitCv.cvStatus = 'N';
        this.saveAcitCv.cvStatusDesc = 'New';
        this.saveAcitCv.cvDate = this.ns.toDateTimeString(0);
        this.saveAcitCv.currCd = 'PHP';
        recPn.forEach(e => {
          if(e.userId.toUpperCase() == this.ns.getCurrentUser().toUpperCase()){
            this.saveAcitCv.preparedByName  = e.printableName;
            this.saveAcitCv.preparedBy   = e.userId;
            this.saveAcitCv.preparedByDes = e.designation;
          }
        });
      }else{
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
              e.preparedByDes = e2.designation;
            }
          });
          return e;
        });
        //this.saveAcitCv = recCv[0];
        this.saveAcitCv = Object.assign(this.saveAcitCv,recCv[0]);
        console.log(recCv);
        console.log(this.saveAcitCv);
      }

    });

    if(this.saveAcitCv.cvNo == '' || this.saveAcitCv.cvNo == null){
      this.saveAcitCv.cvStatus = 'N';
      this.saveAcitCv.cvStatusDesc = 'New';
      this.saveAcitCv.cvDate = this.ns.toDateTimeString(0);
      this.saveAcitCv.currCd = 'PHP';
      this.saveAcitCv.preparedBy = this.ns.getCurrentUser();
    }else{
      
    }
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;

    if(this.saveAcitCv.cvDate == null || this.saveAcitCv.cvDate == '' || this.saveAcitCv.payee == '' ||  this.saveAcitCv.payee == null || this.saveAcitCv.particulars == '' || 
       this.saveAcitCv.particulars == null || this.saveAcitCv.bank == '' || this.saveAcitCv.bank == null || this.saveAcitCv.bankAcct == '' || this.saveAcitCv.bankAcct == null ||
       this.saveAcitCv.cvAmt == '' || this.saveAcitCv.cvAmt == null || this.saveAcitCv.checkNo == '' || this.saveAcitCv.checkNo == null || this.saveAcitCv.currCd == '' || 
       this.saveAcitCv.currCd == null || this.saveAcitCv.currRate == '' || this.saveAcitCv.currRate == null || this.saveAcitCv.checkDate == '' || this.saveAcitCv.checkDate == null ||
       this.saveAcitCv.preparedBy == '' || this.saveAcitCv.preparedBy == null || this.saveAcitCv.preparedDate == '' || this.saveAcitCv.preparedDate == null || 
       this.saveAcitCv.checkClass == '' || this.saveAcitCv.checkClass == null){
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

    console.log(this.saveAcitCv);
  }

  onSaveAcitCv(){
    var saveCv = {
      bank             : this.saveAcitCv.bank,
      bankAcct         : this.saveAcitCv.bankAcct,
      certifiedBy      : this.saveAcitCv.certifiedBy,
      certifiedDate    : this.ns.toDateTimeString(this.saveAcitCv.certifiedDate),
      checkClass       : this.saveAcitCv.checkClass,
      checkDate        : (this.saveAcitCv.checkDate == '' || this.saveAcitCv.checkDate == null)?this.ns.toDateTimeString(0):this.saveAcitCv.checkDate,
      checkNo          : this.saveAcitCv.checkNo,
      closeDate        : this.ns.toDateTimeString(this.saveAcitCv.mainCloseDate),
      createDate       : (this.saveAcitCv.createDate == '' || this.saveAcitCv.createDate == null)?this.ns.toDateTimeString(0):this.saveAcitCv.createDate,
      createUser       : (this.saveAcitCv.createUser == '' || this.saveAcitCv.createUser == null)?this.ns.getCurrentUser():this.saveAcitCv.createUser,
      currCd           : this.saveAcitCv.currCd,
      currRate         : this.saveAcitCv.currRate,
      cvAmt            : this.saveAcitCv.cvAmt,
      cvDate           : (this.saveAcitCv.cvDate == '' || this.saveAcitCv.cvDate == null)?this.ns.toDateTimeString(0):this.saveAcitCv.cvDate,
      cvNo             : this.saveAcitCv.cvNo,
      cvStatus         : this.saveAcitCv.cvStatus,
      cvYear           : this.saveAcitCv.cvYear,
      deleteDate       : this.ns.toDateTimeString(this.saveAcitCv.mainDeleteDate),
      localAmt         : this.saveAcitCv.localAmt,
      mainTranId       : this.saveAcitCv.mainTranId,
      particulars      : this.saveAcitCv.particulars,
      payee            : this.saveAcitCv.payee,
      payeeNo          : this.saveAcitCv.payeeNo,
      postDate         : this.ns.toDateTimeString(this.saveAcitCv.mainPostDate),
      preparedBy       : this.saveAcitCv.preparedBy,
      preparedDate     : (this.saveAcitCv.preparedDate == '' || this.saveAcitCv.preparedDate == null)?this.ns.toDateTimeString(0):this.saveAcitCv.preparedDate,
      tranId           : this.saveAcitCv.tranId,
      tranStat         : this.saveAcitCv.mainTranStat,
      updateDate       : this.ns.toDateTimeString(0),
      updateUser       : this.ns.getCurrentUser()
    };

    console.log(saveCv);
    this.accountingService.saveAcitCv(JSON.stringify(saveCv))
    .subscribe(data => {
      console.log(data);
      this.dialogIcon = '';
      this.dialogMessage = '';
      this.success.open();
      this.saveAcitCv.tranId = data['tranIdOut'];
      this.saveAcitCv.mainTranId = data['mainTranIdOut'];
      this.getAcitCv();
    });
  }

  showLov(fromUser){
    console.log(fromUser);
    if(fromUser.toLowerCase() == 'payee'){
      this.passDataLov.selector = 'payee';
      this.payeeLov.openLOV();
    }else if(fromUser.toLowerCase() == 'bank'){
      this.passDataLov.selector = 'mtnBank';
      this.bankLov.openLOV();
    }else if(fromUser.toLowerCase() == 'class'){
      this.passDataLov.selector = 'checkClass';
      this.classLov.openLOV();
    }else if(fromUser.toLowerCase() == 'curr'){
      this.currLov.modal.openNoClose();
    }else if(fromUser.toLowerCase() == 'prep-user'){
      this.prepUserLov.modal.openNoClose();
    }
  }

  setData(data,from){
    $('input').addClass('ng-dirty');
    this.ns.lovLoader(data.ev, 0);
    if(from.toLowerCase() == 'payee'){
      this.saveAcitCv.payee   = data.data.payeeName;
      this.saveAcitCv.payeeNo = data.data.payeeNo;
    }else if(from.toLowerCase() == 'bank'){
      this.saveAcitCv.bankDesc   = data.data[0].officialName;
      this.saveAcitCv.bank = data.data[0].bankCd;
    }else if(from.toLowerCase() == 'class'){
      this.saveAcitCv.checkClassDesc   = data.data[0].description;
      this.saveAcitCv.checkClass = data.data[0].code;
    }else  if(from.toLowerCase() == 'curr'){
      this.saveAcitCv.currCd = data.currencyCd;
      this.saveAcitCv.currRate =  data.currencyRt;
      this.saveAcitCv.localAmt = Number(this.saveAcitCv.cvAmt) * Number(data.currencyRt);
    }else if(from.toLowerCase() == 'prep-user'){
      this.saveAcitCv.preparedByName = data.printableName;
      this.saveAcitCv.preparedBy  = data.userId;
      this.saveAcitCv.preparedDes  = data.designation;
    }
  }

  reCompAmt(){
    this.saveAcitCv.localAmt = Number(this.saveAcitCv.cvAmt) * Number(this.saveAcitCv.currRate);
  }

  checkCode(event,from){
    this.ns.lovLoader(event.ev, 1);
    if(from.toLowerCase() == 'curr'){
      this.currLov.checkCode(this.saveAcitCv.currCd.toUpperCase(),event.ev);
    }else if(from.toLowerCase() == 'prep-user'){
      this.prepUserLov.checkCode(this.saveAcitCv.preparedBy.toUpperCase(),event.ev);
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

}
