import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-policy-wording',
  templateUrl: './policy-wording.component.html',
  styleUrls: ['./policy-wording.component.css']
})
export class PolicyWordingComponent implements OnInit {
	@ViewChild(MtnLineComponent) lineLov : MtnLineComponent;
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;

	policyWordingData: any = {
	  	tableData: [],
	  	tHeader: ['Policy Word Code', 'Wording Title', 'Wordings', 'Paragraph Type', 'Active', 'Default', 'Open Cover', 'Remarks'],
	  	dataTypes: ['text', 'text', 'text-editor', 'select', 'checkbox', 'checkbox','checkbox', 'text'],
	  	keys: ['wordingCd', 'wordingTitle', 'wordings', 'wordType', 'activeTag', 'defaultTag', 'ocTag', 'remarks'],
	  	widths: [1,'180','auto','100',1,1,1,'200'],
	  	uneditable: [false,false,false,false,false,false,false,false],
	  	nData: {
	  		wordingCd: '',
	      	wordingTitle: '',
	      	wordings: '',
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
        	prev: ['Policy', 'Alteration'],
        	vals: ['P', 'A'],
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
  		savePW: [],
  		deletePW: []
  	}

  	wordTextKeys: any = [
  		'wordText01',
  		'wordText02',
  		'wordText03',
  		'wordText04',
  		'wordText05',
  		'wordText06',
  		'wordText07',
  		'wordText08',
  		'wordText09',
  		'wordText10',
  		'wordText11',
  		'wordText12',
  		'wordText13',
  		'wordText14',
  		'wordText15',
  		'wordText16',
  		'wordText17'
  	];

	selected: any = null;
	lineCd: string = ''
	lineDesc: string = '';
	dialogIcon: string = '';
	dialogMessage: string = '';
	cancel: boolean = false;
	msgNo: number = 1;

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

  	ngOnInit() {
  		setTimeout(() => { this.table.refreshTable(); }, 0);
  	}

  	getMtnPolicyWordings() {
  		this.table.loadingFlag = true;
  		this.ms.getMtnPolWordings({ lineCd: this.lineCd }).subscribe(data => {
  			var td = data['mtnPolWordings'].sort((a, b) => b.createDate - a.createDate)
  										   .map(a => { a.createDate = this.ns.toDateTimeString(a.createDate);
  													   a.updateDate = this.ns.toDateTimeString(a.updateDate);
  													   return a; });

  			for(let i of td) {
  				i.wordings = '';

  				Object.keys(i).forEach(function(key) {
	            	if(/wordText/.test(key)) {
	                    i.wordings += i[key] === null ? '' : i[key];
	                }
	            });
  			}

	  		this.policyWordingData.tableData = td;
	  		this.policyWordingData.disableAdd = false;
	  		this.policyWordingData.disableGeneric = false;

	  		this.table.refreshTable();
	  		this.table.onRowClick(null, this.policyWordingData.tableData[0]);
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
    		this.getMtnPolicyWordings();	
    	} else {    		
			this.policyWordingData.tableData = [];
			this.policyWordingData.disableAdd = true;
  			this.policyWordingData.disableGeneric = true;
			this.table.refreshTable();
    	}
	}

	showLineLOV(){		
	    $('#pwLineLOV #modalBtn').trigger('click');
	}

	onRowClick(data){
		this.selected = data;	
		this.policyWordingData.disableGeneric = this.selected == null ? true : false;
	}

	onClickDelete() {
		this.table.indvSelect.edited = true;
		this.table.indvSelect.deleted = true;		
		this.table.confirmDelete();
	}

	onClickSave() {
		var td = this.policyWordingData.tableData;
		var pTd = td.filter(a => a.activeTag == 'Y' && a.defaultTag == 'Y' && a.wordType == 'P' && a.ocTag == 'N').length;
		var aTd = td.filter(a => a.activeTag == 'Y' && a.defaultTag == 'Y' && a.wordType == 'A' && a.ocTag == 'N').length;
		var pTdOc = td.filter(a => a.activeTag == 'Y' && a.defaultTag == 'Y' && a.wordType == 'P' && a.ocTag == 'Y').length;
		var aTdOc = td.filter(a => a.activeTag == 'Y' && a.defaultTag == 'Y' && a.wordType == 'A' && a.ocTag == 'Y').length;
		var wordingCds = td.filter(a => !a.deleted).map(a => a.wordingCd);

		for(let d of td) {
			if(d.edited && !d.deleted && (d.wordingCd == '' || d.wordingTitle == '' || String(d.wordings).trim() == '' || d.wordType == '')) {
				this.dialogIcon = "error";
				this.successDialog.open();

				return;
			}
		}

		if(wordingCds.some((a, i) => {
			if(wordingCds.indexOf(a) != i) {
				return wordingCds.indexOf(a) != i;
			}
		})) {
			this.msgNo = 1;
			$('#mtnPWWarningModal > #modalBtn').trigger('click');
			return;
		}

		if(pTd > 1 || aTd > 1 || pTdOc > 1 || aTdOc > 1) {
			this.msgNo = 2;
			$('#mtnQWWarningModal > #modalBtn').trigger('click');
			return;
		}

		this.confirmSave.confirmModal();
	}

	save(cancel?) {
		this.cancel = cancel !== undefined;
		this.params.savePW = [];
		this.params.deletePW = [];

		var td = this.policyWordingData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted) {
				var wordTextSplit = d.wordings.match(/(.|[\r\n]){1,2000}/g);
				if(wordTextSplit !== null) {
					for(var i = 0; i < wordTextSplit.length; i++) {
						d[this.wordTextKeys[i]] = wordTextSplit[i];
					}
				}

				d.lineCd = this.lineCd;
				d.createDate = this.ns.toDateTimeString(d.createDate);
				d.updateUser = this.ns.getCurrentUser();
				d.updateDate = this.ns.toDateTimeString(0);

				this.params.savePW.push(d);
			} else if(d.deleted) {
				this.params.deletePW.push(d);
			}
		}

		this.ms.saveMtnPolicyWordings(this.params).subscribe(data => {			
			if(data['returnCode'] == -1) {
				this.dialogIcon = "success";
				this.successDialog.open();
				this.getMtnPolicyWordings();
			} else {
				this.dialogIcon = "error";
				this.successDialog.open();
			}
		});
	}
}
