import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService } from '../../../_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { environment } from '@environments/environment';
import * as alasql from 'alasql';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
	selector: 'app-pol-hold-cov-monitoring',
	templateUrl: './pol-hold-cov-monitoring.component.html',
	styleUrls: ['./pol-hold-cov-monitoring.component.css']
})
export class PolHoldCovMonitoringComponent implements OnInit {
	@ViewChild(CustNonDatatableComponent) table:CustNonDatatableComponent; 

	passData: any = {
		tableData: [],
		tHeader: ['Hold Cover No', 'Status', 'Ceding Company', 'Policy No', 'Risk', 'Insured', 'Period From', 'Period To', 'Co Ref Hold Cover No', 'Requested By', 'Request Date'],
		dataTypes: ["text","text","text","text","text","text","date","date","text","text","date"],
		resizable: [false, false, true, false, true, true, false, false, false, true, false],
		filters: [
		{ key: 'holdCovNo', 	title: 'Hold Cover No.', 	dataType: 'text'},
		{ key: 'status',    	title: 'Status',         	dataType: 'text'},
		{ key: 'cedingName',	title: 'Ceding Co',		 	dataType: 'text'},
		{ key: 'policyNo', 		title: 'Policy No',		 	dataType: 'text'},
		{ key: 'riskName',		title: 'Risk',			 	dataType: 'text'},
		{ key: 'insuredDesc',	title: 'Insured',		 	dataType: 'text'},
		{ keys: {
			from: 'periodFrom',
			to: 'periodTo'
		},					    title: 'Period',		 	dataType: 'datespan'},
		{ key: 'coRefHoldCovNo',title: 'CR Hold Cov No.',	dataType: 'text'},
		{ key: 'reqBy',title: 'Requested By',			 	dataType: 'text'},
		{ keys: {
			from: 'reqDateFrom',
			to: 'reqDateTo'
		},						title: 'Request Date',	 	dataType: 'datespan'},
		{ key: 'expiringInDays',title: 'Expires in (Days)',	dataType: 'expire'},

		],
		pageLength: 10,
		expireFilter: true, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, pagination: true, pageStatus: true,
		keys: ['holdCovNo','statusDesc','cedingName','policyNo','riskName',
		'insuredDesc','periodFrom','periodTo','compRefHoldCovNo','reqBy','reqDate'],
		exportFlag: true
	}
	searchParams: any[] = [];
	tableInfo:any;

	constructor(private underwritingService: UnderwritingService, private ns: NotesService, private titleService: Title,private router: Router, private location: Location) { }

	ngOnInit() {
		this.titleService.setTitle('Pol | Hold Cover Monitoring');
		this.retrieveHoldCovList();
	}

	retrieveHoldCovList(){
		this.underwritingService.getPolHoldCoverList(this.searchParams)
		.subscribe(data => {
			console.log(data);
			var rec = data['policyList'];
			for(let i of rec){
				if((i.holdCoverList[0].statusDesc).toUpperCase() !== 'CANCELLED'){
					this.passData.tableData.push({
						holdCovNo  			: i.holdCoverList[0].holdCovNo,
						statusDesc	   		: i.holdCoverList[0].statusDesc,
						cedingName 			: i.cedingName,
						policyNo   			: i.policyNo,
						riskName   			: i.project.riskName,
						insuredDesc			: i.insuredDesc,
						periodFrom 			: this.ns.toDateTimeString(i.holdCoverList[0].periodFrom),
						periodTo   			: this.ns.toDateTimeString(i.holdCoverList[0].periodTo),
						compRefHoldCovNo 	: i.holdCoverList[0].compRefHoldCovNo,
						reqBy	 			: i.holdCoverList[0].reqBy,
						reqDate  			: this.ns.toDateTimeString(i.holdCoverList[0].reqDate),
						createUser			: i.holdCoverList[0].createUser,
						createDate			: this.ns.toDateTimeString(i.holdCoverList[0].createDate),
						updateUser			: i.holdCoverList[0].updateUser,
						updateDate			: this.ns.toDateTimeString(i.holdCoverList[0].updateDate),
						approvedBy			: i.holdCoverList[0].approvedBy,
						preparedBy			: i.holdCoverList[0].preparedBy,
						status				: i.holdCoverList[0].status,
						policyId			: i.policyId,
						holdCovId			: i.holdCoverList[0].holdCovId

					});
				}
			}
			this.table.refreshTable();
		});
	}

	searchQuery(searchParams){
		this.searchParams = searchParams;
		this.passData.tableData = [];
		console.log(this.searchParams);
		this.retrieveHoldCovList();
	}

	export(){
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var currDate = mm + dd+ yyyy;
		var filename = 'PolHolCoverMonitoringList_'+currDate+'.xlsx'
		var mystyle = {
			headers:true, 
			column: {style:{Font:{Bold:"1"}}}
		};

		alasql.fn.datetime = function(dateStr) {
			var date = new Date(dateStr);
			return date.toLocaleString();
		};


		alasql('SELECT holdCovNo AS HoldCoverNo, statusDesc AS Status, cedingName AS CedingCompany, policyNo AS PolicyNo, riskName AS Risk, insuredDesc AS Insured, datetime(periodFrom) AS PeriodFrom, datetime(periodTo) AS PeriodTo, compRefHoldCovNo AS CompRefHoldCoverNo, reqBy AS RequestedBy, datetime(reqDate) AS RequestedDate INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
	}

	onRowClick(event){
		this.tableInfo = event;
	}
	onRowDblClick(event){
        var hcNo  = event.target.closest("tr").children[0].innerText;
        this.retSelectedPolHc(hcNo);
	}

	retSelectedPolHc(holdCovNo){
		this.underwritingService.getSelectedPolHc(holdCovNo)
		.subscribe(data => {
			var record 		=  data['policyList'][0];
			setTimeout(() => {
	            this.router.navigate(['/policy-holdcover', { tableInfo : JSON.stringify(record) , from: 'pol-hold-cov-monitoring' }], { skipLocationChange: true });
	            this.location.go('/policy-holdcover') // temporary, to display the correct url for pol-to-hold-cover
        	},100);
		});
	}

}
