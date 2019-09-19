import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { AccCVPayReqList } from '@app/_models';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cv-payment-request-list',
  templateUrl: './cv-payment-request-list.component.html',
  styleUrls: ['./cv-payment-request-list.component.css']
})
export class CvPaymentRequestListComponent implements OnInit {
  @ViewChild('paytReqTbl') paytReqTbl : CustNonDatatableComponent;
  @ViewChild('paytReqLov') paytReqLov  : LovComponent;
  @ViewChild('can') can             : CancelButtonComponent;
  @ViewChild('con') con             : ConfirmSaveComponent;
  @ViewChild('suc') suc            : SucessDialogComponent;
  @ViewChild('warnMdl') warnMdl         : ModalComponent;

  passDataPaytReqList: any = {
    tableData     : [],
    tHeader       : ['Payment Request No.','Payment Type','Request Date','Particulars','Requested By','Curr','Amount'],
    dataTypes     : ['lov-input','text','date','text','text','text','currency'],
    magnifyingGlass : ['paytReqNo'],
    nData : {
      paytReqNo     : '',
      tranTypeDesc  : '',
      reqDate       : '',
      particulars   : '',
      requestedBy   : '',
      currCd        : '',
      reqAmt        : '',
      showMG        : 1
    },
    total         : [null,null,null,null,null,'Total','reqAmt'],
    uneditable    : [true,true,true,true,true,true,true],
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    infoFlag      : true,
    paginateFlag  : true,
    pageLength    : 10,
    widths        : [120,250,100,250,150,1,150],
    pageID        : 'passDataCvPaytReq',
    keys          : ['paytReqNo','tranTypeDesc','reqDate','particulars','requestedBy','currCd','reqAmt']
  };

  @Input() passData: any = {
    tranId : ''
  };
  
  passDataLov  : any = {
    selector  : '',
    payeeCd   : '',
    currCd    : ''
  };

  params : any =  {
    savePaytReqList     : [],
    deletePaytReqList   : []
  };

  cvInfo : any = {
    cvNo     : '',
    cvDate   : '',
    cvStatus : '',
    payee    : '',
    cvAmt    : '',
    localAmt : '',
    currCd   : ''
  };

  paytData: any = {
    reqId      : '',
    createUser : '',
    createDate : '',
    updateUser : '',
    updateDate : '',
    enabViewDtl : false
  };

  cancelFlag     : boolean;
  dialogIcon     : string;
  dialogMessage  : string;
  warnMsg        : string = '';
  limitContent   : any[] = [];


  constructor(private titleService: Title,private accountingService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService, 
              public modalService: NgbModal, private router : Router) { }

  ngOnInit() {
    this.titleService.setTitle(" Acct | CV | Payment Request List");
  	this.getCvPaytReqList();
  }

  getCvPaytReqList(){
    var subRes = forkJoin(this.accountingService.getAcitCv(this.passData.tranId),this.accountingService.getAcitCvPaytReqList(this.passData.tranId))
                       .pipe(map(([cv, pr]) => { return { cv, pr }; }));

    subRes.subscribe(data => {
      console.log(data);
      var recCv = data['cv']['acitCvList'][0];
      var recPr = data['pr']['acitCvPaytReqList'];

      this.cvInfo =  Object.assign(this.cvInfo, recCv);
      console.log(this.cvInfo);
      this.cvInfo.cvDate = this.ns.toDateTimeString(this.cvInfo.cvDate); 
      this.cvInfo.cvStatusUp = (this.cvInfo.cvStatus == 'C')?true:false;
      this.passDataLov.payeeCd = this.cvInfo.payeeCd;
      this.passDataLov.currCd  = this.cvInfo.currCd;
      this.passDataPaytReqList.tableData = recPr;
      this.paytReqTbl.refreshTable();
      if(this.cvInfo.cvStatus != 'N' && this.cvInfo.cvStatus != 'F'){
        this.passDataPaytReqList.addFlag = false;
        this.passDataPaytReqList.deleteFlag = false;
        this.passDataPaytReqList.checkFlag = false;
      }
    });
  }

  onSavePaytReqList(){
    console.log(this.params);
    this.accountingService.saveAcitCvPaytReqList(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      this.getCvPaytReqList();
      this.suc.open();
      this.params.savePaytReqList  = [];
      this.params.deletePaytReqList  = [];
    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;
    this.passDataPaytReqList.tableData.forEach(e => {
      e.tranId    = this.passData.tranId;
      e.cvStatus  = this.cvInfo.cvStatus;
      if(e.paytReqNo == '' || e.paytReqNo == null){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.deletePaytReqList.push(e);
        }
      }
      if(e.edited && !e.deleted){
        e.fromCancel = true;
        this.params.savePaytReqList = this.params.savePaytReqList.filter(i => i.reqId != e.reqId);
        e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
        e.createDate    = this.ns.toDateTimeString(e.createDate);
        e.updateUser    = this.ns.getCurrentUser();
        e.updateDate    = this.ns.toDateTimeString(0);
        e.itemNo        = e.itemNo,
        this.params.savePaytReqList.push(e);
      }else if(e.edited && e.deleted){ 
        this.params.deletePaytReqList.push(e);  
      }
    });
  
    console.log(this.passDataPaytReqList.tableData);
      if(isEmpty){
        this.dialogIcon = 'error';
        this.suc.open();
        this.params.savePaytReqList = [];
      }else{
        if(this.params.savePaytReqList.length == 0 && this.params.deletePaytReqList.length == 0){
            if($('input').hasClass('ng-dirty')){
              this.chkCerti();
            }else{
              $('.ng-dirty').removeClass('ng-dirty');
              this.params.savePaytReqList   = [];
              this.params.deletePaytReqList = [];
              this.passDataPaytReqList.tableData = this.passDataPaytReqList.tableData.filter(e => e.reqId != '');
            }
            this.con.confirmModal();
        }else{
          if(this.cancelFlag == true){
            this.con.showLoading(true);
            setTimeout(() => { try{this.con.onClickYes();}catch(e){}},500);
          }else{
            this.con.confirmModal();
          }
        }
      }
  }

  addDirty(){
    $('input').addClass('ng-dirty');
  }

  chkCerti(){
    this.params.savePaytReqList = this.passDataPaytReqList.tableData.map(e => {
      e.updateDate = this.ns.toDateTimeString(e.updateDate);
      e.createDate = this.ns.toDateTimeString(e.createDate);
      e.cvStatus  = (this.cvInfo.cvStatusUp)?'C':((this.cvInfo.cvStatus == 'C')?'N':this.cvInfo.cvStatus);
      return e;
    });
  }

  showLov(){
    // this.limitContent = [];
    
    // this.passDataPaytReqList.tableData.forEach(e => {
    //   this.limitContent.push(e);
    // });
    this.passDataLov.selector = 'paytReqList';
    this.passDataLov.hide = this.passDataPaytReqList.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.reqId});
    console.log(this.cvInfo.paytReqType);
    this.passDataLov.paytReqType = this.cvInfo.paytReqType;
    this.paytReqLov.openLOV();
    console.log(this.passDataLov);

  }

  setData(data){
    $('input').addClass('ng-dirty');
    this.ns.lovLoader(data.ev, 0);
    var rec = data['data'];

    rec.forEach(e2 => {
      this.passDataPaytReqList.tableData.push(e2);
    
    });
    this.passDataPaytReqList.tableData = this.passDataPaytReqList.tableData.filter(e => e.paytReqNo != '').map(e => {
      e.approvedDate = this.ns.toDateTimeString(e.approvedDate);
      e.createDate   = this.ns.toDateTimeString(e.createDate);
      e.preparedDate = this.ns.toDateTimeString(e.preparedDate);
      e.updateDate   = this.ns.toDateTimeString(e.updateDate);
      e.edited       = true; 
      e.checked      = false;
      return e;
    });;
    console.log(this.passDataPaytReqList.tableData);
    this.paytReqTbl.refreshTable();

  }

   onRowClick(event){
     console.log(event);
    if(event != null){
      this.paytData.reqId = event.reqId;
      this.paytData.createUser = event.createUser;
      this.paytData.createDate = this.ns.toDateTimeString(event.createDate);
      this.paytData.updateUser = event.updateUser;
      this.paytData.updateDate = this.ns.toDateTimeString(event.updateDate);
      this.paytData.enabViewDtl = (event.paytReqNo != '')?true:false;
    }else{
      this.paytData.enabViewDtl = false;
    }
  }

  checkCancel(){
    if(this.cancelFlag){
      this.can.onNo();
    }else{
      this.suc.modal.closeModal();
    }
  }

  onClickViewDetails(){
    setTimeout(() => {
      this.router.navigate(['/generate-payt-req', { tranId : this.passData.tranId ,reqId : this.paytData.reqId , from: 'cv-paytreqlist' }], { skipLocationChange: true });
    },100);
  }
}
