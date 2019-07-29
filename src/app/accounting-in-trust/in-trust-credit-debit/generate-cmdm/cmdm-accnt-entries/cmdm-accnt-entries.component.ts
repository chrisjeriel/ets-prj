import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { AccountingEntryCMDM } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-cmdm-accnt-entries',
  templateUrl: './cmdm-accnt-entries.component.html',
  styleUrls: ['./cmdm-accnt-entries.component.css']
})
export class CmdmAccntEntriesComponent implements OnInit {
  
  @Input() passData:any;
  @ViewChild('warnDeleteAuto') warnDeleteAuto: ModalComponent;
  @ViewChild(LovComponent) lov: LovComponent;
  @ViewChild(CustEditableNonDatatableComponent)table :CustEditableNonDatatableComponent;
  lovCheckBox:boolean = true;
  passTable: any = {
    tableData: [],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','Debit','Credit'],
    uneditable:[true,true,true,true,false,false],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt'],
    dataTypes: ['text','text','text','text','currency','currency'],
    nData: {
        "tranId": '',
        "entryId": '',
        "glAcctId": '',
        "glShortCd": '',
        "glShortDesc":'',
        "slTypeCd": '',
        "slTypeName": "",
        "slCd": '',
        "slName": '',
        "creditAmt": '',
        "debitAmt": '',
        "autoTag": "N",
        "createUser": this.ns.getCurrentUser(),
        "createDate": this.ns.toDateTimeString(0),
        "updateUser": this.ns.getCurrentUser(),
        "updateDate": this.ns.toDateTimeString(0),
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

  passLov:any = {
      selector:'',
      params:{}
   }

   lovRow:any;

   selected:any;

  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  dialogIcon: string = '';
  dialogMessage: string = '';
  cancelFlag: boolean = false;

  totals:any = {
    credit:0,
    debit:0,
    variance:0
  }

  constructor(private accountingService: AccountingService, private ns:NotesService) { }

  ngOnInit() {
    this.passTable.nData.tranId = this.passData.tranId;
    this.passData.cmdmNo = this.passData.memoType + '-' + this.passData.memoTranType+ '-' + this.passData.memoYear+ '-' + this.passData.memoMm + '-' + String(this.passData.memoSeqNo).padStart(this.passData.seqDigits,'0');
    this.getAcctEntries();
    if(this.passData.status != 'New'){
      this.passTable.uneditable= [true,true,true,true,true,true];
      this.passTable.magnifyingGlass= [];
      this.passTable.addFlag = false;
      this.passTable.deleteFlag = false;
      this.passTable.checkFlag = false;
    }
  }

  getAcctEntries(){
    this.accountingService.getAcitAcctEntries(this.passData.tranId).subscribe(a=>{
        this.passTable.tableData = a['list'];
        this.passTable.tableData.forEach(a=>{
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.updateDate = this.ns.toDateTimeString(a.updateDate);
          a.showMG = 1;
          if(a.autoTag == 'Y'){
            a.uneditable = ['glShortCd','debitAmt','creditAmt']
          }
        })
        this.computeTotals();
        this.table.refreshTable();
        
      })
  }

  save(){
    let params: any = {
      saveList:[],
      delList:[]
    }

    params.saveList = this.passTable.tableData.filter(a=>a.edited && !a.deleted);
    params.delList = this.passTable.tableData.filter(a=>a.deleted);

    params.saveList.forEach(a=>{
      if(!a.add){
        a.updateUser = this.ns.getCurrentUser();
        a.updateDate = this.ns.toDateTimeString(0);
      }
    })

    this.accountingService.saveAcitAcctEntries(params).subscribe(a=>{
      if(a['returnCode']==-1){
        this.dialogIcon = 'success';
        this.successDiag.open();
        this.table.markAsPristine();
        this.getAcctEntries();
      }else{
        this.dialogIcon = 'error';
        this.successDiag.open();
      }
    });

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

      this.passTable.tableData = this.passTable.tableData.filter(a=>a.glAcctId != '');
      for(let row of data.data){
        this.passTable.tableData.push(JSON.parse(JSON.stringify(this.passTable.nData)));
        this.passTable.tableData[this.passTable.tableData.length - 1].glAcctId = row.glAcctId;
        this.passTable.tableData[this.passTable.tableData.length - 1].glShortCd = row.shortCode;
        this.passTable.tableData[this.passTable.tableData.length - 1].glShortDesc = row.shortDesc;
      }
      this.table.refreshTable();
    }
  }

  tickChckbx(data){
    if(data.checked && data.autoTag == 'Y'){
      this.warnDeleteAuto.openNoClose();
    }
    this.passTable.btnDisabled = this.table.selected.filter(a=>a.checked && a.autoTag == 'Y').length > 0;
  }

  onClickSave(){
    this.confirmSave.confirmModal();
  }


 computeTotals(){   
   this.totals.credit = this.passTable.tableData.reduce((a,b)=>a+(b.creditAmt != null && b.creditAmt.length != 0?parseFloat(b.creditAmt):0),0,0);
   this.totals.debit  = this.passTable.tableData.reduce((a,b)=>a+(b.debitAmt  != null && b.debitAmt.length != 0 ?parseFloat( b.debitAmt):0),0,0);
   this.totals.variance = this.totals.debit - this.totals.credit;
 }
}
