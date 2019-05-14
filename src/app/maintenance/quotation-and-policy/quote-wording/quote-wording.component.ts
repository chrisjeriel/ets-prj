import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-quote-wording',
  templateUrl: './quote-wording.component.html',
  styleUrls: ['./quote-wording.component.css']
})
export class QuoteWordingComponent implements OnInit {
  	@ViewChild(MtnLineComponent) lineLov : MtnLineComponent;
  	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;

  	quoteWordingData: any = {
	  	tableData: [],
	  	tHeader: ['Quote Word No', 'Wordings', 'Paragraph Type', 'Active', 'Default', 'Open Cover', 'Remarks'],
	  	dataTypes: ['sequence-3', 'text-editor', 'select', 'checkbox', 'checkbox','checkbox', 'text'],
	  	keys: ['wordingId', 'wording', 'wordType', 'activeTag', 'defaultTag', 'ocTag', 'remarks'],
	  	widths: [1,'auto',1,1,1,1,'275'],
	  	uneditable: [true,false,false,false,false,false,false],
	  	nData: {
	  		wordingId: '',
	  		wording: '',
	  		wordType: '',
	  		activeTag: 'Y',
	  		defaultTag: 'N',
	  		ocTag: 'N',
	  		remarks: '',
	  		createUser: this.ns.getCurrentUser(),
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		opts: [{
        	selector: 'wordType',
        	prev: ['Opening', 'Closing'],
        	vals: ['O', 'C'],
    	}],
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: true
  	}

  	params: any = {
  		saveQW: [],
  		deleteQW: []
  	}

  	lineCd: string = ''
  	lineDesc: string = '';
  	selected: any = null;
  	dialogIcon:string = '';
 	dialogMessage: string = '';
 	cancel: boolean = false;

  	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

  	ngOnInit() {
  		setTimeout(() => { this.table.refreshTable(); }, 0);
  	}

  	getMtnQuoteWordings() {
  		this.table.loadingFlag = true;
  		this.ms.getMtnQuotationWordings(this.lineCd, '').subscribe(data => {
  			var td = data['quoteWordings'].sort((a, b) => b.createDate - a.createDate)
  										  .map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
  													  a.updateDate = this.ns.toDateTimeString(a.updateDate);
  													  return a; });
  										  
  			this.quoteWordingData.tableData = td;
  			this.quoteWordingData.disableAdd = false;
  			this.quoteWordingData.disableGeneric = false;

  			this.table.refreshTable();
  			this.table.onRowClick(null, this.quoteWordingData.tableData[0]);
  		});
  	}

  	checkCode(ev){
	    this.ns.lovLoader(ev, 1);
	    this.lineLov.checkCode(this.lineCd, ev);
	}

	setLine(data){
    	this.lineCd = data.lineCd;
    	this.lineDesc = data.description;
    	this.ns.lovLoader(data.ev, 0);

    	if(this.lineDesc != '' && this.lineDesc != null) {
    		this.getMtnQuoteWordings();	
    	} else {    		
			this.quoteWordingData.tableData = [];
			this.quoteWordingData.disableAdd = true;
  			this.quoteWordingData.disableGeneric = true;
			this.table.refreshTable();
    	}
	}

	showLineLOV(){		
	    $('#qwLineLOV #modalBtn').trigger('click');
	}

	onRowClick(data){
		this.selected = data;	
		this.quoteWordingData.disableGeneric = this.selected == null ? true : false;
	}

	onClickDelete() {
		this.table.indvSelect.edited = true;
		this.table.indvSelect.deleted = true;		
		this.table.confirmDelete();
	}

	onClickSave() {
		var td = this.quoteWordingData.tableData;
		var opTd = td.filter(a => a.activeTag == 'Y' && a.defaultTag == 'Y' && a.wordType == 'O' && a.ocTag == 'N').length;
		var clTd = td.filter(a => a.activeTag == 'Y' && a.defaultTag == 'Y' && a.wordType == 'C' && a.ocTag == 'N').length;
		var opTdOc = td.filter(a => a.activeTag == 'Y' && a.defaultTag == 'Y' && a.wordType == 'O' && a.ocTag == 'Y').length;
		var clTdOc = td.filter(a => a.activeTag == 'Y' && a.defaultTag == 'Y' && a.wordType == 'C' && a.ocTag == 'Y').length;

		for(let d of td) {
			if(d.edited && !d.deleted && (String(d.wording).trim() == '' || d.wordType == '')) {
				this.dialogIcon = "error";
				this.successDialog.open();

				return;
			}
		}
		
		if(opTd > 1 || clTd > 1 || opTdOc > 1 || clTdOc > 1) {
			$('#mtnQWWarningModal > #modalBtn').trigger('click');
			return;
		}

		this.confirmSave.confirmModal();
	}

	save(cancel?) {
		this.cancel = cancel !== undefined;
		this.params.saveQW = [];
		this.params.deleteQW = [];

		var td = this.quoteWordingData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted) {
				d.lineCd = this.lineCd;
				d.createDate = this.ns.toDateTimeString(d.createDate);
				d.updateUser = this.ns.getCurrentUser();
				d.updateDate = this.ns.toDateTimeString(0);

				this.params.saveQW.push(d);
			} else if(d.deleted) {
				this.params.deleteQW.push(d);
			}
		}

		this.ms.saveMtnQuoteWordings(this.params).subscribe(data => {
			if(data['returnCode'] == -1) {
				this.dialogIcon = "success";
				this.successDialog.open();
				this.getMtnQuoteWordings();
			} else {
				this.dialogIcon = "error";
				this.successDialog.open();
			}
		});
	}
}