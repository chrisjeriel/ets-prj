import { Component, OnInit, OnDestroy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-or-preview',
  templateUrl: './or-preview.component.html',
  styleUrls: ['./or-preview.component.css']
})
export class OrPreviewComponent implements OnInit, OnDestroy {
  
   /*passDataAmountDetails: any = {
  	tableData: [],
    tHeader: ["Item No", "Gen Type", "Detail", "Original Amount", "Currency","Currency Rate","Local Amount"],
    dataTypes: ["text", "text", "text", "currency", "text","percent","currency"],
    resizable: [true, true, true, true, true, true, true],
    nData: new ORPrevAmountDetails(null,null,null,null,null,null,null),
    total:[null,null,'TOTAL',null,null,null,'localAmount'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [70,70,'auto',160,60,160,160],
    paginateFlag:true,
    infoFlag:true
  }*/

  @ViewChild('genTaxTbl') genTaxTbl: CustEditableNonDatatableComponent;
  @ViewChild('whTaxTbl') whTaxTbl: CustEditableNonDatatableComponent;
  @ViewChild('acctEntriesTbl') acctEntriesTbl: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;

  @Output() emitCreateUpdate: any = new EventEmitter<any>();

  @Input() paymentType: string = "";
  @Input() record: any;

  forkSub: any;

  cancelFlag: boolean = false;

   acctEntriesData: any = {
  	tableData: [],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','Local Debit','Local Credit','Debit','Credit'],
    uneditable:[true,true,true,true,true,true,false,false],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt','foreignDebitAmt','foreignCreditAmt'],
    dataTypes: ['text','text','text','text','currency','currency','currency','currency'],
    nData: {
        tranId: '',
        entryId: '',
        glAcctId: '',
        glShortCd: '',
        glShortDesc:'',
        slTypeCd: '',
        slTypeName: '',
        slCd: '',
        slName: '',
        creditAmt: 0,
        debitAmt: 0,
        foreignDebitAmt: 0,
        foreignCreditAmt: 0,
        autoTag: '',
        createUser: '',
        createDate: '',
        updateUser: '',
        updateDate: '',
        showMG:1,
        edited: true
      },
    addFlag: true,
    deleteFlag: true,
    editFlag: false,
    pageLength: 10,
    widths: [105,240,125,170,120,120,120,120],
    checkFlag: true,
    magnifyingGlass: ['glShortCd','slTypeName','slName'],
    total: [null,null,null,'TOTAL DEBIT AND CREDIT','debitAmt', 'creditAmt','foreignDebitAmt','foreignCreditAmt']
  }

   genTaxData: any = {
    tableData: [],
    tHeader: ['#', 'Gen Type', 'Tax Code', 'Description', 'BIR RLF Purchase Type', 'Tax Rate', 'Payor', 'Base Amount', 'Tax Amount'],
    dataTypes: ['number', 'text', 'text', 'text', 'text', 'percent', 'text', 'currency', 'currency'],
    //opts: [{ selector: "vatType", vals: ["Output", "Input"] }],
	  nData: {
            tranId: '',
            taxType: 'G',
            taxSeqNo: '',
            taxCd: '',
            genType: 'M',
            taxName: '',
            genBirRlf: '',
            taxRate: '',
            payor: '',
            baseAmt: 0,
            taxAmt: 0,
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: '',
            showMG: 1
    },
    keys: ['taxSeqno', 'genType', 'taxCd', 'taxName', 'genBirRlf', 'taxRate', 'payor', 'baseAmt', 'taxAmt'],
    pageID: 'genTax',
    addFlag: true,
    deleteFlag: true,
    total: [null,null,null,null, null, null, 'Total', 'baseAmt', 'taxAmt'],
    pageLength:5,
    widths: [1,1,50,150,'auto',100,200,150,150],
    paginateFlag:true,
    infoFlag:true,
    checkFlag: true,
    uneditable: [true,true,false,true,true,true,false,false,true],
    magnifyingGlass: ['taxCd']
  }

  whTaxData: any = {
   tableData: [],
    tHeader: ['#', 'Gen Type', 'BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
    dataTypes: ['text', 'text', 'text', 'text', 'percent','text', 'currency', 'currency'],
    // opts:[
    //   {
    //     selector: 'birTaxCode',
    //     vals: ['WC002', 'WC010', 'WC020'],
    //   }
    // ],
    nData: {
            tranId: '',
            taxType: 'W',
            taxSeqNo: '',
            taxCd: '',
            genType: 'M',
            taxName: '',
            purchaseType: '',
            taxRate: '',
            payor: '',
            baseAmt: 0,
            taxAmt: 0,
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: '',
            showMG: 1
    },
    keys: ['taxSeqno', 'genType', 'taxCd', 'taxName', 'taxRate', 'payor', 'baseAmt', 'taxAmt'],
    pageID: 'whTax',
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    total: [null,null,null,null, null, 'Total', 'baseAmt', 'taxAmt'],
    widths: [1,1,50,200,100,200,150,150],
    paginateFlag:true,
    infoFlag:true,
    checkFlag: true,
    uneditable: [true,true,false,true,true,false,false,true],
    magnifyingGlass: ['taxCd']
  }

  currentTab: string = 'taxDtl';
  dialogMessage: string = '';
  dialogIcon: string = '';

  genTaxIndex: number;
  whTaxIndex: number;

  passLov: any = {
    selector: '',
    activeTag: '',
    hide: []
  }

  createUpdate: any = {};

  savedData: any = [];
  deletedData: any = [];

  constructor(private accountingService: AccountingService, private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    console.log(this.record);
    if(this.paymentType == null){
          this.paymentType = "";
    }
    this.retrieveAcseOrPreview();
  	/*this.passDataAmountDetails.tableData = this.accountingService.getORPrevAmountDetails();
  	this.passDataAccountingEntries.tableData = this.accountingService.getORPrevAccEntries();
  	this.passDataAccountingVATTaxDetails.tableData = this.accountingService.getORPrevTaxDetails();
  	this.passDataAccountingCreditableTaxDetails.tableData = this.accountingService.getORPrevCredWTaxDetails();*/
  }

  ngOnDestroy(){
    if(this.forkSub !== undefined){
      this.forkSub.unsubscribe();
    }
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.createUpdate = null;
    if ($event.nextId === 'taxDtl') {
     this.currentTab = 'taxDtl';
    }else if($event.nextId === 'acctEntries'){
      this.currentTab = 'acctEntries';
    }
    this.retrieveAcseOrPreview();
  }

  onTableDataChange(data, table){
    if(table == 'genTax'){
       if(data.key == 'baseAmt'){
         for(var i of this.genTaxData.tableData){
           i.taxAmt = (i.taxRate == null ? 1 : i.taxRate) * i.baseAmt;
         }
       }
    }else if(table =='whTax'){
      if(data.key == 'baseAmt'){
        for(var i of this.genTaxData.tableData){
          i.taxAmt = (i.taxRate == null ? 1 : i.taxRate) * i.baseAmt;
        }
      }
    }
  }

  onRowClick(data){
    console.log(data);
    if(data === null){
      //this.emitCreateUpdate.emit(null);
      this.createUpdate = null;
    }else{
      //this.emitCreateUpdate.emit(data);
      data.createDate = this.ns.toDateTimeString(data.createDate);
      data.updateDate = this.ns.toDateTimeString(data.updateDate);
      this.createUpdate = data;
    }
  }

  openGenTaxLOV(event){
    this.passLov.activeTag = 'Y';
    this.passLov.selector = 'mtnGenTax';
    this.passLov.hide = this.genTaxData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
    console.log(this.passLov.hide);
    this.genTaxIndex = event.index;
    this.lovMdl.openLOV();
  }

  openWhTaxLOV(event){
    this.passLov.activeTag = 'Y';
    this.passLov.selector = 'mtnWhTax';
    this.passLov.hide = this.whTaxData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
    console.log(this.passLov.hide);
    this.whTaxIndex = event.index;
    this.lovMdl.openLOV();
  }

  setSelectedData(data){
    let selected = data.data;
    if(selected[0].taxId !== undefined){ //set values to general taxes table
      console.log(selected);
      this.genTaxData.tableData = this.genTaxData.tableData.filter(a=>a.showMG!=1);
      for(var i = 0; i < selected.length; i++){
        this.genTaxData.tableData.push(JSON.parse(JSON.stringify(this.genTaxData.nData)));
        this.genTaxData.tableData[this.genTaxData.tableData.length - 1].taxCd = selected[i].taxCd; 
        this.genTaxData.tableData[this.genTaxData.tableData.length - 1].taxName = selected[i].taxName; 
        this.genTaxData.tableData[this.genTaxData.tableData.length - 1].taxRate = selected[i].taxRate;
        this.genTaxData.tableData[this.genTaxData.tableData.length - 1].taxAmt = selected[i].amount;
        this.genTaxData.tableData[this.genTaxData.tableData.length - 1].tranId = this.record.tranId;
        this.genTaxData.tableData[this.genTaxData.tableData.length - 1].billId = 1;
        this.genTaxData.tableData[this.genTaxData.tableData.length - 1].edited = true;
        this.genTaxData.tableData[this.genTaxData.tableData.length - 1].showMG = 0;
        this.genTaxData.tableData[this.genTaxData.tableData.length - 1].uneditable = ['taxCd'];
      }
      this.genTaxTbl.refreshTable();
    }else if(selected[0].whTaxId !== undefined){ //set values to withholding taxes table
      console.log(selected);
      this.whTaxData.tableData = this.whTaxData.tableData.filter(a=>a.showMG!=1);
      for(var i = 0; i < selected.length; i++){
        this.whTaxData.tableData.push(JSON.parse(JSON.stringify(this.whTaxData.nData)));
        this.whTaxData.tableData[this.whTaxData.tableData.length - 1].taxCd = selected[i].taxCd; 
        this.whTaxData.tableData[this.whTaxData.tableData.length - 1].taxName = selected[i].taxName; 
        this.whTaxData.tableData[this.whTaxData.tableData.length - 1].taxRate = selected[i].taxRate;
        this.whTaxData.tableData[this.whTaxData.tableData.length - 1].taxAmt = 1 * selected[i].taxRate; //placeholder
        this.whTaxData.tableData[this.whTaxData.tableData.length - 1].tranId = this.record.tranId;
        this.whTaxData.tableData[this.whTaxData.tableData.length - 1].billId = 1;
        this.whTaxData.tableData[this.whTaxData.tableData.length - 1].edited = true;
        this.whTaxData.tableData[this.whTaxData.tableData.length - 1].showMG = 0;
        this.whTaxData.tableData[this.whTaxData.tableData.length - 1].uneditable = ['taxCd'];
      }
      this.whTaxTbl.refreshTable();
    }
  }

  retrieveAcseOrPreview(){
    if(this.record.from.toLowerCase() == 'cv'){
      this.record.cvAmt = Number(String(this.record.cvAmt).replace(/\,/g,'')); 
      this.record.localAmt = Number(String(this.record.localAmt).replace(/\,/g,''));
    }

    if(this.currentTab == 'taxDtl'){
      var sub$ = forkJoin(this.accountingService.acseTaxDetails(this.record.tranId, 'G'),
                          this.accountingService.acseTaxDetails(this.record.tranId, 'W'))
                         .pipe(map(([genTax, whTax]) => { return { genTax, whTax }; }));
      this.forkSub = sub$.subscribe(
        (data:any)=>{
          let genTax = data.genTax.taxDetails;
          let whTax = data.whTax.taxDetails;
          console.log(genTax);
          console.log(whTax);
          this.genTaxData.tableData = [];
          this.whTaxData.tableData = [];
          for(var i of genTax){
            i.taxRate = i.genTaxRate;
            i.taxName = i.genTaxDesc;
            this.genTaxData.tableData.push(i);
          }
          for(var i of whTax){
            i.taxRate = i.whtRate;
            i.taxName = i.whtTaxDesc;
            this.whTaxData.tableData.push(i);
          }
          /*this.genTaxData.tableData = genTax;
          this.whTaxData.tableData = whTax;*/
          this.genTaxTbl.refreshTable();
          this.whTaxTbl.refreshTable();
        },
        (error: any)=>{
          console.log('error');
        }
      );
    }else if(this.currentTab == 'acctEntries'){
      this.accountingService.getAcseAcctEntries(this.record.tranId).subscribe(
        (data:any)=>{
           this.acctEntriesData.tableData = data.acctEntries;
           this.acctEntriesTbl.refreshTable();
      });
    }

    var a = false;
      if(this.record.from.toLowerCase() == 'or'){
            a = (this.record.orStatDesc.toUpperCase() != 'NEW')?true:false;
      }else if(this.record.from.toLowerCase() == 'cv'){
            a = (this.record.cvStatus.toUpperCase() != 'N' && this.record.cvStatus.toUpperCase() != 'F')?true:false;
      }

          if(a){
            this.genTaxData.uneditable      = [true,true,true,true,true,true,true,true,true]; 
            this.genTaxData.addFlag         = false;
            this.genTaxData.deleteFlag      = false;
            this.genTaxData.checkFlag       = false;
            this.genTaxData.magnifyingGlass = [];

            this.whTaxData.uneditable       = [true,true,false,true,true,false,false,true];
            this.whTaxData.addFlag          = false;
            this.whTaxData.deleteFlag       = false;
            this.whTaxData.checkFlag        = false;
            this.whTaxData.magnifyingGlass  = [];
    }
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.savedData = [];
    this.deletedData = [];
    if(this.currentTab == 'taxDtl'){
      let combinedTaxes = this.genTaxData.tableData.concat(this.whTaxData.tableData);
      for (var i = 0 ; combinedTaxes.length > i; i++) {
            if(combinedTaxes[i].edited && !combinedTaxes[i].deleted){
                this.savedData.push(combinedTaxes[i]);
                this.savedData[this.savedData.length-1].tranId = this.record.tranId;
                this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
                this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
                this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
                this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
            }
            else if(combinedTaxes[i].edited && combinedTaxes[i].deleted){
               this.deletedData.push(combinedTaxes[i]);
               this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
               this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
               this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
            }
       }
       let params: any = {
         saveTaxDtl: this.savedData,
         delTaxDtl: this.deletedData
       }
      this.accountingService.saveAcseTaxDetails(params).subscribe(
        (data:any)=>{
          if(data.returnCode === 0){
            this.dialogIcon = 'error';
            this.successDiag.open();
          }else{
            this.dialogIcon = '';
            this.successDiag.open();
            this.retrieveAcseOrPreview();
          }
        }
      );
    }else if(this.currentTab == 'acctEntries'){
      //to be continued
    }
  }

}
