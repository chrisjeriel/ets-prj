import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService, ClaimsService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { MtnClmHistoryLovComponent } from '@app/maintenance/mtn-clm-history-lov/mtn-clm-history-lov.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-acc-s-request-details',
  templateUrl: './acc-s-request-details.component.html',
  styleUrls: ['./acc-s-request-details.component.css'],
  providers: [DatePipe]
})
export class AccSRequestDetailsComponent implements OnInit {
  @ViewChild('cvTbl') cvTbl         : CustEditableNonDatatableComponent;
  @ViewChild('can') can             : CancelButtonComponent;
  @ViewChild('con') con             : ConfirmSaveComponent;
  @ViewChild('suc') suc             : SucessDialogComponent;

  @Input() rowData : any = {
    reqId : ''
  };

  cvData: any = {
    tableData     : [],
    tHeader       : ['Item', 'Reference No.', 'Description', 'Curr', 'Curr Rate', 'Amount', 'Amount(PHP)'],
    dataTypes     : ['text', 'text', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: {
      itemName  : '',
      refNo     : '',
      remarks   : '',
      currCd    : '',
      currRate  : '',
      currAmt   : 0,
      localAmt  : 0,
      newRec    : 1
    },
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'cvDataTbl',
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [false,false,false,true,true,false,true],
    total         : [null, null, null, null,'Total', 'currAmt', 'localAmt'],
    widths        : ['auto','auto','auto','auto','auto','auto','auto'],
    keys          : ['itemName','refNo','remarks','currCd','currRate','currAmt','localAmt']
  };

  tranTypeList       : any;
  cancelFlag         : boolean;
  dialogIcon         : string;
  dialogMessage      : string;
  warnMsg            : string = '';
  recPrqTrans        : any;
  requestData        : any;
  selectedTblData    : any;
  private sub        : any;

  passData : any = {
    selector   : '',
    payeeNo    : '',
    hide       : []
  };

  params : any =  {
    savePrqTrans     : [],
    deletePrqTrans   : []
  };

  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService, 
              private clmService: ClaimsService, public modalService: NgbModal, private dp: DatePipe,private decPipe: DecimalPipe) {
  }

  ngOnInit() {
    this.getPaytReqPrqTrans();
  }

  getPaytReqPrqTrans(){
    var subRes = forkJoin(this.acctService.getAcsePaytReq(this.rowData.reqId),this.acctService.getAcsePrqTrans(this.rowData.reqId,''))
                 .pipe(map(([pr,prq]) => { return { pr, prq }; }));
    subRes.subscribe(data => {
      this.requestData = data['pr']['acsePaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate); return e; })[0];
      this.recPrqTrans = data['prq']['acsePrqTrans'];

      console.log(this.requestData);
      console.log(this.recPrqTrans);

      if(this.requestData.tranTypeCd == 1){
        this.cvData.tableData = [];
        this.cvData.tableData = this.recPrqTrans;
        setTimeout(() => {
          this.cvTbl.refreshTable();
        },0);
      }
    });
  }

  onClickSave(cancelFlag?){ 
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    this.params.savePrqTrans = [];
    var isEmpty = 0;

    this.cvData.tableData.forEach(e => {
      e.reqId    = this.rowData.reqId;
      e.reqId    = this.rowData.reqId;
      if(e.itemName == '' || e.itemName == null || e.currCd == '' || e.currCd == null || e.currRate == '' || e.currRate == null || 
         e.currAmt == '' || e.currAmt == null || isNaN(e.currAmt) || e.currAmt == 0){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.deletePrqTrans.push(e);
        }
      }else{
        e.fromCancel = true;
        if(e.edited && !e.deleted){
          e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
          e.createDate    = (e.createDate == '' || e.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate);
          e.quarterEnding = '';
          e.tranTypeCd    = (e.tranTypeCd == '' || e.tranTypeCd == null)?this.requestData.tranTypeCd:e.tranTypeCd;
          e.updateUser    = this.ns.getCurrentUser();
          e.updateDate    = this.ns.toDateTimeString(0);
          this.params.savePrqTrans.push(e);
        }else if(e.edited && e.deleted){ 
          this.params.deletePrqTrans.push(e);  
        }
      }
    });

    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.suc.open();
      this.params.savePrqTrans   = [];
    }else{
        if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
          this.cvTbl.markAsPristine();
          this.con.confirmModal();
          this.params.savePrqTrans   = [];
          this.params.deletePrqTrans = [];
          this.cvData.tableData = this.cvData.tableData.filter(e => e.itemName != '');
        }else{
          console.log(this.cancelFlag);
          if(this.cancelFlag == true){
            this.con.showLoading(true);
            setTimeout(() => { try{this.con.onClickYes();}catch(e){}},500);
          }else{
            this.con.confirmModal();
          }
        }
    }
  }

  onSave(){
    console.log(this.params);
    this.acctService.saveAcsePrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == -1){
        this.getPaytReqPrqTrans();  
      }else{
        this.dialogIcon = 'error';
      }
      this.suc.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
      this.cvTbl.markAsPristine();
    });
  }

  checkCancel(){
    if(this.cancelFlag){
      this.can.onNo();
    }else{
      this.suc.modal.modalRef.close();
    }
  }

  cancel(){
    this.can.clickCancel();
  }

  onChangeCurr(from){
    var tbl;
    if(from.toLowerCase() == 'cv'){
      tbl = this.cvData.tableData;
    }
    
    tbl.forEach(e => {
      e.currCd = this.requestData.currCd;
      e.currRate = this.requestData.currRate;
      e.localAmt = (!isNaN(e.currAmt))?Number(e.currAmt)*Number(e.currRate):0;
    });

  }

  onRowClick(event){
    this.selectedTblData = event;
    if(event != null){
      this.selectedTblData.createDate = this.ns.toDateTimeString(event.createDate);
      this.selectedTblData.updateDate = this.ns.toDateTimeString(event.updateDate);  
    }
  }

  onTabChange($event: NgbTabChangeEvent) {
    // if($event.nextId.toUpperCase() == 'UNCOLTABID'){
    //   this.activeUnColTab = true;
    //   this.activeOthTab = false;
    // }else if($event.nextId.toUpperCase() == 'OTHTABID') {
    //   this.activeOthTab = true;
    //   this.activeUnColTab = false;
    // }else{
    //   this.activeOthTab = false;
    //   this.activeUnColTab = false;
    // }
    this.getPaytReqPrqTrans();
  }



}
