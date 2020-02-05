import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { PolicyHoldCoverInfo } from '../../../_models/PolicyToHoldCover';
import { Title } from '@angular/platform-browser';
import { NotesService, UnderwritingService, PrintService } from '@app/_services';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { PrintModalComponent } from '@app/_components/common/print-modal/print-modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { NgForm }   from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // ARNEILLE DATE: Apr.10, 2019 

@Component({
	selector: 'app-policy-to-hold-cover',
	templateUrl: './policy-to-hold-cover.component.html',
	styleUrls: ['./policy-to-hold-cover.component.css']
})
export class PolicyToHoldCoverComponent implements OnInit {

	private policyHoldCoverInfo: PolicyHoldCoverInfo;
	private userName: string = JSON.parse(window.localStorage.currentUser).username;

	@ViewChild(LoadingTableComponent) table : LoadingTableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	//@ViewChild(PrintModalComponent) print : PrintModalComponent;
	@ViewChild('myForm') form:NgForm;
	@ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

	constructor(private titleService: Title, private noteService: NotesService, private us: UnderwritingService, public modalService: NgbModal, private router: Router,
			    private activatedRoute: ActivatedRoute, private ps:PrintService) { }

	policyListingData: any = {
		tableData: [],
		tHeader: ['Policy No.', 'Ceding Company', 'Insured', 'Risk'],
	 	sortKeys : ['POLICY_NO','CEDING_NAME','INSURED_DESC','RISK_NAME'],
		dataTypes: ['text', 'text', 'text', 'text'],
		pageLength: 10,
		pagination: true,
		pageStatus: true,
		keys: ['policyNo','cedingName', 'insuredDesc', 'riskName'],
		filters: [
		  {
		      key: 'policyNo',
		      title: 'Policy No.',
		      dataType: 'text'
		  },
		  {
		      key: 'cedingName',
		      title: 'Ceding Company',
		      dataType: 'text'
		  },
		  {
		      key: 'insuredDesc',
		      title: 'Insured',
		      dataType: 'text'
		  },
		  {
		      key: 'riskName',
		      title: 'Risk',
		      dataType: 'text'
		  },
		],
	}

	searchParams: any = {
        statusArr:['2','3','4'],
        'paginationRequest.count':10,
        'paginationRequest.position':1,   
        altNo:0    
    };


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
	approveType: string = '';
	printType: string ;
	modalOpen: boolean = false;
	isType: boolean = false;
	isIncomplete: boolean = true;
	noDataFound: boolean = false;
	isForViewing: boolean = false;
	isApproval: boolean = false;
	isReleasing: boolean = false;
	isModify: boolean = false;
	loading: boolean = false;
	approveLoading: boolean = false;

	btnDisabled: boolean = false; //button for print

	selectedPolicy: any;
	emptySelect: boolean = false;

	policyInfo: any = {
		policyId: 0,
		policyNo: '',
		cedingName: '',
		insuredDesc: '',
		riskName: '',
		totalSi: 0
	}

	dialogIcon: string = '';
	dialogMessage: string = '';
	destination: string = 'SCREEN';
	cancelFlag: boolean = false;

	authorization: string = '';

	tempPolNo: string[] = ['','','','','',''];
	approveList: any[] = [];

	private sub: any;			// ARNEILLE DATE: Apr.10, 2019
	fromHcMonitoring: any;		// ARNEILLE DATE: Apr.10, 2019

	cancelBtnDisabledStatus: string[] = ['3','4','5','6', ''];
	approveBtnDisabledStatus: string[] = ['3','4','5','6', ''];
	saveBtnDisabledStatus: string[] = ['2','3','4','5','6'];

	fromFilter:boolean = false;

	ngOnInit() {
		this.printType = 'SCREEN';
		console.log(this.userName);
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.fromHcMonitoring = params['tableInfo'];
		});

		if(this.fromHcMonitoring === '' || this.fromHcMonitoring === null || this.fromHcMonitoring === undefined){
		}else{
			this.policyInfo.policyNo 					= JSON.parse(this.fromHcMonitoring).policyNo;
			this.policyInfo.policyId 					= JSON.parse(this.fromHcMonitoring).policyId;
			this.policyInfo.cedingName 					= JSON.parse(this.fromHcMonitoring).cedingName;
			this.policyInfo.insuredDesc 				= JSON.parse(this.fromHcMonitoring).insuredDesc;
			this.policyInfo.riskName 					= JSON.parse(this.fromHcMonitoring).riskName;
			this.holdCoverNo 							= JSON.parse(this.fromHcMonitoring).holdCovNo;
			this.periodFromDate.date 					= JSON.parse(this.fromHcMonitoring).periodFrom.split('T')[0];
			this.periodFromDate.time 					= JSON.parse(this.fromHcMonitoring).periodFrom.split('T')[1];
			this.periodToDate.date	 					= JSON.parse(this.fromHcMonitoring).periodTo.split('T')[0];
			this.periodToDate.time 						= JSON.parse(this.fromHcMonitoring).periodTo.split('T')[1];
			this.polHoldCoverParams.reqBy 				= JSON.parse(this.fromHcMonitoring).reqBy;
			this.polHoldCoverParams.reqDate 			= JSON.parse(this.fromHcMonitoring).reqDate === null ? null : JSON.parse(this.fromHcMonitoring).reqDate.split('T')[0];
			this.polHoldCoverParams.compRefHoldCovNo 	= JSON.parse(this.fromHcMonitoring).compRefHoldCovNo;
			this.polHoldCoverParams.status				= JSON.parse(this.fromHcMonitoring).status;
			this.statusDesc 							= JSON.parse(this.fromHcMonitoring).statusDesc;
			this.polHoldCoverParams.preparedBy 			= JSON.parse(this.fromHcMonitoring).preparedBy;
			this.polHoldCoverParams.approvedBy 			= JSON.parse(this.fromHcMonitoring).approvedBy;
			this.polHoldCoverParams.holdCovId			= JSON.parse(this.fromHcMonitoring).holdCovId;

			this.isIncomplete = false;
			this.tempPolNo = this.policyInfo.policyNo.split('-');
			this.retrievePolHoldCov(this.policyInfo.policyId, this.policyInfo.policyNo, this.polHoldCoverParams.holdCovId);
		}
	}

	autoPeriodTo(event){
		if(event.length !== 0){
			let date = new Date(event);
			date.setDate(date.getDate() + 30);
			this.periodToDate.date = this.noteService.toDateTimeString(date).split('T')[0];
			this.periodToDate.time = this.noteService.toDateTimeString(date).split('T')[1];
			this.periodFromDate.time = this.noteService.toDateTimeString(date).split('T')[1];
		}
	}

	test(content){
		this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
		//this.approveListMethod(this.policyInfo.policyId);
	}

	showPrintDialog(event){
	}

	approveListMethod(policyId: string){
		//this.approveLoading = true;
		this.us.retrievePolicyApprover(policyId).subscribe((data: any) =>{
			this.approveList = data.approverList;
			console.log(this.approveList);
			for(let names of this.approveList){
				if(this.userName == names.userId){
					this.authorization = this.userName;
				}
			}
			this.approveLoading = false;
		},
		(error)=>{
			this.approveLoading = false;
		});
	}

	retrievePolHoldCov(policyId: string, policyNo: string, holdCovId: string, save?){
		//this.approveListMethod(policyId);
		if(save === undefined){
			this.loading = true;
		}
		this.us.retrievePolHoldCover(policyId,'', holdCovId).subscribe((data: any)=>{
			console.log(data.policy);
			for(let rec of data.policy.holdCoverList){
				//if(rec.status !== '6' && rec.status !== '5'){
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
					this.polHoldCoverParams.reqDate					= rec.reqDate === null ? null : this.noteService.toDateTimeString(rec.reqDate);
					this.polHoldCoverParams.preparedBy				= rec.preparedBy;
					this.polHoldCoverParams.approvedBy				= rec.approvedBy;
					this.polHoldCoverParams.createUser				= rec.createUser;
					this.polHoldCoverParams.createDate				= this.noteService.toDateTimeString(rec.createDate);
					this.polHoldCoverParams.updateUser				= rec.updateUser;
					this.polHoldCoverParams.updateDate				= this.noteService.toDateTimeString(rec.updateDate);
					this.statusDesc 								= rec.statusDesc;
					this.holdCoverNo 								= rec.holdCovNo;
				//}
			}

			if(!this.approveBtnDisabledStatus.includes(this.polHoldCoverParams.status)){
				this.approveListMethod(this.polHoldCoverParams.policyId);
			}

			if(this.fromHcMonitoring === '' || this.fromHcMonitoring === null || this.fromHcMonitoring === undefined){
				this.periodFromDate.date 						= this.polHoldCoverParams.periodFrom.split('T')[0];
				this.periodFromDate.time 						= this.polHoldCoverParams.periodFrom.split('T')[1];
				this.periodToDate.date 							= this.polHoldCoverParams.periodTo.split('T')[0];
				this.periodToDate.time 							= this.polHoldCoverParams.periodTo.split('T')[1];
			}

			this.isIncomplete = false;
			if(this.isReleasing){
				this.isForViewing = true;
			}else{
				this.isForViewing = false;	
			}
			this.btnDisabled = false;
			if(this.polHoldCoverParams.status === '2' && !this.isReleasing){
				$('#modificationModal > #modalBtn').trigger('click');
			}else if(this.polHoldCoverParams.status === '2' && this.isReleasing){
				this.isReleasing = false;
			}
			this.loading = false;

			if(this.polHoldCoverParams.status == '5' || this.polHoldCoverParams.status == '6'){
				this.isForViewing = true;
			}

			this.form.control.markAsPristine();
			this.noteService.formGroup.markAsPristine();
		});
	}

	retrievePolListing(){
		//this.table.loadingFlag = true;
		//setTimeout(()=>{
			//[{key: 'policyNo', search: this.noDataFound ? '' : this.tempPolNo.join('%-%')}]
			if(this.fromFilter){
				this.fromFilter = false;
			}
			else if(!this.noDataFound){
		      this.policyListingData.filters[0].search = this.tempPolNo.join('%-%');
		      this.policyListingData.filters[0].enabled =true;
		      this.searchParams.policyNo = this.tempPolNo.join('%-%');
		    }else{
		    	this.policyListingData.filters[0].search = '';
		    	this.policyListingData.filters[0].enabled =false;
		    	this.searchParams.policyNo = '';
		    }

			this.us.newGetParListing(this.searchParams).subscribe((data: any) =>{
				//data.policyList = data.policyList === null ? [] : data.policyList.filter(a=>{return parseInt(a.policyNo.split('-')[5]) === 0}); //filter out all policies with alteration
				this.policyListingData.count = data['length'];
				if(data.policyList.length !== 0){
					this.noDataFound = false;
					// for(var rec of data.policyList){
					// 	this.policyListingData.tableData.push({
					// 		policyId: rec.policyId,
					// 		policyNo: rec.policyNo,
					// 		cedingName: rec.cedingName,
					// 		insuredDesc: rec.insuredDesc,
					// 		riskName: rec.project.riskName,
					// 		statusDesc: rec.statusDesc,
					// 		totalSi: rec.project.coverage.totalSi
					// 	});
					// }
					this.table.placeData(data.policyList.map(rec=>{
						rec.policyId =  rec.policyId;
						rec.policyNo =  rec.policyNo;
						rec.cedingName =  rec.cedingName;
						rec.insuredDesc =  rec.insuredDesc;
						rec.riskName =  rec.project.riskName;
						rec.statusDesc =  rec.statusDesc;
						rec.totalSi =  rec.project.coverage.totalSi;
						return rec;
					}))
					//this.policyListingData.tableData = this.policyListingData.tableData.filter(a=> {return a.statusDesc === 'Expired' || a.statusDesc === 'On Hold Cover'});
					if(this.isType && !this.isIncomplete){
						this.isIncomplete = false;
						this.isForViewing = false;
						this.policyInfo 					= this.policyListingData.tableData[0];
						this.polHoldCoverParams.policyId 	= this.policyInfo.policyId;
						this.polHoldCoverParams.lineCd 		= this.policyInfo.policyNo.split('-')[0];
						this.tempPolNo						= this.policyInfo.policyNo.split('-');
						//if selected policy is already in hold cover
						if(this.policyInfo.status == '4'){
							console.log(this.policyInfo.policyId);
							console.log(this.policyInfo.policyNo);
							this.retrievePolHoldCov(this.policyInfo.policyId, this.policyInfo.policyNo, '');
						}
					}
				}else{
					this.noDataFound = true;
					this.policyListingData.tableData = [];
					this.table.placeData([]);
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
				//this.table.refreshTable();
				this.modalOpen = true;
				//this.table.loadingFlag = false;
			});
		//}, 100);
		
	}

	onClickSave(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.prepareParams();
		let toInforce: string[] = ['P', 'A', 'R'];
		if(toInforce.includes(this.polHoldCoverParams.status) && !this.btnDisabled){
			let params = {
				policyId: this.policyInfo.policyId,
				holdCovId: this.polHoldCoverParams.holdCovId,
				updateType: 'inforce',
				updateUser: this.userName,
				updateDate: this.noteService.toDateTimeString(0)
			}
	  		this.us.updatePolHoldCoverStatus(params).subscribe((data: any)=>{
	  			//this.polHoldCoverParams.approvedBy = this.authorization;
	  			//this.isReleasing = false;
	  		});
		}
		this.us.savePolHoldCover(this.polHoldCoverParams).subscribe((data: any)=>{
			if(data.returnCode === 0){
				this.dialogIcon = 'error';
				this.dialogMessage = 'An error has occured.';
				$('app-sucess-dialog #modalBtn').trigger('click');
			}else{
				this.holdCoverNo = data.polHoldCoverNo;
				this.polHoldCoverParams.holdCovId = data.polHoldCoverId;
				//get seq and rev no
				let generatedNum: string[] = data.polHoldCoverNo.split('-');
				this.polHoldCoverParams.holdCovSeqNo = parseInt(generatedNum[3]).toString();
				this.polHoldCoverParams.holdCovRevNo = parseInt(generatedNum[4]).toString();
				this.retrievePolHoldCov(this.policyInfo.policyId, this.holdCoverNo, this.polHoldCoverParams.holdCovId, 'save');
				if(!this.isApproval && !this.isReleasing){
					this.dialogIcon = '';
					this.dialogMessage = '';
					$('app-sucess-dialog #modalBtn').trigger('click');
				}else{
					this.isApproval = false;
				}
				this.form.control.markAsPristine();
				if(this.isModify){
					this.isModify = false;
				}
			}
		});
	}

	prepareParams(){
		this.polHoldCoverParams.periodFrom = this.periodFromDate.date + 'T' + this.periodFromDate.time;
		this.polHoldCoverParams.periodTo = this.periodToDate.date + 'T' + this.periodToDate.time;
		if(this.approveType.length === 0){
			this.polHoldCoverParams.preparedBy = this.userName;
		}
		this.polHoldCoverParams.createUser = this.userName;
		this.polHoldCoverParams.updateUser = this.userName;
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
		this.table.p = 1;
		this.searchParams['paginationRequest.position'] = 1,   
		this.retrievePolListing();
	}

	selectPol(){
		this.focusBlur();
		this.isIncomplete = false;
		this.noDataFound = false;
		this.isForViewing = false;
		this.isModify = false;
		this.policyInfo = this.selectedPolicy;
		this.modalService.dismissAll();
		this.polHoldCoverParams.policyId = this.policyInfo.policyId;
		this.polHoldCoverParams.lineCd = this.policyInfo.policyNo.split('-')[0];
		this.tempPolNo = this.policyInfo.policyNo.split('-');
		//if selected policy is already in hold cover
		if(this.policyInfo.statusDesc === 'On Hold Cover'){
			this.retrievePolHoldCov(this.policyInfo.policyId, this.policyInfo.policyNo, '');
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
			updateType: 'cancel',
			updateUser: this.userName,
			updateDate: this.noteService.toDateTimeString(0)
		}

		this.us.updatePolHoldCoverStatus(params).subscribe((data: any)=>{
			if(data.returnCode === 0){
				this.dialogIcon = 'error-message';
				this.dialogMessage = 'Error cancelling hold cover';
				this.successDiag.open();
			}else{
				this.dialogIcon = 'success-message';
				this.dialogMessage = 'Hold Cover No. ' + this.holdCoverNo + ' is cancelled';
				this.successDiag.open();
				//this.clearHcFields();
				this.isForViewing = true;
				//this.retrievePolHoldCov(this.policyInfo.policyId, this.policyInfo.policyNo, '');
				this.polHoldCoverParams.status = '6';
				this.statusDesc = 'Cancelled';
				this.isModify = false;
				this.isReleasing = false;
			}
		});
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
		   this.periodFromDate.time === '' || this.periodToDate.date === '' || this.periodToDate.time === ''){

				this.dialogMessage = 'Please fill all required fields';
				this.dialogIcon = 'info';
				$('app-sucess-dialog #modalBtn').trigger('click');
		}else{
			$('#confirm-save #modalBtn2').trigger('click');
			
		}
	}

	onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('/pol-hold-cov-monitoring');
  		} 
  	}

  	approve(event){
  		this.approveType = event.target.innerText;
  		this.btnDisabled = true;
  		//do something
  		/*if(this.authorization === 'UNAUTHORIZED'){
  			this.statusDesc = 'Pending Approval';
  		}else if(this.authorization === 'AUTHORIZED'){
  			this.statusDesc = 'Approved';
  			this.polHoldCoverParams.approvedBy = this.userName;
  		}*/

  		if(this.approveType === 'Approve'){
  			this.approveType = 'approve';
  		}else if(this.approveType === 'Reject'){
  			this.approveType = 'reject';
  		}else{
  			this.approveType = 'pending';
  		}
  		let params = {
			policyId: this.policyInfo.policyId.toString(),
			holdCovId: this.polHoldCoverParams.holdCovId,
			updateType: this.approveType,
			updateUser: this.userName,
			updateDate: this.noteService.toDateTimeString(0)
		}
  		this.us.updatePolHoldCoverStatus(params).subscribe((data: any)=>{
  			this.polHoldCoverParams.approvedBy = this.approveType === 'Approve' ? this.authorization : '';
  			this.isApproval = true;
  			this.onClickSave();
  			this.dialogIcon = 'success-message';
  			if(this.approveType === 'approve'){
  				this.dialogMessage = 'Hold Cover No ' + this.holdCoverNo + ' has been approved.';
  			}else if(this.approveType === 'reject'){
  				this.dialogMessage = 'Hold Cover No ' + this.holdCoverNo + ' has been rejected.';
  			}else{
  				this.dialogMessage = 'Pending Approval';
  			}
  			//this.dialogMessage = this.approveType === 'Approve' ? 'Hold Cover No ' + this.holdCoverNo + ' has been approved.' : 'Pending Approval';
  			//$('app-sucess-dialog #modalBtn').trigger('click');
  			this.successDiag.open();
  			//this.isApproval = false;
  		});
  	}


  	release(){
  		//do something
  		/*if(this.authorization === 'UNAUTHORIZED'){
  			this.statusDesc = 'Pending Approval';
  		}else if(this.authorization === 'AUTHORIZED'){
  			this.statusDesc = 'Approved';
  			this.polHoldCoverParams.approvedBy = this.userName;
  		}*/
  		

  		if(this.statusDesc.toUpperCase() === 'APPROVED'){
  			//DO OFFICIAL PRINTING
  			let params = {
				policyId: this.policyInfo.policyId,
				holdCovId: this.polHoldCoverParams.holdCovId,
				updateType: 'release',
				updateUser: this.userName,
				updateDate: this.noteService.toDateTimeString(0)
			}
	  		this.us.updatePolHoldCoverStatus(params).subscribe((data: any)=>{
	  			//this.polHoldCoverParams.approvedBy = this.authorization;
	  			this.isReleasing = true;
	  			//this.onClickSave();
	  			this.retrievePolHoldCov(this.policyInfo.policyId, this.policyInfo.policyNo, '');
	  			this.isForViewing = true;
	  			this.ps.print(this.destination,'POLR029A',{policyId:this.policyInfo.policyId});
	  			//this.isReleasing = false;
	  		});
  		}else{
	  		//DO DRAFT PRINTING
	  		console.log(this.destination);
	  		let params = {
				policyId: this.policyInfo.policyId,
				holdCovId: this.polHoldCoverParams.holdCovId,
				updateUser: this.userName,
				updateDate: this.noteService.toDateTimeString(0)
			}
	  		this.ps.print(this.destination.toLowerCase(),'POLR029',params);
  		}	
  	}

  	policyNoChecker(event, key){
     this.isType = true;
     if(event.target.value.length === 0){
         this.isIncomplete = true;
         this.clearHcFields();
         this.policyInfo.cedingName = '';
		 this.policyInfo.insuredDesc = '';
		 this.policyInfo.riskName = '';
		 this.policyInfo.statusDesc = '';
		 this.policyInfo.policyId = '';
     }else{
         if(key === 'seqNo'){
             this.tempPolNo[2] = String(this.tempPolNo[2]).padStart(5, '0');
         }else if(key === 'cedingId'){
             this.tempPolNo[3] = String(this.tempPolNo[3]).padStart(3, '0');
         }else if(key ==='coSeriesNo'){
             this.tempPolNo[4] = String(this.tempPolNo[4]).padStart(4, '0');
         }else if(key ==='altNo'){
             this.tempPolNo[5] = String(this.tempPolNo[5]).padStart(3, '0');
         }else if(key === 'line'){
             this.tempPolNo[0] = String(this.tempPolNo[0]).toUpperCase();
         }
         for(var i of this.tempPolNo){
             if(i.length === 0){
                 this.isIncomplete = true;
                 break;
             }else{
                 this.isIncomplete = false;
             }
         }
     }

     if(!this.isIncomplete){
         this.retrievePolListing();
     }
   }

   focusBlur(){
   	setTimeout(()=>{
   		$('.temp-pol-no').focus();
   		$('.temp-pol-no').blur();
   	},0);
   }

  	/*policySearchParams(data:string, key:string){
  		this.fromHcMonitoring = '';
  		this.isType = true;

  		if(data.length === 0){
  			this.isIncomplete = true;
  			this.clearHcFields();
			this.policyInfo.cedingName = '';
			this.policyInfo.insuredDesc = '';
			this.policyInfo.riskName = '';
			this.policyInfo.statusDesc = '';
			this.policyInfo.policyId = '';
  		}

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
  		this.isModify = false;
  		if(this.isIncomplete){
	  		if(this.tempPolNo[0].length !== 0 &&
	  		   this.tempPolNo[1].length !== 0 &&
	  		   this.tempPolNo[2].length !== 0 &&
	  		   this.tempPolNo[3].length !== 0 &&
	  		   this.tempPolNo[4].length !== 0 &&
	  		   this.tempPolNo[5].length !== 0){
	  			this.isIncomplete = false;
	  			this.retrievePolListing();
	  		}else{
	  			this.isIncomplete = true;
	  			this.clearHcFields();
				this.policyInfo.cedingName = '';
				this.policyInfo.insuredDesc = '';
				this.policyInfo.riskName = '';
				this.policyInfo.statusDesc = '';
	  		}
  		}
  	}*/

  	modificationOption(option: string){
  		if(option === 'cancel'){
  			this.isIncomplete = true;
  			this.fromHcMonitoring = null;
  			this.clearHcFields();
			this.policyInfo.cedingName = '';
			this.policyInfo.insuredDesc = '';
			this.policyInfo.riskName = '';
			this.policyInfo.statusDesc = '';
			this.policyInfo.policyId = '';
			this.policyInfo.policyNo = '';
			this.tempPolNo = ['', '', '', '', '', ''];

  		}else if(option === 'view'){
  			this.isForViewing = true;
  		}else if(option === 'mod'){
  			this.isForViewing = false;
  			this.isModify = true;
  			this.polHoldCoverParams.approvedBy = '';
  			this.holdCoverNo = '';
  			this.statusDesc = '';
  		}
  	}

  	searchQuery(searchParams){
      for(let key of Object.keys(searchParams)){
          this.searchParams[key] = searchParams[key]
      }
      this.fromFilter = true;
      this.retrievePolListing();
    }

}
