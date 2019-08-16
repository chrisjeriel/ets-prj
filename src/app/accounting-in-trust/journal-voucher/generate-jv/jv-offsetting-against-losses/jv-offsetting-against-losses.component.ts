import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInPolBalAgainstLoss, AgainstLoss } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-jv-offsetting-against-losses',
  templateUrl: './jv-offsetting-against-losses.component.html',
  styleUrls: ['./jv-offsetting-against-losses.component.css']
})
export class JvOffsettingAgainstLossesComponent implements OnInit {

  @Input() jvDetail:any;
  @ViewChild('clmTable') clmTable: CustEditableNonDatatableComponent;
  @ViewChild('inwTable') inwTable: CustEditableNonDatatableComponent;
  @ViewChild('clmlovMdl') clmlovMdl: LovComponent;
  @ViewChild('inwlovMdl') inwlovMdl: LovComponent;

  passData: any = {
    tableData: [],//this.accountingService.getClaimLosses(),
    tHeader: ['Claim No', 'Hist No', 'Hist Category','Hist Type', 'Payment For', 'Insured', 'Ex-Gratia', 'Curr','Curr Rate', 'Reserve Amount','Paid Amount','Paid Amount (Php)'],
    dataTypes: ['text', 'sequence-2', 'text', 'text', 'text', 'text', 'checkbox', 'text', 'percent', 'currency', 'currency', 'currency'],
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
      createUser : '',
      createDate : '',
      updateUser : '',
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
    total: [null, null,null, null, null,null, null,null,'Total',null, 'clmPaytAmt', 'localAmt'],
    widths: [107,52,131,103,96,225,62,40,65,100,100,100],
    keys: ['claimNo','histNo','histCategoryDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currCd','currRate','reserveAmt','clmPaytAmt','localAmt'],
    pageLength: 5,
  }

  InwPolBal: any = {
    tableData: [], //this.accountingService.getAccJvInPolBalAgainstLoss(),
    tHeader: ['SOA No', 'Policy No', 'Co Ref No', 'Inst No', 'Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','RI Comm VAT', 'Charges','Net Due','Payments','Balance','Overdue Interest'],
    dataTypes: ['text','text','text','sequence-2','date','date','text','percent','currency','currency','currency','currency','currency','currency','currency','currency'],
    nData: {
      showMG:1,
      tranId: '',
      itemNo: '',
      policyId: '',
      instNo: '',
      policyNo: '',
      soaNo: '',
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
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: ''
    },
    total:[null,null,null,null,null,null,null,'Total','premAmt','riComm','riCommVat','charges','netDue','prevPaytAmt','balPaytAmt','overdueInt'],
    magnifyingGlass: ['soaNo'],
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
    keys: ['soaNo','policyNo','coRefNo','instNo','effDate','dueDate','currCd','currRate','premAmt','riComm','riCommVat','charges','netDue','prevPaytAmt','balPaytAmt','overdueInt'],
    widths: [202,186,96,51,115,115,39,64,116,116,116,116,116,116,116],
    pageID: 2,
  };

  jvDetails: any = {
    cedingName: '',
  };

  passLov: any = {
    selector: 'acitJVNegativeTreaty',
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

  constructor(private accountingService: AccountingService,private titleService: Title , private ns: NotesService, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.getMtnRate();
  }

  retrieveClmLosses(){
    this.accountingService.getRecievableLosses(this.jvDetail.tranId,this.jvDetails.ceding).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      this.passData.disableAdd = false;
      for(var i = 0 ; i < data.receivables.length; i++){
        this.passData.tableData.push(data.receivables[i]);
        this.clmTable.onRowClick(null, this.passData.tableData[0]);
      }
      this.clmTable.refreshTable();
    });
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveClmLosses();
  }

  onrowClick(data){
    if(data != null && data.itemNo != ''){
      this.itemNo = data.itemNo;
      this.InwPolBal.nData.itemNo = this.itemNo;
      this.InwPolBal.disableAdd = false;
      this.InwPolBal.tableData = data.inwPolBal;
    }
    this.inwTable.refreshTable();
  }

  openLOV(data){
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.claimNo});
    this.clmlovMdl.openLOV();
  }

  openLOVInw($event){
    this.passLovInw.hide = this.InwPolBal.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
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
      this.passData.tableData[this.passData.tableData.length - 1].currCd = data.data[i].currencyCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = data.data[i].currencyRt;
      this.passData.tableData[this.passData.tableData.length - 1].claimNo = data.data[i].claimNo;
      this.passData.tableData[this.passData.tableData.length - 1].histCategoryDesc = data.data[i].histCategoryDesc;
      this.passData.tableData[this.passData.tableData.length - 1].histCategory = data.data[i].histCategory;
      this.passData.tableData[this.passData.tableData.length - 1].histType = data.data[i].histType;
      this.passData.tableData[this.passData.tableData.length - 1].histTypeDesc = data.data[i].histTypeDesc;
      this.passData.tableData[this.passData.tableData.length - 1].insuredDesc = data.data[i].insuredDesc;
      this.passData.tableData[this.passData.tableData.length - 1].reserveAmt = data.data[i].reserveAmt;
      this.passData.tableData[this.passData.tableData.length - 1].clmPaytAmt = data.data[i].paytAmt; 
      this.passData.tableData[this.passData.tableData.length - 1].localAmt = data.data[i].paytAmt * data.data[i].currencyRt; //change to currency rt
    }
    this.clmTable.refreshTable();
  }

  setSoa(data){
    console.log(data)
    var overdue = 0;
    this.InwPolBal.tableData = this.InwPolBal.tableData.filter((a) => a.showMG != 1);
    for(var i = 0 ; i < data.data.length; i++){
      this.InwPolBal.tableData.push(JSON.parse(JSON.stringify(this.InwPolBal.nData)));
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].showMG = 0;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].edited  = true;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].itemNo = null;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].policyId = data.data[i].policyId;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].tranId = this.jvDetail.tranId;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].soaNo = data.data[i].soaNo;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].policyNo = data.data[i].policyNo;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].coRefNo  = data.data[i].coRefNo;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].instNo  = data.data[i].instNo;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].effDate  = data.data[i].effDate;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].dueDate  = data.data[i].dueDate;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].currCd  = data.data[i].currCd;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].currRate  = data.data[i].currRate;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].premAmt  = data.data[i].balPremDue;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].riComm  = data.data[i].balRiComm;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].riCommVat  = data.data[i].balRiCommVat;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].charges  = data.data[i].balChargesDue;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].netDue  = data.data[i].balPremDue - data.data[i].balRiCommVat - data.data[i].balRiComm + data.data[i].balChargesDue;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].prevPaytAmt  = data.data[i].totalPayments;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].balPaytAmt = data.data[i].balAmtDue;
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].localAmt = data.data[i].balAmtDue * data.data[i].currRate;
      overdue =  new Date(this.ns.toDateTimeString(this.jvDetail.jvDate)).getDate() - new Date(data.data[i].dueDate).getDate();
      this.InwPolBal.tableData[this.InwPolBal.tableData.length - 1].overdueInt = (data.data[i].balPremDue)*(this.interestRate)*(overdue/365);
    }
    this.inwTable.refreshTable();
  }

  getMtnRate(){
    this.maintenanceService.getMtnParameters('N','OVERDUE_INT_RT').subscribe((data:any) =>{
      this.interestRate = data.parameters[0].paramValueN;
    });
  }
}
