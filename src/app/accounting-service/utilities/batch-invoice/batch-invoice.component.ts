import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BatchOR } from '@app/_models';
import { AccountingService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-batch-invoice',
  templateUrl: './batch-invoice.component.html',
  styleUrls: ['./batch-invoice.component.css']
})
export class BatchInvoiceComponent implements OnInit {


  dialogIcon: string = '';
  dialogMessage: string = '';
  jvTypes: any[] = [];
  jvTypeCd : string;
  jvNo : string;
  fromDate: string = "";
  toDate: string = "";
  genInvoiceBool: boolean = true;
  printInvoiceBool: boolean = false;
  stopInvoiceBool: boolean = true;
  boolSearch: boolean = false;
  boolRadioTag: boolean = true;

  
  PassData: any = {
  	tableData: [],
  	tHeader: ['G', 'P', 'Invoice Date', 'Invoice No', 'Jv No.', 'JV Date','Billed To','Amount'],
  	dataTypes: ['checkbox','checkbox', 'date', 'text', 'text','date','text', 'currency'],
  	nData: new BatchOR(null,null,null,null,null,null,null,null),
    addFlag: true,
    genericBtn: 'View Invoice Details',
  	searchFlag: true,
  	pageLength: 10,
    infoFlag: true,
    paginateFlag: true,
  	widths: [1,1,1,200,200,1,'auto',150],
    uneditable: [true,true,true,true,true,true,true],
    pageID: 'invoiceBatchPrint',
    disableGeneric: true
  }

  constructor(private accountingService: AccountingService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  view() {
      $('#modalBtn').trigger('click');
  }

  add(){
     $('#add, #modalBtn').trigger('click');
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  }
  

}
