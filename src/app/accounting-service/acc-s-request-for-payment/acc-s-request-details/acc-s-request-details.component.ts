import { Component, OnInit, Input } from '@angular/core';
import { AccountingSPaytReqCheckVoucher, AccountingSPaytReqPettyCashVoucher, AccountingSPaytReqPRMFE, AccountingSPaytReqOthers } from '@app/_models';
import { AccountingService } from '@app/_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-acc-s-request-details',
  templateUrl: './acc-s-request-details.component.html',
  styleUrls: ['./acc-s-request-details.component.css']
})
export class AccSRequestDetailsComponent implements OnInit {

  @Input() paymentType: string = "";
  date: string;

  checkVoucherData: any = {
  	tableData: this.accountingService.getAccountingSPaytReqCheckVoucher(),
  	tHeader: ['Item', 'Description', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
  	dataTypes: ['text', 'text', 'text', 'percent', 'currency', 'currency'],
  	nData: new AccountingSPaytReqCheckVoucher(null,null,null,null,null,null),
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null, 'Total', 'amount', 'amountPhp'],
  	genericBtn: 'Save',
    widths: ['auto','auto',1,90,125,125]
  }

  pettyCashVoucherData: any = {
    tableData: this.accountingService.getAccountingSPaytReqPettyCashVoucher(),
    tHeader: ['PCV Year', 'PCV No.', 'PCV Date', 'Payee', 'Purpose', 'Replenishment', 'Status', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes: ['text', 'number', 'date', 'text', 'text', 'checkbox', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: new AccountingSPaytReqPettyCashVoucher(null,null,null,null,null,null,null,null,null,null,null),
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, null, null, null, null, null, 'Total', 'amount', 'amountPhp'],
    genericBtn: 'Save',
    widths: [20, 20, 90,'auto','auto', 1, 1 ,1,90,125,125]
  }

  PRMFEData: any = {
    tableData: this.accountingService.getAccountingSPaytReqPRMFE(),
    tHeader: ['Emp. No', 'Employee', 'Department', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes: ['number', 'text', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: new AccountingSPaytReqPRMFE(null,null,null,null,null,null,null),
    magnifyingGlass: ["empNo"],
    paginateFlag: true,
    infoFlag: true,
    pageID: 3,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, null, 'Total', 'amount', 'amountPhp'],
    genericBtn: 'Save',
    widths: [150, 'auto','auto', 1,125,125,125]
  }

  othersData: any = {
    tableData: this.accountingService.getAccountingSPaytReqOthers(),
    tHeader: ['Item', 'Description', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes: ['text', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: new AccountingSPaytReqOthers(null,null,null,null,null,null),
    paginateFlag: true,
    infoFlag: true,
    pageID: 2,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', 'amount', 'amountPhp'],
    genericBtn: 'Save',
    widths: ['auto','auto',1,90,125,125]
  }

  constructor(private accountingService: AccountingService) {
      this.date = new Date().toISOString().slice(0,16);
  }

  ngOnInit() {
    if(this.paymentType === null){
      this.paymentType = "";
    }
  }

}
