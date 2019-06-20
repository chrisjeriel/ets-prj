import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { Title } from '@angular/platform-browser';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-section-ii-treaty-limit',
  templateUrl: './section-ii-treaty-limit.component.html',
  styleUrls: ['./section-ii-treaty-limit.component.css']
})
export class SectionIiTreatyLimitComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  	@ViewChild('lineLov') lineLov : MtnLineComponent;
  	@ViewChild('lineLovCopy') lineLovCopy : MtnLineComponent;

  	secIIData: any = {
	  	tableData: [],
	  	tHeader: ['Sec II Trty Limit ID', 'Treaty Limit Amt', 'Effective From', 'Active', 'Remarks'],
	  	dataTypes: ['sequence-6', 'currency', 'date', 'checkbox', 'text'],
	  	keys: ['seciiTrtyLimId', 'amount', 'effDateFrom', 'activeTag', 'remarks'],
	  	widths: ['1','200','140','1','auto'],
	  	uneditable: [true,false,false,false,false],
	  	uneditableKeys: ['amount','effDateFrom'],
	  	nData: {
	  		newRec: 1,
	  		seciiTrtyLimId: '',
	  		amount: '',
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
	  	disableAdd: true
  	}

  	params: any = {
  		saveSecIITrtyLimit: [],
  		deleteSecIITrtyLimit: []
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

	subscription: Subscription = new Subscription();

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Mtn | Section II Treaty Limit");
		setTimeout(() => { this.table.refreshTable(); }, 0);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getMtnSecIITrtyLimit() {
		this.table.overlayLoader = true;
		this.ms.getMtnSecIITrtyLimit(this.lineCd, this.lineClassCd, this.currencyCd, '').subscribe(data => {
			this.secIIData.tableData = data['secIITreatyLimList'].sort((a, b) => b.effDateFrom - a.effDateFrom)
																 .map(i => {
																  	i.effDateFrom = this.ns.toDateTimeString(i.effDateFrom).split('T')[0];
																  	i.createDate = this.ns.toDateTimeString(i.createDate);
																  	i.updateDate = this.ns.toDateTimeString(i.updateDate);
																  	i.seciiTrtyLimId = String(i.seciiTrtyLimId).padStart(6, '0');
																  	return i;
																  });
			this.secIIData.disableAdd = false;
			// this.secIIData.disableGeneric = false;
			this.table.refreshTable();
  			this.table.onRowClick(null, this.secIIData.tableData[0]);
		});
	}

	onRowClick(data) {
		this.selected = data;	
		this.secIIData.disableGeneric = this.selected == null || this.selected == '' || this.selected.seciiTrtyLimId != '';
		this.disableCopySetup = this.selected == null || this.selected == '' || this.selected.seciiTrtyLimId == '';
	}

	onClickDelete() {
		this.table.indvSelect.edited = true;
		this.table.indvSelect.deleted = true;
		this.table.confirmDelete();
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

		this.secIIData.tableData = [];
		this.secIIData.disableAdd = true;
  		this.secIIData.disableGeneric = true;
  		this.disableCopySetup = true;
		this.table.refreshTable();

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

		if(this.lineCd != '' && this.lineClassCd != '' && this.currencyCd != '') {
			this.getMtnSecIITrtyLimit();
		}

		setTimeout(() => {
			$('#lc-list').removeClass('ng-dirty');
			this.table.markAsPristine();
		}, 0);
	}

	currencyChanged(ev) {
		if(this.lineCd != '' && this.lineClassCd != '' && this.currencyCd != '') {
			this.getMtnSecIITrtyLimit();
		}

		setTimeout(() => {
			$('#c-list').removeClass('ng-dirty');
			this.table.markAsPristine();
		}, 0);
	}

	onClickSave() {
		var td = this.secIIData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted && (d.amount == null || isNaN(d.amount) || d.effDateFrom == '')) {
				this.dialogIcon = "error";
				this.successDialog.open();
				this.cancel = false;
				return;
			}

			if(d.edited && !d.deleted && d.activeTag == 'Y') {
				if(td.length > 1) {
					if(td.filter(c => c.activeTag == 'Y' && c.seciiTrtyLimId != '').length > 0) {
						var dEDF = new Date(d.effDateFrom);
						var lEDF = new Date(td.filter(c => c.activeTag == 'Y' && c.seciiTrtyLimId != '')
											  .sort((a, b) => Number(new Date(b.effDateFrom)) - Number(new Date(a.effDateFrom)))[0].effDateFrom);
						if(dEDF <= lEDF) {
							this.errorMsg = 1;
							$('#mtnSecIITrtyLimWarningModal > #modalBtn').trigger('click');
							this.cancel = false;
							return;
						}
					}	
				}

				if(td.filter(c => c.activeTag == 'Y' && c.seciiTrtyLimId == '').length > 1) {
					var newList = td.filter(c => c.activeTag == 'Y' && c.seciiTrtyLimId == '');

					for(var x = 1; x < newList.length; x++) {
						if(new Date(newList[x].effDateFrom) <= new Date(newList[x-1].effDateFrom)) {
							this.errorMsg = 1;
							$('#mtnSecIITrtyLimWarningModal > #modalBtn').trigger('click');
							this.cancel = false;
							return;
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

		this.params.saveSecIITrtyLimit = [];
		this.params.deleteSecIITrtyLimit = [];

		var td = this.secIIData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted) {
				d.lineCd = this.lineCd;
				d.lineClassCd = this.lineClassCd;
				d.currencyCd = this.currencyCd;
				d.createUser = this.ns.getCurrentUser();
				d.createDate = this.ns.toDateTimeString(d.createDate);
				d.updateUser = this.ns.getCurrentUser();
				d.updateDate = this.ns.toDateTimeString(0);

				this.params.saveSecIITrtyLimit.push(d);
			} else if(d.deleted) {
				this.params.deleteSecIITrtyLimit.push(d);
			}
		}

		this.ms.saveMtnSecIITrtyLimit(this.params).subscribe(data => {
			if(data['returnCode'] == -1) {
				this.dialogIcon = "success";
				this.successDialog.open();
				this.getMtnSecIITrtyLimit();
			} else {
				this.dialogIcon = "error";
				this.successDialog.open();
			}
		});
	}

	onCopySetupClick() {
		$('#mtnSecIITrtyLimCopyModal > #modalBtn').trigger('click');
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
			 copyFromSeciiTrtyLimId: this.selected.seciiTrtyLimId,
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

		this.ms.copySecIITrtyLimit(JSON.stringify(params)).subscribe(data => {
			$('.globalLoading').css('display','none');
			if(data['returnCode'] == -1) {
				$('#mtnSecIITrtyLimSuccessModal > #modalBtn').trigger('click');
				this.getMtnSecIITrtyLimit();
				this.onCopyCancel();
			} else if(data['returnCode'] == 2) {
				this.modalService.dismissAll();
				this.errorMsg = 2;
				this.onCopyCancel();
				$('#mtnSecIITrtyLimWarningModal > #modalBtn').trigger('click');
			}
		});
	}
}
