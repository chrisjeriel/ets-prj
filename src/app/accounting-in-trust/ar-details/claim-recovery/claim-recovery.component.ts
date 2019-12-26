import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
@Component({
  selector: 'app-claim-recovery',
  templateUrl: './claim-recovery.component.html',
  styleUrls: ['./claim-recovery.component.css']
})
export class ClaimRecoveryComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(ModalComponent) netMdl: ModalComponent;
  @Input() record: any = {};

  @Output() emitCreateUpdate: EventEmitter<any> = new EventEmitter();

  passData: any = {
    tableData: [],
    tHeaderWithColspan: [{header:'', span:1},{header: 'Claim Information', span: 11}, {header: '', span: 2}],
    tHeader: ['Claim No', 'Hist No', 'Hist Category', 'Hist Type', 'Payment For', 'Insured', 'Ex Gratia', 'Curr', 'Curr Rate', 'Hist Amount', 'Cumulative Payment', 'Payment Amount', 'Payment Amount Local'],
    dataTypes: ["text", "number", "text", "text","text","text", "checkbox", "text", "percent", "currency", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    checkFlag: true,
    magnifyingGlass: ['claimNo'],
    pageLength: 10,
    nData: {
        tranId: '',
        billId: '',
        itemNo: '',
        projId: '',
        claimId: '',
        claimNo: '',
        exGratia: '',
        insuredDesc: '',
        histNo: '',
        histCategory: '',
        histCategoryDesc: '',
        histType: '',
        histTypeDesc: '',
        paymentFor: '',
        reserveAmt: '',
        paytAmt: '',
        policyNo: '',
        coClmNo: '',
        lossDate: '',
        currCd: '',
        currRate: '',
        recOverAmt: '',
        localAmt: '',
        showMG: 1
    },
    total: [null,null,null,null,null,null,null,null, 'Total', 'reserveAmt', 'cumulativeAmt', 'recOverAmt', 'localAmt'],
    widths: [100,1,1,1, 150, 250, 1,1, 100, 120, 120, 120, 120, 120],
    keys: ['claimNo', 'histNo', 'histCategoryDesc', 'histTypeDesc', 'paymentFor', 'insuredDesc', 'exGratia', 'currCd', 'currRate', 'reserveAmt', 'cumulativeAmt', 'recOverAmt', 'localAmt'],
    //pinKeysLeft: ['claimNo', 'histNo', 'histCategoryDesc', 'histTypeDesc', 'paymentFor', 'insuredDesc', 'exGratia', 'currCd', 'currRate', 'reserveAmt', 'cumulativeAmt'],
    uneditable: [false,true,true,true,false,true,true,true, true, true,true,true, true],
    //small: true
  };

  passLov: any = {
    selector: 'acitArClmRecover',
    payeeNo: '',
    currCd: '',
    hide: []
  }

  cancelFlag: boolean;

  totalLocalAmt: number = 0;
  clmCashCallIndex: number = 0;

  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];

  isReopen: boolean = false;
  originalNet: number = 0;
  newAlteredAmt: number = 0;

  constructor(private titleService: Title, private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Claim Recovery / Overpayment");
    this.isReopen = this.record.reopenTag == 'Y';
    console.log(this.record.payeeNo);
    this.passLov.payeeNo = this.record.payeeNo;
    if(this.record.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true,true,true,true,true,true,true,true, true, true,true,true, true];
      this.passData.tHeaderWithColspan= [{header: 'Claim Information', span: 11}, {header: '', span: 2}];
      this.passData.addFlag = false;
      this.passData.deleteFlag =  false;
      this.passData.checkFlag = false;
    }
    this.retrieveClmRecover();

  }

  openClmCashCallLov(data){
    this.passLov.payeeNo = this.record.payeeNo;
    this.passLov.currCd = this.record.currCd;
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return JSON.stringify({claimId: a.claimId, histNo: a.histNo})});
    console.log(this.passLov.hide);
    this.clmCashCallIndex = data.index;
    this.lovMdl.openLOV();
  }

  retrieveClmRecover(){
    this.passData.tableData = [];
    //this.accountingService.getAcitArClmCashCall(this.record.tranId, 1).subscribe( //billId for Claim Cash Call is always 1
    this.accountingService.getAcitArClmRecover(this.record.tranId, 1).subscribe( //billId for Claim Cash Call is always 1
      (data: any)=>{
        if(data.arClmRecover.length !== 0){
          /*for(var i of data.arClmRecover){
            i.currCd = i.currCd+'T'+i.currRate;
            i.uneditable = ['paytType', 'claimNo'];
            this.passData.tableData.push(i);
          }*/
          for(var i of data.arClmRecover){
            this.originalNet += i.recOverAmt;
          }
          this.passData.tableData = data.arClmRecover;
          this.table.refreshTable();
        }
      }
    );
  }

  setSelectedData(data){
    let selected = data.data;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < selected.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].projId = selected[i].projId;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = selected[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].claimNo = selected[i].claimNo;
      this.passData.tableData[this.passData.tableData.length - 1].claimId = selected[i].claimId;
      this.passData.tableData[this.passData.tableData.length - 1].insuredDesc = selected[i].insuredDesc;
      this.passData.tableData[this.passData.tableData.length - 1].lossDate = selected[i].lossDate;
      this.passData.tableData[this.passData.tableData.length - 1].histNo = selected[i].histNo;
      this.passData.tableData[this.passData.tableData.length - 1].histCategory = selected[i].histCategory;
      this.passData.tableData[this.passData.tableData.length - 1].histCategoryDesc = selected[i].histCategoryDesc;
      this.passData.tableData[this.passData.tableData.length - 1].histType = selected[i].histType;
      this.passData.tableData[this.passData.tableData.length - 1].histTypeDesc = selected[i].histTypeDesc;
      this.passData.tableData[this.passData.tableData.length - 1].exGratia = selected[i].exGratia;
      this.passData.tableData[this.passData.tableData.length - 1].reserveAmt = selected[i].reserveAmt;
      this.passData.tableData[this.passData.tableData.length - 1].cumulativeAmt = selected[i].cumulativeAmt;
      this.passData.tableData[this.passData.tableData.length - 1].currCd = selected[i].currencyCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = selected[i].currencyRt;
      this.passData.tableData[this.passData.tableData.length - 1].recOverAmt = selected[i].reserveAmt - selected[i].cumulativeAmt;
      this.passData.tableData[this.passData.tableData.length - 1].localAmt = (selected[i].reserveAmt - selected[i].cumulativeAmt) * selected[i].currencyRt;
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['claimNo'];
    }
    this.table.refreshTable();
  }

  onClickSave(cancel?){
    if(this.record.dcbStatus == 'C' || this.record.dcbStatus == 'T'){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'A.R. cannot be saved. DCB No. is '; 
      this.dialogMessage += this.record.dcbStatus == 'T' ? 'temporarily closed.' : 'closed.';
      this.successDiag.open();
    }else if(this.reserveCheck()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Payment amount must not exceed the Hist Amount';
      this.successDiag.open();
    }else if(this.isReopen && this.checkOriginalAmtvsAlteredAmt()){
      this.netMdl.openNoClose();
    }/*else if(this.canRefund()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Refund must not exceed cumulative payments.';
      this.successDiag.open();
    }*//*else if(this.netPaymentsCheck()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Net payments must be positive.';
      this.successDiag.open();
    }*/else{
      if(cancel != undefined){
        this.save(cancel);
      }else{
        this.confirm.confirmModal();
      }
    }
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    //prepare params from table
    this.savedData = [];
    this.deletedData = [];
    this.totalLocalAmt = 0;
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(!this.passData.tableData[i].deleted){
        this.totalLocalAmt += this.passData.tableData[i].localAmt;
      }
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].tranId = this.record.tranId;
          this.savedData[this.savedData.length-1].billId = 1; //1 for Claim Cash Call
          this.savedData[this.savedData.length-1].exGratia = this.savedData[this.savedData.length-1].exGratia === null ? 'N' : this.savedData[this.savedData.length-1].exGratia;
          this.savedData[this.savedData.length-1].currCd = this.savedData[this.savedData.length-1].currCd.split('T')[0];
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
         this.deletedData[this.deletedData.length-1].billId = 1; //1 for Claim Cash Call
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Claim Cash Call
      billType: this.record.tranTypeCd,
      totalLocalAmt: this.totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveClmRecover: this.savedData,
      delClmRecover: this.deletedData
    }
    console.log(params);

    //this.accountingService.saveAcitArClmCashCall(params).subscribe(
    this.accountingService.saveAcitArClmRecover(params).subscribe(
      (data:any)=>{
       if(data.returnCode === -1){
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveClmRecover();
          this.table.markAsPristine();
        }else if(data.returnCode === 0 && data.custReturnCode !== 2){
          this.dialogIcon = 'error';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }else if(data.returnCode === 0 && data.custReturnCode === 2){
          this.dialogIcon = 'error-message';
          //this.dialogMessage = 'Total Amount of Claim Cash Call Payments must not exceed the AR Amount.';
          this.dialogMessage = 'Total Amount of Recoveries/Overpayment must not exceed the AR Amount.';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
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
      data.updateDate = this.ns.toDateTimeString(data.updateDate);
      data.createDate = this.ns.toDateTimeString(data.createDate);
      this.emitCreateUpdate.emit(data);
    }else{
      this.emitCreateUpdate.emit(null);
    }
  }
  onTableDataChange(data){
    if(data.key === 'recOverAmt'){
      for(var i = 0; i < data.length; i++){
        data[i].localAmt = data[i].recOverAmt * data[i].currRate;
      }
    }
    this.passData.tableData = data;
    this.table.refreshTable();
  }

  //ALL VALIDATIONS STARTS HERE

  checkOriginalAmtvsAlteredAmt(): boolean{
    this.newAlteredAmt = 0;
    for(var i of this.passData.tableData){
      if(!i.deleted){
        this.newAlteredAmt += i.currAmt;
      }
    }
    console.log('originalAmt => ' + this.originalNet );
    console.log('newAlterAmt => ' + this.newAlteredAmt);
    return this.newAlteredAmt != this.originalNet;
  }

  reserveCheck(): boolean{
    for(var i of this.passData.tableData){
      if(i.edited && !i.deleted && 
        ((i.reserveAmt < 0 && i.recOverAmt < 0 && i.recOverAmt < i.reserveAmt - i.cumulativeAmt) ||
          (i.reserveAmt > 0 && i.recOverAmt > 0 && i.recOverAmt > i.reserveAmt - i.cumulativeAmt))){  
        /*(i.reserveAmt > 0 && i.reserveAmt - i.cumulativeAmt < i.localAmt) ||
        (i.reserveAmt < 0 && i.reserveAmt - i.cumulativeAmt > i.localAmt)){*/
        return true;
      }
    }
    return false;
  }

  canRefund(): boolean{
    for(var i of this.passData.tableData){
      if(i.edited && !i.deleted &&
        (i.reserveAmt < 0 && i.localAmt + i.cumulativeAmt > 0) ||
         (i.reserveAmt > -1 && i.localAmt + i.cumulativeAmt < 0)){
        console.log(i);
        return true;
      }
    }
    return false;
  }

  netPaymentsCheck(): boolean {
    let netPayments: number = 0;
    for(var i of this.passData.tableData){
      if(i.edited && !i.deleted){
        netPayments += i.localAmt;
      }
    }
    if(netPayments < 0){
      return true;
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
    var filename = 'ARDetails_#'+this.record.formattedArNo+'_'+currDate+'.xls'
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
     var reserveAmt    = 0;
     var cumulativeAmt = 0;
     var recOverAmt    = 0;
     var localAmt      = 0;

    alasql('CREATE TABLE sample(row1 VARCHAR2, row2 VARCHAR2, row3 VARCHAR2, row4 VARCHAR2, row5 VARCHAR2, row6 VARCHAR2, row7 VARCHAR2, row8 VARCHAR2, row9 VARCHAR2, row10 VARCHAR2,'+
                                'row11 VARCHAR2, row12 VARCHAR2, row13 VARCHAR2)');
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ['AR No', 'AR Date', 'DCB No.', 'Payment Type', 'Amount', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,datetime(?),?,?,?,currency(?),?,?,?,?,?,?,?)', [this.record.formattedArNo, this.record.arDate, this.record.dcbNo, this.record.tranTypeName, this.record.currCd, this.record.arAmt, '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ['Payor', '', '', 'Status', 'Local Amount', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.record.payor, '','', this.record.arStatDesc, 'PHP', this.record.currRate * this.record.arAmt, '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', ['Claim No', 'Hist No', 'Hist Category', 'Hist Type', 'Payment For', 'Insured', 'Ex Gratia', 'Curr', 'Curr Rate', 'Hist Amount', 'Cumulative Payment', 'Payment Amount', 'Payment Amount Local']);
    for(var i of this.passData.tableData){
      //totalCredit += i.creditAmt;
      //totalDebit += i.debitAmt;
    reserveAmt    += i.reserveAmt;
    cumulativeAmt += i.cumulativeAmt;
    recOverAmt    += i.recOverAmt;
    localAmt      += i.localAmt;
      alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?, currency(?), currency(?), currency(?), currency(?), currency(?))', [i.claimNo, i.histNo, i.histCategoryDesc, i.histTypeDesc, i.paymentFor == null ? '' : i.paymentFor, i.insuredDesc, i.exGratia == null ? 'N' : i.exGratia, i.currCd, i.currRate, i.reserveAmt, i.cumulativeAmt, i.recOverAmt, i.localAmt]);
    }
    //alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?, currency(?), currency(?), currency(?), currency(?))', ['','','','','','','','', 'Total', reserveAmt, cumulativeAmt, recOverAmt, localAmt]);
    alasql('SELECT row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13 INTO XLSXML("'+filename+'",?) FROM sample', [mystyle]);
    alasql('DROP TABLE sample');  
  }

}
