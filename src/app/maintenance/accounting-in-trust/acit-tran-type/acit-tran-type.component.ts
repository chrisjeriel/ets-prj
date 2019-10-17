import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router, NavigationExtras } from '@angular/router';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-acit-tran-type',
  templateUrl: './acit-tran-type.component.html',
  styleUrls: ['./acit-tran-type.component.css']
})
export class AcitTranTypeComponent implements OnInit {
  
   @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
   @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
   @ViewChild('AcctEntries') acctEntryMdl: ModalComponent;
   @ViewChild('amountDetails') amountDetailsMdl: ModalComponent;

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
      dataTypes: ['number','text', 'text', 'text','text', 'checkbox','checkbox'],
      nData: {
      	createUser:this.ns.getCurrentUser(),
      	createDate:'',
      	updateUser:this.ns.getCurrentUser(),
      	updateDate:''
      },
      searchFlag: true,
      infoFlag: true,
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      paginateFlag: true,
      pageLength: 10,
      pageID: 2,
      uneditable: [true,false,false,false,false,false,false],
      //widths: [85,100,305,310,165,50,50,50],
      keys: ['tranTypeCd', 'typePrefix', 'tranTypeName', 'defaultParticulars', 'masterTranType', 'autoTag','baeTag'],
  };

   amountDtl: any = {
      tableData: [],
      tHeader: ['Item No','Detail Description', 'Accounting Entry Source', 'Acct Entry Amount Tag','Sign'],
      dataTypes: ['number','text', 'text', 'checkbox','text'],
      nData: {
        createUser:this.ns.getCurrentUser(),
        createDate:'',
        updateUser:this.ns.getCurrentUser(),
        updateDate:''
      },
      searchFlag: true,
      infoFlag: true,
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      paginateFlag: true,
      pageLength: 10,
      pageID: 3,
      uneditable: [true,false,false,false,false],
      //widths: [85,100,305,310,165,50,50,50],
      keys: ['tranTypeCd', 'typePrefix', 'tranTypeName', 'defaultParticulars', 'masterTranType'],
  };

  params = {
  	tranClass:'',
  	tranName:'',
    tranType:'',
  	remarks:'',
    saveTranType:[],
    delTranType: [],
    createUser:'',
    createDate:'',
    updateUser:'',
    updateDate:''
  };

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
  		this.passData.tableData = [];
  		this.params.tranName = data.tranTypeList[0].tranClassName;
  		for (var i = 0; i < data.tranTypeList.length; i++) {
  			this.passData.tableData.push(data.tranTypeList[i]);
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
      this.params.tranType = data.tranTypeName;
  	}else{
  		this.params.createUser = '';
  		this.params.createDate = '';
  		this.params.updateUser = '';
  		this.params.updateDate = '';
  		this.params.remarks = '';
      this.acctEntryBut = true;
      this.params.tranType = '';
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
      this.confirm.confirmModal();
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
  }

  onClickAmounDtl(){
    this.amountDetailsMdl.openNoClose();
  }
}
