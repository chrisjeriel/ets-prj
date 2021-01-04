import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTreatyComponent } from '@app/maintenance/mtn-treaty/mtn-treaty.component';
import { Title } from '@angular/platform-browser';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';




@Component({
  selector: 'app-treaty-limit',
  templateUrl: './treaty-limit.component.html',
  styleUrls: ['./treaty-limit.component.css']
})
export class TreatyLimitComponent implements OnInit, OnDestroy, AfterViewInit {
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
	  	tHeader: ['Treaty Limit ID', 'Treaty Limit Amt', 'Treaty Layer Description', 'Effective From','Active', 'Remarks'],
	  	dataTypes: ['sequence-6', 'currency', 'text', 'date', 'checkbox', 'text'],
	  	keys: ['treatyLimitId', 'amount', 'trtyLayerDesc', 'effDateFrom', 'activeTag', 'remarks'],
	  	widths: ['1','200','1','140','1','auto'],
	  	uneditable: [true,false,false,false,false, false],
	  	uneditableKeys: ['amount','effDateFrom'],
	  	nData: {
	  		newRec: 1,
	  		treatyLimitId: '',
	  		amount: '',
	  		trtyLayerDesc: '',
	  		effDateFrom: '',
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
  	currencyCd: any = '';
  	currencyList: any[] = [];
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

	subscription: Subscription = new Subscription();

	formGroup: FormGroup = new FormGroup({});

	ngAfterViewInit() {
	  this.treatyLayerTable.form.forEach((f,i)=>{
	    this.formGroup.addControl('treatyLayerTable'+i, f.control); 
	  })
	  this.treatyLimitTable.form.forEach((f,i)=>{
	    this.formGroup.addControl('treatyLimitTable'+i, f.control); 
	  }) 
	}

	constructor(private ns: NotesService, private ms: MaintenanceService, public modalService: NgbModal, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Mtn | Treaty Limit");
		setTimeout(() => { this.treatyLimitTable.refreshTable(); this.treatyLayerTable.refreshTable(); }, 0);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getMtnTreatyLimit() {
		this.treatyLimitTable.overlayLoader = true;
		this.ms.getMtnTreatyLimit(this.lineCd, this.lineClassCd, this.currencyCd, '').subscribe(data => {
			this.treatyLimitData.tableData = data['treatyLimitList'].sort((a, b) => b.createDate - a.createDate)
																	.map(i => {
																			i.effDateFrom = this.ns.toDateTimeString(i.effDateFrom).split('T')[0];
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
			// this.treatyLayerData.disableGeneric = false;
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

	onTreatyLimitClickDelete(ev) {
		if(ev != undefined) {
			this.treatyLimitTable.confirmDelete();
		} else {
			this.treatyLimitTable.indvSelect.edited = true;
			this.treatyLimitTable.indvSelect.deleted = true;
			this.treatyLimitData.disableGeneric = true;
			this.treatyLimitTable.refreshTable();
			this.treatyLimitTable.onRowClick(null, this.treatyLimitData.tableData[0]);

			this.treatyLayerData.tableData = [];
			this.treatyLayerTable.indvSelect.edited = true;
			this.treatyLayerTable.indvSelect.deleted = true;
			this.treatyLayerData.disableGeneric = true;
			this.treatyLayerTable.refreshTable();
		}
	}

	onTreatyLayerRowClick(data) {
		this.selected = data;
		this.treatyLayerSelected = data;
		this.treatyLayerData.disableGeneric = this.treatyLayerSelected == null || this.treatyLayerSelected == '' || this.treatyLayerSelected.showMG == undefined;
		//this.treatyLayerData.disableAdd = this.treatyLimitSelected == null || this.treatyLimitSelected == '' || this.treatyLimitSelected.treatyLimitId != '';
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
    	this.currencyCd = '';
    	this.currencyList = [];

    	if(this.lineDesc != '' && this.lineDesc != null) {
    		var sub$ = forkJoin(this.ms.getLineClassLOV(this.lineCd),
    							this.ms.getMtnCurrencyList('')).pipe(map(([lineClass, currency]) => { return { lineClass, currency }; }));

    		this.subscription = sub$.subscribe(data => {
    			this.lineClassList = data['lineClass']['lineClass'];
    			this.currencyList = data['currency']['currency'];
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
		this.lineClassCdDesc = ev=='DEF' ?'Default (Applicable to Line Class without setup)': this.lineClassList.filter(a=>a.lineClassCd == ev)[0].lineClassCdDesc;

		if(this.lineCd != '' && this.lineClassCd != '' && this.currencyCd != '') {
			this.getMtnTreatyLimit();
		}

		setTimeout(() => {
			$('#lc-list').removeClass('ng-dirty');
			this.treatyLimitTable.markAsPristine();
			this.treatyLayerTable.markAsPristine();
		}, 0);
	}

	currencyChanged(ev) {
		if(this.lineCd != '' && this.lineClassCd != '' && this.currencyCd != '') {
			this.getMtnTreatyLimit();
		}

		setTimeout(() => {
			$('#c-list').removeClass('ng-dirty');
			this.treatyLimitTable.markAsPristine();
			this.treatyLayerTable.markAsPristine();
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
			if(d.edited && !d.deleted && (d.amount == null || isNaN(d.amount) || d.effDateFrom == '' || d.trtyLayerDesc == ''
				|| d.treatyLayerList.filter(a => !a.deleted).length == 0)) {
				this.dialogIcon = "error";
				this.successDialog.open();
				this.cancel = false;
				return;
			}

			if(d.edited && !d.deleted || d.treatyLayerList.findIndex(b => b.edited) != -1) {
				if(d.treatyLayerList.findIndex(b => b.treatyId == '' && !b.deleted) != -1) {
					this.dialogIcon = "error";
					this.successDialog.open();
					this.cancel = false;
					return;
				}
			}

			if(d.edited && !d.deleted || (d.treatyLayerList.findIndex(b => b.edited) != -1) && d.treatyLayerList.length != 0) {
				for(let e of td) {
					var chck = 0;
					var dList = d.treatyLayerList.filter(a => a.treatyId != undefined && !a.deleted).map(a => Number(a.treatyId)).sort((a, b) => a - b);
					var max = td.filter(c => c.activeTag == 'Y' && c.treatyLimitId != '' && !c.deleted)
								.sort((a, b) => Number(new Date(b.effDateFrom)) - Number(new Date(a.effDateFrom)))[0];

					if(max != undefined && max != d && new Date(d.effDateFrom) < new Date(max.effDateFrom)) {
						chck = 1;
					}

					if(e != d && e.activeTag == 'Y' && d.activeTag == 'Y' && !e.deleted) {
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

							if(chck == 1 || (ctr == dList.length && d.effDateFrom == e.effDateFrom)) {
								this.errorMsg = 1;
								$('#mtnTreatyLimitWarningModal > #modalBtn').trigger('click');
								this.cancel = false;
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
											a.currencyCd = this.currencyCd;
											a.createUser = this.ns.getCurrentUser();
											a.createDate = this.ns.toDateTimeString(a.createDate);
											a.updateUser = this.ns.getCurrentUser();
											a.updateDate = this.ns.toDateTimeString(0);
											return a;
										});
		this.params.saveTreatyLimit.forEach(a => {
			a.treatyLayerList = a.treatyLayerList.filter(b => b.edited && !b.deleted)
												  .map(b => {
												  	b.lineCd = a.lineCd;
													b.lineClassCd = a.lineClassCd;
													b.currencyCd = a.currencyCd;
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
			 copyFromLineCd: this.lineCd,
			 copyFromLineClassCd: this.lineClassCd,
			 copyFromCurrencyCd: this.currencyCd,
			 copyToLineCd: this.copyLineCd,
			 copyToLineClassCd: this.copyLineClassCd,
			 copyToCurrencyCd: this.currencyCd,
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