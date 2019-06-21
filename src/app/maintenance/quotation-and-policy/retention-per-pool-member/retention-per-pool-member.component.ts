import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-retention-per-pool-member',
  templateUrl: './retention-per-pool-member.component.html',
  styleUrls: ['./retention-per-pool-member.component.css']
})
export class RetentionPerPoolMemberComponent implements OnInit {
	@ViewChild('historyTable') historyTable: CustEditableNonDatatableComponent;
	@ViewChild('poolMemberTable') poolMemberTable: CustEditableNonDatatableComponent;
	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  	@ViewChild('cedingCoLOV') cedingCoLOV: CedingCompanyComponent;

  	historyData: any = {
	  	tableData: [],
	  	tHeader: ['History No', '1st Ret Line', '2nd Ret Line', 'Total Ret Line', 'Effective From', 'Active', 'Remarks'],
	  	dataTypes: ['sequence-3', 'number', 'number', 'number', 'date', 'checkbox', 'text'],
	  	keys: ['retHistId', 'retLine1', 'retLine2', 'totalRetLine', 'effDateFrom', 'activeTag', 'remarks'],
	  	uneditable: [true,true,true,true,false,false,false],
	  	uneditableKeys: ['effDateFrom'],
	  	widths: ['1','1','1','1','140','1','auto'],
	  	nData: {
	  		newRec: 1,
	  		retHistId: '',
	  		retLine1: '',
	  		retLine2: '',
	  		totalRetLine: '',
	  		effDateFrom: '',
	  		activeTag: 'Y',
	  		remarks: '',
	  		poolMemberList: [],
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
	  	disableAdd: false,
	  	pageLength: 5,
	  	pageID: 'historyTab'
  	}

  	poolMemberData: any = {
	  	tableData: [],
	  	tHeader: ['Company No', 'Company Name', '1st Ret Line', '2nd Ret Line'],
	  	dataTypes: ['lovInput-r', 'text', 'number', 'number'],
	  	keys: ['cedingId','cedingName','retLine1','retLine2'],
	  	uneditable: [false,true,false,false],
	  	widths: ['1','auto','1','1'],
	  	nData: {
	  		showMG: 1,
	  		cedingId: '',
	  		cedingName: '',
	  		retLine1: '',
	  		retLine2: '',
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
	  	disableAdd: false,
	  	pageLength: 20,
	  	magnifyingGlass: ['cedingId'],
	  	pageID: 'poolMemberTab'
  	}

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Mtn | Retention per Pool Member");
		setTimeout(() => {
			this.historyTable.refreshTable();
			this.poolMemberTable.refreshTable();
			
			// this.getMtnTreatyComm();
		}, 0);
	}

}
