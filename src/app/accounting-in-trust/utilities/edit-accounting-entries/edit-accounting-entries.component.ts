import { Component, OnInit, ViewChild, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingEntriesCV } from '@app/_models';
import { AccountingService, NotesService, UserService } from '@app/_services';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-edit-accounting-entries',
  templateUrl: './edit-accounting-entries.component.html',
  styleUrls: ['./edit-accounting-entries.component.css']
})
export class EditAccountingEntriesComponent implements OnInit, OnDestroy {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild('lov') lovMdl: LovComponent;
  @ViewChild('aeLov') aeLov: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('restoreMdl') restoreMdl: ModalComponent;
  @ViewChild('myForm') form: any;

  passData: any = {};
  tranListData: any = {};
  tranClass: string = 'AR';

  forkSub: any;

  tranNo: string = '';

  tranDetails: any = {
    tranDate: '',
    backupBy: '',
    currCd: '',
    currRate: '',
    tranAmount: '',
    localCurrCd: 'PHP',
    localAmt: '',
    payeeName: '',
    tranStatDesc: '',
    backupDate: '',
    tranTypeName: '',
    particulars: '',
    reason: '',
    tranId: '',
    histNo: ''
  }

  passLov: any = {
    selector: 'arList',
    searchParams: []
  }

  passLovAe:any = {
    selector:'',
    params:{}
  }

  originalCrDr: any = {
    creditAmt: 0,
    debitAmt: 0,
    foreignCreditAmt: 0,
    foreignDebitAmt: 0
  }

  lovRow: any;
  lovCheckBox:boolean = true;
  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];

  currentTranData: any;

  canCancel: boolean = false;
  canRestore: boolean = false;
  canSave: boolean = false;
  canPrint: boolean = false;

  createUpdate: any = {
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: ''
  }

  constructor(private accountingService: AccountingService, private titleService: Title, private router: Router, private ns: NotesService, private userService: UserService) {
  		this.titleService.setTitle("Acct-IT | Edit Acct Entries");
      this.userService.emitModuleId("ACIT053");
   }

  ngOnInit() {
    this.passData = this.accountingService.getAccEntriesPassData();
    this.passData.disableAdd = true;
    this.passData.nData.autoTag = 'N';
    console.log(this.form);
  }

  ngOnDestroy(){
    if(this.forkSub !== undefined){
      this.forkSub.unsubscribe();
    }
  }

  retrieveTransactions(){
    switch(this.tranClass){
      case 'AR':
        this.passLov.selector = 'arList';
        break;
      case 'CV':
        this.passLov.selector = 'acitCvList';
        break;
      case 'JV':
        this.passLov.selector = 'acitJvList';
        break;
    }
    this.lovMdl.openLOV();
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }

  onRowClick(data){
    if(data == null){
      this.createUpdate.createUser = '';
      this.createUpdate.createDate = '';
      this.createUpdate.updateUser = '';
      this.createUpdate.updateDate = '';
    }else{
      this.createUpdate.createUser = data.createUser;
      this.createUpdate.createDate = this.ns.toDateTimeString(data.createDate);
      this.createUpdate.updateUser = data.updateUser;
      this.createUpdate.updateDate = this.ns.toDateTimeString(data.updateDate);
    }
  }

  setSelectedData(data){
    this.currentTranData = data;
    console.log(this.currentTranData.data);
    this.table.overlayLoader = true;
    this.passData.disableAdd = false;
    this.passData.nData.tranId = data.data.tranId;
    switch(this.tranClass){
      case 'AR':
        this.tranNo = data.data.formattedArNo;
        break;
      case 'CV':
        this.tranNo = data.data.cvGenNo;
        break;
      case 'JV':
        this.tranNo = data.data.jvNo;
        break;
    }
    /*this.accountingService.getAcitAcctEntries(data.data.tranId).subscribe(
      (data: any)=>{
        console.log(data);
        this.passData.tableData = data.list;
        this.table.refreshTable();
        this.table.overlayLoader = false;
      }
    );*/

    this.originalCrDr = {
      creditAmt: 0,
      debitAmt: 0,
      foreignCreditAmt: 0,
      foreignDebitAmt: 0
    };

    this.tranDetails.tranId = data.data.tranId;
    this.retrieveData(this.tranDetails.tranId);
    
  }

  retrieveData(tranId){
    this.originalCrDr = {
      creditAmt: 0,
      debitAmt: 0,
      foreignCreditAmt: 0,
      foreignDebitAmt: 0
    };
    var sub$ = forkJoin(this.accountingService.getAcitAcctEntries(tranId),
                        this.accountingService.getAcitEditedAcctEntries(tranId))
                       .pipe(map(([acctEntries, acctEntriesDetails]) => { return { acctEntries, acctEntriesDetails}; }));
    this.forkSub = sub$.subscribe(
      (forkData:any)=>{
        console.log(forkData);
        let acctEntries = forkData.acctEntries;
        let acctEntriesDetails = forkData.acctEntriesDetails;
        this.tranDetails.tranDate = this.ns.toDateTimeString(acctEntriesDetails.editedAcctEntries.tranDate).split('T')[0];
        this.tranDetails.backupBy = acctEntriesDetails.editedAcctEntries.editedBy;
        this.tranDetails.currCd = acctEntriesDetails.editedAcctEntries.currCd;
        this.tranDetails.currRate = acctEntriesDetails.editedAcctEntries.currRate;
        this.tranDetails.tranAmount = acctEntriesDetails.editedAcctEntries.amount;
        this.tranDetails.localAmt = acctEntriesDetails.editedAcctEntries.localAmt;
        this.tranDetails.payeeName = acctEntriesDetails.editedAcctEntries.payee;
        this.tranDetails.tranStatDesc = acctEntriesDetails.editedAcctEntries.status;
        this.tranDetails.backupDate = this.ns.toDateTimeString(acctEntriesDetails.editedAcctEntries.editDate).split('T')[0];
        this.tranDetails.tranTypeName = acctEntriesDetails.editedAcctEntries.tranTypeName;
        this.tranDetails.particulars = acctEntriesDetails.editedAcctEntries.particulars;
        this.tranDetails.reason = acctEntriesDetails.editedAcctEntries.reason;
        this.tranDetails.histNo = acctEntriesDetails.editedAcctEntries.histNo;
        this.passData.tableData = acctEntries.list.map(a=>{a.showMG = 1; return a;});
        this.table.refreshTable();
        this.table.overlayLoader = false;
        for(var i of this.passData.tableData){
          this.originalCrDr.foreignCreditAmt += i.foreignCreditAmt;
          this.originalCrDr.foreignDebitAmt  += i.foreignDebitAmt;
          this.originalCrDr.creditAmt        += i.creditAmt;
          this.originalCrDr.debitAmt         += i.debitAmt;
        }

        this.canRestore = this.tranDetails.histNo != null;
        this.canCancel = true;
        this.canPrint = true;
        this.canSave = true;
      }
    );
  }

  onTableDataChange(data){
    if(data.key == 'foreignDebitAmt' || data.key == 'foreignCreditAmt'){
      for(var i = 0; i < this.passData.tableData.length; i++){
        this.passData.tableData[i].debitAmt = this.tranDetails.currRate * this.passData.tableData[i].foreignDebitAmt;
        this.passData.tableData[i].creditAmt = this.tranDetails.currRate * this.passData.tableData[i].foreignCreditAmt;
      }
    }
  }

  clearTranDetails(){
    this.tranDetails.tranDate = '';
    this.tranDetails.backupBy = '';
    this.tranDetails.currCd = '';
    this.tranDetails.currRate = '';
    this.tranDetails.tranAmount = '';
    this.tranDetails.localCurrCd = 'PHP';
    this.tranDetails.localAmt = '';
    this.tranDetails.payeeName = '';
    this.tranDetails.tranStatDesc = '';
    this.tranDetails.backupDate = '';
    this.tranDetails.tranTypeName = '';
    this.tranDetails.particulars = '';
    this.tranDetails.reason = '';
    this.tranDetails.histNo = '';
    this.tranDetails.tranId = '';
    this.passData.disableAdd = true;
    this.canSave = false;
    this.canRestore = false;
    this.canCancel = false;
    this.canPrint = false;
  }

  clickLov(data){
    this.lovRow = data.data;
    if(data.key == 'glShortCd'){
      this.passLovAe.selector = 'acitChartAcct';
      this.lovCheckBox = true;
      this.passLovAe.params = {};
    }else if(data.key == 'slTypeName'){
      this.passLovAe.selector = 'slType';
      this.lovCheckBox = false;
      this.passLovAe.params = {};
    }else if(data.key == 'slName'){
      this.passLovAe.selector = 'sl';
      this.lovCheckBox = false;
      this.passLovAe.params = {
        slTypeCd: data.data.slTypeCd
      };
    }

    this.aeLov.openLOV();
  }

  setLov(data){
    if(data.selector == 'slType'){
      this.lovRow.slTypeName = data.data.slTypeName;
      this.lovRow.slTypeCd = data.data.slTypeCd;
      this.lovRow.slName = '';
      this.lovRow.slCd = '';
      this.lovRow.edited = true;
    }else if(data.selector == 'sl'){
      this.lovRow.slTypeName = data.data.slTypeName; 
      this.lovRow.slTypeCd = data.data.slTypeCd;
      this.lovRow.slName = data.data.slName;
      this.lovRow.slCd = data.data.slCd;
      this.lovRow.edited = true;
    }else if(data.selector == 'acitChartAcct'){

      let firstRow = data.data.pop();
      this.lovRow.glAcctId = firstRow.glAcctId;
      this.lovRow.glShortCd = firstRow.shortCode;
      this.lovRow.glShortDesc = firstRow.shortDesc;
      this.lovRow.edited = true;

      this.passData.tableData = this.passData.tableData.filter(a=>a.glAcctId != '');
      for(let row of data.data){
        this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
        this.passData.tableData[this.passData.tableData.length - 1].glAcctId = row.glAcctId;
        this.passData.tableData[this.passData.tableData.length - 1].glShortCd = row.shortCode;
        this.passData.tableData[this.passData.tableData.length - 1].glShortDesc = row.shortDesc;
        this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      }
      this.table.refreshTable();
    }
  }

  onClickSave(){
    if(this.editAmtEqualsOrigAmt()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Unable to save the changes. The Total Debit and Credit Amounts must still be the same as the original and must still be balanced.';
      this.successDiag.open();
    }else if(this.checkReqFields()){
      this.dialogIcon = 'error';
      this.successDiag.open();
    }else if(this.checkChangesAcctEnt()){
      this.dialogIcon = 'info';
      this.dialogMessage = 'Nothing to save.';
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  save(){
    this.savedData = this.passData.tableData.filter(a=>a.edited && !a.deleted).map(b=>{b.createUser = this.ns.getCurrentUser();
                                                                                               b.createDate = this.ns.toDateTimeString(0);
                                                                                               b.updateUser = this.ns.getCurrentUser();
                                                                                               b.updateDate = this.ns.toDateTimeString(0);
                                                                                               return b;});
      this.deletedData = this.passData.tableData.filter(a=>a.deleted);
      console.log(this.savedData);
      console.log(this.deletedData);

      this.savedData.forEach(a=>{
        if(!a.add){
          a.updateUser = this.ns.getCurrentUser();
          a.updateDate = this.ns.toDateTimeString(0);
        }
      })

      let params = {
        tranId: this.tranDetails.tranId,
        histNo: 0,
        reason: this.tranDetails.reason,
        createUser: this.ns.getCurrentUser(),
        updateUser: this.ns.getCurrentUser(),
        saveList: this.savedData,
        delList: this.deletedData
      }

      this.accountingService.editAcctEnt(params).subscribe(a=>{
        if(a['returnCode']==0){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          this.dialogIcon = 'success';
          this.successDiag.open();
          this.table.markAsPristine();
          this.form.control.markAsPristine();
          console.log('marked as pristine');
          this.retrieveData(this.tranDetails.tranId);
        }
      });
  }

  restore(){
    let params = {
      tranId: this.tranDetails.tranId,
      histNo: this.tranDetails.histNo
    }

    console.log(params);

    this.accountingService.restoreAcctEnt(params).subscribe(a=>{
        if(a['returnCode']==0){
          this.dialogIcon = 'error-message';
          this.restoreMdl.openNoClose();
        }else{
          this.dialogIcon = 'success';
          this.table.markAsPristine();
          console.log('marked as pristine');
          this.retrieveData(this.tranDetails.tranId);
          this.restoreMdl.openNoClose();
        }
      });
  }

  //VALIDATIONS STARTS HERE
  editAmtEqualsOrigAmt(): boolean{
    let foreignCrAmt: number = 0;
    let foreignDbAmt: number = 0;
    let creditAmt: number = 0;
    let debitAmt: number = 0;

    for(var i of this.passData.tableData){
      if(!i.deleted){
        foreignCrAmt += Math.round(i.foreignCreditAmt * 100) / 100;
        foreignDbAmt += Math.round(i.foreignDebitAmt * 100) / 100;
        creditAmt    += Math.round(i.creditAmt * 100) / 100;
        debitAmt     += Math.round(i.debitAmt * 100) / 100;
      }
    }
    console.log(this.originalCrDr.foreignCreditAmt + '/' + foreignCrAmt);
    console.log(this.originalCrDr.foreignDebitAmt + '/' + foreignDbAmt);
    console.log(this.originalCrDr.creditAmt + '/' + creditAmt);
    console.log(this.originalCrDr.debitAmt + '/' + debitAmt);
    if(this.originalCrDr.foreignCreditAmt !== foreignCrAmt ||
       this.originalCrDr.foreignDebitAmt  !== foreignDbAmt ||
       this.originalCrDr.creditAmt        !== creditAmt    ||
       this.originalCrDr.debitAmt         !== debitAmt){
      return true;
    }
    return false;
  }

  checkReqFields(): boolean{
    if(this.tranDetails.reason == null || (this.tranDetails.reason != null && this.tranDetails.reason.length ==0)){
      return true;
    }
    return false;
  }

  checkChangesAcctEnt(): boolean{
    for(var i of this.passData.tableData){
      if(i.edited){
        return false;
      }
    }
    return true;
  }
}
