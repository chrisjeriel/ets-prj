import { Component, OnInit, ViewChild, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
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
  @Output() emitCreateUpdate: EventEmitter<any> = new EventEmitter();

  passData: any = {
    tableData: [],
    tHeaderWithColspan: [{header:'', span:1},{header: 'Inward Policy Info', span: 13}, {header: 'Payment Details', span: 5}, {header: '', span: 1}, {header: '', span: 1}],
    //pinKeysLeft: ['policyNo', 'coRefNo', 'instNo', 'dueDate', 'currCd', 'currRate', 'prevPremAmt', 'prevRiComm', 'prevRiCommVat', 'prevCharges', 'prevNetDue', 'cumPayment', 'prevBalance'],
    tHeader: ["Policy No","Co. Ref. No.", "Inst No.", "Due Date", "Curr","Curr Rate", "Premium", "RI Comm", 'Ri Comm Vat', "Charges", "Net Due", "Cumulative Payments", "Balance",
              'Payment Amount', "Premium", "RI Comm", 'Ri Comm Vat', "Charges", 'Total Payments', 'Remaining Balance'],
    dataTypes: ["text","text", "text", "date", "text", "percent", "currency", "currency", "currency", "currency", "currency", "currency", "currency","currency","currency","currency","currency","currency","currency","currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    magnifyingGlass: ['policyNo'],
    pageLength: 10,
    nData: {
        tranId: '',
        billId: '',
        itemNo: '',
        policyId: '',
        policyNo: '',
        coRefNo: '',
        instNo: '',
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
    total: [null,null,null, null, null, 'Total', 'prevPremAmt', 'prevRiComm', 'prevRiCommVat', 'prevCharges', 'prevNetDue', 'cumPayment', 'prevBalance','balPaytAmt','premAmt', 'riComm', 'riCommVat', 'charges','totalPayments', 'netDue'],
/*    opts: [{ selector: 'type', vals: ["Payment", "Refund"] }],*/
    widths: [170, 100, 50, 1, 30, 85,110, 110, 110,110,110,110,110,110,110,110,110,110,110,110,],
    keys: ['policyNo', 'coRefNo', 'instNo', 'dueDate', 'currCd', 'currRate', 'prevPremAmt', 'prevRiComm', 'prevRiCommVat', 'prevCharges', 'prevNetDue', 'cumPayment', 'prevBalance','balPaytAmt','premAmt', 'riComm', 'riCommVat', 'charges','totalPayments', 'netDue'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true],
    small: false,
  };

  passLov: any = {
    selector: 'acitSoaDtlAr',
    payeeNo: '',
    currCd: '',
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
    console.log(this.record.payeeNo);
    this.passLov.payeeNo = this.record.payeeNo;
    if(this.record.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
      this.passData.tHeaderWithColspan= [{header: 'Inward Policy Info', span: 13, pinLeft: true}, {header: 'Payment Details', span: 5}, {header: '', span: 1}, {header: '', span: 1}];
      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      this.passData.checkFlag = false;
    }
    this.retrieveInwPolBal();
  }

  ngOnDestroy(){
    if(this.$sub !== undefined){
      this.$sub.unsubscribe();
    }
  }

  openSoaLOV(data){
    this.passLov.currCd = this.record.currCd;
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
    console.log(this.passLov.hide);
    this.soaIndex = data.index;
    this.lovMdl.openLOV();
  }

  retrieveInwPolBal(){
    this.passData.tableData = [];
    this.accountingService.getAcitArInwPolBal(this.record.tranId, 1).subscribe( //billId for Inward Policy Balances is always 1
      (data: any)=>{
        if(data.arInwPolBal.length !== 0){
          this.allotedAmt = data.arInwPolBal[0].allotedAmt;
          setTimeout(()=>{
            $('.alloted').focus().blur();
          }, 0);
          //this.passData.tableData = data.arInwPolBal;
          for(var i of data.arInwPolBal){
            i.cumPayment = i.prevCumPayment;
            i.totalPayments = i.cumPayment + i.balPaytAmt;
            //i.uneditable = ['balPaytAmt'];
            this.passData.tableData.push(i);
          }
          this.originalValues = data.arInwPolBal;
          this.table.refreshTable();
        }else{
          this.allotedAmt = this.record.arAmt;
          setTimeout(()=>{
            $('.alloted').focus().blur();
          }, 0);
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
      this.passData.tableData[this.passData.tableData.length - 1].prevPremAmt = selected[i].prevPremAmt;
      this.passData.tableData[this.passData.tableData.length - 1].prevRiComm = selected[i].prevRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].prevRiCommVat = selected[i].prevRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].prevCharges = selected[i].prevCharges;
      this.passData.tableData[this.passData.tableData.length - 1].prevNetDue = selected[i].prevNetDue;
      /*this.passData.tableData[this.passData.tableData.length - 1].prevPremAmt = selected[i].balPremDue;
      this.passData.tableData[this.passData.tableData.length - 1].prevRiComm = selected[i].balRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].prevRiCommVat = selected[i].balRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].prevCharges = selected[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].prevNetDue = selected[i].balAmtDue;*/
      this.passData.tableData[this.passData.tableData.length - 1].cumPayment = selected[i].cumPayment;
      this.passData.tableData[this.passData.tableData.length - 1].prevBalance = selected[i].prevBalance;
      
      /*this.passData.tableData[this.passData.tableData.length - 1].premAmt = selected[i].prevPremAmt;
      this.passData.tableData[this.passData.tableData.length - 1].riComm = selected[i].prevRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].riCommVat = selected[i].prevRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].charges = selected[i].prevCharges;
      this.passData.tableData[this.passData.tableData.length - 1].balPaytAmt = selected[i].prevBalance;
      this.passData.tableData[this.passData.tableData.length - 1].totalPayments = selected[i].cumPayment + selected[i].prevBalance;
      this.passData.tableData[this.passData.tableData.length - 1].netDue = 0;*/
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
    //this.variance = this.record.arAmt - this.totalBal;
    this.variance = this.allotedAmt - this.totalBal;
  }

  onClickSave(){
    if(this.checkBalance()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Payment must not be greater than the Balance.';
      this.successDiag.open();
    }else if(this.checkVariance()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Total Balance for Selected Policy Transactions must not exceed the AR Amount.';
      this.successDiag.open();
    }else if(this.checkAlloted()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Total Balance for Selected Policy Transactions must not exceed the Alloted Policy Balance Payments.';
      this.successDiag.open();
    }else if(this.checkNetPayments()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Net payments must be positive.';
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
      data.updateDate = this.ns.toDateTimeString(data.updateDate);
      data.createDate = this.ns.toDateTimeString(data.createDate);
      this.emitCreateUpdate.emit(data);
    }else{
      this.selected = null;
      this.emitCreateUpdate.emit(null);
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
      console.log(data[index].prevPremAmt);
      console.log(data[index].prevRiComm);
      console.log(data[index].prevRiCommVat);
      console.log(data[index].prevCharges);
      console.log(data[index].balPaytAmt);
      console.log(data[index].prevNetDue);
      data[index].premAmt = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevPremAmt;
      data[index].riComm = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevRiComm;
      data[index].riCommVat = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevRiCommVat;
      data[index].charges = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevCharges;

      data[index].totalPayments = data[index].balPaytAmt + data[index].cumPayment;
      data[index].netDue = data[index].prevNetDue - data[index].totalPayments;
      console.log(data);
      /*if(this.selected.add){
        this.accountingService.getAcitSoaDtlNew(this.record.currCd,data[index].policyId, data[index].instNo, null, this.record.payeeNo).subscribe(
          (soaDtl: any)=>{
            console.log(soaDtl.soaDtlList[0]);
            let soa = soaDtl.soaDtlList[0];
            console.log(soa.balPremDue);
            console.log(soa.balRiComm);
            console.log(soa.balRiCommVat);
            console.log(data[index].balPaytAmt);
            console.log(soa.balAmtDue);
            console.log((soa.balPremDue * (data[index].balPaytAmt / soa.balAmtDue)));
            if(soa.balChargesDue == 0){
              data[index].premAmt =  Math.round((soa.balPremDue * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].riComm =  Math.round((soa.balRiComm * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 
              100;
              data[index].riCommVat = Math.round((soa.balRiCommVat * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].charges = 0;
              data[index].netDue = data[index].prevBalance - data[index].balPaytAmt; //wrong
              data[index].totalPayments = data[index].cumPayment + data[index].balPaytAmt;
            }else{
              data[index].premAmt =  Math.round((soa.balPremDue * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].riComm =  Math.round((soa.balRiComm * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].riCommVat = Math.round((soa.balRiCommVat * (data[index].balPaytAmt / soa.balAmtDue)) * 100) / 100;
              data[index].charges = data[index].balPaytAmt - (data[index].premAmt - data[index].riComm - data[index].riCommVat);
              data[index].netDue = data[index].prevBalance - data[index].balPaytAmt; //wrong
              data[index].totalPayments = data[index].cumPayment + data[index].balPaytAmt;
            }
            console.log(data[index]);
          }
        );
      }else{
        console.log('aaaaaa');
        var sub$ = forkJoin(this.accountingService.getAcitArInwPolBal(this.record.tranId, 1),
                            this.accountingService.getAcitSoaDtlNew(this.record.currCd,data[index].policyId, data[index].instNo, null, this.record.payeeNo)).pipe(map(([inw, agingsoa]) => { return { inw, agingsoa}; }));
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
            data[index].netDue = data[index].prevBalance - data[index].balPaytAmt; //wrong
            data[index].totalPayments = data[index].cumPayment + data[index].balPaytAmt;
          }else{
            data[index].premAmt =  Math.round(((agingSoa.balPremDue + inwPolBal.premAmt) * (data[index].balPaytAmt / (agingSoa.balAmtDue + inwPolBal.balPaytAmt))) * 100) / 100;
            data[index].riComm =  Math.round(((agingSoa.balRiComm + inwPolBal.riComm) * (data[index].balPaytAmt / (agingSoa.balAmtDue + inwPolBal.balPaytAmt))) * 100) / 100;
            data[index].riCommVat = Math.round(((agingSoa.balRiCommVat + inwPolBal.riCommVat) * (data[index].balPaytAmt / (agingSoa.balAmtDue + inwPolBal.balPaytAmt))) * 100) / 100;
            data[index].charges = data[index].balPaytAmt - (data[index].premAmt - data[index].riComm - data[index].riCommVat);
            data[index].netDue = data[index].prevBalance - data[index].balPaytAmt; //wrong
            data[index].totalPayments = data[index].cumPayment + data[index].balPaytAmt;
          }
          console.log(data[index]);
        });
      }*/
    }

    //this.passData.tableData = data;
    this.computeTotalBalAndVariance();
    console.log(this.originalValues);
  }

  parseCurrency(data){
    return parseFloat(data.replace(/,/g, ''));
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
      if(i.edited && !i.deleted && i.balPaytAmt > i.prevBalance){
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

  checkNetPayments(){
    this.computeTotalBalAndVariance();
    if(this.totalBal < 0){
      return true;
    }
    return false;
  }

}
