import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { PrintModalMtnAcctComponent } from '@app/_components/common/print-modal-mtn-acct/print-modal-mtn-acct.component';
import * as alasql from 'alasql';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-gen-taxes',
  templateUrl: './gen-taxes.component.html',
  styleUrls: ['./gen-taxes.component.css']
})
export class GenTaxesComponent implements OnInit {

  @ViewChild('gentax') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('myForm') form:any;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any ;
  cancelFlag: boolean; 
  boolRange: boolean = true;
  boolPrint: boolean = false;
  lovRow: any ;

  passTable:any={
  	tableData:[],
  	widths:[1,80,200,1,80,1,1,1,1,1],
  	tHeader:['Tax ID','Tax Code','Tax Name','Charge Type', 'Rate','Amount','Default GL Account','GL Account Name','Fixed','Active'],
  	dataTypes:['number','text','text','select','percent','currency','text','text','checkbox','checkbox'],
  	tooltip:[],
  	uneditable:[true,false,false,false,false,false,true,false,false,false],
  	keys:['taxId','taxCd','taxName','chargeType','taxRate','amount','defaultAcseGl','defaultGLBankAcctName','fixedTag','activeTag'],
  	magnifyingGlass: [ "defaultAcseGl"],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	pageID : 'genTax',
  	nData:{
  	  showMG : 1,
      taxId: null,
      taxCd : null,
      taxName : null,
      chargeType : null,
      taxRate : null,
      amount : null,
      defaultAcitGl : null,
      defaultAcseGl : null,
      fixedTag : 'Y',
      activeTag : 'Y',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true,
    opts: [{
	            selector: 'chargeType',
	            prev: ['Rate','Amount','Range'],
	            vals: ['R','A','G'],
        	}]
  } 

  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
  	 this.titleService.setTitle('Mtn | General Taxes');
  	 setTimeout(a=>this.table.refreshTable(),0);
  	 this.getMtnDGenTax();
  }

  getMtnDGenTax(){
  	this.ms.getMtnGenTax().subscribe(a=>{
  		this.passTable.tableData = a['genTaxList'];
  		this.passTable.tableData.forEach(a=>{
	  			a.createDate = this.ns.toDateTimeString(a.createDate);
	  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
				a.showMG = 1;
	  	})
	    this.table.refreshTable();
        this.table.overlayLoader = false;
	  	this.passTable.distableGeneric = false;
    });
  }

  onTableClick(data){
  	console.log(data);
  	if (data === null){
  	  this.info = null;
  	  this.passTable.disableGeneric = true;
  	  this.boolRange = true;
  	} else {
      this.info = data;
  	  this.passTable.disableGeneric = false;

  	  if (data.chargeType === 'G'){
  	  	this.boolRange = false;
  	  }
  	}
  }

  delete(){
  	if(this.table.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'Deleting this record is not allowed. This was already used in some accounting records.';
  		this.successDialog.open();
  	}else{
  		this.table.selected  = [this.table.indvSelect]
  		this.table.confirmDelete();
  		$('#cust-table-container').addClass('ng-dirty');
  	}
  }

  clickLOV(data){
  	this.lovRow = null;

  	 if(data.key=='defaultAcseGl'){
        $('#bankAcctLOV #modalBtn').trigger('click');
        data.tableData = this.passTable.tableData;
        this.lovRow = data.index;
     }
  }

  selectedBankAcctLOV(data){
  	if(data === null){
  	 	  this.passTable.tableData[this.lovRow].defaultAcseGl = null;
  	 	  this.passTable.tableData[this.lovRow].defaultGLBankAcctName = null;
  	 	}else {
  	 	  this.passTable.tableData[this.lovRow].defaultAcseGl =data.bankAcctCd;
  	 	  this.passTable.tableData[this.lovRow].defaultGLBankAcctName = data.accountNo;
  	 	}
  	 this.passTable.tableData[this.lovRow].edited = true;
     $('#cust-table-container').addClass('ng-dirty');
  }

  update(data){
  	 for(var i= 0; i< this.passTable.tableData.length; i++){
  	 	 if(this.passTable.tableData[i].edited || this.passTable.tableData[i].add){
  	 	   if (data.key === 'chargeType'){
              if(this.passTable.tableData[i].chargeType === 'R')
                  this.passTable.tableData[i].amount = null;
                  this.boolRange = true;
               }
               if (this.passTable.tableData[i].chargeType === 'A'){
               	  this.passTable.tableData[i].taxRate = null;
                  this.boolRange = true;
               }
               if (this.passTable.tableData[i].chargeType === 'G'){
               	  this.boolRange = false;
               	  this.passTable.tableData[i].amount = null;
               	  this.passTable.tableData[i].taxRate = null;
               }
           }
	  	 }
  	 }
  


}
