import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { UserService, NotesService, AccountingService, PrintService, MaintenanceService, UnderwritingService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-qsoa-reinsurance',
  templateUrl: './qsoa-reinsurance.component.html',
  styleUrls: ['./qsoa-reinsurance.component.css']
})
export class QsoaReinsuranceComponent implements OnInit {
	@ViewChild('mdlTabset') mdlTabset: NgbTabset;
	@ViewChild('qsoaListTbl') qsoaListTbl: CustEditableNonDatatableComponent;
	@ViewChild('qsoaListDtlTbl') qsoaListDtlTbl: CustEditableNonDatatableComponent;
	@ViewChild('qsoaDtlExcludeTbl') qsoaDtlExcludeTbl: CustEditableNonDatatableComponent;
	@ViewChild('qsoaAcctReceivableTbl') qsoaAcctReceivableTbl: CustEditableNonDatatableComponent;
	@ViewChild('qsoaAcctRemittanceTbl') qsoaAcctRemittanceTbl: CustEditableNonDatatableComponent;
	@ViewChild('filtCedingCoLOV') filtCedingCoLOV: CedingCompanyComponent;
	@ViewChild('gnrtCedingCoLOV') gnrtCedingCoLOV: CedingCompanyComponent;
	@ViewChild('dialog1') successDialog: SucessDialogComponent;
	@ViewChild('generateMdl') generateMdl: ModalComponent;
	@ViewChild('confMdl') confMdl: ModalComponent;
	@ViewChild('messageMdl1') messageMdl1: ModalComponent;
	@ViewChild('messageMdl2') messageMdl2: ModalComponent;
	@ViewChild('messageMdl3') messageMdl3: ModalComponent;
	@ViewChild('combinedStmtOfAcctMdl') combinedStmtOfAcctMdl: ModalComponent;
	@ViewChild('acctReceivableMdl') acctReceivableMdl: ModalComponent;
	@ViewChild('acctRemittanceMdl') acctRemittanceMdl: ModalComponent;
	@ViewChild('printMdl') printMdl: ModalComponent;
	@ViewChild('cedingPrintMdl') cedingPrintMdl: CedingCompanyComponent;
	@ViewChild('currencyMdl') currencyMdl: MtnCurrencyCodeComponent;

	@ViewChild('engDtlTbl') engDtlTbl: CustEditableNonDatatableComponent;
	@ViewChild('osClmDtlTbl') osClmDtlTbl: CustEditableNonDatatableComponent;
	@ViewChild('engSummTbl') engSummTbl: CustEditableNonDatatableComponent;
	@ViewChild('trtySummTbl') trtySummTbl: CustEditableNonDatatableComponent;
	@ViewChild('qsoaRiDtlMdl') qsoaRiDtlMdl: ModalComponent;
	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;

	comStmt:boolean = false;
	receivables:boolean = false;
	summary:boolean = false;
	remittances:boolean = false;

	qsoaList: any = {
		tableData: [],
		tHeader: ['Company', 'Currency', 'Quarter Ending','Status','Reference No.','Net Balance Due'],
		dataTypes: ['text','text','date','text','text','currency'],
		keys: ['cedingName','currCd','quarterEnding','qsoaStatusDesc','refNo','netQsoaAmt'],
		widths: ['auto','1','auto','auto','300','auto'],
		infoFlag: true,
		paginateFlag: true,
		genericBtn: 'View Details',
		total: [null,null,null,null,'TOTAL','netQsoaAmt'],
		searchFlag:true,
		uneditable: [true,true,true,true,true,true],
		pageLength: 15,
		pageID: 'QSOAListTab',
		disableGeneric: true,
		filters: [
			{
				key: 'cedingName',
				title: 'Company',
				dataType: 'text'
			},
			{
				key: 'currCd',
				title: 'Currency',
				dataType: 'text'
			},
			{
				key: 'quarterEnding',
				title: 'Quarter Ending',
				dataType: 'date'
			},
			{
				key: 'qsoaStatusDesc',
				title: 'Status',
				dataType: 'text'
			},
			{
				key: 'netQsoaAmt',
				title: 'Net Balance Due',
				dataType: 'text'
			}
		]
	}

	engDtl: any = {
		tableData:[],
		tHeader:['Treaty Name','UW Year','No.', 'Particular', 'Line', 'Amount'],
		dataTypes: ['text','text','number','text','text','currency'],
		uneditable: [true,true,true,true,true,false],
		total: [null,null,null,null,'Total','itemAmt'],
		tableOnly: true,
		pageLength: 20,
		infoFlag: true,
		paginateFlag: true,
		widths: ['auto','1','1','auto','1','auto'],
		pageID: 'engDtlTable',
		keys: ['treatyName','uwYear','itemNo','itemName','lineCd','itemAmt']
	}

	osClmDtl: any = {
		tableData:[],
		tHeader:['Treaty Name','UW Year','Line', 'Amount'],
		dataTypes: ['text','text','text','currency'],
		uneditable: [true,true,true,false],
		total: [null,null,'Total','itemAmt'],
		tableOnly: true,
		pageLength: 20,
		infoFlag: true,
		paginateFlag: true,
		widths: ['auto','1','1','auto'],
		pageID: 'osClmDtlTable',
		keys: ['treatyName','uwYear','lineCd','itemAmt']
	}

	engSumm: any = {
		tableData:[],
		tHeader:['Treaty Name','No.', 'Particular', 'Line', 'Amount'],
		dataTypes: ['text','number','text','text','currency'],
		uneditable: [true,true,true,true,true],
		total: [null,null,null,'Total','itemAmt'],
		tableOnly: true,
		pageLength: 20,
		infoFlag: true,
		paginateFlag: true,
		widths: ['auto','1','auto','1','auto'],
		pageID: 'engSummTable',
		keys: ['treatyName','itemNo','itemName','lineCd','itemAmt']
	}

	trtySumm: any = {
		tableData:[],
		tHeader:['Item No.', 'Particular', 'Amount'],
		dataTypes: ['number','text','currency'],
		nData: {
			itemNo: '',
			itemName: '',
			itemAmt: 0
		},
		uneditable: [true,false,false],
		total: [null,'Total','itemAmt'],
		tableOnly: true,
		pageLength: 20,
		infoFlag: true,
		paginateFlag: true,
		addFlag: true,
		deleteFlag: true,
		checkFlag: true,
		widths: ['1','auto','auto'],
		pageID: 'trtySummTable',
		keys: ['itemNo','itemName','itemAmt']
	}

	qsoaDtl: any ={
		tableData:[],
		tHeader:["Particulars","DEBIT","CREDIT"],
		dataTypes: ["text","currency","currency"],
		uneditable: [true,true,true],
		total: ['TOTAL','debitAmt','creditAmt'],
		tableOnly: true,
		pageLength: 'unli',
		infoFlag: false,
		paginateFlag: false,
		widths: ['300','120','120'],
		pageID: 'qsoaDtlTab',
		keys: ['particulars','debitAmt','creditAmt']
	}

	qsoaDtlExclude: any = {
		tableData:[],
		tHeader:["Particulars","Amount"],
		dataTypes: ["text","currency"],
		uneditable: [true,true],
		total: ['TOTAL','dtlAmt'],
		tableOnly: true,
		pageLength: 2,
		infoFlag: true,
		paginateFlag: true,
		widths: ['300','120'],
		pageID: 'qsoaDtlExcludeTab',
		keys: ['particulars','dtlAmt']
	}

	qsoaAcctReceivable: any = {
		tableData:[],
		tHeader:["Policy No.","Incept Date","Expiry Date","Effective Date","Premium","RI Commission","Other Charges","Amount Due"],
		dataTypes: ["text","date","date","date","currency","currency","currency","currency"],
		uneditable: [true,true,true,true,true,true,true,true],
		total: [null,null,null,'TOTAL','premAmt','commAmt','commVatAmt','amountDue'],
		tableOnly: true,
		pageLength: 15,
		infoFlag: true,
		paginateFlag: true,
		widths: ['auto','auto','auto','auto','auto','auto','auto','auto'],
		pageID: 'qsoaAcctReceivableTab',
		keys: ['policyNo','incDate','expDate','effDate','premAmt','commAmt','commVatAmt','amountDue']
	}

	qsoaAcctRemittance: any = {
		tableData: [],
		tHeader:["Tran Class","Tran No.","Tran Date","Payment Type","Payee / Payor","Particulars","Amount"],
		dataTypes: ["text","text","date","text","text","text","currency"],
		uneditable: [true,true,true,true,true,true,true],
		total: [null,null,null,null,null,'TOTAL','amount'],
		tableOnly: true,
		pageLength: 15,
		infoFlag: true,
		paginateFlag: true,
		widths: ['auto','auto','auto','auto','auto','auto','auto'],
		pageID: 'qsoaAcctRemittanceTab',
		keys: ['tranClass','tranNo','tranDate','tranTypeName','payee','particulars','amount']
	}

	confMsg: number = 1;
	filtCedingId: string = '';
	filtCedingName: string = '';
	filtFromQtr: number = null;
	filtFromYear: number = null;
	filtToQtr: number = null;
	filtToYear: number = null;
	gnrtCedingId: string = '';
	gnrtCedingName: string = '';
	gnrtQtr: number = 1;
	gnrtYear: number = 1;
	yearParamOpts: any[] = [];

	dialogIcon: string = '';
	dialogMessage: string = '';
	selectedQsoa: any = null;
	balanceDebit: any = 0;
	balanceCredit: any = 0;
	totalDebitTbl: any = 0;
	totalCreditTbl: any = 0;
	totalDebit: any = 0;
	totalCredit: any = 0;

	params: any = {
		reportId: '',
		cedingId: '',
		cedingName: '',
		currCd: '',
		currency: '',
		printFromQtr: '',
		printFromYear: '',
		printToQtr: '',
		printToYear: '',
		destination: 'screen'
	};

	allDest: boolean = false;
	exc: any[] = [];
	treatyComp: any[] = [];
	minYear: number = 1990;

	passDataCsv : any[] = [];
	searchSelectedCedants: any[] = [];
	generateSelectedCedants: any[] = [];
	existingQsoa: any = [];
	existingQsoaWithPayts: any[] = [];
	generatedQsoa: any [] = [];

	currentTab: string = '';
	cancelFlag: boolean = false;

	constructor(private titleService: Title, public modalService: NgbModal, private route: Router, private as: AccountingService,
				private ns: NotesService, private userService: UserService, public ps: PrintService, private ms: MaintenanceService,
				private us: UnderwritingService, private ngb: NgbModal) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-IT | QSOA Inquiry");
    	this.userService.emitModuleId("ACIT050");

    	this.ms.getMtnParameters('V', 'QS_CEDING_ID').subscribe(data => {
		  if(data['parameters'].length > 0) {
		    this.exc = [data['parameters'][0].paramValueV];
		  }
		});

		this.us.getCedingCompanyList('','','','','','','','','','').subscribe(data => {
			this.treatyComp = data['cedingcompany'].filter(a => a.treatyTag == 'Y').map(a => a.cedingId);
		});

		var d = new Date();
	    this.gnrtQtr = Math.floor((d.getMonth() / 3) + 1);
	    this.gnrtYear = d.getFullYear();
	    this.params.printFromQtr = Math.floor((d.getMonth() / 3) + 1);
	    this.params.printToQtr = Math.floor((d.getMonth() / 3) + 1);
	    this.params.printFromYear = d.getFullYear();
	    this.params.printToYear = d.getFullYear();

	    for(let x = d.getFullYear(); x >= this.minYear; x--) {
	    	this.yearParamOpts.push(x);
	    }

		this.showGenerateMdl();
	}

	getQSOAList(param) {
		this.qsoaListTbl.overlayLoader = true;
		this.as.getQSOARiList(param).subscribe(data => {
			this.qsoaListTbl.overlayLoader = false;
			this.qsoaList.tableData = data['qsoaList'];
			this.qsoaListTbl.refreshTable();
		});
	}

	showGenerateMdl() {
		setTimeout(() => {
			this.gnrtCedingName = '';
			this.generateSelectedCedants = [];
			this.generateMdl.openNoClose();
		}, 0);
	}

	toggleGeneric(ev) {
		this.qsoaList.disableGeneric = this.selectedQsoa == null;
	}

	onDblClick(ev) {
		this.selectedQsoa = ev;
		this.showQSOARiDtlMdl();
	}

	showQSOARiDtlMdl() {
		this.mdlTabset.select('engDtlTab');
		this.qsoaRiDtlMdl.openNoClose();
		this.currentTab = 'engDtlTab';

		setTimeout(() => {
			this.engDtlTbl.refreshTable();
			this.engDtlTbl.overlayLoader = true;
		}, 0);

		this.getQSOARiDtl();
	}

	getQSOARiDtl() {
		var param = {
			qsoaId: this.selectedQsoa.qsoaId,
			from: this.currentTab
		}

		this.as.getQSOARiDtl(param).subscribe(data => {
			console.log(data);
			switch(this.currentTab) {
	  	      	case 'engDtlTab':
	  	      	 	this.engDtl.tableData = data['qsoaRiDtlList'];
	  	      	 	this.engDtlTbl.refreshTable();
	  	      	break;

	  	      	case 'osClmDtlTab':
	  	      		this.osClmDtl.tableData = data['qsoaRiDtlList'];
	  	      	 	this.osClmDtlTbl.refreshTable();
	  	      	break;

	  	      	case 'engSummTab':
	  	      		this.engSumm.tableData = data['qsoaRiDtlList'];
	  	      	 	this.engSummTbl.refreshTable();
	  	      	break;

	  	      	case 'trtySummTab':
	  	      		this.trtySumm.tableData = data['qsoaRiDtlList'];
	  	      	 	this.trtySummTbl.refreshTable();
	  	      	break;
	  	    }
		});
	}

	showQsoaAcctReceivableMdl() {
		this.acctReceivableMdl.openNoClose();

		setTimeout(() => {
			this.qsoaAcctReceivableTbl.refreshTable();
		}, 0);
	}

	showQsoaRemittanceMdl() {
		this.acctRemittanceMdl.openNoClose();

		setTimeout(() => {
			this.qsoaAcctRemittanceTbl.refreshTable();
		}, 0);
	}

	onClickMdlSave() {
		var proceed = false;

		switch(this.currentTab) {
  	      	case 'engDtlTab':
	  	      	for(var i = 0; i < this.engDtl.tableData.length; i++) {
			  	  	var a = this.engDtl.tableData[i];

			  	  	if(a.edited && !a.deleted && isNaN(a.itemAmt)) {
			  	  		this.dialogIcon = "error-message";
			  	  		this.dialogMessage = "Invalid Item Amount";
			  	  		this.successDialog.open();
			  	  		return;
			  	  	}
			  	}

			  	proceed = true;
  	      	break;

  	      	case 'osClmDtlTab':
	  	      	for(var i = 0; i < this.osClmDtl.tableData.length; i++) {
			  	  	var a = this.osClmDtl.tableData[i];

			  	  	if(a.edited && !a.deleted && isNaN(a.itemAmt)) {
			  	  		this.dialogIcon = "error-message";
			  	  		this.dialogMessage = "Invalid Item Amount";
			  	  		this.successDialog.open();
			  	  		return;
			  	  	}
			  	}

			  	proceed = true;
  	      	break;

  	      	case 'trtySummTab':
	  	      	for(var i = 0; i < this.trtySumm.tableData.length; i++) {
			  	  	var a = this.trtySumm.tableData[i];

			  	  	if(a.edited && !a.deleted && isNaN(a.itemAmt)) {
			  	  		this.dialogIcon = "error-message";
			  	  		this.dialogMessage = "Invalid Item Amount";
			  	  		this.successDialog.open();
			  	  		return;
			  	  	}

			  	  	if(a.edited && !a.deleted && (a.itemName == '' || a.itemName == null)) {
			  	  		this.dialogIcon = "error-message";
			  	  		this.dialogMessage = "Please check field values.";
			  	  		this.successDialog.open();
			  	  		return;
			  	  	}
			  	}

			  	proceed = true;
  	      	break;
	    }

	    if(proceed) {
	  		if(this.cancelFlag) {
	  			this.saveAcitQsoaRiDtl(1);
	  		} else {
	  	    	this.confirmSave.confirmModal();
	  	  	}
	  	}
	}

	onClickMdlReturn() {
		if((this.currentTab == 'engDtlTab' && this.engDtlTbl.form.first.dirty)
			|| (this.currentTab == 'osClmDtlTab' && this.osClmDtlTbl.form.first.dirty)
			|| (this.currentTab == 'engSummTab' && this.engSummTbl.form.first.dirty)
			|| (this.currentTab == 'trtySummTab' && this.trtySummTbl.form.first.dirty)) {

		  	const subject = new Subject<boolean>();
		  	const modal = this.ngb.open(ConfirmLeaveComponent,{
		  		centered: true, 
		  		backdrop: 'static', 
		  		windowClass : 'modal-size'
		  	});
		  	modal.componentInstance.closeAll = false;
		  	modal.componentInstance.subject = subject;

	  		subject.subscribe(a=>{
	  	    	if(a) {
		  	      	switch(this.currentTab) {
			  	      	case 'engDtlTab':
			  	      		this.engDtlTbl.markAsPristine();
			  	      	break;

			  	      	case 'osClmDtlTab':
			  	      	  	this.osClmDtlTbl.markAsPristine();
			  	      	break;

			  	      	case 'engSummTab':
			  	      	  	this.engSummTbl.markAsPristine();
			  	      	break;

			  	      	case 'trtySummTab':
			  	      	  	this.trtySummTbl.markAsPristine();
			  	      	break;
		  	    	}

		  	    	this.qsoaRiDtlMdl.closeModal();
		  	    }
	  	  	});
	  	} else {
	  		this.qsoaRiDtlMdl.closeModal();
	  	}
	}

	saveAcitQsoaRiDtl(cancel?) {
		this.cancelFlag = cancel !== undefined;
	  	if(cancel !== undefined && cancel !== 1) {
	  		this.onClickMdlSave();
	  		return;
	  	}

		var params = {
			qsoaId: this.selectedQsoa.qsoaId,
			cedingId: this.selectedQsoa.cedingId,
			currCd: this.selectedQsoa.currCd,
			saveEngDtlList: [],
			saveOsClmDtlList: [],
			saveTrtySumm: [],
			delTrtySumm: []
		}

		switch(this.currentTab) {
  	      	case 'engDtlTab':
	  	      	params.saveEngDtlList = this.engDtl.tableData.filter(a => a.edited && !a.deleted).map(a => {
	  	      		a.qsoaId = this.selectedQsoa.qsoaId;

	  	      		return a;
	  	      	});
  	      	break;

  	      	case 'osClmDtlTab':
	  	      	params.saveOsClmDtlList = this.osClmDtl.tableData.filter(a => a.edited && !a.deleted).map(a => {
	  	      		a.qsoaId = this.selectedQsoa.qsoaId;

	  	      		return a;
	  	      	});
  	      	break;

  	      	case 'trtySummTab':
	  	      	params.saveTrtySumm = this.trtySumm.tableData.filter(a => a.edited && !a.deleted).map(a => {
	  	      		a.qsoaId = this.selectedQsoa.qsoaId;

	  	      		return a;
	  	      	});

	  	      	params.delTrtySumm = this.trtySumm.tableData.filter(a => a.deleted).map(a => {
	  	      		a.qsoaId = this.selectedQsoa.qsoaId;

	  	      		return a;
	  	      	});
  	      	break;
	    }

	    this.as.saveAcitQsoaRiDtl(params).subscribe(data => {
	    	console.log(data);
	    	if(data['returnCode'] == 0) {
		  	  	this.dialogIcon = "error";
		  	  	this.successDialog.open();
		  	} else if(data['returnCode'] == -1) {
		  	    this.dialogIcon = "success";
		  	    this.dialogMessage = "";
		  	    this.successDialog.open();

		  	    switch(this.currentTab) {
		  		    case 'engDtlTab':
			  	      	this.engDtlTbl.markAsPristine();
		  	    	break;

		  	   		case 'osClmDtlTab':
			  	      	this.osClmDtlTbl.markAsPristine();
		  	    	break;

		  	    	case 'engSummTab':
			  	      	this.engSummTbl.markAsPristine();
		  	    	break;

		  	    	case 'trtySummTab':
		  	   			this.trtySummTbl.markAsPristine();
		  	    	break;
		  	    }
		  	    
		  	    this.getQSOARiDtl();
		  	}
	    });
	}

	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			this.route.navigateByUrl('');
		}
	}

	onMdlTabChange(ev: NgbTabChangeEvent) {
		if((ev.activeId == 'engDtlTab' && this.engDtlTbl.form.first.dirty)
			|| (ev.activeId == 'osClmDtlTab' && this.osClmDtlTbl.form.first.dirty)
			|| (ev.activeId == 'engSummTab' && this.engSummTbl.form.first.dirty)
			|| (ev.activeId == 'trtySummTab' && this.trtySummTbl.form.first.dirty)) {
	  		ev.preventDefault();

		  	const subject = new Subject<boolean>();
		  	const modal = this.ngb.open(ConfirmLeaveComponent,{
		  		centered: true, 
		  		backdrop: 'static', 
		  		windowClass : 'modal-size'
		  	});
		  	modal.componentInstance.closeAll = false;
		  	modal.componentInstance.subject = subject;

	  		subject.subscribe(a=>{
	  	    	if(a) {
		  	      	switch(ev.activeId) {
			  	      	case 'engDtlTab':
			  	      		this.engDtlTbl.markAsPristine();
			  	      	break;

			  	      	case 'osClmDtlTab':
			  	      	  	this.osClmDtlTbl.markAsPristine();
			  	      	break;

			  	      	case 'engSummTab':
			  	      	  	this.engSummTbl.markAsPristine();
			  	      	break;

			  	      	case 'trtySummTab':
			  	      	  	this.trtySummTbl.markAsPristine();
			  	      	break;
		  	    	}
		  	      
			  	    this.currentTab = ev.nextId;
			  	    this.mdlTabset.select(ev.nextId);
		  	    }
	  	  	});
	  	} else {
	  		this.currentTab = ev.nextId;
		
			switch(this.currentTab) {
	  	      	case 'engDtlTab':
	  	      	 	setTimeout(() => {
						this.engDtlTbl.refreshTable();
						this.engDtlTbl.overlayLoader = true;
					}, 0);
	  	      	break;

	  	      	case 'osClmDtlTab':
	  	      		setTimeout(() => {
						this.osClmDtlTbl.refreshTable();
						this.osClmDtlTbl.overlayLoader = true;
					}, 0);
	  	      	break;

	  	      	case 'engSummTab':
	  	      		setTimeout(() => {
						this.engSummTbl.refreshTable();
						this.engSummTbl.overlayLoader = true;
					}, 0);
	  	      	break;

	  	      	case 'trtySummTab':
	  	      		setTimeout(() => {
						this.trtySummTbl.refreshTable();
						this.trtySummTbl.overlayLoader = true;
					}, 0);
	  	      	break;
	  	    }

			this.getQSOARiDtl();
	  	}
	}

	onClickTrtySummAdd() {
		if(this.trtySumm.tableData.filter(a => !a.deleted).length > 0) {
			var itemNo = Math.max(...this.trtySumm.tableData.filter(a => !a.deleted).map(a => a.itemNo));
			this.trtySumm.tableData[this.trtySumm.tableData.length - 1].itemNo = itemNo + 1;
		} else {
			this.trtySumm.tableData[0].itemNo = 1;
		}

		this.trtySumm.tableData[this.trtySumm.tableData.length - 1].edited = true;
	}

	onClickSearch() {
		var cedants = this.searchSelectedCedants.map(a => a.cedingId);

		var param = [
			{ key: 'cedingId', search: cedants },
			{ key: 'fromQtr', search: this.filtFromQtr },
			{ key: 'fromYear', search: this.filtFromYear },
			{ key: 'toQtr', search: this.filtToQtr },
			{ key: 'toYear', search: this.filtToYear }
		];

		this.getQSOAList(param);
	}

	showFiltCedingCoLOV() {
		this.filtCedingCoLOV.modal.openNoClose();
	}

	setFiltCedingCo(ev) {
		if(ev.length > 0) {
			if(ev.length == 1) {
				this.filtCedingName = ev[0].cedingName
			} else {
				this.filtCedingName = 'Multiple Companies';
			}
		} else {
			this.filtCedingName = '';
		}

		this.searchSelectedCedants = ev.map(a => {
			return {
				cedingId: a.cedingId,
				cedingName: a.cedingName
			}
		});
	}

	showGnrtCedingCoLOV() {
		this.gnrtCedingCoLOV.modal.openNoClose();
	}

	setGnrtCedingCo(ev) {
		if(ev.length > 0) {
			if(ev.length == 1) {
				this.gnrtCedingName = ev[0].cedingName
			} else {
				this.gnrtCedingName = 'Multiple Companies';
			}
		} else {
			this.gnrtCedingName = '';
		}

		this.generateSelectedCedants = ev.map(a => {
			return {
				cedingId: a.cedingId,
				cedingName: a.cedingName
			}
		});
	}

	saveAcitQsoaMultiple(overwrite?) {
		var arr = overwrite == undefined ? this.generateSelectedCedants : this.existingQsoa;
		for(var i = 0; i < arr.length ; i++) {
			this.gnrtCedingId = arr[i].cedingId;

			if(overwrite == undefined) {
				this.saveAcitQsoa();
			} else {
				this.saveAcitQsoa(true);
			}
		}
	}

	saveAcitQsoa(force?) {
		if(this.generateSelectedCedants.length == 0) {
			this.dialogIcon = 'error-message';
			this.dialogMessage = 'Ceding company required.';
			this.successDialog.open();
			return;
		}

		if(force == undefined) {
			this.generatedQsoa = [];
			this.existingQsoa = [];
			this.existingQsoaWithPayts = [];
		}

		var arr = force == undefined ? this.generateSelectedCedants : this.existingQsoa;
		var i = 0;

		const _this = this;
		function recur() {
			if(i >= arr.length) {
				return;
			}

			var param = {
				force: force === undefined ? 'N' : 'Y',
				cedingId: arr[i].cedingId,
				qtr: _this.gnrtQtr,
				year: _this.gnrtYear,
				user: _this.ns.getCurrentUser()
			}

			$('.qsoaLoader').css('display','block');
			_this.as.saveAcitQsoaRi(param).subscribe(data => {
				if(data['returnCode'] == -1) {
				 	_this.generatedQsoa.push(data['cedingId']);
				} else if(data['returnCode'] == 1) {
					_this.existingQsoa.push(data['cedingId']);
				} else if(data['returnCode'] == 2) {
					_this.existingQsoaWithPayts.push(data['cedingId']);
				} else {
					$('.qsoaLoader').css('display','none');
					_this.dialogIcon = 'error';
					_this.successDialog.open();
					return;
				}

				if((i + 1) == arr.length) {
					$('.qsoaLoader').css('display','none');
					if(_this.existingQsoa.length > 0 && force == undefined) {
						_this.existingQsoa = _this.generateSelectedCedants.filter(a => _this.existingQsoa.includes(a.cedingId));
						_this.messageMdl2.openNoClose();
					}

					if(_this.existingQsoaWithPayts.length > 0) {
						_this.existingQsoaWithPayts = _this.generateSelectedCedants.filter(a => _this.existingQsoaWithPayts.includes(a.cedingId));
						_this.messageMdl3.openNoClose();
					}

					if(_this.generatedQsoa.length > 0) {
						_this.generatedQsoa = _this.generateSelectedCedants.filter(a => _this.generatedQsoa.includes(a.cedingId));
						_this.messageMdl1.openNoClose();
					}
				} else {
					i++;
					recur();
				}
			});
		}

		recur();
	}

	viewQsoa() {
		// this.filtCedingId = this.gnrtCedingId;
		this.searchSelectedCedants = this.generateSelectedCedants.filter(a => true);
		// this.filtCedingName = this.gnrtCedingName;
		if(this.searchSelectedCedants.length > 0) {
			if(this.searchSelectedCedants.length == 1) {
				this.filtCedingName = this.searchSelectedCedants[0].cedingName
			} else {
				this.filtCedingName = 'Multiple Companies';
			}
		} else {
			this.filtCedingName = '';
		}
		this.filtFromQtr = this.gnrtQtr;
		this.filtFromYear = this.gnrtYear
		this.filtToQtr = this.gnrtQtr;
		this.filtToYear = this.gnrtYear

		this.onClickSearch();
	}

	onChangeCedingName(from) {
		if(from == 'search' && this.filtCedingName == '') {
			this.filtCedingId = '';
			this.searchSelectedCedants = [];
		} else if(from == 'generate' && this.gnrtCedingName == '') {
			this.gnrtCedingId = '';
			this.generateSelectedCedants = [];
		}
	}

	onClickPrint() {
		this.resetParams();
		this.printMdl.openNoClose();
	}

	setCedingPrint(data) {
		this.params.cedingId = data.cedingId;
	    this.params.cedingName = data.cedingName;
	    this.allDest = this.treatyComp.includes(data.cedingId);
	    this.ns.lovLoader(data.ev, 0);
	}

	setCurrency(data) {
	    this.params.currCd = data.currencyCd;
	    this.params.currency = data.description;
	    this.ns.lovLoader(data.ev, 0);
	}

	checkCode(ev, from) {
	    this.ns.lovLoader(ev, 1);
	    if(from == 'cedingId') {
	      this.cedingPrintMdl.checkCode(String(this.params.cedingId) == '' ? '' : String(this.params.cedingId).padStart(3, '0'), ev);
	    } else if(from == 'currCd') {
	      this.currencyMdl.checkCode(this.params.currCd, ev);
	    }
	}

	print() {
		this.ps.printLoader = true;
		/*if(this.treatyComp.includes(this.params.cedingId)) {
			var param = [
				{ key: 'treatyTag', search: 'Y' },
				{ key: 'cedingId', search: this.params.cedingId },
				{ key: 'currCd', search: this.params.currCd },
				{ key: 'fromQtr', search: this.params.printFromQtr },
				{ key: 'fromYear', search: this.params.printFromYear },
				{ key: 'toQtr', search: this.params.printToQtr },
				{ key: 'toYear', search: this.params.printToYear }
			];
			
			this.as.getAcitQsoaPrint(param).subscribe(data => {
				data['qsoaPrintList'].forEach(a => {
					var custName = a.cedingAbbr + '_' + this.ns.toDateTimeString(a.quarterEnding).split('T')[0] + '_' + a.currCd + '_';

					if(this.params.destination == 'exl'){
				      this.passDataCsv = [];
				      this.getExtractToCsv(this.ns.toDateTimeString(a.quarterEnding).split('T')[0], a.currCd);
				      return;
				    }

					let paramsB: any = {
				      "reportId": 'ACITR070A',
				      "acitr050Params.reportId": 'ACITR070A',
				      "acitr050Params.cedingId": a.cedingId,
				      "acitr050Params.currCd": a.currCd,
				      "acitr050Params.qtrEnding": this.ns.toDateTimeString(a.quarterEnding).split('T')[0],
				      "fileName": 'ACITR070A_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR070A', paramsB);

				    let paramsC: any = {
				      "reportId": 'ACITR070B',
				      "acitr050Params.reportId": 'ACITR070B',
				      "acitr050Params.cedingId": a.cedingId,
				      "acitr050Params.currCd": a.currCd,
				      "acitr050Params.qtrEnding": this.ns.toDateTimeString(a.quarterEnding).split('T')[0],
				      "fileName": 'ACITR070B_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR070B', paramsC);

				    let paramsD: any = {
				      "reportId": 'ACITR070C',
				      "acitr050Params.reportId": 'ACITR070C',
				      "acitr050Params.cedingId": a.cedingId,
				      "acitr050Params.currCd": a.currCd,
				      "acitr050Params.qtrEnding": this.ns.toDateTimeString(a.quarterEnding).split('T')[0],
				      "fileName": 'ACITR070C_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR070C', paramsD);
				});
			});
		} else {*/
			var param = [
				{ key: 'treatyTag', search: 'N' },
				{ key: 'cedingId', search: this.params.cedingId },
				{ key: 'currCd', search: this.params.currCd },
				{ key: 'fromQtr', search: this.params.printFromQtr },
				{ key: 'fromYear', search: this.params.printFromYear },
				{ key: 'toQtr', search: this.params.printToQtr },
				{ key: 'toYear', search: this.params.printToYear }
			];
			
			this.as.getAcitQsoaPrint(param).subscribe(data => {
				data['qsoaPrintList'].forEach(a => {
					if(this.params.destination == 'exl'){
				      this.passDataCsv = [];
				      this.getExtractToCsv(this.ns.toDateTimeString(a.quarterEnding).split('T')[0], a.currCd, a.qsoaId);
				      return;
				    }

					var custName = a.cedingAbbr + '_' + this.ns.toDateTimeString(a.quarterEnding).split('T')[0] + '_' + a.currCd + '_';

					let paramsA: any = {
				      "reportId": 'ACITR070A',
				      "acitr070Params.reportId": 'ACITR070A',
				      "acitr070Params.qsoaId": a.qsoaId,
				      "fileName": 'ACITR070A_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR070A', paramsA);

				    let paramsB: any = {
				      "reportId": 'ACITR070B',
				      "acitr070Params.reportId": 'ACITR070B',
				      "acitr070Params.qsoaId": a.qsoaId,
				      "fileName": 'ACITR070B_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR070B', paramsB);

				    let paramsC: any = {
				      "reportId": 'ACITR070C',
				      "acitr070Params.reportId": 'ACITR070C',
				      "acitr070Params.qsoaId": a.qsoaId,
				      "fileName": 'ACITR070C_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR070C', paramsC);
				});
			});
		// }
	}

	resetParams() {
		this.params = {
			reportId: '',
			cedingId: '',
			cedingName: '',
			currCd: '',
			currency: '',
			printFromQtr: '',
			printFromYear: '',
			printToQtr: '',
			printToYear: '',
			destination: 'screen'
		}

		var d = new Date();
	    this.params.printFromQtr = Math.floor((d.getMonth() / 3) + 1);
	    this.params.printToQtr = Math.floor((d.getMonth() / 3) + 1);
	    this.params.printFromYear = d.getFullYear();
	    this.params.printToYear = d.getFullYear();
	}


	 getExtractToCsv(paramDate, currCd?, qsoaId?) {
      this.ms.getExtractToCsv(this.ns.getCurrentUser(),'ACITR070','',paramDate,currCd,this.params.cedingId,'','','','','','','','','','','','','','','','',qsoaId)
      .subscribe(data => {
      	this.ps.printLoader = false;
    
        var months = new Array("Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
        "Oct", "Nov", "Dec");

        alasql.fn.myFormat = function(d){
          if(d == null){
            return '';
          }
          var date = new Date(d);
          var day = (date.getDate()<10)?"0"+date.getDate():date.getDate();
          var mos = months[date.getMonth()];
          return day+'-'+mos+'-'+date.getFullYear(); 
        };

        alasql.fn.negFmt = function(m){
          return (m==null || m=='') ? 0 : Number(m);
        };

        alasql.fn.isNull = function(n){
          return n==null?'':n;
        };

        alasql.fn.checkNullNo = function(o){
          return (o==null || o=='')?'': Number(o);
        };

        
        	          
        var queryA = 'SELECT isNull(groupTag) as [GROUP TAG], qsoaId as [QSOA ID], isNull(cedingId) as [CEDING ID], isNull(cedingAbbr) as [CEDING ABBR], myFormat(quarterEnding) as [QUARTER ENDING], checkNullNo(treatyId) as [TREATY ID], ' +
        			 'isNull(treatyName) as [TREATY NAME], checkNullNo(itemNo) as [ITEM NO], isNull(itemName) as [ITEM NAME], isNull(lineCd) as [LINE CD], ' +
        			 'negFmt(currency(itemAmt)) as [ITEM AMT], isNull(extractUser) as [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE]';
        
        var queryB = 'SELECT qsoaId as [QSOA ID], isNull(cedingId) as [CEDING ID], isNull(cedingAbbr) as [CEDING ABBR], myFormat(quarterEnding) as [QUARTER ENDING], checkNullNo(treatyId) as [TREATY ID], ' +
        			 'isNull(treatyName) as [TREATY NAME], checkNullNo(uwYear) as [UW YEAR], checkNullNo(itemNo) as [ITEM NO], isNull(itemName) as [ITEM NAME], isNull(lineCd) as [LINE CD], ' +
        			 'negFmt(currency(itemAmt)) as [ITEM AMT], isNull(extractUser) as [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE]';

          this.ns.export('ACITR070A', queryA, data['listAcitr070a']);
          this.ns.export('ACITR070B', queryB, data['listAcitr070b']);
          this.ns.export('ACITR070C', queryB, data['listAcitr070c']);

        });
	}

}
