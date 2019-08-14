import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-jv-overdue-accounts-against-treaty',
  templateUrl: './jv-overdue-accounts-against-treaty.component.html',
  styleUrls: ['./jv-overdue-accounts-against-treaty.component.css']
})
export class JvOverdueAccountsAgainstTreatyComponent implements OnInit {
  
  @Input() jvDetail: any;
  @ViewChild('quarterTable') quarterTable: CustEditableNonDatatableComponent;
  @ViewChild('trytytrans') trytytrans: CustEditableNonDatatableComponent;
  @ViewChild(QuarterEndingLovComponent) quarterModal: QuarterEndingLovComponent; 
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

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
      uneditable: [true, false],
      total: [null, null, 'Total', 'balanceAmt', 'localAmt'],
      keys: ['quarterEnding', 'currCd', 'currRate', 'balanceAmt', 'localAmt'],
      widths: [203,50,130,130,130],
  }

  passDataOffsetting: any = {
    tableData: [],
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','RI Comm VAT','Charges','Net Due','Payments','Balance','Balance (PHP)',"Overdue Interest"],
    dataTypes: ['text','text','text','sequence-2','date','date','text','percent','currency','currency','currency','currency','currency','currency','currency','currency','currency'],
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
    total:[null,null,null,null,null,null,null,'Total','premAmt','riComm','riCommVat', 'charges','netDue','prevPaytAmt','balPaytAmt','localAmt','overdueInt'],
    magnifyingGlass: ['soaNo'],
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
    widths: [204,185,185,1,1,1,1,1,85,120,85,85,120,120,120,120],
    keys: ['soaNo','policyNo','coRefNo','instNo','effDate','dueDate','currCd','currRate','premAmt','riComm','riCommVat','charges','netDue','prevPaytAmt','balPaytAmt','localAmt','overdueInt']
  };

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
  interestRate: number =0;
  dialogIcon : any;
  dialogMessage : any;

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal, private ns: NotesService, private maintenaceService: MaintenanceService) { }

  ngOnInit() {
    this.getMtnRate();
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  retrieveAcctBal(){
    this.accountingService.getAcctTrtyBal(this.jvDetail.tranId,this.jvDetails.ceding).subscribe((data:any) => {
      console.log(data);
      this.passData.tableData = [];
      this.passData.disableAdd = false;
      for(var i = 0; i < data.acctTreatyBal.length; i++){
        this.passData.tableData.push(data.acctTreatyBal[i]);
      }
      this.quarterTable.refreshTable();
      this.quarterTable.onRowClick(null,this.passData.tableData[0]);
    });
  }

  setCedingcompany(data){
    console.log(data)
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.passLov.cedingId = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveAcctBal();
  }

  onRowClick(data){
    console.log(data)
    if(data!=null && data.quarterNo != ''){
      this.quarterNo = data.quarterNo;
      this.passDataOffsetting.disableAdd = false;
      this.passDataOffsetting.nData.quarterNo = this.quarterNo;
      this.passDataOffsetting.tableData = data.acctOffset;
      console.log('pasok')
      this.trytytrans.refreshTable();
    }
  }

  quarterEndModal(){
    this.quarterModal.modal.openNoClose();
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

  updateTreatyBal(data){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].localAmt = isNaN(this.passData.tableData[i].currRate) ? 1:this.passData.tableData[i].currRate * this.passData.tableData[i].balanceAmt;
    }
    this.quarterTable.refreshTable();
  }
  
  openLOV(data){
    this.passLov.hide = this.passDataOffsetting.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
    this.lovMdl.openLOV();
  }

  setSoa(data){
    console.log(data)
    var overdue: number = 0;
    this.passDataOffsetting.tableData = this.passDataOffsetting.tableData.filter(a=>a.showMG!=1);
    for (var i = 0; i < data.data.length; i++) {
      this.passDataOffsetting.tableData.push(JSON.parse(JSON.stringify(this.passDataOffsetting.nData)));
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].showMG = 0;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].edited  = true;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].itemNo = null;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].policyId = data.data[i].policyId;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].tranId = this.jvDetail.tranId;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].soaNo = data.data[i].soaNo;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].policyNo = data.data[i].policyNo;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].coRefNo  = data.data[i].coRefNo;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].instNo  = data.data[i].instNo;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].effDate  = data.data[i].effDate;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].dueDate  = data.data[i].dueDate;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].currCd  = data.data[i].currCd;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].currRate  = data.data[i].currRate;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].premAmt  = data.data[i].balPremDue;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].riComm  = data.data[i].balRiComm;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].riCommVat  = data.data[i].balRiCommVat;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].charges  = data.data[i].balChargesDue;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].netDue  = data.data[i].balPremDue - data.data[i].balRiCommVat - data.data[i].balRiComm + data.data[i].balChargesDue;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].prevPaytAmt  = data.data[i].totalPayments;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].balPaytAmt = data.data[i].balAmtDue;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].localAmt = data.data[i].balAmtDue * data.data[i].currRate;
      overdue =  new Date(this.ns.toDateTimeString(this.jvDetail.jvDate)).getDate() - new Date(data.data[i].dueDate).getDate() ;
      this.passDataOffsetting.tableData[this.passDataOffsetting.tableData.length - 1].overdueInt = (data.data[i].balPremDue)*(this.interestRate)*(overdue/365);
    }
    this.trytytrans.refreshTable();
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  prepareData(){
    var quarterNo = null;
    this.jvDetails.saveAcctTrty = [];
    this.jvDetails.delAcctTrty = [];
    this.jvDetails.saveInwPolOffset = [];
    this.jvDetails.delInwPolOffset = [];

    for( var i = 0 ; i < this.passData.tableData.length; i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
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
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].tranId = this.jvDetail.tranId;
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].quarterNo = this.passData.tableData[i].quarterNo;
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].createDate =  this.ns.toDateTimeString(this.passData.tableData[i].acctOffset[j].createDate);
          this.jvDetails.saveInwPolOffset[this.jvDetails.saveInwPolOffset.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].acctOffset[j].updateDate);
        }

        if(this.passData.tableData[i].acctOffset[j].deleted){
          this.jvDetails.delInwPolOffset.push(this.passData.tableData[i].acctOffset[j]);
          this.jvDetails.delInwPolOffset[this.jvDetails.delInwPolOffset.length - 1].tranId = this.jvDetail.tranId;
        }
      }
    }
  }

  saveAcctTrty(){
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
    this.prepareData();
    console.log(this.jvDetails);
  }

  getMtnRate(){
    this.maintenaceService.getMtnParameters('N','OVERDUE_INT_RT').subscribe((data:any) =>{
      this.interestRate = data.parameters[0].paramValueN;
    });
  }
}
