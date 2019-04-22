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
	@ViewChild('p') table: CustNonDatatableComponent;
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

	rowRec				: any;
	rowRecSpoil			: any;
	searchParams		: any[] = [];
	type				: string;
	postBtnEnabled		: boolean = false;
	reasonLovEnabled	: boolean = false;
	postSpoilage 		: any;
	polStatus			: any;
	polId				: any;
	warnMsg1			: string = '';
	warnMsg2			: string = '';
	warnMsg3			: string = '';
	searchArr			: any[] = Array(6).fill('');
	checkSpoilCd 		: number;


	constructor(private underwritingService: UnderwritingService, private ns: NotesService,private modalService: NgbModal, private titleService: Title, private mtnService: MaintenanceService) { }

	ngOnInit() {
		this.titleService.setTitle('Pol | Spoil Policy/Alteration');
		this.getPolicyList();
		this.getSpoilList();
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
			this.polStatus						 = rec.statusDesc;
			this.polId							 = rec.policyId;
		});
	}

	getPolicyList(param?){
		console.log('here 1');
		this.passData.tableData = [];
		this.searchParams = param;
		if(this.table) { this.table.loadingFlag = true; }
		this.underwritingService.getParListing(this.searchParams === undefined ? [] : this.searchParams)
		.subscribe(data => {
			this.passData.tableData = [];
			var rec = data['policyList'];
			rec = rec.filter(data => data.statusDesc.toUpperCase() === 'IN FORCE' || data.statusDesc.toUpperCase() === 'DISTRIBUTED')
					 .map(data => {data.riskName = data.project.riskName; return data;});
			this.passData.tableData = rec;
			this.table.refreshTable();

			if(rec.length === 0){
				console.log('NO DATA FOUND');
				if(this.spoilPolRecord.line !== null && this.spoilPolRecord.year !== null && this.spoilPolRecord.seqNo !== null && this.spoilPolRecord.coCode !== null && this.spoilPolRecord.coSeriesNo !== null && this.spoilPolRecord.altNo !== null ||
					this.spoilPolRecord.line !== '' && this.spoilPolRecord.year !== '' && this.spoilPolRecord.seqNo !== '' && this.spoilPolRecord.coCode !== '' && this.spoilPolRecord.coSeriesNo !== '' && this.spoilPolRecord.altNo !== ''){
					this.clearAll();
					this.getPolicyList();
					$('#polLov > #modalBtn').trigger('click');
				}
			}else{
				if(rec.length === 1){
					this.spoilPolRecord.policyNo = rec[0].policyNo;
					this.getPolGenInfo();
				}
			}			

		});
	}

	show(){
		$('#polLov > #modalBtn').trigger('click');
	}


	getSpoilList(){
		if(this.spoil){ this.spoil.loadingFlag = true; } 
		this.passDataSpoilageReason.tableData = [];	
		this.mtnService.getMtnSpoilageReason('')
		.subscribe(data => {
			this.passDataSpoilageReason.tableData = []
			console.log(data)
			var rec = data['spoilageReason'];

			for(let i of rec){	
				if(i.spoilCd === this.spoilPolRecord.reason){
					this.checkSpoilCd++;
					this.spoilPolRecord.reason = i.spoilCd;
					this.spoilPolRecord.reasonDesc = i.description;
				}
			}
			console.log(this.checkSpoilCd);
			if(this.checkSpoilCd !== 1  && this.checkSpoilCd !== undefined){
				this.spoilPolRecord.reason = '';
				this.spoilPolRecord.reasonDesc = '';
				this.passDataSpoilageReason.tableData = rec;
				this.spoil.refreshTable();
				this.showLovSpoil();
			}else{
				this.passDataSpoilageReason.tableData = rec;
				this.spoil.refreshTable();
			}
			
			
		});
	}

	showLovSpoil(){
		$('#spoilLov > #modalBtn').trigger('click');
	}

	onChangeReason(){
		this.checkSpoilCd = 0;
		this.getSpoilList();
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
		this.reasonLovEnabled				= false;
		this.getPolicyList();
	}

	onClickPostSpoilage(){
		const spoilStatus = 99 ; // status 99 = SPOILED in POL GEN INFO STATUS
		if(this.polStatus.toUpperCase() === 'IN FORCE' || this.polStatus.toUpperCase() === 'DISTRIBUTED'){
			this.spoilPolRecord.user  		= JSON.parse(window.localStorage.currentUser).username;
			this.spoilPolRecord.spoiledDate = this.ns.toDateTimeString(0).split('T')[0];

			this.postSpoilage = {
				"policyId"		: this.polId,
				"status"		: spoilStatus,
				"updateUser"	: this.spoilPolRecord.user
			}

			this.underwritingService.updatePolicyStatus(JSON.stringify(this.postSpoilage))
			.subscribe(data => {
				console.log(data);
				console.log('POSTING SPOILAGE SUCCESSFUL!');
			});
		}else{
			console.log('POSTING SPOILAGE FAILED');
		}
		
	}

	validatePolicy(){
		this.warnMsg1 = 'Policy/Alteration cannot be spoiled,';
		this.warnMsg2 = 'creation of alteration connected';
		this.warnMsg3 = 'to this record is on going.';
		$('#warnMdl > #modalBtn').trigger('click');
	}

	
	search(key,ev) {
	    var a = ev.target.value;

	    if(key === 'lineCd') {
	      this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
	    } else if(key === 'year') {
	      this.searchArr[1] = '%' + a + '%';
	    } else if(key === 'seqNo') {
	      this.searchArr[2] = '%' + a + '%';
	    } else if(key === 'cedingId') {
	      this.searchArr[3] = a === '' ? '%%' : '%' + a.padStart(3, '0') + '%';
	    } else if(key === 'coSeriesNo') {
	      this.searchArr[4] = '%' + a + '%';
	    } else if(key === 'altNo') {
	      this.searchArr[5] = a === '' ? '%%' : '%' + a;
	    }


	    if(this.searchArr.includes('')) {
	      this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
	    }

	    this.getPolicyList([{ key: 'policyNo', search: this.searchArr.join('-') }]);
  	}

}
