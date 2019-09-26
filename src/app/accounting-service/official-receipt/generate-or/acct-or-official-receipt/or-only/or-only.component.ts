import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-or-only',
  templateUrl: './or-only.component.html',
  styleUrls: ['./or-only.component.css']
})
export class OrOnlyComponent implements OnInit {

	@Input() record: any;

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
	    widths: ['auto',120,1,100,120,120]
	  }

  constructor(private as: AccountingService, private ns: NotesService) { }

  ngOnInit() {
  }

  openTaxAllocation(){
   $('#taxAlloc #modalBtn').trigger('click');
 }

}
