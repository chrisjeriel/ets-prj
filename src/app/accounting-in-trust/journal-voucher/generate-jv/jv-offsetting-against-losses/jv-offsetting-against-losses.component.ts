import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInPolBalAgainstLoss, AgainstLoss } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-jv-offsetting-against-losses',
  templateUrl: './jv-offsetting-against-losses.component.html',
  styleUrls: ['./jv-offsetting-against-losses.component.css']
})
export class JvOffsettingAgainstLossesComponent implements OnInit {

  @Input() jvDetail:any;
  @Input() cedingParams:any;
  @Input() readOnlyFlag:any;

  @ViewChild('clmTable') clmTable: CustEditableNonDatatableComponent;
  @ViewChild('inwTable') inwTable: CustEditableNonDatatableComponent;
  @ViewChild('clmlovMdl') clmlovMdl: LovComponent;
  @ViewChild('inwlovMdl') inwlovMdl: LovComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @Output() emitData = new EventEmitter<any>();

  passData: any = {
    tableData: [],//this.accountingService.getClaimLosses(),
    tHeader: ['Claim No', 'Hist No', 'Hist Category','Hist Type', 'Payment For', 'Insured', 'Ex-Gratia', 'Curr','Curr Rate', 'Hist Amount','Cummulative Payment','Paid Amount','Paid Amount (Php)'],
    dataTypes: ['text', 'sequence-2', 'text', 'text', 'text', 'text', 'checkbox', 'text', 'percent', 'currency', 'currency','currency', 'currency'],
    nData: {
      showMG:1,
      tranId : '',
      itemNo : '',
      claimId : '',
      projId : '',
      histNo : '',
      claimNo : '',
      histCategory : '',
      histCategoryDesc : '',
      histType : '',
      histTypeDesc : '',
      exGratia : '',
      reserveAmt : '',
      insuredDesc : '',
      paymentFor : '',
      currCd : '',
      currRate : '',
      clmPaytAmt : '',
      localAmt : '',
      remarks : '',
      createUser : this.ns.getCurrentUser(),
      createDate : '',
      updateUser : this.ns.getCurrentUser(),
      updateDate : '',
      inwPolBal: []
    },
    magnifyingGlass: ['claimNo'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    checkFlag: true,
    addFlag: true,
    disableAdd: true,
    deleteFlag: true,
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,false,true],
    total: [null, null,null, null, null,null, null,null,'Total',null, 'paytAmt','clmPaytAmt','localAmt'],
    widths: [107,52,80,87,82,151,62,40,85,100,100,100,100],
    keys: ['claimNo','histNo','histCategoryDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currCd','currRate','reserveAmt','paytAmt','clmPaytAmt','localAmt'],
    pageLength: 5,
  }

  InwPolBal: any = {
   tHeaderWithColspan : [{ header: "", span: 1 }, { header: "Policy Information", span: 14 },
         { header: "Payment Details", span: 5 }, { header: "", span: 2 }], 
    tableData: [], //this.accountingService.getAccJvInPolBalAgainstLoss(),
    tHeader: ['Policy No.','Inst No.','Co Ref No','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','RI Comm Vat','Charges','Net Due','Cumulative Payment','Balance',' Payment Amount','Premium','RI Comm','RI Comm VAT','Charges','Total Payments', 'Remaining Balance'],
    dataTypes: ['text','sequence-2','text','date','date','text','percent','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency','currency'],
    nData: {
      showMG:1,
      tranId: '',
      itemNo: '',
      policyId: '',
      instNo: '',
      policyNo: '',
      coRefNo: '',
      effDate: '',
      dueDate: '',
      currCd: '',
      currRate: '',
      premAmt: '',
      riComm: '',
      riCommVat: '',
      charges: '',
      netDue: '',
      prevPaytAmt: '',
      balPaytAmt: '',
      overdueInt: '',
      remarks: '',
      createUser: this.ns.getCurrentUser(),
      createDate: '',
      updateUser: this.ns.getCurrentUser(),
      updateDate: ''
    },
    total:[null,null,null,null,null,null,'Total','prevPremAmt','prevRiComm','prevRiCommVat', 'prevCharges','prevNetDue','cumPayment','balance','paytAmt', 'premAmt','riComm','riCommVat','charges','totalPayt','remainingBal'],
    magnifyingGlass: ['policyNo'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    disableAdd: true,
    searchFlag: true,
    pagination: true,
    editFlag: false,
    pageLength: 5,
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true],
    keys:['policyNo','instNo','coRefNo','effDate','dueDate','currCd', 'currRate','prevPremAmt', 'prevRiComm','prevRiCommVat', 'prevCharges','prevNetDue','cumPayment','balance','paytAmt', 'premAmt','riComm','riCommVat','charges','totalPayt','remainingBal'],
    //widths: [186,51,96,115,115,39,64,116,116,116,116,116,116,116],
    pageID: 2,
  };

  jvDetails: any = {
    cedingName: '',
    saveClmOffset : [],
    delClmOffset : [],
    saveInwPol : [],
    delInwPol : []
  };

  passLov: any = {
    selector: 'clmResHistPaytsOffset',
    cedingId: '',
    hide: []
  }

  passLovInw: any = {
    selector: 'acitSoaDtl',
    cedingId: '',
    hide: []
  };

  itemNo: any;
  interestRate: any;
  dialogIcon : any;
  dialogMessage : any;
  readOnly:boolean = false;
  cancelFlag: boolean = false;

  constructor(private accountingService: AccountingService,private titleService: Title , private ns: NotesService, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    if(this.jvDetail.statusType == 'N'){
      this.readOnly = false;
    }else {
      this.readOnly = true;
      this.passData.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true];
      this.InwPolBal.uneditable =  [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
      this.InwPolBal.disableAdd = true;
    }

    this.passLovInw.currCd = this.jvDetail.currCd;  
    this.passData.nData.currCd = this.jvDetail.currCd;
    this.passData.nData.currRate = this.jvDetail.currRate;
    this.passLov.currCd = this.jvDetail.currCd;
    this.retrieveClmLosses();
  }

  retrieveClmLosses(){
    this.accountingService.getRecievableLosses(this.jvDetail.tranId,null).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      if(data.receivables.length!=0){
        this.jvDetails.cedingName = data.receivables[0].cedingName;
        this.jvDetails.cedingId = data.receivables[0].cedingId;
        this.passLov.cedingId = data.payeeCd;
        this.passLovInw.cedingId = this.jvDetails.cedingId;
        for(var i = 0 ; i < data.receivables.length; i++){
          this.passData.tableData.push(data.receivables[i]);
          this.clmTable.onRowClick(null, this.passData.tableData[0]);
        }
      }
     
      this.clmTable.refreshTable();
    });
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.payeeName;
    this.jvDetails.ceding = data.payeeCd;
    this.passLov.cedingId = data.payeeCd;
    this.passLovInw.cedingId = data.payeeCd;
    this.passData.disableAdd = false;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveClmLosses();
    this.check(this.jvDetails);
  }

  check(data){
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  onrowClick(data){
    console.log(data)
    if(data != null && data.itemNo != ''){
      this.itemNo = data.itemNo;
      this.InwPolBal.nData.itemNo = this.itemNo;
      this.InwPolBal.tableData = data.inwPolBal;
    }

    if(this.jvDetail.statusType == 'N'){
      this.InwPolBal.disableAdd = false;
    }else{
      this.InwPolBal.disableAdd = true;
    }
    this.inwTable.refreshTable();
  }

  openLOV(data){
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.claimId});
    this.clmlovMdl.openLOV();
  }

  openLOVInw($event){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(!this.passData.tableData[i].deleted){
        for (var j = 0; j < this.passData.tableData[i].inwPolBal.length; j++) {
          this.passLovInw.hide.push(this.passData.tableData[i].inwPolBal[j].soaNo);
        }
      }
    }
    this.inwlovMdl.openLOV();
  }

  setClaimOffset(data){
    console.log(data)
    this.passData.tableData = this.passData.tableData.filter((a) => a.showMG != 1);
    for(var  i=0; i < data.data.length;i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      //this.claimsOffset.tableData.push(data)
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited  = true;
      this.passData.tableData[this.passData.tableData.length - 1].itemNo = null;
      this.passData.tableData[this.passData.tableData.length - 1].claimId = data.data[i].claimId;
      this.passData.tableData[this.passData.tableData.length - 1].projId = data.data[i].projId;
      this.passData.tableData[this.passData.tableData.length - 1].histNo = data.data[i].histNo;
      this.passData.tableData[this.passData.tableData.length - 1].policyId = data.data[i].policyId;
      this.passData.tableData[this.passData.tableData.length - 1].currCd = this.jvDetail.currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = this.jvDetail.currRate;
      this.passData.tableData[this.passData.tableData.length - 1].claimNo = data.data[i].claimNo;
      this.passData.tableData[this.passData.tableData.length - 1].histCategoryDesc = data.data[i].histCategoryDesc;
      this.passData.tableData[this.passData.tableData.length - 1].histCategory = data.data[i].histCategory;
      this.passData.tableData[this.passData.tableData.length - 1].histType = data.data[i].histType;
      this.passData.tableData[this.passData.tableData.length - 1].histTypeDesc = data.data[i].histTypeDesc;
      this.passData.tableData[this.passData.tableData.length - 1].exGratia = data.data[i].exGratia;
      this.passData.tableData[this.passData.tableData.length - 1].insuredDesc = data.data[i].insuredDesc;
      this.passData.tableData[this.passData.tableData.length - 1].reserveAmt = data.data[i].reserveAmt;
      this.passData.tableData[this.passData.tableData.length - 1].paytAmt = data.data[i].cumulativeAmt;
    }
    this.clmTable.refreshTable();
  }

  updateClaim(data){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].localAmt = this.passData.tableData[i].clmPaytAmt * this.jvDetail.currRate;
    }
    this.clmTable.refreshTable();
  }

  setSoa(data){
    console.log(data)
    var overdue = 0;
    this.clmTable.indvSelect.inwPolBal = this.clmTable.indvSelect.inwPolBal.filter(a=>a.showMG!=1);
    for(var i = 0 ; i < data.data.length; i++){
      this.clmTable.indvSelect.inwPolBal.push(JSON.parse(JSON.stringify(this.InwPolBal.nData)));
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].showMG       = 0;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].edited       = true;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].itemNo       = null;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].policyId     = data.data[i].policyId;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].tranId       = this.jvDetail.tranId;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].soaNo        = data.data[i].soaNo;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].policyNo     = data.data[i].policyNo;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].coRefNo      = data.data[i].coRefNo;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].instNo       = data.data[i].instNo;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].effDate      = data.data[i].effDate;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].dueDate      = data.data[i].dueDate;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].currCd       = data.data[i].currCd;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].currRate     = data.data[i].currRate;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].prevPremAmt      = data.data[i].balPremDue;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].prevRiComm       = data.data[i].balRiComm;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].prevRiCommVat    = data.data[i].balRiCommVat;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].prevCharges      = data.data[i].balChargesDue;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].prevNetDue       = data.data[i].prevNetDue;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].prevPaytAmt       = data.data[i].totalPayments;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].cumPayment       = data.data[i].cumPayment;
      this.clmTable.indvSelect.inwPolBal[this.clmTable.indvSelect.inwPolBal.length - 1].balance       = data.data[i].prevBalance;
    }
    this.inwTable.refreshTable();
    this.clmTable.onRowClick(null,this.clmTable.indvSelect);
  }

  updateInw(data){
    console.log('pasol')
    for (var i = 0; i < this.InwPolBal.tableData.length; i++) {
      this.InwPolBal.tableData[i].premAmt     = (this.InwPolBal.tableData[i].paytAmt / this.InwPolBal.tableData[i].prevNetDue) * this.InwPolBal.tableData[i].prevPremAmt;
      this.InwPolBal.tableData[i].riComm      = (this.InwPolBal.tableData[i].paytAmt / this.InwPolBal.tableData[i].prevNetDue) * this.InwPolBal.tableData[i].prevRiComm;
      this.InwPolBal.tableData[i].riCommVat   = (this.InwPolBal.tableData[i].paytAmt / this.InwPolBal.tableData[i].prevNetDue) * this.InwPolBal.tableData[i].prevRiCommVat;
      this.InwPolBal.tableData[i].charges     = (this.InwPolBal.tableData[i].paytAmt / this.InwPolBal.tableData[i].prevNetDue) * this.InwPolBal.tableData[i].prevCharges;
      this.InwPolBal.tableData[i].netDue      = this.InwPolBal.tableData[i].premAmt - this.InwPolBal.tableData[i].riComm - this.InwPolBal.tableData[i].riCommVat + this.InwPolBal.tableData[i].charges;

      this.InwPolBal.tableData[i].totalPayt   = this.InwPolBal.tableData[i].paytAmt + this.InwPolBal.tableData[i].cumPayment;
      this.InwPolBal.tableData[i].remainingBal = this.InwPolBal.tableData[i].prevNetDue - this.InwPolBal.tableData[i].totalPayt;
      this.InwPolBal.tableData[i].localAmt     = this.InwPolBal.tableData[i].paytAmt * 1;
      console.log('pasol')
    }
    this.inwTable.refreshTable();
  }

  getMtnRate(){
    this.maintenanceService.getMtnParameters('N','OVERDUE_INT_RT').subscribe((data:any) =>{
      this.interestRate = data.parameters[0].paramValueN;
    });
  }

  onClickSave(){
    var clmPayment = 0;
    var inwPayment = 0;
    var errorFlag = false;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      clmPayment += this.passData.tableData[i].clmPaytAmt;
      inwPayment = 0;
      for (var j = 0; j < this.passData.tableData[i].inwPolBal.length; j++) {
        if(!this.passData.tableData[i].inwPolBal[j].deleted){
          inwPayment +=  this.passData.tableData[i].inwPolBal[j].paytAmt;
          if(inwPayment > this.passData.tableData[i].clmPaytAmt){
            errorFlag = true;
          }
        }
      }
    }

    if(clmPayment > this.jvDetail.jvAmt){
      this.dialogMessage = 'Total claim payment amount must not exceed the JV amount.' ;
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else if(errorFlag){
      this.dialogMessage = 'Sum of policy balance payment must not exceed the claim hist amount.' ;
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
    
  }

  prepareData(){
    this.jvDetails.saveClmOffset = [];
    this.jvDetails.saveInwPol = [];
    this.jvDetails.delClmOffset = [];
    this.jvDetails.delInwPol = [];


    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(!this.passData.tableData[i].deleted){
        this.jvDetails.saveClmOffset.push(this.passData.tableData[i]);
        this.jvDetails.saveClmOffset[this.jvDetails.saveClmOffset.length - 1].tranId = this.jvDetail.tranId;
        this.jvDetails.saveClmOffset[this.jvDetails.saveClmOffset.length - 1].exGratia = this.passData.tableData[i].exGratia == null ? 'N':'Y';
        this.jvDetails.saveClmOffset[this.jvDetails.saveClmOffset.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
        this.jvDetails.saveClmOffset[this.jvDetails.saveClmOffset.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
      }

      if(this.passData.tableData[i].deleted){
        this.jvDetails.delClmOffset.push(this.passData.tableData[i]);
      }

      for (var j = 0; j < this.passData.tableData[i].inwPolBal.length; j++) {
        if(this.passData.tableData[i].inwPolBal[j].edited && !this.passData.tableData[i].inwPolBal[j].deleted){
          this.jvDetails.saveInwPol.push(this.passData.tableData[i].inwPolBal[j]);
          this.jvDetails.saveInwPol[this.jvDetails.saveInwPol.length - 1].tranId = this.jvDetail.tranId;
          this.jvDetails.saveInwPol[this.jvDetails.saveInwPol.length - 1].itemNo = this.passData.tableData[i].itemNo;
          this.jvDetails.saveInwPol[this.jvDetails.saveInwPol.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].inwPolBal[j].createDate);
          this.jvDetails.saveInwPol[this.jvDetails.saveInwPol.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].inwPolBal[j].updateDate);
          this.jvDetails.saveInwPol[this.jvDetails.saveInwPol.length - 1].netDue = this.passData.tableData[i].inwPolBal[j].remainingBal;
        }

        if(this.passData.tableData[i].inwPolBal[j].deleted){
          this.jvDetails.delInwPol.push(this.passData.tableData[i].inwPolBal[j]);
        }
      }
    }
    this.jvDetails.tranId =  this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    this.accountingService.saveAcitRcvblsLoss(this.jvDetails).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveClmLosses();
      }
    });
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }
}
