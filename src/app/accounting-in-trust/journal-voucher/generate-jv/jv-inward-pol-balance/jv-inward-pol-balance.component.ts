import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInPolBal} from '@app/_models';
import { MtnPayeeCedingComponent } from '@app/maintenance/mtn-payee-ceding/mtn-payee-ceding.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-jv-inward-pol-balance',
  templateUrl: './jv-inward-pol-balance.component.html',
  styleUrls: ['./jv-inward-pol-balance.component.css']
})
export class JvInwardPolBalanceComponent implements OnInit {

  @ViewChild(MtnPayeeCedingComponent) cedingCoLov: MtnPayeeCedingComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;

  @Input() jvDetail:any;
  @Output() emitData = new EventEmitter<any>();
  @Output() infoData = new EventEmitter<any>();
  @Input() cedingParams:any;

  /*passData: any = {
    tableData: [],
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','RI Comm Vat','Charges','Net Due','Payments','Balance',"Overdue Interest"],
    resizable: [true, true, true, true,true, true, true, true,true,true,true,true,true,true,true,true],
    dataTypes: ['text','text','text','sequence-2','date','date','text','percent','currency','currency','currency','currency','currency','currency','currency','currency'],
    nData: {
       showMG: 1,
       soaNo : '',
       policyNo : '',
       corefNo : '',
       instNo : '',
       effDate : '',
       dueDate : '',
       currCd : '',
       currRate : '',
       premAmt : '',
       riComm : '',
       riCommVat : '',
       charges : '',
       netDue : '',
       prevPaytAmt : '',
       adjBalAmt : '',
       overdueInt : ''
    },
    total:[null,null,null,null,null,null,null,'Total','premAmt', 'riComm','riCommVat', 'charges', 'netDue', 'prevPaytAmt', 'adjBalAmt', 'overdueInt'],
    magnifyingGlass: ['soaNo'],
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
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true],
    widths: [215,200,160,50,115,115,40,155,130,130,120,130,130,130,130,85],
    keys:['soaNo','policyNo','coRefNo','instNo','effDate','dueDate','currCd', 'currRate', 'premAmt', 'riComm','riCommVat', 'charges', 'netDue', 'prevPaytAmt', 'adjBalAmt', 'overdueInt' ]
  };*/

  /*passData: any = {
    tHeaderWithColspan : [],
    tableData: [],
    pinKeysLeft: ['policyNo','instNo','adjBalAmt'],
    pinKeysRight:['overdueInt'],
    tHeader: ['Policy No.','Inst No.','Balance','Curr','Curr Rate','Local Amt','Payments','Net Due','Premium','RI Comm','RI Comm Vat','Charges','SOA No','Co Ref No','Eff Date','Due Date',"Overdue Interest"],
    resizable: [true, true, true, true, true,true, true, true, true,true,true,true,true,true,true,true,true],
    dataTypes: ['text','sequence-2','currency','text','percent','currency','currency','currency','currency','currency','currency','currency','text','text','date','date','currency'],
    nData: {
       showMG: 1,
       soaNo : '',
       policyNo : '',
       corefNo : '',
       instNo : '',
       effDate : '',
       dueDate : '',
       currCd : '',
       currRate : '',
       premAmt : '',
       riComm : '',
       riCommVat : '',
       charges : '',
       netDue : '',
       prevPaytAmt : '',
       adjBalAmt : '',
       overdueInt : '',
       createDate: '',
       updateDate:'',
       createUser: this.ns.getCurrentUser(),
       updateuSer: this.ns.getCurrentUser()
    },
    total:[null,'Total','adjBalAmt',null,null,'localAmt','prevPaytAmt','netDue','premAmt', 'riComm','riCommVat', 'charges',null, null,null,null, 'overdueInt'],
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
    uneditable: [true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    widths: [160,48,121,50,100,121,121,121,121,121,121,121,170,170,84,84,121],
    keys:['policyNo','instNo','adjBalAmt','currCd', 'currRate','localAmt','prevPaytAmt','netDue','premAmt', 'riComm','riCommVat', 'charges','soaNo','coRefNo','effDate','dueDate','overdueInt' ]
  };*/

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
  
  passData: any ={};

  jvDetails: any = {
    cedingName: '',
    ceding:'',
    deleteInwPol: [],
    saveInwPol:[]
  }

  passLov: any = {
    selector: 'acitSoaDtl',
    cedingId: '',
    hide: []
  }


  tableRow: any;
  hideSoa: any = [];
  cancelFlag: boolean = false;
  dialogIcon : any;
  dialogMessage : any;
  interestRate: any;
  soaIndex: number;
  disable: boolean = true;
  totalBalance: number = 0;
  cedingFlag: boolean = false;

  constructor(private accountingService: AccountingService,private titleService: Title, private ns: NotesService, private maintenaceService: MaintenanceService) { }

  ngOnInit() {
     this.passLov.currCd = this.jvDetail.currCd;
     this.passData = this.accountingService.getInwardPolicyKeys('JV');
     this.passData.magnifyingGlass = ['policyNo'];
     this.passData.disableAdd = true;
     if(this.jvDetail.statusType == 'N'){
       this.disable = false;
     }else {
       this.passData.addFlag = false;
       this.passData.deleteFlag = false;
       this.passData.checkFlag =  false;
       this.passData.btnDisabled = true;
       this.passData.tHeaderWithColspan = [{header: 'Inward Policy Info', span: 13}, {header: 'Payment Details', span: 5}, {header: '', span: 1}, {header: '', span: 1}],
       this.passData.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
       this.disable = true;
     }
     this.retrieveInwPol();
  }

  retrieveInwPol(){
    this.accountingService.getJVInwPolBal(this.jvDetail.tranId,'').subscribe((data:any) => {
      console.log(data)
      var datas = data.inwPolBal;
      this.passData.tableData = [];
      this.totalBalance = 0;
      this.cedingFlag = false;
      if(datas.length != 0){
        if(this.jvDetail.statusType == 'N'){
          this.passData.disableAdd = false;
        }
        this.cedingFlag = true;
        this.jvDetails.cedingName = datas[0].cedingName;
        this.jvDetails.ceding = datas[0].cedingId;
        this.passLov.cedingId = datas[0].cedingId;
        this.check(this.jvDetails);
        for(var i = 0; i < datas.length; i++){
          this.passData.tableData.push(datas[i]);
          this.passData.tableData[this.passData.tableData.length - 1].effDate = this.ns.toDateTimeString(datas[i].effDate);
          this.passData.tableData[this.passData.tableData.length - 1].dueDate = this.ns.toDateTimeString(datas[i].dueDate)
          this.totalBalance += this.passData.tableData[this.passData.tableData.length - 1].paytAmt;

          if(this.passData.tableData[this.passData.tableData.length - 1].okDelete == 'N'){
             this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['paytAmt'];
          }
        }
      }
      this.table.refreshTable();
    });
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  checkCode(ev){
     this.ns.lovLoader(ev, 1);
     //this.cedingCoLov.checkCedingCo(this.jvDetails.ceding, ev);
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.payeeName;
    this.jvDetails.ceding = data.payeeCd;
    this.passLov.cedingId = data.payeeCd;
    this.passData.disableAdd = false;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveInwPol()
    this.check(this.jvDetails);
  }

  check(data){
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  openSoaLOV(data){
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
    this.lovMdl.openLOV();
  }

  soaLOV(data){
      this.hideSoa = this.passData.tableData.filter((a)=>{return a.instNo !== undefined && a.policyId !== undefined && !a.deleted}).map((a)=>{return (a.policyId.toString()+ '-'+ a.instNo).toString()});
      $('#soaMdl #modalBtn').trigger('click');
  }

  setSoa(data){
    var overdue = null;

    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0 ; i < data.data.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG     = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited     = true;
      this.passData.tableData[this.passData.tableData.length - 1].itemNo     = null;
      this.passData.tableData[this.passData.tableData.length - 1].soaNo      = data.data[i].soaNo;
      this.passData.tableData[this.passData.tableData.length - 1].policyId   = data.data[i].policyId;
      this.passData.tableData[this.passData.tableData.length - 1].tranId     = this.jvDetail.tranId;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo   = data.data[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].coRefNo    = data.data[i].coRefNo;
      this.passData.tableData[this.passData.tableData.length - 1].instNo     = data.data[i].instNo;
      this.passData.tableData[this.passData.tableData.length - 1].effDate    = data.data[i].effDate;
      this.passData.tableData[this.passData.tableData.length - 1].dueDate    = data.data[i].dueDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd         = data.data[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate       = data.data[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].prevPremAmt  = data.data[i].prevPremAmt;
      this.passData.tableData[this.passData.tableData.length - 1].prevRiComm  = data.data[i].prevRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].prevRiCommVat  = data.data[i].prevRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].prevCharges  = data.data[i].prevCharges;
      this.passData.tableData[this.passData.tableData.length - 1].prevNetDue  = data.data[i].prevNetDue;
      this.passData.tableData[this.passData.tableData.length - 1].cumPayment  = data.data[i].cumPayment;
      this.passData.tableData[this.passData.tableData.length - 1].balance  = data.data[i].balance;
      this.passData.tableData[this.passData.tableData.length - 1].paytAmt = data.data[i].balAmtDue;
      this.passData.tableData[this.passData.tableData.length - 1].premAmt = data.data[i].balPremDue;
      this.passData.tableData[this.passData.tableData.length - 1].riComm = data.data[i].balRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].riCommVat = data.data[i].balRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].charges = data.data[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].totalPayt = data.data[i].cumPayment + data.data[i].balAmtDue;
      this.passData.tableData[this.passData.tableData.length - 1].remainingBal = data.data[i].prevNetDue  - (data.data[i].cumPayment + data.data[i].balAmtDue);
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
  }

  update(data){
    this.totalBalance = 0;
    for(var i = 0 ; i < this.passData.tableData.length; i++){
      this.passData.tableData[i].premAmt = (this.passData.tableData[i].paytAmt/this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevPremAmt;
      this.passData.tableData[i].riComm = (this.passData.tableData[i].paytAmt/this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevRiComm;
      this.passData.tableData[i].riCommVat = (this.passData.tableData[i].paytAmt/this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevRiCommVat;
      this.passData.tableData[i].charges = (this.passData.tableData[i].paytAmt/this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevCharges;

      this.passData.tableData[i].totalPayt = this.passData.tableData[i].paytAmt + this.passData.tableData[i].cumPayment;
      this.passData.tableData[i].remainingBal = this.passData.tableData[i].prevNetDue - this.passData.tableData[i].totalPayt;
      
      this.totalBalance += this.passData.tableData[i].paytAmt;
    }
    this.table.refreshTable();
  }

  prepareData(){
    var edited = [];
    var deleted = []
    for(var i = 0 ; i < this.passData.tableData.length;i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        edited.push(this.passData.tableData[i]);
        edited[edited.length - 1].localAmt = this.passData.tableData[i].paytAmt * this.passData.tableData[i].currRate;
        edited[edited.length - 1].netDue = this.passData.tableData[i].paytAmt;
        edited[edited.length - 1].createUser = this.ns.getCurrentUser();
        edited[edited.length - 1].createDate = this.ns.toDateTimeString(0);
        edited[edited.length - 1].updateUser = this.ns.getCurrentUser();
        edited[edited.length - 1].updateDate = this.ns.toDateTimeString(0);
        if(this.passData.tableData[i].balance >= 0 && this.passData.tableData[i].paytAmt >= 0){
           edited[edited.length - 1].paytType = 1
         }else if(this.passData.tableData[i].balance >= 0 && this.passData.tableData[i].paytAmt < 0){
           edited[edited.length - 1].paytType = 2
         }else if(this.passData.tableData[i].balance <= 0 && this.passData.tableData[i].paytAmt <= 0){
           edited[edited.length - 1].paytType = 3
         }else if(this.passData.tableData[i].balance <= 0 && this.passData.tableData[i].paytAmt > 0){
           edited[edited.length - 1].paytType = 4
         }
      }

      if(this.passData.tableData[i].deleted){
        deleted.push(this.passData.tableData[i]);
        deleted[deleted.length - 1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    this.jvDetails.tranId = this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
    this.jvDetails.saveInwPol = edited;
    this.jvDetails.deleteInwPol = deleted;
  }

  saveInwPol(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    this.accountingService.saveAccJVInwPol(this.jvDetails).subscribe((data: any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveInwPol();
      }
    });
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onRowClick(data){
    this.infoData.emit(data);
    /*if(data !== null){
      this.infoData.emit(data);
    }*/
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

  onClickExport() {
    var name = 'InwardPolicyBalances_PolicyList_' + this.jvDetail.jvYear + '-' + this.jvDetail.jvNo;
    var query = 'SELECT policyNo AS [Policy No], ' +
                       'CASE WHEN coRefNo IS NULL THEN \'\' ELSE coRefNo END AS [Co. Ref. No.], ' +
                       'instNo AS [Inst No.], ' +
                       'datetime(dueDate) AS [Due Date], ' +
                       'currCd AS [Curr], ' +
                       'currRate AS [Curr Rate], ' +
                       'currency(prevPremAmt) AS [Premium], ' +
                       'currency(prevRiComm) AS [RI Comm], ' +
                       'currency(prevRiCommVat) AS [RI Comm Vat], ' +
                       'currency(prevCharges) AS [Charges], ' +
                       'currency(prevNetDue) AS [Net Due], ' +
                       'currency(cumPayment) AS [Cumulative Payments], ' +
                       'currency(balance) AS [Balance], ' +
                       'currency(paytAmt) AS [Payment Amount], ' +
                       'currency(premAmt) AS [Premium], ' +
                       'currency(riComm) AS [RI Comm], ' +
                       'currency(riCommVat) AS [RI Comm Vat], ' +
                       'currency(charges) AS [Charges], ' +
                       'currency(totalPayt) AS [Total Payments], ' +
                       'currency(remainingBal) AS [Remaining Balance]';

    this.ns.export(name, query, this.passData.tableData);
  }
  
}