import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { AccountingService } from '@app/_services/accounting.service';
import { NotesService } from '@app/_services/notes.service';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-quarterly-stmnt-of-acct',
  templateUrl: './quarterly-stmnt-of-acct.component.html',
  styleUrls: ['./quarterly-stmnt-of-acct.component.css']
})
export class QuarterlyStmntOfAcctComponent implements OnInit {
	@ViewChild('confModal') confModal: ModalComponent;
	@ViewChild('generateModal') generateModal: ModalComponent;
	@ViewChild('qsoaListTbl') qsoaListTbl: CustEditableNonDatatableComponent;
	@ViewChild('filtCedingCoLOV') filtCedingCoLOV: CedingCompanyComponent;
	@ViewChild('gnrtCedingCoLOV') gnrtCedingCoLOV: CedingCompanyComponent;
	@ViewChild('tbl1') tbl1: CustEditableNonDatatableComponent;
	@ViewChild('tbl2') tbl2: CustEditableNonDatatableComponent;
	@ViewChild('tbl3') tbl3: CustEditableNonDatatableComponent;
	@ViewChild('tbl4') tbl4: CustEditableNonDatatableComponent;
	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
	@ViewChild('combinedStmtOfAcct') combinedStmtOfAcct: ModalComponent;
	@ViewChild('acctReceivable') acctReceivable: ModalComponent;
	@ViewChild('acctRemittance') acctRemittance: ModalComponent;

	comStmt:boolean = false;
	receivables:boolean = false;
	summary:boolean = false;
	remittances:boolean = false;

	QSOAList: any ={
		tableData: [],
		tHeader: ['Company', 'Currency', 'Quarter Ending','Status','Reference No.','Debit','Credit'],
		dataTypes: ['text','text','date','text','text','currency','currency'],
		keys: ['cedingName','currCd','quarterEnding','qsoaStatusDesc','refNoTranId','totalDebitAmt','totalCreditAmt'],
		widths: ["200"],
		infoFlag: true,
		paginateFlag: true,
		genericBtn: 'View Details',
		total: [null,null,null,null,'TOTAL','totalDebitAmt','totalCreditAmt'],
		searchFlag:true,
		uneditable: [true,true,true,true,true,true,true],
		pageLength: 15,
		pageID:1,
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
				key: 'refNoTranId',
				title: 'Ref. No.',
				dataType: 'text'
			},
			{
				key: 'totalDebitAmt',
				title: 'Debit',
				dataType: 'text'
			},
			{
				key: 'totalCreditAmt',
				title: 'Credit',
				dataType: 'text'
			},
		]
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

	passDataViewAccountsReceivable: any = {
		tableData:[],
		tHeader:["Policy No.","Memo No.","Incept Date","Expiry Date","Effective Date","Premium","RI Commission","Other Charges","Amount Due"],
		dataTypes: ["text","text","date","date","date","currency","currency","currency","currency"],
		keys: ['policyNo','memoNo','inceptDate','expiryDate','effDate','premium','riCommission','otherCharges','amountDue'],
		uneditable: [true,true,true,true,true,true,true,true,true],
		tableOnly: true,
		pageStatus: true,
		pagination: true,
		pageLength: 15,
		total: [null,null,null,null,'TOTAL','premium','riCommission','otherCharges','amountDue'],
		pageID: 'qsoaAccReceivables'
	}

	passDataSummary: any = {
		tableData: [],
		tHeader:["Line","Premium","RI Commission","Other Charges","Amount Due"],
		dataTypes: ["text","currency","currency","currency","currency"],
		keys: ['lineCd','premium','riCommission','otherCharges','amountDue'],
		total: ['TOTAL','premium','ricommission','otherCharges','amountDue'],
		tableOnly: true,
		pageStatus: true,
		pagination: true,
		pageLength: 10,
		pageID: 'qsoaSummary',
		uneditable:[true,true,true,true,true]
	}

    passDataViewRemittances: any = {
		tableData: [
			{tranType:'AR',tranNo:"00372890",tranDate:new Date("12-02-2018"),paymentType:"Inward Policy Balance",payee:"AFPGEN",particulars:"Payment for",amount:100000},
			{tranType:'AR',tranNo:"00373244",tranDate:new Date("12-03-2018"),paymentType:"Inward Policy Balance",payee:"AUII",particulars:"Payment for",amount:50000},
			{tranType:'AR',tranNo:"00372890",tranDate:new Date("12-04-2018"),paymentType:"Negative Treaty Balance",payee:"ALLIED",particulars:"Payment for",amount:250000},
			{tranType:'AR',tranNo:"00372890",tranDate:new Date("12-5-2018"),paymentType:"Negative Treaty Balance",payee:"UCPBGEN",particulars:"Payment for",amount:100000},
			{tranType:'CV',tranNo:"2018-003892",tranDate:new Date("12-5-2018"),paymentType:"Treaty Balance Due Participant",payee:"UCPBGEN",particulars:"Payment for",amount:100000},
			{tranType:'CV',tranNo:"2018-003893",tranDate:new Date("12-5-2018"),paymentType:"Treaty Balance Due Participant",payee:"ALLIED",particulars:"Payment for",amount:250000},
			{tranType:'CV',tranNo:"2018-003894",tranDate:new Date("12-5-2018"),paymentType:"Inward Policy Balances",payee:"AUII",particulars:"Payment for",amount:50000},
		],
		tHeader:["Tran Type","Tran No.","Tran Date","Payment Type","Payee/Payor","Particulars","Amount"],
		dataTypes: ["text","text","date","text","text","text","currency"],
		total: [null,null,null,null,null,'TOTAL','amount'],
		tableOnly: true,
		pageStatus: true,
		pagination: true,
		pageLength: 10,
		pageID: 5,
		uneditable:[true,true,true,true,true],
		widths:[1,150,1,'auto','auto',200,200]
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

	constructor(private titleService: Title, public modalService: NgbModal, private route: Router, private as: AccountingService, private ns: NotesService) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-IT | QSOA Inquiry");

		var d = new Date();
	    this.gnrtQtr = Math.floor((d.getMonth() / 3) + 1);
	    this.gnrtYear = d.getFullYear();

	    for(let x = d.getFullYear(); x >= 2018; x--) {
	    	this.yearParamOpts.push(x);
	    }

		this.showGenerateModal();
	}

	getQSOAList(param) {
		this.qsoaListTbl.overlayLoader = true;
		this.as.getQSOAList(param).subscribe(data => {
			this.qsoaListTbl.overlayLoader = false;
			console.log(data);
			this.QSOAList.tableData = data['qsoaList'];
			this.qsoaListTbl.refreshTable();
		});
	}

	showGenerateModal() {
		setTimeout(() => { $('#generateQSOAModal #modalBtn').trigger('click'); }, 0);
	}

	showModal(content) {
		this.totalDebitTbl = 0;
		this.totalCreditTbl = 0;
		this.totalDebit = 0;
		this.totalCredit = 0;
		this.combinedStmtOfAcct.openNoClose();
		setTimeout(() => {
			this.tbl1.refreshTable();
			this.tbl2.refreshTable();
			this.tbl1.overlayLoader = true;
			this.tbl2.overlayLoader = true;
		}, 0);
		
		this.as.getQSOADtl(this.selectedQsoa.qsoaId).subscribe(data => {
			this.qsoaDtl.tableData = data['qsoaDtlList'];
			this.qsoaDtlExclude.tableData = data['qsoaDtlExcludeList'];
			this.qsoaAcctReceivable.tableData = data['qsoaAcctReceivableList'];
			this.qsoaAcctRemittance.tableData = data['qsoaRemittanceList'];

			data['qsoaDtlList'].forEach(a => {
				this.totalDebitTbl += a.debitAmt;
				this.totalCreditTbl += a.creditAmt;
			});

			var a = this.totalCreditTbl - this.totalDebitTbl;

			this.balanceDebit = a >= 0 ? Math.abs(a) : 0;
			this.balanceCredit = a < 0 ? Math.abs(a) : 0;
			this.totalDebit = this.totalDebitTbl + this.balanceDebit;
			this.totalCredit = this.totalCreditTbl + this.balanceCredit;

			this.tbl1.refreshTable();
			this.tbl2.refreshTable();
		});
	}

	showQsoaAcctReceivableMdl() {
		this.acctReceivable.openNoClose();

		setTimeout(() => {
			this.tbl3.refreshTable();
		}, 0);
	}

	showQsoaRemittanceMdl() {
		this.acctRemittance.openNoClose();

		setTimeout(() => {
			this.tbl4.refreshTable();
		}, 0);
	}

	viewRemittances(){
		this.comStmt = false;
		this.receivables = false;
		this.summary	= false;
		this.remittances = true;
	}

	viewComStmt(){
		this.comStmt = true;
		this.receivables = false;
		this.summary	= false;
		this.remittances = false;
	}

	viewSummary(){
		this.comStmt = false;
		this.receivables = false;
		this.summary	= true;	
		this.remittances = false;
	}

	viewReceivables(){
		this.comStmt = false;
		this.receivables = true;
		this.summary	= false;
		this.remittances = false;
	}

	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			this.route.navigateByUrl('');
		}
	}

	showConfModal() {
		this.confModal.openNoClose();
	}

	onClickSearch() {
		var param = [
			{ key: 'cedingId', search: this.filtCedingId },
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
		this.filtCedingId = ev.cedingId;
		this.filtCedingName = ev.cedingName;
	}

	showGnrtCedingCoLOV() {
		this.gnrtCedingCoLOV.modal.openNoClose();
	}

	setGnrtCedingCo(ev) {
		this.gnrtCedingId = ev.cedingId;
		this.gnrtCedingName = ev.cedingName;
	}

	saveAcitQsoa(force?) {
		var param = {
			force: force === undefined ? 'N' : 'Y',
			cedingId: this.gnrtCedingId,
			qtr: this.gnrtQtr,
			year: this.gnrtYear,
			user: this.ns.getCurrentUser()
		}

		$('.qsoaLoader').css('display','block');
		this.as.saveAcitQsoa(param).subscribe(data => {
			$('.qsoaLoader').css('display','none');
			if(data['returnCode'] == -1) {
				this.dialogIcon = 'success-message';
				this.dialogMessage = 'QSOA successfully generated'
				this.successDialog.open();

				this.viewQsoa();
				
				// this.filtCedingId = this.gnrtCedingId;
				// this.filtCedingName = this.gnrtCedingName;
				// this.filtFromQtr = this.gnrtQtr;
				// this.filtFromYear = this.gnrtYear
				// this.filtToQtr = this.gnrtQtr;
				// this.filtToYear = this.gnrtYear

				var d = new Date();
				this.gnrtCedingId = '';
				this.gnrtCedingName = '';
			    this.gnrtQtr = Math.floor((d.getMonth() / 3) + 1);
			    this.gnrtYear = d.getFullYear();

				// this.onClickSearch();
			} else if(data['returnCode'] == 1) {
				this.confModal.openNoClose();
			} else if(data['returnCode'] == 2) {
				this.dialogIcon = 'error-message';
				this.dialogMessage = 'Payments have already been made for this QSOA. Regeneration is not allowed.';
				this.successDialog.open();
			} else {
				this.dialogIcon = 'error';
				this.successDialog.open();
			}
		});
	}

	viewQsoa() {
		this.filtCedingId = this.gnrtCedingId;
		this.filtCedingName = this.gnrtCedingName;
		this.filtFromQtr = this.gnrtQtr;
		this.filtFromYear = this.gnrtYear
		this.filtToQtr = this.gnrtQtr;
		this.filtToYear = this.gnrtYear

		this.onClickSearch();
	}
}