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
    colSize: ['100%', '100%', '100%', '100%', '150px', '100%', '100%', '100%', '100%', '100%'],
    total: [null, null, null, null, null, null, null, null, "Total", "amount"],
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
    pagination: true,
    pageLength: 20,
    pageStatus: true,
    pageID: 1,

  };

  passDataOldAcctEntries: any = {
    tableData: this.accountingService.getAccItEditedOldAcctEntries(),
    tHeader: ["Code", "Account", "SL Type", "SL Name", "Debit", "Credit"],
    dataTypes: ["text", "text", "text", "text", "currency", "currency"],
    total: [null, null, null, 'Total', "debit", "credit"],
    tableOnly: true,
    pageID: 2,
    pageLength: 5,
  };

  passDataLatestAcctEntries: any = {
    tableData: this.accountingService.getAccItEditedLatestAcctEntries(),
    tHeader: ["Code", "Account", "SL Type", "SL Name", "Debit", "Credit"],
    dataTypes: ["text", "text", "text", "text", "currency", "currency"],
    total: [null, null, null, 'Total', "debit", "credit"],
    tableOnly: true,
    pageID: 3,
    pageLength: 5,
  };

  constructor(private titleService: Title, private modalService: NgbModal, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Edited Accounting Entries");
  }

}
