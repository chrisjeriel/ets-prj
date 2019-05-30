import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';

@Component({
  selector: 'app-retention-line',
  templateUrl: './retention-line.component.html',
  styleUrls: ['./retention-line.component.css']
})
export class RetentionLineComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  	@ViewChild('lineLov') lineLov : MtnLineComponent;
  	@ViewChild('lineLovCopy') lineLovCopy : MtnLineComponent;

  	retAmtData: any = {
	  	tableData: [],
	  	tHeader: ['Ret. Line Amt ID', 'Retention Line Amt', 'Eff. Date From', 'Eff. Date To', 'Active', 'Remarks'],
	  	dataTypes: ['sequence-3', 'currency', 'date', 'date', 'checkbox', 'text'],
	  	keys: ['retentionId', 'retLineAmt', 'effDateFrom', 'effDateTo', 'activeTag', 'remarks'],
	  	widths: ['1','200','140','140','1','auto'],
	  	uneditable: [true,false,false,false,false,false],
	  	nData: {
	  		retentionId: '',
	  		retLineAmt: '',
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

  	params: any = {
  		saveRetAmt: [],
  		deleteRetAmt: []
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

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

	ngOnInit() {
		setTimeout(() => { this.table.refreshTable(); }, 0);
	}

	getMtnRetAmt() {
		this.table.overlayLoader = true;
		this.ms.getMtnRetAmt(this.lineCd, this.lineClassCd).subscribe(data => {
			this.retAmtData.tableData = data['retAmtList'].sort((a, b) => b.createDate - a.createDate)
														  .map(i => {
															  	i.effDateFrom = this.ns.toDateTimeString(i.effDateFrom).split('T')[0];
															  	i.effDateTo = this.ns.toDateTimeString(i.effDateTo).split('T')[0];
															  	i.createDate = this.ns.toDateTimeString(i.createDate);
															  	i.updateDate = this.ns.toDateTimeString(i.updateDate);
															  	i.retentionId = String(i.retentionId).padStart(3, '0');
															  	return i;
															  });
			this.retAmtData.disableAdd = false;
			this.retAmtData.disableGeneric = false;
			this.table.refreshTable();
  			this.table.onRowClick(null, this.retAmtData.tableData[0]);
		});
	}

	onRowClick(data) {
		this.selected = data;	
		this.retAmtData.disableGeneric = this.selected == null || this.selected == '' || this.selected.retentionId != '';
		this.disableCopySetup = this.selected == null || this.selected == '' || this.selected.retentionId == '';
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

		this.retAmtData.tableData = [];
		this.retAmtData.disableAdd = true;
  		this.retAmtData.disableGeneric = true;
  		this.disableCopySetup = true;
		this.table.refreshTable();

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
			this.getMtnRetAmt();
		}

		setTimeout(() => {
			$('#lc-list').removeClass('ng-dirty');
		}, 0);
	}

	onClickSave() {
		var td = this.retAmtData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted && (d.retLineAmt == null || isNaN(d.retLineAmt) || d.effDateFrom == '' || d.effDateTo == '')) {
				this.dialogIcon = "error";
				this.successDialog.open();

				return;
			}

			if(d.edited && !d.deleted) {
				for(let e of td) {
					var dEDF = new Date(d.effDateFrom);
					var dEDT = new Date(d.effDateTo);

					if(e != d && e.activeTag == 'Y' && e.retentionId != '') { //mga bago lang nachecheck, pag inedit yung existing tapos may bago na natamaan, di gumagana (no retentionId)
						var eEDF = new Date(e.effDateFrom);
						var eEDT = new Date(e.effDateTo);

						if((dEDF >= eEDF && dEDF <= eEDT) || (dEDT >= eEDF && dEDT <= eEDT)) {
							this.errorMsg = 1;
							$('#mtnRetLineWarningModal > #modalBtn').trigger('click');

							return;
						}
					}
				}
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

		this.params.saveRetAmt = [];
		this.params.deleteRetAmt = [];

		var td = this.retAmtData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted) {
				d.lineCd = this.lineCd;
				d.lineClassCd = this.lineClassCd;
				d.createUser = this.ns.getCurrentUser();
				d.createDate = this.ns.toDateTimeString(d.createDate);
				d.updateUser = this.ns.getCurrentUser();
				d.updateDate = this.ns.toDateTimeString(0);

				this.params.saveRetAmt.push(d);
			} else if(d.deleted) {
				this.params.deleteRetAmt.push(d);
			}
		}

		this.ms.saveMtnRetAmt(this.params).subscribe(data => {
			if(data['returnCode'] == -1) {
				this.dialogIcon = "success";
				this.successDialog.open();
				this.getMtnRetAmt();
			} else {
				this.dialogIcon = "error";
				this.successDialog.open();
			}
		});
	}

	onCopySetupClick() {
		$('#mtnRetLineCopyModal > #modalBtn').trigger('click');
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
			 copyFromRetentionId: this.selected.retentionId,
			 copyToLineCd: this.copyLineCd,
			 copyToLineClassCd: this.copyLineClassCd,
			 createDate: this.ns.toDateTimeString(0),
			 createUser: this.ns.getCurrentUser(),
			 updateDate: this.ns.toDateTimeString(0),
			 updateUser: this.ns.getCurrentUser()
		}

		this.ms.copyRetAmtSetup(JSON.stringify(params)).subscribe(data => {
			$('.globalLoading').css('display','none');
			if(data['returnCode'] == -1) {
				$('#mtnRetLineSuccessModal > #modalBtn').trigger('click');
				this.getMtnRetAmt();
				this.onCopyCancel();
			} else if(data['returnCode'] == 2) {
				this.modalService.dismissAll();
				this.errorMsg = 2;
				this.onCopyCancel();
				$('#mtnRetLineWarningModal > #modalBtn').trigger('click');
			}
		});
	}
}
