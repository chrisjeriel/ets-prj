import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnTreatyComponent } from '@app/maintenance/mtn-treaty/mtn-treaty.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { Title } from '@angular/platform-browser';

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
	  		treatyCommList: [],
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
	  	},
	  	centered: true
  	}

  	treatyCommData: any = {
	  	tableData: [],
	  	tHeader: ['Treaty No', 'Treaty', 'Comm Rate (%)', 'Sort Seq'],
	  	dataTypes: ['lovInput-r', 'text', 'percent', 'number'],
	  	keys: ['treatyId','treatyName','commRate','sortSeq'],
	  	uneditable: [false,true,false,false],
	  	widths: ['64','auto','auto','1'],
	  	nData: {
	  		showMG: 1,
	  		treatyId: '',
	  		treatyName: '',
	  		commRate: '',
	  		sortSeq: '',
	  		treatyShareList: [],
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
	  		cedRetentionList: [],
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
 		deleteTreatyShare: [],
 		deleteCedRetention: []
 	}

 	first: boolean = true;

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Mtn | Treaty Share");
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
			td = td.sort((a, b) => b - a)
				   .filter((a, i) => { return td.indexOf(a) == i })
				   .map(a => { return { treatyYear: a } });

			td.forEach(a => {
				a['okDelete'] = this.mtnTreatyComm.find(b => b.treatyYear == a.treatyYear).okDelete;
				a['treatyCommList'] = this.mtnTreatyComm.sort((x, y) => y.createDate - x.createDate)
														.filter(b => b.treatyYear == a.treatyYear)
														.map(b => { b.treatyId = String(b.treatyId).padStart(2, '0');
															  		b.createDate = this.ns.toDateTimeString(b.createDate);
															  		b.updateDate = this.ns.toDateTimeString(b.updateDate);
															  		return b; });
				a.treatyCommList.forEach(b => {
					b.treatyShareList = b.treatyShareList.sort((x, y) => x.trtyCedId - y.trtyCedId)
														 .filter(b => b.treatyYear != null && b.treatyId != null && b.trtyCedId != null)
														 .map(b => { b.treatyId = String(b.treatyId).padStart(2, '0');
														 			 b.createDate = this.ns.toDateTimeString(b.createDate);
															  		 b.updateDate = this.ns.toDateTimeString(b.updateDate);
														 		     return b; });
					b.treatyShareList.forEach(c => {
						c.cedRetentionList = c.cedRetentionList.sort((x, y) => x.cedingId - y.cedingId)
															   .filter(b => b.treatyYear != null && b.treatyId != null && b.trtyCedId != null && b.cedingId != null)
															   .map(b => { b.treatyId = String(b.treatyId).padStart(2, '0');
																 		   b.createDate = this.ns.toDateTimeString(b.createDate);
																	  	   b.updateDate = this.ns.toDateTimeString(b.updateDate);
																 		   return b; });
					});
				});
			});

			this.treatyYearData.tableData = td;
			this.treatyYearTable.refreshTable();
			this.alignTreatyYear();
			this.treatyYearTable.onRowClick(null, this.treatyYearData.tableData[0]);
			this.treatyYearData.disableGeneric = false;
		});
	}

	getMtnTreatyCommRate() {
		if(this.treatyYearSelected != null) {
			this.treatyCommData.tableData = this.treatyYearSelected.treatyCommList;

			this.treatyCommTable.refreshTable();
			this.treatyCommTable.onRowClick(null, this.treatyCommData.tableData[0]);
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
			/*this.treatyShareTable.overlayLoader = true;
			this.ms.getMtnTreatyShare(this.treatyYearSelected.treatyYear, this.treatyCommSelected.treatyId).subscribe(data => {
				var td = data['treatyShareList'].map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
															a.updateDate = this.ns.toDateTimeString(a.updateDate);
															return a; });
				this.treatyShareData.tableData = td;
				this.treatyShareTable.refreshTable();
				this.treatyShareTable.onRowClick(null, this.treatyShareData.tableData[0]);
				this.treatyShareData.disableAdd = this.treatyCommSelected.treatyType == 'F';
			});*/

			this.treatyShareData.tableData = this.treatyCommSelected.treatyShareList;
			this.treatyShareTable.refreshTable();
			this.treatyShareTable.onRowClick(null, this.treatyShareData.tableData[0]);
			this.treatyShareData.disableAdd = this.treatyCommSelected.treatyType == 'F';
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
			/*this.ms.getMtnCedingRetention(this.treatyYearSelected.treatyYear, this.treatyCommSelected.treatyId, this.treatyShareSelected.trtyCedId).subscribe(data => {
				var td = data['cedingRetentionList'].map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
																a.updateDate = this.ns.toDateTimeString(a.updateDate);
																return a; });
				this.cedingRetentionData.tableData = td;
				this.cedingRetentionData.disableAdd = false;
				this.cedingRetentionData.disableGeneric = false;
			});*/

			this.cedingRetentionData.tableData = this.treatyShareSelected.cedRetentionList;
			this.cedingRetentionData.disableAdd = false;
			this.cedingRetentionData.disableGeneric = false;
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
		this.getMtnTreatyCommRate(); // ilagay sa bawat year ang mga treaty comm
	}

	onTreatyYearClickDelete(ev) {
		if(ev != undefined) {
			if(this.treatyYearTable.indvSelect.okDelete == 'N') {
				this.warningMsg = 1;
				$('#mtnTreatyShareWarningModal > #modalBtn').trigger('click');
			} else {
				this.treatyYearTable.confirmDelete();
			}
		} else {
			this.treatyYearTable.indvSelect.edited = true;
			this.treatyYearTable.indvSelect.deleted = true;
			this.treatyYearData.disableGeneric = true;
			this.treatyYearTable.refreshTable();
		}
	}

	onTreatyCommRowClick(ev) {
		this.selected = ev;
		this.treatyCommSelected = ev;
		this.treatyCommData.disableGeneric = this.treatyCommSelected == undefined || this.treatyCommSelected == '';
		this.tabset.select('treaty-share');

		setTimeout(() => { this.getMtnTreatyShare(); }, 0);
	}

	onTreatyCommClickDelete(ev?) {
		if(ev != undefined) {
			if(this.treatyCommTable.indvSelect.okDelete == 'N') {
				this.warningMsg = 2;
				$('#mtnTreatyShareWarningModal > #modalBtn').trigger('click');
			} else {
				this.treatyCommTable.confirmDelete();
			}
		} else {
			this.treatyCommTable.indvSelect.edited = true;
			this.treatyCommTable.indvSelect.deleted = true;
			this.treatyCommData.disableGeneric = true;
			this.treatyCommTable.refreshTable();
		}
	}

	onTreatyShareRowClick(ev) {
		this.selected = ev;
		this.treatyShareSelected = ev;
		this.treatyShareData.disableGeneric = this.treatyShareSelected == undefined || this.treatyShareSelected == '';
		this.getMtnCedingRetention();
	}

	onTreatyShareClickDelete(ev) {
		if(ev != undefined) {
			if(this.treatyShareTable.indvSelect.okDelete == 'N') {
				this.warningMsg = 3;
				$('#mtnTreatyShareWarningModal > #modalBtn').trigger('click');
			} else {
				this.treatyShareTable.confirmDelete();
			}
		} else {
			this.treatyShareTable.indvSelect.edited = true;
			this.treatyShareTable.indvSelect.deleted = true;
			this.treatyShareData.disableGeneric = true;
			this.treatyShareTable.refreshTable();
		}
	}

	onCedingRetentionRowClick(ev) {
		this.selected = ev;
		this.cedingRetentionSelected = ev;
		this.cedingRetentionData.disableGeneric = this.cedingRetentionSelected == undefined || this.cedingRetentionSelected == '';
	}

	onCedingRetentionClickDelete(ev) {
		if(ev != undefined) {
			if(this.cedingRetentionTable.indvSelect.okDelete == 'N') {
				this.warningMsg = 4;
				$('#mtnTreatyShareWarningModal > #modalBtn').trigger('click');
			} else {
				this.cedingRetentionTable.confirmDelete();
			}
		} else {
			this.cedingRetentionTable.indvSelect.edited = true;
			this.cedingRetentionTable.indvSelect.deleted = true;
			this.cedingRetentionData.disableGeneric = true;
			this.cedingRetentionTable.refreshTable();
		}
	}

	alignTreatyYear() {
		setTimeout(() => {
			$('#treaty-year-table').find('td').find('input').css('width', '20%');

			if(this.first) {
				$('.ng-dirty').removeClass('ng-dirty');
				this.first = false;
			}
		}, 10);
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
		this.treatyYearTable.indvSelect.edited = true;
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
		this.treatyYearTable.indvSelect.edited = true;
		this.treatyYearTable.markAsDirty();
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
		this.treatyYearTable.indvSelect.edited = true;
		this.treatyYearTable.markAsDirty();
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

		for(let d of td1) {
			if(d.edited && !d.deleted && (d.treatyYear == '' || d.treatyYear == null)) {
				this.dialogIcon = 'error';
				this.successDialog.open();

				this.cancel = false;
				return;
			} else if(d.edited && !d.deleted && (d.treatyYear != '' && d.treatyYear != null) && d.treatyCommList.length == 0) {
				this.dialogIcon = 'error';
				this.successDialog.open();

				this.cancel = false;
				return;
			}

			for(let e of d.treatyCommList) {
				if(e.edited && !e.deleted &&
					(e.treatyId == '' || e.commRate == '' || e.commRate == null || isNaN(e.commRate) || e.sortSeq == '' || e.sortSeq == null || isNaN(e.sortSeq))) {
					this.dialogIcon = 'error';
					this.successDialog.open();

					this.cancel = false;
					return;
				}

				if(e.treatyShareList.length > 0) {
					var totalShare = 0;
					e.treatyShareList.forEach(a => totalShare += !a.deleted ? a.pctShare : 0);

					for(let f of e.treatyShareList) {
						if(f.edited && !f.deleted &&
							(f.trtyCedId == '' || f.pctShare == '' || f.pctShare == null || isNaN(f.pctShare) || f.sortSeq == '' || f.sortSeq == null || isNaN(f.sortSeq))) {
							this.dialogIcon = 'error';
							this.successDialog.open();

							this.cancel = false;
							return;
						} else if(totalShare != 100 && e.treatyShareList.filter(a => a.trtyCedId != undefined && !a.deleted).length > 0) {
							this.dialogIcon = 'error';
							this.successDialog.open();

							this.cancel = false;
							return;
						}

						if(f.cedRetentionList.length > 0) {
							for(let g of f.cedRetentionList) {
								if(g.edited && !g.deleted &&
									(g.cedingId == '' || g.retLine1 == '' || g.retLine1 == null || isNaN(g.retLine1) || g.retLine2 == '' || g.retLine2 == null || isNaN(g.retLine2))) {
									this.dialogIcon = 'error';
									this.successDialog.open();

									this.cancel = false;
									return;
								}
							}
						}
					}
				}
			}
		}
		if(!this.cancel) {
			this.confirmSave.confirmModal();	
		} else {
			this.save(false);
		}
	}

	save(cancel?) {
		this.cancel = cancel !== undefined;

		if(this.cancel && cancel) {
			this.onClickSave();
			return;
		}

		this.params.saveTreatyComm = [];
 		this.params.deleteTreatyComm = [];
 		this.params.deleteTreatyShare = [];
 		this.params.deleteCedRetention = [];

 		var td = this.treatyYearData.tableData;
		var td2 = this.treatyCommData.tableData;
		var td3 = this.treatyShareData.tableData;
		var td4 = this.cedingRetentionData.tableData;

		td.forEach(a => {
			if(a.edited && !a.deleted) {
				a.treatyCommList.forEach(tc => {
					var tc1 = false;
					var tc2 = false;
					var tc3 = false;

					tc['treatyYear'] = a.treatyYear;
					tc['createUser'] = this.ns.getCurrentUser();
					tc['createDate'] = this.ns.toDateTimeString(0);
					tc['updateUser'] = this.ns.getCurrentUser();
					tc['updateDate'] = this.ns.toDateTimeString(0);

					if(tc.edited && !tc.deleted) {
						tc1 = true;
					} else if(tc.deleted) {
						this.params.deleteTreatyComm.push(tc);
					}

					tc.treatyShareList.forEach(ts => {
						ts['treatyYear'] = a.treatyYear;
						ts['treatyId'] = tc.treatyId;
						ts['createUser'] = this.ns.getCurrentUser();
						ts['createDate'] = this.ns.toDateTimeString(0);
						ts['updateUser'] = this.ns.getCurrentUser();
						ts['updateDate'] = this.ns.toDateTimeString(0);

						if(ts.edited && !ts.deleted) {
							tc.treatyShareList = tc.treatyShareList.filter(a => a.edited && !a.deleted);
							tc2 = true;
						} else if(ts.deleted) {
							this.params.deleteTreatyShare.push(ts);
						}

						ts.cedRetentionList.forEach(cr => {
							cr['treatyYear'] = a.treatyYear;
							cr['treatyId'] = tc.treatyId;
							cr['trtyCedId'] = ts.trtyCedId;
							cr['createUser'] = this.ns.getCurrentUser();
							cr['createDate'] = this.ns.toDateTimeString(0);
							cr['updateUser'] = this.ns.getCurrentUser();
							cr['updateDate'] = this.ns.toDateTimeString(0);

							if(cr.edited && !cr.deleted) {
								ts.cedRetentionList = ts.cedRetentionList.filter(a => a.edited && !a.deleted);
								tc3 = true;
							} else if(cr.deleted) {
								this.params.deleteCedRetention.push(cr);
							}
						});
					});


					if(tc1 || tc2 || tc3) {
						this.params.saveTreatyComm.push(tc);
					}
					
				});
			} else if(a.deleted) {
				a.treatyCommList.forEach(tc => {
					this.params.deleteTreatyComm.push(tc);
				});
			}
		});

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
			this.dialogMessage = 'Invalid Year!';
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

	add() {
		this.treatyYearTable.indvSelect.edited = true;
	}
}
