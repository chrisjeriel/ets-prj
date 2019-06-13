import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { PolicyHoldCoverInfo } from '../../../_models/PolicyToHoldCover';
import { Title } from '@angular/platform-browser';
import { NotesService, UnderwritingService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { PrintModalComponent } from '@app/_components/common/print-modal/print-modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { FormsModule }   from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pol-dist',
  templateUrl: './pol-dist.component.html',
  styleUrls: ['./pol-dist.component.css']
})
export class PolDistComponent implements OnInit {


  private policyHoldCoverInfo: PolicyHoldCoverInfo;
	private userName: string = JSON.parse(window.localStorage.currentUser).username;

	@ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	//@ViewChild(PrintModalComponent) print : PrintModalComponent;
	@ViewChild('myForm') form:any;
	@ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

	constructor(private titleService: Title, private noteService: NotesService, private us: UnderwritingService, private modalService: NgbModal, private router: Router,
			    private activatedRoute: ActivatedRoute) { }

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
	cancelFlag: boolean = false;

	authorization: string = '';

	tempPolNo: string[] = ['','','','','',''];
	approveList: any[] = [];

	private sub: any;			// ARNEILLE DATE: Apr.10, 2019
	fromHcMonitoring: any;		// ARNEILLE DATE: Apr.10, 2019

	cancelBtnDisabledStatus: string[] = ['3','4','5','6', ''];
	approveBtnDisabledStatus: string[] = ['2','3','4','5','6','R', ''];
	saveBtnDisabledStatus: string[] = ['2','3','4','5','6'];

	ngOnInit() {
    	this.titleService.setTitle("Pol | Policy Distribution");
		this.printType = 'SCREEN';
	}

	retrievePolListing(){
		this.table.loadingFlag = true;
		this.policyListingData.tableData = [];
		setTimeout(()=>{
			this.us.getParListing([{key: 'policyNo', search: this.noDataFound ? '' : this.tempPolNo.join('%-%')}]).subscribe((data: any) =>{
				data.policyList = data.policyList === null ? [] : data.policyList; //filter out all policies with alteration
				if(data.policyList.length !== 0){
					this.noDataFound = false;
					for(var rec of data.policyList){
						this.policyListingData.tableData.push({
							policyId: rec.policyId,
							policyNo: rec.policyNo,
							cedingName: rec.cedingName,
							insuredDesc: rec.insuredDesc,
							riskName: rec.project.riskName,
							statusDesc: rec.statusDesc,
							totalSi: rec.project.coverage.totalSi
						});
					}
					this.policyListingData.tableData = this.policyListingData.tableData.filter(a=> {return a.statusDesc === 'In Force'});
					if(this.isType && !this.isIncomplete){
						this.isIncomplete = false;
						this.policyInfo 					= this.policyListingData.tableData[0];
						this.polHoldCoverParams.policyId 	= this.policyInfo.policyId;
						this.polHoldCoverParams.lineCd 		= this.policyInfo.policyNo.split('-')[0];
						this.tempPolNo						= this.policyInfo.policyNo.split('-');
					}
				}else{
					this.noDataFound = true;
					this.policyListingData.tableData = [];
					if(this.isType){
						this.policyInfo.cedingName = '';
						this.policyInfo.insuredDesc = '';
						this.policyInfo.riskName = '';
						this.policyInfo.statusDesc = '';
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

	onRowClick(data){
		this.selectedPolicy = data;
		console.log(data)
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
		this.retrievePolListing();
	}

	selectPol(){
		this.isIncomplete = false;
		this.noDataFound = false;
		this.isModify = false;
		this.policyInfo = this.selectedPolicy;
		this.modalService.dismissAll();
		this.polHoldCoverParams.policyId = this.policyInfo.policyId;
		this.polHoldCoverParams.lineCd = this.policyInfo.policyNo.split('-')[0];
		this.tempPolNo = this.policyInfo.policyNo.split('-');
	}

	onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('/pol-hold-cov-monitoring');
  		} 
  	}

  	policySearchParams(data:string, key:string){
  		this.fromHcMonitoring = '';
  		this.isType = true;

  		if(data.length === 0){
  			this.isIncomplete = true;
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
				this.policyInfo.cedingName = '';
				this.policyInfo.insuredDesc = '';
				this.policyInfo.riskName = '';
				this.policyInfo.statusDesc = '';
	  		}
  		}
  	}

   onClickNext(){
   	this.router.navigate(['policy-dist', {policyId:this.selectedPolicy.policyId,
                                              fromInq:false,
                                              policyNo: this.selectedPolicy.policyNo,
                                              line: this.policyInfo.lineCd,
                                              lineClassCd: this.policyInfo.lineClassCd,
                                              statusDesc:this.policyInfo.statusDesc,
                                              insured: this.selectedPolicy.insured,
                                              cedingName: this.policyInfo.cedingName,
                                              status: this.selectedPolicy.status,
                                              exitLink: '/pol-dist'
                                              }], { skipLocationChange: true });
   }

   onClickCancel(){
   	this.router.navigate(['/']);
   }

}



