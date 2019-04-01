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
		policyId: '8',
		holdCovId: '',
		lineCd: 'CAR',
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

	ngOnInit() {


	}
	test(event){
		console.log(event);
	}

	retrievePolHoldCov(policyId: string, policyNo: string){
		this.us.retrievePolHoldCover(policyId, '').subscribe((data: any)=>{
			console.log(data);
			this.statusDesc = data.policy.holdCoverList[0].statusDesc;
		});
	}

	retrievePolListing(){
		console.log("retrievePolListing");
		this.policyListingData.tableData = [];
		setTimeout(()=>{
			this.us.getParListing([{key: 'statusDesc', search: 'Expired'}]).subscribe((data: any) =>{
				console.log(data);
				if(data.policyList.length !== 0){
					for(var rec of data.policyList){
						this.policyListingData.tableData.push({
							policyNo: rec.policyNo,
							cedingName: rec.cedingName,
							insuredDesc: rec.insuredDesc,
							riskName: rec.project.riskName
						});
					}
					this.table.refreshTable();
				}
				this.modalOpen = true;
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
			this.retrievePolHoldCov('8', this.holdCoverNo);
		});
	}

	prepareParams(){
		this.polHoldCoverParams.periodFrom = this.periodFromDate.date + 'T' + this.periodFromDate.time + ':00';
		this.polHoldCoverParams.periodTo = this.periodToDate.date + 'T' + this.periodToDate.time + ':00';
		this.polHoldCoverParams.preparedBy = JSON.parse(window.localStorage.currentUser).username;
		this.polHoldCoverParams.createUser = JSON.parse(window.localStorage.currentUser).username;
		this.polHoldCoverParams.updateUser = JSON.parse(window.localStorage.currentUser).username;
		this.polHoldCoverParams.createDate = this.noteService.toDateTimeString(0);
		this.polHoldCoverParams.updateDate = this.noteService.toDateTimeString(0);
	}

	onRowClick(data){
		console.log(data);
	}

	openModal(){
		$('#lovMdl #modalBtn').trigger('click');
		console.log("openModal");
		//this.retrievePolListing();
	}

}
