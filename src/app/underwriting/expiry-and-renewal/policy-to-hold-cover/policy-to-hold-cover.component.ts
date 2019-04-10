import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { PolicyHoldCoverInfo } from '../../../_models/PolicyToHoldCover';
import { Title } from '@angular/platform-browser';
import { NotesService, UnderwritingService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { PrintModalComponent } from '@app/_components/common/print-modal/print-modal.component';
import { FormsModule }   from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-policy-to-hold-cover',
	templateUrl: './policy-to-hold-cover.component.html',
	styleUrls: ['./policy-to-hold-cover.component.css']
})
export class PolicyToHoldCoverComponent implements OnInit {

	private policyHoldCoverInfo: PolicyHoldCoverInfo;

	@ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	//@ViewChild(PrintModalComponent) print : PrintModalComponent;
	@ViewChild('myForm') form:any;

	constructor(private titleService: Title, private noteService: NotesService, private us: UnderwritingService, private modalService: NgbModal, private router: Router) { }

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
	isType: boolean = false;
	isIncomplete: boolean = true;
	noDataFound: boolean = false;

	selectedPolicy: any;
	emptySelect: boolean = false;

	policyInfo: any = {
		policyId: 0,
		policyNo: '',
		cedingName: '',
		insuredDesc: '',
		riskName: ''
	}

	dialogIcon: string = '';
	dialogMessage: string = '';
	cancelFlag: boolean = false;

	authorization: string = 'UNAUTHORIZED';

	tempPolNo: string[] = ['','','','','',''];

	ngOnInit() {
		//set default report type for Hold Cover Letter
		//this.print.selectedReport = 'QUOTER012';
		//this.print.reports = true;
		//console.log(this.print.reports);
	}

	test(content){
		/*console.log(event);
		$('#printModalBtn').trigger('click');*/
		this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
	}

	showPrintDialog(event){
		console.log(event);
	}

	retrievePolHoldCov(policyId: string, policyNo: string){
		this.us.retrievePolHoldCover(policyId, '').subscribe((data: any)=>{
			console.log(data);
			for(let rec of data.policy.holdCoverList){
				if(rec.status !== 'X'){
					this.polHoldCoverParams.policyId				= rec.policyId;
					this.polHoldCoverParams.holdCovId				= rec.holdCovId;
					this.polHoldCoverParams.lineCd					= rec.lineCd;
					this.polHoldCoverParams.holdCovYear				= rec.holdCovYear;
					this.polHoldCoverParams.holdCovSeqNo			= rec.holdCovSeqNo;
					this.polHoldCoverParams.holdCovRevNo			= rec.holdCovRevNo;
					this.polHoldCoverParams.periodFrom				= this.noteService.toDateTimeString(rec.periodFrom);
					this.polHoldCoverParams.periodTo				= this.noteService.toDateTimeString(rec.periodTo);
					this.polHoldCoverParams.compRefHoldCovNo		= rec.compRefHoldCovNo;
					this.polHoldCoverParams.status					= rec.status;
					this.polHoldCoverParams.reqBy					= rec.reqBy;
					this.polHoldCoverParams.reqDate					= this.noteService.toDateTimeString(rec.reqDate);
					this.polHoldCoverParams.preparedBy				= rec.preparedBy;
					this.polHoldCoverParams.approvedBy				= rec.approvedBy;
					this.polHoldCoverParams.createUser				= rec.createUser;
					this.polHoldCoverParams.createDate				= this.noteService.toDateTimeString(rec.createDate);
					this.polHoldCoverParams.updateUser				= rec.updateUser;
					this.polHoldCoverParams.updateDate				= this.noteService.toDateTimeString(rec.updateDate);
					this.statusDesc 								= rec.statusDesc;
					this.holdCoverNo 								= rec.holdCovNo;
				}
			}
			
			this.periodFromDate.date 						= this.polHoldCoverParams.periodFrom.split('T')[0];
			this.periodFromDate.time 						= this.polHoldCoverParams.periodFrom.split('T')[1];
			this.periodToDate.date 							= this.polHoldCoverParams.periodTo.split('T')[0];
			this.periodToDate.time 							= this.polHoldCoverParams.periodTo.split('T')[1];
			console.log(this.polHoldCoverParams);
			this.isIncomplete = false;
		});
	}

	retrievePolListing(){
		/*this.tempPolNo[1] = this.tempPolNo[1] === '' ? ' ' : this.tempPolNo[1];
		this.tempPolNo[2] = this.tempPolNo[2] === '' ? ' ' : this.tempPolNo[2];
		this.tempPolNo[3] = this.tempPolNo[3] === '' ? ' ' : this.tempPolNo[3];
		this.tempPolNo[4] = this.tempPolNo[4] === '' ? ' ' : this.tempPolNo[4];
		this.tempPolNo[5] = this.tempPolNo[5] === '' ? ' ' : this.tempPolNo[5];*/
		this.table.loadingFlag = true;
		this.policyListingData.tableData = [];
		console.log(this.tempPolNo.join().replace(/,/g, '%-%'));
		console.log(this.noDataFound);
		setTimeout(()=>{
			this.us.getParListing([{key: 'policyNo', search: this.noDataFound ? '' : this.tempPolNo.join().replace(/,/g, '%')}]).subscribe((data: any) =>{
				console.log(data);
				if(data.policyList.length !== 0){
					this.noDataFound = false;
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
					if(this.isType && !this.isIncomplete){
						this.isIncomplete = false;
						this.policyInfo 					= this.policyListingData.tableData[0];
						this.polHoldCoverParams.policyId 	= this.policyInfo.policyId;
						this.polHoldCoverParams.lineCd 		= this.policyInfo.policyNo.split('-')[0];
						//if selected policy is already in hold cover
						if(this.policyInfo.statusDesc === 'On Hold Cover'){
							this.retrievePolHoldCov(this.policyInfo.policyId, this.policyInfo.policyNo);
						}
					}
				}else{
					this.noDataFound = true;
					this.policyListingData.tableData = [];
					if(this.isType){
						this.clearHcFields();
						this.policyInfo.cedingName = '';
						this.policyInfo.insuredDesc = '';
						this.policyInfo.riskName = '';
						this.policyInfo.statusDesc = '';
						//this.tempPolNoContainer = ['','','','','',''];
						setTimeout(()=>{
							this.openModal();
						}, 100);
					}
				}
				this.table.refreshTable();
				this.modalOpen = true;
				this.table.loadingFlag = false;
			});
		}, 100);
		
	}

	onClickSave(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
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
			this.dialogIcon = '';
			this.dialogMessage = '';
			$('app-sucess-dialog #modalBtn').trigger('click');
			this.form.control.markAsPristine();
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
		this.isType = false;
		//this.tempPolNo[0] = this.tempPolNo[0].length === 0 ? ' '
		$('#lovMdl #modalBtn').trigger('click');
		this.selectedPolicy = null;
		console.log("openModal");
		this.retrievePolListing();
	}

	selectPol(){
		this.isIncomplete = false;
		this.noDataFound = false;
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
			this.clearHcFields();
		}
	}

	onClickCancel(){
		$('#cancelModal > #modalBtn').trigger('click');
	}
	//cancel hold cover
	cancelHoldCover(){
		let params = {
			policyId: this.policyInfo.policyId,
			holdCovId: this.polHoldCoverParams.holdCovId,
			updateUser: JSON.parse(window.localStorage.currentUser).username,
			updateDate: this.noteService.toDateTimeString(0)
		}

		this.us.updatePolHoldCoverStatus(params).subscribe((data: any)=>{
			console.log(data);
		});
		this.clearHcFields();
	}

	clearHcFields(){
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


	onClickSaveBtn(){
		if(this.policyInfo.policyNo === '' || this.policyInfo.cedingName === '' || this.policyInfo.insuredDesc === '' ||
		   this.policyInfo.riskName === '' || this.policyInfo.policyId === 0 || this.periodFromDate.date === '' ||
		   this.periodFromDate.time === '' || this.periodToDate.date === '' || this.periodToDate.time === '' ||
		   this.polHoldCoverParams.reqBy === '' || this.polHoldCoverParams.reqDate === '' || this.polHoldCoverParams.compRefHoldCovNo === ''){

				this.dialogMessage = 'Please fill all required fields';
				this.dialogIcon = 'info';
				$('app-sucess-dialog #modalBtn').trigger('click');
		}else{
			$('#confirm-save #modalBtn2').trigger('click');
		}
	}

	onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('');
  		} 
  	}

  	approve(){
  		//do something
  		if(this.authorization === 'UNAUTHORIZED'){
  			this.statusDesc = 'Pending Approval';
  		}else if(this.authorization === 'AUTHORIZED'){
  			this.statusDesc = 'Approved';
  		}
  	}

  	policySearchParams(data:string, key:string){
  		this.isType = true;

  		if(key === 'lineCd'){
  			this.tempPolNo[0] = data.toUpperCase();
  		}else if(key === 'year'){
  			this.tempPolNo[1] = data;
  		}else if(key === 'seqNo'){
  			this.tempPolNo[2] = data;
  		}else if(key === 'cedingId'){
  			this.tempPolNo[3] = data;
  		}else if(key === 'coSeriesNo'){
  			this.tempPolNo[4] = data;
  		}else if(key === 'altNo'){
  			this.tempPolNo[5] = data;
  		}
  	}

  	checkPolParams(){
  		//if(this.policyInfo.policyNo.length === 0){
	  		if(this.tempPolNo[0].length !== 0 &&
	  		   this.tempPolNo[1].length !== 0 &&
	  		   this.tempPolNo[2].length !== 0 &&
	  		   this.tempPolNo[3].length !== 0 &&
	  		   this.tempPolNo[4].length !== 0 &&
	  		   this.tempPolNo[5].length !== 0){
	  			console.log('filled');
	  			this.isIncomplete = false;
	  			this.retrievePolListing();
	  		}else{
	  			this.isIncomplete = true;
	  			this.clearHcFields();
				this.policyInfo.cedingName = '';
				this.policyInfo.insuredDesc = '';
				this.policyInfo.riskName = '';
				this.policyInfo.statusDesc = '';
	  			console.log('not filled');
	  		}
  		//}
  	}

}
