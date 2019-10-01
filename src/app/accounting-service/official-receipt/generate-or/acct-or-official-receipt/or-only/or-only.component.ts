import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-or-only',
  templateUrl: './or-only.component.html',
  styleUrls: ['./or-only.component.css']
})
export class OrOnlyComponent implements OnInit {

	@Input() record: any;
	@ViewChild('taxAlloc') taxAllocMdl : ModalComponent;

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

  constructor(private as: AccountingService, private ns: NotesService) { }

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

}
