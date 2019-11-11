import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BatchOR } from '@app/_models';
import { AccountingService,NotesService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-batch-invoice',
  templateUrl: './batch-invoice.component.html',
  styleUrls: ['./batch-invoice.component.css']
})
export class BatchInvoiceComponent implements OnInit {
   @ViewChild('batchInvoice') table: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  dialogIcon: string = '';
  dialogMessage: string = '';
  jvTypes: any[] = [];
  jvTypeCd : string = "";
  jvNo : string = "";
  fromDate: string = "";
  toDate: string = "";
  genInvoiceBool: boolean = true;
  printInvoiceBool: boolean = true;
  stopInvoiceBool: boolean = true;
  boolSearch: boolean = false;
  boolRadioTag: boolean = true;
  radioTagVal: any = '';
  searchParams: any[] = [];

  
  PassData: any = {
  	tableData: [],
  	tHeader: ['G', 'P', 'Invoice Date', 'Invoice No', 'Jv No.', 'JV Date','Billed To', 'Particulars','Amount'],
  	dataTypes: ['checkbox','checkbox', 'date', 'text', 'text','date','text','text','currency'],
    addFlag: true,
    genericBtn: 'View Invoice Details',
  	searchFlag: true,
  	pageLength: 10,
    infoFlag: true,
    paginateFlag: true,
  	widths: [1,1,1,1,1,1,200,350,150],
    uneditable: [true,false,false,false,false,false,false,false,false],
    pageID: 'invoiceBatchPrint',
    disableGeneric: true,
    keys: ['invoiceNocheck', 'printCheck', 'invoiceDate','invoiceNo','jvNo','jvDate','payor','particulars','localAmt'],
  }

  selectedrecord: any = {};

  constructor(private accountingService: AccountingService, private modalService: NgbModal,private router: Router,private ns: NotesService) { }

  ngOnInit() {
  }

  view() {
      $('#modalBtn').trigger('click');
  }

  add(){
     console.log('Add invoice');
     $('#add, #modalBtn').trigger('click');
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  }

  retrieveBatchInvoiceList(search?){
    this.accountingService.getAcseBatchInvoice(search).subscribe( data => {
      console.log(data['batchInvoiceList']);
        var td = data['batchInvoiceList'].map(a => { 
                        var totn_string = String(a.invoiceNo);
                        a.invoiceNo = totn_string.padStart(6, '0');

                        if(a.invoiceNo !== null){
                          a.invoiceNocheck = 'Y';
                          a.uneditable = ['invoiceNocheck'];
                        }
                        a.createDate = this.ns.toDateTimeString(a.createDate);
                        a.updateDate = this.ns.toDateTimeString(a.updateDate);
                        return a; });
        this.PassData.tableData = td;
        this.table.overlayLoader = false;
        this.table.refreshTable();
        this.printInvoiceBool = false;
        this.stopInvoiceBool = false;
        this.boolRadioTag = false;
        this.radioTagVal = null;
    });
  }

  onClickSearch(){
     this.fromDate === null   || this.fromDate === undefined ?'':this.fromDate;
     this.toDate === null || this.toDate === undefined?'':this.toDate;
     this.jvNo === null || this.jvNo === undefined ?'':this.jvNo;
     this.jvTypeCd === null || this.jvTypeCd === undefined ?'':this.jvTypeCd;
     this.PassData.tableData = [];
     this.PassData.disableGeneric = true;
     this.table.overlayLoader = true;
     this.searchParams = [    {key: "jvDateFrom", search: this.fromDate },
                               {key: "jvDateTo", search: this.toDate },
                               {key: "jvNo", search: this.jvNo},
                               {key: "jvTypeCd", search: this.jvTypeCd},
                               ]; 
     console.log(this.searchParams);
     this.retrieveBatchInvoiceList(this.searchParams);
  }

   onRadioTagChange(){
    console.log(this.PassData.tableData.length);
    if(this.PassData.tableData.length === 0){
    } else {
      if (this.radioTagVal === 'untag'){
        this.onClicktag('N');
      } else if (this.radioTagVal === 'tag'){
        this.onClicktag('Y');
      }
    }
  }

  onTableClick(data){
    console.log(data);
    this.selectedrecord = data;
    this.PassData.disableGeneric = data == null;
  }

  onClicktag(tag?){
    for(var i=0; i < this.PassData.tableData.length;i++){
      if (this.PassData.tableData[i].invoiceNo === null){
        this.PassData.tableData[i].invoiceNocheck = tag;
        this.PassData.tableData[i].printCheck = tag;
      } else {
        this.PassData.tableData[i].printCheck = tag;
      }
    }
  }

  printInvoice(){
    let invoiceIdArray=[];

    for(var i=0; i < this.PassData.tableData.length;i++){
      if (this.PassData.tableData[i].jvNo !== null && this.PassData.tableData[i].printCheck === 'Y'){
        tranIdArray.push({ invoiceId: this.PassData.tableData[i].invoiceId, orNo: this.PassData.tableData[i].jvNo });
      }
    }

    if(invoiceIdArray.length === 0){
      this.dialogMessage = 'Please choose records to be printed.';
      this.dialogIcon = 'error-message';
      this.successDiag.open();
    } else {
     /* let selectedBatchData = [];
       this.batchData.reportRequest = [];

      for(let i=0;i<tranIdArray.length ;i++){ 
        selectedBatchData.push({ tranId :  tranIdArray[i].tranId , reportName : 'ACSER_OR' , userId : JSON.parse(window.localStorage.currentUser).username }); 
        this.changeStatData.printOrList.push({tranId :  tranIdArray[i].tranId, orNo: tranIdArray[i].orNo, updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
      }

      this.batchData.reportRequest = selectedBatchData;
      this.printPDF(this.batchData);
      this.loading = true;*/
    }  
  }
  

}
