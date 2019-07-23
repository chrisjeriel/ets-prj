import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInPolBal} from '@app/_models';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'

@Component({
  selector: 'app-jv-inward-pol-balance',
  templateUrl: './jv-inward-pol-balance.component.html',
  styleUrls: ['./jv-inward-pol-balance.component.css']
})
export class JvInwardPolBalanceComponent implements OnInit {

  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @Input() tranId:any;

  passData: any = {
    tableData: [],
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','Charges','Net Due','Payments','Balance',"Overdue Interest"],
    resizable: [true, true, true, true,true, true, true, true,true,true,true,true,true,true,true],
    dataTypes: ['text','text','text','number','date','date','text','percent','currency','percent','percent','currency','currency','currency','percent'],
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
       charges : '',
       netDue : '',
       payment : '',
       balance : '',
       overdueInt : ''
    },
    total:[null,null,null,null,null,null,null,'Total','premAmt', 'riComm', 'charges', 'netDue', 'payment', 'balance', 'overdueInt'],
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
    pageLength: 10,
    widths: [180,180,120,50,1,1,1,85,120,85,85,120,120,120,120,85],
    keys:['soaNo','policyNo','corefNo','instNo','effDate','dueDate','currCd', 'currRate', 'premAmt', 'riComm', 'charges', 'netDue', 'payment', 'totalBalance', 'overdueInt' ]
  };

  jvDetails: any = {
    cedingName: ''
  }

  tableRow: any;
  
  constructor(private accountingService: AccountingService,private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
  	 
  }

  retrieveInwPol(){
    console.log(this.jvDetails.ceding);
    this.accountingService.getJVInwPolBal(this.tranId,'',this.jvDetails.ceding).subscribe((data:any) => {
      console.log(data)
      var datas = data.transactions.jvListings.inwPolBal;
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
    console.log(data)
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    console.log(this.jvDetails.ceding);
    this.retrieveInwPol()
  }

  soaLOV(data){
      $('#soaMdl #modalBtn').trigger('click');
      this.tableRow = data.index;
  }

  setSoa(data){
    console.log(data)
    this.passData.tableData[this.tableRow].soaNo = data.soaNo;
    this.passData.tableData[this.tableRow].policyNo = data.policyNo;
    this.passData.tableData[this.tableRow].corefNo  = data.coRefNo;
    this.passData.tableData[this.tableRow].instNo  = data.instNo;
    this.passData.tableData[this.tableRow].effDate  = data.effDate;
    this.passData.tableData[this.tableRow].dueDate  = data.dueDate;
    this.passData.tableData[this.tableRow].currCd  = data.currCd;
    this.passData.tableData[this.tableRow].currRate  = data.currRate;
    this.passData.tableData[this.tableRow].premAmt  = data.balPremDue;
    this.passData.tableData[this.tableRow].riComm  = data.balRiComm;
    this.passData.tableData[this.tableRow].charges  = data.balChargesDue;
    this.passData.tableData[this.tableRow].netDue  = data.netDue;
    this.passData.tableData[this.tableRow].payment  = data.totalPayments;
    this.passData.tableData[this.tableRow].totalBalance  = data.balance;
    this.passData.tableData[this.tableRow].overdueInt  = data.balOverdueInt;

  }


}