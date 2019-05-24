import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-treaty-share',
  templateUrl: './treaty-share.component.html',
  styleUrls: ['./treaty-share.component.css']
})
export class TreatyShareComponent implements OnInit {
	@ViewChild('treatyYearTable') treatyYearTable: CustEditableNonDatatableComponent;
	@ViewChild('treatyCommTable') treatyCommTable: CustEditableNonDatatableComponent;
	@ViewChild('treatyShareTable') treatyShareTable: CustEditableNonDatatableComponent;
	@ViewChild('cedingRetentionTable') cedingRetentionTable: CustEditableNonDatatableComponent;
  	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;

  	treatyYearData: any = {
	  	tableData: [],
	  	tHeader: ['Treaty Year'],
	  	dataTypes: ['pk'],
	  	keys: ['treatyYear'],
	  	widths: ['auto'],
	  	nData: {
	  		newRec: 1,
	  		treatyYear: '',
	  		createUser: '',
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: false,
	  	pageLength: 5,
	  	pageID: 'treatyYearTab'
  	}

  	treatyCommData: any = {
	  	tableData: [],
	  	tHeader: ['Treaty No', 'Treaty', 'Comm Rate (%)', 'Sort Seq'],
	  	dataTypes: ['lovInput', 'text', 'percent', 'number'],
	  	keys: ['treatyId','treatyName','commRate','sortSeq'],
	  	uneditable: [false,true,false,false],
	  	widths: ['auto','auto','auto','auto'],
	  	nData: {
	  		showMG: 1,
	  		treatyId: '',
	  		treatyName: '',
	  		commRate: '',
	  		sortSeq: '',
	  		createUser: '',
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: false,
	  	pageLength: 5,
	  	magnifyingGlass: ['treatyId'],
	  	pageID: 'treatyCommTab'
  	}

  	treatyShareData: any = {
	  	tableData: [],
	  	tHeader: ['Company No', 'Company Name', 'Abbreviation', 'Share (%)', 'Sort Sequence', 'Remarks'],
	  	dataTypes: ['lovInput', 'text', 'text', 'percent', 'number', 'text'],
	  	keys: ['trtyCedId','trtyCedName','trtyCedAbbr','pctShare','sortSeq','remarks'],
	  	uneditable: [false,true,true,false,false,false],
	  	widths: ['auto','auto','auto','auto'],
	  	nData: {
	  		showMG: 1,
	  		trtyCedId: '',
	  		trtyCedName: '',
	  		trtyCedAbbr: '',
	  		pctShare: '',
	  		sortSeq: '',
	  		remarks: '',
	  		createUser: '',
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: false,
	  	magnifyingGlass: ['trtyCedId'],
	  	pageID: 'treatyShareTab'
  	}

  	cedingRetentionData: any = {
	  	tableData: [],
	  	tHeader: ['Company No', 'Company Name', '1st Retention', '2nd Retention', 'Active', 'Inactive Date', 'Remarks'],
	  	dataTypes: ['lovInput', 'text', 'number', 'number', 'checkbox', 'date', 'text'],
	  	keys: ['cedingId','cedingName','retLine1','retLine2','activeTag','inactiveDate','remarks'],
	  	uneditable: [false,true,false,false,false,true,false], //membership tag = y
	  	widths: ['auto','auto','auto','auto'],
	  	nData: {
	  		showMG: 1,
	  		cedingId: '',
	  		cedingName: '',
	  		retLine1: '',
	  		retLine2: '',
	  		activeTag: '',
	  		inactiveDate: null,
	  		remarks: '',
	  		createUser: '',
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: false,
	  	magnifyingGlass: ['cedingId'],
	  	pageID: 'cedingRetentionTab'
  	}

  	treatyCommLOVRow: number;
  	treatyShareLOVRow: number;
  	cedingRetentionLOWRow: number;

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

	ngOnInit() {
		this.alignTreatyYear();
		
		setTimeout(() => {
			this.treatyYearTable.refreshTable();
			this.treatyCommTable.refreshTable();
			this.treatyShareTable.refreshTable();
			this.cedingRetentionTable.refreshTable();
			
		}, 0);
	}

	/*sectionCoversLOV(data){
	    // this.hideSectionCoverArray = this.passData.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
	    $('#sectionCoversLOV #modalBtn').trigger('click');
	    //data.tableData = this.passData.tableData;
	    this.treatyLOVRow = data.index;
	}*/

	alignTreatyYear() {
		setTimeout(() => {
			$('#treaty-year-table').find('th').css('text-align', 'center');
			$('#treaty-year-table').find('td').css('text-align', 'center');
			$('#treaty-year-table').find('td').find('input').css('text-align', 'center');
		}, 0);
	}

}
