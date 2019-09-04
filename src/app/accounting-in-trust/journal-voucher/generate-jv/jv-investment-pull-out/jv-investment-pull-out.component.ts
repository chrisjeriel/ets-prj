import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-jv-investment-pull-out',
  templateUrl: './jv-investment-pull-out.component.html',
  styleUrls: ['./jv-investment-pull-out.component.css']
})
export class JvInvestmentPullOutComponent implements OnInit {
  
  @Input() jvDetail;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;

  passData: any = {
    tableData:[],
    tHeader:['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value'],
    dataTypes:['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','maturityValue'],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true,
    magnifyingGlass: ['invtCode'],
    nData: {
      tranId : '',
      itemNo : '',
      invtId : '',
      invtCode : '',
      certNo : '',
      invtType : '',
      invtTypeDesc : '',
      invtSecCd : '',
      securityDesc : '',
      maturityPeriod : '',
      durationUnit : '',
      interestRate : '',
      purchasedDate : '',
      maturityDate : '',
      destInvtId : '',
      bank : '',
      bankName : '',
      bankAcct : '',
      pulloutType : '',
      currCd : '',
      currRate : '',
      invtAmt : '',
      incomeAmt : '',
      bankCharge : '',
      whtaxAmt : '',
      maturityValue : '',
      localAmt : '',
      createUser : this.ns.getCurrentUser(),
      createDate : '',
      updateUser : this.ns.getCurrentUser(),
      updateDate : '',
      showMG: 1
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 
           'invtAmt' , 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue'],
    uneditable: [false, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true ],
    checkFlag: true,
    pageID: 6,
    widths:[140, 150, 127, 130, 90, 83, 85, 1, 1, 1, 85, 120, 120, 120, 120, 120, 120]
  };

  passLov: any = {
    selector: 'acitArInvPullout',
    searchParams: [],
    hide: []
  }

  jvDetails:any = {
    saveInvPullOut : [],
    delInvPullOut: []
  }

  banks: any[] = [];
  bankAccts : any[] =[];
  forkSub: any;
  selectedBank:any;
  selectedBankCd:any;
  selectedBankAcct:any;
  accountNo:any;
  dialogIcon : any;
  dialogMessage : any;

  constructor(private ms: MaintenanceService, private ns: NotesService, private accService: AccountingService) { }

  ngOnInit() {
    //this.getInvPullout();
    this.getBank();
    //this.getInvPullout();
  }

  getBank(){
    this.banks = [];
    this.bankAccts = [];

    this.ms.getMtnBank().subscribe((data:any) => {
      for (var i = 0; i < data.bankList.length; ++i) {
        this.banks.push(data.bankList[i]);
      }
      console.log(this.banks)
    });
  }

  //   var sub$ = forkJoin(this.ms.getMtnBank(),
  //                       this.ms.getMtnBankAcct()).pipe(map(([bank, bankAcct]) => { return {bank, bankAcct }; }));

  //   this.forkSub = sub$.subscribe((data:any) =>{

      

  //     for (var j = 0; j < data.bankAcct.bankAcctList.length; j++) {
  //       this.bankAccts.push( data.bankAcct.bankAcctList[j]);
  //     }

  //   });
  // }

  changeBank(data){
    this.passData.tableData = [];
    this.table.refreshTable();
    //this.selectedBank = data;
    this.selectedBankCd = data.bankCd;
    this.getBankAcct();
  }

  getBankAcct(){
    this.bankAccts = [];
    this.ms.getMtnBankAcct(this.selectedBankCd).subscribe((data:any)=>{
      if(data.bankAcctList.length !== 0){
        this.bankAccts = data.bankAcctList;
        this.bankAccts = this.bankAccts.filter(a=>{return a.bankCd == this.selectedBankCd && a.currCd == this.jvDetail.currCd && a.acSeGlDepNo === null && a.acItGlDepNo !== null });
      }
    });
  }

  changeBankAcct(data){
    console.log(data)
    this.accountNo = data.bankAcctCd;
    this.getInvPullout();
  }

  getInvPullout(){
    this.accService.getJvInvPullout(this.jvDetail.tranId/*,this.selectedBankCd,this.accountNo*/).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      if(data.pullOut.length !== 0){
        /*this.selectedBank = data.pullOut[0];
        this.selectedBankAcct = data.pullOut[0];*/
        for (var i = 0; i < data.pullOut.length; i++) {
          this.passData.tableData.push(data.pullOut[i]);
        }
      }
      this.table.refreshTable();
    });
  }

  /*compareBankFn(c1: any, c2: any): boolean {
      return c1.bank === c2.bankCd;
  }*/

  openInvPulloutLOV(){
    this.passLov.searchParams = [{key: 'bankCd', search: this.selectedBankCd}, {key:'invtStatus', search: 'MATURED'}];
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtCode});
    this.lovMdl.openLOV();
  }

  setSelectedData(data){
    console.log(data)
    let selected = data.data;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < selected.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].tranId = this.jvDetail.tranId; 
      this.passData.tableData[this.passData.tableData.length - 1].invtId = selected[i].invtId; 
      this.passData.tableData[this.passData.tableData.length - 1].invtCode = selected[i].invtCd; 
      this.passData.tableData[this.passData.tableData.length - 1].certNo = selected[i].certNo;
      this.passData.tableData[this.passData.tableData.length - 1].invtType = selected[i].invtType;
      this.passData.tableData[this.passData.tableData.length - 1].invtTypeDesc = selected[i].invtTypeDesc;
      this.passData.tableData[this.passData.tableData.length - 1].invtSecCd = selected[i].invtSecCd;
      this.passData.tableData[this.passData.tableData.length - 1].securityDesc = selected[i].securityDesc;
      this.passData.tableData[this.passData.tableData.length - 1].maturityPeriod = selected[i].matPeriod;
      this.passData.tableData[this.passData.tableData.length - 1].durationUnit = selected[i].durUnit;
      this.passData.tableData[this.passData.tableData.length - 1].purchasedDate = selected[i].purDate;
      this.passData.tableData[this.passData.tableData.length - 1].maturityDate = selected[i].matDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd = selected[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = selected[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].interestRate = selected[i].intRt;
      this.passData.tableData[this.passData.tableData.length - 1].invtAmt = selected[i].invtAmt;
      this.passData.tableData[this.passData.tableData.length - 1].incomeAmt = selected[i].incomeAmt;
      this.passData.tableData[this.passData.tableData.length - 1].bankCharge = selected[i].bankCharge;
      this.passData.tableData[this.passData.tableData.length - 1].whtaxAmt = selected[i].whtaxAmt;
      this.passData.tableData[this.passData.tableData.length - 1].maturityValue = selected[i].matVal;
      this.passData.tableData[this.passData.tableData.length - 1].localAmt = selected[i].matVal * this.jvDetail.currRate;
      this.passData.tableData[this.passData.tableData.length - 1].pulloutType = 'F';
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['invtCode'];
    }
    this.table.refreshTable();
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  prepareData(){
    this.jvDetails.saveInvPullOut = [];
    this.jvDetails.delInvPullOut = [];

    for (var i = 0; i < this.passData.tableData.length; i++) {
      if (this.passData.tableData[i].edited && !this.passData.tableData[i].deleted) {
        this.jvDetails.saveInvPullOut.push(this.passData.tableData[i]);
        this.jvDetails.saveInvPullOut[this.jvDetails.saveInvPullOut.length - 1].bank       = this.selectedBankCd;
        this.jvDetails.saveInvPullOut[this.jvDetails.saveInvPullOut.length - 1].bankAcct   = this.accountNo;
        this.jvDetails.saveInvPullOut[this.jvDetails.saveInvPullOut.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
        this.jvDetails.saveInvPullOut[this.jvDetails.saveInvPullOut.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
      }

      if(this.passData.tableData[i].deleted){
        this.jvDetails.delInvPullOut.push(this.passData.tableData[i]);
      }
    }
  }

  saveInvPullOut(){
    this.prepareData();

    this.accService.saveInvPullOut(this.jvDetails).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.getInvPullout();
      }
    });
  }

  cancel(){
    this.prepareData();
    console.log(this.jvDetails);
  }
}