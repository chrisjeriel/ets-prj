import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnTreatyComponent } from '@app/maintenance/mtn-treaty/mtn-treaty.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';

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
  	@ViewChild(MtnTreatyComponent) treatyLOV: MtnTreatyComponent;
  	@ViewChild('treatyShare') cedingCoLOV: CedingCompanyComponent;
  	@ViewChild('cedingRetention') cedingCoRetentionLOV: CedingCompanyComponent;
  	@ViewChild('tabset') tabset: NgbTabset;

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
	  	pageID: 'treatyYearTab',
	  	mask: {
	  		treatyYear: '9999'
	  	}
  	}

  	treatyCommData: any = {
	  	tableData: [],
	  	tHeader: ['Treaty No', 'Treaty', 'Comm Rate (%)', 'Sort Seq'],
	  	dataTypes: ['lovInput-r', 'text', 'percent', 'number'],
	  	keys: ['treatyId','treatyName','commRate','sortSeq'],
	  	uneditable: [false,true,false,false],
	  	widths: ['1','auto','auto','1'],
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
	  	disableAdd: true,
	  	pageLength: 5,
	  	magnifyingGlass: ['treatyId'],
	  	pageID: 'treatyCommTab'
  	}

  	treatyShareData: any = {
	  	tableData: [],
	  	tHeader: ['Company No', 'Company Name', 'Abbreviation', 'Share (%)', 'Sort Sequence', 'Remarks'],
	  	dataTypes: ['lovInput-r', 'text', 'text', 'percent', 'number', 'text'],
	  	keys: ['trtyCedId','cedingName','cedingAbbr','pctShare','sortSeq','remarks'],
	  	uneditable: [false,true,true,false,false,false],
	  	widths: ['1','310','100','auto','1','auto'],
	  	nData: {
	  		showMG: 1,
	  		trtyCedId: '',
	  		cedingName: '',
	  		cedingAbbr: '',
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
	  	disableAdd: true,
	  	magnifyingGlass: ['trtyCedId'],
	  	pageID: 'treatyShareTab'
  	}

  	cedingRetentionData: any = {
	  	tableData: [],
	  	tHeader: ['Company No', 'Company Name', '1st Retention', '2nd Retention', 'Active', 'Inactive Date', 'Remarks'],
	  	dataTypes: ['lovInput-r', 'text', 'number', 'number', 'checkbox', 'date', 'text'],
	  	keys: ['cedingId','cedingName','retLine1','retLine2','membershipTag','inactiveDate','remarks'],
	  	uneditable: [false,true,false,false,true,true,false], //membership tag = y , multipleselect
	  	widths: ['1','auto','1','1','1','auto','auto'],
	  	nData: {
	  		showMG: 1,
	  		cedingId: '',
	  		cedingName: '',
	  		retLine1: '',
	  		retLine2: '',
	  		membershipTag: 'Y',
	  		inactiveDate: null,
	  		remarks: '',
	  		createUser: '',
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		total: [null,'Total Retention Line','retLine1','retLine2',null,null,null],
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: false,
	  	pageLength: 20,
	  	magnifyingGlass: ['cedingId'],
	  	pageID: 'cedingRetentionTab'
  	}

  	selected: any = null;
  	treatyCommLOVRow: number;
  	treatyShareLOVRow: number;
  	cedingRetentionLOVRow: number;
  	treatyYearSelected: any = null;
  	treatyCommSelected: any = null;
  	treatyShareSelected: any = null;
  	cedingRetentionSelected: any = null;
  	mtnTreatyComm: any[] = [];
  	hiddenTreaty: any[] = [];
  	hiddenCedingCo: any[] = [];
  	warningMsg: number = 0;
  	disableCopySetup = true;
  	copyToYear: any = '';

  	disableRetentionTab: boolean = true;

  	dialogIcon: string = '';
 	dialogMessage: string = '';
 	cancel: boolean = false;

 	params: any = {
 		saveTreatyComm: [],
 		deleteTreatyComm: [],
 		saveTreatyShare: [],
 		deleteTreatyShare: [],
 		saveCedRetention: [],
 		deleteCedRetention: []
 	}

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

	ngOnInit() {
		// this.alignTreatyYear();

		setTimeout(() => {
			this.treatyYearTable.refreshTable();
			this.treatyCommTable.refreshTable();
			this.treatyShareTable.refreshTable();
			
			this.getMtnTreatyComm();
		}, 0);
	}

	getMtnTreatyComm() {
		this.treatyYearTable.overlayLoader = true;
		this.ms.getMtnTreatyComm(null).subscribe(data => {
			this.mtnTreatyComm = data['treatyList'];
			var td = data['treatyList'].map(a => a.treatyYear);
			td = td.filter((a, i) => { return td.indexOf(a) == i })
				   .sort((a, b) => b - a)
				   .map(a => { return { treatyYear: a } });

			td.forEach(a => a['okDelete'] = this.mtnTreatyComm.find(b => b.treatyYear == a.treatyYear).okDelete );

			this.treatyYearData.tableData = td;
			this.treatyYearTable.refreshTable();
			this.alignTreatyYear();
			this.treatyYearTable.onRowClick(null, this.treatyYearData.tableData[0]);
			this.treatyYearData.disableGeneric = false;
		});
	}

	getMtnTreatyCommRate() {
		if(this.treatyYearSelected != null) {
			this.treatyCommData.tableData = this.mtnTreatyComm.sort((a, b) => a.treatyId - b.treatyId)
															  .filter(a => a.treatyYear == this.treatyYearSelected.treatyYear)
															  .map(a => { a.treatyId = String(a.treatyId).padStart(2, '0');
															  			  a.createDate = this.ns.toDateTimeString(a.createDate);
															  			  a.updateDate = this.ns.toDateTimeString(a.updateDate);
															  			  return a; });
			this.treatyCommTable.refreshTable();
			this.treatyCommTable.onRowClick(null, this.treatyCommData.tableData[0]);
			// this.treatyCommData.nData['treatyYear'] = $('#treaty-year-table').find('tbody').find('.selected').find('input').val();
			this.treatyCommData.disableAdd = false;
			this.treatyCommData.disableGeneric = false;
		} else {
			this.treatyCommData.tableData = [];
			this.treatyCommTable.refreshTable();
			this.treatyCommData.disableAdd = true;
			this.treatyCommData.disableGeneric = true;

			this.treatyShareData.tableData = [];
			this.treatyShareTable.refreshTable();
			this.treatyShareData.disableAdd = true;
			this.treatyShareData.disableGeneric = true;
		}
	}

	getMtnTreatyShare() {
		if(this.treatyYearSelected.treatyYear != '' && this.treatyCommSelected != null && this.treatyCommSelected.showMG != 1) {
			this.treatyShareTable.overlayLoader = true;
			this.ms.getMtnTreatyShare(this.treatyYearSelected.treatyYear, this.treatyCommSelected.treatyId).subscribe(data => {
				var td = data['treatyShareList'].map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
															a.updateDate = this.ns.toDateTimeString(a.updateDate);
															return a; });
				this.treatyShareData.tableData = td;
				this.treatyShareTable.refreshTable();
				this.treatyShareTable.onRowClick(null, this.treatyShareData.tableData[0]);
				this.treatyShareData.disableAdd = this.treatyCommSelected.treatyType == 'F';
			});
		} else {
			this.treatyShareData.tableData = [];
			this.treatyShareTable.refreshTable();
			this.treatyShareData.disableAdd = true;
			this.treatyShareData.disableGeneric = true;
		}
	}

	getMtnCedingRetention() {
		if(this.treatyShareSelected != null && this.treatyShareSelected.cedingName == 'Quota Share Pool') {
			this.disableRetentionTab = false;
			this.ms.getMtnCedingRetention(this.treatyYearSelected.treatyYear, this.treatyCommSelected.treatyId, this.treatyShareSelected.trtyCedId).subscribe(data => {
				var td = data['cedingRetentionList'].map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
																a.updateDate = this.ns.toDateTimeString(a.updateDate);
																return a; });
				this.cedingRetentionData.tableData = td;
				this.cedingRetentionData.disableAdd = false;
				this.cedingRetentionData.disableGeneric = false;
			});
		} else {
			this.disableRetentionTab = true;
			// this.cedingRetentionData.tableData = [];
			this.cedingRetentionData.disableAdd = true;
			this.cedingRetentionData.disableGeneric = true;
		}
	}

	onTreatyYearRowClick(ev) {
		this.treatyYearSelected = ev;
		this.treatyYearData.disableGeneric = this.treatyYearSelected == undefined || this.treatyYearSelected == '';
		this.disableCopySetup = this.treatyYearSelected == undefined || this.treatyYearSelected == '';
		this.getMtnTreatyCommRate();
	}

	onTreatyYearClickDelete(ev) {
		if(this.treatyYearTable.indvSelect.okDelete == 'N') {
			this.warningMsg = 1;
			$('#mtnTreatyShareWarningModal > #modalBtn').trigger('click');
		} else {
			this.treatyYearTable.indvSelect.edited = true;
			this.treatyYearTable.indvSelect.deleted = true;
			this.treatyYearTable.confirmDelete();
		}
	}

	onTreatyCommRowClick(ev) {
		this.selected = ev;
		this.treatyCommSelected = ev;
		this.treatyCommData.disableGeneric = this.treatyCommSelected == undefined || this.treatyCommSelected == '';
		this.tabset.select('treaty-share');
		this.getMtnTreatyShare();
	}

	onTreatyCommClickDelete(ev) {
		if(this.treatyCommTable.indvSelect.okDelete == 'N') {
			this.warningMsg = 2;
			$('#mtnTreatyShareWarningModal > #modalBtn').trigger('click');
		} else {
			this.treatyCommTable.indvSelect.edited = true;
			this.treatyCommTable.indvSelect.deleted = true;
			this.treatyCommTable.confirmDelete();
		}
	}

	onTreatyShareRowClick(ev) {
		this.selected = ev;
		this.treatyShareSelected = ev;
		this.treatyShareData.disableGeneric = this.treatyShareSelected == undefined || this.treatyShareSelected == '';
		this.getMtnCedingRetention();
	}

	onTreatyShareClickDelete(ev) {
		if(this.treatyShareTable.indvSelect.okDelete == 'N') {
			this.warningMsg = 3;
			$('#mtnTreatyShareWarningModal > #modalBtn').trigger('click');
		} else {
			this.treatyShareTable.indvSelect.edited = true;
			this.treatyShareTable.indvSelect.deleted = true;
			this.treatyShareTable.confirmDelete();
		}
	}

	onCedingRetentionRowClick(ev) {
		this.selected = ev;
		this.cedingRetentionSelected = ev;
		this.cedingRetentionData.disableGeneric = this.cedingRetentionSelected == undefined || this.cedingRetentionSelected == '';
	}

	onCedingRetentionClickDelete(ev) {
		if(this.cedingRetentionTable.indvSelect.okDelete == 'N') {
			this.warningMsg = 4;
			$('#mtnTreatyShareWarningModal > #modalBtn').trigger('click');
		} else {
			this.cedingRetentionTable.indvSelect.edited = true;
			this.cedingRetentionTable.indvSelect.deleted = true;
			this.cedingRetentionTable.confirmDelete();
		}
	}

	alignTreatyYear() {
		setTimeout(() => {
			$('#treaty-year-table').find('th').css('text-align', 'center');
			$('#treaty-year-table').find('td').css('text-align', 'center');
			$('#treaty-year-table').find('td').find('input').css('text-align', 'center').css('width', '20%');
		}, 0);
	}

	openTreatyCommLOV(ev) {
		this.hiddenTreaty = this.treatyCommData.tableData.filter(a => a.treatyId !== undefined && !a.deleted && a.showMG != 1).map(a => Number(a.treatyId));
		this.treatyLOV.modal.openNoClose();
		this.treatyCommLOVRow = ev.index;
	}

	setSelectedTreaty(data) {
		if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
	    	this.treatyCommLOVRow = data.ev.index;
	    	this.ns.lovLoader(data.ev, 0);
	    }

	    $('#cust-table-container').addClass('ng-dirty');

	    if(data.treatyId != '' && data.treatyId != null && data.treatyId != undefined) {
    		this.treatyCommData.tableData[this.treatyCommLOVRow].showMG = 0;
    		this.treatyCommData.tableData[this.treatyCommLOVRow].treatyId = String(data.treatyId).padStart(2, '0');
    		this.treatyCommData.tableData[this.treatyCommLOVRow].treatyName = data.treatyName;
    		this.treatyCommData.tableData[this.treatyCommLOVRow].edited = true;
    	} else {
    		this.treatyCommData.tableData[this.treatyCommLOVRow].treatyId = '';
    		this.treatyCommData.tableData[this.treatyCommLOVRow].treatyName = '';
    		this.treatyCommData.tableData[this.treatyCommLOVRow].edited = true;
    	}

    	this.treatyCommTable.refreshTable();
	}

	treatyCommTDataChange(data) {
		if(data.hasOwnProperty('lovInput')) {
	    	this.hiddenTreaty = this.treatyCommData.tableData.filter(a => a.treatyId !== undefined && !a.deleted && a.showMG != 1).map(a => Number(a.treatyId));

	    	data.ev['index'] = data.index;
	    	this.treatyLOV.checkCode(data.ev.target.value, data.ev);
	    }
	}

	openCedingCoLOV(ev) {
		this.hiddenCedingCo = this.treatyShareData.tableData.filter(a => a.trtyCedId !== undefined && !a.deleted && a.showMG != 1).map(a => a.trtyCedId);
		this.cedingCoLOV.modal.openNoClose();
		this.treatyShareLOVRow = ev.index;
	}

	setSelectedCedCoTreatyShare(data) {
		if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
	    	this.treatyShareLOVRow = data.ev.index;
	    	this.ns.lovLoader(data.ev, 0);

	    	if(data.cedingId != '' && data.cedingId != null && data.cedingId != undefined) {
	    		this.treatyShareData.tableData[this.treatyShareLOVRow].showMG = 0;
	    		this.treatyShareData.tableData[this.treatyShareLOVRow].trtyCedId = data.cedingId;
	    		this.treatyShareData.tableData[this.treatyShareLOVRow].cedingName = data.cedingName;
	    		this.treatyShareData.tableData[this.treatyShareLOVRow].cedingAbbr = data.cedingAbbr;
	    		this.treatyShareData.tableData[this.treatyShareLOVRow].edited = true;
	    	} else {
	    		this.treatyShareData.tableData[this.treatyShareLOVRow].trtyCedId = '';
	    		this.treatyShareData.tableData[this.treatyShareLOVRow].cedingName = '';
	    		this.treatyShareData.tableData[this.treatyShareLOVRow].cedingAbbr = '';
	    		this.treatyShareData.tableData[this.treatyShareLOVRow].edited = true;
	    	}
	    } else {
	    	this.treatyShareData.tableData = this.treatyShareData.tableData.filter(a => a.showMG != 1);
	    	for(let i of data) {
	    		this.treatyShareData.tableData.push(JSON.parse(JSON.stringify(this.treatyShareData.nData)));
	    		this.treatyShareData.tableData[this.treatyShareData.tableData.length - 1].showMG = 0;
	    		this.treatyShareData.tableData[this.treatyShareData.tableData.length - 1].trtyCedId = i.cedingId;
	    		this.treatyShareData.tableData[this.treatyShareData.tableData.length - 1].cedingName = i.cedingName;
	    		this.treatyShareData.tableData[this.treatyShareData.tableData.length - 1].cedingAbbr = i.cedingAbbr;
	    		this.treatyShareData.tableData[this.treatyShareData.tableData.length - 1].edited = true;
	    	}
	    }

    	$('#cust-table-container').addClass('ng-dirty');

    	this.treatyShareTable.refreshTable();
	}

	treatyShareTDataChange(data) {
		if(data.hasOwnProperty('lovInput')) {
	    	this.hiddenCedingCo = this.treatyShareData.tableData.filter(a => a.trtyCedId !== undefined && !a.deleted && a.showMG != 1).map(a => a.trtyCedId);

	    	data.ev['index'] = data.index;
	    	this.cedingCoLOV.checkCode(data.ev.target.value, data.ev);
	    }
	}

	openCedingCoRetentionLOV(ev) {
		this.hiddenCedingCo = this.cedingRetentionData.tableData.filter(a => a.cedingId !== undefined && !a.deleted && a.showMG != 1).map(a => a.cedingId);
		this.cedingCoRetentionLOV.modal.openNoClose();
		this.cedingRetentionLOVRow = ev.index;
	}

	setSelectedCedCoCedRet(data) {
		if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
	    	this.cedingRetentionLOVRow = data.ev.index;
	    	this.ns.lovLoader(data.ev, 0);

	    	if(data.cedingId != '' && data.cedingId != null && data.cedingId != undefined) {
	    		this.cedingRetentionData.tableData[this.cedingRetentionLOVRow].showMG = 0;
	    		this.cedingRetentionData.tableData[this.cedingRetentionLOVRow].cedingId = data.cedingId;
	    		this.cedingRetentionData.tableData[this.cedingRetentionLOVRow].cedingName = data.cedingName;
	    		this.cedingRetentionData.tableData[this.cedingRetentionLOVRow].edited = true;
	    	} else {
	    		this.cedingRetentionData.tableData[this.cedingRetentionLOVRow].cedingId = '';
	    		this.cedingRetentionData.tableData[this.cedingRetentionLOVRow].cedingName = '';
	    		this.cedingRetentionData.tableData[this.cedingRetentionLOVRow].edited = true;
	    	}
	    } else {
	    	this.cedingRetentionData.tableData = this.cedingRetentionData.tableData.filter(a => a.showMG != 1);
	    	for(let i of data) {
	    		this.cedingRetentionData.tableData.push(JSON.parse(JSON.stringify(this.cedingRetentionData.nData)));
	    		this.cedingRetentionData.tableData[this.cedingRetentionData.tableData.length - 1].showMG = 0;
	    		this.cedingRetentionData.tableData[this.cedingRetentionData.tableData.length - 1].cedingId = i.cedingId;
	    		this.cedingRetentionData.tableData[this.cedingRetentionData.tableData.length - 1].cedingName = i.cedingName;
	    		this.cedingRetentionData.tableData[this.cedingRetentionData.tableData.length - 1].edited = true;
	    	}
	    }

    	$('#cust-table-container').addClass('ng-dirty');

    	this.cedingRetentionTable.refreshTable();
	}

	cedingRetentionTDataChange(data) {
		if(data.hasOwnProperty('lovInput')) {
	    	this.hiddenCedingCo = this.cedingRetentionData.tableData.filter(a => a.cedingId !== undefined && !a.deleted && a.showMG != 1).map(a => a.cedingId);

	    	data.ev['index'] = data.index;
	    	this.cedingCoRetentionLOV.checkCode(data.ev.target.value, data.ev);
	    }
	}

	onTabChange(ev: NgbTabChangeEvent) {
		if(ev.nextId == 'treaty-share') {
			setTimeout(() => {
				this.treatyShareTable.refreshTable();
				this.treatyShareTable.onRowClick(null, this.treatyShareData.tableData[this.treatyShareData.tableData.indexOf(this.treatyShareSelected)]);
				console.log(this.cedingRetentionData);
			}, 0);
		} else if(ev.nextId == 'retention') {
			setTimeout(() => {
				this.cedingRetentionTable.refreshTable();
				this.cedingRetentionTable.onRowClick(null, this.cedingRetentionData.tableData[this.cedingRetentionData.tableData.indexOf(this.cedingRetentionSelected)]);
			}, 0);
		}
	}

	onClickSave() {
		var td1 = this.treatyYearData.tableData;
		var td2 = this.treatyCommData.tableData;
		var td3 = this.treatyShareData.tableData;
		var td4 = this.cedingRetentionData.tableData;
		var totalShare = 0;

		for(let d of td1) {
			if(d.edited && !d.deleted && (d.treatyYear == '' || d.treatyYear == null)) {
				this.dialogIcon = 'error';
				this.successDialog.open();

				this.cancel = false;
				return;
			} else if(d.edited && !d.deleted && (d.treatyYear != '' && d.treatyYear != null) && td2.filter(a => a.edited && !a.deleted).length == 0) {
				this.dialogIcon = 'error';
				this.successDialog.open();

				this.cancel = false;
				return;
			}
		}

		for(let d of td2) {
			if(d.edited && !d.deleted &&
				(d.treatyId == '' || d.commRate == '' || d.commRate == null || isNaN(d.commRate) || d.sortSeq == '' || d.sortSeq == null || isNaN(d.sortSeq))) {
				this.dialogIcon = 'error';
				this.successDialog.open();

				this.cancel = false;
				return;
			}
		}

		td3.forEach(a => totalShare += !a.deleted ? a.pctShare : 0);

		for(let d of td3) {
			if(d.edited && !d.deleted &&
				(d.trtyCedId == '' || d.pctShare == '' || d.pctShare == null || isNaN(d.pctShare) || d.sortSeq == '' || d.sortSeq == null || isNaN(d.sortSeq))) {
				this.dialogIcon = 'error';
				this.successDialog.open();

				this.cancel = false;
				return;
			} else if(totalShare != 100 && td3.filter(a => a.trtyCedId != undefined && !a.deleted).length > 0) {
				this.dialogIcon = 'error';
				this.successDialog.open();

				this.cancel = false;
				return;
			}
		}

		for(let d of td4) {
			if(d.edited && !d.deleted &&
				(d.cedingId == '' || d.retLine1 == '' || d.retLine1 == null || isNaN(d.retLine1) || d.retLine2 == '' || d.retLine2 == null || isNaN(d.retLine2))) {
				this.dialogIcon = 'error';
				this.successDialog.open();

				this.cancel = false;
				return;
			}
		}

		this.confirmSave.confirmModal();
	}

	save(cancel?) {
		this.cancel = cancel !== undefined;
		if(this.cancel) {
			this.onClickSave();
			return;
		}

		this.params.saveTreatyComm = [];
 		this.params.deleteTreatyComm = [];
 		this.params.saveTreatyShare = [];
 		this.params.deleteTreatyShare = [];
 		this.params.saveCedRetention = [];
 		this.params.deleteCedRetention = [];

 		var td1 = this.treatyYearData.tableData;
		var td2 = this.treatyCommData.tableData;
		var td3 = this.treatyShareData.tableData;
		var td4 = this.cedingRetentionData.tableData;

		for(let d of td1) {
			if(d.deleted) {
				td2.filter(a => a.treatyYear == d.treatyYear).forEach(b => {
					this.params.deleteTreatyComm.push(b);
				});
			}
		}

		for(let d of td2) {
			if(d.edited && !d.deleted) {
				d.treatyYear = this.treatyYearSelected.treatyYear;
				d.createUser = this.ns.getCurrentUser();
				d.createDate = this.ns.toDateTimeString(d.createDate);
				d.updateUser = this.ns.getCurrentUser();
				d.updateDate = this.ns.toDateTimeString(0);

				this.params.saveTreatyComm.push(d);
			} else if(d.deleted) {
				this.params.deleteTreatyComm.push(d);
			}
		}

		for(let d of td3) {
			if(d.edited && !d.deleted) {
				d.treatyYear = this.treatyYearSelected.treatyYear;
				d.treatyId = this.treatyCommSelected.treatyId;
				d.createUser = this.ns.getCurrentUser();
				d.createDate = this.ns.toDateTimeString(d.createDate);
				d.updateUser = this.ns.getCurrentUser();
				d.updateDate = this.ns.toDateTimeString(0);

				this.params.saveTreatyShare.push(d);
			} else if(d.deleted) {
				this.params.deleteTreatyShare.push(d);
			}
		}

		for(let d of td4) {
			if(d.edited && !d.deleted) {
				d.treatyYear = this.treatyYearSelected.treatyYear;
				d.treatyId = this.treatyCommSelected.treatyId;
				d.trtyCedId = this.treatyShareSelected.trtyCedId;
				d.createUser = this.ns.getCurrentUser();
				d.createDate = this.ns.toDateTimeString(d.createDate);
				d.updateUser = this.ns.getCurrentUser();
				d.updateDate = this.ns.toDateTimeString(0);

				this.params.saveCedRetention.push(d);
			} else if(d.deleted) {
				this.params.deleteCedRetention.push(d);
			}
		}

		this.ms.saveMtnTreatyShare(this.params).subscribe(data => {
			if(data['returnCode'] == -1) {
				this.dialogIcon = "success";
				this.successDialog.open();
				this.getMtnTreatyComm();
			} else {
				this.dialogIcon = "error";
				this.successDialog.open();
			}
		});
	}

	onCopySetupClick() {
		$('#mtnTreatyShareCopyModal > #modalBtn').trigger('click');
	}

	onClickModalCopy(force?) {
		if(this.treatyYearSelected.treatyYear == Number(this.copyToYear) || Number(this.copyToYear) == 0) {
			this.dialogIcon = 'error';
			this.dialogMessage = 'Invalid Year!'; // message not showing
			this.successDialog.open();
			return;
		}

		$('.globalLoading').css('display','block');
		var params = {
			checker: force == undefined ? 0 : 1,
		    copyFromYear: this.treatyYearSelected.treatyYear,
		  	copyToYear: Number(this.copyToYear),
		  	createDate: this.ns.toDateTimeString(0),
		  	createUser: this.ns.getCurrentUser(),
		  	updateDate: this.ns.toDateTimeString(0),
		  	updateUser: this.ns.getCurrentUser()
		}

		this.ms.copyTreatyShareSetup(JSON.stringify(params)).subscribe(data => {
			$('.globalLoading').css('display','none');
			if(data['returnCode'] == -1) {
				$('#mtnTreatyShareSuccessModal > #modalBtn').trigger('click');
				this.getMtnTreatyComm();
				this.copyToYear = '';
			} else if(data['returnCode'] == 2) {
				this.modalService.dismissAll();
				this.warningMsg = 5;
				$('#mtnTreatyShareWarningModal > #modalBtn').trigger('click');
				this.copyToYear = '';
			} else if(data['returnCode'] == 3) {
				$('#mtnTreatyShareConfirmationModal > #modalBtn').trigger('click');
			}
		});
	}
}
