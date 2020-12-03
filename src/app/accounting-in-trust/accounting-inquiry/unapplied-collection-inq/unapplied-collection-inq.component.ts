import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { NotesService, AccountingService, UserService, MaintenanceService } from '@app/_services';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';
import * as alasql from 'alasql';

@Component({
	selector: 'app-unapplied-collection-inq',
	templateUrl: './unapplied-collection-inq.component.html',
	styleUrls: ['./unapplied-collection-inq.component.css']
})
export class UnappliedCollectionInqComponent implements OnInit {
	@ViewChild('unappCollListTbl') unappCollListTbl: CustEditableNonDatatableComponent;
	@ViewChild('unappCollRealignmentTbl') unappCollRealignmentTbl: CustEditableNonDatatableComponent;
	@ViewChild("cedingComp") cedingCoLOV: CedingCompanyComponent;
	@ViewChild('currencyMdl') currencyMdl: MtnCurrencyCodeComponent;

	searchParams: any = {
		cedingId: '',
		cedingName: '',
		currCd: '',
		currency: ''
	}

	unappCollListData: any = {
		tableData: [],
		tHeader: ["Ceding ID", "Ceding Name","Entry Transaction No.","Unapplied Type","Item Description","Company Reference No.","Remarks","Currency", "Currency Rate", "Unapplied Amount","Applied Amount","Remaining Amount|| for Realignment"],
		dataTypes: ['text','text','text','text','text','text','text','text','percent','currency','currency','currency'],
		keys: ['cedingId', 'cedingAbbr', 'tranNo', 'transdtlName','itemName','refNo','remarks','currCd','currRate','totalUnapldAmt','totalApldAmt','balUnapldAmt'],
		pageLength: 15,
		uneditable: [true,true,true,true,true,true,true,true,true,true,true,true],
		//widths:[1,166,1,1,'auto',1,150,150,150,150],
		paginateFlag: true,
		infoFlag: true,
		searchFlag: true,
		pageID: 'unappCollListData',
		exportFlag: true,
		addFlag: false,
		deleteFlag: false,
		total: [null, null, null, null,null,null,null,null,'Total','totalUnapldAmt','totalApldAmt','balUnapldAmt'],
	}

	unappCollRealignmentData: any = {
		tableData: [],
		tHeader: ["Ceding ID", "Ceding Name","Item Description","Company Reference No.","Remarks","Transaction No.","Transaction Date","Transaction Type","Particulars","Currency","Currency Rate","Applied Amount","Local Amount","Return to Cedant","Remaining Amount|| for Realignment"],
		dataTypes: ['text','text','text','text','text','text','date','text','text','text','percent','currency','currency','text','currency'],
		keys: ['cedingId','cedingAbbr','itemName','refNo','remarks','tranNo','tranDate','tranType','particulars','currCd','currRate','paytAmt','localAmt','returnTag','balUnapldAmt'],
		pageLength: 15,
		uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
		//widths:[1,166,1,1,'auto',1,150,150,150,150],
		paginateFlag: true,
		infoFlag: true,
		searchFlag: true,
		pageID: 'unappCollRealignmentData',
		exportFlag: true,
		addFlag: false,
		deleteFlag: false,
		total: [null,null,null,null,null,null,null,null,null,null,'Total','paytAmt','localAmt',null,'balUnapldAmt'],
		tHeaderWithColspan:[{header: 'Record Details', span: 5},{header: 'Realignment Transaction Details', span: 9}, {header:'',span: 1}]
	}

	currentTab: string = '';

	constructor(private route: Router, private ts: Title, private us: UserService, private ns: NotesService, private as: AccountingService) { }

	ngOnInit() {
		this.ts.setTitle("Acct-IT | Unapplied Collection");
		this.us.emitModuleId("ACIT071");

		this.currentTab = 'unappCollListTab';
		this.getAcitUnappColInquiry();
	}

	getAcitUnappColInquiry() {
		if(this.currentTab == 'unappCollListTab') {
			setTimeout(() => {
				this.unappCollListTbl.refreshTable();
				this.unappCollListTbl.overlayLoader = true;
			}, 0);
		} else if(this.currentTab == 'unappCollRealignmentTab') {
			setTimeout(() => {
				this.unappCollRealignmentTbl.refreshTable();
				this.unappCollRealignmentTbl.overlayLoader = true;
			}, 0);
		}

		this.as.getAcitUnappColInquiry(this.searchParams).subscribe(data => {
			console.log(data);
			if(this.currentTab == 'unappCollListTab') {
				this.unappCollListData.tableData = data['unappliedColList'];
				this.unappCollListTbl.refreshTable();
			} else if(this.currentTab == 'unappCollRealignmentTab') {
				this.unappCollRealignmentData.tableData = data['unappliedColRealignmentList'];
				this.unappCollRealignmentTbl.refreshTable();
			}
		});
	}

	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			this.route.navigateByUrl('');
		}
	}

	onInnerTabChange(ev: NgbTabChangeEvent) {
		this.currentTab = ev.nextId;
		this.getAcitUnappColInquiry();
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

	export() {
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

		if(this.currentTab == 'unappCollListTab') {
			filename = 'UnappliedCollections'+currDate+'.xls';
			alasql('SELECT cedingId as [Ceding ID], cedingAbbr as [Ceding Name], tranNo as [Entry Transaction No.], transdtlName as [Unapplied Type], itemName as [Item Description], ' +
				   'isNull(refNo) as [Company Reference No.], isNull(remarks) as [Remarks], currCd as [Currency], currRate as [Currency Rate], totalUnapldAmt as [Unapplied Amount], totalApldAmt as [Applied Amount], balUnapldAmt as [Remaining Amount for Realignment] ' +
				   'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.unappCollListData.tableData]);
		} else if(this.currentTab == 'unappCollRealignmentTab') {
			filename = 'UnappliedCollectionsRealignment'+currDate+'.xls';
			alasql('SELECT cedingId as [Ceding ID], cedingAbbr as [Ceding Name], itemName as [Item Description], isNull(refNo) as [Company Reference No.], isNull(remarks) as [Remarks], tranNo as [Transaction No.], datetime(tranDate) as [Transaction Date], ' +
				   'tranType as [Transaction Type], particulars as [Particulars], currCd as [Currency], currRate as [Currency Rate], paytAmt as [Applied Amount], localAmt as [Local Amount], isNull(returnTag) as [Return to Cedant], balUnapldAmt as [Remaining Amount for Realignment] ' +
				   'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.unappCollRealignmentData.tableData]);
		}
	}

}
