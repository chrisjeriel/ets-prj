import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService, MaintenanceService } from '@app/_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
	selector: 'app-spoil-pol-alt',
	templateUrl: './spoil-pol-alt.component.html',
	styleUrls: ['./spoil-pol-alt.component.css']
})
export class SpoilPolAltComponent implements OnInit {
	@ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
	@ViewChild('spoil') spoil: CustNonDatatableComponent;

	passData : any = {
		tableData: [],
		tHeader:["Policy No", "Ceding Company", "Insured", "Risk"],
		dataTypes: ["text","text","text","text"],
		pageLength: 10,
		resizable: [false,false,false,false],
		tableOnly: false,
		keys: ['policyNo','cedingName','insuredDesc','riskName'],
		pageStatus: true,
		pagination: true,
		filters: [
			{key: 'policyNo', title: 'Policy No',dataType: 'seq'},
			{key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
			{key: 'insuredDesc',title: 'Insured',dataType: 'text'},
			{key: 'riskName',title: 'Risk',dataType: 'text'},
		],
		colSize: ['', '250px', '250px', '250px'],
		pageID: 'policyList101'
	};

	passDataSpoilageReason : any = {
		tableData: [],
		tHeader:["Spoil", "Description"],
		dataTypes: ["text","text"],
		pageLength: 10,
		resizable: [false,false],
		tableOnly: false,
		keys: ['spoilCd','description'],
		pageStatus: true,
		pagination: true,
		filters: [
			{key: 'spoilCd', title: 'Spoil',dataType: 'text'},
			{key: 'description',title: 'Description',dataType: 'text'}
		],
		colSize: ['', '250px'],
		pageID: 'spoilList101'
	};

	spoilPolRecord : any = {
		policyNo  		 : null,
		line		 	 : null,
		year		 	 : null,
		seqNo		 	 : null,
		coCode		 	 : null,
		coSeriesNo	 	 : null,
		altNo		 	 : null,
		cedingName		 : null,
		insuredDesc		 : null,
		riskName		 : null,
		inceptDate	 	 : null,
		expiryDate		 : null,
		issueDate		 : null,
		distDate		 : null,
		effDate			 : null,
		acctDate		 : null,
		user			 : null,
		spoiledDate		 : null,
		reason			 : null,
		reasonDesc		 : null
	}

	rowRec			: any;
	rowRecSpoil		: any;
	searchParams	: any[] = [];
	type			: string;
	postBtnEnabled	: boolean = false;
	reasonLovEnabled: boolean = false;

	constructor(private underwritingService: UnderwritingService, private ns: NotesService,private modalService: NgbModal, private titleService: Title, private mtnService: MaintenanceService) { }

	ngOnInit() {
		this.titleService.setTitle('Pol | Spoil Policy/Alteration');
	}

	getPolGenInfo(){
		this.underwritingService.getPolGenInfo('',this.spoilPolRecord.policyNo)
		.subscribe(data => {
			console.log(data);
			var rec = data['policy'];
			this.splitPolNo(rec.policyNo);
			this.spoilPolRecord.policyNo 		 = rec.policyNo;
			this.spoilPolRecord.cedingName		 = rec.cedingName;
			this.spoilPolRecord.insuredDesc		 = rec.insuredDesc;
			this.spoilPolRecord.riskName		 = rec.project.riskName;
			this.spoilPolRecord.inceptDate	 	 = this.ns.toDateTimeString(rec.inceptDate).split('T')[0];
			this.spoilPolRecord.expiryDate		 = this.ns.toDateTimeString(rec.expiryDate).split('T')[0];
			this.spoilPolRecord.issueDate		 = this.ns.toDateTimeString(rec.issueDate).split('T')[0];
			this.spoilPolRecord.distDate 		 = this.ns.toDateTimeString(rec.distDate).split('T')[0];
			this.spoilPolRecord.effDate			 = this.ns.toDateTimeString(rec.effDate).split('T')[0];
			this.spoilPolRecord.acctDate 		 = this.ns.toDateTimeString(rec.acctDate).split('T')[0];
			this.type 							 = "date";
			this.reasonLovEnabled				 = true;
		});
	}

	getPolicyList(){
		this.table.loadingFlag = true;
		this.passData.tableData = [];
		$('#polLov > #modalBtn').trigger('click');
		this.underwritingService.getParListing(this.searchParams)
		.subscribe(data => {
			this.passData.tableData = [];
			console.log(data);
			var rec = data['policyList'];
			for(let i of rec){
				this.passData.tableData.push({
					policyNo		: i.policyNo,
					cedingName		: i.cedingName,
					insuredDesc		: i.insuredDesc,
					riskName		: i.project.riskName
				});
			}
			this.table.refreshTable();
		});
	}

	getSpoilList(){
		this.spoil.loadingFlag = true;
		this.passDataSpoilageReason.tableData = [];	
		$('#spoilLov > #modalBtn').trigger('click')
		this.mtnService.getMtnSpoilageReason('')
		.subscribe(data => {
			this.passDataSpoilageReason.tableData = []
			console.log(data)
			var rec = data['spoilageReason'];
			this.passDataSpoilageReason.tableData = rec
			this.spoil.refreshTable()
		});
	}

	onChangeReason(){
		if(this.spoilPolRecord.reasonDesc === '' || this.spoilPolRecord.reasonDesc === null){
			this.postBtnEnabled = false;
		}else{
			this.postBtnEnabled = true;
		}
	}

	onClickOkSpoil(){
		this.modalService.dismissAll();
		this.spoilPolRecord.reason 		= this.rowRecSpoil.spoilCd;
		this.spoilPolRecord.reasonDesc 	= this.rowRecSpoil.description;
		this.onChangeReason();
	}

	onClickOkLov(){
		this.spoilPolRecord.policyNo = this.rowRec.policyNo;
		this.splitPolNo(this.spoilPolRecord.policyNo);
		this.getPolGenInfo();
		this.modalService.dismissAll();
	}

	searchQuery(searchParams){
		console.log(searchParams[0].search);
		this.searchParams = searchParams;
		this.passData.tableData = [];
		this.getPolicyList();
	}

	onClickCancelLov(){
		this.modalService.dismissAll();
	}

	onRowClick(event){
		this.rowRec = event;
	}

	onRowClickSpoil(event){
		this.rowRecSpoil = event;
	}

	splitPolNo(polNo){
		var polNo  = polNo.split('-');
		this.spoilPolRecord.line 		= polNo[0];
		this.spoilPolRecord.year		= polNo[1];
		this.spoilPolRecord.seqNo		= polNo[2];
		this.spoilPolRecord.coCode		= polNo[3];
		this.spoilPolRecord.coSeriesNo	= polNo[4];
		this.spoilPolRecord.altNo		= polNo[5];
	}

	clearAll(){
		this.spoilPolRecord.policyNo  		= '';
		this.spoilPolRecord.line		 	= '';
		this.spoilPolRecord.year		 	= '';
		this.spoilPolRecord.seqNo		 	= '';
		this.spoilPolRecord.coCode		 	= '';
		this.spoilPolRecord.coSeriesNo	 	= '';
		this.spoilPolRecord.altNo		 	= '';
		this.spoilPolRecord.cedingName		= '';
		this.spoilPolRecord.insuredDesc		= '';
		this.spoilPolRecord.riskName		= '';
		this.spoilPolRecord.inceptDate	 	= '';
		this.spoilPolRecord.expiryDate		= '';
		this.spoilPolRecord.issueDate		= '';
		this.spoilPolRecord.distDate		= '';
		this.spoilPolRecord.effDate			= '';
		this.spoilPolRecord.acctDate		= '';
		this.spoilPolRecord.user			= '';
		this.spoilPolRecord.spoiledDate		= '';
		this.spoilPolRecord.reason			= '';
		this.spoilPolRecord.reasonDesc		= '';
		this.type 							= "text";
		this.postBtnEnabled					= false;
	}

}
