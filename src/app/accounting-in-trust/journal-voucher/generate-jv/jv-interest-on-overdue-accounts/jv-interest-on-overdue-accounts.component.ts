import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInterestOverdue} from '@app/_models';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-jv-interest-on-overdue-accounts',
  templateUrl: './jv-interest-on-overdue-accounts.component.html',
  styleUrls: ['./jv-interest-on-overdue-accounts.component.css']
})

export class JvInterestOnOverdueAccountsComponent implements OnInit {
  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;

  @Input() cedingParams:any;
  @Input() jvDetail:any;
  @Output() emitData = new EventEmitter<any>();

  passData: any = {
    tableData: [],
    tHeader: ['Policy No.','Inst No.','Co. Ref No.', 'Eff Date','Due Date','No. of Days Overdue','Curr','Curr Rate','Premium',"Overdue Interest"],
    resizable: [ true, true, true, true, true, true, true, true,true,true],
    dataTypes: ['text','sequence-2','text','date','date','number','text','percent','currency','currency'],
    nData: {
      showMG : 1,
      policyNo : '',
      coRefNo : '',
      instNo : '',
      effDate : '',
      dueDate : '',
      daysOverdue : '',
      currCd : '',
      currRate : '',
      premAmt : '',
      overdueInt : ''
    },
    total:[null,null,null,null,null,null,null,'Total','premAmt','overdueInt'],
    magnifyingGlass: ['policyNo'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 10,
    disableAdd: true,
    btnDisabled: false,
    widths: [230,1,140,1,1,1,1,85,120,120],
    uneditable:[true,true,true,true,true,true,true,true,true,false],
    keys: ['policyNo','instNo','coRefNo','effDate','dueDate','daysOverdue','currCd','currRate','premAmt','overdueInt']
  };

  jvDetails: any = {
    cedingName: ''
  }

  passLov: any = {
    selector: 'acitSoaDtl',
    cedingId: '',
    hide: []
  }

  hideSoa: any = [];
  cancelFlag : boolean = false;
  dialogIcon : any;
  dialogMessage : any;
  interestRate : any;
  totalOverdue: number = 0; 
  disable: boolean = true;

  constructor(private accountingService: AccountingService,private titleService: Title, private ns: NotesService, private maintenaceService: MaintenanceService) { }

  ngOnInit() {
    this.getMtnRate();
    console.log(this.jvDetail)
    this.passLov.currCd = this.jvDetail.currCd;
    this.passData.nData.currRate = this.jvDetail.currRate;
    this.passData.nData.currCd = this.jvDetail.currCd;
    if(this.jvDetail.statusType == 'N' || this.jvDetail.statusType == 'F'){
      this.disable = false;
      this.passData.disableAdd = false;
    }else {
      this.passData.uneditable = [true,true,true,true,true,true,true,true,true,true,true];
      this.disable = true;
      this.passData.btnDisabled = true;
      this.passData.disableAdd = true;
    }
    this.getInterestOverdue();
  }

  getInterestOverdue(){
    this.accountingService.getAcitJVOverdue(this.jvDetail.tranId,'').subscribe((data:any) => {
      this.totalOverdue = 0;
      this.passData.tableData = [];
      if(data.overDueAccts.length != 0){
        this.jvDetails.cedingName = data.overDueAccts[0].cedingName;
        this.jvDetails.cedingId = data.overDueAccts[0].cedingId;
        this.check(this.jvDetails);
        for(var i = 0; i < data.overDueAccts.length; i++){
          this.passData.tableData.push(data.overDueAccts[i]);
          this.totalOverdue += this.passData.tableData[this.passData.tableData.length - 1].overdueInt;
          this.passData.tableData[this.passData.tableData.length - 1].effDate = data.overDueAccts[i].effDate;
          this.passData.tableData[this.passData.tableData.length - 1].dueDate = data.overDueAccts[i].dueDate;
          this.passData.tableData[this.passData.tableData.length - 1].orgOverdue = data.overDueAccts[i].overdueInt;
        };
      }
      
      this.table.refreshTable(); 
    });
  }

  checkCode(ev){
    this.ns.lovLoader(ev, 1);
    this.cedingCoLov.checkCedingCo(this.jvDetails.ceding, ev);
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }


  soaLOV(data){
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
    this.lovMdl.openLOV();
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.passLov.cedingId = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    this.getInterestOverdue();
    this.check(this.jvDetails);
  }

  check(data){
    console.log(data)
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  setSoa(data){
    console.log(data)
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0 ; i < data.data.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited  = true;
      this.passData.tableData[this.passData.tableData.length - 1].tranId = this.jvDetail.tranId;
      this.passData.tableData[this.passData.tableData.length - 1].policyId = data.data[i].policyId;
      this.passData.tableData[this.passData.tableData.length - 1].soaNo = data.data[i].soaNo;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = data.data[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].coRefNo  = data.data[i].coRefNo;
      this.passData.tableData[this.passData.tableData.length - 1].instNo  = data.data[i].instNo;
      this.passData.tableData[this.passData.tableData.length - 1].effDate  = data.data[i].effDate;
      this.passData.tableData[this.passData.tableData.length - 1].dueDate  = data.data[i].dueDate;
      this.passData.tableData[this.passData.tableData.length - 1].daysOverdue  = new Date(this.ns.toDateTimeString(0)).getDate() - new Date(data.data[i].dueDate).getDate() ;
      this.passData.tableData[this.passData.tableData.length - 1].currCd  = data.data[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate  = data.data[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].premAmt  = data.data[i].balPremDue;
      this.passData.tableData[this.passData.tableData.length - 1].autoTag  = 'Y'
      this.passData.tableData[this.passData.tableData.length - 1].interestRate = this.interestRate;
      this.passData.tableData[this.passData.tableData.length - 1].overdueInt  = this.passData.tableData[this.passData.tableData.length - 1].daysOverdue < 0 ? 0:(data.data[i].balPremDue)*(this.interestRate)*(this.passData.tableData[this.passData.tableData.length - 1].daysOverdue/365);
      this.passData.tableData[this.passData.tableData.length - 1].orgOverdue  = this.passData.tableData[this.passData.tableData.length - 1].daysOverdue < 0 ? 0:(data.data[i].balPremDue)*(this.interestRate)*(this.passData.tableData[this.passData.tableData.length - 1].daysOverdue/365);
    }
    this.table.refreshTable();
    //var test =  this.passData.tableData[0].effDate.getDate() - this.ns.toDateTimeString(0).getDate();
  }

  onClickSave(){
    if(this.totalOverdue > this.jvDetail.jvAmt){
      this.dialogMessage = 'Total Overdue Interest must not exceed the JV Amount.';
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else {
      this.confirm.confirmModal();
    }
    
  }

  prepareData(){
    var edited = [];
    var deleted = [];
    for(var i = 0 ; i < this.passData.tableData.length; i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        edited.push(this.passData.tableData[i]);
        edited[edited.length - 1].dueDate = this.ns.toDateTimeString(this.passData.tableData[i].dueDate)
        edited[edited.length - 1].autoTag = this.passData.tableData[i].orgOverdue == this.passData.tableData[i].overdueInt ? 'Y':'N';
        edited[edited.length - 1].createDate = this.ns.toDateTimeString(0);
        edited[edited.length - 1].createUser = this.ns.getCurrentUser();
        edited[edited.length - 1].updateUser = this.ns.getCurrentUser();
        edited[edited.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passData.tableData[i].deleted){
        deleted.push(this.passData.tableData[i]);
      }
    }
    this.jvDetails.tranId = this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
    this.jvDetails.saveOverdueAccts = edited;
    this.jvDetails.deleteOverdueAccts = deleted;
  }

  saveOverdueAcct(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();

    this.accountingService.saveAccJVOverdueAcct(this.jvDetails).subscribe((data: any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.getInterestOverdue();
      }
    });
  }

  cancel(){
    //this.cancelBtn.clickCancel();
    console.log(new Date(this.ns.toDateTimeString(0)).getTime());
    console.log(new Date(this.ns.toDateTimeString(this.passData.tableData[0].dueDate)).getTime());
    console.log(new Date(this.ns.toDateTimeString(0)).getTime() - new Date(this.ns.toDateTimeString(this.passData.tableData[0].dueDate)).getTime());
    console.log(this.ns.toDateTimeString(new Date(this.ns.toDateTimeString(0)).getTime() - new Date(this.ns.toDateTimeString(this.passData.tableData[0].dueDate)).getTime()));
    //console.log(this.ns.toDateTimeString(new Date(this.ns.toDateTimeString(0)).getTime() - new Date(this.ns.toDateTimeString(this.passData.tableData[0].dueDate)).getTime()));
  }

  update(data){
    this.totalOverdue = 0;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(!this.passData.tableData[i].deleted){
        this.totalOverdue += isNaN(this.passData.tableData[i].overdueInt) ? this.passData.tableData[i].overdueInt:0;
      }
    }
  }

  getMtnRate(){
    this.maintenaceService.getMtnParameters('N','OVERDUE_INT_RT').subscribe((data:any) =>{
      this.interestRate = data.parameters[0].paramValueN;
    });
  }
}
