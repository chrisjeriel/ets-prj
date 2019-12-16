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

  /*passData: any = {
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
    widths: [170, 100, 50, 1, 30, 85,110, 110, 110,110,110,110,110,110,110,110,110,110,110,110,],
    keys: ['policyNo', 'coRefNo', 'instNo', 'dueDate', 'currCd', 'currRate', 'prevPremAmt', 'prevRiComm', 'prevRiCommVat', 'prevCharges', 'prevNetDue', 'cumPayment', 'prevBalance','balPaytAmt','premAmt', 'riComm', 'riCommVat', 'charges','totalPayments', 'netDue'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true],
    small: false,
  };*/

  passData: any = {};

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

  isReopen: boolean = false;
  originalNet: number = 0;

  constructor(private titleService: Title, private as: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Inward Policy Balances");
    //call function in accounting.service.ts
    this.passData = this.as.getInwardPolicyKeys('AR');
    //this.passData.pageLength = 'unli';
    //end
    console.log(this.record.payeeNo);
    console.log(this.record.reopenTag);
    this.passLov.payeeNo = this.record.payeeNo;
    this.isReopen = this.record.reopenTag == 'Y';
    if(this.record.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
      this.passData.tHeaderWithColspan= [{header: 'Inward Policy Info', span: 13}, {header: 'Payment Details', span: 5}, {header: '', span: 1}, {header: '', span: 1}];
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
    this.originalNet = 0;
    this.as.getAcitArInwPolBal(this.record.tranId, 1).subscribe( //billId for Inward Policy Balances is always 1
      (data: any)=>{
        if(data.arInwPolBal.length !== 0){
          this.allotedAmt = data.arInwPolBal[0].allotedAmt == null ? this.record.arAmt : data.arInwPolBal[0].allotedAmt;
          setTimeout(()=>{
            $('.alloted').focus().blur();
          }, 0);
          //this.passData.tableData = data.arInwPolBal;
          data.arInwPolBal = data.arInwPolBal.filter(a=>{return a.tranId != null});
          for(var i of data.arInwPolBal){
            this.originalNet += i.balPaytAmt;
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
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  retrieveAgingSoaDtl(){
    this.as.getAcitSoaDtl('','','',this.record.payeeNo).subscribe(
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
      this.passData.tableData[this.passData.tableData.length - 1].balPaytAmt = selected[i].prevBalance;
      this.passData.tableData[this.passData.tableData.length - 1].premAmt = (selected[i].prevBalance/selected[i].prevNetDue) * selected[i].prevPremAmt;
      this.passData.tableData[this.passData.tableData.length - 1].riComm = (selected[i].prevBalance/selected[i].prevNetDue) * selected[i].prevRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].riCommVat = (selected[i].prevBalance/selected[i].prevNetDue) * selected[i].prevRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].charges = (selected[i].prevBalance/selected[i].prevNetDue) * selected[i].prevCharges;
      this.passData.tableData[this.passData.tableData.length - 1].balPaytAmt = selected[i].prevBalance;
      this.passData.tableData[this.passData.tableData.length - 1].totalPayments = selected[i].cumPayment + selected[i].prevBalance;
      this.passData.tableData[this.passData.tableData.length - 1].netDue = 0;
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
    console.log(this.isReopen);
    console.log(this.checkOriginalAmtvsAlteredAmt());
    if(this.checkBalance()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Payment must not be greater than the Balance.';
      this.successDiag.open();
    }/*else if(this.checkVariance()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Total Balance for Selected Policy Transactions must not exceed the AR Amount or Alloted Policy Balance Payments.';
      this.successDiag.open();
    }else if(this.checkAlloted()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Total Balance for Selected Policy Transactions must not exceed the Alloted Policy Balance Payments.';
      this.successDiag.open();
    }*/else if(this.checkNetPayments()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Net payments must be positive.';
      this.successDiag.open();
    }else if(this.isReopen && this.checkOriginalAmtvsAlteredAmt()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Net payments must remain the same.';
      this.successDiag.open();
    }else if(this.canRefund()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Refund must not exceed cumulative payments.';
      this.successDiag.open();
    }/*else if(this.allotedVsArAmt()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Alloted Policy Balance Payments must not exceed the AR Amount.';
      this.successDiag.open();
    }*/else if(this.zeroAmount()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Payment amount must not be zero.';
      this.successDiag.open();
    }/*else if(this.checkPaymentSigns().length !== 0){
      this.dialogIcon = 'error-message';
      this.dialogMessage = this.checkPaymentSigns();
      this.successDiag.open();
    }*/else{
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
          this.savedData[this.savedData.length-1].prevPaytAmt = this.savedData[this.savedData.length-1].cumPayment
          this.savedData[this.savedData.length-1].newPaytAmt = this.savedData[this.savedData.length-1].totalPayments;
          this.savedData[this.savedData.length-1].newBalance = this.savedData[this.savedData.length-1].netDue;
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

    this.as.saveAcitArInwPolBal(params).subscribe(
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
          this.table.markAsPristine();
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
    //let index = 0;
    if(data.key === 'balPaytAmt'){
      /*for(var i = 0; i < this.passData.tableData.length; i++){
        if(data[i].soaNo === this.selected.soaNo){
          index = i;
          break;
        }
      }*/
      /*console.log(data[index].prevPremAmt);
      console.log(data[index].prevRiComm);
      console.log(data[index].prevRiCommVat);
      console.log(data[index].prevCharges);
      console.log(data[index].balPaytAmt);
      console.log(data[index].prevNetDue);*/

      for(var index = 0; index < this.passData.tableData.length; index++){
        data[index].premAmt = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevPremAmt;
        data[index].riComm = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevRiComm;
        data[index].riCommVat = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevRiCommVat;
        data[index].charges = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevCharges;

        data[index].totalPayments = data[index].balPaytAmt + data[index].cumPayment;
        data[index].netDue = data[index].prevNetDue - data[index].totalPayments;
      }
      /*data[index].premAmt = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevPremAmt;
      data[index].riComm = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevRiComm;
      data[index].riCommVat = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevRiCommVat;
      data[index].charges = (data[index].balPaytAmt/data[index].prevNetDue) * data[index].prevCharges;

      data[index].totalPayments = data[index].balPaytAmt + data[index].cumPayment;
      data[index].netDue = data[index].prevNetDue - data[index].totalPayments;*/
      console.log(data);
      /*if(this.selected.add){
        this.as.getAcitSoaDtlNew(this.record.currCd,data[index].policyId, data[index].instNo, null, this.record.payeeNo).subscribe(
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
        var sub$ = forkJoin(this.as.getAcitArInwPolBal(this.record.tranId, 1),
                            this.as.getAcitSoaDtlNew(this.record.currCd,data[index].policyId, data[index].instNo, null, this.record.payeeNo)).pipe(map(([inw, agingsoa]) => { return { inw, agingsoa}; }));
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
  checkPaymentSigns(): string{
    for(var i of this.passData.tableData){
      if(Math.sign(i.prevBalance) == 1 && Math.sign(i.balPaytAmt) == -1){
        return 'Cannot save. Please check your payment for Policy No. ' + i.policyNo + ' with Inst. No ' + i.instNo;
      }else if(Math.sign(i.prevBalance) == -1 && Math.sign(i.balPaytAmt) == 1){
        return 'Cannot save. Please check your payment for Policy No. ' + i.policyNo + ' with Inst. No ' + i.instNo;
      }
    }
    return '';
  }

  checkOriginalAmtvsAlteredAmt(): boolean{
    var newAlteredAmt: number = 0;
    for(var i of this.passData.tableData){
      if(i.deleted){
        newAlteredAmt += i.balPaytAmt;
      }
    }
    console.log('originalAmt => ' + this.originalNet );
    console.log('newAlterAmt => ' + newAlteredAmt);
    return newAlteredAmt != this.originalNet;
  }

  checkVariance(): boolean{
    return this.variance < 0;
  }

  checkBalance(){
    for(var i of this.passData.tableData){
      if(i.edited && !i.deleted &&
        ((i.prevNetDue < 0 && i.balPaytAmt < 0 && i.balPaytAmt < i.prevBalance) ||
          (i.prevNetDue > 0 && i.balPaytAmt > 0 && i.balPaytAmt > i.prevBalance))){  
        console.log(i.prevBalance);
        console.log(i.balPaytAmt)
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

  allotedVsArAmt(){
    console.log(this.record.arAmt);
    if(this.allotedAmt > this.record.arAmt){
      return true;
    }
    return false;
  }

  zeroAmount(){
     for(var i of this.passData.tableData){
       if(i.edited && !i.deleted &&
         (i.balPaytAmt == 0)){
         return true;
       }
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

  canRefund(): boolean{
    for(var i of this.passData.tableData){
      if(i.edited && !i.deleted &&
        (i.prevNetDue < 0 && i.balPaytAmt > 0 && i.balPaytAmt + i.cumPayment > 0) ||
         (i.prevNetDue > 0 && i.balPaytAmt < 0 && i.balPaytAmt + i.cumPayment < 0)){
        /*(i.prevBalance < 0 && i.balPaytAmt + i.cumPayment > 0) ||
         (i.prevBalance > -1 && i.balPaytAmt + i.cumPayment > 0)){*/
        console.log(i.cumPayment);
        console.log(i.balPaytAmt)
        return true;
      }
    }
    return false;
  }

  export(){
        //do something
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'ARDetails_#'+this.record.formattedArNo+'_'+currDate+'.xlsx'
    var rowLength: number = this.passData.tableData.length + 6;
    console.log("Row Length >>>" + rowLength);
    var mystyle = {
        headers:false, 
        column: {style:{Font:{Bold:"1"}}},
        rows: {0:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               2:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               5:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               [rowLength]:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}}}
      };
    console.log(mystyle);

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };

       alasql.fn.currency = function(currency) {
            var parts = parseFloat(currency).toFixed(2).split(".");
            var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
                (parts[1] ? "." + parts[1] : "");
            return num
      };

      alasql.fn.rate = function(rate) {
            var parts = parseFloat(rate).toFixed(10).split(".");
            var num = parts[0].replace(new RegExp(",", "g"),'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num
      };
    var prevPrem = 0;
    var prevRiComm = 0;
    var prevRiCommVat = 0;
    var prevCharges = 0;
    var prevNetDue = 0;
    var prevCumPayt = 0;
    var prevBalance = 0;
    var balPaytAmt = 0;
    var premium = 0;
    var riComm = 0;
    var riCommVat = 0;
    var charges = 0;
    var totalPayments = 0;
    var remainingBal = 0;

    alasql('CREATE TABLE sample(row1 VARCHAR2, row2 VARCHAR2, row3 VARCHAR2, row4 VARCHAR2, row5 VARCHAR2, row6 VARCHAR2, row7 VARCHAR2, row8 VARCHAR2, row9 VARCHAR2, row10 VARCHAR2,'+
                                'row11 VARCHAR2, row12 VARCHAR2, row13 VARCHAR2, row14 VARCHAR2, row15 VARCHAR2, row16 VARCHAR2, row17 VARCHAR2, row18 VARCHAR2, row19 VARCHAR2, row20 VARCHAR2)');
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['AR No', 'AR Date', 'DCB No.', 'Payment Type', 'Amount', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,datetime(?),?,?,?,currency(?),?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.record.formattedArNo, this.record.arDate, this.record.dcbNo, this.record.tranTypeName, this.record.currCd, this.record.arAmt, '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['Payor', '', '', 'Status', 'Local Amount', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,currency(?),?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.record.payor, '','', this.record.arStatDesc, 'PHP', this.record.currRate * this.record.arAmt, '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ["Policy No","Co. Ref. No.", "Inst No.", "Due Date", "Curr","Curr Rate", "Premium", "RI Comm", 'Ri Comm Vat', "Charges", "Net Due", "Cumulative Payments", "Balance",
                'Payment Amount', "Premium", "RI Comm", 'Ri Comm Vat', "Charges", 'Total Payments', 'Remaining Balance']);
    for(var i of this.passData.tableData){
      //totalCredit += i.creditAmt;
      //totalDebit += i.debitAmt;
      prevPrem        += i.prevPremAmt;
      prevRiComm      += i.prevRiComm;
      prevRiCommVat   += i.prevRiCommVat;
      prevCharges     += i.prevCharges;
      prevNetDue      += i.prevNetDue;
      prevCumPayt     += i.cumPayment;
      prevBalance     += i.prevBalance;
      balPaytAmt      += i.balPaytAmt;
      premium         += i.premAmt;
      riComm          += i.riComm;
      riCommVat       += i.riCommVat;
      charges         += i.charges;
      totalPayments   += i.totalPayments;
      remainingBal    += i.netDue;
      alasql('INSERT INTO sample VALUES(?,?,?,datetime(?),?,rate(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?))', [i.policyNo, i.coRefNo == null ? '' : i.coRefNo, i.instNo, i.dueDate, i.currCd, i.currRate, i.prevPremAmt, i.prevRiComm, i.prevRiCommVat, i.prevCharges, i.prevNetDue, i.cumPayment, i.prevBalance,i.balPaytAmt,i.premAmt, i.riComm, i.riCommVat, i.charges,i.totalPayments, i.netDue]);
    }
    //alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?), currency(?))', ["","", "", "", "","TOTAL", prevPrem ,prevRiComm ,prevRiCommVat ,prevCharges ,prevNetDue ,prevCumPayt ,prevBalance ,balPaytAmt ,premium ,riComm ,riCommVat ,charges ,totalPayments ,remainingBal]);
    alasql('SELECT row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13, row14, row15, row16, row17, row18, row19, row20 INTO XLSXML("'+filename+'",?) FROM sample', [mystyle]);
    alasql('DROP TABLE sample');  
  }

}
