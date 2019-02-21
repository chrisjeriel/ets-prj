import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BatchOR } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-batch-invoice',
  templateUrl: './batch-invoice.component.html',
  styleUrls: ['./batch-invoice.component.css']
})
export class BatchInvoiceComponent implements OnInit {
  
  PassData: any = {
  	tableData: this.accountingService.getBatchOR(),
  	tHeader: ['G', 'P', 'OR Date', 'OR', 'Number', 'Payor','Amount'],
  	dataTypes: ['checkbox', 'checkbox', 'date', 'number', 'text','text', 'currency'],
  	nData: new BatchOR(null,null,null,null,null,null,null),
  	searchFlag: true,
  	pageLength: 10,
    infoFlag: true,
    paginateFlag: true,
  	widths: [50,50,  100,100, 250, 'auto', 150]
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
