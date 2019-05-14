import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-quote-wording',
  templateUrl: './quote-wording.component.html',
  styleUrls: ['./quote-wording.component.css']
})
export class QuoteWordingComponent implements OnInit {
  	@ViewChild(MtnLineComponent) lineLov : MtnLineComponent;
  	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  	quoteWordingData: any = {
	  	tableData: [],
	  	tHeader: ['Quote Word No', 'Wordings', 'Paragraph Type', 'Active', 'Default', 'Open Cover', 'Remarks'],
	  	dataTypes: ['sequence-3', 'text-editor', 'select', 'checkbox', 'checkbox','checkbox', 'text'],
	  	keys: ['wordingId', 'wording', 'wordType', 'activeTag', 'defaultTag', 'ocTag', 'remarks'],
	  	widths: [1,'auto',1,1,1,1,'275'],
	  	uneditable: [true,false,false,false,false,false,false],
	  	nData: {
	  		wordingId: '',
	      	addCounter: '1',
	  		wordType: '',
	  		activeTag: 'Y',
	  		defaultTag: 'N',
	  		ocTag: 'N',
	  		remarks: '',
	  		createUser: this.ns.getCurrentUser(),
	  		createDate: this.ns.toDateTimeString(0),
	  		updateUser: this.ns.getCurrentUser(),
	  		updateDate: this.ns.toDateTimeString(0)
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
  		// deleteFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: true
  	}

  	params: any = {
  		saveArr: [],
  		deleteArr: []
  	}

  	lineCd: string = "";
  	lineDesc: string = "";
  	selected: any = null;

  	constructor(private ns: NotesService, private ms: MaintenanceService) { }

  	ngOnInit() {
  		setTimeout(() => { this.table.refreshTable(); }, 0);
  	}

  	getMtnQuoteWordings() {
  		this.table.loadingFlag = true;
  		this.ms.getMtnQuotationWordings(this.lineCd, '').subscribe(data => {
  			this.quoteWordingData.tableData = data['quoteWordings'];
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

		// this.quoteWordingData.disableGeneric = true;		
	}
}