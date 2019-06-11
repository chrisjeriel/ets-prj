import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTreatyComponent } from '@app/maintenance/mtn-treaty/mtn-treaty.component';
import { Title } from '@angular/platform-browser';

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
	  	disableAdd: true,
	  	pageID: 'treatyLimitTab'
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
	  	pageID: 'treatyLayerTab'
  	}

  	params: any = {
  		saveTreatyLimit: [],
  		deleteTreatyLimit: []
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

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Mtn | Treaty Limit");
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

	onTreatyLimitRowClick(data) {
		this.selected = data;
		this.treatyLimitSelected = data;
		this.treatyLimitData.disableGeneric = this.treatyLimitSelected == null || this.treatyLimitSelected == '' || this.treatyLimitSelected.treatyLimitId != '';
		this.disableCopySetup = this.treatyLimitSelected == null || this.treatyLimitSelected == '' || this.treatyLimitSelected.treatyLimitId == '';

		if(data != '' && data != null && data.treatyLimitId != '') {
			this.treatyLayerData.tableData = data.treatyLayerList.sort((a, b) => b.createDate - a.createDate)
																 .map(i => {
																		i.createDate = this.ns.toDateTimeString(i.createDate);
																		i.updateDate = this.ns.toDateTimeString(i.updateDate);
																		i.treatyId = i.treatyId == '' ? '' : String(i.treatyId).padStart(2, '0');
																		return i;
																	});
			this.treatyLayerData.disableAdd = false;
			this.treatyLayerData.disableGeneric = false;
			this.treatyLayerTable.refreshTable();
	  		this.treatyLayerTable.onRowClick(null, this.treatyLayerData.tableData[0]);
		} else if(data != '' && data != null && data.treatyLimitId == '') {
			this.treatyLimitSelected['treatyLayerList'] = this.treatyLimitSelected['treatyLayerList'] == undefined ? [] : this.treatyLimitSelected['treatyLayerList'];
			this.treatyLayerData.tableData = this.treatyLimitSelected.treatyLayerList;
			this.treatyLayerData.disableAdd = false;
			this.treatyLayerData.disableGeneric = true;
			this.treatyLayerTable.refreshTable();
		} else {
			this.treatyLayerData.tableData = [];
			this.treatyLayerTable.refreshTable();
			this.treatyLayerData.disableAdd = true;
			this.treatyLayerData.disableGeneric = true;
		}
	}

	onTreatyLimitClickDelete() {
		this.treatyLimitTable.indvSelect.edited = true;
		this.treatyLimitTable.indvSelect.deleted = true;
		this.treatyLimitTable.confirmDelete();
	}

	onTreatyLayerRowClick(data) {
		this.selected = data;
		this.treatyLayerSelected = data;
		this.treatyLayerData.disableGeneric = this.treatyLayerSelected == null || this.treatyLayerSelected == '' || this.treatyLayerSelected.showMG == undefined;
	}

	onTreatyLayerClickDelete(ev) {
		if(ev != undefined) {
			this.treatyLayerTable.confirmDelete();
		} else {
			this.treatyLayerTable.indvSelect.edited = true;
			this.treatyLayerTable.indvSelect.deleted = true;
			this.treatyLayerData.disableGeneric = true;
			this.treatyLayerTable.refreshTable();
		}
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

	onClickSave() {
		var td = this.treatyLimitData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted && (d.amount == null || isNaN(d.amount) || d.effDateFrom == '' || d.effDateTo == ''
				|| d.treatyLayerList.filter(a => !a.deleted).length == 0)) {
				this.dialogIcon = "error";
				this.successDialog.open();
				this.cancel = false;
				console.log('here 1');
				return;
			}

			if(d.edited && !d.deleted || d.treatyLayerList.findIndex(b => b.edited) != -1) {
				if(d.treatyLayerList.findIndex(b => b.treatyId == '' && !b.deleted) != -1) {
					this.dialogIcon = "error";
					this.successDialog.open();
					this.cancel = false;
					console.log('here 2');
					return;
				}
			}

			if(d.edited && !d.deleted || (d.treatyLayerList.findIndex(b => b.edited) != -1) && d.treatyLayerList.length != 0) {
				for(let e of td) {
					var dList = d.treatyLayerList.filter(a => a.treatyId != undefined && !a.deleted).map(a => Number(a.treatyId)).sort((a, b) => a - b);

					if(e != d && e.activeTag == 'Y' && e.treatyLimitId != '') {
						var eList = e.treatyLayerList.filter(a => a.treatyId != undefined && !a.deleted).map(a => Number(a.treatyId)).sort((a, b) => a - b);
						
						if(dList.length == eList.length) {
							var ctr = 0;
							for(let v of dList) {
								if(eList.indexOf(v) == -1) {
									break;
								} else {
									ctr++;
								}
							}

							if(ctr == dList.length) {
								this.errorMsg = 1;
								$('#mtnTreatyLimitWarningModal > #modalBtn').trigger('click');
								this.cancel = false;
								console.log('here 3');
								return;
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

		this.params.saveTreatyLimit = [];
		this.params.deleteTreatyLimit = [];

		var td = this.treatyLimitData.tableData;
		this.params.saveTreatyLimit = td.filter(a => a.edited && !a.deleted || a.treatyLayerList.findIndex(b => b.edited) != -1)
										.map(a => {
											a.lineCd = this.lineCd;
											a.lineClassCd = this.lineClassCd;
											a.createUser = this.ns.getCurrentUser();
											a.createDate = this.ns.toDateTimeString(a.createDate);
											a.updateUser = this.ns.getCurrentUser();
											a.updateDate = this.ns.toDateTimeString(0);
											return a;
										});
		this.params.saveTreatyLimit.forEach(a => {
			a.treatyLayerList = a.treatyLayerList.filter(b => b.edited && !b.deleted)
												  .map(b => {
												  	b.treatyLimitId = a.treatyLimitId;
												  	b.createUser = this.ns.getCurrentUser();
												  	b.createDate = this.ns.toDateTimeString(b.createDate);
												  	b.updateUser = this.ns.getCurrentUser();
												  	b.updateDate = this.ns.toDateTimeString(0);
												  	return b;
												  })
		});

		this.params.deleteTreatyLimit = td.filter(a => a.deleted); // no delete for records in db

		this.ms.saveMtnTreatyLimit(this.params).subscribe(data => {
			if(data['returnCode'] == -1) {
				this.dialogIcon = "success";
				this.successDialog.open();
				this.getMtnTreatyLimit();
			} else {
				this.dialogIcon = "error";
				this.successDialog.open();
			}
		});
	}

	onCopySetupClick() {
		$('#mtnTreatyLimitCopyModal > #modalBtn').trigger('click');
	}

	onCopyCancel() {
		this.copyLineCd = '';
		this.copyLineDesc = '';
		this.copyLineClassCd = '';
		this.copyLineClassList = [];
		this.disableCopyLCList = true;
	}

	onClickModalCopy() {
		if(this.copyLineDesc == '' || this.copyLineClassCd == '') {
			this.dialogIcon = "error";
			this.successDialog.open();
			return;
		}

		$('.globalLoading').css('display','block');
		var params = {
			 copyFromTreatyLimitId: this.treatyLimitSelected.treatyLimitId,
			 copyToLineCd: this.copyLineCd,
			 copyToLineClassCd: this.copyLineClassCd,
			 createDate: this.ns.toDateTimeString(0),
			 createUser: this.ns.getCurrentUser(),
			 updateDate: this.ns.toDateTimeString(0),
			 updateUser: this.ns.getCurrentUser()
		}

		this.ms.copyTreatyLimit(JSON.stringify(params)).subscribe(data => {
			$('.globalLoading').css('display','none');
			if(data['returnCode'] == -1) {
				$('#mtnTreatyLimitSuccessModal > #modalBtn').trigger('click');
				this.getMtnTreatyLimit();
				this.onCopyCancel();
			} else if(data['returnCode'] == 2) {
				this.modalService.dismissAll();
				this.errorMsg = 2;
				this.onCopyCancel();
				$('#mtnTreatyLimitWarningModal > #modalBtn').trigger('click');
			}
		});
	}
}
