import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NotesService, AccountingService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-jv-app-payments-zero',
  templateUrl: './jv-app-payments-zero.component.html',
  styleUrls: ['./jv-app-payments-zero.component.css']
})
export class JvAppPaymentsZeroComponent implements OnInit {

  @Input() jvDetail: any;
  @Input() cedingParams:any;
  @Output() emitData = new EventEmitter<any>();

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  
  /*passData: any = {
    tHeaderWithColspan : [],
    tableData: [],
    tHeader: ['Policy No.','Inst No.','Co Ref No','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','RI Comm Vat','Charges','Net Due','Cumulative Payment','Balance',' Payment Amount','Premium','RI Comm','RI Comm VAT','Charges','Total Payments', 'Remaining Balance'],
    dataTypes: ['text','sequence-2','text','date','date','text','percent','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency'],
    nData:{
      showMG:1,
      createUser: this.ns.getCurrentUser(),
      createDate: '',
      updateUser: this.ns.getCurrentUser(),
      updateDate: ''
    },
    magnifyingGlass: ['policyNo'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: true,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    disableAdd: true,
    btnDisabled: false,
    pageLength: 10,
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true],
    total:[null,null,null,null,null,null,'Total','prevPremAmt','prevRiComm','prevRiCommVat', 'prevCharges','prevNetDue','cumPayment','balance','paytAmt', 'premAmt','riComm','riCommVat','charges','totalPayt','remainingBal'],
    keys:['policyNo','instNo','coRefNo','effDate','dueDate','currCd', 'currRate','prevPremAmt', 'prevRiComm','prevRiCommVat', 'prevCharges','prevNetDue','cumPayment','balance','paytAmt', 'premAmt','riComm','riCommVat','charges','totalPayt','remainingBal']
  };*/

  jvDetails: any = {
    cedingName: '',
    deleteZeroBal: [],
    saveZeroBal:[]
  }

  passLov: any = {
    selector: 'ZeroBal',
    cedingId: '',
    zeroBal: 0,
    hide: []
  }

  passData: any = {};
  disable: boolean = true;
  dialogIcon : any;
  dialogMessage : any;
  totalOverpayment: number = 0;
  cancelFlag: boolean = false;
  cedingFlag: boolean = false;

  constructor(private ns: NotesService, private accService: AccountingService) { }

  ngOnInit() {
    this.passLov.currCd = this.jvDetail.currCd;
    this.passData = this.accService.getInwardPolicyKeys('JV');
    this.passData.disableAdd = true;
    if(this.jvDetail.statusType == 'N'){
      this.disable = false;
    }else {
      this.disable = true;
      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      this.passData.checkFlag =  false;
      this.passData.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
    }

    this.retrieveInwPolZeroBal();
  }

  retrieveInwPolZeroBal(){
    this.accService.getAcitJVZeroBal(this.jvDetail.tranId,'').subscribe((data:any) => {
      console.log(data)
      this.passData.tableData= [];
      this.totalOverpayment = 0;
      this.cedingFlag = false;
      if(data.zeroBal.length!=0){
        if(this.jvDetail.statusType == 'N'){
          this.passData.disableAdd = false;
        }
        this.cedingFlag = true;
        this.jvDetails.cedingName = data.zeroBal[0].cedingName;
        this.jvDetails.ceding = data.zeroBal[0].cedingId;
        this.passLov.cedingId = data.zeroBal[0].cedingId;
        this.check(this.jvDetails);
        for(var i = 0 ; i < data.zeroBal.length;i++){
          this.passData.tableData.push(data.zeroBal[i]);
          //this.passData.tableData[this.passData.tableData.length - 1].balance = this.passData.tableData[this.passData.tableData.length - 1].netDue - this.passData.tableData[this.passData.tableData.length - 1].paytAmt;  
          this.passData.tableData[this.passData.tableData.length - 1].effDate = this.ns.toDateTimeString(data.zeroBal[i].effDate);
          this.passData.tableData[this.passData.tableData.length - 1].dueDate = this.ns.toDateTimeString(data.zeroBal[i].dueDate);
          this.totalOverpayment += data.zeroBal[i].paytAmt;
        }
        
        /*if(this.passData.tableData[this.passData.tableData.length - 1].okDelete = 'N'){
           this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['paytAmt'];
        }*/
      }
      this.table.refreshTable();
    });
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.payeeName;
    this.jvDetails.ceding = data.payeeCd;
    this.passLov.cedingId = data.payeeCd;
    this.passData.disableAdd = false;
    this.ns.lovLoader(data.ev, 0);
    this.check(this.jvDetails);
    this.retrieveInwPolZeroBal()
  }

  check(data){
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  openSoaLOV(data){
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
    console.log(this.passLov)
    this.lovMdl.openLOV();
  }

  setSoa(data){
    console.log(data.data)
    var balance = data.data.balance;
    var datas;
    this.accService.getZeroAlt(data.data.policyId).subscribe((data:any)=> {
      console.log(data);
      datas = data.soaDtlList;
      this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
      for (var i = 0; i < datas.length; i++) {
        this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
        this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
        this.passData.tableData[this.passData.tableData.length - 1].edited  = true;
        this.passData.tableData[this.passData.tableData.length - 1].itemNo = null;
        this.passData.tableData[this.passData.tableData.length - 1].policyId = datas[i].policyId;
        this.passData.tableData[this.passData.tableData.length - 1].tranId = this.jvDetail.tranId;
        this.passData.tableData[this.passData.tableData.length - 1].soaNo = datas[i].soaNo;
        this.passData.tableData[this.passData.tableData.length - 1].policyNo = datas[i].policyNo;
        this.passData.tableData[this.passData.tableData.length - 1].coRefNo  = datas[i].coRefNo;
        this.passData.tableData[this.passData.tableData.length - 1].instNo  = datas[i].instNo;
        this.passData.tableData[this.passData.tableData.length - 1].effDate  = datas[i].effDate;
        this.passData.tableData[this.passData.tableData.length - 1].dueDate  = datas[i].dueDate;
        this.passData.tableData[this.passData.tableData.length - 1].currCd  = datas[i].currCd;
        this.passData.tableData[this.passData.tableData.length - 1].currRate  = datas[i].currRate;
        this.passData.tableData[this.passData.tableData.length - 1].prevPremAmt  = datas[i].prevPremAmt;
        this.passData.tableData[this.passData.tableData.length - 1].prevRiComm  = datas[i].prevRiComm;
        this.passData.tableData[this.passData.tableData.length - 1].prevRiCommVat  = datas[i].prevRiCommVat;
        this.passData.tableData[this.passData.tableData.length - 1].prevCharges  = datas[i].prevCharges;
        this.passData.tableData[this.passData.tableData.length - 1].prevNetDue  = datas[i].prevPremAmt - datas[i].prevRiComm - datas[i].prevRiCommVat + datas[i].prevCharges;
        this.passData.tableData[this.passData.tableData.length - 1].prevPaytAmt  = datas[i].tempPayments + datas[i].totalPayments;
        this.passData.tableData[this.passData.tableData.length - 1].cumPayment = datas[i].cumPayment;
        this.passData.tableData[this.passData.tableData.length - 1].balance  = datas[i].balAmtDue;
        this.passData.tableData[this.passData.tableData.length - 1].paytAmt  = datas[i].balAmtDue;
        this.passData.tableData[this.passData.tableData.length - 1].localAmt =  datas[i].balAmtDue * this.jvDetail.currRate;
        this.passData.tableData[this.passData.tableData.length - 1].premAmt = (datas[i].balAmtDue/this.passData.tableData[this.passData.tableData.length - 1].prevNetDue) * datas[i].prevPremAmt;
        this.passData.tableData[this.passData.tableData.length - 1].riComm = (datas[i].balAmtDue/this.passData.tableData[this.passData.tableData.length - 1].prevNetDue) * datas[i].prevRiComm;
        this.passData.tableData[this.passData.tableData.length - 1].riCommVat = (datas[i].balAmtDue/this.passData.tableData[this.passData.tableData.length - 1].prevNetDue) * datas[i].prevRiCommVat;
        this.passData.tableData[this.passData.tableData.length - 1].charges = (datas[i].balAmtDue/this.passData.tableData[this.passData.tableData.length - 1].prevNetDue) * datas[i].prevCharges;
        this.passData.tableData[this.passData.tableData.length - 1].netDue = this.passData.tableData[this.passData.tableData.length - 1].premAmt - this.passData.tableData[this.passData.tableData.length - 1].riComm - this.passData.tableData[this.passData.tableData.length - 1].riCommVat + this.passData.tableData[this.passData.tableData.length - 1].charges;
        this.passData.tableData[this.passData.tableData.length - 1].totalPayt = datas[i].balAmtDue + datas[i].cumPayment;
        this.passData.tableData[this.passData.tableData.length - 1].remainingBal = this.passData.tableData[this.passData.tableData.length - 1].prevNetDue - this.passData.tableData[this.passData.tableData.length - 1].totalPayt;
      }
      this.table.refreshTable();
    });
  }

  prepareData(){
    var edited = [] ;
    var deleted = [];

    for(var i = 0 ; i < this.passData.tableData.length ; i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        edited.push(this.passData.tableData[i]);
        edited[edited.length - 1].netDue  = this.passData.tableData[i].remainingBal;
        edited[edited.length - 1].createDate = this.ns.toDateTimeString(0);
        edited[edited.length - 1].updateDate = this.ns.toDateTimeString(0);
        edited[edited.length - 1].createUser = this.ns.getCurrentUser();
        edited[edited.length - 1].updateUser = this.ns.getCurrentUser();
        if(this.passData.tableData[i].balance > 0 && this.passData.tableData[i].paytAmt > 0){
           edited[edited.length - 1].paytType = 1
         }else if(this.passData.tableData[i].balance > 0 && this.passData.tableData[i].paytAmt < 0){
           edited[edited.length - 1].paytType = 2
         }else if(this.passData.tableData[i].balance < 0 && this.passData.tableData[i].paytAmt < 0){
           edited[edited.length - 1].paytType = 3
         }else if(this.passData.tableData[i].balance < 0 && this.passData.tableData[i].paytAmt > 0){
           edited[edited.length - 1].paytType = 4
         }
      }

      if(this.passData.tableData[i].deleted){
        deleted.push(this.passData.tableData[i]);
      }
    }
    this.jvDetails.tranId = this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
    this.jvDetails.deleteZeroBal = deleted;
    this.jvDetails.saveZeroBal = edited;
  }

  saveAppPaytZero(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();

    this.accService.saveAcitZeroBal(this.jvDetails).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveInwPolZeroBal();
      }
    });
  }

  update(data){
    for(var i = 0 ; i < this.passData.tableData.length; i++){
      this.passData.tableData[i].localAmt = this.jvDetail.currRate * this.passData.tableData[i].paytAmt;
      this.passData.tableData[i].premAmt = (this.passData.tableData[i].paytAmt/this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevPremAmt;
      this.passData.tableData[i].riComm = (this.passData.tableData[i].paytAmt/this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevRiComm;
      this.passData.tableData[i].riCommVat = (this.passData.tableData[i].paytAmt/this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevRiCommVat;
      this.passData.tableData[i].charges = (this.passData.tableData[i].paytAmt/this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevCharges;

      this.passData.tableData[i].totalPayt = this.passData.tableData[i].paytAmt + this.passData.tableData[i].cumPayment;
      this.passData.tableData[i].remainingBal = this.passData.tableData[i].prevNetDue - this.passData.tableData[i].totalPayt;
    }
    this.table.refreshTable();
  }

  onClickSave(){
    if(this.refundError()){
      this.dialogMessage = 'Refund must not exceed cummulative payments.';
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
    //this.confirm.confirmModal();
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  refundError():boolean{
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(!this.passData.tableData[i].deleted){
        if((this.passData.tableData[i].prevNetDue > 0 &&  this.passData.tableData[i].paytAmt < 0 &&
            this.passData.tableData[i].paytAmt + this.passData.tableData[i].cumPayment < 0)  ||
           
           (this.passData.tableData[i].prevNetDue < 0 && this.passData.tableData[i].paytAmt > 0 &&
            this.passData.tableData[i].paytAmt + this.passData.tableData[i].cumPayment > 0)
          ){
          return true;
        }
      }
    }
    return false;
  }
}
