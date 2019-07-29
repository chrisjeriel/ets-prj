import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInterestOverdue} from '@app/_models';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

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

  @Input() tranId:any;
  @Input() jvDate:any;

  passData: any = {
    tableData: [],
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.', 'Eff Date','Due Date','No. of Days Overdue','Curr','Curr Rate','Premium',"Overdue Interest"],
    resizable: [true, true, true, true, true, true, true, true, true,true,true],
    dataTypes: ['text','text','text','number','date','date','number','text','percent','currency','currency'],
    nData: {
      showMG : 1,
      soaNo : '',
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
    total:[null,null,null,null,null,null,null,null,'Total','premAmt','overdueInt'],
    magnifyingGlass: ['soaNo'],
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
    widths: [230,230,140,1,1,1,1,1,85,120,120],
    keys: ['soaNo','policyNo','coRefNo','instNo','effDate','dueDate','daysOverdue','currCd','currRate','premAmt','overdueInt']
  };

  jvDetails: any = {
    cedingName: ''
  }

  hideSoa: any = [];
  cancelFlag : boolean = false;
  dialogIcon : any;
  dialogMessage : any;
  interestRate : any;

  constructor(private accountingService: AccountingService,private titleService: Title, private ns: NotesService, private maintenaceService: MaintenanceService) { }

  ngOnInit() {
    this.getMtnRate();
  }

  getInterestOverdue(){
    this.accountingService.getAcitJVOverdue(this.tranId,'',this.jvDetails.ceding).subscribe((data:any) => {
      this.passData.disableAdd = false;
      for(var i = 0; i < data.overDueAccts.length; i++){
        this.passData.tableData = [];
        this.passData.tableData.push(data.overDueAccts[i]);
        this.passData.tableData[this.passData.tableData.length - 1].effDate = data.overDueAccts[i].effDate;
        this.passData.tableData[this.passData.tableData.length - 1].dueDate = data.overDueAccts[i].dueDate;
        this.passData.tableData[this.passData.tableData.length - 1].orgOverdue = data.overDueAccts[i].overdueInt;
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
      this.hideSoa = this.passData.tableData.filter((a)=>{return a.instNo !== undefined && a.policyId !== undefined && !a.deleted}).map((a)=>{return (a.policyId.toString()+ '-'+ a.instNo).toString()});
      $('#soaMdl #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    this.getInterestOverdue();
  }

  setSoa(data){
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0 ; i < data.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited  = true;
      this.passData.tableData[this.passData.tableData.length - 1].tranId = this.tranId;
      this.passData.tableData[this.passData.tableData.length - 1].policyId = data[i].policyId;
      this.passData.tableData[this.passData.tableData.length - 1].soaNo = data[i].soaNo;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = data[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].coRefNo  = data[i].coRefNo;
      this.passData.tableData[this.passData.tableData.length - 1].instNo  = data[i].instNo;
      this.passData.tableData[this.passData.tableData.length - 1].effDate  = data[i].effDate;
      this.passData.tableData[this.passData.tableData.length - 1].dueDate  = data[i].dueDate;
      this.passData.tableData[this.passData.tableData.length - 1].daysOverdue  = new Date(data[i].dueDate).getDate() - new Date(this.ns.toDateTimeString(this.jvDate)).getDate();
      this.passData.tableData[this.passData.tableData.length - 1].currCd  = data[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate  = data[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].premAmt  = data[i].balPremDue;
      this.passData.tableData[this.passData.tableData.length - 1].autoTag  = 'Y'
      //this.passData.tableData[this.passData.tableData.length - 1].overdueInt  = (data[i].balPremDue)*(this.interestRate)*(this.passData.tableData[this.passData.tableData.length - 1].daysOverdue/365);
      //this.passData.tableData[this.passData.tableData.length - 1].orgOverdue  = (data[i].balPremDue)*(this.interestRate)*(this.passData.tableData[this.passData.tableData.length - 1].daysOverdue/365);
      this.passData.tableData[this.passData.tableData.length - 1].overdueInt  = 1;
      this.passData.tableData[this.passData.tableData.length - 1].orgOverdue  = 1;
    }
    this.table.refreshTable();
    //var test =  this.passData.tableData[0].effDate.getDate() - this.ns.toDateTimeString(0).getDate();
  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
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
    this.cancelBtn.clickCancel();
  }

  getMtnRate(){
    this.maintenaceService.getMtnParameters('N','OVERDUE_INT_RT').subscribe((data:any) =>{
      this.interestRate = data.parameters[0].paramValueN;
    });
  }
}
