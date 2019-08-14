import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService } from '@app/_services';
import { ARInwdPolBalDetails } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-inward-policy-balances',
  templateUrl: './inward-policy-balances.component.html',
  styleUrls: ['./inward-policy-balances.component.css']
})
export class InwardPolicyBalancesComponent implements OnInit, OnDestroy {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  @Input() record: any = {};

  passData: any = {
    tableData: [],
    tHeader: ["SOA No.","Policy No","Co. Ref. No.", "Inst No.","Eff Date", "Due Date", "Curr","Curr Rate", "Premium", "RI Comm", 'Ri Comm Vat', "Charges", "Net Due", "Payments", "Balance", "Overdue Interest"],
    dataTypes: ["text","text","text", "text", "date", "date", "text", "percent", "currency", "currency", "currency", "currency", "currency", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    magnifyingGlass: ['soaNo'],
    pageLength: 10,
    nData: {
        tranId: '',
        billId: '',
        itemNo: '',
        policyId: '',
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
    total: [null,null,null,null,null, null, null, 'Total', 'premAmt', 'riComm', 'riCommVat', 'charges', 'netDue', 'totalPayments', 'balPaytAmt', 'overdueInt'],
/*    opts: [{ selector: 'type', vals: ["Payment", "Refund"] }],*/
    widths: [200, 200, 120, 50,120, 120, 30, 85,120, 120, 120,120,120,120,120,120],
    keys: ['soaNo', 'policyNo', 'coRefNo', 'instNo', 'effDate', 'dueDate', 'currCd', 'currRate', 'premAmt', 'riComm', 'riCommVat', 'charges', 'netDue', 'totalPayments', 'balPaytAmt', 'overdueInt'],
    uneditable: [false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true]
  };

  passLov: any = {
    selector: 'acitSoaDtlAr',
    payeeNo: '',
    hide: []
  }

  soaIndex: number;
  totalBal: number = 0;
  variance: number = 0;
  allotedAmt: number = 0;

  cancelFlag: boolean;

  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];
  originalValues: any[] = [];

  selected: any;
  $sub: any;

  constructor(private titleService: Title, private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Inward Policy Balances");
    this.passLov.payeeNo = this.record.payeeNo;
    this.retrieveInwPolBal();
  }

  ngOnDestroy(){
    if(this.$sub !== undefined){
      this.$sub.unsubscribe();
    }
  }

  openSoaLOV(data){
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
    console.log(this.passLov.hide);
    this.soaIndex = data.index;
    this.lovMdl.openLOV();
  }

  retrieveInwPolBal(){
    this.accountingService.getAcitArInwPolBal(this.record.tranId, 1).subscribe( //billId for Inward Policy Balances is always 1
      (data: any)=>{
        if(data.arInwPolBal.length !== 0){
          this.allotedAmt = data.arInwPolBal[0].allotedAmt;
          setTimeout(()=>{
            $('.alloted').focus().blur();
          }, 0);
          this.passData.tableData = data.arInwPolBal;
          this.originalValues = data.arInwPolBal;
          this.table.refreshTable();
        }
        this.computeTotalBalAndVariance();
        console.log(this.originalValues);
      }
    );
  }

  retrieveAgingSoaDtl(){
    this.accountingService.getAcitSoaDtl('','','',this.record.payeeNo).subscribe(
      (data: any)=>{
        data.soaDtlList = data.soaDtlList.filter(a=>{console.log(a);return a.balance > -1;});
        this.passData.tableData = data.soaDtlList;
        this.table.refreshTable();
      }
    );
  }

  setSelectedData(data){
    let selected = data.data;
    console.log(selected);
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < selected.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].policyId = selected[i].policyId; 
      this.passData.tableData[this.passData.tableData.length - 1].soaNo = selected[i].soaNo; 
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = selected[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].coRefNo = selected[i].coRefNo;
      this.passData.tableData[this.passData.tableData.length - 1].instNo = selected[i].instNo;
      this.passData.tableData[this.passData.tableData.length - 1].effDate = selected[i].effDate;
      this.passData.tableData[this.passData.tableData.length - 1].dueDate = selected[i].dueDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd = selected[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = selected[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].premAmt = selected[i].balPremDue;
      this.passData.tableData[this.passData.tableData.length - 1].riComm = selected[i].balRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].riCommVat = selected[i].balRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].charges = selected[i].balChargesDue;
      //this.passData.tableData[this.passData.tableData.length - 1].netDue = selected[i].netDue;
      this.passData.tableData[this.passData.tableData.length - 1].netDue = selected[i].balPremDue - selected[i].balRiComm - selected[i].balRiCommVat + selected[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].totalPayments = selected[i].totalPayments;
      //this.passData.tableData[this.passData.tableData.length - 1].balance = selected[i].balance;
      this.passData.tableData[this.passData.tableData.length - 1].balPaytAmt = this.passData.tableData[this.passData.tableData.length - 1].netDue - selected[i].totalPayments;
      this.passData.tableData[this.passData.tableData.length - 1].overdueInt = selected[i].balOverdueInt;
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['soaNo'];
      this.originalValues.push(this.passData.tableData[this.passData.tableData.length - 1]);
    }
    this.table.refreshTable();
    this.computeTotalBalAndVariance();
  }

  computeTotalBalAndVariance(){
    let tableData = this.passData.tableData.filter((a:any)=>{return String(a.soaNo).length !== 0 && !a.deleted});
    this.totalBal = 0;
    this.variance = 0;
    for(var i of tableData){
      this.totalBal += i.balPaytAmt;
    }
    this.variance = this.record.arAmt - this.totalBal;
  }

  onClickSave(){
    /*if(this.checkBalance()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Balance must not be greater than the difference between Net Due and Payments.';
      this.successDiag.open();
    }else */if(this.checkVariance()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Total Balance for Selected Policy Transactions must not exceed the AR Amount.';
      this.successDiag.open();
    }else if(this.checkAlloted()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Total Balance for Selected Policy Transactions must not exceed the Alloted Policy Balance Payments.';
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    //prepare params from table
    this.savedData = [];
    this.deletedData = [];
    this.computeTotalBalAndVariance();
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].tranId = this.record.tranId;
          this.savedData[this.savedData.length-1].billId = 1; //1 for Inward Policy balances Transaction Type
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
         this.deletedData[this.deletedData.length-1].billId = 1; //1 for Inward Policy balances Transaction Type
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Inward policy balances Transaction Type
      billType: this.record.tranTypeCd,
      totalLocalAmt: this.totalBal * this.record.currRate,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      allotedAmt: this.allotedAmt,
      saveInwPolBal: this.savedData,
      delInwPolBal: this.deletedData
    }
    console.log(params);

    this.accountingService.saveAcitArInwPolBal(params).subscribe(
      (data:any)=>{
        if(data.returnCode === 0){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          this.dialogIcon = '';
          this.successDiag.open();
          this.passData.tableData = [];
          this.retrieveInwPolBal();
          this.table.refreshTable();
        }
      },
      (error: any)=>{

      }
    );
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onRowClick(data){
    if(data !== null){
      this.selected = data;
    }
  }

  onTableDataChange(data){
    console.log(data);
    console.log(this.originalValues);
    let index = 0;
    if(data.key === 'balPaytAmt'){
      for(var i = 0; i < this.passData.tableData.length; i++){
        if(data[i].soaNo === this.selected.soaNo){
          index = i;
          break;
        }
      }
      if(this.selected.add){
        this.accountingService.getAcitSoaDtl(data[index].policyId, data[index].instNo, null, this.record.payeeNo).subscribe(
          (soaDtl: any)=>{
            console.log(soaDtl.soaDtlList[0]);
            let soa = soaDtl.soaDtlList[0];
            if(soa.balChargesDue == 0){
              data[index].premAmt =  Math.round((soa.balPremDue * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].riComm =  Math.round((soa.balRiComm * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].riCommVat = Math.round((soa.balRiCommVat * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].charges = 0;
              //data[index].netDue = soa.balAmtDue - data[index].balPaytAmt; //wrong
            }else{
              data[index].premAmt =  Math.round((soa.balPremDue * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].riComm =  Math.round((soa.balRiComm * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].riCommVat = Math.round((soa.balRiCommVat * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].charges = data[index].balPaytAmt - (data[index].premAmt - data[index].riComm - data[index].riCommVat);
              //data[index].netDue = soa.balAmtDue - data[index].balPaytAmt; //wrong
            }
          }
        );
      }else{
        console.log('aaaaaa');
        /*this.accountingService.getAcitArInwPolBal(this.record.tranId, 1).subscribe(
          (data:any)=>{
            data = data.arInwPolBal.filter(a=>{return a.soaNo == this.selected.soaNo});
            //compute
          }
        );*/
        var sub$ = forkJoin(this.accountingService.getAcitArInwPolBal(this.record.tranId, 1),
                            this.accountingService.getAcitSoaDtl(data[index].policyId, data[index].instNo, null, this.record.payeeNo)).pipe(map(([inw, agingsoa]) => { return { inw, agingsoa}; }));
        this.$sub = sub$.subscribe((forked: any)=>{
          let inwPolBal = forked.inw.arInwPolBal.filter(a=>{return a.soaNo == this.selected.soaNo})[0];
          let agingSoa  = forked.agingsoa.soaDtlList[0];
          console.log(inwPolBal);
          console.log(agingSoa);
          console.log((agingSoa.balPremDue + inwPolBal.premAmt));
          console.log((inwPolBal.balPaytAmt));
          console.log(agingSoa.balPremDue);
          if(agingSoa.balChargesDue == 0){
            data[index].premAmt =  Math.round(((agingSoa.balPremDue + inwPolBal.premAmt) * (data[index].balPaytAmt / (agingSoa.balAmtDue + inwPolBal.balPaytAmt))) * 100) / 100;
            data[index].riComm =  Math.round(((agingSoa.balRiComm + inwPolBal.riComm) * (data[index].balPaytAmt / (agingSoa.balAmtDue + inwPolBal.balPaytAmt))) * 100) / 100;
            data[index].riCommVat = Math.round(((agingSoa.balRiCommVat + inwPolBal.riCommVat) * (data[index].balPaytAmt / (agingSoa.balAmtDue + inwPolBal.balPaytAmt))) * 100) / 100;
            data[index].charges = 0;
            //data[index].netDue = (agingSoa.balAmtDue + inwPolBal.balPaytAmt) - data[index].balPaytAmt; //wrong
          }else{
            data[index].premAmt =  Math.round(((agingSoa.balPremDue + inwPolBal.premAmt) * (data[index].balPaytAmt / (agingSoa.balAmtDue + inwPolBal.balPaytAmt))) * 100) / 100;
            data[index].riComm =  Math.round(((agingSoa.balRiComm + inwPolBal.riComm) * (data[index].balPaytAmt / (agingSoa.balAmtDue + inwPolBal.balPaytAmt))) * 100) / 100;
            data[index].riCommVat = Math.round(((agingSoa.balRiCommVat + inwPolBal.riCommVat) * (data[index].balPaytAmt / (agingSoa.balAmtDue + inwPolBal.balPaytAmt))) * 100) / 100;
            data[index].charges = data[index].balPaytAmt - (data[index].premAmt - data[index].riComm - data[index].riCommVat);
            //data[index].netDue = (agingSoa.balAmtDue + inwPolBal.netDue) - data[index].balPaytAmt; //wrong
          }
        });
      }
    }

    //this.passData.tableData = data;
    this.computeTotalBalAndVariance();
    console.log(this.originalValues);
  }

  //ALL VALIDATIONS STARTS HERE
  checkVariance(): boolean{
    return this.variance < 0;
  }

  checkBalance(){
    for(var i of this.passData.tableData){
      console.log(i.netDue);
      console.log(i.totalPayments);
      console.log(i.balPaytAmt)
      if(i.balPaytAmt > i.netDue - i.totalPayments){
        return true;
      }
    }
    return false;
  }

  checkAlloted(){
    this.computeTotalBalAndVariance();
    if(this.totalBal > this.allotedAmt){
      return true;
    }
    return false;
  }

}
