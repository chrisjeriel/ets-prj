import { Component, OnInit,ViewChild } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService,NotesService } from '../../_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { DecimalPipe } from '@angular/common';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router } from '@angular/router';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-hold-cover',
	templateUrl: './hold-cover.component.html',
	styleUrls: ['./hold-cover.component.css'],
	providers: [DecimalPipe]
})
export class HoldCoverComponent implements OnInit {
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
	@ViewChild('opt') opt: CustNonDatatableComponent;
	@ViewChild('tabset') tabset: any;
	@ViewChild(ConfirmLeaveComponent) conleave : ConfirmLeaveComponent;

	tableData: any[] = [];
	tHeader: any[] = [];
	quoteLine: string = "";
	private holdCoverInfo: HoldCoverInfo;
	private sub: any;
	
	passDataQuoteLOV : any = {
		tableData: [],
		tHeader:["Quotation No.", "Ceding Company", "Insured", "Risk"],
		dataTypes: ["text","text","text","text"],
		pageLength: 10,
		resizable: [false,false,false,false],
		tableOnly: false,
		keys: ['quotationNo','cedingName','insuredDesc','riskName'],
		pageStatus: true,
		pagination: true,
		filters: [
		{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
		{key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
		{key: 'insuredDesc',title: 'Insured',dataType: 'text'},
		{key: 'riskName',title: 'Risk',dataType: 'text'},
		//{key: 'cessionDesc',title: 'Type of Cession',dataType: 'text'},
		// {key: 'lineClassCdDesc',title: 'Line Class',dataType: 'text'},
		// {key: 'status',title: 'Status',dataType: 'text'},
		// {key: 'principalName',title: 'Principal',dataType: 'text'},
		// {key: 'contractorName',title: 'Contractor',dataType: 'text'},   
		// {key: 'objectDesc',title: 'Object',dataType: 'text'},
		// {key: 'site',title: 'Site',dataType: 'text'},
		// {key: 'policyNo',title: 'Policy No.',dataType: 'seq'},
		// {key: 'currencyCd',title: 'Currency',dataType: 'text'},
		// {key: 'issueDate',title: 'Quote Date',dataType: 'date'},
		// {key: 'expiryDate',title: 'Valid Until',dataType: 'date'},
		// {key: 'reqBy',title: 'Requested By',dataType: 'text'},
		// {key: 'createUser',title: 'Created By',dataType: 'text'},
		],
		colSize: ['', '250px', '250px', '250px'],
	};

	passDataQuoteOptionsLOV : any = {
		tableData: [],
		tHeader: ['Option No','Rate(%)','Conditions','Comm Rate Quota(%)','Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
		dataTypes: ['number','percent','text','percent','percent','percent'],
		pageLength: 10,
		resizable: [false,false,false,false,false,false],
		tableOnly: true,
		keys: ['optionNo','rate','conditions','commRateQuota','commRateSurplus','commRateFac'],
		pageStatus: true,
		pagination: true,
		pageID:10,
		// filters:[
		//   {key:'optionNo',title:'Option No',dataType:'text'},
		//   {key:'rate',title:'Option No',dataType:'text'},
		//   {key:'conditions',title:'Option No',dataType:'text'},
		//   {key:'commRateQuota',title:'Option No',dataType:'text'},
		//   {key:'commRateSurplus',title:'Option No',dataType:'text'},
		//   {key:'commRateFac',title:'Option No',dataType:'text'},
		// ]
	};

	searchParams: any[] = [];
	searchParams2: any[] = [];

	constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title,
		private decPipe: DecimalPipe, private ns : NotesService, private router: Router,  private route: ActivatedRoute) { 
	}

	qLine: string;
	qYear: string;
	qSeqNo: string;
	qRevNo: string;
	qCedingId: string;

	quoteNo:string;
	cedCo:string;
	insured:string;
	risk:string;
	from: string;

	rowRec;

	hcPrefix             : string;
	hcLine               : string;
	hcYear               : string;
	hcSeqNo              : string;
	hcRevNo              : string;
	type                 : string;
	cancelFlag           : boolean;
	typeTime             : string;


	quoteId: number;
	warningMsg: string;
	clickView:boolean;
	clickModif:boolean;
	btnApprovalEnabled: boolean;
	btnCancelMainEnabled: boolean;
	loading:boolean;
	dialogMessage:string = '';
	dialogIcon:string = '';

	cbSearchQn: boolean;
	inSearcnQn: string;
	showAll:boolean;

	periodFromTime: any;
	periodToTime:any;
	ids :any;
	genMsg : string = '';
	icon:string='';
	selectedOption:any;
	optLovEnabled: boolean;
	cancelHcBtnEnabled: boolean;
	clickQuoteLOV:boolean;

	holdCover: any = {
		approvedBy:     "",
		compRefHoldCovNo:     "",
		createDate:     "",
		createUser:     "",
		holdCoverId:    "",
		holdCoverNo:    "",
		holdCoverRevNo:     "",
		optionId:        "",
		holdCoverSeqNo:     "",
		holdCoverYear:    "",
		lineCd:     "",
		lineCdDesc:     "",
		periodFrom:     "",
		periodTo:     "",
		preparedBy:     "",
		reqBy:    "",
		reqDate:    "",
		status:     "",
		updateDate:     "",
		updateUser:     "",
	}

	project: any ={
		coverage: "",
		createDate: "",
		createUser: "",
		duration: "",
		ipl: "",
		noClaimPd: "",
		objectDesc: "",
		objectId: "",
		pctShare: "",
		pctShareI: "",
		projDesc: "",
		projId: "",
		quoteId: "",
		riskId: "",
		riskName: "",
		site: "",
		testing: "",
		timeExc: "",
		totalSi: "",
		totalSiI: "",
		totalValue: "",
		updateDate: "",
		updateUser: "",
	}

	ngOnInit() {
		this.titleService.setTitle("Quo | Quotation to Hold Cover");
		this.holdCoverInfo = new HoldCoverInfo();
		this.btnApprovalEnabled = false;
		this.passDataQuoteLOV.filters[0].enabled = false;
		this.showAll = true;
		this.cancelHcBtnEnabled = false;
		

		this.sub = this.route.params.subscribe(params => {
			this.from = params['from'];
			if (this.from == "hold-cover-monitoring") {
				this.sliceQuoteNo(params['quotationNo']);	
				this.getQuoteInfo();			
			}
		});
	}


	formatDate(date){
		return new Date(date[0] + "-" + date[1] + "-" + date[2]).toISOString();
	}

	sliceQuoteNo(qNo: string){
		var qArr = qNo.split("-");
		this.qLine = qArr[0];
		this.qYear = qArr[1];
		this.qSeqNo = qArr[2];
		this.qRevNo = qArr[3];
		this.qCedingId = qArr[4];        
	}


	splitHcNo(hcNo: string){
		var hcArr = hcNo.split("-");
		this.hcLine = hcArr[1];
		this.hcYear = hcArr[2];
		this.hcSeqNo = hcArr[3];
		this.hcRevNo = hcArr[4];        
	}

	searchQuery(searchParams){
		this.searchParams = searchParams;
		this.passDataQuoteLOV.tableData = [];
		this.search();
	}

	searchMatchingQuote(){
		this.table.loadingFlag = true;
		this.passDataQuoteLOV.tableData = [];
		$('#lovMdl > #modalBtn').trigger('click');
		this.qLine = (this.qLine === '' || this.qLine === null || this.qLine === undefined)? '' : this.qLine;
		this.qYear = (this.qYear === '' || this.qYear === null || this.qYear === undefined)? '' : this.qYear;
		this.qSeqNo = (this.qSeqNo === '' || this.qSeqNo === null || this.qSeqNo === undefined)? '' : this.qSeqNo;
		this.qRevNo = (this.qRevNo === '' || this.qRevNo === null || this.qRevNo === undefined)? '' : this.qRevNo;
		this.qCedingId = (this.qCedingId === '' || this.qCedingId === null || this.qCedingId === undefined)? '' : (this.qCedingId.padStart(3,'0'));
		this.quotationService.getSearchQuoteInfo(this.qLine.toUpperCase(),this.qYear,this.qSeqNo,this.qRevNo,this.qCedingId)
		.subscribe(data => {
			console.log(data);
			var rec = data['quotation'];
			if(rec !== '' ||  rec !== null || rec !== undefined){
				for(let i of rec){	
					this.passDataQuoteLOV.tableData.push({
						quotationNo: i.quotationNo,
						cedingName:  i.cedingName,
						insuredDesc: i.insuredDesc,
						riskName: (i.project == null) ? '' : i.project.riskName
					});
				}
				this.table.refreshTable();
				
			}
		});
	}

	search() {
		this.table.loadingFlag = true;
		this.passDataQuoteLOV.tableData = [];
		$('#lovMdl > #modalBtn').trigger('click');
		var quoFiltSearch = this.passDataQuoteLOV.filters[0].search;
		var quoFiltEnabled = this.passDataQuoteLOV.filters[0].enabled;
		if(quoFiltEnabled === true){
			this.quotationService.getQuoProcessingData(this.searchParams)
			.subscribe(val => {
				var records = val['quotationList'];
				this.passDataQuoteLOV.tableData = [];
				if(records === null  || records === '' || records === undefined){
					this.showAll = false;
				}else{
					for(let rec of records){
						if(rec.status.toUpperCase() === 'RELEASED' || rec.status.toUpperCase() === 'ON HOLD COVER'){
							this.passDataQuoteLOV.tableData.push({
								quotationNo: rec.quotationNo,
								cedingName:  rec.cedingName,
								insuredDesc: rec.insuredDesc,
								riskName: (rec.project == null) ? '' : rec.project.riskName
							});
						}
					}
				}
				this.table.refreshTable();
			});

			
			
		}else{
			this.searchMatchingQuote();
		}

	}

	onRowClick(event){
		this.rowRec = event;
	}

	getQuGenInfo(){
		this.quotationService.getSelectedQuote(this.quoteNo)
		.subscribe(data => {
			console.log(data);
			this.quoteId = data['quotationList'][0].quoteId;
		});
	}

	onSaveClickLOV(){

		this.sliceQuoteNo(this.rowRec.quotationNo);
		this.quoteNo = this.rowRec.quotationNo;
		if(this.quoteNo != null || this.quoteNo != undefined || this.quoteNo != ''){
		}
		this.getQuGenInfo();
		this.modalService.dismissAll();
		this.btnApprovalEnabled = false;
		this.quotationService.getSelectedQuotationHoldCoverInfo(this.quoteNo)
		.subscribe(data => {
			this.newHc(false);
			this.insured = this.rowRec.insuredDesc;
			this.cedCo = this.rowRec.cedingName;
			this.risk = this.rowRec.riskName;
			this.hcLine  = this.qLine;
			this.hcYear  =  String(new Date().getFullYear());
			this.showAll = true;

			if(data['quotationList'][0] === null || data['quotationList'][0] === undefined || data['quotationList'][0] === ''){ 
				this.holdCover.holdCoverId = '';
				this.hcLine  = '';
				this.hcYear  =  '';
				this.hcSeqNo = '';
				this.hcRevNo = '';
				this.holdCover.holdCoverNo = '';
				this.holdCover.periodFrom = '';
				this.holdCover.periodTo = '';
				this.holdCover.compRefHoldCovNo = '';
				this.holdCover.status = '';
				this.holdCover.reqBy = '';
				this.holdCover.reqDate = '';
				this.holdCover.preparedBy = '';
				this.holdCover.approvedBy = '';
				this.holdCover.optionId = '';
				this.clickView = false;
				//this.quoteId = (data['quotationList'][0] === undefined) ? '' : data['quotationList'][0].quoteId;
				this.cancelHcBtnEnabled = false;
				this.btnApprovalEnabled = false;
			}else{
				this.prepBeforeSave(data);		
			}

		});
	}

	holdCoverReq:any
	onSaveClick(cancelFlag?){
		this.dialogIcon = '';
		this.dialogMessage = '';
		this.cancelFlag = cancelFlag !== undefined;

		if(this.quoteNo === '' || this.quoteNo === null || this.quoteNo === undefined || this.holdCover.periodFrom === '' || this.holdCover.periodFrom === null || this.holdCover.periodFrom === undefined || this.holdCover.periodTo === '' || this.holdCover.periodTo === null || this.holdCover.periodTo === undefined || this.holdCover.optionId === '' || this.holdCover.optionId === null || this.holdCover.optionId === undefined){
			setTimeout(()=>{
				this.dialogIcon = 'error';
				$('.globalLoading').css('display','none');
				$('app-sucess-dialog #modalBtn').trigger('click');
				$('.warn').focus();
				$('.warn').blur();
			},500);
		}else{
			this.quotationService.getQuoteGenInfo('',this.plainQuotationNo(this.quoteNo))
			.subscribe(val => {
				this.quoteId = val['quotationGeneralInfo'].quoteId;
				console.log(this.quoteId);

				if(this.holdCover.status === null || this.holdCover.status === '' || this.holdCover.status === undefined){
					this.holdCover.status = 'In Force';
				}else{
					if(this.holdCover.status.toUpperCase() === 'APPROVED' || this.holdCover.status.toUpperCase() === 'REJECTED'){
						this.holdCover.status = 'In Force';
					}
				}

				this.holdCoverReq = {	
					"approvedBy"		: this.holdCover.approvedBy,
					"compRefHoldCovNo"	: this.holdCover.compRefHoldCovNo,
					"createDate"		: (this.holdCover.createDate === null || this.holdCover.createDate === '' || this.holdCover.createDate === undefined) ? this.ns.toDateTimeString(0) : this.holdCover.createDate,
					"createUser"		: (this.holdCover.createUser === null || this.holdCover.createUser === '' || this.holdCover.createUser === undefined) ? JSON.parse(window.localStorage.currentUser).username : this.holdCover.createUser,
					"holdCoverId"		: this.holdCover.holdCoverId,
					"holdCoverRevNo"	: this.hcRevNo,
					"holdCoverSeqNo"	: this.hcSeqNo,
					"optionId"			: this.holdCover.optionId,
					"holdCoverYear"		: (this.hcYear === null || this.hcYear === '' || this.hcYear === undefined) ? String(new Date().getFullYear()) : this.hcYear,
					"lineCd"			: (this.hcLine === null || this.hcLine === '' || this.hcLine === undefined) ? this.qLine.toUpperCase() : this.hcLine.toUpperCase() ,
					"periodFrom"		: this.holdCover.periodFrom.split('T')[0] + 'T' + (this.periodFromTime === undefined ? this.holdCover.periodFrom.split('T')[1]: this.periodFromTime),
					"periodTo"			: this.holdCover.periodTo.split('T')[0] + 'T' + (this.periodToTime === undefined ? this.holdCover.periodTo.split('T')[1]: this.periodToTime),
					"preparedBy"		: (this.holdCover.preparedBy === null || this.holdCover.preparedBy === '') ? JSON.parse(window.localStorage.currentUser).username : this.holdCover.preparedBy,
					"quoteId"			: this.quoteId,
					"reqBy"				: this.holdCover.reqBy,
					"reqDate"			: (this.holdCover.reqDate === null  || this.holdCover.reqDate === undefined || this.holdCover.reqDate === '') ? '' : this.holdCover.reqDate,
					"status"			: (this.holdCover.status === null || this.holdCover.status === '' || this.holdCover.status === undefined)?'In Force':this.holdCover.status,
					"updateDate" 		: this.ns.toDateTimeString(0),
					"updateUser"		: (this.holdCover.preparedBy === null || this.holdCover.preparedBy === '') ? JSON.parse(window.localStorage.currentUser).username : this.holdCover.preparedBy
				}

				console.log(JSON.stringify(this.holdCoverReq));
				this.quotationService.saveQuoteHoldCover(
					JSON.stringify(this.holdCoverReq)
					).subscribe(data => {
						var returnCode = data['returnCode'];
						var hcNo = data['holdCoverNo'].split('-');
						this.hcLine = hcNo[1];
						this.hcYear = hcNo[2];
						this.hcSeqNo = hcNo[3];
						this.hcRevNo = hcNo[4];

						if(this.btnCancelMainEnabled === true){
							this.modalService.dismissAll();
						}  

						this.quotationService.getHoldCoverInfo('',this.plainHc(data['holdCoverNo']))
						.subscribe(data => {
							this.dialogIcon = '';
							this.dialogMessage = '';
							$('app-sucess-dialog #modalBtn').trigger('click');
							this.btnApprovalEnabled = true;
							this.cancelHcBtnEnabled = true;


							var rec = data['quotation'].holdCover;
							this.holdCover.holdCoverNo = rec.holdCoverNo;
							this.holdCover.holdCoverId = rec.holdCoverId;
							this.holdCover.periodFrom = this.ns.toDateTimeString(rec.periodFrom);
							this.holdCover.periodTo = this.ns.toDateTimeString(rec.periodTo);
							this.holdCover.compRefHoldCovNo  = rec.compRefHoldCovNo;
							this.holdCover.status = rec.status;
							this.holdCover.reqBy =  rec.reqBy;
							this.holdCover.reqDate = (rec.reqDate === null || rec.reqDate === undefined) ? '' : this.ns.toDateTimeString(rec.reqDate);
							this.holdCover.preparedBy = rec.preparedBy;
							this.holdCover.approvedBy = rec.approvedBy;
							this.holdCover.optionId = rec.optionId;
							this.periodFromTime = this.holdCover.periodFrom.split('T')[1];
							this.periodToTime = this.holdCover.periodTo.split('T')[1];
						});
					});
			});


			
			}

		}


		plainHc(data:string){
			var arr = data.split('-');
			return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
		}

		plainQuotationNo(data: string){
			var arr = data.split('-');
			return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + arr[4];
		}

		setPeriodTo(periodFrom){  
			try{
				if(periodFrom === ''){
					this.holdCover.periodTo = '';
				}else{
					var d = new Date(periodFrom);
					var s = d.setDate(d.getDate()+30);
					this.holdCover.periodTo = (s === null  || s === undefined ) ? '' : this.ns.toDateTimeString(s);
					this.holdCover.periodFrom = this.ns.toDateTimeString(periodFrom);
					$('.ng-touched').addClass('ng-dirty');
					this.periodFromTime = '00:00';
					this.periodToTime = '00:00';
				}
			}catch(e){
			}
		}

		limitPeriodTo(periodFrom){
			$('.ng-touched').addClass('ng-dirty');
			if((new Date(this.holdCover.periodFrom).getTime()) > (new Date(this.holdCover.periodTo).getTime())){
				this.dialogIcon = 'info';
				this.dialogMessage = 'Period To should be greater than Period From';
				$('app-sucess-dialog #modalBtn').trigger('click');
				this.setPeriodTo(periodFrom);
			}
		}

		addNgDirty(){
			// add ng-dirty on change for time fields
			$('.ng-touched').addClass('ng-dirty');
		}

		getQuoteInfo(){
			this.passDataQuoteLOV.tableData = [];
			this.qLine =  (this.qLine === '' || this.qLine === null || this.qLine === undefined)? '' : this.qLine;
			this.qYear =  (this.qYear === '' || this.qYear === null || this.qYear === undefined)? '' : this.qYear;
			this.qSeqNo =  (this.qSeqNo === '' || this.qSeqNo === null || this.qSeqNo === undefined)? '' : this.qSeqNo;
			this.qRevNo =  (this.qRevNo === '' || this.qRevNo === null || this.qRevNo === undefined)? '' : this.qRevNo;
			this.qCedingId =  (this.qCedingId === '' || this.qCedingId === null || this.qCedingId === undefined)? '' : (this.qCedingId.padStart(3,'0'));
			this.quotationService.getSearchQuoteInfo(this.qLine.toUpperCase(),this.qYear,this.qSeqNo,this.qRevNo,this.qCedingId)
			.subscribe(data => {
				console.log(data);
				var rec = data['quotation'];
				if(rec === '' ||  rec === null || rec === undefined || rec.length === 0){
					if(this.qLine !== '' && this.qYear !== '' && this.qSeqNo !== '' && this.qRevNo !== '' && this.qCedingId !== ''){
						this.quoteNo = '';
						this.insured = '';
						this.cedCo = '';
						this.risk = '';
						this.hcLine  = '';
						this.hcYear  =  '';
						this.newHc(true);
						this.qLine = '' ;
						this.qYear = '' ;
						this.qSeqNo = '' ;
						this.qRevNo = '' ;
						this.qCedingId = '' ;
						this.searchMatchingQuote();
						this.clearAll();
					}
				}else{
					if(rec.length === 1){
						this.newHc(false);
						this.quoteNo = (rec[0].quotationNo === null || rec[0].quotationNo === undefined) ? '' : rec[0].quotationNo;
						this.insured = (rec[0].insuredDesc  === null || rec[0].insuredDesc === undefined) ? '' : rec[0].insuredDesc;
						this.cedCo = (rec[0].cedingName  === null || rec[0].cedingName === undefined) ? '' : rec[0].cedingName;
						this.risk = (rec[0].project  === null || rec[0].project === undefined) ? '' : rec[0].project.riskName;
						this.sliceQuoteNo(this.quoteNo);

						this.quotationService.getSelectedQuotationHoldCoverInfo(this.quoteNo)
						.subscribe(data => {
							this.btnApprovalEnabled = false;
							if(data['quotationList'][0] === null || data['quotationList'][0] === undefined || data['quotationList'][0] === ''){
								this.cancelHcBtnEnabled = false;
							}else{
								this.prepBeforeSave(data);	
							}
						});
					}
				}



			});
		}

		prepBeforeSave(data){
			var rec = data['quotationList'][0].holdCover;
				if((rec.status).toUpperCase() === 'CANCELLED' || (rec.status).toUpperCase() === 'REPLACED VIA HOLD COVER MODIFICATION'){
				}else{
					this.holdCover.holdCoverNo = rec.holdCoverNo;
					this.splitHcNo(rec.holdCoverNo);
					this.holdCover.periodFrom = this.ns.toDateTimeString(rec.periodFrom);
					this.holdCover.periodTo = this.ns.toDateTimeString(rec.periodTo);
					this.periodFromTime = this.holdCover.periodFrom.split('T')[1];
					this.periodToTime = this.holdCover.periodTo.split('T')[1];
					this.holdCover.compRefHoldCovNo = rec.compRefHoldCovNo;
					this.holdCover.reqBy  = rec.reqBy;
					this.holdCover.reqDate  = (rec.reqDate === '' || rec.reqDate === null || rec.reqDate === undefined)? '' :this.ns.toDateTimeString(rec.reqDate);
					this.holdCover.status  = rec.status;
					this.holdCover.approvedBy =  rec.approvedBy;
					this.holdCover.holdCoverId = rec.holdCoverId;
					this.holdCover.updateUser = JSON.parse(window.localStorage.currentUser).username;
					this.holdCover.preparedBy = JSON.parse(window.localStorage.currentUser).username;
					this.holdCover.createDate = this.ns.toDateTimeString(rec.createDate);
					this.holdCover.createUser = rec.createUser;
					this.holdCover.optionId = rec.optionId;
					this.cancelHcBtnEnabled = true;
					this.btnApprovalEnabled = true;
					this.newHc(false);
					this.quoteId = (data['quotationList'][0] === undefined) ? '' : data['quotationList'][0].quoteId;

					if(rec.approvedBy === '' || rec.approvedBy === null ||  rec.approvedBy === undefined){
						this.clickView = false;
					}

					if(rec.status.toUpperCase() === 'RELEASED'){
						$('#modifMdl > #modalBtn').trigger('click');
					}else if(rec.status.toUpperCase() === 'CONVERTED' || rec.status.toUpperCase() === 'EXPIRED'){
						this.clickView = true;
						this.disableFieldsHc(true);
						this.cancelHcBtnEnabled = false;
					}

				} 
		}



		onClickView(){
			this.modalService.dismissAll();
			this.clickView = true;
			this.disableFieldsHc(true);
		}

		onClickModif(){
			this.modalService.dismissAll();
			this.clickView = false;
			this.clickModif = true;
		}

		onClickCancelModifMdl(){
			this.clickView = false;
			this.cancelHcBtnEnabled = false;
			this.btnApprovalEnabled = false;
			this.newHc(true);
			this.modalService.dismissAll();
			this.clearAll();
		}

		onClickCancelQuoteLOV(){
			this.modalService.dismissAll();
			//this.loading = false;
		}

		onClickCancel(){
			this.cancelBtn.clickCancel();
		}

		newHc(isNew:boolean){
			if(isNew === true){
				this.hcPrefix = '';
				this.type = 'text';
				this.typeTime = 'text';
				this.disableFieldsHc(true);
			}else{
				this.hcPrefix = 'HC';
				this.type = 'date';
				this.typeTime = 'time';	
				this.disableFieldsHc(false);
			}
		}

		disableFieldsHc(isDisabled:boolean){
			if(isDisabled === true){
				$(".r-only").prop('readonly', true);
				this.optLovEnabled = false;

			}else{
				$(".r-only").prop('readonly', false);
				this.optLovEnabled = true;  
			}
		}

		clearAll(){
			this.quoteNo = '';
			this.qLine = '';
			this.qYear = '';
			this.qSeqNo = '';
			this.qRevNo = '';
			this.qCedingId ='';
			this.insured = '';
			this.cedCo = '';
			this.risk = '';
			this.hcLine  = '';
			this.hcYear  =  '';
			this.hcSeqNo = '';
			this.hcRevNo ='';
			this.holdCover.holdCoverNo ='';
			this.holdCover.periodFrom = '';
			this.holdCover.periodTo = '';
			this.periodFromTime = '';
			this.periodToTime = '';
			this.holdCover.compRefHoldCovNo = '';
			this.holdCover.status = '';
			this.holdCover.reqBy = '';
			this.holdCover.reqDate = '';
			this.holdCover.preparedBy = '';
			this.holdCover.approvedBy = '';
			this.holdCover.optionId = '';
			//$('.ng-dirty').removeClass('ng-dirty');
		}

		onClickSave(){
			$('#confirm-save #modalBtn2').trigger('click');
		}

		onClickApprovalBtnMdl(){
			$('#approvalBtnMdl #modalBtn').trigger('click');
		}

		fmtSq(sq){
			this.qSeqNo = (this.decPipe.transform(sq,'5.0-0') === null) ? '' : this.decPipe.transform(sq,'5.0-0').replace(',','');
		}

		fmtRn(rn){
			this.qRevNo = (this.decPipe.transform(rn,'2.0-0') === null) ? '' : this.decPipe.transform(rn,'2.0-0').replace(',','');
		}

		fmtCn(cn){
			this.qCedingId = (this.decPipe.transform(cn,'3.0-0') === null) ? '' : this.decPipe.transform(cn,'3.0-0').replace(',','');
		}


		onTabChange($event: NgbTabChangeEvent) {
			if ($event.nextId === 'Exit') {
				// if($('.ng-dirty').length != 0 ){
				// 	$event.preventDefault();
				// }else{
				// 	console.log('DIRTY');
					$event.preventDefault();
					this.router.navigate(['']);
				// }
			}else{
				console.log('EVENT ELSE ON TAB CHANGE');
				if($('.ng-dirty').length != 0 ){
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

		onClickCancelHoldCover(){
			console.log(this.holdCover.status);
			this.modalService.dismissAll();
			this.loading = true;
			this.ids = {
				"quoteId"     : (this.quoteId === null || this.quoteId === undefined)? '' : this.quoteId,
				"holdCoverId" : this.holdCover.holdCoverId,
				"updateUser"  : this.holdCover.updateUser
			};

			if(this.quoteId === null || this.quoteId === undefined){
				this.genMsg = 'No existing Hold Cover';
				this.icon = 'fa fa-times-circle fa-3x';
				$('#successModal #modalBtn').trigger('click');
				this.loading = false;
			}else{
				if((this.holdCover.status).toUpperCase() === 'IN FORCE' || (this.holdCover.status).toUpperCase() === 'RELEASED'){
					this.quotationService.updateHoldCoverStatus(JSON.stringify(this.ids))
					.subscribe(data => {
						console.log(data);	
						this.loading = false;
						this.genMsg = 'Cancelled successfully' ;
						this.icon = 'fa fa-check-circle fa-3x';
						$('#successModal #modalBtn').trigger('click');
						this.clearHcDetails();
						this.cancelHcBtnEnabled = false;
						this.btnApprovalEnabled = false;
					}); 
				}

			}

		}

		onConfirmCancelHc(){	
			this.warningMsg = 'Are you sure you want to save changes?';
			$('#warningMdl #modalBtn').trigger('click');  
		}

		onClickOptionLOV(){
			this.opt.loadingFlag = true;
			this.passDataQuoteOptionsLOV.tableData = [];
			$('#optionMdl #modalBtn2').trigger('click');
			console.log(this.quoteId);
			this.quotationService.getQuoteOptions(this.quoteId.toString(),'')
			.subscribe(data => {
				console.log(data);
				this.passDataQuoteOptionsLOV.tableData = [];

				if(data['quotation'] === '' || data['quotation'] === null || data['quotation'] === undefined){

				}else{
					var rec = data['quotation'].optionsList;
					for(let i of rec){
						this.passDataQuoteOptionsLOV.tableData.push({
							optionNo:         i.optionId,
							rate:             i.optionRt,
							conditions:       i.condition,
							commRateQuota:    i.commRtQuota,
							commRateSurplus:  i.commRtSurplus,
							commRateFac:      i.commRtFac
						});
					}
					this.opt.refreshTable();	
				}

			});
		}

		onClickOptionRow(event){
			this.selectedOption = event;
		}

		onClickOkOption(){
			this.holdCover.optionId = this.selectedOption.optionNo;
			$('.ng-touched').addClass('ng-dirty');
			this.modalService.dismissAll();
		}

		clearHcDetails(){
			this.holdCover.holdCoverNo = '';
			this.holdCover.holdCoverId = '';
			this.holdCover.periodFrom = '';
			this.holdCover.periodTo = '';
			this.periodFromTime = '';
			this.periodToTime = '';
			this.holdCover.compRefHoldCovNo = '';
			this.holdCover.status = '';
			this.holdCover.reqBy = '';
			this.holdCover.reqDate = '';
			this.holdCover.preparedBy = '';
			this.holdCover.approvedBy = '';
			this.holdCover.optionId = '';
		}

		countMatch:number;
		searchOptNo(optNoInput){
			this.countMatch = 0;
			this.quotationService.getQuoteOptions(((this.quoteId === null || this.quoteId === undefined)? '' : this.quoteId.toString()),'')
			.subscribe(data => {
				if(data['quotation'] === '' || data['quotation'] === null || data['quotation'] === undefined){

				}else{
					var rec = data['quotation'].optionsList;
					for(let i of rec){
						if(Number(i.optionId) === Number(optNoInput)){
							this.countMatch++;
						}
					}
				}

				if(this.countMatch !== 1){
					//this.holdCover.optionId = '';  // do not delete
					this.onClickOptionLOV();
				}
			});
		}

		onClickClear(){
			this.clearAll();
			this.newHc(true);
			this.disableFieldsHc(true);
			this.cancelHcBtnEnabled = false;
			this.btnApprovalEnabled = false;
			this.clickView = false;
		}

		// show(event){
		// 	if($('.ng-dirty').length != 0 ){
		// 	    event.preventDefault();
		// 	 	const modal = this.modalService.open(ConfirmLeaveComponent,{
		// 	            centered: true, 
		// 	            backdrop: 'static', 
		// 	            windowClass : 'modal-size'
		// 	 	});
		// 	}

			       
		// }


}
