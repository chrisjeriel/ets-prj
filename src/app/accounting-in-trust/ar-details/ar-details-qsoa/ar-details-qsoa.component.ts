import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common'
import { AccARInvestments } from '@app/_models';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-ar-details-qsoa',
  templateUrl: './ar-details-qsoa.component.html',
  styleUrls: ['./ar-details-qsoa.component.css'],
  providers: [DatePipe]
})
export class ArDetailsQsoaComponent implements OnInit {

  @Input() record: any = {};

  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  //@ViewChild(QuarterEndingLovComponent) lovMdl: QuarterEndingLovComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(ModalComponent) netMdl: ModalComponent;
  @Output() emitCreateUpdate: EventEmitter<any> = new EventEmitter();
  
 /* passData: any = {
    tableData:[],
    tHeader:['Quarter Ending','Currency','Currency Rate','Amount', 'Amount (PHP)'],
    dataTypes:['date','text','percent','currency','currency'],
    total:[null,null,'Total','balPaytAmt','localAmt'],
    uneditable: [true,true,true,false,true],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true,
    magnifyingGlass: ['quarterEnding'],
    nData: {
      tranId: '',
      billId: 1,
      itemNo: '',
      qsoaId: '',
      quarterEnding: '',
      currCd: '',
      currRate: '',
      balPaytAmt: 0,
      localAmt: 0,
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
      showMG: 1
    },
    keys: ['quarterEnding', 'currCd', 'currRate', 'balPaytAmt', 'localAmt'],
    checkFlag: true,
    pageID: 'negtrty',
    widths:[150, 100, 150, 'auto', 'auto'],
    opts: [
      {
        selector: 'currCd',
        vals: [],
        prev: []
      }
    ]
  }*/

  passData: any = {};

  cancelFlag: boolean;
  totalLocalAmt: number = 0;
  quarterEndingIndex: number = 0;
  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];

  currencyArray: any[] = [];

  quarterEndingDates: string [] = [];

  passLov: any = {
    selector: 'osQsoa',
    params: {},
    hide: []
  }

  isReopen: boolean = false;
  originalNet: number = 0;
  newAlteredAmt: number = 0;

  constructor(private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService, private dp: DatePipe) { }

  ngOnInit() {
    this.passData = this.accountingService.getTreatyKeys('AR');
    this.passData.nData.tranId = this.record.tranId;
    this.passData.nData.currCd = this.record.currCd;
    this.passData.nData.currRate = this.record.currRate;
    this.isReopen = this.record.reopenTag == 'Y';
    //this.getMtnCurrency();
    if(this.record.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true, true, true, true, true, true, true, true, true, true ];
      this.passData.tHeaderWithColspan = [{header:'QSOA Details', span: 6},{header: 'Payment Details', span: 2}, {header: 'Summary of Payments', span: 2}];
      this.passData.addFlag = false;
      this.passData.deleteFlag =  false;
      this.passData.checkFlag = false;
    }
    this.retrieveNegTrtyBal();
  }

  retrieveNegTrtyBal(){
    this.passData.tableData = [];

    this.accountingService.getAcitArNegTrtyBal(this.record.tranId, 1).subscribe(  //Bill Id is always 1 for Negative Treaty balance
      (data: any)=>{
        for(var i of data.negTrtyBalList){
          i.showMG = 0;
          i.uneditable = ['quarterEnding'];
          this.originalNet += i.balPaytAmt;
          i.quarterEnding = this.dp.transform(i.quarterEnding, 'MM/dd/yyyy');
          this.passData.tableData.push(i);
        }
        this.quarterEndingDates = this.passData.tableData.map(a=>{ return this.ns.toDateTimeString(a.quarterEnding);});
        //this.passData.tableData = data.negTrtyBalList;
        this.table.refreshTable();
      }
    );
  }

  openLOV(event){
    this.quarterEndingIndex = event.index;
    this.passLov.params.cedingId = this.record.payeeNo;
    this.passLov.params.currCd = this.record.currCd;
    this.lovMdl.modal.openNoClose();
  }

  setSelectedData(data){
    let selected = data.data;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < selected.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].qsoaId = selected[i].qsoaId; 
      this.passData.tableData[this.passData.tableData.length - 1].netQsoaAmt = selected[i].netQsoaAmt; 
      this.passData.tableData[this.passData.tableData.length - 1].prevPaytAmt = selected[i].cumPayt;
      this.passData.tableData[this.passData.tableData.length - 1].prevBalance = selected[i].remainingBal; 
      this.passData.tableData[this.passData.tableData.length - 1].balPaytAmt = selected[i].remainingBal; 
      this.passData.tableData[this.passData.tableData.length - 1].localAmt = selected[i].remainingBal * this.record.currRate;
      this.passData.tableData[this.passData.tableData.length - 1].newPaytAmt = (parseFloat(selected[i].remainingBal) + parseFloat(selected[i].cumPayt)).toFixed(2);
      this.passData.tableData[this.passData.tableData.length - 1].newBalance = 0;
      this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = this.dp.transform(selected[i].quarterEnding, 'MM/dd/yyyy');
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
    }
    this.table.refreshTable();
    //this.passData.tableData[this.quarterEndingIndex].quarterEnding = data.data.quart;//this.dp.transform(this.ns.toDateTimeString(data).split('T')[0], 'MM/dd/yyyy');
    //this.passData.tableData[this.quarterEndingIndex].showMG = 0;
    //this.quarterEndingDates = this.passData.tableData.map(a=>{ return this.ns.toDateTimeString(a.quarterEnding);});
    //this.passData.tableData[this.quarterEndingIndex].uneditable = ['quarterEnding'];
  }

  onClickSave(cancel?){
    if(this.record.dcbStatus == 'C' || this.record.dcbStatus == 'T'){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'A.R. cannot be saved. DCB No. is '; 
      this.dialogMessage += this.record.dcbStatus == 'T' ? 'temporarily closed.' : 'closed.';
      this.successDiag.open();
    }else if(!this.checkIfNegativeTotal()){
      this.dialogIcon = 'info';
      this.dialogMessage = 'Total Amount must be negative.';
      this.successDiag.open();
    }else if(this.remainingBalvsPaytAmt()){
      this.dialogIcon = 'info';
      this.dialogMessage = 'Payment amount must not be greater than the Balance.';
      this.successDiag.open();
    }else if(this.isReopen && this.checkOriginalAmtvsAlteredAmt()){
        this.netMdl.openNoClose();
    }else{
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
          this.savedData[this.savedData.length-1].billId = 1; //1 for for Negative Treaty Balance
          this.savedData[this.savedData.length-1].quarterEnding = this.ns.toDateTimeString(this.savedData[this.savedData.length-1].quarterEnding);
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
         this.deletedData[this.deletedData.length-1].billId = 1; //1 for Negative Treaty Balance
         this.deletedData[this.deletedData.length-1].quarterEnding = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].quarterEnding);
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Negative Treaty Balance
      billType: this.record.tranTypeCd,
      totalLocalAmt: this.totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveNegTrtyBal: this.savedData,
      delNegTrtyBal: this.deletedData
    }

    this.accountingService.saveAcitArNegTrtyBal(params).subscribe(
      (data:any)=>{
       if(data.returnCode === -1){
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveNegTrtyBal();
          this.table.markAsPristine();
        }else if(data.returnCode === 0 && data.custReturnCode !== 2){
          this.dialogIcon = 'error';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }else if(data.returnCode === 0 && data.custReturnCode === 2){
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'The absolute value of the Total Amount of Treaty Balances must not exceed the AR Amount.';
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
    if(data.key === 'currCd'){
      for(var i = 0; i < this.passData.tableData.length; i++){
        for(var j = 0; j < this.currencyArray.length; j++){
          if(data[i].currCd == this.currencyArray[j].currCd){
            data[i].currRate = this.currencyArray[j].currRate;
            break;
          }
        }
      }
    }

    if(data.key === 'balPaytAmt' || data.key === 'currCd' || data.key === 'currRate'){
      for(var i = 0; i < this.passData.tableData.length; i++){
        data[i].localAmt = data[i].balPaytAmt * data[i].currRate;
        //(parseFloat(selected[i].remainingBal) + parseFloat(selected[i].cumPayt)).toFixed(2);
        data[i].newPaytAmt = +(parseFloat(data[i].prevPaytAmt) + parseFloat(data[i].balPaytAmt)).toFixed(2);
        data[i].newBalance = +(parseFloat(data[i].prevBalance) - parseFloat(data[i].balPaytAmt)).toFixed(2);
      }
    }else if(data.key === 'quarterEnding'){
      //validation about non duplicate quarter ending here
      this.quarterEndingDates = this.passData.tableData.map(a=>{ return this.ns.toDateTimeString(a.quarterEnding);});
    }
  }

  //All maintenance retrievals here
  getMtnCurrency(){
    this.currencyArray = [];
    this.ms.getMtnCurrency('','Y').subscribe(
      (data: any)=>{
        for(var i of data.currency){
          this.passData.opts[0].vals.push(i.currencyCd);
          this.passData.opts[0].prev.push(i.currencyCd);
          this.currencyArray.push({currCd: i.currencyCd, currRate: i.currencyRt});
        }
      }
    );
  }

  //ALL VALIDATIONS HERE

  checkIfNegativeTotal(): boolean{
    var amt:number = 0;
    var localAmt:number = 0;
    for(var i of this.passData.tableData){
      amt += i.balPaytAmt;
      localAmt += i.localAmt;
    }
    if(amt < 0 && localAmt < 0){
      return true;
    }else{
      return false;
    }
  }

  remainingBalvsPaytAmt(): boolean{
    for(var i of this.passData.tableData){
      if(Math.abs(i.prevBalance) < Math.abs(i.balPaytAmt)){
        return true;
      }
    }
    return false;
  }

  checkOriginalAmtvsAlteredAmt(): boolean{
    this.newAlteredAmt = 0;
    for(var i of this.passData.tableData){
      if(!i.deleted){
        this.newAlteredAmt += i.balPaytAmt;
      }
    }
    return this.newAlteredAmt != this.originalNet;
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
    var mystyle = {
        headers:false, 
        column: {style:{Font:{Bold:"1"}}},
        rows: {0:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               2:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               5:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               [rowLength]:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}}}
      };

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

     var netQsoaAmt    = 0;
     var prevPaytAmt   = 0;
     var prevBalance   = 0;
     var balPaytAmt    = 0;
     var localAmt      = 0;
     var newPaytAmt    = 0;
     var newBalance    = 0;

    alasql('CREATE TABLE sample(row1 VARCHAR2, row2 VARCHAR2, row3 VARCHAR2, row4 VARCHAR2, row5 VARCHAR2, row6 VARCHAR2, row7 VARCHAR2, row8 VARCHAR2, row9 VARCHAR2, row10 VARCHAR2)');
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?,?)', ['AR No', 'AR Date', 'DCB No.', 'Payment Type', 'Amount', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,datetime(?),?,?,?,currency(?),?,?,?,?)', [this.record.formattedArNo, this.record.arDate, this.record.dcbNo, this.record.tranTypeName, this.record.currCd, this.record.arAmt, '', '', '', '']);
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?,?)', ['Payor', '', '', 'Status', 'Local Amount', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?)', [this.record.payor, '','', this.record.arStatDesc, 'PHP', this.record.currRate * this.record.arAmt, '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?)', ['Quarter Ending', 'Currency', 'Currency Rate','Net Due','Cumulative Payments','Balance', 'Payment Amount', 'Payment Amount(PHP)', 'Total Payments', 'Remaining Balance']);
    for(var i of this.passData.tableData){
      netQsoaAmt    += i.netQsoaAmt;
      prevPaytAmt   += i.prevPaytAmt;
      prevBalance   += i.prevBalance;
      balPaytAmt    += i.balPaytAmt;
      localAmt      += i.localAmt;
      newPaytAmt    += i.newPaytAmt;
      newBalance    += i.newBalance;
      alasql('INSERT INTO sample VALUES(?,?,?,currency(?),currency(?),currency(?), currency(?), currency(?), currency(?), currency(?), currency(?))', [ i.quarterEnding, i.currCd, i.currRate, i.netQsoaAmt, i.prevPaytAmt, i.prevBalance, i.balPaytAmt, i.localAmt, i.newPaytAmt, i.newBalance]);
    }
    alasql('INSERT INTO sample VALUES (?,?,?,currency(?),currency(?),currency(?), currency(?), currency(?), currency(?), currency(?), currency(?))', ['','', 'TOTAL', netQsoaAmt,prevPaytAmt,prevBalance,balPaytAmt,localAmt,newPaytAmt,newBalance]);
    alasql('SELECT row1, row2, row3, row4, row5, row6, row7, row8, row9, row10 INTO XLSXML("'+filename+'",?) FROM sample', [mystyle]);
    alasql('DROP TABLE sample');  
  }

}
