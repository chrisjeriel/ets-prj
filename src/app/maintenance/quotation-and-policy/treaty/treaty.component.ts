import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-treaty',
  templateUrl: './treaty.component.html',
  styleUrls: ['./treaty.component.css']
})
export class TreatyComponent implements OnInit, OnDestroy {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;

  	treatyData: any = {
	  	tableData: [],
	  	tHeader: ['Treaty No', 'Treaty Name', 'Abbreviation', 'Treaty Type', 'Active', 'Remarks'],
	  	dataTypes: ['sequence-2', 'text', 'text', 'select', 'checkbox', 'text'],
	  	keys: ['treatyId', 'treatyName', 'treatyAbbr', 'treatyType', 'activeTag', 'remarks'],
	  	widths: ['1','150','1','120','1','auto'],
	  	uneditable: [true,false,false,false,false,false],
	  	nData: {
	  		treatyId: '',
	  		treatyName: '',
	  		treatyAbbr: '',
	  		treatyType: '',
	  		activeTag: 'Y',
	  		remarks: '',
	  		createUser: this.ns.getCurrentUser(),
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		opts: [{
        	selector: 'treatyType',
        	prev: [],
        	vals: [],
    	}],
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: false
  	}

  	params: any = {
  		saveTreaty: [],
  		deleteTreaty: []
  	}

  	selected: any = null;
  	dialogIcon:string = '';
 	dialogMessage: string = '';
 	cancel: boolean = false;
 	subscription: Subscription = new Subscription();

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

	ngOnInit() {
		setTimeout(() => { this.table.refreshTable(); this.getMtnTreaty(); }, 0);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getMtnTreaty() {
		this.table.overlayLoader = true;

		var sub$ = forkJoin(this.ms.getMtnTreaty(),
							this.ms.getRefCode('MTN_TREATY.TREATY_TYPE')).pipe(map(([trty, ref]) => { return { trty, ref }; }));

		this.subscription = sub$.subscribe(data => {
			this.treatyData.opts[0].vals = [];
  			this.treatyData.opts[0].prev = [];

  			var td = data['trty']['treatyList'].map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
		  												   a.updateDate = this.ns.toDateTimeString(a.updateDate);
		  												   return a; });
  			this.treatyData.tableData = td;
  			this.treatyData.disableGeneric = false;

  			this.treatyData.opts[0].vals = data['ref']['refCodeList'].map(a => a.code);
		  	this.treatyData.opts[0].prev = data['ref']['refCodeList'].map(a => a.description);

		  	this.table.refreshTable();
  			this.table.onRowClick(null, this.treatyData.tableData[0]);
		});


		/*this.ms.getMtnTreaty().subscribe(data => {
			this.treatyData.tableData = data['treatyList'].map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
		  													a.updateDate = this.ns.toDateTimeString(a.updateDate);
		  													return a; });
			this.treatyData.disableGeneric = false;
			this.table.refreshTable();
  			this.table.onRowClick(null, this.treatyData.tableData[0]);
  		});*/
	}

	onRowClick(data) {
		this.selected = data;	
		this.treatyData.disableGeneric = this.selected == null ? true : false;
	}

	onClickDelete() {
		if(this.table.indvSelect.okDelete == 'N') {
			$('#mtnTreatyWarningModal > #modalBtn').trigger('click');
		} else {
			this.table.indvSelect.edited = true;
			this.table.indvSelect.deleted = true;
			this.table.confirmDelete();
		}
	}

	onClickSave() {
		var td = this.treatyData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted && (d.treatyName == '' || d.treatyAbbr == '' || d.treatyType == '')) {
				this.dialogIcon = "error";
				this.successDialog.open();

				return;
			}
		}

		this.confirmSave.confirmModal();
	}

	save(cancel?) {
		this.cancel = cancel !== undefined;
		this.params.saveTreaty = [];
		this.params.deleteTreaty = [];

		var td = this.treatyData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted) {
				d.createDate = this.ns.toDateTimeString(d.createDate);
				d.updateUser = this.ns.getCurrentUser();
				d.updateDate = this.ns.toDateTimeString(0);

				this.params.saveTreaty.push(d);
			} else if(d.deleted) {
				this.params.deleteTreaty.push(d);
			}
		}

		this.ms.saveMtnTreaty(this.params).subscribe(data => {
			if(data['returnCode'] == -1) {
				this.dialogIcon = "success";
				this.successDialog.open();
				this.getMtnTreaty();
			} else {
				this.dialogIcon = "error";
				this.successDialog.open();
			}
		});
	}
}
