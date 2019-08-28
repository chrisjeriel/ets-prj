import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { AccountingEntriesCV } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cv-acc-entries',
  templateUrl: './cv-acc-entries.component.html',
  styleUrls: ['./cv-acc-entries.component.css']
})
export class CvAccEntriesComponent implements OnInit, OnDestroy {

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
    selector: '',
    params: {}
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

  subscription: Subscription = new Subscription();
  cvData: any = null;
  btnCancelMainEnabled:boolean = false;

  constructor(private as: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    setTimeout(() => { this.table.refreshTable(); }, 0);
    this.getAcctEntries();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAcctEntries() {
    var sub$ = forkJoin(this.as.getAcitCv(this.passData.tranId),
                        this.as.getAcitAcctEntries(this.passData.tranId)).pipe(map(([cv, en]) => { return { cv, en }; }));

    this.table.overlayLoader = true;
    this.subscription = sub$.subscribe(data => {
      this.cvData = data['cv']['acitCvList'][0];
      this.cvData.cvDate = this.ns.toDateTimeString(this.cvData.cvDate);

      this.CVAcctEnt.tableData = data['en']['list'];
      this.CVAcctEnt.tableData.forEach(a => {
        a.createDate = this.ns.toDateTimeString(a.createDate);
        a.updateDate = this.ns.toDateTimeString(a.updateDate);
        a.showMG = 1;
        if(a.autoTag == 'Y'){
          a.uneditable = ['glShortCd','debitAmt','creditAmt']
        }
      });

      this.computeTotals();
      this.table.refreshTable();
    });

    /*this.table.overlayLoader = true;
    this.as.getAcitAcctEntries(this.passData.tranId).subscribe(a => {
      this.CVAcctEnt.tableData = a['list'];
      this.CVAcctEnt.tableData.forEach(a => {
        a.createDate = this.ns.toDateTimeString(a.createDate);
        a.updateDate = this.ns.toDateTimeString(a.updateDate);
        a.showMG = 1;
        if(a.autoTag == 'Y'){
          a.uneditable = ['glShortCd','debitAmt','creditAmt']
        }
      });

      this.computeTotals();
      this.table.refreshTable();
    });*/
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
    if(data.selector == 'slType') {
      this.lovRow.slTypeName = data.data.slTypeName;
      this.lovRow.slTypeCd = data.data.slTypeCd;
    }else if(data.selector == 'sl') {
      this.lovRow.slTypeName = data.data.slTypeName; 
      this.lovRow.slTypeCd = data.data.slTypeCd;
      this.lovRow.slName = data.data.slName;
      this.lovRow.slCd = data.data.slCd;
    } else if(data.selector == 'acitChartAcct') {

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

  tickChckbx(data) {
    if(data.checked && data.autoTag == 'Y') {
      this.warningModal.openNoClose();
    }

    setTimeout(() => {
      this.CVAcctEnt.btnDisabled = this.table.selected.filter(a=>a.checked && a.autoTag == 'Y').length > 0;
    }, 0);
  }

  onClickSave(){
    for(let a of this.CVAcctEnt.tableData) {
      if(a.edited && !a.deleted &&(a.glAcctId == null || a.glAcctId == '' || a.creditAmt == '' || a.creditAmt == null || isNaN(a.creditAmt)
        || a.debitAmt == '' || a.debitAmt == null || isNaN(a.debitAmt))) {
        this.dialogIcon = 'error';
        this.successDialog.open();
        return;
      }
    }

    this.confirmSave.confirmModal();
  }

  save() {
    let params: any = {
      saveList: [],
      delList: []
    }

    params.saveList = this.CVAcctEnt.tableData.filter(a => a.edited && !a.deleted);
    params.delList = this.CVAcctEnt.tableData.filter(a => a.deleted);

    params.saveList.forEach(a => {
      if(!a.add){
        a.updateUser = this.ns.getCurrentUser();
        a.updateDate = this.ns.toDateTimeString(0);
      } else {
        a.tranId = this.cvData.tranId;
        a.createUser = this.ns.getCurrentUser();
        a.createDate = this.ns.toDateTimeString(0);
        a.updateUser = this.ns.getCurrentUser();
        a.updateDate = this.ns.toDateTimeString(0);
      }
    });

    this.as.saveAcitAcctEntries(params).subscribe(a => {
      if(a['returnCode']==-1) {
        this.dialogIcon = 'success';
        this.successDialog.open();
        this.table.markAsPristine();
        this.getAcctEntries();
      } else {
        this.dialogIcon = 'error';
        this.successDialog.open();
      }
    });

  }
}
