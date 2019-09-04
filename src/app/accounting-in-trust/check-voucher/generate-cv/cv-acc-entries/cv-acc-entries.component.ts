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
  @ViewChild('can') can         : CancelButtonComponent;
  @ViewChild('con') con         : ConfirmSaveComponent;
  @ViewChild('suc') suc         : SucessDialogComponent;

  lovCheckBox:boolean = true;

  cvAcctEntData: any = {
    tableData      : [],
    tHeader        : ['Account Code','Account Name','SL Type','SL Name','Debit','Credit'],
    uneditable     : [true,true,true,true,false,false],
    keys           : ['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt'],
    dataTypes      : ['text','text','text','text','currency','currency'],
    nData   : {
      showMG       : 1,
      tranId       : '',
      entryId      : '',
      glAcctId     : '',
      glShortCd    : '',
      glShortDesc  :'',
      slTypeCd     : '',
      slTypeName   : '',
      slCd         : '',
      slName       : '',
      creditAmt    : '',
      debitAmt     : '',
      autoTag      : 'N',
      createUser   : '',
      createDate   : '',
      updateUser   : '',
      updateDate   : '',
      edited       : true
    },
    addFlag        : true,
    deleteFlag     : true,
    editFlag       : false,
    pageLength     : 10,
    widths         : [150,290,175,175,160,160],
    checkFlag      : true,
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

  params: any = {
    saveList : [],
    delList  : []
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
      console.log(this.cvData);
      this.cvAcctEntData.tableData = data['en']['list'];
      this.cvAcctEntData.tableData.forEach(a => {
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

      this.cvAcctEntData.tableData = this.cvAcctEntData.tableData.filter(a=>a.glAcctId != '');
      for(let row of data.data) {
        this.cvAcctEntData.tableData.push(JSON.parse(JSON.stringify(this.cvAcctEntData.nData)));
        this.cvAcctEntData.tableData[this.cvAcctEntData.tableData.length - 1].glAcctId = row.glAcctId;
        this.cvAcctEntData.tableData[this.cvAcctEntData.tableData.length - 1].glShortCd = row.shortCode;
        this.cvAcctEntData.tableData[this.cvAcctEntData.tableData.length - 1].glShortDesc = row.shortDesc;
      }
      this.table.refreshTable();
    }
  }

  computeTotals() {   
    this.totals.credit = this.cvAcctEntData.tableData.reduce((a,b)=>a+(b.creditAmt == null || Number.isNaN(b.creditAmt) || b.creditAmt==undefined || b.creditAmt.length == 0?0:parseFloat(b.creditAmt)),0);
    this.totals.debit  = this.cvAcctEntData.tableData.reduce((a,b)=>a+(b.debitAmt  == null || Number.isNaN(b.debitAmt) || b.debitAmt ==undefined || b.debitAmt.length  == 0?0:parseFloat(b.debitAmt)),0);
    this.totals.variance = this.totals.debit - this.totals.credit;
  }

  tickChckbx(data) {
    if(data.checked && data.autoTag == 'Y') {
      this.warningModal.openNoClose();
    }

    setTimeout(() => {
      this.cvAcctEntData.btnDisabled = this.table.selected.filter(a=> a.checked && a.autoTag == 'Y').length > 0;
    }, 0);
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;

    this.cvAcctEntData.tableData.forEach(e => {
      e.tranId = this.cvData.tranId;
      if(e.glShortCd == '' || e.glShortCd == null || e.debitAmt == '' || e.debitAmt == null || e.creditAmt == '' || e.creditAmt == null){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.delList.push(e);
        }
      }else{
        e.fromCancel = true;
        if(e.edited && !e.deleted){
          e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
          e.createDate    = this.ns.toDateTimeString(e.createDate);
          e.updateUser    = this.ns.getCurrentUser();
          e.updateDate    = this.ns.toDateTimeString(0);
          this.params.saveList.push(e);
        }else if(e.edited && e.deleted){
          this.params.delList.push(e);
        }
      }
    });

    console.log(this.cvAcctEntData.tableData);
    console.log(this.params);
    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.suc.open();
      this.params.saveList   = [];
    }else{
        if(this.params.saveList.length == 0 && this.params.delList.length == 0){
          $('.ng-dirty').removeClass('ng-dirty');
          this.con.confirmModal();
          this.params.saveList   = [];
          this.params.delList = [];
          this.cvAcctEntData.tableData = this.cvAcctEntData.tableData.filter(e => e.glShortCd != '');
        }else{
          if(this.cancelFlag == true){
            this.con.showLoading(true);
            setTimeout(() => { try{this.con.onClickYes();}catch(e){}},500);
          }else{
            this.con.confirmModal();
          }
        }
    }
  }

  onSaveAcctEntries() {
    this.table.overlayLoader = true;
    console.log(this.params);
    this.as.saveAcitAcctEntries(this.params)
    .subscribe(data => {
      console.log(data);
      this.getAcctEntries();
      this.suc.open();
      this.params.saveList  = [];
      this.params.delList  = [];
    });
  }

  checkCancel(){
    if(this.cancelFlag){
      this.can.onNo();
    }else{
      this.suc.modal.closeModal();
    }
  }

  cancel(){
    this.can.clickCancel();
  }
}
