import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ARTaxDetailsVAT, ARTaxDetailsWTAX, AccARInvestments} from '@app/_models';
import { ActivatedRoute} from '@angular/router';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-ar-preview',
  templateUrl: './ar-preview.component.html',
  styleUrls: ['./ar-preview.component.css']
})
export class ArPreviewComponent implements OnInit {

  @Input() record: any;

  @ViewChild('amtDtlTbl') amtDtlTbl : CustEditableNonDatatableComponent;
  @ViewChild('acctEntryTbl') acctEntryTbl : CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(LovComponent) lov: LovComponent;
  @ViewChild('warnDeleteAuto') warnDeleteAuto: ModalComponent;

  amountDetailsData: any = {
    tableData: [],
    tHeader: ['Item No.', 'Gen Type', 'Detail', 'Original Amount', 'Currency', 'Currency Rate', 'Local Amount'],
    dataTypes: ['number', 'text', 'text', 'currency', 'select', 'percent', 'currency'],
    nData: {
      tranId: '',
      itemSeqno: '',
      genType: '',
      itemText: '',
      currAmt: '',
      currCd: '',
      currRate: '',
      localAmt: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: ''
    },
    widths: [1, 1, 500, 'auto',100,100,'auto'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 'amtDtl',
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, 'Total', null, null, null, 'localAmt'],
    keys: ['itemSeqno', 'genType', 'itemText', 'currAmt', 'currCd', 'currRate', 'localAmt'],
    uneditable: [true,true,false,false,false,false,true],
    opts: [{
      selector: 'currCd',
      vals: [],
      prev: []
    }]
  }

  accEntriesData: any = {
    tableData: [],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','Debit','Credit'],
    uneditable:[true,true,true,true,false,false],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt'],
    dataTypes: ['text','text','text','text','currency','currency'],
    nData: {
        tranId: '',
        entryId: '',
        glAcctId: '',
        glShortCd: '',
        glShortDesc:'',
        slTypeCd: '',
        slTypeName: '',
        slCd: '',
        slName: '',
        creditAmt: 0,
        debitAmt: 0,
        autoTag: '',
        createUser: this.ns.getCurrentUser(),
        createDate: this.ns.toDateTimeString(0),
        updateUser: this.ns.getCurrentUser(),
        updateDate: this.ns.toDateTimeString(0),
        showMG:1,
        edited: true
      },
    addFlag: true,
    deleteFlag: true,
    editFlag: false,
    pageLength: 10,
    widths: [205,305,163,176,122,154],
    checkFlag:true,
    magnifyingGlass: ['glShortCd','slTypeName','slName'],
    total: [null,null,null,'TOTAL DEBIT AND CREDIT','debitAmt', 'creditAmt']
  };

  /*accEntriesData: any = {
    tableData: [
      {
        accountCode: null,
        accountName: null,
        slType: null,
        slName: null,
        debit: null,
        credit: null
      }
    ],
    tHeader: ['Account Code', 'Account Name', 'SL Type', 'SL Name', 'Debit', 'Credit'],
    dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
    nData: {
        accountCode: null,
        accountName: null,
        slType: null,
        slName: null,
        debit: null,
        credit: null
      },
    paginateFlag: true,
    infoFlag: true,
    checkFlag: true,
    pageID: 'acctEntries',
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', null, null],
    genericBtn: 'Save',
    magnifyingGlass: ['accountCode','slType','slName']
  }*/

  cancelFlag: boolean;
  totalLocalAmt: number = 0;
  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];

  currencyArray: any[] = [];
  currentTab: string = '';
  lovRow: any;
  lovCheckBox:boolean = true;

  passLov:any = {
    selector:'',
    params:{}
  }

  totals:any = {
    credit:0,
    debit:0,
    variance:0
  }

  constructor(private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    console.log(this.record.tranId);
    this.accEntriesData.nData.tranId = this.record.tranId;
    this.accEntriesData.nData.autoTag = 'N';
    if(this.record.arStatDesc.toUpperCase() != 'NEW'){
      this.accEntriesData.uneditable = [true, true, true, true, true, true ];
      this.accEntriesData.addFlag = false;
      this.accEntriesData.deleteFlag =  false;
      this.accEntriesData.checkFlag = false;
      this.accEntriesData.magnifyingGlass = [];

      this.amountDetailsData.uneditable = [true, true, true, true, true, true ];
      this.amountDetailsData.addFlag = false;
      this.amountDetailsData.deleteFlag =  false;
      this.amountDetailsData.checkFlag = false;
      this.amountDetailsData.magnifyingGlass = [];
    }
    this.getMtnCurrency();
    //this.retrieveAmtDtl();
    this.retrieveAcctEntry();
  }

  onTabChange(event){
    this.currentTab = event.nextId;
    if(this.currentTab === 'amtDtl'){
      this.retrieveAmtDtl();
    }else if(this.currentTab === 'acctEntries'){
      this.retrieveAcctEntry();
    }
  }

  retrieveAmtDtl(){
    this.amountDetailsData.tableData = [];
    this.accountingService.getAcitArAmtDtl(this.record.tranId).subscribe(
      (data:any)=>{
        if(data.arAmtDtlList.length !== 0){
           for(var i of data.arAmtDtlList){
             if(i.updateLevel === 'N'){
               i.uneditable = ['itemText', 'currAmt', 'currCd', 'currRate', 'localAmt'];
             }
             this.amountDetailsData.tableData.push(i);
           }
           this.amtDtlTbl.refreshTable();
        }
      }
    );
  }
  retrieveAcctEntry(){
    this.accountingService.getAcitAcctEntries(this.record.tranId).subscribe(a=>{
        this.accEntriesData.tableData = a['list'];
        this.accEntriesData.tableData.forEach(a=>{
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.updateDate = this.ns.toDateTimeString(a.updateDate);
          a.showMG = 1;
          //F is full, L is limited, N is restricted
          if(a.updateLevel == 'N'){
            a.uneditable = ['glShortCd','debitAmt','creditAmt'];
            a.showMG = 0;
          }
        })
        this.computeTotals();
        this.acctEntryTbl.refreshTable();
      })
  }

  onClickSave(){
     this.confirm.confirmModal();
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    //prepare params from table
    this.savedData = [];
    this.deletedData = [];
    this.totalLocalAmt = 0;
    /*if(this.currentTab === 'amtDtl' || this.currentTab.length === 0){
      for (var i = 0 ; this.amountDetailsData.tableData.length > i; i++) {
        if(!this.amountDetailsData.tableData[i].deleted){
          this.totalLocalAmt += this.amountDetailsData.tableData[i].localAmt;
        }
        if(this.amountDetailsData.tableData[i].edited && !this.amountDetailsData.tableData[i].deleted){
            this.savedData.push(this.amountDetailsData.tableData[i]);
            this.savedData[this.savedData.length-1].tranId = this.record.tranId;
            this.savedData[this.savedData.length-1].genType = this.savedData[this.savedData.length-1].genType.length === 0 ? 'M' : this.savedData[this.savedData.length-1].genType;
            this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
            this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
            this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
            this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
        }
        else if(this.amountDetailsData.tableData[i].edited && this.amountDetailsData.tableData[i].deleted){
           this.deletedData.push(this.amountDetailsData.tableData[i]);
           this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
           this.deletedData[this.deletedData.length-1].quarterEnding = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].quarterEnding);
           this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
           this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
        }
      }
      let params: any = {
        tranId: this.record.tranId,
        totalLocalAmt: this.totalLocalAmt,
        saveAmtDtl: this.savedData,
        delAmtDtl: this.deletedData
      }
      console.log(params);

      this.accountingService.saveAcitArAmtDtl(params).subscribe(
        (data:any)=>{
         if(data.returnCode === -1){
            this.dialogIcon = '';
            this.successDiag.open();
            this.retrieveAmtDtl();
          }else if(data.returnCode === 0 && data.custReturnCode !== 2){
            this.dialogIcon = 'error';
            this.successDiag.open();
            if(this.cancelFlag){
              this.cancelFlag = false;
            }
          }else if(data.returnCode === 0 && data.custReturnCode === 2){
            this.dialogIcon = 'error-message';
            this.dialogMessage = 'Total Amount of Details must not exceed the AR Amount.';
            this.successDiag.open();
            if(this.cancelFlag){
              this.cancelFlag = false;
            }
          }
        },
        (error: any)=>{

        }
      );*/
   // }else if(this.currentTab === 'acctEntries'){
      this.savedData = this.accEntriesData.tableData.filter(a=>a.edited && !a.deleted);
      this.deletedData = this.accEntriesData.tableData.filter(a=>a.deleted);
      console.log(this.savedData);
      console.log(this.deletedData);

      this.savedData.forEach(a=>{
        if(!a.add){
          a.updateUser = this.ns.getCurrentUser();
          a.updateDate = this.ns.toDateTimeString(0);
        }
      })

      let params = {
        tranId: this.record.tranId,
        saveList: this.savedData,
        delList: this.deletedData
      }

      this.accountingService.saveAcitAcctEntries(params).subscribe(a=>{
        if(a['returnCode']==-1){
          this.dialogIcon = 'success';
          this.successDiag.open();
          this.acctEntryTbl.markAsPristine();
          this.retrieveAcctEntry();
        }else{
          this.dialogIcon = 'error';
          this.successDiag.open();
        }
      });
    //}
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  //All maintenance retrievals here
  getMtnCurrency(){
    this.currencyArray = [];
    this.ms.getMtnCurrency('','Y').subscribe(
      (data: any)=>{
        for(var i of data.currency){
          this.amountDetailsData.opts[0].vals.push(i.currencyCd);
          this.amountDetailsData.opts[0].prev.push(i.currencyCd);
          this.currencyArray.push({currCd: i.currencyCd, currRate: i.currencyRt});
        }
      }
    );
  }

  //UTILITIES STARTS HERE
  pad(str, field) {
    if(str === '' || str == null){
      return '';
    }else{
      if(field === 'arNo'){
        return String(str).padStart(6, '0');
      }else if(field === 'dcbSeqNo'){
        return String(str).padStart(3, '0');
      }
    }
  }

  onTableDataChange(data){
    if(this.currentTab === 'amtDtl' || this.currentTab.length === 0){

      if(data.key === 'currCd'){
        for(var i = 0; i < this.amountDetailsData.tableData.length; i++){
          for(var j = 0; j < this.currencyArray.length; j++){
            if(data[i].currCd == this.currencyArray[j].currCd){
              data[i].currRate = this.currencyArray[j].currRate;
              break;
            }
          }
        }
      }

      if(data.key === 'currAmt' || data.key === 'currCd' || data.key === 'currRate'){
        for(var i = 0; i < this.amountDetailsData.tableData.length; i++){
          data[i].localAmt = data[i].currAmt * data[i].currRate;
        }
      }

    }

    this.amountDetailsData.tableData = data;
    this.amtDtlTbl.refreshTable();
  }

  setLov(data){
    if(data.selector == 'slType'){
      this.lovRow.slTypeName = data.data.slTypeName;
      this.lovRow.slTypeCd = data.data.slTypeCd;
    }else if(data.selector == 'sl'){
      this.lovRow.slTypeName = data.data.slTypeName; 
      this.lovRow.slTypeCd = data.data.slTypeCd;
      this.lovRow.slName = data.data.slName;
      this.lovRow.slCd = data.data.slCd;
    }else if(data.selector == 'acitChartAcct'){

      let firstRow = data.data.pop();
      this.lovRow.glAcctId = firstRow.glAcctId;
      this.lovRow.glShortCd = firstRow.shortCode;
      this.lovRow.glShortDesc = firstRow.shortDesc;

      this.accEntriesData.tableData = this.accEntriesData.tableData.filter(a=>a.glAcctId != '');
      for(let row of data.data){
        this.accEntriesData.tableData.push(JSON.parse(JSON.stringify(this.accEntriesData.nData)));
        this.accEntriesData.tableData[this.accEntriesData.tableData.length - 1].glAcctId = row.glAcctId;
        this.accEntriesData.tableData[this.accEntriesData.tableData.length - 1].glShortCd = row.shortCode;
        this.accEntriesData.tableData[this.accEntriesData.tableData.length - 1].glShortDesc = row.shortDesc;
      }
      this.acctEntryTbl.refreshTable();
    }
  }



  clickLov(data){
    this.lovRow = data.data;
    if(data.key == 'glShortCd'){
      this.passLov.selector = 'acitChartAcct';
      this.lovCheckBox = true;
      this.passLov.params = {};
    }else if(data.key == 'slTypeName'){
      this.passLov.selector = 'slType';
      this.lovCheckBox = false;
      this.passLov.params = {};
    }else if(data.key == 'slName'){
      this.passLov.selector = 'sl';
      this.lovCheckBox = false;
      this.passLov.params = {
        slTypeCd: data.data.slTypeCd
      };
    }

    this.lov.openLOV();
  }

  tickChckbx(data){
    console.log(data)
    if(data.checked && data.autoTag == 'Y' && (data.updateLevel == 'L' || data.updateLevel == 'N')){
      this.warnDeleteAuto.openNoClose();
        this.acctEntryTbl.selected = this.acctEntryTbl.selected.filter(a=>(data.updateLevel != 'L' && data.updateLevel != 'N'));
        console.log(this.acctEntryTbl.selected);
    }
    this.accEntriesData.btnDisabled = this.acctEntryTbl.selected.filter(a=>a.checked && a.autoTag == 'Y' && (data.updateLevel == 'L' || data.updateLevel == 'N')).length > 0;
  }

  computeTotals(){   
    console.log(this.accEntriesData.tableData)
    this.totals.credit = this.accEntriesData.tableData.reduce((a,b)=>a+(b.creditAmt == null || Number.isNaN(b.creditAmt) || b.creditAmt==undefined || b.creditAmt.length == 0?0:parseFloat(b.creditAmt)),0);
    this.totals.debit  = this.accEntriesData.tableData.reduce((a,b)=>a+(b.debitAmt  == null || Number.isNaN(b.debitAmt) || b.debitAmt ==undefined || b.debitAmt.length  == 0?0:parseFloat( b.debitAmt)),0);
    this.totals.variance = this.totals.debit - this.totals.credit;
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
    var filename = 'AccountingEntries'+currDate+'.xlsx'
    var mystyle = {
        headers:false, 
        column: {style:{Font:{Bold:"1"}}},
        rows: {0:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               2:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               5:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}}}
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
    var totalDebit: number = 0;
    var totalCredit: number = 0;
    alasql('CREATE TABLE sample(row1 VARCHAR2, row2 VARCHAR2, row3 VARCHAR2, row4 VARCHAR2, row5 VARCHAR2, row6 VARCHAR2)');
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?)', ['AR No', 'AR Date', 'DCB No.', 'Payment Type', 'Amount', '']);
    alasql('INSERT INTO sample VALUES (?,datetime(?),?,?,?,currency(?))', [this.record.formattedArNo, this.record.arDate, this.record.dcbNo, this.record.tranTypeName, this.record.currCd, this.record.arAmt]);
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?)', ['Payor', '', '', 'Status', 'Local Amount', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,currency(?))', [this.record.payor, '','', this.record.arStatDesc, 'PHP', this.record.currRate * this.record.arAmt]);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?)', ['', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?)', ['Account Code', 'Account Name', 'SL Type', 'SL Name', 'Debit', 'Credit']);
    for(var i of this.accEntriesData.tableData){
      totalCredit += i.creditAmt;
      totalDebit += i.debitAmt;
      alasql('INSERT INTO sample VALUES(?,?,?,?,currency(?),currency(?))', [i.glShortCd, i.glShortDesc, i.slTypeName == null ? '' : i.slTypeName, i.slName == null ? '' : i.slName, i.debitAmt, i.creditAmt]);
    }
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?)', ['', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,currency(?),currency(?))', ['', '', '', 'TOTAL', totalDebit, totalCredit]);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,currency(?))', ['', '', '', 'VARIANCE', '', totalDebit - totalCredit]);
    alasql('SELECT row1, row2, row3, row4, row5, row6 INTO XLSXML("'+filename+'",?) FROM sample', [mystyle]);
    alasql('DROP TABLE sample');  
  }
}
