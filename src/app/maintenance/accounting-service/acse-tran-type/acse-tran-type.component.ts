import { Component, OnInit,ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { PrintModalMtnAcctComponent } from '@app/_components/common/print-modal-mtn-acct/print-modal-mtn-acct.component';
import { finalize } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-acse-tran-type',
  templateUrl: './acse-tran-type.component.html',
  styleUrls: ['./acse-tran-type.component.css']
})
export class AcseTranTypeComponent implements OnInit {
  
  @ViewChild('tranType') table: CustEditableNonDatatableComponent;
  @ViewChild('acctEntTbl') acctEntTbl: CustEditableNonDatatableComponent;
  @ViewChild('amtDtlTbl') amtDtlTbl: CustEditableNonDatatableComponent;
  @ViewChild('genTable') genTable: CustEditableNonDatatableComponent;
  @ViewChild('whTaxTable') whTaxTable: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('tranTypeSave') tranTypeSave: ConfirmSaveComponent;
  @ViewChild('acctEntrySave') acctEntrySave: ConfirmSaveComponent;
  @ViewChild('amtDetailSave') amtDetailSave: ConfirmSaveComponent;
  @ViewChild('defTaxSave') defTaxSave: ConfirmSaveComponent;
  @ViewChild('AcctEntries') acctEntryMdl: ModalComponent;
  @ViewChild('amountDetails') amountDtlMdl: ModalComponent;
  @ViewChild('taxDetails') taxDetailsMdl: ModalComponent;
  @ViewChild('tranTypeCancel') cancelBtn : CancelButtonComponent;
  @ViewChild('acctEntryLov') acctEntryLov: LovComponent;
  @ViewChild('amtDtlLov') amtDtlLov: LovComponent;
  @ViewChild('defTaxLov') defTaxLov: LovComponent;
  @ViewChild('defWhTaxLov') defWhTaxLov: LovComponent;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

  passData: any = {
      tableData: [],
      tHeader: ['Tran Type No','Prefix', 'Transaction Type Name', 'Default Particulars', 'Auto','BAE','Active'],
      dataTypes: ['number','text', 'text', 'text', 'checkbox','checkbox','checkbox'],
      nData: {
      	tranClass:'',
      	tranTypeCd:'',
      	typePrefix:'',
      	tranTypeName:'',
      	defaultParticulars:'',
      	remarks:'',
      	autoTag:'N',
      	baeTag:'N',
      	activeTag:'N',
      	createUser:this.ns.getCurrentUser(),
      	createDate:'',
      	updateUser:this.ns.getCurrentUser(),
      	updateDate:'',
      	groupTag:''
      },
      searchFlag: true,
      infoFlag: true,
      addFlag: true,
      disableAdd: true,
      genericBtn: 'Delete',
      disableGeneric: true,
      deleteFlag: false,
      paginateFlag: true,
      pageLength: 10,
      pageID: 1,
      uneditable: [true,false,false,false,false,true,false],
      widths: [85,100,305,310,50,50,50],
      keys: ['tranTypeCd', 'typePrefix', 'tranTypeName', 'defaultParticulars', 'autoTag','baeTag', 'activeTag'],
  };

  passDataAcctEntries: any = {
      tableData: [],
      tHeader: ['Account Code','Account Name', 'SL Type', 'Sub1','Sub2', 'Sub3','Debit/Credit'],
      dataTypes: ['text','text', 'text', 'select','select', 'select','select'],
      nData: {
        showMG: 1,
        shortCode: '',
        glShortDesc: '',
        slTypeName: '',
        sub1Dep: '',
        sub2Dep: '',
        sub3Dep: '',
        drCrTag: '',
      	createUser:this.ns.getCurrentUser(),
      	createDate:'',
      	updateUser:this.ns.getCurrentUser(),
      	updateDate:''
      },
      magnifyingGlass: ['shortCode','slTypeName'],
      searchFlag: true,
      infoFlag: true,
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      paginateFlag: true,
      pageLength: 10,
      pageID: 2,
      opts: [
      {
        selector: 'sub1Dep',
        prev: ['LI','BP','BN','CO','CU','IT','TS','DS'],
        vals: ['LI','BP','BN','CO','CU','IT','TS','DS'],
       },
       {
        selector: 'sub2Dep',
        prev: ['LI','BP','BN','CO','CU','IT','TS','DS'],
        vals: ['LI','BP','BN','CO','CU','IT','TS','DS'],
       },
       {
        selector: 'sub3Dep',
        prev: ['LI','BP','BN','CO','CU','IT','TS','DS'],
        vals: ['LI','BP','BN','CO','CU','IT','TS','DS'],
       },
      {
        selector: 'drCrTag',
        prev: ['Debit','Credit'],
        vals: ['D','C'],
       }
      ],
      uneditable: [true,false,false,false,false,false,false],
      widths: [100,300,187,90,90,90,95],
      keys: ['shortCode', 'glShortDesc', 'slTypeName', 'sub1Dep', 'sub2Dep', 'sub3Dep','drCrTag'],
  };

  passDataAmountDtl: any ={
    tableData: [],
      tHeader: ['Item No','Detail Description', 'Accounting Entry Source', 'Acct Entry Amount Tag','Sign'],
      dataTypes: ['number','text', 'text', 'checkbox','select'],
      nData: {
        showMG:1,
        itemNo: '',
        itemText: '',
        defaultGl: '',
        acctAmtTag: 'N',
        signTag: '',
        createUser:this.ns.getCurrentUser(),
        createDate:'',
        updateUser:this.ns.getCurrentUser(),
        updateDate:''
      },
      magnifyingGlass: ['shortCode'],
      searchFlag: true,
      infoFlag: true,
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      paginateFlag: true,
      pageLength: 10,
      pageID: 3,
      opts: [{
              selector: 'signTag',
              prev: ['+','-'],
              vals: ['P','N'],
             }
      ],
      uneditable: [true,false,false,false,false],
      widths: [75,405,325,160,50],
      keys: ['itemNo', 'itemText', 'shortCode', 'acctAmtTag', 'signTag'],
  };

   genTaxData: any = {
    tableData: [],
    tHeader: ['Tax Code', 'Description', 'Tax Rate', 'Fixed Amount'],
    dataTypes: ['text', 'text', 'percent','currency'],
    //opts: [{ selector: "vatType", vals: ["Output", "Input"] }],
    nData: {
            taxCd: '',
            taxDesc: '',
            taxRate: '',
            fixedAmount: '',
            createUser: this.ns.getCurrentUser(),
            createDate: '',
            updateUser: this.ns.getCurrentUser(),
            updateDate: '',
            showMG: 1
    },
    keys: [ 'taxCd', 'taxDesc','taxRate', 'fixedAmount'],
    pageID: 'genTax',
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    total: [null, null, 'Total', 'fixedAmount'],
    pageLength:5,
    widths: [100,200,150,150],
    paginateFlag:true,
    infoFlag:true,
    checkFlag: true,
    uneditable: [true,false,false,true],
    magnifyingGlass: ['taxCd']
  }

  whTaxData: any = {
   tableData: [],
    tHeader: ['BIR Tax Code', 'Description', 'Tax Rate'],
    dataTypes: ['text', 'text', 'percent'],
    // opts:[
    //   {
    //     selector: 'birTaxCode',
    //     vals: ['WC002', 'WC010', 'WC020'],
    //   }
    // ],
    nData: {
            taxCd: '',
            taxDesc: '',
            taxRate: '',
            createUser: this.ns.getCurrentUser(),
            createDate: '',
            updateUser: this.ns.getCurrentUser(),
            updateDate: '',
            showMG: 1
    }, 
    keys: ['taxCd', 'taxDesc', 'taxRate'],
    pageID: 'whTax',
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    total: [null, null, null],
    widths: [100,200,150],
    paginateFlag:true,
    infoFlag:true,
    checkFlag: true,
    uneditable: [true,false,false],
    magnifyingGlass: ['taxCd']
  }

  params = {
  	tranClass:'',
  	tranName:'',
    tranTypeCd:'',
    tranTypeName:'',
  	remarks:'',
    saveTranType:[],
    delTranType: [],
    createUser:'',
    createDate:'',
    updateUser:'',
    updateDate:''
  };

  paramsAcctEnt = {
    remarks: '',
    saveAcctEnt: [],
    delAcctEnt: []
  };

  paramsAmtDtl = {
    remarks: '',
    saveDefAmt: [],
    delDefAmt: []
  }

  paramsDefTax = {
    saveDefTax: [],
    delDefTax: [],
    saveDefWhTax :[],
    delDefWhTax : []
  }

  passLov:any = {
    selector:'',
    params:{}
  }

  lovRow: any;
  dialogIcon : any;
  dialogMessage : any;
  acctEntryBut:boolean = true;
  cancelFlag: boolean = false;
  genTaxIndex:any = '';
  lovCheckbox: boolean = false;
  subscription: Subscription = new Subscription();

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  }

 retrieveTranType(){
 	this.table.loadingFlag = true;
 	this.passData.disableAdd = false;
 	this.passData.disableGeneric = false;
 	this.maintenanceService.getMtnAcseTranType(this.params.tranClass).subscribe((data:any) => {
 		this.passData.tableData = [];
 		this.params.tranName = data.tranTypeList[0].tranName;
 		for (var i = 0; i < data.tranTypeList.length; i++) {
 			this.passData.tableData.push(data.tranTypeList[i]);
 		}
 		this.table.refreshTable();
    this.table.loadingFlag = false;
    this.table.onRowClick(null,this.passData.tableData[0]);
 	});
 }

 onRowClick(data){
 	if(data !== null){
  		this.params.createUser = data.createUser;
  		this.params.createDate = this.ns.toDateTimeString(data.createDate);
  		this.params.updateUser = data.updateUser;
  		this.params.updateDate = this.ns.toDateTimeString(data.updateDate);
  		this.params.remarks = data.remarks;
      this.acctEntryBut = false;
      this.params.tranTypeName = data.tranTypeName;
      this.params.tranTypeCd = data.tranTypeCd;
  	}else{
  		this.params.createUser = '';
  		this.params.createDate = '';
  		this.params.updateUser = '';
  		this.params.updateDate = '';
  		this.params.remarks = '';
      this.acctEntryBut = true;
      this.params.tranTypeName = '';
      this.params.tranTypeCd = '';
  	}
 }

 onClickSave(){
 	this.tranTypeSave.confirmModal();
 }

 prepareData(){
 	this.params.saveTranType = [];
 	this.params.delTranType = [];

 	for (var i = 0; i < this.passData.tableData.length; i++) {
 		if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
 			this.params.saveTranType.push(this.passData.tableData[i]);
 			this.params.saveTranType[this.params.saveTranType.length - 1].tranClass = this.params.tranClass;
 			this.params.saveTranType[this.params.saveTranType.length - 1].createDate = this.ns.toDateTimeString(0);
 			this.params.saveTranType[this.params.saveTranType.length - 1].updateDate = this.ns.toDateTimeString(0);
 		}

 		if(this.passData.tableData[i].deleted){
 			this.params.delTranType.push(this.passData.tableData[i]);
 		}
 	}
 }

 saveData(cancel?){
 	this.prepareData();
  console.log(this.params)
 	this.maintenanceService.saveAcseTranType(this.params).subscribe((data:any) => {
 		console.log(data)
 		if(data['returnCode'] != -1) {
 		  this.dialogMessage = data['errorList'][0].errorMessage;
 		  this.dialogIcon = "error";
 		  this.successDiag.open();
 		}else{
 		  this.dialogMessage = "";
 		  this.dialogIcon = "success";
 		  this.successDiag.open();
      this.table.markAsPristine();
 		  this.retrieveTranType();
 		}
 	});
 }

 onClickAcctEntries(){
   this.acctEntryMdl.openNoClose();
   this.retrieveAcctEnt();
 }
  
  retrieveAcctEnt(){
    this.acctEntTbl.loadingFlag = true;
    this.maintenanceService.getMtnAcseDefAcctEnt(this.params.tranClass,this.params.tranTypeCd).subscribe((data:any) => {
      this.passDataAcctEntries.tableData = [];
      for(var i = 0; i < data.defAccEnt.length; i++){
        this.passDataAcctEntries.tableData.push(data.defAccEnt[i]);
      }
      this.paramsAcctEnt.remarks = '';
      this.acctEntTbl.loadingFlag = false;
      this.acctEntTbl.onRowClick(null,this.passDataAcctEntries.tableData[0]);
      this.acctEntTbl.refreshTable();
    });
  }

  openAcctEntryLov(data){
    this.lovRow = data.index;
    if(data.key === 'shortCode'){
      this.passLov.selector = 'acseChartAcct';
      this.passLov.params = {};
      this.acctEntryLov.openLOV();
    }else if (data.key === 'slTypeName') {
      this.passLov.selector = 'slType';
      this.passLov.params = {};
      this.acctEntryLov.openLOV();
    }
  } 

  setLovAcct(data){
    console.log(data.data)
    if(data.selector == 'acseChartAcct'){
      this.passDataAcctEntries.tableData[this.lovRow].shortCode = data.data.shortCode;
      this.passDataAcctEntries.tableData[this.lovRow].glShortDesc = data.data.longDesc;
      this.passDataAcctEntries.tableData[this.lovRow].glAcctId = data.data.glAcctId;
    }else if(data.selector === 'slType'){
      this.passDataAcctEntries.tableData[this.lovRow].slTypeName = data.data.slTypeName;
      this.passDataAcctEntries.tableData[this.lovRow].slTypeCd = data.data.slTypeCd;
    }
    this.acctEntTbl.refreshTable();
  }

  acctEntriesClick(data){
    if(data !== null){
      this.paramsAcctEnt.remarks = data.remarks;
    }else{
      this.paramsAcctEnt.remarks = '';
    }
  }

  onClickSaveAcctEnt(){
    this.acctEntrySave.confirmModal();
  }

  savAcctEntries(){
    this.paramsAcctEnt.saveAcctEnt = [];
    this.paramsAcctEnt.delAcctEnt = [];

    for (var i = 0; i < this.passDataAcctEntries.tableData.length; i++) {
      if(this.passDataAcctEntries.tableData[i].edited && !this.passDataAcctEntries.tableData[i].deleted){
        this.paramsAcctEnt.saveAcctEnt.push(this.passDataAcctEntries.tableData[i]);
        this.paramsAcctEnt.saveAcctEnt[this.paramsAcctEnt.saveAcctEnt.length - 1].tranAmtTag = 'Y';
        this.paramsAcctEnt.saveAcctEnt[this.paramsAcctEnt.saveAcctEnt.length - 1].netDrcrTag = 'Y';
        this.paramsAcctEnt.saveAcctEnt[this.paramsAcctEnt.saveAcctEnt.length - 1].tranClass = this.params.tranClass;
        this.paramsAcctEnt.saveAcctEnt[this.paramsAcctEnt.saveAcctEnt.length - 1].tranTypeCd = this.params.tranTypeCd;
        this.paramsAcctEnt.saveAcctEnt[this.paramsAcctEnt.saveAcctEnt.length - 1].createDate = this.ns.toDateTimeString(0);
        this.paramsAcctEnt.saveAcctEnt[this.paramsAcctEnt.saveAcctEnt.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passDataAcctEntries.tableData[i].deleted){
        this.paramsAcctEnt.delAcctEnt.push(this.passDataAcctEntries.tableData[i]);
      }
    }

    this.maintenanceService.saveMtnAcseAcctEnt(this.paramsAcctEnt).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveAcctEnt();
      }

    });
  }

  onClickAmounDtl(){
    this.amountDtlMdl.openNoClose();
    this.retrieveAmtDetl();
  }

  retrieveAmtDetl(){
    this.amtDtlTbl.loadingFlag = true;
    this.maintenanceService.getAcseDefAmt(this.params.tranClass,this.params.tranTypeCd).subscribe((data:any) => {
      this.passDataAmountDtl.tableData = [];
      for (var i = 0; i < data.defAmtDtl.length; i++) {
        this.passDataAmountDtl.tableData.push(data.defAmtDtl[i]);
      }
      this.paramsAmtDtl.remarks = '';
      this.amtDtlTbl.refreshTable();
      this.amtDtlTbl.onRowClick(null,this.passDataAmountDtl.tableData[0]);
      this.amtDtlTbl.loadingFlag = false;
    });
  }

  clickLov(data){
    this.lovRow = data.index;
    this.passLov.selector = 'acseChartAcct';
    this.passLov.params = {};
    this.amtDtlLov.openLOV();
  }

  setLov(data){
    console.log(data.data);
    this.passDataAmountDtl.tableData[this.lovRow].shortCode = data.data.shortCode;
    this.passDataAmountDtl.tableData[this.lovRow].defaultGl = data.data.glAcctId;
    this.passDataAmountDtl.tableData[this.lovRow].showMG = 0;
    this.amtDtlTbl.refreshTable();
  }

  defAmtClick(data){
    if(data !== null){
      this.paramsAmtDtl.remarks = data.remarks;
    }else{
      this.paramsAmtDtl.remarks = '';
    }
  }

  onClickSaveAmounDtl(){
    this.amtDetailSave.confirmModal();
  }

  saveAmtDtl(cancel?){
    this.paramsAmtDtl.saveDefAmt = [];
    this.paramsAmtDtl.delDefAmt = [];

    for (var i = 0; i < this.passDataAmountDtl.tableData.length; i++) {
      if(this.passDataAmountDtl.tableData[i].edited && !this.passDataAmountDtl.tableData[i].deleted){
        this.paramsAmtDtl.saveDefAmt.push(this.passDataAmountDtl.tableData[i]);
        this.paramsAmtDtl.saveDefAmt[this.paramsAmtDtl.saveDefAmt.length - 1].tranClass  = this.params.tranClass;
        this.paramsAmtDtl.saveDefAmt[this.paramsAmtDtl.saveDefAmt.length - 1].tranTypeCd = this.params.tranTypeCd;
        this.paramsAmtDtl.saveDefAmt[this.paramsAmtDtl.saveDefAmt.length - 1].createDate = this.ns.toDateTimeString(0);
        this.paramsAmtDtl.saveDefAmt[this.paramsAmtDtl.saveDefAmt.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passDataAmountDtl.tableData[i].deleted){
        this.paramsAmtDtl.delDefAmt.push(this.passDataAmountDtl.tableData[i]);
      }
    }

    this.maintenanceService.saveAcseAmtDtl(this.paramsAmtDtl).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveAmtDetl();
      }
    });
  }

  onClickTaxDetails(){
    this.taxDetailsMdl.openNoClose();
    this.retrieveTax();
  }
  
  deleteCurr(ev) {
    console.log(ev)
    if(ev.okDelete == 'N'){
        this.dialogMessage = "Deleting this record is not allowed. This was already used in some accounting records.";
        this.dialogIcon = "error-message";
        this.successDiag.open();
    }else{
      this.table.selected = [this.table.indvSelect];
      this.table.confirmDelete();
    }
  }

  print(){
    this.printModal.open();
  }

  printPreview(data) {
    this.passData.tableData = [];
    if(data[0].basedOn === 'curr'){
     this.getRecords(this.params.tranClass,this.params.tranTypeCd);
    } else if (data[0].basedOn === 'all') {
     this.getRecords(this.params.tranClass);
    }
  }

  getRecords(tranClass?,tranTypeCd?){
     this.maintenanceService.getMtnAcseTranType(tranClass,tranTypeCd,null,null,null,null).pipe(finalize(() => this.finalGetRecords())).subscribe((data:any)=>{
       this.passData.tableData = data.tranTypeList;
       this.passData.tableData.forEach(a => {
         if(a.defaultParticulars === null){
           a.defaultParticulars = '';
         }

         if(a.masterTranType === null){
           a.masterTranType = '';
         }

         if(a.typePrefix === null){
           a.typePrefix = '';
         }
       });
     });
  }

   finalGetRecords(selection?){
    this.export(this.passData.tableData);
  };

  export(record?){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'AcseTranType'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.nvl = function(text) {
        if (text === null){
          return '';
        } else {
          return text;
        }
      };
    
    alasql('SELECT tranTypeCd AS [Tran Type No],typePrefix AS [Prefix],tranTypeName AS [Transaction Type Name],defaultParticulars AS [Default Particulars],masterTranType AS [Master Transaction Type],autoTag AS [Auto],baeTag AS [BAE],activeTag AS [Active] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);    
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  retrieveTax(){
    var sub$ = forkJoin(this.maintenanceService.getAcseDefTax(this.params.tranClass,this.params.tranTypeCd),
                        this.maintenanceService.getAcseDefWhTax(this.params.tranClass,this.params.tranTypeCd)).pipe(map(([genTax, whTaxId]) => { return { genTax, whTaxId} }));

    this.genTable.loadingFlag = true;
    this.whTaxTable.loadingFlag = true;
    this.subscription.add(sub$.subscribe((data:any) => {
      this.genTaxData.tableData = data.genTax.defTax;
      this.whTaxData.tableData = data.whTaxId.defWhTax;

      this.genTable.loadingFlag = false;
      this.genTable.refreshTable();
      this.whTaxTable.loadingFlag = false;
      this.whTaxTable.refreshTable();
    }));
  }

  clickLovTax(data){
    console.log(data)
    this.passLov.activeTag = 'Y';
    this.passLov.selector = 'mtnGenTax';
    this.lovCheckbox = true;
    this.passLov.hide = this.genTaxData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
    this.defTaxLov.openLOV();
  }

  setDefTax(data){
    console.log(data.data)
    this.genTaxData.tableData = this.genTaxData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < data.data.length; i++){
      this.genTaxData.tableData.push(JSON.parse(JSON.stringify(this.genTaxData.nData)));
      this.genTaxData.tableData[this.genTaxData.tableData.length - 1].showMG = 0;
      this.genTaxData.tableData[this.genTaxData.tableData.length - 1].taxCd = data.data[i].taxCd;
      this.genTaxData.tableData[this.genTaxData.tableData.length - 1].taxDesc = data.data[i].taxName;
      this.genTaxData.tableData[this.genTaxData.tableData.length - 1].taxId = data.data[i].taxId;
      this.genTaxData.tableData[this.genTaxData.tableData.length - 1].taxRate = data.data[i].taxRate;
      this.genTaxData.tableData[this.genTaxData.tableData.length - 1].fixedAmount = data.data[i].amount;
      this.genTaxData.tableData[this.genTaxData.tableData.length - 1].edited = true;
    }
    this.genTable.refreshTable();
  }

  clickDefWhTax(data){
    this.passLov.activeTag = 'Y';
    this.passLov.selector = 'mtnWhTax';
    this.lovCheckbox = true;
    this.passLov.hide = this.whTaxData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
    this.defWhTaxLov.openLOV();
  }

  setDefWhTax(data){
    console.log(data.data)
    this.whTaxData.tableData = this.whTaxData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < data.data.length; i++){
      this.whTaxData.tableData.push(JSON.parse(JSON.stringify(this.whTaxData.nData)));
      this.whTaxData.tableData[this.whTaxData.tableData.length - 1].showMG = 0;
      this.whTaxData.tableData[this.whTaxData.tableData.length - 1].taxCd = data.data[i].taxCd;
      this.whTaxData.tableData[this.whTaxData.tableData.length - 1].taxDesc = data.data[i].taxName;
      this.whTaxData.tableData[this.whTaxData.tableData.length - 1].whTaxId = data.data[i].whTaxId;
      this.whTaxData.tableData[this.whTaxData.tableData.length - 1].taxRate = data.data[i].taxRate;
      this.whTaxData.tableData[this.whTaxData.tableData.length - 1].edited = true;
    }
    this.whTaxTable.refreshTable();
  }

  onClickSaveTax(){
    this.defTaxSave.confirmModal();
  }

  saveDefTax(){
    this.paramsDefTax.saveDefTax = [];
    this.paramsDefTax.saveDefWhTax = [];
    this.paramsDefTax.delDefTax = [];
    this.paramsDefTax.delDefWhTax = [];

    this.genTaxData.tableData.forEach((a) =>{
      if(a.edited && !a.deleted){
        this.paramsDefTax.saveDefTax.push(a);
        this.paramsDefTax.saveDefTax[this.paramsDefTax.saveDefTax.length - 1].tranClass = this.params.tranClass;
        this.paramsDefTax.saveDefTax[this.paramsDefTax.saveDefTax.length - 1].tranTypeCd = this.params.tranTypeCd;
        this.paramsDefTax.saveDefTax[this.paramsDefTax.saveDefTax.length - 1].createDate = this.ns.toDateTimeString(0);
        this.paramsDefTax.saveDefTax[this.paramsDefTax.saveDefTax.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(a.deleted){
        this.paramsDefTax.delDefTax.push(a);
      }
    });

    this.whTaxData.tableData.forEach((a) => {
      if(a.edited && !a.deleted){
        this.paramsDefTax.saveDefWhTax.push(a);
        this.paramsDefTax.saveDefWhTax[this.paramsDefTax.saveDefWhTax.length - 1].tranClass = this.params.tranClass;
        this.paramsDefTax.saveDefWhTax[this.paramsDefTax.saveDefWhTax.length - 1].tranTypeCd = this.params.tranTypeCd;
        this.paramsDefTax.saveDefWhTax[this.paramsDefTax.saveDefWhTax.length - 1].createDate = this.ns.toDateTimeString(0);
        this.paramsDefTax.saveDefWhTax[this.paramsDefTax.saveDefWhTax.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(a.deleted){
        this.paramsDefTax.delDefWhTax.push(a);
      }
    });

    console.log(this.paramsDefTax);

    this.maintenanceService.saveAcseDefTax(this.paramsDefTax).subscribe((data:any) => {
      console.log(data)
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveAmtDetl();
      }
    });
  }
}
