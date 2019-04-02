import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PolicyHoldCoverInfo } from '../../../_models/PolicyToHoldCover';
import { Title } from '@angular/platform-browser';
import { NotesService, UnderwritingService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
	selector: 'app-policy-to-hold-cover',
	templateUrl: './policy-to-hold-cover.component.html',
	styleUrls: ['./policy-to-hold-cover.component.css']
})
export class PolicyToHoldCoverComponent implements OnInit {

	private policyHoldCoverInfo: PolicyHoldCoverInfo;

	@ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

	constructor(private titleService: Title, private noteService: NotesService, private us: UnderwritingService, private modalService: NgbModal) { }

	policyListingData: any = {
		tableData: [],
		tHeader: ['Policy No.', 'Ceding Company', 'Insured', 'Risk'],
		dataTypes: ['text', 'text', 'text', 'text'],
		pageLength: 10,
		pagination: true,
		pageStatus: true,
		keys: ['policyNo','cedingName', 'insuredDesc', 'riskName']
	}

	polHoldCoverParams: any = {
		policyId: '',
		holdCovId: '',
		lineCd: '',
		holdCovYear: new Date().getFullYear(),
		holdCovSeqNo: '',
		holdCovRevNo: '',
		periodFrom: '',
		periodTo: '',
		compRefHoldCovNo: '',
		status: '',
		reqBy: '',
		reqDate: '',
		preparedBy: '',
		approvedBy: '',
		createUser: '',
		createDate: '',
		updateUser: '',
		updateDate: ''
	}
	periodFromDate: any = {
		date: '',
		time: ''
	}
	periodToDate: any = {
		date: '',
		time: ''
	}
	holdCoverNo: string = '';
	statusDesc: string = '';
	modalOpen: boolean = false;

	selectedPolicy: any;
	emptySelect: boolean = false;

	policyInfo: any = {
		policyId: 0,
		policyNo: '',
		cedingName: '',
		insuredDesc: '',
		riskName: ''
	}

	ngOnInit() {


	}
	test(event){
		console.log(event);
	}

	retrievePolHoldCov(policyId: string, policyNo: string){
		this.us.retrievePolHoldCover(policyId, '').subscribe((data: any)=>{
			console.log(data);
			this.polHoldCoverParams.policyId				= data.policy.holdCoverList[0].policyId;
			this.polHoldCoverParams.holdCovId				= data.policy.holdCoverList[0].holdCovId;
			this.polHoldCoverParams.lineCd					= data.policy.holdCoverList[0].lineCd;
			this.polHoldCoverParams.holdCovYear				= data.policy.holdCoverList[0].holdCovYear;
			this.polHoldCoverParams.holdCovSeqNo			= data.policy.holdCoverList[0].holdCovSeqNo;
			this.polHoldCoverParams.holdCovRevNo			= data.policy.holdCoverList[0].holdCovRevNo;
			this.polHoldCoverParams.periodFrom				= this.noteService.toDateTimeString(data.policy.holdCoverList[0].periodFrom);
			this.polHoldCoverParams.periodTo				= this.noteService.toDateTimeString(data.policy.holdCoverList[0].periodTo);
			this.polHoldCoverParams.compRefHoldCovNo		= data.policy.holdCoverList[0].compRefHoldCovNo;
			this.polHoldCoverParams.status					= data.policy.holdCoverList[0].status;
			this.polHoldCoverParams.reqBy					= data.policy.holdCoverList[0].reqBy;
			this.polHoldCoverParams.reqDate					= this.noteService.toDateTimeString(data.policy.holdCoverList[0].reqDate);
			this.polHoldCoverParams.preparedBy				= data.policy.holdCoverList[0].preparedBy;
			this.polHoldCoverParams.approvedBy				= data.policy.holdCoverList[0].approvedBy;
			this.polHoldCoverParams.createUser				= data.policy.holdCoverList[0].createUser;
			this.polHoldCoverParams.createDate				= this.noteService.toDateTimeString(data.policy.holdCoverList[0].createDate);
			this.polHoldCoverParams.updateUser				= data.policy.holdCoverList[0].updateUser;
			this.polHoldCoverParams.updateDate				= this.noteService.toDateTimeString(data.policy.holdCoverList[0].updateDate);
			this.statusDesc 								= data.policy.holdCoverList[0].statusDesc;
			this.holdCoverNo 								= data.policy.holdCoverList[0].holdCovNo;
			this.periodFromDate.date 						= this.polHoldCoverParams.periodFrom.split('T')[0];
			this.periodFromDate.time 						= this.polHoldCoverParams.periodFrom.split('T')[1];
			this.periodToDate.date 							= this.polHoldCoverParams.periodTo.split('T')[0];
			this.periodToDate.time 							= this.polHoldCoverParams.periodTo.split('T')[1];
			console.log(this.polHoldCoverParams);
		});
	}

	retrievePolListing(){
		this.table.loadingFlag = true;
		this.policyListingData.tableData = [];
		setTimeout(()=>{
			this.us.getParListing([{key: '', search: ''}]).subscribe((data: any) =>{
				console.log(data);
				if(data.policyList.length !== 0){
					for(var rec of data.policyList){
						this.policyListingData.tableData.push({
							policyId: rec.policyId,
							policyNo: rec.policyNo,
							cedingName: rec.cedingName,
							insuredDesc: rec.insuredDesc,
							riskName: rec.project.riskName,
							statusDesc: rec.statusDesc
						});
					}
					this.policyListingData.tableData = this.policyListingData.tableData.filter(a=> {return a.statusDesc === 'Expired' || a.statusDesc === 'On Hold Cover'});
					this.table.refreshTable();
				}
				this.modalOpen = true;
				this.table.loadingFlag = false;
			});
		}, 100);
		
	}

	onClickSave(){
		this.prepareParams();
		console.log(this.polHoldCoverParams);
		this.us.savePolHoldCover(this.polHoldCoverParams).subscribe((data: any)=>{
			console.log(data);
			this.holdCoverNo = data.polHoldCoverNo;
			this.polHoldCoverParams.holdCovId = data.polHoldCoverId;
			//get seq and rev no
			let generatedNum: string[] = data.polHoldCoverNo.split('-');
			this.polHoldCoverParams.holdCovSeqNo = parseInt(generatedNum[3]).toString();
			this.polHoldCoverParams.holdCovRevNo = parseInt(generatedNum[4]).toString();
			this.retrievePolHoldCov(this.policyInfo.policyId, this.holdCoverNo);
		});
	}

	prepareParams(){
		this.polHoldCoverParams.periodFrom = this.periodFromDate.date + 'T' + this.periodFromDate.time;
		this.polHoldCoverParams.periodTo = this.periodToDate.date + 'T' + this.periodToDate.time;
		this.polHoldCoverParams.preparedBy = JSON.parse(window.localStorage.currentUser).username;
		this.polHoldCoverParams.createUser = JSON.parse(window.localStorage.currentUser).username;
		this.polHoldCoverParams.updateUser = JSON.parse(window.localStorage.currentUser).username;
		this.polHoldCoverParams.createDate = this.noteService.toDateTimeString(0);
		this.polHoldCoverParams.updateDate = this.noteService.toDateTimeString(0);
	}

	onRowClick(data){
		this.selectedPolicy = data;
		this.selectedPolicy = this.selectedPolicy === null ? {} : this.selectedPolicy;
		if(Object.keys(this.selectedPolicy).length === 0){
			this.emptySelect = true;
		}else{
			this.emptySelect = false;
		}
	}

	openModal(){
		$('#lovMdl #modalBtn').trigger('click');
		this.selectedPolicy = null;
		console.log("openModal");
		//this.retrievePolListing();
	}

	selectPol(){
		console.log(this.selectedPolicy);
		this.policyInfo = this.selectedPolicy;
		this.modalService.dismissAll();
		this.polHoldCoverParams.policyId = this.policyInfo.policyId;
		this.polHoldCoverParams.lineCd = this.policyInfo.policyNo.split('-')[0];
		//if selected policy is already in hold cover
		if(this.policyInfo.statusDesc === 'On Hold Cover'){
			this.retrievePolHoldCov(this.policyInfo.policyId, this.policyInfo.policyNo);
		}
		//else clear all fields
		else{
			this.periodFromDate = {
				date: '',
				time: ''
			}
			this.periodToDate = {
				date: '',
				time: ''
			}
			this.statusDesc = '';
			this.holdCoverNo = '';
			this.polHoldCoverParams = {
										policyId: this.policyInfo.policyId,
										holdCovId: '',
										lineCd: this.policyInfo.policyNo.split('-')[0],
										holdCovYear: new Date().getFullYear(),
										holdCovSeqNo: '',
										holdCovRevNo: '',
										periodFrom: '',
										periodTo: '',
										compRefHoldCovNo: '',
										status: '',
										reqBy: '',
										reqDate: '',
										preparedBy: '',
										approvedBy: '',
										createUser: '',
										createDate: '',
										updateUser: '',
										updateDate: ''
									}
		}
	}

}
