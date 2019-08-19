import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { AccountingEntriesCV } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-cv-acc-entries',
  templateUrl: './cv-acc-entries.component.html',
  styleUrls: ['./cv-acc-entries.component.css']
})
export class CvAccEntriesComponent implements OnInit {

  @Input() passData: any;
  @ViewChild('warningModal') warningModal: ModalComponent;
  @ViewChild(LovComponent) lov: LovComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;

  lovCheckBox:boolean = true;
  CVAcctEnt: any = {
    tableData: [],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','Debit','Credit'],
    uneditable:[true,true,true,true,false,false],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt'],
    dataTypes: ['text','text','text','text','currency','currency'],
    nData: {
      showMG: 1,
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
      autoTag: 'N',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
      edited: true
    },
    addFlag: true,
    deleteFlag: true,
    editFlag: false,
    pageLength: 10,
    widths: [150,290,175,175,160,160],
    checkFlag:true,
    magnifyingGlass: ['glShortCd','slTypeName','slName']
  };

  passLov:any = {
    selector:'',
    params:{}
  }

  lovRow: any;
  selected: any;
  dialogIcon: string = '';
  dialogMessage: string = '';
  cancelFlag: boolean = false;

  totals: any = {
    credit: 0,
    debit: 0,
    variance: 0
  }

  constructor(private accountingService : AccountingService, private ns: NotesService) { }

  ngOnInit() {
    setTimeout(() => { this.table.refreshTable(); },0);
  }

  clickLov(data) {
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

  setLov(data) {
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

      this.CVAcctEnt.tableData = this.CVAcctEnt.tableData.filter(a=>a.glAcctId != '');
      for(let row of data.data) {
        this.CVAcctEnt.tableData.push(JSON.parse(JSON.stringify(this.CVAcctEnt.nData)));
        this.CVAcctEnt.tableData[this.CVAcctEnt.tableData.length - 1].glAcctId = row.glAcctId;
        this.CVAcctEnt.tableData[this.CVAcctEnt.tableData.length - 1].glShortCd = row.shortCode;
        this.CVAcctEnt.tableData[this.CVAcctEnt.tableData.length - 1].glShortDesc = row.shortDesc;
      }
      this.table.refreshTable();
    }
  }

  computeTotals() {   
    this.totals.credit = this.CVAcctEnt.tableData.reduce((a,b)=>a+(b.creditAmt == null || Number.isNaN(b.creditAmt) || b.creditAmt==undefined || b.creditAmt.length == 0?0:parseFloat(b.creditAmt)),0);
    this.totals.debit  = this.CVAcctEnt.tableData.reduce((a,b)=>a+(b.debitAmt  == null || Number.isNaN(b.debitAmt) || b.debitAmt ==undefined || b.debitAmt.length  == 0?0:parseFloat(b.debitAmt)),0);
    this.totals.variance = this.totals.debit - this.totals.credit;
  }
}
