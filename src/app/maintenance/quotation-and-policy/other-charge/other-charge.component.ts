import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-other-charge',
  templateUrl: './other-charge.component.html',
  styleUrls: ['./other-charge.component.css']
})
export class OtherChargeComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;

  	otherChargeData: any = {
	  	tableData: [],
	  	tHeader: ['Charge Code', 'Charge Name', 'Charge Type', 'Rate (%)', 'Local Amount', 'Active', 'Remarks'],
	  	dataTypes: ['sequence-3', 'text', 'select', 'percent', 'currency', 'checkbox', 'text'],
	  	keys: ['chargeCd', 'chargeDesc', 'chargeType', 'premRt', 'defaultAmt', 'activeTag', 'remarks'],
	  	widths: [1,'120','75',1,1,1,'220'],
	  	// widths: ['auto','auto','auto','auto','auto',1,'auto'],
	  	uneditable: [true,false,false,false,false,false,false],
	  	nData: {
	  		chargeCd: '',
	  		chargeDesc: '',
	  		chargeType: '',
	  		premRt: '',
	  		defaultAmt: '',
	  		activeTag: 'Y',
	  		remarks: '',
	  		createUser: this.ns.getCurrentUser(),
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		opts: [{
        	selector: 'chargeType',
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

  	selected: any = null;
  	dialogIcon:string = '';
 	dialogMessage: string = '';
 	cancel: boolean = false;

  	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

  	ngOnInit() {
  		setTimeout(() => { this.table.refreshTable(); this.getMtnOtherCharges(); }, 0);
  	}

  	getMtnOtherCharges() {
  		this.table.overlayLoader = true;

  		var sub$ = forkJoin(this.ms.getMtnOtherCharges(),
  							this.ms.getRefCode('MTN_OTHER_CHARGES.CHARGE_TYPE')).pipe(map(([chrg, ref]) => { return { chrg, ref }; }));

  		sub$.subscribe(data => {
  			this.otherChargeData.opts[0].vals = [];
  			this.otherChargeData.opts[0].prev = [];

  			var td = data['chrg']['mtnChargesList'].map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
		  													   a.updateDate = this.ns.toDateTimeString(a.updateDate);
		  													   return a; });
  			this.otherChargeData.tableData = td;
  			this.otherChargeData.disableGeneric = false;

  			this.otherChargeData.opts[0].vals = data['ref']['refCodeList'].map(a => a.code);
		  	this.otherChargeData.opts[0].prev = data['ref']['refCodeList'].map(a => a.description);

		  	this.table.refreshTable();
  			this.table.onRowClick(null, this.otherChargeData.tableData[0]);
  			this.checkChargeType();
  		});
  	}

  	onRowClick(data) {
		this.selected = data;	
		this.otherChargeData.disableGeneric = this.selected == null ? true : false;
	}

	onClickDelete() {
		this.table.indvSelect.edited = true;
		this.table.indvSelect.deleted = true;		
		this.table.confirmDelete();
	}

	onClickSave() {
		var td = this.otherChargeData.tableData;
		var x = this.otherChargeData.opts[0].vals;

		for(let d of td) {
			if(d.edited && !d.deleted && (d.chargeDesc == '' || d.chargeType == '')) {
				this.dialogIcon = "error";
				this.successDialog.open();

				return;
			}

			if(d.edited && !d.deleted && d.chargeType == x[0] && (d.defaultAmt == null || d.defaultAmt == '' || isNaN(d.defaultAmt))) {
				this.dialogIcon = "error";
				this.successDialog.open();

				return;
			}

			if(d.edited && !d.deleted && d.chargeType == x[1] && (d.premRt == null || d.premRt == '' || isNaN(d.premRt))) {
				this.dialogIcon = "error";
				this.successDialog.open();

				return;
			}
		}

		this.confirmSave.confirmModal();
	}

	checkChargeType() {
		var tsThis = this;
		var x = this.otherChargeData.opts[0].vals;

		setTimeout(() => { 
			$('#other-charge-table').find('tbody').children().each(function(i) {
				var val = $(this).find('select').val();
				if(val && val == x[0]) { // F
					var rt = $(this).find('input.number')[0];
					var amt = $(this).find('input.number')[1];
					$(rt).prop('disabled', true);
					$(amt).prop('disabled', false);

					tsThis.otherChargeData.tableData[i].premRt = null;
				} else if(val && val == x[1]) { // P
					var rt = $(this).find('input.number')[0];
					var amt = $(this).find('input.number')[1];
					$(rt).prop('disabled', false);
					$(amt).prop('disabled', true);

					tsThis.otherChargeData.tableData[i].defaultAmt = null;
				}
			});
		}, 0);
	}
}
