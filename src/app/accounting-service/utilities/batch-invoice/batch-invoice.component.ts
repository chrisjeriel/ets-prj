import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BatchOR } from '@app/_models';
import { AccountingService,NotesService,MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { DecimalPipe } from '@angular/common';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-batch-invoice',
  templateUrl: './batch-invoice.component.html',
  styleUrls: ['./batch-invoice.component.css']
})
export class BatchInvoiceComponent implements OnInit {
   @ViewChild('batchInvoice') table: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild('viewInvoiceModal') viewinvoiceModal: ModalComponent;
   @ViewChild(MtnCurrencyComponent) currLov: MtnCurrencyComponent;
     @ViewChild('passLOV') payeeLov: LovComponent;

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
  inquiryFlag: boolean = false;
  viewFlag: boolean = false;
  oldRecord : any ={
      tableData:[]
  };
  invNoDigits: any;


  
  PassData: any = {
  	tableData: [],
  	tHeader: ['G', 'P', 'Invoice Date', 'Invoice No', 'Jv No.', 'JV Date','Billed To', 'Particulars','Amount'],
  	dataTypes: ['checkbox','checkbox', 'date', 'text', 'text','date','text','text','currency'],
    addFlag: false,
    genericBtn: 'View Invoice Details',
  	searchFlag: true,
  	pageLength: 10,
    infoFlag: true,
    paginateFlag: true,
  	widths: [1,1,1,1,1,1,200,350,150],
    uneditable: [false,false,true,true,true,true,true,true,true],
    pageID: 'invoiceBatchPrint',
    disableGeneric: true,
    keys: ['invoiceNocheck', 'printCheck', 'invoiceDate','invoiceNo','jvNo','jvDate','payee','particulars','localAmt'],
  }

  nData: any = {
      invoiceId : null,
      invoiceNo : null,
      invoiceDate : this.ns.toDateTimeString(0),
      invoiceStat   : 'N',
      invoiceStatDesc : "New",
      autoTag   : 'N',
      currCd : 'PHP',
      currRate : 1,
      invoiceAmt : null,
      jvDate : null,
      jvNo : null,
      jvYear : null,
      localAmt: null,
      particulars : null,
      payee : null,
      payeeNo : null,
      refNoDate : null,
      refNoTranId : null,
      tranTypeCd : null,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  };

  selectedrecord: any = {};

  invoiceDate: any = {
    date: '',
    time: ''
  }

  indexRow:any;
  mdlType: any;
  errorInvBool: boolean = true;

  passLov: any = {
    selector: '',
    activeTag: '',
    hide: []
  }

  constructor(private accountingService: AccountingService, private modalService: NgbModal,private decimal : DecimalPipe,private router: Router,private ns: NotesService,private ms: MaintenanceService) { }

  ngOnInit() {
    this.getMtnAcseTranType();
    this.getInvNoDigits();
  }

  getInvNoDigits(){
    this.ms.getMtnParameters('N', 'AR_NO_DIGITS').subscribe(data => { 
     this.invNoDigits = parseInt(data['parameters'][0].paramValueN);
     console.log(this.invNoDigits);
    });
  }

  getMtnAcseTranType(){
    this.jvTypes = [];
    this.ms.getMtnAcseTranType('JV',null,null,null,null,'Y').subscribe(
      (data:any)=>{
        console.log(data);
        if(data.tranTypeList.length !== 0){
          data.tranTypeList = data.tranTypeList.filter(a=>{return a.tranTypeCd !== 0});
          this.jvTypes = data.tranTypeList;
        }
      }
    );
  }

  viewInvoice() {
    this.mdlType = "edit";
    this.viewFlag = true;
    this.invoiceDate.date = this.ns.toDateTimeString(this.selectedrecord.invoiceDate).split('T')[0];
    this.invoiceDate.time = this.ns.toDateTimeString(this.selectedrecord.invoiceDate).split('T')[1];
    this.viewinvoiceModal.openNoClose();
    if( this.selectedrecord.autoTag === 'Y'){
      this.inquiryFlag = true;
    }else {
      this.inquiryFlag = false;
    }
  }

  addInvoice(){
    this.mdlType = "add";
    this.viewFlag = false;
    this.inquiryFlag = false;
    this.selectedrecord = [];
    this.selectedrecord = this.nData;
    this.invoiceDate.date = this.ns.toDateTimeString(this.selectedrecord.invoiceDate).split('T')[0];
    this.invoiceDate.time = this.ns.toDateTimeString(this.selectedrecord.invoiceDate).split('T')[1];
    console.log(this.selectedrecord);
    this.viewinvoiceModal.openNoClose();
  }

  setCurrency(data){
    if(data != null){
      this.selectedrecord.currCd = data.currencyCd;
      this.selectedrecord.currRate = data.currencyRt;

      this.selectedrecord.localAmt = isNaN(this.selectedrecord.invoiceAmt) ? 0:this.selectedrecord.invoiceAmt * data.currencyRt;
      //this.selectedrecord.currRate = this.decimal.transform(this.selectedrecord.currRate,'1.6-6');
      this.ns.lovLoader(data.ev, 0);
      this.validateCurr(null,null);
      this.viewinvoiceModal.openNoClose();
    }else{
      this.viewinvoiceModal.openNoClose();
    }
  }

  validateCurr(data,key){
    if(key === 'invoiceAmt'){
       this.selectedrecord.invoiceAmt = parseFloat(data.target.value);
    }else if (key === 'currecyRt'){
       this.selectedrecord.currRate = parseFloat(data.target.value);
    }

    if(this.selectedrecord.invoiceAmt !== '' && this.selectedrecord.currRate !== ''){
      console.log(this.selectedrecord.invoiceAmt);
      this.selectedrecord.localAmt = isNaN(this.selectedrecord.invoiceAmt) ? 0:this.selectedrecord.invoiceAmt * this.selectedrecord.currRate;
      //this.selectedrecord.currRate = this.decimal.transform(this.selectedrecord.currRate,'1.6-6');
    }else{
      this.selectedrecord.localAmt = null;
    }
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  }

  cancelInvoice(){
     console.log(this.oldRecord);
     if (this.mdlType === 'edit'){
       this.invoiceDate.date = this.ns.toDateTimeString(this.oldRecord.invoiceDate).split('T')[0];
       this.invoiceDate.time = this.ns.toDateTimeString(this.oldRecord.invoiceDate).split('T')[1];
       this.PassData.tableData[this.indexRow].tranTypeCd = this.oldRecord.tranTypeCd;
       this.PassData.tableData[this.indexRow].jvNo = this.oldRecord.jvNo;
       this.PassData.tableData[this.indexRow].jvDate = this.oldRecord.jvDate;
       this.PassData.tableData[this.indexRow].payee = this.oldRecord.payee;
       this.PassData.tableData[this.indexRow].payeeNo = this.oldRecord.payeeNo;
       this.PassData.tableData[this.indexRow].particulars = this.oldRecord.particulars;
       this.PassData.tableData[this.indexRow].currCd = this.oldRecord.currCd;
       this.PassData.tableData[this.indexRow].invoiceAmt = this.oldRecord.invoiceAmt;
       this.PassData.tableData[this.indexRow].currRate = this.oldRecord.currRate;
       this.PassData.tableData[this.indexRow].localAmt = this.oldRecord.localAmt;
       //this.selectedrecord = this.oldRecord;
       this.PassData.disableGeneric = true;
     } else if (this.mdlType === 'add') {
       this.PassData.disableGeneric = true;
     }
     
  }

  saveInvoice(){
    console.log(this.mdlType);
    if (this.mdlType === 'edit'){
      this.PassData.tableData[this.indexRow].refNoDate    = this.ns.toDateTimeString(this.PassData.tableData[this.indexRow].refNoDate);
      this.PassData.tableData[this.indexRow].invoiceDate  = this.invoiceDate.date + 'T' + this.invoiceDate.time;
      this.PassData.tableData[this.indexRow].updateUser   = this.ns.getCurrentUser();
      this.PassData.tableData[this.indexRow].updateDate   = this.ns.toDateTimeString(0);
      this.PassData.tableData[this.indexRow].localAmt     = parseFloat(this.PassData.tableData[this.indexRow].localAmt.toString().split(',').join(''));
      this.PassData.tableData[this.indexRow].currRate    = parseFloat(this.PassData.tableData[this.indexRow].currRate.toString().split(',').join(''));
      console.log(this.PassData.tableData[this.indexRow].invoiceNo);
      this.PassData.disableGeneric = true;
      this.save(this.PassData.tableData[this.indexRow]);
    } else if (this.mdlType === 'add'){
      console.log(this.selectedrecord);
      this.save(this.selectedrecord);
    }
  }

  save(params){
    console.log(JSON.stringify(params));
     this.accountingService.saveAcseInvoice(params).subscribe(a=>{
        if(a['returnCode'] == -1){
              this.dialogIcon = "success";
              this.successDiag.open();
              this.table.overlayLoader = true;
              this.retrieveBatchInvoiceList(this.searchParams);
              this.selectedrecord = [];
          }else{
              this.viewinvoiceModal.openNoClose();
              this.dialogIcon = "error";
              this.successDiag.open();
          }
      });
  }

  retrieveBatchInvoiceList(search?){
    this.accountingService.getAcseBatchInvoice(search).subscribe( data => {
      console.log(data['batchInvoiceList']);
        var td = data['batchInvoiceList'].map(a => { 
                        var jvNoString = String(a.jvNo);
                        a.jvNo = a.jvYear + '-' + jvNoString.padStart(6,'0');
                        if(a.invoiceNo !== null){
                          var totn_string = String(a.invoiceNo);
                          a.invoiceNo = totn_string.padStart(6, '0');
                          a.invoiceNocheck = 'Y';
                          a.uneditable = ['invoiceNocheck'];
                        }
                        a.jvDate = this.ns.toDateTimeString(a.jvDate);
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
    this.oldRecord = JSON.parse(JSON.stringify(this.table.indvSelect));
    for (var i = this.PassData.tableData.length - 1; i >= 0; i--) {
            if(data == this.PassData.tableData[i]){
                this.indexRow = i;
                break;
            }
    }

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
        invoiceIdArray.push({ invoiceId: this.PassData.tableData[i].invoiceId, orNo: this.PassData.tableData[i].jvNo });
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

  onClickPayeeModal(){
    this.passLov.selector = 'payee';
    this.passLov.params = {};
    this.payeeLov.openLOV();
  }

  onClickJVModal(){
    this.passLov.selector = 'acseJvList';
    this.passLov.params = {};
    this.payeeLov.openLOV();
  }

  setSelectedData(data){
    console.log(data.data);
    if(data.data !== null){
        let selected = data.data;
        if( this.passLov.selector === 'payee'){
          this.selectedrecord.payee = selected.payeeName;
          this.selectedrecord.payeeNo = selected.payeeNo;
        } else if(this.passLov.selector === 'acseJvList'){
          console.log(selected);
          this.selectedrecord.refNoTranId = selected.tranId;
          this.selectedrecord.refNoDate = this.ns.toDateTimeString(selected.jvDate);
          this.selectedrecord.jvNo = selected.jvNo;
          this.selectedrecord.jvDate = this.ns.toDateTimeString(selected.jvDate);
          this.selectedrecord.particulars = selected.particulars;
          this.selectedrecord.currCd = selected.currCd;
          this.selectedrecord.currRate = selected.currRate;
          this.selectedrecord.invoiceAmt = selected.jvAmt;
          this.selectedrecord.localAmt = selected.localAmt;
          this.selectedrecord.tranTypeCd = selected.tranTypeCd;
        }
        
    }
  }

  validateInvoiceNo(data){
    let invoiceNo = this.pad(data.target.value);
    this.invoiceNo = invoiceNo;

    if (this.isEmptyObject(invoiceNo)){
      this.genInvoiceBool = true;
    } else {
      this.genInvoiceBool = false;
      this.retrieveInvSeriesNo(invoiceNo,invoiceNo);
    }
  }
  
  retrieveInvSeriesNo(invoiceNoFrm,invoiceNoTo){
    this.ms.getMtnAcseInvSeries(invoiceNoFrm,invoiceNoTo,null,null).subscribe( data => {
     if (data['invSeries'].length === 0){
       this.errorInvBool = true;
       this.genInvoiceBool = true;
       this.invoiceNo = null;
       this.dialogMessage = 'Cannot use Invoice No. It may not yet generated.';
       this.dialogIcon = 'error-message';
       this.successDiag.open();
     } else{
       this.errorInvBool = false;
     }
    });
  }

   pad(str) {
    if(str === '' || str == null){
      return '';
    }else{
        return String(str).padStart(this.invNoDigits, '0');
    }
  }

  isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
  }

  onClickSuccess(){
    this.modalService.dismissAll();
   /* if (this.dialogIcon === 'error-message') {
       if(this.errorInvBool){
         this.modalService.dismissAll();
         //this.viewinvoiceModal.openNoClose();
       }
    }else if(this.dialogIcon !== 'error'){
      this.modalService.dismissAll();
    }*/
  }

  generateInvoice(){
    let invoiceIdArray=[];

    for(var i=0; i < this.PassData.tableData.length;i++){
      if (this.PassData.tableData[i].invoiceNo === null && this.PassData.tableData[i].invoiceNocheck === 'Y'){
        invoiceIdArray.push({ invoiceId: this.PassData.tableData[i].invoiceId });
      }
    }
    console.log(invoiceIdArray);
    if(invoiceIdArray.length === 0){
      this.dialogMessage = 'Please choose records.';
      this.dialogIcon = 'error-message';
      this.successDiag.open();
    }else {
      console.log(invoiceIdArray);
    }
  }


}
