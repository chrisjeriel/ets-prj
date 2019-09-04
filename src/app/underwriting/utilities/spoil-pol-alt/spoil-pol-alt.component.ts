import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService, MaintenanceService } from '@app/_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router } from '@angular/router';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';


@Component({
	selector: 'app-spoil-pol-alt',
	templateUrl: './spoil-pol-alt.component.html',
	styleUrls: ['./spoil-pol-alt.component.css']
})
export class SpoilPolAltComponent implements OnInit {
	@ViewChild('p') table: CustNonDatatableComponent;
	@ViewChild('spoil') spoil: CustNonDatatableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild('tabset') tabset: any;
	@ViewChild(ConfirmLeaveComponent) conleave : ConfirmLeaveComponent;

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
	searchArr			: any[] = Array(6).fill('');
	checkSpoilCd 		: number;
	loading				: boolean;
	dialogIcon			: string = '';
	dialogMessage		: string = '';
	cancelFlag			: boolean;
	valResult			: number;
	passEvent			: any;

	constructor(private underwritingService: UnderwritingService, private ns: NotesService,
		public modalService: NgbModal, private titleService: Title, private mtnService: MaintenanceService, private router:Router) { }

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
		console.log(param);
		var parameter;
		this.passData.tableData = [];

		if(param !== undefined){
			parameter = param;		
		}else{
			parameter = this.searchParams;
		}

		if(this.table) { this.table.loadingFlag = true; }

		this.underwritingService.getParListing(parameter)
		.subscribe(data => {
			this.passData.tableData = [];
			var rec = data['policyList'];
			rec = rec.filter(data => data.statusDesc.toUpperCase() === 'IN FORCE' || data.statusDesc.toUpperCase() === 'DISTRIBUTED')
					 .map(data => {data.riskName = data.project.riskName; return data;});
			this.passData.tableData = rec;
			this.table.refreshTable();
			console.log(rec);
			if(rec.length === 0){
				this.clearAll();
				this.getPolicyList();
				$('#polLov > #modalBtn').trigger('click');
			}else if(rec.length === 1){
				this.spoilPolRecord.policyNo = rec[0].policyNo;
				if(this.spoilPolRecord.line !== '' && this.spoilPolRecord.year !== '' && this.spoilPolRecord.seqNo !== '' && this.spoilPolRecord.coCode !== '' && this.spoilPolRecord.coSeriesNo !== '' && this.spoilPolRecord.altNo !== ''){
					this.getPolGenInfo();
				}
			}else{
				
			}
		});
	}

	show(){
		this.rowRec = {};
		$('#polLov > #modalBtn').trigger('click');
	}

	getSpoilList(){
		if(this.spoil){ this.spoil.loadingFlag = true; } 
		
		this.passDataSpoilageReason.tableData = [];	
		this.mtnService.getMtnSpoilageReason('','Y')
		.subscribe(data => {
			this.ns.lovLoader(this.passEvent,0);
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
			if(this.checkSpoilCd !== 1  && this.checkSpoilCd !== undefined){
				this.postBtnEnabled = false;
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

	onChangeReason(event?){
		this.passEvent = event;
		this.ns.lovLoader(this.passEvent,1);
		this.checkSpoilCd = 0;
		this.getSpoilList();
		if(this.spoilPolRecord.reason === '' || this.spoilPolRecord.reason === null){
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
		$('.dirty').addClass('ng-dirty');
	}

	onClickOkLov(){
		if(Object.keys(this.rowRec).length != 0){
			this.spoilPolRecord.reason  	= '';
			this.spoilPolRecord.reasonDesc 	= '';
			this.spoilPolRecord.user  		= '';
			this.spoilPolRecord.spoiledDate = '';
			this.postBtnEnabled 			= false;
			this.spoilPolRecord.policyNo = this.rowRec.policyNo;
			this.splitPolNo(this.spoilPolRecord.policyNo);
			this.getPolGenInfo();
			this.modalService.dismissAll();
			$('.dirty').addClass('ng-dirty ng-touched');
		}
	}

	searchQuery(searchParams){
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
		this.searchArr 						= Array(6).fill('');
		this.getPolicyList();
	}


	onClickPostSpoilage(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.valResult 	= 0; 
		this.warnMsg1 	= '';
		this.dialogIcon = '';
		var stats		= '';
		var inProg 		= false;
		var dist 		= false;
		var msgA 		= 'Policy/Alteration cannot be spoiled, creation of alteration connected to this record is on going.';
		var msgB 		= 'Policy with existing valid alteration cannot be spoiled.';

		console.log(this.spoilPolRecord.reason);
		if(this.spoilPolRecord.reason == '' || this.spoilPolRecord.reason == null){
			this.dialogIcon = 'error';
			$('app-sucess-dialog #modalBtn').trigger('click');
			$('.dirty').focus();
			$('.dirty').blur();
			this.cancelFlag = false;
		}else{
			this.underwritingService.getAlterationsPerPolicy(this.polId,'')
			.subscribe(data => {
				console.log(data);
				var rec = data['policyList'];
				rec.sort((a,b) => a.altNo - b.altNo);

				if(rec.length == 0){
					this.validPolicyAlt();
				}else{
					if(rec.some(i => i.statusDesc.toUpperCase() == 'IN PROGRESS') == true){
						this.warnMsg1 = msgA;
						this.showWarnLov();
					}else{
						this.warnMsg1 = msgB;
						this.showWarnLov();
					}
				}

				// for(var i=0;i<rec.length;i++){
				// 	if(parseInt(this.spoilPolRecord.altNo) === 0){
				// 		if(rec[i].statusDesc.toUpperCase() === 'DISTRIBUTED'){
				// 			dist = true;
				// 		}else if(rec[i].statusDesc.toUpperCase() === 'IN PROGRESS'){
				// 			inProg = true;
				// 		}
				// 	}else {
				// 		if(parseInt(this.spoilPolRecord.altNo) === rec[i].altNo){
				// 			if(rec[i+1] !== undefined && rec[i+1].statusDesc.toUpperCase() === 'IN PROGRESS'){
				// 				inProg = true;
				// 			}else{
				// 				this.validPolicyAlt();
				// 			}	
				// 		}
				// 	}
					
				// }

				// if(rec.length === 0){
				// 	this.validPolicyAlt();
				// }else{
				// 	if(inProg === true){
				// 		this.warnMsg1 = msgA;
				// 		this.showWarnLov();
				// 	}
				// 	if(dist === true && inProg === false){
				// 		this.warnMsg1 = msgB;
				// 		this.showWarnLov();
				// 	}
				// 	if(dist === false && inProg === false){
				// 		this.validPolicyAlt();
				// 	}
				// }

			});
		}

	}

	showWarnLov(){
		$('#warnMdl > #modalBtn').trigger('click');
	}

	validPolicyAlt(){

		const spoilStatus = 99 ; // status 99 = "SPOILED" in POL GEN INFO STATUS
		this.spoilPolRecord.user  		= JSON.parse(window.localStorage.currentUser).username;
		this.spoilPolRecord.spoiledDate = this.ns.toDateTimeString(0).split('T')[0];

		this.postSpoilage = {
			"policyId"		: this.polId,
			"spldUser"		: this.spoilPolRecord.user,
			"spoilCd"		: this.spoilPolRecord.reason,
			"status"		: spoilStatus,
			"updateUser"	: this.spoilPolRecord.user
		}

		this.underwritingService.updatePolGenInfoSpoilage(JSON.stringify(this.postSpoilage))
		.subscribe(data => {
			console.log(data);
			$('app-sucess-dialog #modalBtn').trigger('click');
			this.getPolicyList();
		});
	}

	onClickSave(){
		$('#confirm-save #modalBtn2').trigger('click');
	}

	onClickCancel(){
		this.cancelBtn.clickCancel();
	}

	search(key,ev) {
		this.spoilPolRecord.year		= (this.spoilPolRecord.year === '' || this.spoilPolRecord.year === null)?'':this.spoilPolRecord.year;
		this.spoilPolRecord.seqNo		= (this.spoilPolRecord.seqNo === '' || this.spoilPolRecord.seqNo === null)?'':this.spoilPolRecord.seqNo.padStart(5,'0');						
		this.spoilPolRecord.coCode		= (this.spoilPolRecord.coCode === '' || this.spoilPolRecord.coCode === null)?'':this.spoilPolRecord.coCode.padStart(3,'0');						
		this.spoilPolRecord.coSeriesNo	= (this.spoilPolRecord.coSeriesNo === '' || this.spoilPolRecord.coSeriesNo === null)?'':this.spoilPolRecord.coSeriesNo.padStart(4,'0');						
		this.spoilPolRecord.altNo		= (this.spoilPolRecord.altNo === '' || this.spoilPolRecord.altNo === null)?'':this.spoilPolRecord.altNo.padStart(3,'0');						

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

	onTabChange($event: NgbTabChangeEvent) {
		if($('.ng-dirty').length > 0 ){
			$event.preventDefault();
			const subject = new Subject<boolean>();
			const modal = this.modalService.open(ConfirmLeaveComponent,{
			        centered: true, 
			        backdrop: 'static', 
			        windowClass : 'modal-size'
			});
			modal.componentInstance.subject = subject;

			subject.subscribe(a=>{
			    if(a){
			        $('.ng-dirty').removeClass('ng-dirty');
			        this.tabset.select($event.nextId)
			    }
			})
	    }		
	}

}
