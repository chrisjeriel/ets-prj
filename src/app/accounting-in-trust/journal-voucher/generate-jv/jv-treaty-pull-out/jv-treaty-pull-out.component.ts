import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AgainstNegativeTreaty, AgainstLoss } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-jv-treaty-pull-out',
  templateUrl: './jv-treaty-pull-out.component.html',
  styleUrls: ['./jv-treaty-pull-out.component.css']
})
export class JvTreatyPullOutComponent implements OnInit {
  
  @Output() emitData = new EventEmitter<any>();
  @Input() cedingParams:any;
  @Input() jvDetail:any;
  @ViewChild('quarterTable') quarterTable: CustEditableNonDatatableComponent;
  @ViewChild('invTable') invTable: CustEditableNonDatatableComponent;
  @ViewChild(QuarterEndingLovComponent) quarterModal: QuarterEndingLovComponent; 
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {
      tableData: [],
      tHeader: ['Quarter Ending', 'Currency', 'Currency Rate', 'Amount', 'Amount(PHP)'],
      dataTypes: ['date', 'text', 'percent', 'currency', 'currency'],
      nData: {
        showMG:1,
        tranId:'',
        quarterNo : '',
        cedingId : '',
        quarterEnding : '',
        currCd : '',
        currRate : '',
        balanceAmt : '',
        localAmt : '',
        createUser : this.ns.getCurrentUser(),
        createDate : '',
        updateUser : this.ns.getCurrentUser(),
        updateDate : '',
        trtyInvmt: []
      },
      magnifyingGlass: ['quarterEnding'],
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      disableAdd: true,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 3,
      pageID: 'passDataNegative',
      uneditable: [true,true,true,false,true],
      total: [null, null, 'Total', 'balanceAmt', 'localAmt'],
      keys: ['quarterEnding', 'currCd', 'currRate', 'balanceAmt', 'localAmt'],
      widths: [203,50,130,130,130],
  };

  invesmentData: any = {
    tableData:[],
    tHeader:['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value'],
    dataTypes:['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','maturityValue'],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true,
    magnifyingGlass: ['invtCode'],
    nData: {
      tranId : '',
      itemNo : '',
      invtId : '',
      invtCode : '',
      certNo : '',
      invtType : '',
      invtTypeDesc : '',
      invtSecCd : '',
      securityDesc : '',
      maturityPeriod : '',
      durationUnit : '',
      interestRate : '',
      purchasedDate : '',
      maturityDate : '',
      pulloutType : '',
      currCd : '',
      currRate : '',
      invtAmt : '',
      incomeAmt : '',
      bankCharge : '',
      whtaxAmt : '',
      maturityValue : '',
      localAmt : '',
      createUser : this.ns.getCurrentUser(),
      createDate : '',
      updateUser : this.ns.getCurrentUser(),
      updateDate : '',
      showMG: 1
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 
           'invtAmt' , 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue'],
    uneditable: [false, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true ],
    checkFlag: true,
    pageID: 6,
    widths:[140, 150, 127, 130, 90, 83, 85, 1, 1, 1, 85, 120, 120, 120, 120, 120, 120]
  };

  jvDetails: any = {
    cedingName: '',
    delaccTrty: [],
    deleteaccTrty: [],
    saveaccTrty:[],
    saveTrtyInvt: []
  }

  passLov: any = {
    selector: 'acitArInvPullout',
    cedingId: '',
    hide: []
  }

  readOnly: boolean = false;
  dialogIcon : any;
  dialogMessage : any;
  quarterNo: any = '';
  cancelFlag: boolean = false;

  constructor(private ns: NotesService, private accountingService: AccountingService) { }

  ngOnInit() {
    this.passData.nData.currRate = this.jvDetail.currRate;
    this.passData.nData.currCd = this.jvDetail.currCd;
    this.passData.disableAdd = true;
    this.invesmentData.disableAdd = true;
    if(this.jvDetail.statusType == 'N'){
      this.readOnly = false;
    }else {
      this.readOnly = true;
    }
  	this.retrieveInvPullOut();
  }

  retrieveInvPullOut(){
    this.accountingService.getTrtyInv(this.jvDetail.tranId).subscribe((data:any) =>{
      console.log(data)
      this.passData.tableData = [];
      if(data.acctTreatyBal.length != 0){
        this.jvDetails.cedingName = data.acctTreatyBal[0].cedingName
        this.jvDetails.cedingId = data.acctTreatyBal[0].cedingId;
        for (var i = 0; i < data.acctTreatyBal.length; i++) {
          this.passData.tableData.push(data.acctTreatyBal[i]);
          this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = this.ns.toDateTimeString(data.acctTreatyBal[i].quarterEnding);
        }
        this.quarterTable.refreshTable();
        this.quarterTable.onRowClick(null,this.passData.tableData[0]);
        if(this.jvDetail.statusType == 'N'){
          this.passData.disableAdd = false;
        }
      }
    });
  }

  showCedingCompanyLOV(){
  	$('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    console.log(data)
    this.jvDetails.cedingName = data.payeeName;
    this.jvDetails.cedingId = data.payeeCd;
    this.passData.disableAdd = false;
    this.ns.lovLoader(data.ev, 0);
    this.check(this.jvDetails);
  }

  check(data){
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  quarterEndModal(data){
    this.quarterModal.modal.openNoClose();
  }

  onrowClick(data){
    if(data !== null && data.quarterNo !== ''  && data.trtyInvmt.length != 0){
      this.quarterNo = data.quarterNo;
      this.invesmentData.quarterNo = this.quarterNo;
      this.invesmentData.tableData = data.trtyInvmt;
      this.invesmentData.disableAdd = false;
    }else if(data!==null){
      this.invesmentData.disableAdd = false;
      this.invesmentData.tableData = [];
    }else{
      this.invesmentData.disableAdd = true;
      this.invesmentData.tableData = [];
    }
    this.invTable.refreshTable();
  }

  setQuarter(data){
    console.log(data)
    var quarterNo = null;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
    this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
    this.passData.tableData[this.passData.tableData.length - 1].edited = true;
    this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = data;
    quarterNo = data.split('T');
    quarterNo = quarterNo[0].split('-');
    quarterNo = quarterNo[0]+quarterNo[1];
    this.passData.tableData[this.passData.tableData.length - 1].quarterNo = parseInt(quarterNo); 
    this.quarterTable.refreshTable();
  }

  updateTreaty(data){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].localAmt = this.passData.tableData[i].balanceAmt * this.jvDetail.currRate;
    }
    this.quarterTable.refreshTable();
  }

  setSelectedData(data){
    console.log(data.data);
    this.quarterTable.indvSelect.trtyInvmt = this.quarterTable.indvSelect.trtyInvmt.filter(a=>a.showMG!=1);
    for(var  i=0; i < data.data.length;i++){
      this.quarterTable.indvSelect.trtyInvmt.push(JSON.parse(JSON.stringify(this.invesmentData.nData)));
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].showMG = 0;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].edited  = true;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].itemNo = null;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].tranId = this.jvDetail.tranId; 
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].invtId = data.data[i].invtId;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].invtCode = data.data[i].invtCd;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].certNo = data.data[i].certNo;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].invtType = data.data[i].invtType;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].invtTypeDesc = data.data[i].invtTypeDesc;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].invtSecCd = data.data[i].invtSecCd;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].securityDesc = data.data[i].invtSecDesc;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].maturityPeriod = data.data[i].matPeriod;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].durationUnit = data.data[i].durUnit;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].interestRate = data.data[i].intRt;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].purchasedDate = data.data[i].purDate;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].maturityDate = data.data[i].matDate;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].pulloutType = 'F';
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].currCd = data.data[i].currCd;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].currRate = data.data[i].currRate;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].invtAmt = data.data[i].invtAmt;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].incomeAmt = data.data[i].incomeAmt;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].bankCharge = data.data[i].bankCharge;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].whtaxAmt = data.data[i].whtaxAmt;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].maturityValue = data.data[i].matVal;
      this.quarterTable.indvSelect.trtyInvmt[this.quarterTable.indvSelect.trtyInvmt.length - 1].localAmt = data.data[i].matVal * this.jvDetail.currRate;
    }
    this.invTable.refreshTable();
    this.quarterTable.onRowClick(null,this.quarterTable.indvSelect);
  }

  openLOV(data){
    this.passLov.searchParams = [{key: 'bankCd', search: ''}, {key:'invtStatus', search: 'MATURED'}];
    this.passLov.hide = this.invesmentData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtCode});
    console.log(this.passLov.hide);
    this.lovMdl.openLOV();
  }

  prepareData(){
    this.jvDetails.saveaccTrty = [];
    this.jvDetails.saveTrtyInvt = [];
    this.jvDetails.delaccTrty = [];
    this.jvDetails.delTrtyInvt = [];
    var quarterNo;
    var actualBalPaid = 0;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(!this.passData.tableData[i].deleted){
        this.jvDetails.saveaccTrty.push(this.passData.tableData[i]);
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].tranId = this.jvDetail.tranId;
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].cedingId = this.jvDetails.cedingId;
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].quarterEnding = this.ns.toDateTimeString(this.passData.tableData[i].quarterEnding);
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
        this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
        if(this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].quarterNo === ''){
          quarterNo = this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].quarterEnding.split('T');
          quarterNo = quarterNo[0].split('-');
          quarterNo = quarterNo[0]+quarterNo[1];
          this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].quarterNo =  parseInt(quarterNo); 
        }
      }

      if(this.passData.tableData[i].deleted){
        this.jvDetails.delaccTrty.push(this.passData.tableData[i]);
      }
      
      for (var j = 0; j < this.passData.tableData[i].trtyInvmt.length; j++) {
        if(!this.passData.tableData[i].trtyInvmt[j].deleted){
          this.jvDetails.saveTrtyInvt.push(this.passData.tableData[i].trtyInvmt[j]);
          actualBalPaid += this.passData.tableData[i].trtyInvmt[j].maturityValue;
          this.jvDetails.saveTrtyInvt[this.jvDetails.saveTrtyInvt.length - 1].tranId  = this.jvDetail.tranId;
          this.jvDetails.saveTrtyInvt[this.jvDetails.saveTrtyInvt.length - 1].quarterNo  = this.passData.tableData[i].quarterNo;
          this.jvDetails.saveTrtyInvt[this.jvDetails.saveTrtyInvt.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].trtyInvmt[j].createDate);
          this.jvDetails.saveTrtyInvt[this.jvDetails.saveTrtyInvt.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].trtyInvmt[j].updateDate);
        }

        if(this.passData.tableData[i].trtyInvmt[j].deleted){
          this.jvDetails.delTrtyInvt.push(this.passData.tableData[i].trtyInvmt[j]);
        }
      }

      this.jvDetails.saveaccTrty[this.jvDetails.saveaccTrty.length - 1].actualBalPaid = actualBalPaid;
    }

    this.jvDetails.tranId = this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    console.log(this.jvDetails);
    this.accountingService.saveTrtyInv(this.jvDetails).subscribe((data:any) => {
      console.log(data)
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveInvPullOut();
      }
    });
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  cancel(){
    this.prepareData();
    console.log(this.jvDetails)
    this.cancelBtn.clickCancel();
  }

  update(data){
    console.log('datachange')
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].maturityValue = this.passData.tableData[i].maturityValue * 1;
    }
    this.invTable.refreshTable();
  }
}
