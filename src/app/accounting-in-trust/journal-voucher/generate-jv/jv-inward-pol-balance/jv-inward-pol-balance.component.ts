import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInPolBal} from '@app/_models';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

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
  @Input() tranId:any;

  passData: any = {
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
       payment : '',
       balance : '',
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
    pageLength: 10,
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true],
    widths: [215,200,160,50,115,115,40,155,130,130,120,130,130,130,130,85],
    keys:['soaNo','policyNo','coRefNo','instNo','effDate','dueDate','currCd', 'currRate', 'premAmt', 'riComm','riCommVat', 'charges', 'netDue', 'prevPaytAmt', 'adjBalAmt', 'overdueInt' ]
  };

  jvDetails: any = {
    cedingName: '',
    deleteInwPol: [],
    saveInwPol:[]
  }


  tableRow: any;
  hideSoa: any = [];
  cancelFlag: boolean = false;
  dialogIcon : any;
  dialogMessage : any;
  interestRate: any;
  
  constructor(private accountingService: AccountingService,private titleService: Title, private ns: NotesService, private maintenaceService: MaintenanceService) { }

  ngOnInit() {
  	 
  }

  retrieveInwPol(){
    this.accountingService.getJVInwPolBal(this.tranId,'',this.jvDetails.ceding).subscribe((data:any) => {
      var datas = data.inwPolBal;
      this.passData.tableData = [];
      this.passData.disableAdd = false;
      for(var i = 0; i < datas.length; i++){
        this.passData.tableData.push(datas[i]);
        this.passData.tableData[this.passData.tableData.length - 1].effDate = this.ns.toDateTimeString(datas[i].effDate);
        this.passData.tableData[this.passData.tableData.length - 1].dueDate = this.ns.toDateTimeString(datas[i].dueDate)
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
    this.ns.lovLoader(data.ev, 0);
    this.retrieveInwPol()
  }

  soaLOV(data){
      this.hideSoa = this.passData.tableData.filter((a)=>{return a.instNo !== undefined && a.policyId !== undefined && !a.deleted}).map((a)=>{return (a.policyId.toString()+ '-'+ a.instNo).toString()});
      $('#soaMdl #modalBtn').trigger('click');
  }

  setSoa(data){
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0 ; i < data.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited  = true;
      this.passData.tableData[this.passData.tableData.length - 1].itemNo = null;
      this.passData.tableData[this.passData.tableData.length - 1].policyId = data[i].policyId;
      this.passData.tableData[this.passData.tableData.length - 1].tranId = this.tranId;
      this.passData.tableData[this.passData.tableData.length - 1].soaNo = data[i].soaNo;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = data[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].coRefNo  = data[i].coRefNo;
      this.passData.tableData[this.passData.tableData.length - 1].instNo  = data[i].instNo;
      this.passData.tableData[this.passData.tableData.length - 1].effDate  = data[i].effDate;
      this.passData.tableData[this.passData.tableData.length - 1].dueDate  = data[i].dueDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd  = data[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate  = data[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].premAmt  = data[i].balPremDue;
      this.passData.tableData[this.passData.tableData.length - 1].riComm  = data[i].balRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].riCommVat  = data[i].balRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].charges  = data[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].netDue  = data[i].balPremDue - data[i].balRiComm + data[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].prevPaytAmt  = data[i].totalPayments;
      this.passData.tableData[this.passData.tableData.length - 1].adjBalAmt  = this.passData.tableData[this.passData.tableData.length - 1].netDue - data[i].totalPayments;
      this.passData.tableData[this.passData.tableData.length - 1].overdueInt  = (data[i].balPremDue)(this.interestRate)(1);
    }
    this.table.refreshTable();
  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
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