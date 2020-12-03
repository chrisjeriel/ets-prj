import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { UserService, NotesService, AccountingService, PrintService, MaintenanceService, UnderwritingService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';

@Component({
  selector: 'app-quarterly-stmnt-of-acct',
  templateUrl: './quarterly-stmnt-of-acct.component.html',
  styleUrls: ['./quarterly-stmnt-of-acct.component.css']
})
export class QuarterlyStmntOfAcctComponent implements OnInit {
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

	comStmt:boolean = false;
	receivables:boolean = false;
	summary:boolean = false;
	remittances:boolean = false;

	qsoaList: any = {
		tableData: [],
		tHeader: ['Company', 'Currency', 'Quarter Ending','Status','Reference No.','Debit','Credit'],
		dataTypes: ['text','text','date','text','text','currency','currency'],
		keys: ['cedingName','currCd','quarterEnding','qsoaStatusDesc','refNo','totalDebitAmt','totalCreditAmt'],
		widths: ['auto','1','auto','auto','300','auto','auto'],
		infoFlag: true,
		paginateFlag: true,
		genericBtn: 'View Details',
		total: [null,null,null,null,'TOTAL','totalDebitAmt','totalCreditAmt'],
		searchFlag:true,
		uneditable: [true,true,true,true,true,true,true],
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
			/*{
				key: 'refNoTranId',
				title: 'Ref. No.',
				dataType: 'text'
			},*/
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

	constructor(private titleService: Title, public modalService: NgbModal, private route: Router, private as: AccountingService,
				private ns: NotesService, private userService: UserService, public ps: PrintService, private ms: MaintenanceService,
				private us: UnderwritingService) { }

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
		this.as.getQSOAList(param).subscribe(data => {
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
		this.showCombinedStmtOfAcctMdl();
	}

	showCombinedStmtOfAcctMdl() {
		this.totalDebitTbl = 0;
		this.totalCreditTbl = 0;
		this.totalDebit = 0;
		this.totalCredit = 0;

		this.combinedStmtOfAcctMdl.openNoClose();

		setTimeout(() => {
			this.qsoaListDtlTbl.refreshTable();
			this.qsoaDtlExcludeTbl.refreshTable();
			this.qsoaListDtlTbl.overlayLoader = true;
			this.qsoaDtlExcludeTbl.overlayLoader = true;
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

			this.qsoaListDtlTbl.refreshTable();
			this.qsoaDtlExcludeTbl.refreshTable();
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

	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			this.route.navigateByUrl('');
		}
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
		// this.filtCedingId = ev.cedingId;
		// this.filtCedingName = ev.cedingName;
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
		// this.gnrtCedingId = ev.cedingId;
		// this.gnrtCedingName = ev.cedingName;
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
			_this.as.saveAcitQsoa(param).subscribe(data => {
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

		/*var param = {
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

				// this.dialogIcon = 'success-message';
				// this.dialogMessage = 'QSOA successfully generated';
				// this.successDialog.open();

				// this.viewQsoa();

				// var d = new Date();
				// this.gnrtCedingId = '';
				// this.gnrtCedingName = '';
				// this.gnrtQtr = Math.floor((d.getMonth() / 3) + 1);
				// this.gnrtYear = d.getFullYear();
			 	this.generatedQsoa.push(data['cedingId']);
			} else if(data['returnCode'] == 1) {
				// this.confMdl.openNoClose();
				this.existingQsoa.push(data['cedingId']);
			} else if(data['returnCode'] == 2) {
				// this.dialogIcon = 'error-message';
				// this.dialogMessage = 'Payments have already been made for this QSOA. Regeneration is not allowed.';
				// this.successDialog.open();
				this.existingQsoaWithPayts.push(data['cedingId']);

			} else {
				this.dialogIcon = 'error';
				this.successDialog.open();
			}

			// if((this.lastElement + 1) == this.generateSelectedCedants.length) {
			if(this.lastElement) {
				if(this.existingQsoa.length > 0) {
					this.existingQsoa = this.generateSelectedCedants.filter(a => this.existingQsoa.includes(a.cedingId));
					this.messageMdl2.openNoClose();
				}

				if(this.existingQsoaWithPayts.length > 0) {
					this.existingQsoaWithPayts = this.generateSelectedCedants.filter(a => this.existingQsoaWithPayts.includes(a.cedingId));
					this.messageMdl3.openNoClose();
				}

				if(this.generatedQsoa.length > 0) {
					this.generatedQsoa = this.generateSelectedCedants.filter(a => this.generatedQsoa.includes(a.cedingId));
					this.messageMdl1.openNoClose();
				}
			}
		});*/
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
		if(this.treatyComp.includes(this.params.cedingId)) {
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
				      "reportId": 'ACITR050B',
				      "acitr050Params.reportId": 'ACITR050B',
				      "acitr050Params.cedingId": a.cedingId,
				      "acitr050Params.currCd": a.currCd,
				      "acitr050Params.qtrEnding": this.ns.toDateTimeString(a.quarterEnding).split('T')[0],
				      "fileName": 'ACITR050B_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR050B', paramsB);

				    let paramsC: any = {
				      "reportId": 'ACITR050C',
				      "acitr050Params.reportId": 'ACITR050C',
				      "acitr050Params.cedingId": a.cedingId,
				      "acitr050Params.currCd": a.currCd,
				      "acitr050Params.qtrEnding": this.ns.toDateTimeString(a.quarterEnding).split('T')[0],
				      "fileName": 'ACITR050C_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR050C', paramsC);

				    let paramsD: any = {
				      "reportId": 'ACITR050D',
				      "acitr050Params.reportId": 'ACITR050D',
				      "acitr050Params.cedingId": a.cedingId,
				      "acitr050Params.currCd": a.currCd,
				      "acitr050Params.qtrEnding": this.ns.toDateTimeString(a.quarterEnding).split('T')[0],
				      "fileName": 'ACITR050D_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR050D', paramsD);
				});
			});
		} else {
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
					var custName = a.cedingAbbr + '_' + this.ns.toDateTimeString(a.quarterEnding).split('T')[0] + '_' + a.currCd + '_';

					let params: any = {
				      "reportId": 'ACITR050A',
				      "acitr050Params.reportId": 'ACITR050A',
				      "acitr050Params.qsoaId": a.qsoaId,
				      "fileName": 'ACITR050A_' + custName + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
				    }

				    this.ps.print(this.params.destination, 'ACITR050A', params);
				});
			});
		}
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


	 getExtractToCsv(paramDate, currCd?) {
      this.ms.getExtractToCsv(this.ns.getCurrentUser(),'ACITR050','',paramDate,currCd,this.params.cedingId)
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

        
        var queryB = 'SELECT checkNullNo(grpNo) as [GROUP NO], isNull(grpName) as [TREATY SHR GRP], checkNullNo(itemNo) as [ITEM NO], isNull(itemName) as [TREATY ITEM NAME], negFmt(currency(carAmt)) as [CAR], '+
          'negFmt(currency(earAmt)) as [EAR], negFmt(currency(bpvAmt)) as [BPV], negFmt(currency(mbiAmt)) as [MBI], negFmt(currency(eeiAmt)) as [EEI],'+
          'negFmt(currency(dosAmt)) as [DOS], negFmt(currency(mlpAmt)) as [MLP], negFmt(currency(cecAmt)) as [CEC], negFmt(currency(totalAmt)) as [TOTAL AMT],'+
          'myFormat(paramDate) as [PARAM DATE], isNull(paramCurrency) as [PARAM CURRENCY], isNull(paramCedingId) as [PARAM CEDING ID]';
          
        var queryC = 'SELECT checkNullNo(grpNo) as [GROUP NO], isNull(grpName) as [TREATY SHR GRP], checkNullNo(uwYear) as [UNDERWRITING YEAR], checkNullNo(itemNo) as [ITEM NO], isNull(itemName) as [TREATY ITEM NAME], negFmt(currency(carAmt)) as [CAR], '+
          'negFmt(currency(earAmt)) as [EAR], negFmt(currency(bpvAmt)) as [BPV], negFmt(currency(mbiAmt)) as [MBI], negFmt(currency(eeiAmt)) as [EEI],'+
          'negFmt(currency(dosAmt)) as [DOS], negFmt(currency(mlpAmt)) as [MLP], negFmt(currency(cecAmt)) as [CEC], negFmt(currency(totalAmt)) as [TOTAL AMT],'+
          'myFormat(paramDate) as [PARAM DATE], isNull(paramCurrency) as [PARAM CURRENCY], isNull(paramCedingId) as [PARAM CEDING ID]';
        	          
        var queryD = 'SELECT checkNullNo(grpNo) as [GROUP NO], isNull(grpName) as [TREATY SHR GRP], checkNullNo(uwYear) as [UNDERWRITING YEAR], negFmt(currency(carAmt)) as [CAR], '+
          'negFmt(currency(earAmt)) as [EAR], negFmt(currency(bpvAmt)) as [BPV], negFmt(currency(mbiAmt)) as [MBI], negFmt(currency(eeiAmt)) as [EEI],'+
          'negFmt(currency(dosAmt)) as [DOS], negFmt(currency(mlpAmt)) as [MLP], negFmt(currency(cecAmt)) as [CEC], negFmt(currency(totalAmt)) as [TOTAL AMT],'+
          'myFormat(paramDate) as [PARAM DATE], isNull(paramCurrency) as [PARAM CURRENCY], isNull(paramCedingId) as [PARAM CEDING ID]';
        
          this.ns.export('ACITR050B', queryB, data['listAcitr050b']);
          this.ns.export('ACITR050C', queryC, data['listAcitr050c']);
          this.ns.export('ACITR050D', queryD, data['listAcitr050d']);

        });
	}

}