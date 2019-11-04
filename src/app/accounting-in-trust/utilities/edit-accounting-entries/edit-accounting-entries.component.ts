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

@Component({
  selector: 'app-edit-accounting-entries',
  templateUrl: './edit-accounting-entries.component.html',
  styleUrls: ['./edit-accounting-entries.component.css']
})
export class EditAccountingEntriesComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {};
  tranListData: any = {};
  tranClass: string = 'AR';

  tranNo: string = '';

  tranDetails: any = {
    tranDate: '',
    backupBy: '',
    currCd: '',
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

  constructor(private accountingService: AccountingService, private titleService: Title, private router: Router, private ns: NotesService) {
  		this.titleService.setTitle("Acct-IT | Edit Acct Entries");
   }

  ngOnInit() {
    this.passData = this.accountingService.getAccEntriesPassData();
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
    this.accountingService.getAcitAcctEntries(data.data.tranId).subscribe(
      (data: any)=>{
        console.log(data);
        this.passData.tableData = data.list;
        this.table.refreshTable();
        this.table.overlayLoader = false;
      }
    );
  }
}
