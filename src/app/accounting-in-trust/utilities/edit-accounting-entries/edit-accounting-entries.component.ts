import { Component, OnInit, ViewChild, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingEntriesCV } from '@app/_models';
import { AccountingService, NotesService } from '@app/_services';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor(private accountingService: AccountingService, private titleService: Title, private router: Router, private ns: NotesService) {
  		this.titleService.setTitle("Acct-IT | Edit Acct Entries");
   }

  ngOnInit() {
    this.passData = this.accountingService.getAccEntriesPassData();
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

  setSelectedData(data){
    this.table.overlayLoader = true;
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

    var sub$ = forkJoin(this.accountingService.getAcitAcctEntries(data.data.tranId),
                        this.accountingService.getAcitEditedAcctEntries(data.data.tranId))
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
        this.passData.tableData = acctEntries.list.map(a=>{a.showMG = 1; return a;});
        this.table.refreshTable();
        this.table.overlayLoader = false;
      }
    );

    for(var i of this.passData.tableData){
      this.originalCrDr.foreignCreditAmt += i.foreignCreditAmt;
      this.originalCrDr.foreignDebitAmt  += i.foreignDebitAmt;
      this.originalCrDr.creditAmt        += i.creditAmt;
      this.originalCrDr.debitAmt         += i.debitAmt;
    }
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

      this.passData.tableData = this.passData.tableData.filter(a=>a.glAcctId != '');
      for(let row of data.data){
        this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
        this.passData.tableData[this.passData.tableData.length - 1].glAcctId = row.glAcctId;
        this.passData.tableData[this.passData.tableData.length - 1].glShortCd = row.shortCode;
        this.passData.tableData[this.passData.tableData.length - 1].glShortDesc = row.shortDesc;
      }
      this.table.refreshTable();
    }
  }
}
