import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AgainstNegativeTreaty, AccJvInPolBalAgainstLoss, AccJvOutAccOffset} from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-jv-overdue-accounts-against-treaty',
  templateUrl: './jv-overdue-accounts-against-treaty.component.html',
  styleUrls: ['./jv-overdue-accounts-against-treaty.component.css']
})
export class JvOverdueAccountsAgainstTreatyComponent implements OnInit {
  
  @Output() emitData = new EventEmitter<any>();
  @Input() cedingParams:any;
  @Input() jvDetail: any;
  @ViewChild('quarterTable') quarterTable: CustEditableNonDatatableComponent;
  @ViewChild('trytytrans') trytytrans: CustEditableNonDatatableComponent;
  @ViewChild(QuarterEndingLovComponent) quarterModal: QuarterEndingLovComponent; 
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {
      tableData: [],
      tHeader: ['Quarter Ending', 'Currency', 'Currency Rate', 'Amount', 'Amount(PHP)'],
      dataTypes: ['date', 'text', 'percent', 'currency', 'currency'],
      nData: {
        showMG:1,
        tranId:'',
        itemNo: '',
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
        acctOffset: []
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
      uneditable: [true, true,true,false,true],
      total: [null, null, 'Total', 'balanceAmt', 'localAmt'],
      keys: ['quarterEnding', 'currCd', 'currRate', 'balanceAmt', 'localAmt'],
      widths: [203,50,130,130,130],
  }

  /*passDataOffsetting: any = {
    tHeaderWithColspan : [],
    tableData: [],
    tHeader: ['Policy No.','Inst No.','Co Ref No','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','RI Comm Vat','Charges','Net Due','Cumulative Payment','Balance',' Payment Amount','Premium','RI Comm','RI Comm VAT','Charges','Total Payments', 'Remaining Balance'],
    dataTypes: ['text','sequence-2','text','date','date','text','percent','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency'],
    nData: {
      showMG:1,
      tranId : '',
      quarterNo : '',
      itemNo : '',
      policyId : '',
      policyNo : '',
      soaNo : '',
      coRefNo : '',
      effDate : '',
      dueDate : '',
      instNo : '',
      currCd : '',
      currRate : '',
      premAmt : '',
      riComm : '',
      riCommVat : '',
      charges : '',
      netDue : '',
      prevPaytAmt : '',
      balPaytAmt : '',
      overdueInt : '',
      remarks : '',
      createUser : this.ns.getCurrentUser(),
      createDate : '',
      updateUser : this.ns.getCurrentUser(),
      updateDate : '',
    },
    total:[null,null,null,null,null,null,'Total','prevPremAmt','prevRiComm','prevRiCommVat', 'prevCharges','prevNetDue','cumPayment','balance','paytAmt', 'premAmt','riComm','riCommVat','charges','totalPayt','remainingBal'],
    magnifyingGlass: ['policyNo'],
    checkFlag: true,
    addFlag: true,
    disableAdd: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageID: 'passDataOffsetting',
    pageLength: 5,
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true],
    keys:['policyNo','instNo','coRefNo','effDate','dueDate','currCd', 'currRate','prevPremAmt', 'prevRiComm','prevRiCommVat', 'prevCharges','prevNetDue','cumPayment','balance','paytAmt', 'premAmt','riComm','riCommVat','charges','totalPayt','remainingBal']
  };*/

  jvDetails: any = {
    cedingName: '',
    saveAcctTrty: [],
    delAcctTrty: [],
    saveInwPolOffset: [],
    delInwPolOffset: []
  };

  passLov: any = {
    selector: 'acitSoaDtl',
    cedingId: '',
    hide: []
  };

  quarterNo:any;
  interestRate: number = 0;
  dialogIcon : any;
  dialogMessage : any;
  treatyBal: number = 0;
  totalTratyBal: number = 0;
  totalBal: number = 0;
  readOnly: boolean = false;
  cancelFlag: boolean = false;
  passDataOffsetting: any = {};

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal, private ns: NotesService, private maintenaceService: MaintenanceService) { }

  ngOnInit() {
    this.passLov.currCd = this.jvDetail.currCd;
    this.passData.nData.currCd = this.jvDetail.currCd;
    this.passData.nData.currRate = this.jvDetail.currRate;
    //this.passDataOffsetting.tHeaderWithColspan.push({ header: "", span: 1 }, { header: "Policy Information", span: 14 },
    //     { header: "Payment Details", span: 5 }, { header: "", span: 2 });
    this.passDataOffsetting = this.accountingService.getInwardPolicyKeys('JV');
    this.passDataOffsetting.nData = {showMG:1,tranId : '',quarterNo : '',itemNo : '',policyId : '',policyNo : '',soaNo : '',coRefNo : '',effDate : '',dueDate : '',instNo : '',currCd : '',currRate : '',premAmt : '',riComm : '',riCommVat : '',charges : '',netDue : '',prevPaytAmt : '',balPaytAmt : '',overdueInt : '',remarks : '',createUser : this.ns.getCurrentUser(),createDate : '',updateUser : this.ns.getCurrentUser(),updateDate : ''}
    if(this.jvDetail.statusType == 'N'){
      this.readOnly = false;
    }else {
      this.readOnly = true;
      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      this.passData.checkFlag = false;
      this.passDataOffsetting.checkFlag = false;
      this.passDataOffsetting.addFlag = false;
      this.passDataOffsetting.deleteFlag = false;
      this.passData.uneditable = [true,true,true,true,true];
      this.passData.disableAdd = true;
      this.passDataOffsetting.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true];
      this.passDataOffsetting.disableAdd = true;
    }

    this.retrieveAcctBal();
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  retrieveAcctBal(){
    this.accountingService.getAcctTrtyBal(this.jvDetail.tranId).subscribe((data:any) => {
      console.log(data);
      this.passData.tableData = [];
      if( data.acctTreatyBal.length!=0){
        this.passDataOffsetting.disableAdd = false;
        this.passData.disableAdd = false;
        this.jvDetails.cedingName = data.acctTreatyBal[0].cedingName;
        this.jvDetails.ceding = data.acctTreatyBal[0].cedingId;
        this.passLov.cedingId = this.jvDetails.ceding;
        this.check(this.jvDetails);
        for(var i = 0; i < data.acctTreatyBal.length; i++){
          this.passData.tableData.push(data.acctTreatyBal[i]);
        }
      }
      this.quarterTable.refreshTable();
      this.quarterTable.onRowClick(null,this.passData.tableData[0]);
    });
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.payeeName;
    this.jvDetails.ceding = data.payeeCd;
    this.passLov.cedingId = data.payeeCd;
    this.passData.disableAdd = false;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveAcctBal();
    this.check(this.jvDetails);
  }

  check(data){
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  onRowClick(data){
    if(data!=null && data.quarterNo != ''){
      this.quarterNo = data.quarterNo;
      this.passDataOffsetting.disableAdd = false;
      this.passDataOffsetting.nData.quarterNo = this.quarterNo;
      this.passDataOffsetting.tableData = data.acctOffset;
      this.trytytrans.refreshTable();
    }else{
      this.passDataOffsetting.disableAdd = true;
      this.passDataOffsetting.tableData = [];
    }
  }

  quarterEndModal(){
    this.quarterModal.modal.openNoClose();
  }

  setQuarter(data){
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

  updateTreatyBal(data){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].localAmt = isNaN(this.passData.tableData[i].currRate) ? 1:this.passData.tableData[i].currRate * this.passData.tableData[i].balanceAmt;
    }
    this.quarterTable.refreshTable();
  }
  
  openLOV(data){
    //this.passLov.hide = this.passDataOffsetting.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(!this.passData.tableData[i].deleted){
        for (var j = 0; j < this.passData.tableData[i].acctOffset.length; j++) {
          this.passLov.hide.push(this.passData.tableData[i].acctOffset[j].soaNo);
        }
      }
    }
    this.lovMdl.openLOV();
  }

  setSoa(data){
    console.log(data.data)
    this.quarterTable.indvSelect.acctOffset = this.quarterTable.indvSelect.acctOffset.filter(a=>a.showMG!=1);
    for (var i = 0; i < data.data.length; i++) {
      this.quarterTable.indvSelect.acctOffset.push(JSON.parse(JSON.stringify(this.passDataOffsetting.nData)));
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].showMG = 0;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].edited  = true;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].itemNo = null;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].policyId = data.data[i].policyId;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].tranId = this.jvDetail.tranId;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].soaNo = data.data[i].soaNo;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].policyNo = data.data[i].policyNo;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].coRefNo  = data.data[i].coRefNo;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].instNo  = data.data[i].instNo;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].effDate  = data.data[i].effDate;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].dueDate  = data.data[i].dueDate;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].currCd  = data.data[i].currCd;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].currRate  = data.data[i].currRate;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].prevPremAmt = data.data[i].prevPremAmt;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].prevRiComm  = data.data[i].prevRiComm;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].prevRiCommVat  = data.data[i].prevRiCommVat;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].prevCharges  = data.data[i].prevCharges;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].prevNetDue  = data.data[i].prevNetDue;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].prevPaytAmt  = data.data[i].totalPayments;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].cumPayment = data.data[i].cumPayment;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].balance = data.data[i].prevBalance;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].paytAmt = data.data[i].prevBalance;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].localAmt = data.data[i].prevBalance * this.jvDetail.currRate;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].premAmt = data.data[i].prevPremAmt;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].riComm = data.data[i].prevRiComm;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].riCommVat = data.data[i].prevRiCommVat;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].charges = data.data[i].prevCharges;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].totalPayt = data.data[i].cumPayment + data.data[i].prevBalance;
      this.quarterTable.indvSelect.acctOffset[this.quarterTable.indvSelect.acctOffset.length - 1].remainingBal = data.data[i].prevNetDue - (data.data[i].cumPayment + data.data[i].prevBalance);
      
    }
    this.trytytrans.refreshTable();
    this.quarterTable.onRowClick(null,this.quarterTable.indvSelect);
  }

  update(data){
    
    for (var i = 0; i < this.passDataOffsetting.tableData.length; i++) {
      this.passDataOffsetting.tableData[i].premAmt = (this.passDataOffsetting.tableData[i].paytAmt / this.passDataOffsetting.tableData[i].prevNetDue) * this.passDataOffsetting.tableData[i].prevPremAmt;
      this.passDataOffsetting.tableData[i].riComm = (this.passDataOffsetting.tableData[i].paytAmt / this.passDataOffsetting.tableData[i].prevNetDue) * this.passDataOffsetting.tableData[i].prevRiComm;
      this.passDataOffsetting.tableData[i].riCommVat = (this.passDataOffsetting.tableData[i].paytAmt / this.passDataOffsetting.tableData[i].prevNetDue) * this.passDataOffsetting.tableData[i].prevRiCommVat;
      this.passDataOffsetting.tableData[i].charges = (this.passDataOffsetting.tableData[i].paytAmt / this.passDataOffsetting.tableData[i].prevNetDue) * this.passDataOffsetting.tableData[i].prevCharges;
      this.passDataOffsetting.tableData[i].netDue = this.passDataOffsetting.tableData[i].remainingBal;

      this.passDataOffsetting.tableData[i].totalPayt = this.passDataOffsetting.tableData[i].paytAmt + this.passDataOffsetting.tableData[i].cumPayment;
      this.passDataOffsetting.tableData[i].remainingBal = this.passDataOffsetting.tableData[i].prevNetDue - this.passDataOffsetting.tableData[i].totalPayt;
      this.passDataOffsetting.tableData[i].localAmt = this.passDataOffsetting.tableData[i].paytAmt * 1;
    }
    this.trytytrans.refreshTable();
  }


  onClickSave(){
    this.confirm.confirmModal();

    /*if(!this.validPayment()){
      this.dialogMessage = 'Payment for selected policy is not proportion to payment for Treaty Balance.';
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }*/




    /*var errorFlag = false;
    var quarterDate :any;
    this.totalBal = 0;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.treatyBal = 0;
      this.totalBal += this.passData.tableData[i].balanceAmt;
      for (var j = 0; j < this.passData.tableData[i].acctOffset.length; j++) {
        if(!this.passData.tableData[i].acctOffset[j].deleted){
          this.treatyBal += this.passData.tableData[i].acctOffset[j].paytAmt;
        }
      }
      if((this.passData.tableData[i].balanceAmt < 0 && this.passData.tableData[i].balanceAmt + this.treatyBal  > 0) ||
         (this.passData.tableData[i].balanceAmt > 0 && this.passData.tableData[i].balanceAmt + this.treatyBal  < 0)){
        errorFlag = true;
        quarterDate = this.passData.tableData[i].quarterEnding;
      }
    }

    //added by NECO 09/04/2019
    var totalTreatyBal: number = 0;
    for(var k = 0; k < this.passData.tableData.length; k++){
      totalTreatyBal += this.passData.tableData[k].balanceAmt;
    }
    //End

    if(errorFlag){
      quarterDate = this.ns.toDateTimeString(quarterDate);
      quarterDate = quarterDate.split('T');
      this.dialogMessage = "The total balance of outstanding accounts for offset on Quarter Ending " + quarterDate[0] + " must not exceed its Treaty Balance Amount.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else if(totalTreatyBal > this.jvDetail.jvAmt){
      this.dialogMessage = "The total treaty balance must not exceed the JV Amount.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }
    //Added by Neco 09/04/2019
    else if(Math.abs(this.totalBal) != this.jvDetail.jvAmt){
      this.dialogMessage = "The total Balance of all outstanding accounts must be equal to the JV Amount.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }
    //end
    else{
      this.confirm.confirmModal();
    }*/
  }

  validPayment() :boolean{
    var inwPayment = 0;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      inwPayment = 0;
      for (var j = 0; j < this.passData.tableData[i].acctOffset.length; j++) {
        inwPayment += this.passData.tableData[i].acctOffset[j].paytAmt;
      }

      if(inwPayment - this.passData.tableData[i].balanceAmt == 0){
        return true;
      }
    }
    return false;
  }

  prepareData(){
    var quarterNo = null;
    this.jvDetails.saveAcctTrty = [];
    this.jvDetails.delAcctTrty = [];
    this.jvDetails.saveInwPolOffset = [];
    this.jvDetails.delInwPolOffset = [];
    var actualBalPaid = 0;
    for( var i = 0 ; i < this.passData.tableData.length; i++){
      if(!this.passData.tableData[i].deleted){
        this.jvDetails.saveAcctTrty.push(this.passData.tableData[i]);
        this.jvDetails.saveAcctTrty[this.jvDetails.saveAcctTrty.length - 1].tranId = this.jvDetail.tranId;
        this.jvDetails.saveAcctTrty[this.jvDetails.saveAcctTrty.length - 1].cedingId = this.jvDetails.ceding;
        this.jvDetails.saveAcctTrty[this.jvDetails.saveAcctTrty.length - 1].quarterEnding = this.ns.toDateTimeString(this.passData.tableData[i].quarterEnding);
        this.jvDetails.saveAcctTrty[this.jvDetails.saveAcctTrty.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
        this.jvDetails.saveAcctTrty[this.jvDetails.saveAcctTrty.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
        if(this.jvDetails.saveAcctTrty[this.jvDetails.saveAcctTrty.length - 1].quarterNo === ''){
          quarterNo = this.jvDetails.saveAcctTrty[this.jvDetails.saveAcctTrty.length - 1].quarterEnding.split('T');
          quarterNo = quarterNo[0].split('-');
          quarterNo = quarterNo[0]+quarterNo[1];
          this.jvDetails.saveAcctTrty[this.jvDetails.saveAcctTrty.length - 1].quarterNo =  parseInt(quarterNo); 
        }
      }

      if(this.passData.tableData[i].deleted){
        this.jvDetails.delAcctTrty.push(this.passData.tableData[i]);
      }

      for (var j = 0; j < this.passData.tableData[i].acctOffset.length; j++) {
        if(this.passData.tableData[i].acctOffset[j].edited && !this.passData.tableData[i].acctOffset[j].deleted){
          this.jvDetails.saveInwPolOffset.push(this.passData.tableData[i].acctOffset[j]);
          actualBalPaid += this.passData.tableData[i].acctOffset[j].paytAmt;
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].balPaytAmt = this.passData.tableData[i].acctOffset[j].remainingBal;
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].tranId     = this.jvDetail.tranId;
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].quarterNo  = this.passData.tableData[i].quarterNo;
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].createDate =  this.ns.toDateTimeString(this.passData.tableData[i].acctOffset[j].createDate);
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].acctOffset[j].updateDate);
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].netDue     = this.passData.tableData[i].acctOffset[j].remainingBal;
        }

        if(this.passData.tableData[i].acctOffset[j].deleted){
          this.jvDetails.delInwPolOffset.push(this.passData.tableData[i].acctOffset[j]);
          this.jvDetails.delInwPolOffset[this.jvDetails.delInwPolOffset.length - 1].tranId = this.jvDetail.tranId;
        }
      }
      if(!this.passData.tableData[i].deleted){
        this.jvDetails.saveAcctTrty[this.jvDetails.saveAcctTrty.length - 1].actualBalPaid = actualBalPaid;
      }
    }

    this.jvDetails.tranId = this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
  }

  saveAcctTrty(cancel?){
    this.cancelFlag = cancel !== undefined;
    this.prepareData();
    this.accountingService.saveAcitJvAcctTrty(this.jvDetails).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveAcctBal();
      }
    });
  }

  cancel(){
   this.cancelBtn.clickCancel();
  }

  getMtnRate(){
    this.maintenaceService.getMtnParameters('N','OVERDUE_INT_RT').subscribe((data:any) =>{
      this.interestRate = data.parameters[0].paramValueN;
    });
  }

  
}
