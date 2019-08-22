import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from '@app/_services';


@Component({
  selector: 'app-acct-it-edited-acct-entries',
  templateUrl: './acct-it-edited-acct-entries.component.html',
  styleUrls: ['./acct-it-edited-acct-entries.component.css']
})
export class AcctItEditedAcctEntriesComponent implements OnInit {

  passDataListOfEditedTransactions: any = {
    tableData: this.accountingService.getAccItEditedTransactions(),
    tHeader: ["Tran Type", "Ref. No.", "Tran Date", "Payee/Payor", "Particulars", "Edited By", "Date Edited", "Reason", "Status", "Amount"],
    dataTypes: ["text", "text", "date", "text", "text", "text", "date", "text", "text", "currency"],
    total: [null, null, null, null, null, null, null, null, "Total", "amount"],
    uneditable: [true, true, true, true, true, true, true, true, true, true],
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
    pageID: 1,

  };

  passDataOldAcctEntries: any = {
    tableData: this.accountingService.getAccItEditedOldAcctEntries(),
    tHeader: ["Account Code", "Account Name", "SL Type", "SL Name", "Debit", "Credit"],
    dataTypes: ["text", "text", "text", "text", "currency", "currency"],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt'],
    total: [null, null, null, 'Total', "debitAmt", "creditAmt"],
    tableOnly: true,
    pageID: 2,
    pageLength: 5,
  };

  passDataLatestAcctEntries: any = {
    tableData: this.accountingService.getAccItEditedLatestAcctEntries(),
    tHeader: ["Account Code", "Account Name", "SL Type", "SL Name", "Debit", "Credit"],
    dataTypes: ["text", "text", "text", "text", "currency", "currency"],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt'],
    total: [null, null, null, 'Total', "debitAmt", "creditAmt"],
    tableOnly: true,
    pageID: 3,
    pageLength: 5,
  };

  constructor(private titleService: Title, private modalService: NgbModal, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Edited Accounting Entries");
  }

  showModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }
}
