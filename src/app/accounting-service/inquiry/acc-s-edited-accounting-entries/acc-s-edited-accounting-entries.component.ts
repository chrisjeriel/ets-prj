import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-acc-s-edited-accounting-entries',
  templateUrl: './acc-s-edited-accounting-entries.component.html',
  styleUrls: ['./acc-s-edited-accounting-entries.component.css']
})
export class AccSEditedAccountingEntriesComponent implements OnInit, OnDestroy {

  @ViewChild('mainTbl') mainTbl: CustEditableNonDatatableComponent;
  @ViewChild('oldTbl')  oldTbl: CustEditableNonDatatableComponent;
  @ViewChild('latestTbl') latestTbl: CustEditableNonDatatableComponent;
  @ViewChild(ModalComponent) mdl: ModalComponent;

  passDataListOfEditedTransactions: any = {
    tableData: [],
    tHeader: ["Tran Class", "Ref. No.", "Tran Date", "Payee/Payor", "Particulars", "Edited By", "Date Edited", "Reason", "Status", "Amount"],
    dataTypes: ["text", "text", "date", "text", "text", "text", "date", "text", "text", "currency"],
    total: [null, null, null, null, null, null, null, null, "Total", "amount"],
    uneditable: [true, true, true, true, true, true, true, true, true, true],
    keys: ['tranClass', 'refNo', 'tranDate', 'payee', 'particulars', 'editor', 'editDate', 'reason', 'status', 'amount'],
    genericBtn: 'View Edited Entries',
    filters: [
      {
        key: 'tranType',
        title: 'Tran Type',
        dataType: 'text'
      },
      {
        key: 'refNo',
        title: 'Ref. No.',
        dataType: 'text'
      },
      {
        key: 'tranDate',
        title: 'Tran Date',
        dataType: 'date'
      },
      {
        key: 'payeePayor',
        title: 'Payee/Payor',
        dataType: 'text'
      },
      {
        key: 'particulars',
        title: 'Particulars',
        dataType: 'text'
      },
      {
        key: 'editedBy',
        title: 'Edited By',
        dataType: 'text'
      },
      {
        key: 'dateEdited',
        title: 'Date Edited',
        dataType: 'date'
      },
      {
        key: 'reason',
        title: 'Reason',
        dataType: 'text'
      },
      {
        key: 'status',
        title: 'Status',
        dataType: 'text'
      },
      {
        key: 'amount',
        title: 'Amount',
        dataType: 'text'
      },
    ],
    pageLength: 15,
    searchFlag: true,
    infoFlag: true,
    paginateFlag: true,
    disableGeneric: true,
    pageID: 1,

  };

  passDataOldAcctEntries: any = {
    tableData: [],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','Local Debit','Local Credit','Debit','Credit'],
    uneditable:[true,true,true,true,true,true,true,true],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt','foreignDebitAmt','foreignCreditAmt'],
    dataTypes: ['text','text','text','text','currency','currency','currency','currency'],
    total: [null,null,null,'TOTAL DEBIT AND CREDIT','debitAmt', 'creditAmt','foreignDebitAmt','foreignCreditAmt'],
    pageID: 2,
    pageLength: 5,
    paginateFlag: true,
    infoFlag: true
  };

  passDataLatestAcctEntries: any = {
    tableData: [],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','Local Debit','Local Credit','Debit','Credit'],
    uneditable:[true,true,true,true,true,true,true,true],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt','foreignDebitAmt','foreignCreditAmt'],
    dataTypes: ['text','text','text','text','currency','currency','currency','currency'],
    total: [null,null,null,'TOTAL DEBIT AND CREDIT','debitAmt', 'creditAmt','foreignDebitAmt','foreignCreditAmt'],
    pageID: 3,
    pageLength: 5,
    paginateFlag: true,
    infoFlag: true
  };

  filters: any = {
    tranClass: '',
    tranDateFrom: '',
    tranDateTo: ''
  }

  sub: Subscription;

  information: any = {
    amount: '',
    currCd: '',
    currRate: '',
    editDate: '',
    editedBy: '',
    histNo: '',
    localAmt: '',
    particulars: '',
    payee: '',
    reason: '',
    refNo: '',
    status: '',
    tranClass: '',
    tranClassDesc: '',
    tranDate: '',
    tranId: '',
    tranTypeName: ''
  }

  constructor(private titleService: Title, public modalService: NgbModal, private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    /*this.titleService.setTitle("Acct-Serv | Edited Accounting Entries");*/
  }

  ngOnDestroy(){
    if(this.sub !== undefined){
      this.sub.unsubscribe();
    }
  }

  retrieveAcctEntInq(){
    this.mainTbl.overlayLoader = true;
    this.accountingService.getAcseAcctEntInq(this.filters.tranClass, this.filters.tranDateFrom, this.filters.tranDateTo).subscribe(
      (data:any)=>{
        if(data.edtAcctEntList.length !== 0){
          this.passDataListOfEditedTransactions.tableData = data.edtAcctEntList;
        }else{
          this.passDataListOfEditedTransactions.tableData = [];
        }
        this.mainTbl.refreshTable();
        this.mainTbl.overlayLoader = false;
      }
    );
  }

  onRowClick(data){
    console.log(data);
    if(data !== null){
      this.information = data;
      switch(data.tranClass){
        case 'OR':
          this.information.tranClassDesc = 'Official Receipt';
          break;
        case 'JV':
          this.information.tranClassDesc = 'Journal Voucher';
          break;
        case 'CV':
          this.information.tranClassDesc = 'Check Voucher';
          break;
      }
      this.information.tranDate = this.ns.toDateTimeString(this.information.tranDate).split('T')[0];
      this.information.editDate = this.ns.toDateTimeString(this.information.editDate).split('T')[0];
      this.passDataOldAcctEntries.tableData = [];
      this.passDataLatestAcctEntries.tableData = [];
      this.oldTbl.refreshTable();
      this.latestTbl.refreshTable();
      this.passDataListOfEditedTransactions.disableGeneric = false;
    }else{
      this.information = {
        amount: '',
        currCd: '',
        currRate: '',
        editDate: '',
        editedBy: '',
        histNo: '',
        localAmt: '',
        particulars: '',
        payee: '',
        reason: '',
        refNo: '',
        status: '',
        tranClass: '',
        tranClassDesc: '',
        tranDate: '',
        tranId: '',
        tranTypeName: ''
      }
      this.passDataListOfEditedTransactions.disableGeneric = true;
      this.passDataOldAcctEntries.tableData = [];
      this.passDataLatestAcctEntries.tableData = [];
      this.oldTbl.refreshTable();
      this.latestTbl.refreshTable();
    }
  }

  showModal(content) {
    this.mdl.openNoClose();
    /*setTimeout(()=>{
      this.oldTbl.refreshTable();
      this.latestTbl.refreshTable();
    },0)*/
    this.oldTbl.overlayLoader = true;
    this.latestTbl.overlayLoader = true;
    var sub$ = forkJoin(this.accountingService.getAcseAcctEntries(this.information.tranId),
                        this.accountingService.getAcseAcctEntBackup(this.information.tranId,this.information.histNo)).pipe(map(([newAcctEnt, oldAcctEnt]) => { return { newAcctEnt, oldAcctEnt }; }));
    this.sub = sub$.subscribe(
      (forkData:any)=>{
        let oldAcctEnt = forkData.oldAcctEnt;
        let newAcctEnt = forkData.newAcctEnt;
        console.log(oldAcctEnt);
        console.log(newAcctEnt);
        this.passDataOldAcctEntries.tableData = oldAcctEnt.backupAcctEnt;
        this.passDataLatestAcctEntries.tableData = newAcctEnt.acctEntries;
        console.log(this.passDataOldAcctEntries.tableData);
        console.log(this.passDataLatestAcctEntries.tableData);
          setTimeout(()=>{
            this.oldTbl.refreshTable();
            this.latestTbl.refreshTable();
            this.oldTbl.overlayLoader = false;
            this.latestTbl.overlayLoader = false;
          },0)
      }
    );
  }
}
