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
  	@ViewChild(MtnLineComponent) lineLov : MtnLineComponent;

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
	  		createUser: this.ns.getCurrentUser(),
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
  	lineClassList: any[] = [];

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

	ngOnInit() {
		setTimeout(() => { this.table.refreshTable(); }, 0);
	}

	getMtnRetAmt() {
		this.table.overlayLoader = true;
		this.ms.getMtnRetAmt(this.lineCd, this.lineClassCd).subscribe(data => {
			this.retAmtData.tableData = data['retAmtList'].map(i => {
															  	i.effDateFrom = this.ns.toDateTimeString(i.effDateFrom).split('T')[0];
															  	i.effDateTo = this.ns.toDateTimeString(i.effDateTo).split('T')[0];
															  	i.createDate = this.ns.toDateTimeString(i.createDate);
															  	i.updateDate = this.ns.toDateTimeString(i.updateDate);
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
		this.retAmtData.disableGeneric = this.selected == null ? true : false;
	}

	checkCode(ev) {
	    this.ns.lovLoader(ev, 1);
	    this.lineLov.checkCode(this.lineCd, ev);
	}

  	setLine(data) {
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

	lineClassChanged() {
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
		}

		this.confirmSave.confirmModal();
	}
}
