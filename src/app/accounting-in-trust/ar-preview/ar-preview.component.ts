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
        creditAmt: '',
        debitAmt: '',
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
    magnifyingGlass: ['glShortCd','slTypeName','slName']
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
    this.accEntriesData.nData.tranId = this.record.tranId;
    this.accEntriesData.nData.autoTag = 'N';
    this.getMtnCurrency();
    this.retrieveAmtDtl();
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
          if(a.autoTag == 'Y'){
            a.uneditable = ['glShortCd','debitAmt','creditAmt']
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
    if(this.currentTab === 'amtDtl' || this.currentTab.length === 0){
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
      );
    }else if(this.currentTab === 'acctEntries'){
      this.savedData = this.accEntriesData.tableData.filter(a=>a.edited && !a.deleted);
      this.deletedData = this.accEntriesData.tableData.filter(a=>a.deleted);

      this.savedData.forEach(a=>{
        if(!a.add){
          a.updateUser = this.ns.getCurrentUser();
          a.updateDate = this.ns.toDateTimeString(0);
        }
      })

      let params = {
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
    }
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
    if(data.checked && data.autoTag == 'Y'){
      this.warnDeleteAuto.openNoClose();
    }
    this.accEntriesData.btnDisabled = this.acctEntryTbl.selected.filter(a=>a.checked && a.autoTag == 'Y').length > 0;
  }

  computeTotals(){   
    console.log(this.accEntriesData.tableData)
    this.totals.credit = this.accEntriesData.tableData.reduce((a,b)=>a+(b.creditAmt == null || Number.isNaN(b.creditAmt) || b.creditAmt==undefined || b.creditAmt.length == 0?0:parseFloat(b.creditAmt)),0);
    this.totals.debit  = this.accEntriesData.tableData.reduce((a,b)=>a+(b.debitAmt  == null || Number.isNaN(b.debitAmt) || b.debitAmt ==undefined || b.debitAmt.length  == 0?0:parseFloat( b.debitAmt)),0);
    this.totals.variance = this.totals.debit - this.totals.credit;
  }

}
