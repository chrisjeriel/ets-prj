import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router, NavigationExtras } from '@angular/router';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-acit-tran-type',
  templateUrl: './acit-tran-type.component.html',
  styleUrls: ['./acit-tran-type.component.css']
})
export class AcitTranTypeComponent implements OnInit {
  
   @ViewChild('tranType') table: CustEditableNonDatatableComponent;
   @ViewChild('amtDtlTbl') amtDtlTbl: CustEditableNonDatatableComponent;
   @ViewChild('acctEntTbl') acctEntTbl: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild('tranTypeSave') tranTypeSave: ConfirmSaveComponent;
   @ViewChild('tranTypeCancel') cancelBtn : CancelButtonComponent;
   @ViewChild('amtDetailSave') amtDetailSave: ConfirmSaveComponent;
   @ViewChild('AcctEntries') acctEntryMdl: ModalComponent;
   @ViewChild('amountDetails') amountDetailsMdl: ModalComponent;
   @ViewChild('amtDtlLov') amtDtlLov: LovComponent;
   @ViewChild('acctEntryLov') acctEntryLov: LovComponent;
   @ViewChild('acctEntrySave') acctEntrySave: ConfirmSaveComponent;
   
   passData: any = {
      tableData: [],
      tHeader: ['Tran Type No','Prefix', 'Transaction Type Name', 'Default Particulars','Master Transaction Type', 'Auto','BAE','Active'],
      dataTypes: ['number','text', 'text', 'text','text', 'checkbox','checkbox','checkbox'],
      nData: {
      	tranClass:'',
      	tranTypeCd:'',
      	typePrefix:'',
      	tranTypeName:'',
      	defaultParticulars:'',
      	masterTranType:'',
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
      checkFlag: true,
      addFlag: false,
      deleteFlag: false,
      paginateFlag: true,
      pageLength: 10,
      pageID: 1,
      uneditable: [true,false,false,false,false,false,true,false],
      widths: [85,100,305,310,165,50,50,50],
      keys: ['tranTypeCd', 'typePrefix', 'tranTypeName', 'defaultParticulars', 'masterTranType', 'autoTag','baeTag', 'activeTag'],
  };

   acctEntries: any = {
      tableData: [],
      tHeader: ['Account Code','Account Name', 'SL Type', 'Sub1','Sub2', 'Sub3','Debit/Credit'],
      dataTypes: ['text','text', 'text', 'text','text', 'text','select'],
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
      opts: [{
              selector: 'drCrTag',
              prev: ['Debit','Credit'],
              vals: ['D','C'],
             }
      ],
      uneditable: [true,false,false,false,false,false,false],
      widths: [100,300,187,90,90,90,95],
      keys: ['shortCode', 'glShortDesc', 'slTypeName', 'sub1Dep', 'sub2Dep', 'sub3Dep','drCrTag'],
  };

   amountDtl: any = {
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

  paramsAmtDtl = {
    delDefAmt: [],
    saveDefAmt: []
  }

  paramsAcctEntries = {
    saveAcctEnt: [],
    delAcctEnt : []
  }

  passLov:any = {
    selector:'',
    params:{}
  }

  lovRow: any;
  dialogIcon : any;
  dialogMessage : any;
  cancelFlag: boolean = false;
  acctEntryBut: boolean = true;

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService,private router: Router) { }

  ngOnInit() {
  }

  retrieveTranType(){
    this.table.loadingFlag = true
    this.passData.addFlag = true;
    this.passData.deleteFlag = true;
  	this.maintenanceService.getAcitTranType(this.params.tranClass,null,null,null,null,null).subscribe((data:any) => {
      console.log(data)
  		this.passData.tableData = [];
  		this.params.tranName = data.tranTypeList[0].tranClassName;
  		for (var i = 0; i < data.tranTypeList.length; i++) {
  			this.passData.tableData.push(data.tranTypeList[i]);
        this.passData.tableData[this.passData.tableData.length - 1].showMG = 1;
  		}
  		this.table.refreshTable();
      this.table.loadingFlag = false;
  	});
  }

  onRowClick(data){
  	console.log(data)
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

  update(){
  	
  }

  onClickSave(){
    var errorFlag = false;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].masterTranType === '' && this.passData.tableData[i].autoTag === 'Y'){
        errorFlag = true;
      }
    }

    if(errorFlag){
      this.dialogMessage = "Tran type with auto tag must have master transaction type";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.tranTypeSave.confirmModal();
    }
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
  	this.cancelFlag = cancel !== undefined;
  	this.prepareData();
  	this.maintenanceService.saveAcitTrantype(this.params).subscribe((data:any) => {
  		if(data['returnCode'] != -1) {
  		  this.dialogMessage = data['errorList'][0].errorMessage;
  		  this.dialogIcon = "error";
  		  this.successDiag.open();
  		}else{
  		  this.dialogMessage = "";
  		  this.dialogIcon = "success";
  		  this.successDiag.open();
  		  this.retrieveTranType();
  		}
  	});
  }

  onClickAcctEntries(){
    this.acctEntryMdl.openNoClose();
    this.retrieveAcctEnt();
  }

  onClickAmounDtl(){
    this.amountDetailsMdl.openNoClose();
    this.retrieveAmtDtl();
  }

  retrieveAmtDtl(){
    this.amtDtlTbl.loadingFlag = true;
    this.maintenanceService.getAcitDefAmt(this.params.tranClass,this.params.tranTypeCd).subscribe((data:any) => {
      this.amountDtl.tableData = [];
      for (var i = 0; i < data.defAmtDtl.length; i++) {
        this.amountDtl.tableData.push(data.defAmtDtl[i]);
      }
      this.amtDtlTbl.loadingFlag = false;
      this.amtDtlTbl.refreshTable();
      this.amtDtlTbl.onRowClick(null,this.amountDtl.tableData[0]);
    });
  }

  clickLov(data){
    this.lovRow = data.index;
    console.log(data)
    this.passLov.selector = 'acitChartAcct';
    this.passLov.params = {};
    this.amtDtlLov.openLOV();
  }

  setLov(data){
    console.log(data.data);
    this.amountDtl.tableData[this.lovRow].shortCode = data.data.shortCode;
    this.amountDtl.tableData[this.lovRow].defaultGl = data.data.glAcctId;
    this.amountDtl.tableData[this.lovRow].showMG = 0;
    this.amtDtlTbl.refreshTable();
  }

  saveAmtDtl(cancel?){
    this.paramsAmtDtl.delDefAmt = [];
    this.paramsAmtDtl.saveDefAmt = [];

    for (var i = 0; i < this.amountDtl.tableData.length; i++) {
      if(this.amountDtl.tableData[i].edited && !this.amountDtl.tableData[i].deleted){
        this.paramsAmtDtl.saveDefAmt.push(this.amountDtl.tableData[i]);
        this.paramsAmtDtl.saveDefAmt[this.paramsAmtDtl.saveDefAmt.length - 1].tranClass = this.params.tranClass;
        this.paramsAmtDtl.saveDefAmt[this.paramsAmtDtl.saveDefAmt.length - 1].tranTypeCd = this.params.tranTypeCd;
        this.paramsAmtDtl.saveDefAmt[this.paramsAmtDtl.saveDefAmt.length - 1].createDate = this.ns.toDateTimeString(0);
        this.paramsAmtDtl.saveDefAmt[this.paramsAmtDtl.saveDefAmt.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.amountDtl.tableData[i].deleted){
        this.paramsAmtDtl.delDefAmt.push(this.amountDtl.tableData[i]);
      }
    }

    this.maintenanceService.saveAcitAmtDtl(this.paramsAmtDtl).subscribe((data:any)=>{
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveAmtDtl();
      }
    });
  }

  defAmtClick(data){
    console.log(data)
    if(data!==null){
      this.params.remarks = data.remarks;
    }else{
      this.params.remarks = '';
    }
  }

  onClickSaveAmounDtl(){
    this.amtDetailSave.confirmModal();
  }

  retrieveAcctEnt(){
    this.acctEntTbl.loadingFlag = true;
    this.maintenanceService.getAcitDefAcctEnt(this.params.tranClass,this.params.tranTypeCd).subscribe((data:any) => {
      console.log(data);
      this.acctEntries.tableData = [];
      for (var i = 0; i < data.defAccEnt.length; i++) {
        this.acctEntries.tableData.push(data.defAccEnt[i]);
      }
      this.acctEntTbl.refreshTable();
      this.acctEntTbl.loadingFlag = false;
      this.acctEntTbl.onRowClick(null,this.acctEntries.tableData[0]);
    });
  }

  acctEntriesClick(data){
    console.log(data)
    if(data !== null){
      this.params.remarks = data.remarks;
    }else{
      this.params.remarks = '';
    }
  }

  openAcctEntryLov(data){
    console.log(data);
    this.lovRow = data.index;
    if(data.key === 'shortCode'){
      this.passLov.selector = 'acitChartAcct';
      this.passLov.params = {};
      this.acctEntryLov.openLOV();
    }else if (data.key === 'slTypeName') {
      this.passLov.selector = 'slType';
      this.passLov.params = {};
      this.acctEntryLov.openLOV();
    }
  }

  setLovAcct(data){
    console.log(data)
    if(data.selector == 'acitChartAcct'){
      console.log(data.data)
      this.acctEntries.tableData[this.lovRow].shortCode = data.data.shortCode;
      this.acctEntries.tableData[this.lovRow].glShortDesc = data.data.longDesc;
      this.acctEntries.tableData[this.lovRow].glAcctId = data.data.glAcctId;
    }else if(data.selector === 'slType'){
      this.acctEntries.tableData[this.lovRow].slTypeName = data.data.slTypeName;
      this.acctEntries.tableData[this.lovRow].slTypeCd = data.data.slTypeCd;
    }
    this.acctEntTbl.refreshTable();
  }

  onClickSaveAcctEnt(){
    this.acctEntrySave.confirmModal();
  }

  saveDefAcctEntries(cancel?){
    this.paramsAcctEntries.saveAcctEnt = [];
    this.paramsAcctEntries.delAcctEnt = [];

    for (var i = 0; i < this.acctEntries.tableData.length; i++) {
      if(this.acctEntries.tableData[i].edited && !this.acctEntries.tableData[i].deleted){
        this.paramsAcctEntries.saveAcctEnt.push(this.acctEntries.tableData[i]);
        this.paramsAcctEntries.saveAcctEnt[this.paramsAcctEntries.saveAcctEnt.length - 1].tranAmtTag = 'Y';
        this.paramsAcctEntries.saveAcctEnt[this.paramsAcctEntries.saveAcctEnt.length - 1].netDrcrTag = 'Y';
        this.paramsAcctEntries.saveAcctEnt[this.paramsAcctEntries.saveAcctEnt.length - 1].tranClass = this.params.tranClass;
        this.paramsAcctEntries.saveAcctEnt[this.paramsAcctEntries.saveAcctEnt.length - 1].tranTypeCd = this.params.tranTypeCd;
        this.paramsAcctEntries.saveAcctEnt[this.paramsAcctEntries.saveAcctEnt.length - 1].createDate = this.ns.toDateTimeString(this.acctEntries.tableData[i].createDate);
        this.paramsAcctEntries.saveAcctEnt[this.paramsAcctEntries.saveAcctEnt.length - 1].updateDate = this.ns.toDateTimeString(this.acctEntries.tableData[i].updateDate);
      }

      if(this.acctEntries.tableData[i].deleted){
        this.paramsAcctEntries.delAcctEnt.push(this.acctEntries.tableData[i]);
      }
    }

    this.maintenanceService.saveAcitDefAcctEnt(this.paramsAcctEntries).subscribe((data:any) => {
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
}
