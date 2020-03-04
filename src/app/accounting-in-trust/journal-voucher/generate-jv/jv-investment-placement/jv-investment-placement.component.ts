import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-jv-investment-placement',
  templateUrl: './jv-investment-placement.component.html',
  styleUrls: ['./jv-investment-placement.component.css']
})
export class JvInvestmentPlacementComponent implements OnInit {
  
  @Input() jvDetail;
  @Output() infoData = new EventEmitter<any>();
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {
    tableData:[],
    tHeader:['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment'],
    dataTypes:['text','text','text','text','number','text','percent','date','date','text','percent','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt'],
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
      bank : '',
      bankName : '',
      bankAcct : '',
      pulloutType : '',
      currCd : '',
      currRate : '',
      invtAmt : '',
      createUser : this.ns.getCurrentUser(),
      createDate : '',
      updateUser : this.ns.getCurrentUser(),
      updateDate : '',
      showMG: 1
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 'invtAmt' ],
    uneditable: [true, true, true, true, true, true,true, true, true, true, true, true],
    checkFlag: true,
    pageID: 6,
    widths:[140, 150, 127, 130, 90, 83, 85, 1, 1, 1, 85, 120]
  };

  passLov: any = {
    selector: 'acitArInvPullout',
    searchParams: [],
    hide: []
  }

  jvDetails: any = {
    cedingName: '',
    delInvPlacement: [],
    saveInvPlacement:[]
  }

  banks: any[] = [];
  bankAccts : any[] =[];
  forkSub: any;
  selectedBank:any;
  selectedBankCd:any;
  selectedBankAcct:any;
  accountNo:any;
  cancelFlag: boolean = false;
  dialogIcon : any;
  dialogMessage : any;
  disable = true;

  constructor(private ms: MaintenanceService, private ns: NotesService, private accService: AccountingService) { }

  ngOnInit() {
    if(this.jvDetail.statusType == 'N'){
      this.disable = false;
    }else {
      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      this.passData.checkFlag =  false;
      this.passData.btnDisabled = true;
      this.passData.uneditable = [true, true, true, true, true, true,true, true, true, true, true, false];
      this.disable = true;
    }
    this.getBank();
  }

  getBank(){
    this.banks = [];
    this.bankAccts = [];

    /*this.ms.getMtnBank().subscribe((data:any) => {
      for (var i = 0; i < data.bankList.length; ++i) {
        this.banks.push(data.bankList[i]);
      }
      console.log(this.banks)
    });*/

    var join = forkJoin(this.ms.getMtnBank(),
                        this.ms.getMtnBankAcct()).pipe(map(([bank, bankAcct]) => {return {bank, bankAcct}; }));

    this.forkSub = join.subscribe((data: any) =>{
      this.banks = data.bank.bankList;
      this.bankAccts = data.bankAcct.bankAcctList;
      this.retrieveInvPlacement();
    });
  }

  changeBank(data){
    this.passData.tableData = [];
    this.table.refreshTable();
    this.selectedBank = data;
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
    this.accountNo = data.bankAcctCd;
    this.selectedBankAcct = data;
    this.retrieveInvPlacement();
  }

  retrieveInvPlacement(){
    this.accService.getInvPlacement(this.jvDetail.tranId).subscribe((data:any) => {
      var bank, bankAcct;
      this.passData.tableData = [];
      if(data.invPlacement.length !== 0){
        bank     = this.banks.filter(a => { return a.bankCd === data.invPlacement[0].bank});
        bankAcct = this.bankAccts.filter(a => { return a.bankCd === data.invPlacement[0].bank && a.bankAcctCd === data.invPlacement[0].bankAcct});
        this.bankAccts = this.bankAccts.filter(a => { return a.bankCd === data.invPlacement[0].bank});
        this.selectedBank = bank[0];
        this.selectedBankCd = this.selectedBank.bankCd;
        this.selectedBankAcct = bankAcct[0];
        //this.accountNo =  this.selectedBankAcct.bankAcctCd;


        for (var i = 0; i < data.invPlacement.length; i++) {
          if(data.invPlacement[i].bank === this.selectedBankCd /*&& data.invPlacement[i].bankAcct === this.accountNo*/){
            this.passData.tableData.push(data.invPlacement[i]);
          }
        }
      }
      
      this.table.refreshTable();
    });
  }

  openInvLOV(data){
    this.passLov.searchParams = [{key: 'bankCd', search: this.selectedBankCd}, {key:'invtStatus', search: 'F%'}];
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtCode});
    this.lovMdl.openLOV();
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  setSelectedData(data){
    let selected = data.data;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < selected.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].tranId = this.jvDetail.tranId;
      this.passData.tableData[this.passData.tableData.length - 1].itemNo = null;
      this.passData.tableData[this.passData.tableData.length - 1].invtId = selected[i].invtId;
      this.passData.tableData[this.passData.tableData.length - 1].invtCode = selected[i].invtCd;
      this.passData.tableData[this.passData.tableData.length - 1].certNo = selected[i].certNo;
      this.passData.tableData[this.passData.tableData.length - 1].invtType = selected[i].invtType;
      this.passData.tableData[this.passData.tableData.length - 1].invtTypeDesc = selected[i].invtTypeDesc;
      this.passData.tableData[this.passData.tableData.length - 1].invtSecCd = selected[i].invtSecCd;
      this.passData.tableData[this.passData.tableData.length - 1].securityDesc = selected[i].securityDesc;
      this.passData.tableData[this.passData.tableData.length - 1].maturityPeriod = selected[i].matPeriod;
      this.passData.tableData[this.passData.tableData.length - 1].durationUnit = selected[i].durUnit;
      this.passData.tableData[this.passData.tableData.length - 1].interestRate = selected[i].intRt;
      this.passData.tableData[this.passData.tableData.length - 1].purchasedDate = selected[i].purDate;
      this.passData.tableData[this.passData.tableData.length - 1].maturityDate = selected[i].matDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd = selected[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = selected[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].invtAmt = selected[i].invtAmt;
    }
    this.table.refreshTable();
  }

  prepareData(){
    this.jvDetails.delInvPlacement = [];
    this.jvDetails.saveInvPlacement = [];

    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(!this.passData.tableData[i].deleted){
        this.jvDetails.saveInvPlacement.push(this.passData.tableData[i]);
        this.jvDetails.saveInvPlacement[this.jvDetails.saveInvPlacement.length - 1].bank = this.selectedBankCd;
        this.jvDetails.saveInvPlacement[this.jvDetails.saveInvPlacement.length - 1].bankAcct = '';
        this.jvDetails.saveInvPlacement[this.jvDetails.saveInvPlacement.length - 1].createDate = this.ns.toDateTimeString(0);
        this.jvDetails.saveInvPlacement[this.jvDetails.saveInvPlacement.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passData.tableData[i].deleted){
        this.jvDetails.delInvPlacement.push(this.passData.tableData[i]);
      }
    }
    this.jvDetails.tranId = this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    this.accService.saveInvPlacement(this.jvDetails).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveInvPlacement();
      }
    })
  }

  onRowClick(data){
    this.infoData.emit(data)
  }
}
