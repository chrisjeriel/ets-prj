import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-or-only',
  templateUrl: './or-only.component.html',
  styleUrls: ['./or-only.component.css']
})
export class OrOnlyComponent implements OnInit {

	@Input() record: any;
	@ViewChild('taxAlloc') taxAllocMdl : ModalComponent;
	@ViewChild(LovComponent) lovMdl: LovComponent;
	@ViewChild('mainTbl') mainTbl: CustEditableNonDatatableComponent;
	@ViewChild('genTaxTbl') genTaxTbl: CustEditableNonDatatableComponent;
	@ViewChild('whTaxTbl') whTaxTbl: CustEditableNonDatatableComponent;
	@ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

	 passData : any = {
	    tableData: [],
	    tHeader : ["Item","Reference No","Curr","Curr Rate","Amount","Amount(PHP)"],
	    dataTypes: ["text","text","text","percent","currency","currency"],
	    addFlag: true,
	    deleteFlag: true,
	    checkFlag: true,
	    infoFlag: true,
	    pageLength: 10,
	    paginateFlag: true,
	    total: [null,null,null,'Total','currAmt','localAmt'],
	    uneditable: [false,false,true,true,false,true],
	    nData: {
	        tranId: '',
	        billId: '',
	        itemNo: '',
	        itemName: '',
	        currCd: '',
	        currRate: '',
	        currAmt: 0,
	        localAmt: 0,
	        refNo: '',
	        remarks: '',
	        createUser: '',
	        createDate: '',
	        updateUser: '',
	        updateDate: '',
	        taxAllocation: []
	    },
	    keys: ['itemName', 'refNo', 'currCd', 'currRate', 'currAmt', 'localAmt'],
	    widths: ['auto',120,1,100,120,120],
	    pageID: 'mainTbl'
	  }

	  passDataGenTax : any = {
	  	tableData: [],
	    tHeader : ["Tax Code","Description","Rate","Amount"],
	    dataTypes: ["text","text","percent","currency"],
	    addFlag: true,
	    deleteFlag: true,
	    checkFlag: true,
	    pageLength: 5,
	    //uneditable: [false,false,true,true,false,true],
	    magnifyingGlass: ['taxCd'],
	    nData: {
	        tranId: '',
	        billId: '',
	        itemNo: '',
	        taxType: 'G', //for General Tax, Tax Type
	        taxCd: '',
	        taxName: '',
	        taxRate: '',
	        taxAmt: 0,
	        createUser: '',
	        createDate: '',
	        updateUser: '',
	        updateDate: '',
	        showMG: 1
	    },
	    keys: ['taxCd', 'taxName', 'taxRate', 'taxAmt'],
	    widths: [1,150,120,120],
	    pageID: 'genTaxTbl'
	  }

	  passDataWhTax : any = {
	  	tableData: [],
	    tHeader : ["Tax Code","Description","Rate","Amount"],
	    dataTypes: ["text","text","percent","currency"],
	    addFlag: true,
	    deleteFlag: true,
	    checkFlag: true,
	    pageLength: 5,
	    //uneditable: [false,false,true,true,false,true],
	    magnifyingGlass: ['taxCd'],
	    nData: {
	        tranId: '',
	        billId: '',
	        itemNo: '',
	        taxType: 'W', //for Witholding Tax, Tax Type
	        taxCd: '',
	        taxName: '',
	        taxRate: '',
	        taxAmt: 0,
	        createUser: '',
	        createDate: '',
	        updateUser: '',
	        updateDate: '',
	        showMG: 1
	    },
	    keys: ['taxCd', 'taxName', 'taxRate', 'taxAmt'],
	    widths: [1,150,120,120],
	    pageID: 'whTaxTbl'
	  }

	  selectedItem: any;
	  disableTaxBtn: boolean = true;
	  cancelFlag: boolean = false;
	  genTaxIndex: number;
	  whTaxIndex: number;
	  dialogMessage: string = '';
	  dialogIcon: string = '';

	  passLov: any = {
	    selector: '',
	    activeTag: '',
	    hide: []
	  }

	  savedData: any = [];
	  deletedData: any = [];

  constructor(private as: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
  	this.retrieveOrTransDtl();
  }

  openTaxAllocation(){
  	this.taxAllocMdl.openNoClose();
  }

  retrieveOrTransDtl(){
  	this.passData.tableData = [];
  	this.as.getAcseOrTransDtl(this.record.tranId, 1).subscribe(
  		(data:any)=>{
  			console.log(data.orDtlList);
  			if(data.orDtlList.length !== 0){
  				//this.passData.tableData = data.orDtList;
  				for(var i  of data.orDtlList){
  					this.passData.tableData.push(i);
  				}
  			}
  			this.mainTbl.refreshTable();
  		},
  		(error)=>{
  			console.log('An error occured');
  			console.log(error);
  		}
    );
  }

  onRowClick(data){
  	console.log(data);
  	if(data === null){
  		this.disableTaxBtn = true;
  		this.selectedItem = null;
  	}else{
  		this.disableTaxBtn = false;
  		this.passDataGenTax.nData.tranId = data.tranId;
  		this.passDataGenTax.nData.billId = data.billId;
  		this.passDataGenTax.nData.itemNo = data.itemNo;
  		this.passDataWhTax.nData.tranId = data.tranId;
  		this.passDataWhTax.nData.billId = data.billId;
  		this.passDataWhTax.nData.itemNo = data.itemNo;
  		this.passDataGenTax.tableData = data.taxAllocation.filter(a=>{return a.taxType == 'G'});
  		this.passDataWhTax.tableData = data.taxAllocation.filter(a=>{return a.taxType == 'W'});
  		this.genTaxTbl.refreshTable();
  		this.whTaxTbl.refreshTable();
  		this.selectedItem = data;
  	}
  }

  openGenTaxLOV(event){
  	this.passLov.activeTag = 'Y';
  	this.passLov.selector = 'mtnGenTax';
    this.passLov.hide = this.passDataGenTax.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
    console.log(this.passLov.hide);
    this.genTaxIndex = event.index;
    this.lovMdl.openLOV();
  }

  openWhTaxLOV(event){
  	this.passLov.activeTag = 'Y';
  	this.passLov.selector = 'mtnWhTax';
    this.passLov.hide = this.passDataWhTax.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
    console.log(this.passLov.hide);
    this.whTaxIndex = event.index;
    this.lovMdl.openLOV();
  }

  setSelectedData(data){
  	let selected = data.data;
    if(selected[0].taxId !== undefined){ //set values to general taxes table
    	console.log(selected);
	    this.passDataGenTax.tableData = this.passDataGenTax.tableData.filter(a=>a.showMG!=1);
	    for(var i = 0; i < selected.length; i++){
	      this.passDataGenTax.tableData.push(JSON.parse(JSON.stringify(this.passDataGenTax.nData)));
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxCd = selected[i].taxCd; 
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxName = selected[i].taxName; 
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxRate = selected[i].taxRate;
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxAmt = selected[i].amount;
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].tranId = this.record.tranId;
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].billId = 1;
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].edited = true;
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].showMG = 0;
	      this.passDataGenTax.tableData[this.passData.tableData.length - 1].uneditable = ['taxCd'];
    	}
    	this.genTaxTbl.refreshTable();
    }else if(selected[0].whTaxId !== undefined){ //set values to withholding taxes table
    	console.log(selected);
    	this.passDataWhTax.tableData = this.passDataWhTax.tableData.filter(a=>a.showMG!=1);
    	for(var i = 0; i < selected.length; i++){
    	  this.passDataWhTax.tableData.push(JSON.parse(JSON.stringify(this.passDataWhTax.nData)));
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxCd = selected[i].taxCd; 
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxName = selected[i].taxName; 
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxRate = selected[i].taxRate;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxAmt = 1 * selected[i].taxRate; //placeholder
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].tranId = this.record.tranId;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].billId = 1;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].edited = true;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].showMG = 0;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].uneditable = ['taxCd'];
    	}
    	this.whTaxTbl.refreshTable();
    }
    this.selectedItem.edited = true;
    this.selectedItem.taxAllocation = this.passDataGenTax.tableData.concat(this.passDataWhTax.tableData);
  }

  onClickSave(){
  	this.confirm.confirmModal();
  }

  onClickCancel(){
  	this.cancelBtn.clickCancel();
  }

  save(cancelFlag?){
  	var totalLocalAmt: number = 0;
  	this.cancelFlag = cancelFlag !== undefined;
  	this.savedData = [];
  	this.deletedData = [];
  	for (var i = 0 ; this.passData.tableData.length > i; i++) {
  	  if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  	      this.savedData.push(this.passData.tableData[i]);
  	      this.savedData[this.savedData.length-1].tranId = this.record.tranId;
  	      this.savedData[this.savedData.length-1].billId = 1; //1 for Official Receipt Transaction Type
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
  	  }
  	  else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
  	     this.deletedData.push(this.passData.tableData[i]);
  	     this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
  	     this.deletedData[this.deletedData.length-1].billId = 1; //1 for Official Receipt Transaction Type
  	     this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
  	     this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	  }
  	}
  	this.passData.tableData.filter(a=>{return !a.deleted}).forEach(b=>{
  		totalLocalAmt += b.localAmt;
  	});
  	let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Official Receipt Transaction Type
      billType: this.record.tranTypeCd,
      totalLocalAmt: totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveOrTransDtl: this.savedData,
      delOrTransDtl: this.deletedData
    }

    this.as.saveAcseOrTransDtl(params).subscribe(
      (data:any)=>{
        if(data.returnCode === 0){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          this.dialogIcon = '';
          this.successDiag.open();
          this.passData.tableData = [];
          this.retrieveOrTransDtl();
          this.mainTbl.refreshTable();
        }
      },
      (error: any)=>{

      }
    );
  }

}
