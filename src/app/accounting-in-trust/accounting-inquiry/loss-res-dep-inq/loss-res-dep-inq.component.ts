import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { NotesService, AccountingService, UserService, MaintenanceService } from '@app/_services';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';
import * as alasql from 'alasql';
import { ModalComponent } from '@app/_components/common';

@Component({
	selector: 'app-loss-res-dep-inq',
	templateUrl: './loss-res-dep-inq.component.html',
	styleUrls: ['./loss-res-dep-inq.component.css']
})
export class LossResDepInqComponent implements OnInit {
	@ViewChild('lossResDepListTbl') lossResDepListTbl: CustEditableNonDatatableComponent;
	@ViewChild('unappCollRealignmentTbl') unappCollRealignmentTbl: CustEditableNonDatatableComponent;
	@ViewChild("cedingComp") cedingCoLOV: CedingCompanyComponent;
	@ViewChild('currencyMdl') currencyMdl: MtnCurrencyCodeComponent;
	@ViewChild("tranModal") tranModal: ModalComponent;
	@ViewChild("tranTable") tranTable: CustEditableNonDatatableComponent;

	searchParams: any = {
		from: '',
		cedingId: '',
		cedingName: '',
		currCd: '',
		currency: '',
		mdlCedingName: ''
	}

	lossResDepListData: any = {
		tableData: [],
		tHeader: ["Ceding ID", "Ceding Short Name","Ceding Company","Member","Membership Date","Currency","Total Loss Reserve Deposit","Due Loss Reserve Deposit"],
		dataTypes: ['text','text','text','test','date','text','currency','currency'],
		keys: ['cedingId', 'cedingAbbr', 'cedingName','membershipTag','membershipDate','currCd','lossresdep','lossresdepDue'],
		pageLength: 15,
		uneditable: [true,true,true,true,true,true,true,true],
		paginateFlag: true,
		infoFlag: true,
		searchFlag: true,
		pageID: 'lossResDepListData',
		exportFlag: true,
		addFlag: false,
		deleteFlag: false,
		genericBtn: 'View Payments',
		disableGeneric: true
	}

	passDataTran: any = {
		tableData: [],
		tHeader: ["Transaction No.", "Transaction Date", "Transaction Type", "Particulars", "Currency", "Currency Rate", "Loss Reserve Deposit", "Local Amount"],
		dataTypes:["text","date","text","text","text","percent","currency","currency"],
		keys: ['tranNo', 'tranDate', 'tranType', 'particulars', 'currCd', 'currRate', 'lossresdepPayt', 'lossresdepPaytLocal'],
		pageLength: 10,
		uneditable: [true,true,true,true,true,true,true,true],
	  	paginateFlag: true,
		infoFlag: true,
		searchFlag: true,
		pageID: 'passDataTran',
		exportFlag: true,
		total: [null,null,null,null,null,'Total','lossresdepPayt','lossresdepPaytLocal']
	}

	constructor(private route: Router, private ts: Title, private us: UserService, private ns: NotesService, private as: AccountingService) { }

	ngOnInit() {
		this.ts.setTitle("Acct-IT | Loss Reserve Deposits");
    	this.us.emitModuleId("ACIT069");

    	setTimeout(() => {
    		this.lossResDepListTbl.refreshTable();
    		this.lossResDepListTbl.overlayLoader = true;
    	}, 0);

    	this.getAcitLossResDepInquiry();
	}

	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			this.route.navigateByUrl('');
		}
	}

	getAcitLossResDepInquiry() {
		this.lossResDepListTbl.overlayLoader = true;
		this.searchParams.from = 'L';
		this.as.getAcitLossResDepInquiry(this.searchParams).subscribe(data => {
			this.lossResDepListData.tableData = data['lossResDepList'];
			this.lossResDepListTbl.refreshTable();
		});
	}

	setSelectedCedComp(data) {
		this.searchParams.cedingName = data.cedingName;
		this.searchParams.cedingId = data.cedingId;
		this.ns.lovLoader(data.ev, 0);
	}

	setCurrency(data) {
		this.searchParams.currCd = data.currencyCd;
		this.searchParams.currency = data.description;
		this.ns.lovLoader(data.ev, 0);
	}

	checkCode(ev, from) {
		this.ns.lovLoader(ev, 1);
		if(from == 'cedingId') {
			if(this.searchParams.cedingName != '') {
				this.cedingCoLOV.checkCode(null, event, undefined, this.searchParams.cedingName);
			} else {
				this.ns.lovLoader(ev, 0);
				this.searchParams.cedingId = '';
				this.searchParams.cedingName = '';
			}
		} else if(from == 'currCd') {
			if(this.searchParams.currCd != '') {
				this.currencyMdl.checkCode(this.searchParams.currCd, ev);
			} else {
				this.ns.lovLoader(ev, 0);
				this.searchParams.currCd = '';
				this.searchParams.currency = '';
			}
		}
	}

	onRowClick(data) {
		this.lossResDepListData.disableGeneric = data == null || data == '';
	}

	viewTransaction(data) {
		this.searchParams.mdlCedingName = this.lossResDepListTbl.indvSelect.cedingName;
		this.tranModal.openNoClose();
		this.tranTable.overlayLoader = true;

		var param = {
			from: 'P',
			cedingId: this.lossResDepListTbl.indvSelect.cedingId,
			currCd: this.lossResDepListTbl.indvSelect.currCd
		}

		this.as.getAcitLossResDepInquiry(param).subscribe(data => {
			this.passDataTran.tableData = data['lossResDepList'];
			this.tranTable.refreshTable();
		});
	}

	export(from) {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var hr = String(today.getHours()).padStart(2,'0');
		var min = String(today.getMinutes()).padStart(2,'0');
		var sec = String(today.getSeconds()).padStart(2,'0');
		var ms = today.getMilliseconds()
		var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
		var filename = '';
		var months = new Array("Jan", "Feb", "Mar", 
		  "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
		  "Oct", "Nov", "Dec");
		var mystyle = {
			headers:true, 
			column: {style:{Font:{Bold:"1"}}}
		};
		var cedingId = this.searchParams.cedingId;
		var cedingName = this.searchParams.cedingName;

		alasql.fn.datetime = function(d) {
				if(d == null){
		      return '';
		    }
		    var date = new Date(d);
		    var day = (date.getDate()<10)?"0"+date.getDate():date.getDate();
		    var mos = months[date.getMonth()];
		    return day+'-'+mos+'-'+date.getFullYear(); 
		};

		alasql.fn.isNull = function(n){
		  return n==null?'':n;
		};

		alasql.fn.cedingId = function(){
			return cedingId;
		}

		alasql.fn.cedingName = function(){
			return cedingName;
		}

		if(from == 'L') {
			filename = 'LossReserveDeposits_' + currDate + '.xls';
			alasql('SELECT cedingId as [Ceding ID], cedingAbbr as [Ceding Short Name], cedingName as [Ceding Company], membershipTag as [Member], ' +
				   'datetime(membershipDate) as [Membership Date], currCd as [Currency], lossresdep as [Total Loss Reserve Deposit], lossresdepDue as [Due Loss Reserve Deposit] ' +
				   'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.lossResDepListData.tableData]);
		} else if(from == 'P') {
			filename = 'LossResDepPayt_' + this.lossResDepListTbl.indvSelect.cedingId + '_' + currDate + '.xls';
			alasql('SELECT tranNo as [Transaction No.], datetime(tranDate) as [Transaction Date], tranType as [Transaction Type], particulars as [Particulars], ' +
				   'currCd as [Currency], currRate as [Currency Rate], lossresdepPayt as [Loss Reserve Deposit], lossresdepPaytLocal as [Local Amount] ' +
				   'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passDataTran.tableData]);
		}
	}

}
