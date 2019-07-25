import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService } from '@app/_services';
import { ARInwdPolBalDetails } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-inward-policy-balances',
  templateUrl: './inward-policy-balances.component.html',
  styleUrls: ['./inward-policy-balances.component.css']
})
export class InwardPolicyBalancesComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;

  @Input() record: any = {};

  passData: any = {
    tableData: [],
    tHeader: ["SOA No.","Policy No","Co. Ref. No.", "Inst No.","Eff Date", "Due Date", "Curr","Curr Rate", "Premium", "RI Comm", "Charges", "Net Due", "Payments", "Balance", "Overdue Interest"],
    dataTypes: ["text","text","text", "text", "date", "date", "text", "percent", "currency", "currency", "currency", "currency", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    magnifyingGlass: ['soaNo'],
    pageLength: 10,
    nData: {
        soaNo: '',
        policyNo: '',
        coRefNo: '',
        instNo: '',
        effDate: '',
        dueDate: '',
        currCd: '',
        currRate: '',
        balPremDue: '',
        balRiComm: '',
        balChargesDue: '',
        netDue: '',
        totalPayments: '',
        balance: '',
        balOverdueInt: '',
        showMG: 1
    },
    total: [null,null,null,null,null, null, null, 'Total', 'balPremDue', 'balRiComm', 'balChargesDue', 'netDue', 'totalPayments', 'balance', 'balOverdueInt'],
    genericBtn: 'Save',
/*    opts: [{ selector: 'type', vals: ["Payment", "Refund"] }],*/
    widths: [200, 200, 120, 50,120, 120, 30, 85, 120, 120,120,120,120,120,120],
    keys: ['soaNo', 'policyNo', 'coRefNo', 'instNo', 'effDate', 'dueDate', 'currCd', 'currRate', 'balPremDue', 'balRiComm', 'balChargesDue', 'netDue', 'totalPayments', 'balance', 'balOverdueInt'],
    uneditable: [false,true,true,true,true,true,true,true,true,true,true,true,true,false,true]
  };

  passLov: any = {
    selector: 'acitSoaDtl',
    payeeNo: '',
    hide: []
  }

  soaIndex: number;
  totalBal: number = 0;
  variance: number = 0;

  constructor(private titleService: Title, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Inward Policy Balances");
    this.passLov.payeeNo = this.record.payeeNo;
    this.retrieveInwPolBal();
  }

  openSoaLOV(data){
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
    console.log(this.passLov.hide);
    this.soaIndex = data.index;
    this.lovMdl.openLOV();
  }

  retrieveInwPolBal(){
    
  }

  retrieveAgingSoaDtl(){
    this.accountingService.getAcitSoaDtl('','','',this.record.payeeNo).subscribe(
      (data: any)=>{
        this.passData.tableData = data.soaDtlList;
        this.table.refreshTable();
      }
    );
  }

  setSelectedData(data){
    let selected = data.data;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < selected.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].soaNo = selected[i].soaNo; 
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = selected[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].coRefNo = selected[i].coRefNo;
      this.passData.tableData[this.passData.tableData.length - 1].instNo = selected[i].instNo;
      this.passData.tableData[this.passData.tableData.length - 1].effDate = selected[i].effDate;
      this.passData.tableData[this.passData.tableData.length - 1].dueDate = selected[i].dueDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd = selected[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = selected[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].balPremDue = selected[i].balPremDue;
      this.passData.tableData[this.passData.tableData.length - 1].balRiComm = selected[i].balRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].balChargesDue = selected[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].netDue = selected[i].netDue;
      this.passData.tableData[this.passData.tableData.length - 1].totalPayments = selected[i].totalPayments;
      this.passData.tableData[this.passData.tableData.length - 1].balance = selected[i].balance;
      this.passData.tableData[this.passData.tableData.length - 1].balOverdueInt = selected[i].balOverdueInt;
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['soaNo'];
    }
    this.table.refreshTable();
    this.computeTotalBalAndVariance();
  }

  computeTotalBalAndVariance(){
    let tableData = this.passData.tableData.filter((a:any)=>{return String(a.soaNo).length !== 0});
    this.totalBal = 0;
    this.variance = 0;
    for(var i of tableData){
      this.totalBal += i.balance;
    }
    this.variance = this.record.arAmt - this.totalBal;
  }

  onRowClick(data){
    console.log(data);
  }
  onTableDataChange(data){
    console.log(data);
  }

}
