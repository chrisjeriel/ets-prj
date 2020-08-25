import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BatchOR } from '@app/_models';
import { AccountingService,NotesService,MaintenanceService, PrintService } from '@app/_services';
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
import { environment } from '@environments/environment';



@Component({
  selector: 'app-batch-invoice',
  templateUrl: './batch-invoice.component.html',
  styleUrls: ['./batch-invoice.component.css']
})
export class BatchInvoiceComponent implements OnInit {
   @ViewChild('batchInvoice') table: CustEditableNonDatatableComponent;
   @ViewChild('invoiceItems') invtable: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild('viewInvoiceModal') viewinvoiceModal: ModalComponent;
   @ViewChild(MtnCurrencyComponent) currLov: MtnCurrencyComponent;
   @ViewChild('passLOV') payeeLov: LovComponent;
   @ViewChild("confirmSave") confirmSave: ConfirmSaveComponent;
   @ViewChild('printModal') printMdl: ModalComponent;
   @ViewChild('printConfirmModal') printConfirmModal: ModalComponent;

  dialogIcon: string = '';
  dialogMessage: string = '';
  jvTypes: any[] = [];
  tranTypes: any[] = [];
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
  loading:boolean = false; /*Added by totz, needed in html, please check your code.*/

  PassData: any = {
  	tableData: [],
  	tHeader: ['G', 'P', 'Invoice Date', 'Invoice No', 'Tran No.', 'Tran Date','Billed To', 'Particulars','Amount'],
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
    keys: ['invoiceNocheck', 'printCheck', 'invoiceDate','invoiceNo','tranNo','tranDate','payor','particulars','localAmt'],
  }

  passDataInvoiceItems: any = {
    tableData: [],
    tHeader: ['Item No', 'Item Desc','Curr Cd','Curr Rate','Item Amount', 'Local Amt'],
    dataTypes: ['text','text','select', 'percent','currency','currency'],
    addFlag: true,
    nData:{
      invoiceId : null,
      itemNo : null,
      itemDesc   : null,
      currCd : 'PHP',
      currRate : 1,
      itemAmt : null,
      localAmt: null,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0)
    },
    genericBtn: 'Delete',
    disableGeneric: true,
    pageLength: 5,
    infoFlag: true,
    paginateFlag: true,
    widths: [1,1,1,1,1,1],
    uneditable: [true,false,false,false,false,true],
    pageID: 'invoiceItems',
    keys: ['itemNo', 'itemDesc', 'currCd','currRate','itemAmt','localAmt'],
    total:[null,null,null,null,'Total','localAmt'],
    opts: [ {selector: 'currCd', prev: [], vals: []} ],
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
      tranDate : null,
      tranNo : null,
      tranYear : null,
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
  invoiceNo: any;
  invoiceNoArray=[];
  invoiceIdArray=[];

  passLov: any = {
    selector: '',
    activeTag: '',
    hide: []
  }

  genInvoiceData: any = {
        invoiceNoList: []
  };
  searchtranTypeClass: any;
  tranTypeClass: any;
  currencyData: any[] = [];
  acitInvItems  : any = { 
                "invoiceItemList"  : [],
                "invoiceDelItemList"  : []}
  deletedData:any[] =[];
  selecteditemrecord: any = {};
  batchData   : any = { 
                    "reportRequest": []
                    };
  lastInvNo: any;
  changeStatData: any = {
        printInvoiceList: []
    };

  checkAllGVal :any = '';
  checkAllPVal :any = '';

  printData : any = {
    selPrinter  : '',
    printers    : [],
    destination : 'screen'
  };
  
  constructor(private accountingService: AccountingService, public modalService: NgbModal,private decimal : DecimalPipe,private router: Router,private ns: NotesService,private ms: MaintenanceService, private ps : PrintService) { }

  ngOnInit() {
    this.getPrinters();
    this.getInvNoDigits();
    this.getCurr();
  }

  checkCode(ev){
    this.ns.lovLoader(ev, 1);
    this.currLov.checkCode(this.selectedrecord.currCd,ev);
  }

  getCurr(){
    this.ms.getMtnCurrency('','Y').subscribe(
      (data:any)=>{ 
        console.log(data);
        this.currencyData = data.currency;
        this.passDataInvoiceItems.opts[0].vals = data.currency.map(a => a.currencyCd);
        this.passDataInvoiceItems.opts[0].prev = data.currency.map(a => a.currencyCd);
      });
  }

  onTableItemInvoiceClick(data){
    console.log(data);
    this.passDataInvoiceItems.disableGeneric = data == null;
    this.selecteditemrecord = data;
  }

  deleteItemInvoice(){
    if(this.invtable.indvSelect.okDelete == 'N'){
      this.dialogIcon = 'info';
      this.dialogMessage =  'Deleting this record is not allowed. This was already used in some accounting records.';
      this.successDiag.open();
    }else{
      this.invtable.selected  = [this.invtable.indvSelect]
      this.invtable.confirmDelete();
      $('#cust-table-container').addClass('ng-dirty');
    }
  }

  getInvItem(invoiceId?){
    this.accountingService.getAcseInvItems(invoiceId).subscribe(
      (data:any)=>{ 
        console.log(data);
        var td = data['invoiceItemList'].map(a => { 
                        a.createDate = this.ns.toDateTimeString(a.createDate);
                        a.updateDate = this.ns.toDateTimeString(a.updateDate);
                        return a; });
        this.passDataInvoiceItems.tableData = td;
        this.invtable.refreshTable();
      });
  }

  onChangeSearchTranClass(){
    this.PassData.tableData = [];
    this.PassData.disableGeneric = true;
    this.table.refreshTable();
    this.getMtnAcseTranType(this.searchtranTypeClass,'search');
  }

  onChangeTranClass(){
    this.getMtnAcseTranType(this.selectedrecord.tranClass,'modal');
  }


  getInvNoDigits(){
    this.ms.getMtnParameters('N', 'AR_NO_DIGITS').subscribe(data => { 
     this.invNoDigits = parseInt(data['parameters'][0].paramValueN);
     console.log(this.invNoDigits);
    });
  }

  getMtnAcseTranType(tranclass,type){
    this.jvTypes = [];
    this.tranTypes = [];
    this.ms.getMtnAcseTranType(tranclass,null,null,null,null,'Y').subscribe(
      (data:any)=>{
        console.log(data);
        if(data.tranTypeList.length !== 0){
          data.tranTypeList = data.tranTypeList.filter(a=>{return a.tranTypeCd !== 0});
          
          if (type === 'search'){
            this.jvTypes = data.tranTypeList;
          }else if (type === 'modal'){
            this.tranTypes = data.tranTypeList;
            console.log(this.tranTypes);
          }
          
      }
    });
  }

  viewInvoice() {
    this.mdlType = "edit";
    this.viewFlag = true;
    this.invoiceDate.date = this.ns.toDateTimeString(this.selectedrecord.invoiceDate).split('T')[0];
    this.invoiceDate.time = this.ns.toDateTimeString(this.selectedrecord.invoiceDate).split('T')[1];
    this.getMtnAcseTranType(this.selectedrecord.tranClass,'modal');
    this.getInvItem(this.selectedrecord.invoiceId);
   

    this.viewinvoiceModal.openNoClose();
    if( this.selectedrecord.autoTag === 'Y'){
      this.inquiryFlag = true;
    }else {
      this.inquiryFlag = false;
    }
  }

  resetSelectedRecord(){
    this.selectedrecord.tranNo = null;
    this.selectedrecord.tranNo = null;
    this.selectedrecord.autoTag = 'N';
    this.selectedrecord.tranDate = null;
    this.selectedrecord.localAmt = null;
    this.selectedrecord.particulars = null;
    this.selectedrecord.payor = null;
    this.selectedrecord.payeeCd = null;
    this.selectedrecord.payeeClassCd = null;
    this.selectedrecord.refNoDate = null;
    this.selectedrecord.refNoTranId = null;
    this.selectedrecord.tranTypeCd = null;
    this.selectedrecord.invoiceAmt = null;
    this.selectedrecord.invoiceDate = this.ns.toDateTimeString(0);
    this.selectedrecord.invoiceId = null;
    this.selectedrecord.invoiceNo = null;
    this.selectedrecord.invoiceStat = 'N';
    this.selectedrecord.invoiceStatDesc = 'New';
    this.selectedrecord.currCd = 'PHP';
    this.selectedrecord.currRate = 1;
    this.selectedrecord.createUser = this.ns.getCurrentUser();
    this.selectedrecord.createDate = this.ns.toDateTimeString(0);
    this.selectedrecord.updateUser = this.ns.getCurrentUser();
    this.selectedrecord.updateDate = this.ns.toDateTimeString(0);
  }

  addInvoice(){
    this.resetSelectedRecord();
    this.mdlType = "add";
    this.viewFlag = false;
    this.inquiryFlag = false;
    
    this.invoiceDate.date = this.ns.toDateTimeString(this.selectedrecord.invoiceDate).split('T')[0];
    this.invoiceDate.time = this.ns.toDateTimeString(this.selectedrecord.invoiceDate).split('T')[1];

    this.passDataInvoiceItems.tableData = [];
    this.invtable.refreshTable();
    this.getMtnAcseTranType(this.selectedrecord.tranClass,'modal');
    this.viewinvoiceModal.openNoClose();
    console.log(this.selectedrecord);
  }

  setCurrency(data){
    if(data != null){
      this.selectedrecord.currCd = data.currencyCd;
      this.selectedrecord.currRate = data.currencyRt;

      this.selectedrecord.localAmt = isNaN(this.selectedrecord.invoiceAmt) ? 0:this.selectedrecord.invoiceAmt * data.currencyRt;
      //this.selectedrecord.currRate = this.decimal.transform(this.selectedrecord.currRate,'1.6-6');
      this.ns.lovLoader(data.ev, 0);
      this.validateCurr(null,null);
      //this.viewinvoiceModal.openNoClose();
    }else{
      //this.viewinvoiceModal.openNoClose();
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
       this.PassData.tableData[this.indexRow].tranNo = this.oldRecord.tranNo;
       this.PassData.tableData[this.indexRow].tranDate = this.oldRecord.tranDate;
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
       this.retrieveBatchInvoiceList(this.searchParams);
     }
     
  }

  saveInvoice(){
    this.acitInvItems.invoiceDelItemList = [];
    this.acitInvItems.invoiceItemList = [];

    console.log(this.mdlType);
    if (this.mdlType === 'edit'){
      this.PassData.tableData[this.indexRow] = this.selectedrecord;
      if (this.PassData.tableData[this.indexRow].refNoDate !== null ){
        this.PassData.tableData[this.indexRow].refNoDate    = this.ns.toDateTimeString(this.PassData.tableData[this.indexRow].refNoDate);
      } 
    
/*      this.PassData.tableData[this.indexRow].localAmt     = parseFloat(this.PassData.tableData[this.indexRow].localAmt.toString().split(',').join(''));
      this.PassData.tableData[this.indexRow].currRate     = parseFloat(this.PassData.tableData[this.indexRow].currRate.toString().split(',').join(''));*/
      this.PassData.tableData[this.indexRow].invoiceDate  = this.invoiceDate.date + 'T' + this.invoiceDate.time;
      this.PassData.tableData[this.indexRow].updateUser   = this.ns.getCurrentUser();
      this.PassData.tableData[this.indexRow].updateDate   = this.ns.toDateTimeString(0);
      this.PassData.disableGeneric = true;

       if(this.checkFields(this.PassData.tableData[this.indexRow])){
           this.save(this.PassData.tableData[this.indexRow]);
         }else{
            this.viewinvoiceModal.openNoClose();
            this.dialogIcon = "error";
            this.successDiag.open();
         }
    

      //this.save(this.PassData.tableData[this.indexRow]);
    } else if (this.mdlType === 'add'){
      this.selectedrecord.invoiceDate  = this.invoiceDate.date + 'T' + this.invoiceDate.time;
      //this.save(this.selectedrecord);

       if(this.checkFields(this.selectedrecord)){   
          console.log(JSON.stringify(this.selectedrecord));     
          this.save(this.selectedrecord);
       }else{
          this.viewinvoiceModal.openNoClose();
          this.dialogIcon = "error";
          this.successDiag.open();
       }
    }
  }


  save(params){
     this.accountingService.saveAcseInvoice(params).subscribe(a=>{
            console.log(a);
        if(a['returnCode'] == -1){
              this.table.overlayLoader = true;
              this.retrieveBatchInvoiceList(this.searchParams);
               for(var i=0; i < this.deletedData.length;i++){
                    this.deletedData[i].invoiceId = a['invoiceIdOut'];
               }

               for(var i=0; i < this.passDataInvoiceItems.tableData.length;i++){
                   this.passDataInvoiceItems.tableData[i].updateUser = this.ns.getCurrentUser();
                   this.passDataInvoiceItems.tableData[i].updateDate = this.ns.toDateTimeString(0);
                   this.passDataInvoiceItems.tableData[i].invoiceId =  a['invoiceIdOut'];
                   this.passDataInvoiceItems.tableData[i].localAmt  = this.passDataInvoiceItems.tableData[i].itemAmt * this.passDataInvoiceItems.tableData[i].currRate;
               }

              this.acitInvItems.invoiceItemList = this.passDataInvoiceItems.tableData.filter(a=>a.edited && !a.deleted);
              this.acitInvItems.invoiceDelItemList = this.deletedData; 
              this.deletedData = [];
    
              if(this.acitInvItems.invoiceItemList.length === 0 && this.acitInvItems.invoiceDelItemList.length === 0  ){     
                this.dialogIcon = "success";
                this.successDiag.open();
              } else {
                console.log(JSON.stringify(this.acitInvItems));
                this.saveInvItems(this.acitInvItems);     
              }  
          }else{
              this.viewinvoiceModal.openNoClose();
              this.dialogIcon = "error";
              this.successDiag.open();
          }
      });

  }

  saveInvItems(params){
     let successBool: boolean;
     this.accountingService.saveAcseInvItems(params).pipe(
           finalize( () => this.finalizedSave(successBool) )
           ).subscribe(a=> {
               console.log(a);
                if (a ['returnCode'] == -1){
                  this.passDataInvoiceItems.disableGeneric = true;
                  successBool =  true;
                }else{
                  successBool = false;
                }
              });
  }

  finalizedSave(obj: boolean){
    if(obj){
      this.dialogIcon = "success";
      this.successDiag.open();
    }else{
      this.viewinvoiceModal.openNoClose();
      this.dialogIcon = "error";
      this.successDiag.open();
    }
  }

  retrieveBatchInvoiceList(search?){
    this.accountingService.getAcseBatchInvoice(search).subscribe( data => {
      console.log(data['batchInvoiceList']);
        var td = data['batchInvoiceList'].map(a => { 
                        if (a.tranNo != null){
                          var jvNoString = String(a.tranNo);
                          a.tranNo = a.tranYear + '-' + jvNoString.padStart(6,'0');
                        }
                        
                        if(a.invoiceNo !== null){
                          var totn_string = String(a.invoiceNo);
                          a.invoiceNo = totn_string.padStart(6, '0');
                          a.invoiceNocheck = 'Y';
                          a.uneditable = ['invoiceNocheck'];
                        }
                        a.tranDate = this.ns.toDateTimeString(a.tranDate);
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
        this.checkAllGVal = null;
        this.checkAllPVal = null;
    });
  }

  onClickSearch(){
     this.fromDate === null   || this.fromDate === undefined ?'':this.fromDate;
     this.toDate === null || this.toDate === undefined?'':this.toDate;
     this.jvNo === null || this.jvNo === undefined ?'':this.jvNo;
     this.jvTypeCd === null || this.jvTypeCd === undefined ?'':this.jvTypeCd;
     this.searchtranTypeClass === null || this.searchtranTypeClass === undefined ?'':this.searchtranTypeClass;
     this.PassData.tableData = [];
     this.PassData.disableGeneric = true;
     this.table.overlayLoader = true;
     this.searchParams = [    {key: "tranDateFrom", search: this.fromDate },
                               {key: "tranDateTo", search: this.toDate },
                               {key: "tranNo", search: this.jvNo},
                               {key: "tranTypeCd", search: this.jvTypeCd},
                               {key: "tranClass", search: this.searchtranTypeClass},
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
    if (data === null){
    }else {
      this.selectedrecord = data;
    }                                                                             
    
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

  // printInvoice(){
  //   this.lastInvNo = null;
  //   let invoiceIdArray=[];
  //   this.changeStatData.printInvoiceList = [];
    
  //   for(var i=0; i < this.PassData.tableData.length;i++){
  //     if (this.PassData.tableData[i].invoiceNo !== null && this.PassData.tableData[i].printCheck === 'Y'){
  //       invoiceIdArray.push({ invoiceId: this.PassData.tableData[i].invoiceId, invoiceNo: this.PassData.tableData[i].invoiceNo });
  //     }
  //   }

  //   if(invoiceIdArray.length === 0){
  //     this.errorInvBool = false;
  //     this.dialogMessage = 'Please choose records to be printed.';
  //     this.dialogIcon = 'error-message';
  //     this.successDiag.open();
  //   } else {
  //     let selectedBatchData = [];
  //      this.batchData.reportRequest = [];

  //     for(let i=0;i<invoiceIdArray.length ;i++){ 
  //       selectedBatchData.push({ invoiceId :  invoiceIdArray[i].invoiceId , reportName : 'ACSER_INVOICE' , userId : JSON.parse(window.localStorage.currentUser).username }); 
  //       this.changeStatData.printInvoiceList.push({invoiceId :  invoiceIdArray[i].invoiceId, invoiceNo:invoiceIdArray[i].invoiceNo,updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
  //     }
  //     this.batchData.reportRequest = selectedBatchData;

  //     this.printPDF(this.batchData);
  //     this.loading = true;
  //   }  
  // }

  printInvoice(){
    this.lastInvNo = null;
    let invoiceIdArray=[];
    this.changeStatData.printInvoiceList = [];
    
    for(var i=0; i < this.PassData.tableData.length;i++){
      if (this.PassData.tableData[i].invoiceNo !== null && this.PassData.tableData[i].printCheck === 'Y'){
        invoiceIdArray.push({ invoiceId: this.PassData.tableData[i].invoiceId, invoiceNo: this.PassData.tableData[i].invoiceNo });
      }
    }

    if(invoiceIdArray.length === 0){
      this.errorInvBool = false;
      this.dialogMessage = 'Please choose records to be printed.';
      this.dialogIcon = 'error-message';
      this.successDiag.open();
    } else {


      // let selectedBatchData = [];
      //  this.batchData.reportRequest = [];

      // for(let i=0;i<invoiceIdArray.length ;i++){ 
      //   selectedBatchData.push({ invoiceId :  invoiceIdArray[i].invoiceId , reportName : 'ACSER_INVOICE' , userId : JSON.parse(window.localStorage.currentUser).username }); 
      //   this.changeStatData.printInvoiceList.push({invoiceId :  invoiceIdArray[i].invoiceId, invoiceNo:invoiceIdArray[i].invoiceNo,updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
      // }
      // this.batchData.reportRequest = selectedBatchData;

      // this.printPDF(this.batchData);
      // this.loading = true;

      let selectedBatchData = [];
      this.batchData.reportRequest = [];

      for(let i=0;i<invoiceIdArray.length ;i++){ 

        console.log(invoiceIdArray[i]);

        if(this.printData.destination == 'dlPdf'){
          selectedBatchData.push({ invoiceId :  invoiceIdArray[i].invoiceId , reportName : 'ACSER_INVOICE' , userId : JSON.parse(window.localStorage.currentUser).username }); 
          this.batchData.reportRequest = selectedBatchData;
          console.log(this.batchData);
          this.printPDF(this.batchData);
          this.loading = true; 
        }
        else if(this.printData.destination == 'screen'){
          window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACSER_INVOICE' + '&userId=' + 
                        this.ns.getCurrentUser() + '&invoiceId=' + invoiceIdArray[i].invoiceId, '_blank');
        }else if(this.printData.destination == 'printPdf'){
          let params = {
            invoiceId: invoiceIdArray[i].invoiceId,
            printerName: this.printData.selPrinter,
            pageOrientation: 'LANDSCAPE',
            paperSize: 'LETTER',
            reportName : 'ACSER_INVOICE'
          };
          this.loading = true;
          this.ps.directPrint(params).subscribe(data => {
            console.log(data);
            this.loading = false;
          });
        }

        this.changeStatData.printInvoiceList.push({invoiceId :  invoiceIdArray[i].invoiceId, invoiceNo:invoiceIdArray[i].invoiceNo,updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
      }
    }  
  }

  printPDF(batchData: any){  
   let result: boolean;    
   this.accountingService.pdfMerge(JSON.stringify(batchData))
     .pipe(
           finalize(() => this.finalPrint(result) )
      )
          .subscribe(data => {
           var newBlob = new Blob([data as BlobPart], { type: "application/pdf" });
           var downloadURL = window.URL.createObjectURL(data);
           console.log(newBlob);
           const iframe = document.createElement('iframe');
           iframe.style.display = 'none';
           iframe.src = downloadURL;
           document.body.appendChild(iframe);
           iframe.contentWindow.print();
           result= false;
    },
     error => {
           result =true;
           this.dialogIcon= "error-message";
           this.dialogMessage = "Error generating batch OR PDF file(s)";
           this.successDiag.open();
   });     

}

finalPrint(error?){
  this.loading = false;
  if(!error){
    this.printMdl.open();
  }
  
}

updateOrStatus(){
  this.table.overlayLoader = true;
  console.log(JSON.stringify(this.changeStatData));
   setTimeout(()=>{
         this.accountingService.printInvoiceBatch(this.changeStatData).subscribe(
           (data:any)=>{
             if(data.returnCode == 0){ 
               this.dialogIcon = 'error-message';
               this.dialogIcon = 'An error has occured when updating Invoice status';
               this.successDiag.open();
             }else{
                this.dialogIcon = "success";
                this.successDiag.open();
               this.retrieveBatchInvoiceList(this.searchParams);
             }
           }
         );
      },1000);
}

failedOrPrint(){
  let changeStatData: any = {
        printInvoiceList: []
    };
    console.log(this.changeStatData);
  for(let i=0;i<this.changeStatData.printInvoiceList.length ;i++){ 
      if (parseInt(this.changeStatData.printInvoiceList[i].invoiceNo) <= parseInt(this.lastInvNo)){
        changeStatData.printInvoiceList.push({invoiceId :  this.changeStatData.printInvoiceList[i].invoiceId, updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
      }
  }

  if (changeStatData.printInvoiceList.length === 0){
  }else {
    setTimeout(()=>{
         this.accountingService.printInvoiceBatch(changeStatData).subscribe(
           (data:any)=>{
             if(data.returnCode == 0){
               this.dialogIcon = 'error-message';
               this.dialogIcon = 'An error has occured when updating Invoice status';
               this.successDiag.open();
             }else{
               this.dialogIcon = "success";
               this.successDiag.open();
               this.retrieveBatchInvoiceList(this.searchParams);
             }
           }
         );
     },1000);
  }


}

validateInvLastPrinted(data){
  this.lastInvNo = this.pad(data.target.value);
}

  onClickPayeeModal(){
    this.passLov.selector = 'payee';
    this.passLov.params = {};
    this.payeeLov.openLOV();
  }

  onClickJVModal(){
    console.log(this.selectedrecord.tranClass);
    if (this.selectedrecord.tranClass === 'JV'){
      this.passLov.selector = 'acseJvList';
      this.passLov.params = {};
      this.payeeLov.openLOV();
    } else if (this.selectedrecord.tranClass === 'OR'){
      this.passLov.selector = 'acseOrList';
      this.passLov.searchParams = {};
      this.passLov.params = {};
      this.payeeLov.openLOV();
    } else if (this.selectedrecord.tranClass === 'CV' || this.selectedrecord.tranClass === 'PRQ' ){
      this.passLov.selector = 'acseCvList';
      this.passLov.searchParams = {};
      this.passLov.params = {};
      this.payeeLov.openLOV();
    } 
  }

  setSelectedData(data){
    console.log(data.data);
    console.log(!this.isEmptyObject(data.data));
    if( !this.isEmptyObject(data.data)){
        let selected = data.data;
        if( this.passLov.selector === 'payee'){
          this.selectedrecord.payor = selected.payeeName;
          this.selectedrecord.payeeCd = selected.payeeNo;
          this.selectedrecord.payeeClassCd = selected.payeeClassCd;
        } else if(this.passLov.selector === 'acseJvList'){
          console.log(selected);
          this.selectedrecord.refNoTranId = selected.tranId;
          this.selectedrecord.refNoDate = this.ns.toDateTimeString(selected.jvDate);
          this.selectedrecord.tranNo = selected.jvNo;
          this.selectedrecord.tranDate = this.ns.toDateTimeString(selected.jvDate);
          this.selectedrecord.particulars = selected.particulars;
          this.selectedrecord.currCd = selected.currCd;
          this.selectedrecord.currRate = selected.currRate;
          this.selectedrecord.invoiceAmt = selected.jvAmt;
          this.selectedrecord.localAmt = selected.localAmt;
          this.selectedrecord.tranTypeCd = selected.tranTypeCd;
        } else if(this.passLov.selector === 'acseOrList'){
          console.log(selected);
          this.selectedrecord.refNoTranId = selected.tranId;
          this.selectedrecord.refNoDate = this.ns.toDateTimeString(selected.orDate);
          this.selectedrecord.tranNo = selected.formattedOrNo;
          this.selectedrecord.tranDate = this.ns.toDateTimeString(selected.orDate);
          this.selectedrecord.particulars = selected.particulars;
          this.selectedrecord.currCd = selected.currCd;
          this.selectedrecord.currRate = selected.currRate;
          this.selectedrecord.invoiceAmt = selected.orAmt;
          this.selectedrecord.localAmt = selected.orAmt * selected.currRate;
          //this.selectedrecord.tranTypeCd = selected.tranTypeCd;
        }  else if(this.passLov.selector === 'acseCvList'){
          console.log(selected);
          this.selectedrecord.refNoTranId = selected.tranId;
          this.selectedrecord.refNoDate = this.ns.toDateTimeString(selected.cvDate);
          this.selectedrecord.tranNo = selected.cvGenNo;
          this.selectedrecord.tranDate = this.ns.toDateTimeString(selected.cvDate);
          this.selectedrecord.particulars = selected.particulars;
          this.selectedrecord.currCd = selected.currCd;
          this.selectedrecord.currRate = selected.currRate;
          this.selectedrecord.invoiceAmt = selected.cvAmt;
          this.selectedrecord.localAmt = selected.localAmt;
          //this.selectedrecord.tranTypeCd = selected.tranTypeCd;
        }
    }else{
          this.selectedrecord.refNoTranId = null;
          this.selectedrecord.refNoDate = null;
          this.selectedrecord.tranNo = null;
          this.selectedrecord.tranDate = null;
          this.selectedrecord.particulars = null;
          this.selectedrecord.currCd = null;
          this.selectedrecord.currRate = null;
          this.selectedrecord.invoiceAmt = null;
          this.selectedrecord.localAmt = null;
    }
  }

  validateInvoiceNo(data){
    let invoiceNo = this.pad(data.target.value);
    this.invoiceNo = invoiceNo;

    if (this.isEmptyObject(invoiceNo)){
      this.genInvoiceBool = true;
    } else {
      this.genInvoiceBool = false;
      this.retrieveInvSeriesNo(invoiceNo,invoiceNo,null,null,'validate');
    }
  }
  
  retrieveInvSeriesNo(invoiceNoFrm,invoiceNoTo,usedTag,length,action){
    this.ms.getMtnAcseInvSeries(invoiceNoFrm,invoiceNoTo,usedTag,length).subscribe( data => {
         if (action === 'validate'){
           if (data['invSeries'].length === 0){
             this.genInvoiceBool = true;
             this.invoiceNo = null;
             this.dialogMessage = 'Cannot use Invoice No. It may not yet generated.';
             this.dialogIcon = 'error-message';
             this.errorInvBool = false;
             this.successDiag.open();
           }
         }else if (action === 'generate'){
           this.invoiceNoArray = [];
           if (data['invSeries'].length === 0){
             this.invoiceNoArray = [];
           }else {
             let genInvoiceNoData=[];

              data['invSeries'].map(a => { 
                this.invoiceNoArray.push({ invoiceNo : parseInt(a.invoiceNo) });       
              });

              for(let i=0;i<this.invoiceNoArray.length ;i++){ 
                genInvoiceNoData.push({ invoiceId : this.invoiceIdArray[i].invoiceId, invoiceNo :  this.invoiceNoArray[i].invoiceNo, 
                                        updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
              }
             this.genInvoiceData.invoiceNoList = genInvoiceNoData;
             console.log(JSON.stringify(this.genInvoiceData));

             this.accountingService.genBatchInvoice(this.genInvoiceData).subscribe(data => {
                 if(data['returnCode'] == -1){
                    this.dialogIcon = "success";
                    this.successDiag.open();
                    this.table.overlayLoader = true;
                    this.retrieveBatchInvoiceList(this.searchParams);
                }else{
                    this.errorInvBool = false;
                    this.dialogMessage = "Cannot generate Invoice No."
                    this.dialogIcon = "error-message";
                    this.successDiag.open();
                }
             });
           }
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
    if (this.dialogIcon === 'error-message') {
      this.modalService.dismissAll();
       if(this.errorInvBool){
         this.viewinvoiceModal.openNoClose();
       }
    }else if(this.dialogIcon !== 'error'){
      this.modalService.dismissAll();
    }
  }

  generateInvoice(){
    this.invoiceIdArray=[];

    for(var i=0; i < this.PassData.tableData.length;i++){
      if (this.PassData.tableData[i].invoiceNo === null && this.PassData.tableData[i].invoiceNocheck === 'Y'){
        this.invoiceIdArray.push({ invoiceId: this.PassData.tableData[i].invoiceId });
      }
    }
    if(this.invoiceIdArray.length === 0){
      this.errorInvBool = false;
      this.dialogMessage = 'Please choose records.';
      this.dialogIcon = 'error-message';
      this.successDiag.open();
    }else {
      console.log(this.invoiceIdArray);
      this.retrieveInvSeriesNo(this.invoiceNo,null,'N',this.invoiceIdArray.length,'generate');
    }
  }

  update(data){
     for(var i= 0; i< this.passDataInvoiceItems.tableData.length; i++){
         if(this.passDataInvoiceItems.tableData[i].edited || this.passDataInvoiceItems.tableData[i].add){
             if (data.key === 'currCd' || data.key === 'itemAmt' || data.key === 'currRate'){
               if (this.passDataInvoiceItems.tableData[i].currCd === 'PHP'){
                  var currRt = this.getCurrencyRt('PHP');
                  this.passDataInvoiceItems.tableData[i].currRate = currRt;
               }else if (this.passDataInvoiceItems.tableData[i].currCd === 'USD'){
                  var currRt = this.getCurrencyRt('USD');
                  this.passDataInvoiceItems.tableData[i].currRate = currRt;
               } else if (this.passDataInvoiceItems.tableData[i].currCd === 'UKP'){
                  var currRt = this.getCurrencyRt('UKP');
                  this.passDataInvoiceItems.tableData[i].currRate = currRt;
               }

               if(this.passDataInvoiceItems.tableData[i].itemAmt !== '' && this.passDataInvoiceItems.tableData[i].currRate !== ''){
                  this.passDataInvoiceItems.tableData[i].localAmt = isNaN(this.passDataInvoiceItems.tableData[i].itemAmt) ? 0:this.passDataInvoiceItems.tableData[i].itemAmt * this.passDataInvoiceItems.tableData[i].currRate;
               }else{
                  this.passDataInvoiceItems.tableData[i].localAmt = null;
               }

             }
         }
     }
  }

  getCurrencyRt(currUnit){
    var currRt;
    for (var i = 0; i < this.currencyData.length; i++) {
        if( this.currencyData[i].currencyCd === currUnit){
              currRt = this.currencyData[i].currencyRt;
         } 
    }
    return currRt;
  }

  checkFields(field){
        if( field.tranTypeCd === null || field.tranTypeCd === '' ||
            field.payor === null || field.payor === '' ||
            field.particulars === null || field.particulars === '' ||
            field.invoiceDate === null || field.invoiceDate === '' ||
            field.invoiceAmt === null || field.invoiceAmt === '' ||
            field.localAmt === null || field.localAmt === '' ||
            field.currCd === null || field.currCd === '' ||
            field.currRate === null || field.currRate === '' 
          ) {   
            return false;
          }else {
            console.log(this.passDataInvoiceItems.tableData.length);
            if (this.passDataInvoiceItems.tableData.length === 0){
              return true;
            }
             let sum = 0;
              for(let check of this.passDataInvoiceItems.tableData){
                  if( check.itemDesc === null || check.itemDesc === '' ||
                     check.itemAmt === null || check.itemAmt === '' ||
                     check.currCd !==  field.currCd
                  ) {   
                    return false;
                  }
                sum = sum + check.itemAmt;
              }
                if(sum === field.invoiceAmt){
                  return true;
                }else {
                  return false;
                }
            }
 }

 onClickDelInvt(){
    this.acitInvItems.invoiceItemList = [];
    this.acitInvItems.invoiceDelItemList  = [];
    this.deletedData.push({
                    "invoiceId" : null,
                    "itemNo" : this.selecteditemrecord.itemNo
                     });

    this.acitInvItems.invoiceDelItemList = this.deletedData;     
 }
     
checkAllGenPrin(from?){
  if(this.PassData.tableData.length === 0){
  } else {
      for(var i=0; i < this.PassData.tableData.length;i++){
        if (this.PassData.tableData[i].invoiceNo === null){
           if(from == 'checkAllG'){
            this.PassData.tableData[i].invoiceNocheck = (this.checkAllGVal)?'Y':'N';
           }else if(from == 'checkAllP'){
            this.PassData.tableData[i].printCheck = (this.checkAllPVal)?'Y':'N';
           } 
        } else {
          if(from == 'checkAllP'){
            this.PassData.tableData[i].printCheck = (this.checkAllPVal)?'Y':'N';
          } 
        }
    }
  } 
}

clearPrinterName(){
  (this.printData.destination != 'printPdf')?this.printData.selPrinter='':''
}

getPrinters(){
  this.ps.getPrinters()
  .subscribe(data => {
    this.printData.printers = data;
  });
}

}
