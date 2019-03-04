import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { QuotationGenInfo } from '../../_models';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';
import { QuotationService, MaintenanceService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MtnObjectComponent } from '@app/maintenance/mtn-object/mtn-object.component';

@Component({
	selector: 'app-general-info',
	templateUrl: './general-info.component.html',
	styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {
	@ViewChild(MtnObjectComponent) objectLov: MtnObjectComponent;

	private quotationGenInfo: QuotationGenInfo;
	rowData: any[] = this.quotationService.rowData;
	quotationNo: string;
	tableData: any[] = [];
	tHeader: any[] = [];
	dataTypes: any[] = [];
	filters: any[] = [];
	cessionType: string = "";
	principalCd:string = "";
	contractorCd: String = "";

	typeOfCession: string = "";
	private sub: any;
	from: string;
	line: string;
	lineClass: string;
	lineClassCode: string;
	lineClassDesc: string;
	ocChecked: boolean = false;
	internalCompFlag: boolean = false;
	saveBtnClicked: boolean = false;

	@Input() inquiryFlag: boolean = false;

	project: any = {
		blockCd: '',
		blockDesc: '',
		cityCd: '',
		cityDesc: '',
		coverage: '',
		createDate: '',
		createUser: '',
		districtCd: '',
		districtDesc: '',
		duration: '',
		ipl: '',
		latitude: '',
		longitude: '',
		noClaimPd: '',
		objectDesc: '',
		objectId: '',
		pctShare: '',
		pctShareI: '',
		projDesc: '',
		projId: '',
		provinceCd: '',
		provinceDesc: '',
		quoteId: '',
		regionCd: '',
		regionDesc: '',
		riskId: '',
		riskName: '',
		site: '',
		testing: '',
		timeExc: '',
		totalSi: '',
		totalSiI: '',
		totalValue: '',
		updateDate: '',
		updateUser: ''
	}

	genInfoData: any = {
		approvedBy: '',
		cedingId: '',
		cedingName: '',
		cessionDesc: '',
		cessionId: '',
		closingParag: '',
		contractorId: '',
		contractorName: '',
		createDate: '',
		createUser: '',
		currencyCd: '',
		currencyRt: '',
		declarationTag: 'N',
		expiryDate: '',
		govtTag: 'N',
		indicativeTag: 'N',
		insuredDesc: '',
		intmId: '',
		intmName: '',
		issueDate: '',
		lineCd: '',
		lineCdDesc: '',
		lineClassCd: '',
		lineClassDesc: '',
		mbiRefNo: '',
		ocQuoted: '',
		openCoverTag: 'N',
		openQuotationNo: '',
		openingParag: '',
		policyId: '',
		policyNo: '',
		preparedBy: '',
		principalId: '',
		principalName: '',
		printDate: '',
		printedBy: '',
		quotationNo: '',
		quoteId: '',
		quoteRevNo: '',
		quoteSeqNo: '',
		quoteYear: '',
		reasonCd: '',
		reasonDesc: '',
		reinsurerId: '',
		reinsurerName: '',
		reqBy: '',
		reqDate: '',
		reqMode: '',
		status: '',
		statusDesc: '',
		updateDate: '',
		updateUser: ''
	};

	currencyAbbr: string = "";
	currencyRt: number = 0;
	intId: number;
	intName: string = "";
	errorMdlMessage: string = "";
	savingType: string = "";

	@Output() checkQuoteId = new EventEmitter<any>();
	@Input() quoteInfo = {
		quoteId: '',
		quotationNo: '',
		riskName: '',
		insuredDesc: '',
		currencyCd: '',
		currencyRt:''
	}
	loading:boolean = true;

	constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private route: ActivatedRoute, private maintenanceService: MaintenanceService) { }
	ngOnInit() {
		this.titleService.setTitle("Quo | General Info");
		this.tHeader.push("Item No", "Description of Items");
		this.dataTypes.push("text", "text");
		this.filters.push("Item No", "Desc. of Items");
		this.tableData = this.quotationService.getItemInfoData();

		this.savingType = this.quotationService.savingType;

		this.sub = this.route.params.subscribe(params => {
			if(params['addParams'] != undefined){
				this.internalCompFlag = JSON.parse(params['addParams']).intComp == undefined ? false : JSON.parse(params['addParams']).intComp; //neco				
			}
			this.from = params['from'];
			if (this.from == "quo-processing") {
				this.line = params['line'];
			}
		});

		if (this.quotationService.toGenInfo[0] == "edit") {
			this.sub = this.route.params.subscribe(params => {
				this.from = params['from'];
				if (this.from == "quo-processing") {
					this.typeOfCession = params['typeOfCession'];
					this.quotationNo = (this.quoteInfo.quotationNo === '') ? params['quotationNo'] : this.quoteInfo.quotationNo;
				}
			});

			this.quotationService.getQuoteGenInfo('', this.plainQuotationNo(this.quotationNo)).subscribe(data => {
				this.loading = false;
				if(data['quotationGeneralInfo'] != null) {
					this.genInfoData = data['quotationGeneralInfo'];						
					this.genInfoData.createDate = (this.genInfoData.createDate == null) ? '' : this.dateParser(this.genInfoData.createDate);
					this.genInfoData.expiryDate = (this.genInfoData.expiryDate == null) ? '' : this.dateParser(this.genInfoData.expiryDate);
					this.genInfoData.issueDate 	= (this.genInfoData.issueDate == null) ? '' : this.dateParser(this.genInfoData.issueDate);
					this.genInfoData.printDate 	= (this.genInfoData.printDate == null) ? '' : this.dateParser(this.genInfoData.printDate);
					this.genInfoData.reqDate 	= (this.genInfoData.reqDate == null) ? '' : this.dateParser(this.genInfoData.reqDate);
					this.genInfoData.updateDate = (this.genInfoData.updateDate == null) ? '' : this.dateParser(this.genInfoData.updateDate);

					if(this.savingType === 'internalComp') {
						this.genInfoData.quoteId = '';
						this.genInfoData.quotationNo = '';
						this.genInfoData.cedingId = '';
						this.genInfoData.cedingName = '';
					} else if (this.savingType === 'modification') {
						this.genInfoData.quoteId = '';
						this.genInfoData.quotationNo = '';
						this.genInfoData.quoteRevNo = '';
					}

				}

				if(data['project'] != null) {
					this.project = data['project'];
					this.project.createDate = this.dateParser(this.project.createDate);
					this.project.updateDate = this.dateParser(this.project.updateDate);
				}

				this.checkQuoteIdF(this.genInfoData.quoteId);
			});

		} else {
			this.loading = false;
			this.route.params.subscribe(params => {	
				this.genInfoData.lineCd 		= this.line;			
				this.genInfoData.cessionId 		= JSON.parse(params['addParams']).cessionId;
				this.genInfoData.cessionDesc 	= JSON.parse(params['addParams']).cessionDesc;
				this.genInfoData.quoteYear 		= new Date().getFullYear().toString();
				this.genInfoData.quoteRevNo 	= '0';
				this.genInfoData.status 		= '1';
				this.genInfoData.statusDesc 	= 'Requested';
				this.genInfoData.issueDate		= new Date().toISOString();
				this.genInfoData.createUser		= 'USER'; //JSON.parse(window.localStorage.currentUser).username;
				this.genInfoData.createDate		= new Date().toISOString();
				this.genInfoData.updateUser		= 'USER'; //JSON.parse(window.localStorage.currentUser).username;
				this.genInfoData.updateDate		= new Date().toISOString();
				this.project.projId 			= '1';

				this.maintenanceService.getMtnRisk(JSON.parse(params['addParams']).riskId).subscribe(data => {				
					var risk = data['risk'];

					this.project.blockCd 		= risk.blockCd;
					this.project.blockDesc 		= risk.blockDesc;
					this.project.cityCd 		= risk.cityCd;
					this.project.cityDesc 		= risk.cityDesc;
					this.project.districtCd 	= risk.districtCd;
					this.project.districtDesc 	= risk.districtDesc;
					this.project.provinceCd 	= risk.provinceCd;
					this.project.provinceDesc 	= risk.provinceDesc;
					this.project.regionCd 		= risk.regionCd;
					this.project.regionDesc 	= risk.regionDesc;
					this.project.riskId 		= risk.riskId;
					this.project.riskName 		= risk.riskName;
					this.project.latitude 		= risk.latitude;
					this.project.longitude 		= risk.longitude;

				});
			});

		}
	}


	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	checkTypeOfCession() {
		return (this.genInfoData.cessionDesc.toUpperCase() === 'RETROCESSION') ? true : false;
	}

	//getting value
	func(a: string, b: Date) {
		this.quotationGenInfo.createdBy = a;
		this.quotationGenInfo.lastUpdate = b;
	}

	defaultValues(year: Date) {
		year = new Date();
		year.getFullYear();
	}

	showItemInfoModal(content) {
		this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
	}

	showPrincipalLOV(){
		$('#principalLOV #modalBtn').trigger('click');
	}

	setPrincipal(data){
		this.genInfoData.principalName = data.insuredName;
		this.genInfoData.principalId = data.insuredId;

		this.updateInsuredDesc();
		this.focusBlur();
	}

	showContractorLOV(){
		$('#contractorLOV #modalBtn').trigger('click');
	}


	showLineClassLOV(){
		$('#lineClassLOV #modalBtn').trigger('click');
	}

	showIntLOV(){
		$('#intLOV #modalBtn').trigger('click');
	}


	setContractor(data){
		this.genInfoData.contractorName = data.insuredName;
		this.genInfoData.contractorId = data.insuredId;

		this.updateInsuredDesc();
		this.focusBlur();
		
	}

	showCurrencyModal(){
		$('#currencyModal #modalBtn').trigger('click');
	}

	setCurrency(data){
		this.genInfoData.currencyCd = data.currencyAbbr;
		this.genInfoData.currencyRt = data.currencyRt;
		this.focusBlur();

	}


	plainQuotationNo(data: string){
		var arr = data.split('-');

		return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
	}

	showCedingCompanyLOV() {
		$('#cedingCompany #modalBtn').trigger('click');
	}


	setCedingcompany(event){
		this.genInfoData.cedingId = event.coNo;
		this.genInfoData.cedingName = event.name;
		this.focusBlur();
	}

	showCedingCompanyNotMemberLOV() {
		$('#cedingCompanyNotMember #modalBtn').trigger('click');

	}

	setReinsurer(event) {
		this.genInfoData.reinsurerId = event.coNo;
		this.genInfoData.reinsurerName = event.name;
		this.focusBlur();
	}
/*
	showInsuredLOV(){
		$('#insuredLOV #modalBtn').trigger('click');
	}

	setInsured(data){
		//this.genInfoData.principal = data.insuredId;
		this.genInfoData.insuredDesc = data.insuredName;
	}*/


	setLineClass(data){
		this.genInfoData.lineClassCd = data.lineClassCd;
        this.genInfoData.lineClassDesc = data.lineClassCdDesc;
        this.focusBlur();
    }

    setInt(event){
        this.genInfoData.intmId = event.intmId;
        this.genInfoData.intmName = event.intmName;
        this.focusBlur();

    }

	dateParser(arr) {
		function pad(num){
			return (num < 10) ? '0' + num : num;
		}

		return new Date(arr[0] + '-' + pad(arr[1]) + '-' + pad(arr[2])).toISOString();   
	}

	saveQuoteGenInfo() {
		this.saveBtnClicked = true;
		this.loading = true;
		if(this.validate(this.prepareParam())){
			this.focusBlur();

			this.quotationService.saveQuoteGeneralInfo(JSON.stringify(this.prepareParam())).subscribe(data => {
				this.loading = false;
				if(data['returnCode'] == 0) {
					this.errorMdlMessage = data['errorList'][0].errorMessage;
					$('#errorMdl > #modalBtn').trigger('click');
				} else {
					this.genInfoData.quoteId = data['quoteId'];
					this.genInfoData.quotationNo = data['quotationNo'];
					this.genInfoData.quoteSeqNo = parseInt(data['quotationNo'].split('-')[2]);
					this.genInfoData.quoteRevNo = parseInt(data['quotationNo'].split('-')[3]);
					this.genInfoData.updateUser = 'USER'; //JSON.parse(window.localStorage.currentUser).username;
					this.genInfoData.updateDate		= new Date().toISOString();

					this.checkQuoteIdF(this.genInfoData.quoteId);

					this.quotationService.toGenInfo[0] = 'edit';
					this.quotationService.savingType = 'normal';

					$('#successMdl > #modalBtn').trigger('click');
						//for internal comp
						if(this.savingType === 'internalComp'){
							
							var internalCompParams: any[] = [{
							  adviceNo: 0,
							  cedingId: this.genInfoData.cedingId,
							  cedingRepId: this.genInfoData.cedingId,
							  createDate: new Date().toISOString(),
							  createUser: 'ndc',
							  option: '',
							  quoteId: this.genInfoData.quoteId,
							  updateDate: new Date().toISOString(),
							  updateUser: 'ndc',
							  wordings: ''
							}];
					        this.quotationService.saveQuoteCompetition(internalCompParams).subscribe((result: any) => {
					          console.log(result);
					        });
						}
						//end internal comp
				}
			});
		} else {
			this.loading = false;
			this.errorMdlMessage = "Please complete all the required fields.";
			$('#errorMdl > #modalBtn').trigger('click');

			this.focusBlur();
		}

	}

	prepareParam() {
		var saveQuoteGeneralInfoParam = {
			"savingType"    : this.savingType,
			"approvedBy"	: this.genInfoData.approvedBy,
			"cedingId"		: this.genInfoData.cedingId,
			"cessionId"		: this.genInfoData.cessionId,
			"closingParag"	: this.genInfoData.closingParag,
			"contractorId"	: this.genInfoData.contractorId,
			"createDate"	: this.genInfoData.createDate,
			"createUser"	: this.genInfoData.createUser,
			"currencyCd"	: this.genInfoData.currencyCd,
			"currencyRt"	: this.genInfoData.currencyRt,
			"declarationTag": this.genInfoData.declarationTag,
			"duration"		: this.project.duration,
			"expiryDate"	: this.genInfoData.expiryDate,
			"govtTag"		: this.genInfoData.govtTag,
			"indicativeTag"	: this.genInfoData.indicativeTag,
			"insuredDesc"	: this.genInfoData.insuredDesc,
			"intmId"		: this.genInfoData.intmId,
			"ipl"			: this.project.ipl,
			"issueDate"		: this.genInfoData.issueDate,
			"lineCd"		: this.genInfoData.lineCd,
			"lineClassCd"	: this.genInfoData.lineClassCd,
			"mbiRefNo"		: this.genInfoData.mbiRefNo,
			"noClaimPd"		: this.project.noClaimPd,
			"objectId"		: this.project.objectId,
			"openCoverTag"	: this.genInfoData.openCoverTag,
			"openingParag"	: this.genInfoData.openingParag,
			"pctShare"		: this.project.pctShare,
			"policyId"		: this.genInfoData.policyId,
			"preparedBy"	: this.genInfoData.preparedBy,
			"prinId"		: this.genInfoData.principalId,
			"printDate"		: this.genInfoData.printDate,
			"printedBy"		: this.genInfoData.printedBy,
			"prjCreateDate"	: this.genInfoData.createDate,//this.project.createDate,
			"prjCreateUser"	: this.genInfoData.createUser,//this.project.createUser,
			"prjUpdateDate"	: this.genInfoData.updateDate,//this.project.updateDate,
			"prjUpdateUser"	: this.genInfoData.updateUser,//this.project.updateUser,
			"projDesc"		: this.project.projDesc,
			"projId"		: this.project.projId,
			"quoteId"		: this.genInfoData.quoteId,
			"quoteRevNo"	: this.genInfoData.quoteRevNo,
			"quoteSeqNo"	: this.genInfoData.quoteSeqNo,
			"quoteYear"		: this.genInfoData.quoteYear,
			"reinsurerId"	: this.genInfoData.reinsurerId,
			"reqBy"			: this.genInfoData.reqBy,
			"reqDate"		: this.genInfoData.reqDate,
			"reqMode"		: this.genInfoData.reqMode,
			"riskId"		: this.project.riskId,
			"site"			: this.project.site,
			"status"		: this.genInfoData.status,
			"testing"		: this.project.testing,
			"timeExc"		: this.project.timeExc,
			"totalSi"		: this.project.totalSi,
			"totalValue"	: this.project.totalValue,
			"updateDate"	: this.genInfoData.updateDate,
			"updateUser"	: this.genInfoData.updateUser
		}

		if(this.quotationService.toGenInfo[0] === 'edit' && this.savingType === 'normal') {
			saveQuoteGeneralInfoParam.updateUser = 'USER'; //JSON.parse(window.localStorage.currentUser).username;
			saveQuoteGeneralInfoParam.updateDate = new Date().toISOString();
			saveQuoteGeneralInfoParam.prjUpdateUser = 'USER'; //JSON.parse(window.localStorage.currentUser).username;
			saveQuoteGeneralInfoParam.prjUpdateDate = new Date().toISOString();
		}

		return saveQuoteGeneralInfoParam;
	}

	toDateTime(val) {
		return new Date(val).toISOString();
	}

	showObjectLOV() {
		$('#objIdLov #modalBtn').trigger('click');
	}

	setObj(data){
    	this.project.objectId = data.objectId;
    	this.project.objectDesc = data.description;
    	this.focusBlur();
  	}

  	showOpeningWordingLov(){
  		$('#wordingOpeningIdLov #modalBtn').trigger('click');
  	}

  	setOpeningWording(data) {
  		this.genInfoData.openingParag = data.wording;
  		this.focusBlur();
  	}

  	showClosingWordingLov(){
  		$('#wordingClosingIdLov #modalBtn').trigger('click');
  	}

  	setClosingWording(data) {  		
  		this.genInfoData.closingParag = data.wording;
  		this.focusBlur();
  	}

  	updateInsuredDesc() {
  		if(this.line == 'CAR' || this.line == 'EAR'){
  			if(this.genInfoData.principalName != '' && this.genInfoData.contractorName != ''){
  				this.genInfoData.insuredDesc = this.genInfoData.principalName.trim() + ' / ' + this.genInfoData.contractorName.trim();
  			}
  		} else {
  			this.genInfoData.insuredDesc = this.genInfoData.principalName.trim();
  		}
  	}
  		
  	checkQuoteIdF(event){
  		this.checkQuoteId.emit({
  			quoteId: event,
  			quotationNo: this.genInfoData.quotationNo,
  			riskName: this.project.riskName,
  			insuredDesc: this.genInfoData.insuredDesc,
  			riskId: this.project.riskId, //added by paul
  			currencyCd: this.genInfoData.currencyCd,
  			currencyRt: this.genInfoData.currencyRt,
  		});		
  	}

  	validate(obj){
  		var req = ['cedingId','lineClassCd','prinId','insuredDesc','status','intmId',
  				   'issueDate','expiryDate','currencyCd','currencyRt','openingParag',
  				   'closingParag','projDesc','objectId','site'];

  		if(obj.lineCd === 'CAR' || obj.lineCd === 'EAR') {
  			req.push('contractorId', 'duration');
  		}

  		if(obj.lineCd === 'EAR') {
  			req.push('testing');
  		}

  		if(obj.lineCd === 'MLP') {
  			req.push('ipl', 'timeExc');
  		}

  		if(obj.lineCd === 'DOS') {
  			req.push('noClaimPd');
  		}

  		if(obj.cessionId == 2) {
  			req.push('reinsurerId');
  		}

  		if(obj.lineCd === 'MLP' || obj.lineCd === 'DOS') {
  			req.push('mbiRefNo');
  		}  		

  		var entries = Object.entries(obj);

		for(var [key, val] of entries) {
			if((val === '' || val == null) && req.includes(key)){
				return false;
			}
		}

		return true;
  	}

  	focusBlur() {
  		if(this.saveBtnClicked){
  			setTimeout(()=>{
  				$('.req').focus();
				$('.req').blur();
  			},0)  
  		}
  	}

  	checkCode(field) {
  		if(field === 'object') {
  			this.objectLov.checkCode(this.line, this.project.objectId);
  		}
  	}
}
export interface SelectRequestMode {
	name: string;
	value: string;
}
