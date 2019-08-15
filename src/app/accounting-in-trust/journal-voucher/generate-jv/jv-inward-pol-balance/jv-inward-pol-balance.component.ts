import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInPolBal} from '@app/_models';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
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

  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;

  @Input() jvDetail:any;

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

  passData: any = {
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
  };

  jvDetails: any = {
    cedingName: '',
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

  constructor(private accountingService: AccountingService,private titleService: Title, private ns: NotesService, private maintenaceService: MaintenanceService) { }

  ngOnInit() {
  	 this.getMtnRate();
     console.log(this.jvDetail)
     if(this.jvDetail.statusType == 'N' || this.jvDetail.statusType == 'F'){
       this.disable = false;
     }else {
       this.passData.disableAdd = true;
       this.passData.btnDisabled = true;
       this.passData.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
       this.disable = true;
     }
  }

  retrieveInwPol(){
    this.accountingService.getJVInwPolBal(this.jvDetail.tranId,'',this.jvDetails.ceding).subscribe((data:any) => {
      var datas = data.inwPolBal;
      this.passData.disableAdd = false;
      this.passData.tableData = [];
      this.totalBalance = 0;
      for(var i = 0; i < datas.length; i++){
        this.passData.tableData.push(datas[i]);
        this.passData.tableData[this.passData.tableData.length - 1].effDate = this.ns.toDateTimeString(datas[i].effDate);
        this.passData.tableData[this.passData.tableData.length - 1].dueDate = this.ns.toDateTimeString(datas[i].dueDate)
        this.totalBalance += this.passData.tableData[this.passData.tableData.length - 1].adjBalAmt;
      }
        this.table.refreshTable();
    });
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  checkCode(ev){
     this.ns.lovLoader(ev, 1);
     this.cedingCoLov.checkCedingCo(this.jvDetails.ceding, ev);
    
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.passLov.cedingId = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveInwPol()
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
    console.log(data)

    var overdue = null;

    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0 ; i < data.data.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited  = true;
      this.passData.tableData[this.passData.tableData.length - 1].itemNo = null;
      this.passData.tableData[this.passData.tableData.length - 1].policyId = data.data[i].policyId;
      this.passData.tableData[this.passData.tableData.length - 1].tranId = this.jvDetail.tranId;
      this.passData.tableData[this.passData.tableData.length - 1].soaNo = data.data[i].soaNo;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = data.data[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].coRefNo  = data.data[i].coRefNo;
      this.passData.tableData[this.passData.tableData.length - 1].instNo  = data.data[i].instNo;
      this.passData.tableData[this.passData.tableData.length - 1].effDate  = data.data[i].effDate;
      this.passData.tableData[this.passData.tableData.length - 1].dueDate  = data.data[i].dueDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd  = data.data[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate  = data.data[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].premAmt  = data.data[i].balPremDue;
      this.passData.tableData[this.passData.tableData.length - 1].riComm  = data.data[i].balRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].riCommVat  = data.data[i].balRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].charges  = data.data[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].netDue  = data.data[i].balPremDue - data.data[i].balRiCommVat - data.data[i].balRiComm + data.data[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].prevPaytAmt  = data.data[i].totalPayments;
      this.passData.tableData[this.passData.tableData.length - 1].adjBalAmt  = null; /*this.passData.tableData[this.passData.tableData.length - 1].netDue - data.data[i].totalPayments*/;
      overdue =  new Date(data.data[i].dueDate).getDate() - new Date(this.ns.toDateTimeString(this.jvDetail.jvDate)).getDate();
      this.passData.tableData[this.passData.tableData.length - 1].overdueInt  = (data.data[i].balPremDue)*(this.interestRate)*(overdue/365);
      this.passData.tableData[this.passData.tableData.length - 1].localAmt = this.passData.tableData[this.passData.tableData.length - 1].adjBalAmt * 1;
    }
    this.table.refreshTable();
  }

  onClickSave(){
    var errorFlag = false;
    for(var i = 0 ; i < this.passData.tableData.length; i++){
      if(!this.passData.tableData[i].deleted && this.passData.tableData[i].netDue < this.passData.tableData[i].adjBalAmt){
        errorFlag = true;
      }
    }

    if(errorFlag){
      this.dialogMessage = 'Balance cannot be greater than Net Due.';
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else if(this.totalBalance > this.jvDetail.jvAmt){
      this.dialogMessage = 'Total Balance for Selected Policy Transactions must not exceed the JV Amount.';
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  update(data){
    this.totalBalance = 0;
    for(var i = 0 ; i < this.passData.tableData.length; i++){
      if(!this.passData.tableData[i].deleted){
        this.totalBalance += isNaN(this.passData.tableData[i].adjBalAmt)? 0:this.passData.tableData[i].adjBalAmt;
      }
    }
  }

  prepareData(){
    var edited = [];
    var deleted = []
    for(var i = 0 ; i < this.passData.tableData.length;i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        edited.push(this.passData.tableData[i]);
        edited[edited.length - 1].createUser = this.ns.getCurrentUser();
        edited[edited.length - 1].createDate = this.ns.toDateTimeString(0);
        edited[edited.length - 1].updateUser = this.ns.getCurrentUser();
        edited[edited.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passData.tableData[i].deleted){
        deleted.push(this.passData.tableData[i]);
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

  getMtnRate(){
    this.maintenaceService.getMtnParameters('N','OVERDUE_INT_RT').subscribe((data:any) =>{
      this.interestRate = data.parameters[0].paramValueN;
    });
  }
}