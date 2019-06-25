import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Title } from '@angular/platform-browser';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MtnTreatyComponent } from '@app/maintenance/mtn-treaty/mtn-treaty.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';

@Component({
  selector: 'app-claim-cash-call',
  templateUrl: './claim-cash-call.component.html',
  styleUrls: ['./claim-cash-call.component.css']
})
export class ClaimCashCallComponent implements OnInit {

  	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  	@ViewChild(MtnTreatyComponent) treatyLOV: MtnTreatyComponent;
  	@ViewChild('treatyShare') cedingCoLOV: CedingCompanyComponent;

  	passData: any = {
	  	tableData: [],
	  	tHeader: ['Clm Cash Call ID', 'Clm Cash Call Amt', 'Effective From', 'Active', 'Remarks'],
	  	dataTypes: ['sequence-6', 'currency', 'date', 'checkbox', 'text'],
	  	keys: ['clmCashCallId', 'amount', 'effDateFrom', 'activeTag', 'remarks'],
	  	widths: [1,'200','140',1,'auto'],
	  	uneditable: [true,false,false,false,false],
	  	uneditableKeys: ['amount','effDateFrom'],
	  	nData: {
	  		newRec: 1,
	  		clmCashCallId: '',
	  		amount: '',
	  		effDateFrom: '',
	  		activeTag: 'Y',
	  		remarks: '',
	  		createUser: this.ns.getCurrentUser(),
	  		createDate: this.ns.toDateTimeString(0),
	  		updateUser: this.ns.getCurrentUser(),
	  		updateDate: this.ns.toDateTimeString(0)
  		},
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: true
  	}

  	treatyCd: any = '';
  	treaty: any = '';
  	treatyCompCd: any = '';
  	treatyComp: any = '';
  	currencyCd: any = '';
  	currencyList: any[] = [];
  	hiddenTreaty: any[] = [];
  	hiddenCedingCo: any[] = [];
  	selected: any = null;
  	dialogIcon:string = '';
 	dialogMessage: string = '';
 	disableCopySetup: boolean = true;

	subscription: Subscription = new Subscription();

  constructor(	private ns: NotesService, 
  				private ms: MaintenanceService, 
  				private modalService: NgbModal, 
  				private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Mtn | Claim Cash Call");
  }

  ngOnDestroy() {
		this.subscription.unsubscribe();
  }

  onRowClick(data) {
		this.selected = data;	
		this.passData.disableGeneric = this.selected == null || this.selected == '' || this.selected.clmCashCallId != '';
		this.disableCopySetup = this.selected == null || this.selected == '' || this.selected.clmCashCallId == '';
  }

  showTreatyLOV(ev) {
		this.treatyLOV.modal.openNoClose();
  }

  setSelectedTreaty(data){
  	this.treatyCd = data.treatyId;
  	this.treaty = data.treatyName;
  }

  showTreatyCompLOV(ev){
  	this.cedingCoLOV.modal.openNoClose();
  }

  setSelectedCedCoTreatyShare(data){
  	console.log(data);
  	this.treatyCompCd = data.cedingId;
  	this.treatyComp = data.cedingName;

  }



}
