import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { ARUnappliedCollection } from '@app/_models';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-ar-others',
  templateUrl: './ar-others.component.html',
  styleUrls: ['./ar-others.component.css']
})
export class ArOthersComponent implements OnInit {

  @Input() arDetails: any;

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancel: CancelButtonComponent;
  @ViewChild(ModalComponent) netMdl: ModalComponent;
  @Output() emitCreateUpdate: EventEmitter<any> = new EventEmitter();

  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];

  cancelFlag: boolean = false;
  genAcctEnt: boolean = false;

  totalLocalAmt: number = 0;
  isReopen: boolean = false;
  originalNet: number = 0;
  newAlteredAmt: number = 0;

  passData: any = {
    tableData: [],
    tHeader: ['Item','Reference No.','Description','Curr','Curr Rate','Amount','Amount (PHP)'],
    dataTypes: ['reqTxt','text','text','text','percent','reqCurrency','currency'],
    nData: {
      tranId: '',
      billId: '',
      itemNo: '',
      itemName: '',
      refNo: '',
      remarks: '',
      currCd: '',
      currRate: '',
      currAmt: 0,
      localAmt: 0
    },
    total:[null,null,null,null,'Total','currAmt','localAmt'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    pageLength: 10,
    widths: [210,160,'auto',80,100,120,120],
    keys: ['itemName', 'refNo', 'remarks', 'currCd', 'currRate', 'currAmt', 'localAmt'],
    uneditable: [false,false,false,true,true,false,true],
    paginateFlag:true,
    infoFlag:true,
    opts:[{
      selector: 'currCd',
      vals: [],
      prev: []
    }]
  }
  constructor(private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.passData.nData.tranId = this.arDetails.tranId;
    this.passData.nData.billId = 3;
    this.passData.nData.currCd = this.arDetails.currCd;
    this.passData.nData.currRate = this.arDetails.currRate;
    this.isReopen = this.arDetails.reopenTag == 'Y';
    if(this.arDetails.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true, true, true, true, true, true,true ];
      this.passData.addFlag = false;
      this.passData.deleteFlag =  false;
      this.passData.checkFlag = false;
    }
    //this.getCurrency();
    this.retrieveOthers();
  }

  retrieveOthers(){
    this.genAcctEnt = false;
    this.passData.tableData = [];
    this.accountingService.getAcitArTransDtl(this.arDetails.tranId, 3).subscribe( //Bill id = 3 for others
      (data: any)=>{
        if(data.transDtlList.length !== 0){
          for(var i of data.transDtlList){
            this.originalNet += i.currAmt;
          }
          this.passData.tableData = data.transDtlList;
          this.table.refreshTable();
        }
      },
      (error: any)=>{

      }
    );
  }

  getCurrency(){
    this.ms.getMtnCurrency('','Y').subscribe(
       (data: any)=>{
         for(var i of data.currency){
           this.passData.opts[0].vals.push(i.currencyCd+'T'+i.currencyRt);
           this.passData.opts[0].prev.push(i.currencyCd);
         }
       }
    );
  }

  onClickSave(cancel?){
    if(this.arDetails.dcbStatus == 'C' || this.arDetails.dcbStatus == 'T'){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'A.R. cannot be saved. DCB No. is '; 
      this.dialogMessage += this.arDetails.dcbStatus == 'T' ? 'temporarily closed.' : 'closed.';
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

  onClickCancel(){
    this.cancel.clickCancel();
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.savedData = [];
    this.deletedData = [];
    this.totalLocalAmt = 0;
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(!this.passData.tableData[i].deleted){
        this.totalLocalAmt += this.passData.tableData[i].localAmt;
      }
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          /*this.savedData[this.savedData.length-1].tranId = this.arDetails.tranId;
          this.savedData[this.savedData.length-1].billId = 1; //1 for Inward Policy balances Transaction Type*/
          this.savedData[this.savedData.length-1].currCd = this.savedData[this.savedData.length-1].currCd.split('T')[0];
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         /*this.deletedData[this.deletedData.length-1].tranId = this.arDetails.tranId;
         this.deletedData[this.deletedData.length-1].billId = 1; //1 for Inward Policy balances Transaction Type*/
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    let params: any = {
      tranId: this.arDetails.tranId,
      billId: 3, //3 for others
      billType: 8, //8 for others
      totalLocalAmt: this.totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveTransDtl: this.savedData,
      delTransDtl: this.deletedData,
      genAcctEnt: this.genAcctEnt ? 'Y' : 'N'
    }
    console.log(params);
    this.accountingService.saveAcitArTransDtl(params).subscribe(
      (data:any)=>{
        console.log(data);
        if(data.returnCode === -1){
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveOthers();
          this.table.markAsPristine();
        }else if(data.returnCode === 0 && data.custReturnCode !== 2){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else if(data.returnCode === 0 && data.custReturnCode === 2){
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'Total amount for Other Payments must not exceed the AR Amount.';
          this.successDiag.open();
        }
      }
    );

  }

  onTableDataChange(data){
    if(data.key === 'currAmt' || data.key === 'currRate'){
      for(var i = 0; i < data.length; i++){
        data[i].localAmt = data[i].currAmt * data[i].currRate;
        this.genAcctEnt = true;
      }
    }else if(data.key === 'currCd'){
      for(var i = 0; i < data.length; i++){
        data[i].currRate = data[i].currCd.split('T')[1];
        data[i].localAmt = data[i].currAmt * data[i].currRate;
        this.genAcctEnt = true;
      }
    }
    this.passData.tableData = data;
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
    var filename = 'ARDetails_#'+this.arDetails.formattedArNo+'_'+currDate+'.xls'
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
    var currAmt = 0;
    var localAmt = 0;

    //'itemName', 'refNo', 'remarks', 'currCd', 'currRate', 'currAmt', 'localAmt'

    alasql('CREATE TABLE sample(row1 VARCHAR2, row2 VARCHAR2, row3 VARCHAR2, row4 VARCHAR2, row5 VARCHAR2, row6 VARCHAR2, row7 VARCHAR2)');
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?)', ['AR No', 'AR Date', 'DCB No.', 'Payment Type', 'Amount', '', '']);
    alasql('INSERT INTO sample VALUES (?,datetime(?),?,?,?,currency(?),?)', [this.arDetails.formattedArNo, this.arDetails.arDate, this.arDetails.dcbNo, this.arDetails.tranTypeName, this.arDetails.currCd, this.arDetails.arAmt, '']);
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?)', ['Payor', '', '', 'Status', 'Local Amount', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,currency(?),?)', [this.arDetails.payor, '','', this.arDetails.arStatDesc, 'PHP', this.arDetails.currRate * this.arDetails.arAmt, '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?)', ['', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?)', ['Item', 'Reference No.', 'Description', 'Currency', 'Curr Rate', 'Amount', 'Local Amount']);
    for(var i of this.passData.tableData){
      //totalCredit += i.creditAmt;
      //totalDebit += i.debitAmt;
      currAmt       += i.currAmt;
      localAmt      += i.localAmt;
      alasql('INSERT INTO sample VALUES(?,?,?,?,rate(?), currency(?), currency(?))', [i.itemName, i.refNo, i.remarks, i.currCd, i.currRate, i.currAmt, i.localAmt]);
    }
    //alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,currency(?), currency(?))', ["","", "", "", "TOTAL", currAmt, localAmt]);
    alasql('SELECT row1, row2, row3, row4, row5, row6, row7 INTO XLSXML("'+filename+'",?) FROM sample', [mystyle]);
    alasql('DROP TABLE sample');  
  }
}

