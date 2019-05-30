import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTreatyComponent } from '@app/maintenance/mtn-treaty/mtn-treaty.component';

@Component({
  selector: 'app-treaty-limit',
  templateUrl: './treaty-limit.component.html',
  styleUrls: ['./treaty-limit.component.css']
})
export class TreatyLimitComponent implements OnInit {
	@ViewChild('treatyLimitTable') treatyLimitTable: CustEditableNonDatatableComponent;
	@ViewChild('treatyLayerTable') treatyLayerTable: CustEditableNonDatatableComponent;
  	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  	@ViewChild('lineLov') lineLov : MtnLineComponent;
  	@ViewChild('lineLovCopy') lineLovCopy : MtnLineComponent;
  	@ViewChild(MtnTreatyComponent) treatyLOV: MtnTreatyComponent;

  	treatyLimitData: any = {
	  	tableData: [],
	  	tHeader: ['Treaty Limit ID', 'Treaty Limit Amt', 'Treaty Layer Description', 'Effective From', 'Effective To', 'Active', 'Remarks'],
	  	dataTypes: ['sequence-3', 'currency', 'text', 'date', 'date', 'checkbox', 'text'],
	  	keys: ['treatyLimitId', 'amount', 'trtyLayerDesc', 'effDateFrom', 'effDateTo', 'activeTag', 'remarks'],
	  	widths: ['1','200','1','140','140','1','auto'],
	  	uneditable: [true,false,false,false,false,false, false],
	  	nData: {
	  		treatyLimitId: '',
	  		amount: '',
	  		trtyLayerDesc: '',
	  		effDateFrom: '',
	  		effDateTo: '',
	  		activeTag: 'Y',
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
	  	disableAdd: true
  	}

  	treatyLayerData: any = {
  		tableData: [],
	  	tHeader: ['Treaty No', 'Treaty Name'],
	  	dataTypes: ['lovInput-r', 'text'],
	  	keys: ['treatyId', 'treatyName'],
	  	widths: ['1','auto'],
	  	uneditable: [false,true],
	  	nData: {
	  		showMG: 1,
	  		treatyId: '',
	  		treatyName: '',
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
	  	disableAdd: true,
	  	pageLength: 5,
	  	magnifyingGlass: ['treatyId'],
  	}

  	params: any = {
  		saveTreatyLimit: [],
  		deleteTreatyLimit: [],
  		saveTreatyLayer: [],
  		deleteTreatyLayer: []
  	}

  	selected: any = null;
  	dialogIcon:string = '';
 	dialogMessage: string = '';
 	cancel: boolean = false;
 	lineCd: string = ''
	lineDesc: string = '';
	lineClassCd: string = '';
	lineClassCdDesc: string = '';
  	lineClassList: any[] = [];
  	disableCopySetup: boolean = true;
  	disableLCList: boolean = true;
  	errorMsg: number = 0;

  	copyLineCd: string = ''
	copyLineDesc: string = '';
	copyLineClassCd: string = '';
	copyLineClassList: any[] = [];
	disableCopyLCList: boolean = true;

	treatyLimitSelected: any = null;
	treatyLayerSelected: any = null;
	hiddenTreaty: any[] = [];
	treatyLOVRow: number;

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

	ngOnInit() {
		setTimeout(() => { this.treatyLimitTable.refreshTable(); this.treatyLayerTable.refreshTable(); }, 0);
	}

	getMtnTreatyLimit() {
		this.treatyLimitTable.overlayLoader = true;
		this.ms.getMtnTreatyLimit(this.lineCd, this.lineClassCd).subscribe(data => {
			this.treatyLimitData.tableData = data['treatyLimitList'].sort((a, b) => b.createDate - a.createDate)
																	.map(i => {
																			i.effDateFrom = this.ns.toDateTimeString(i.effDateFrom).split('T')[0];
																			i.effDateTo = this.ns.toDateTimeString(i.effDateTo).split('T')[0];
																			i.createDate = this.ns.toDateTimeString(i.createDate);
																			i.updateDate = this.ns.toDateTimeString(i.updateDate);
																			i.treatyLimitId = String(i.treatyLimitId).padStart(3, '0');
																			return i;
																		});
			this.treatyLimitData.disableAdd = false;
			this.treatyLimitData.disableGeneric = false;
			this.treatyLimitTable.refreshTable();
  			this.treatyLimitTable.onRowClick(null, this.treatyLimitData.tableData[0]);
		});
	}

	getMtnTreatyLayer() {
		if(this.treatyLimitSelected != null && this.treatyLimitSelected.treatyLimitId != '' && this.treatyLimitSelected.showMG != 1) {
			this.treatyLayerTable.overlayLoader = true;
			this.ms.getMtnTreatyLayer(this.treatyLimitSelected.treatyLimitId).subscribe(data => {
				this.treatyLayerData.tableData = data['treatyLayerList'].sort((a, b) => b.createDate - a.createDate)
																		.map(i => {
																				i.createDate = this.ns.toDateTimeString(i.createDate);
																				i.updateDate = this.ns.toDateTimeString(i.updateDate);
																				i.treatyId = String(i.treatyId).padStart(2, '0');
																				return i;
																			});
				this.treatyLayerData.disableAdd = false;
				this.treatyLayerData.disableGeneric = false;
				this.treatyLayerTable.refreshTable();
	  			this.treatyLayerTable.onRowClick(null, this.treatyLayerData.tableData[0]);
			});
		} else {
			this.treatyLayerData.tableData = [];
			this.treatyLayerTable.refreshTable();
			this.treatyLayerData.disableAdd = true;
			this.treatyLayerData.disableGeneric = true;
		}
		
	}

	onTreatyLimitRowClick(data) {
		this.selected = data;
		this.treatyLimitSelected = data;
		this.treatyLimitData.disableGeneric = this.treatyLimitSelected == null || this.treatyLimitSelected == '' || this.treatyLimitSelected.treatyLimitId != '';
		this.disableCopySetup = this.treatyLimitSelected == null || this.treatyLimitSelected == '' || this.treatyLimitSelected.treatyLimitId == '';
		this.getMtnTreatyLayer();
	}

	onTreatyLimitClickDelete() {
		this.treatyLimitTable.indvSelect.edited = true;
		this.treatyLimitTable.indvSelect.deleted = true;
		this.treatyLimitTable.confirmDelete();
	}

	onTreatyLayerRowClick(data) {
		this.selected = data;
		this.treatyLayerSelected = data;
		this.treatyLayerData.disableGeneric = this.treatyLayerSelected == null || this.treatyLayerSelected == '' || this.treatyLayerSelected.treatyId != '';
	}

	onTreatyLayerClickDelete() {
		this.treatyLayerTable.indvSelect.edited = true;
		this.treatyLayerTable.indvSelect.deleted = true;
		this.treatyLayerTable.confirmDelete();
	}

	checkCode(ev) {
		this.disableLCList = true;
	    this.ns.lovLoader(ev, 1);
	    this.lineLov.checkCode(this.lineCd, ev);
	}

	checkCodeCopy(ev) {
		this.disableCopyLCList = true;
	    this.ns.lovLoader(ev, 1);
	    this.lineLovCopy.checkCode(this.copyLineCd, ev);
	}

	setLine(data) {
  		this.disableLCList = false;
    	this.lineCd = data.lineCd;
    	this.lineDesc = data.description;
    	this.ns.lovLoader(data.ev, 0);

    	this.lineClassCd = '';
    	this.lineClassList = [];

    	if(this.lineDesc != '' && this.lineDesc != null) {
    		this.ms.getLineClassLOV(this.lineCd).subscribe(data => {
    			this.lineClassList = data['lineClass'];
    		});
    	}

		this.treatyLimitData.tableData = [];
		this.treatyLimitData.disableAdd = true;
  		this.treatyLimitData.disableGeneric = true;
  		this.disableCopySetup = true;
		this.treatyLimitTable.refreshTable();

    	setTimeout(() => {
    		if(data.ev) {
    			$(data.ev.target).removeClass('ng-dirty');
    		}
    	}, 0);
	}

	setLineCopy(data) {
  		this.disableCopyLCList = false;
    	this.copyLineCd = data.lineCd;
    	this.copyLineDesc = data.description;
    	this.ns.lovLoader(data.ev, 0);

    	this.copyLineClassCd = '';
    	this.copyLineClassList = [];

    	if(this.copyLineDesc != '' && this.copyLineDesc != null) {
    		this.ms.getLineClassLOV(this.copyLineCd).subscribe(data => {
    			this.copyLineClassList = data['lineClass'];
    		});
    	}

    	setTimeout(() => {
    		if(data.ev) {
    			$(data.ev.target).removeClass('ng-dirty');
    		}
    	}, 0);
	}

	showLineLOV() {		
	    this.lineLov.modal.openNoClose();
	}

	showLineLOVCopy() {		
	    this.lineLovCopy.modal.openNoClose();
	}

	lineClassChanged(ev) {
		this.lineClassCdDesc = ev.target.options[ev.target.selectedIndex].text;
		if(this.lineCd != '' && this.lineClassCd != '') {
			this.getMtnTreatyLimit();
		}

		setTimeout(() => {
			$('#lc-list').removeClass('ng-dirty');
		}, 0);
	}

	openTreatyLOV(ev) {
		this.hiddenTreaty = this.treatyLayerData.tableData.filter(a => a.treatyId !== undefined && !a.deleted && a.showMG != 1).map(a => Number(a.treatyId));
		this.treatyLOV.modal.openNoClose();
		this.treatyLOVRow = ev.index;
	}

	treatyLayerDataChange(data) {
		if(data.hasOwnProperty('lovInput')) {
	    	this.hiddenTreaty = this.treatyLayerData.tableData.filter(a => a.treatyId !== undefined && !a.deleted && a.showMG != 1).map(a => Number(a.treatyId));

	    	data.ev['index'] = data.index;
	    	this.treatyLOV.checkCode(data.ev.target.value, data.ev);
	    }
	}

	setSelectedTreaty(data) {
		if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
	    	this.treatyLOVRow = data.ev.index;
	    	this.ns.lovLoader(data.ev, 0);
	    }

	    $('#cust-table-container').addClass('ng-dirty');

	    if(data.treatyId != '' && data.treatyId != null && data.treatyId != undefined) {
    		this.treatyLayerData.tableData[this.treatyLOVRow].showMG = 0;
    		this.treatyLayerData.tableData[this.treatyLOVRow].treatyId = String(data.treatyId).padStart(2, '0');
    		this.treatyLayerData.tableData[this.treatyLOVRow].treatyName = data.treatyName;
    		this.treatyLayerData.tableData[this.treatyLOVRow].edited = true;
    	} else {
    		this.treatyLayerData.tableData[this.treatyLOVRow].treatyId = '';
    		this.treatyLayerData.tableData[this.treatyLOVRow].treatyName = '';
    		this.treatyLayerData.tableData[this.treatyLOVRow].edited = true;
    	}

    	this.treatyLayerTable.refreshTable();
	}
}
