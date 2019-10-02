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
	        updateDate: ''
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
	  genTaxIndex: number;
	  whTaxIndex: number;

	  passLov: any = {
	    selector: '',
	    activeTag: '',
	    hide: []
	  }

  constructor(private as: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
  }

  openTaxAllocation(){
  	this.taxAllocMdl.openNoClose();
  }

  onRowClick(data){
  	console.log(data);
  	if(data === null){
  		this.disableTaxBtn = true;
  	}else{
  		this.disableTaxBtn = false;
  		this.passDataGenTax.nData.tranId = data.tranId;
  		this.passDataGenTax.nData.billId = data.billId;
  		this.passDataGenTax.nData.itemNo = data.itemNo;
  		this.passDataWhTax.nData.tranId = data.tranId;
  		this.passDataWhTax.nData.billId = data.billId;
  		this.passDataWhTax.nData.itemNo = data.itemNo;
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
  }

}
