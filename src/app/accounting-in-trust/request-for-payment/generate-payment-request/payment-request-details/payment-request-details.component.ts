import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService, ClaimsService } from '../../../../_services';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { MtnClmHistoryLovComponent } from '@app/maintenance/mtn-clm-history-lov/mtn-clm-history-lov.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css']
})
export class PaymentRequestDetailsComponent implements OnInit {
  @ViewChild('mtnClmHistLov') clmHistLov      : MtnClmHistoryLovComponent;
  @ViewChild('cedCompTbl') cedCompTbl         : CustEditableNonDatatableComponent;
  @ViewChild('inwardTbl') inwardTbl           : CustEditableNonDatatableComponent;
  @ViewChild('warnMdl') warnMdl               : ModalComponent;
  @ViewChild('aginSoaLov') aginSoaLov         : LovComponent;

  @ViewChild('canClm') canClm             : CancelButtonComponent;
  @ViewChild('conClm') conClm             : ConfirmSaveComponent;
  @ViewChild('sucClm') sucClm             : SucessDialogComponent;
  @ViewChild('canInw') canInw             : CancelButtonComponent;
  @ViewChild('conInw') conInw             : ConfirmSaveComponent;
  @ViewChild('sucInw') sucInw             : SucessDialogComponent;

  @Input() rowData : any = {
    reqId : ''
  };

  cedingCompanyData: any = {
  	tableData     : [],
  	tHeader       : ['Claim No.','Hist No.','Hist Category','Hist Type','Payment For', 'Insured', 'Ex-Gratia','Curr','Curr Rate','Reserve Amount','Payment Amount','Payment Amount (PHP)'],
    dataTypes     : ['lov-input', 'sequence-2', 'text', 'text', 'text', 'text', 'checkbox','text', 'percent','currency', 'currency', 'currency'],
    magnifyingGlass : ['claimNo'],
  	nData: {
      claimNo        : '',
      histNo         : '',
      histCatDesc    : '',
      histTypeDesc   : '',
      paymentFor     : '',
      insuredDesc    : '',
      exGratia       : '',
      currCd         : '',
      currRate       : '',
      reserveAmt     : '',
      reqAmt         : '',
      localAmt       : '',
      showMG         : 1
    },
  	paginateFlag  : true,
  	infoFlag      : true,
  	pageID        : 'cedingCompanyData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
  	checkFlag     : true,
  	addFlag       : true,
  	deleteFlag    : true,
    uneditable    : [true,true,true,true,false,true,true,true,true,true,true,true],
  	total         : [null, null, null, null,null, null, null,null, 'Total', 'reserveAmt', 'paytAmt', 'localAmt'],
    widths        : [130,120, 120,200,200,1,1,1,1,85,120,120,120],
    keys          : ['claimNo','histNo','histCatDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currencyCd','currencyRt','reserveAmt','paytAmt','localAmt']
  };

  inwardPolBalData: any = {
    tableData     : [],
    tHeader       : ['Policy No.','Inst No.','Due Date','Curr','Curr Rate','Balance','Payment','Premium', 'RI Commission','RI Comm. VAT', 'Charges', 'Net Return'],
    dataTypes     : ['lov-input', 'sequence-2', 'date', 'text', 'percent', 'currency', 'currency','currency', 'currency','percent','currency', 'currency'],
    magnifyingGlass : ['policyNo'],
    nData: {
      policyNo       : '',
      instNo         : '',
      dueDate        : '',
      currCd         : '',
      currRate       : '',
      netDue         : '',
      prevPaytAmt    : '',
      premAmt        : '',
      riComm         : '',
      riCommVat      : '',
      charges        : '',
      returnAmt      : '',
      showMG         : 1
    },
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'inwardPolBalData'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [true,true,true,true,true,true,true,true,true,true,true,false],
    total         : [null, null, null, null, 'Total', 'netDue', 'prevPaytAmt', 'premAmt', 'riComm', null, 'charges', 'returnAmt'],
    widths        : [130,1,110,1,110,120,120,120,120,120,120,120,120],
    keys          : ['policyNo','instNo','dueDate','currCd','currRate','netDue','prevPaytAmt','premAmt','riComm','riCommVat','charges','returnAmt']
  };

  passData : any = {
    selector      :'',
  };

  tranTypeList    : any;
  tabTitle        : string = '';
  limitClmHistTbl : any[] = [];
  limitHistCat    : string = '';
  cancelFlag      : boolean;
  cancelFlagInw   : boolean;
  dialogIcon      : string;
  dialogMessage   : string;
  warnMsg         : string = '';
  recPrqTrans     : any;

  params : any =  {
    savePrqTrans     : [],
    deletePrqTrans   : []
  };

  requestData     : any;
  selectedTblData : any;
  limitContent    : any[] = [];


  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService, private clmService: ClaimsService) {
  }

  ngOnInit() {
    this.getAcitPaytReq();
    this.getPrqTrans();
  }

  getAcitPaytReq(){
    this.acctService.getPaytReq(this.rowData.reqId)
    .subscribe(data => {
      console.log(data);
      var rec = data['acitPaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate); return e; });
      this.requestData = rec[0];
      console.log(this.requestData);
    });
  }

  getPrqTrans(){
    this.acctService.getAcitPrqTrans(this.rowData.reqId,'')
    .subscribe(data => {
      console.log(data);
      this.recPrqTrans = data['acitPrqTrans'];

      if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 2 || this.requestData.tranTypeCd == 3){
        this.cedingCompanyData.tableData = [];
        this.getClmHist();
      }else if(this.requestData.tranTypeCd == 4){
        this.inwardPolBalData.tableData = [];
        this.getAcitPrqInwPol();
      }
    });
  }

  getAcitPrqInwPol(){
    this.acctService.getAcitPrqInwPol()
    .subscribe(data => {
      console.log(data);
      var recAcitPrqInwPol = data['acitPrqInwPolList'];
    });
  }

  getClmHist(){
    this.clmService.getClaimHistory()
    .subscribe(data => {
      console.log(data);
      var recClmHist  = data['claimReserveList'].map(e => e.clmHistory).flatMap(e => { return e }).filter(e => (this.requestData.tranTypeCd == 3)?e.histCategory == 'L':e.histCategory != 'L').map(e => { return e });
      console.log(recClmHist);

      this.recPrqTrans.forEach(e => {
        this.cedingCompanyData.tableData.push(recClmHist.filter(e2 => e2.claimId == e.claimId && e2.histNo == e.histNo && e2.projId == e.projId )
                                                              .map(e2 => { 
                                                                e2.paymentFor = e.paymentFor; 
                                                                e2.createUser = e.createUser;
                                                                e2.updateUser = e.updateUser;
                                                                e2.createDate = e.createDate;
                                                                e2.updateDate = e.updateDate;
                                                                e2.itemNo     = e.itemNo;
                                                                return e2; 
                                                              }));
      });
      this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.flatMap(e => { return e });
      this.cedCompTbl.refreshTable();
      console.log(this.cedingCompanyData.tableData);
    });
  }

  showLOV(event, from){
    console.log(this.limitContent);
    console.log(event + ' - ' + from);
    if(from.toUpperCase() == 'LOVCEDTBL'){
      this.cedingCompanyData.tableData.forEach(e => {
        this.limitClmHistTbl.push(e);
      });
      this.limitHistCat = (this.requestData.tranTypeCd == 3)?'L':'AO';
      this.clmHistLov.modal.openNoClose();
    }else if(from.toUpperCase() == 'LOVINWARDTBL'){
      this.inwardPolBalData.tableData.forEach(e =>{
        //this.limitContent.push(e);
      });
      this.passData.selector = 'acitSoaDtlPrq';
      this.aginSoaLov.openLOV();
    }
    
  }

  setData(data, from){
    console.log(this.limitContent);
    if(from.toUpperCase() == 'LOVCEDTBL'){
      data.forEach(e => {
        if(this.cedingCompanyData.tableData.some(e2 => e2.claimId != e.claimId && e2.histNo != e.histNo)){
          this.cedingCompanyData.tableData.push(e);
          this.limitClmHistTbl.push(e);
        }
      });
      this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.filter(e => e.claimNo != '').map(e => { e.edited = true; e.checked = false; e.createDate = ''; e.createUser = ''; return e});
      this.cedCompTbl.refreshTable();
    }else if(from.toUpperCase() == 'LOVINWARDTBL'){
      var recAgingSoaDtl = data['data'];
      recAgingSoaDtl.forEach(e => {
        if(this.inwardPolBalData.tableData.some(e2 => e2.policyId != e.policyId && e2.instNo != e.instNo)){
          this.inwardPolBalData.tableData.push(e);
          //this.limitContent.push(e);
        }
      });
      this.inwardPolBalData.tableData = this.inwardPolBalData.tableData.filter(e => e.policyNo != '')
                                            .map(e => { e.edited = true; e.checked = false;e.createDate = ''; e.createUser = '';e.premAmt = e.balPremDue;e.riComm  = e.balRiComm;
                                                        e.riCommVat = e.balRiCommVat;e.charges = e.balChargesDue;e.returnAmt = e.netDue; return e;});

      console.log(this.inwardPolBalData.tableData);
      this.inwardTbl.refreshTable();
    }
  }

  onClickSave(){
    if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 2 || this.requestData.tranTypeCd == 3){
      this.onClickSaveCPC();
    }else if(this.requestData.tranTypeCd == 4){
      this.onClickSaveInw();
    }
  }

  onClickSaveInw(cancelFlag?){
    console.log('onClickSaveInw');
    this.cancelFlagInw = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    this.inwardPolBalData.tableData.forEach(e => {
      var rec = {
            claimId         : '',
            createUser      : (e.createUser == '' || e.createUser == null)?this.ns.getCurrentUser():e.createUser,
            createDate      : (e.createDate == '' || e.createDate == null)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate),
            currAmt         : e.returnAmt,
            currCd          : e.currCd,
            currRate        : e.currRate,
            histNo          : '',
            instNo          : e.instNo,
            investmentId    : '',
            itemNo          : e.itemNo,
            localAmt        : e.returnAmt,
            paymentFor      : '',
            policyId        : e.policyId,
            projId          : '',
            quarterEnding   : '',
            refNo           : '',
            remarks         : '',
            reqId           : this.rowData.reqId,
            updateUser      : this.ns.getCurrentUser(),
            updateDate      : this.ns.toDateTimeString(0)
          };

      if(e.edited && !e.deleted){
        this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.policyId != e.policyId);
        this.params.savePrqTrans.push(rec);
      }else if(e.edited && e.deleted){
        this.params.deletePrqTrans.push(rec);
      }else{
        console.log('ELSE IN SAVE');
      }
    });

    console.log(this.inwardPolBalData.tableData);
    console.log(this.params);
    var returnAmt = this.inwardPolBalData.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.returnAmt != null ?parseFloat(b.returnAmt):0),0);
    console.log(returnAmt);

    if(Number(this.requestData.reqAmt) < Number(returnAmt)){
      this.warnMsg = 'The Total Inward Policy Balances Returns must not exceed the Requested Amount.';
      this.warnMdl.openNoClose();
      this.params.savePrqTrans   = [];
      this.params.deletePrqTrans = [];
    }else{
      if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
        $('.ng-dirty').removeClass('ng-dirty');
        this.conInw.confirmModal();
        this.params.savePrqTrans   = [];
        this.params.deletePrqTrans = [];
        this.inwardPolBalData.tableData = this.inwardPolBalData.tableData.filter(e => e.policyNo != '');
      }else{
        console.log(this.cancelFlagInw);
        if(this.cancelFlagInw == true){
          this.conInw.showLoading(true);
          setTimeout(() => { try{this.conInw.onClickYes();}catch(e){}},500);
        }else{
          this.conInw.confirmModal();
        }
      }
    }
  }

  onClickSaveCPC(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    this.cedingCompanyData.tableData.forEach(e => {
      var rec = {
            claimId         : e.claimId,
            createUser      : (e.createUser == '' || e.createUser == null)?this.ns.getCurrentUser():e.createUser,
            createDate      : (e.createDate == '' || e.createDate == null)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate),
            currAmt         : e.paytAmt,
            currCd          : e.currencyCd,
            currRate        : e.currencyRt,
            histNo          : e.histNo,
            instNo          : '',
            investmentId    : '',
            itemNo          : e.itemNo,
            localAmt        : e.paytAmt,
            paymentFor      : e.paymentFor,
            policyId        : '',
            projId          : e.projId,
            quarterEnding   : '',
            refNo           : '',
            remarks         : '',
            reqId           : this.rowData.reqId,
            updateUser      : this.ns.getCurrentUser(),
            updateDate      : this.ns.toDateTimeString(0)
          };

      if(e.edited && !e.deleted){
        this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.claimId != e.claimId);
        this.params.savePrqTrans.push(rec);
      }else if(e.edited && e.deleted){
        this.params.deletePrqTrans.push(rec);
      }else{
        console.log('ELSE IN SAVE');
      }
    });

    console.log(this.cedingCompanyData.tableData);
    console.log(this.params.savePrqTrans);

    var paytAmt = this.cedingCompanyData.tableData.filter(e => e.deleted != true).reduce((a,b)=>a+(b.paytAmt != null ?parseFloat(b.paytAmt):0),0);
    console.log(paytAmt);

    if(Number(this.requestData.reqAmt) < Number(paytAmt)){
      this.warnMsg = 'The Total Payment Amount of Claim Histories must not exceed the Requested Amount.';
      this.warnMdl.openNoClose();
      this.params.savePrqTrans   = [];
      this.params.deletePrqTrans = [];
    }else{
      if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
        $('.ng-dirty').removeClass('ng-dirty');
        this.conClm.confirmModal();
        this.params.savePrqTrans   = [];
        this.params.deletePrqTrans = [];
        this.cedingCompanyData.tableData = this.cedingCompanyData.tableData.filter(e => e.claimNo != '');
      }else{
        if(this.cancelFlag == true){
          this.conClm.showLoading(true);
          setTimeout(() => { try{this.conClm.onClickYes();}catch(e){}},500);
        }else{
          this.conClm.confirmModal();
        }
      }
    }
  }

  onSaveInw(){
    var prqInwPol = {
      deleteAcitPrqInwPol : [],
      saveAcitPrqInwPol   : []
    };

    this.inwardPolBalData.tableData.forEach(e => {
      var rec = {
        charges     : e.charges,
        createDate  : e.createDate,
        createUser  : e.createUser,
        itemNo      : e.itemNo,
        netDue      : e.netDue,
        premAmt     : e.premAmt,
        prevPaytAmt : e.prevPaytAmt,
        reqId       : this.requestData.reqId,
        returnAmt   : e.returnAmt,
        riComm      : e.riComm,
        riCommVat   : e.riCommVat,
        updateDate  : this.ns.toDateTimeString(0),
        updateUser  : this.ns.getCurrentUser()
      };

      if(e.edited && !e.deleted){
        //this.params.savePrqTrans = this.params.savePrqTrans.filter(i => i.policyId != e.policyId);
        prqInwPol.saveAcitPrqInwPol.push(rec);
      }else if(e.edited && e.deleted){
        prqInwPol.deleteAcitPrqInwPol.push(rec);
      }else{
        console.log('ELSE IN SAVE');
      }
    });

    console.log(prqInwPol);
    // this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    // .subscribe(data => {
    //   console.log(data);
    //   this.getPrqTrans();
    //   this.getAcitPaytReq();
    //   this.sucInw.open();
    //   this.params.savePrqTrans  = [];
    //   this.params.deletePrqTrans  = [];
    // });
  }

  onSaveCPC(){
    console.log(this.params);
    this.acctService.saveAcitPrqTrans(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      this.getPrqTrans();
      this.getAcitPaytReq();
      this.sucClm.open();
      this.params.savePrqTrans  = [];
      this.params.deletePrqTrans  = [];
    });
  }

  onRowClick(event){
    this.selectedTblData = event;
    if(event != null){
      this.selectedTblData.createDate = this.ns.toDateTimeString(event.createDate);
      this.selectedTblData.updateDate = this.ns.toDateTimeString(event.updateDate);  
    }
  }

  checkCancel(){
    if(this.cancelFlag){
      this.canClm.onNo();
    }else{
      this.sucClm.modal.closeModal();
    }
  }

  checkCancelInw(){
    if(this.cancelFlagInw){
      this.canInw.onNo();
    }else{
      this.sucInw.modal.closeModal();
    }
  }

  cancel(){
    if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 2 || this.requestData.tranTypeCd == 3){
      this.canClm.clickCancel();  
    }else if(this.requestData.tranTypeCd == 4){
      this.canInw.clickCancel();
    }
    
  }

  addDirty(from){
    console.log(from);
    if(from == 'cedTbl'){
      $('#cedTbl').addClass('ng-dirty');
    }else if(from == 'inwTbl'){
      $('#inwTbl').addClass('ng-dirty');
    }
  }

}
