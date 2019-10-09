import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { QuotationGenInfo } from '../../_models';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';
import { QuotationService, MaintenanceService, NotesService, UserService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { MtnCedingCompanyComponent } from '@app/maintenance/mtn-ceding-company/mtn-ceding-company.component';
import { MtnIntermediaryComponent } from '@app/maintenance/mtn-intermediary/mtn-intermediary.component';
import { MtnInsuredComponent } from '@app/maintenance/mtn-insured/mtn-insured.component';
import { MtnObjectComponent } from '@app/maintenance/mtn-object/mtn-object.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';

@Component({
	selector: 'app-general-info',
	templateUrl: './general-info.component.html',
	styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {  
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
	@ViewChild(MtnCedingCompanyComponent) cedingCoNotMemberLov: CedingCompanyComponent;
	@ViewChild(MtnIntermediaryComponent) intermediaryLov: MtnIntermediaryComponent;
	@ViewChildren(MtnInsuredComponent) insuredLovs: QueryList<MtnInsuredComponent>;
	@ViewChild(MtnObjectComponent) objectLov: MtnObjectComponent;
	@ViewChild(MtnCurrencyComponent) currencyLov: MtnCurrencyComponent;
	@ViewChild(MtnUsersComponent) usersLov: MtnUsersComponent;

	private quotationGenInfo: QuotationGenInfo;
	rowData: any[] = this.quotationService.rowData;
	quoteId: string;
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
	cancelFlag: boolean;
	dialogIcon:string;
	dialogMessage:string;
	a: string = '';
	b: string = '';

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
		altWordings: '',
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
		currencyRt:'',
		showAlop: false
	}

	loading:boolean = true;
	excludeCedingCo: any[] = [];
	tempQuoteIdInternalComp = "";
	tempQuoteIdModification = "";

	@Output() enblEndtTab = new EventEmitter<any>(); //Paul
	@Output() enblOptTab = new EventEmitter<any>(); //Paul
	//@Output() enblQuoteOpTab = new EventEmitter<any>(); //EJVA

	constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title,
			    private route: ActivatedRoute, private maintenanceService: MaintenanceService, private ns: NotesService, private userService: UserService) { }
	ngOnInit() {
		this.titleService.setTitle("Quo | General Info");
		this.userService.emitModuleId("QUOTE002");
		this.tHeader.push("Item No", "Description of Items");
		this.dataTypes.push("text", "text");
		this.filters.push("Item No", "Desc. of Items");

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
					this.quotationNo = (this.quoteInfo.quotationNo === '') ? params['quotationNo'] : this.quoteInfo.quotationNo;
					this.quoteId = (this.quoteInfo.quoteId === '') ? params['quoteId'] : this.quoteInfo.quoteId;

					if(params['exclude'] != undefined) {
						this.excludeCedingCo = params['exclude'].split(',');
					}

					if(params['tempQuoteIdInternalComp'] != undefined) {
						this.tempQuoteIdInternalComp = params['tempQuoteIdInternalComp'];
					}
				}
			});

			this.quotationService.getQuoteGenInfo(this.quoteId, this.plainQuotationNo(this.quotationNo)).subscribe(data => {
				this.loading = false;
				if(data['quotationGeneralInfo'] != null) {
					this.genInfoData = data['quotationGeneralInfo'];
					this.genInfoData.principalId = String(this.genInfoData.principalId).padStart(6,'0')
        			this.genInfoData.contractorId = this.genInfoData.contractorId != null ? String(this.genInfoData.contractorId).padStart(6,'0'):null;
        			this.genInfoData.intmId = this.genInfoData.intmId != null ? String(this.genInfoData.intmId).padStart(6, '0') : '';			
					this.genInfoData.createDate = (this.genInfoData.createDate == null) ? '' : this.ns.toDateTimeString(this.genInfoData.createDate);
					this.genInfoData.expiryDate = (this.genInfoData.expiryDate == null) ? '' : this.ns.toDateTimeString(this.genInfoData.expiryDate);
					this.genInfoData.issueDate 	= (this.genInfoData.issueDate == null) ? '' : this.ns.toDateTimeString(this.genInfoData.issueDate);
					this.genInfoData.printDate 	= (this.genInfoData.printDate == null) ? '' : this.ns.toDateTimeString(this.genInfoData.printDate);
					this.genInfoData.reqDate 	= (this.genInfoData.reqDate == null) ? '' : this.ns.toDateTimeString(this.genInfoData.reqDate);
					this.genInfoData.updateDate = (this.genInfoData.updateDate == null) ? '' : this.ns.toDateTimeString(this.genInfoData.updateDate);

					if(this.savingType === 'internalComp') {
						this.genInfoData.quoteId = '';
						this.genInfoData.quotationNo = '';
						this.genInfoData.cedingId = '';
						this.genInfoData.cedingName = '';
					} else if (this.savingType === 'modification') {
						this.tempQuoteIdModification = this.genInfoData.quoteId;
						this.genInfoData.quoteId = '';
						this.genInfoData.quotationNo = '';
						this.genInfoData.quoteRevNo = '';
						this.genInfoData.statusDesc = '';
						this.genInfoData.approvedBy = '';
						this.genInfoData.printDate = '';
						this.genInfoData.printedBy = '';
						this.genInfoData.altWordings = '';
						this.genInfoData.createUser = '';
						this.genInfoData.updateUser = '';
						this.genInfoData.createDate = '';
						this.genInfoData.updateDate = '';

						this.maintenanceService.getMtnQuotationWordings(this.line,'A').subscribe(data => {
							if(data['quoteWordings'] != null) {
								for(let word of data['quoteWordings']) {
									if(word.defaultTag === 'Y') {
										this.genInfoData.altWordings = word.wording;
									}
								}
							}
						});

						this.maintenanceService.getRefCode('QUOTE_GEN_INFO.STATUS').subscribe(data => {
							this.genInfoData.status = data['refCodeList'].filter(a => a.description.toUpperCase() === 'IN PROGRESS')[0].code;
						});
					}

					setTimeout(() => {
						$('input[appCurrencyRate]').focus();
						$('input[appCurrencyRate]').blur();
					},0) 
				}

				if(data['project'] != null) {
					this.project = data['project'];
					this.project.createDate = this.ns.toDateTimeString(this.project.createDate);
					this.project.updateDate = this.ns.toDateTimeString(this.project.updateDate);
					this.project.objectId = this.pad(this.project.objectId);
					this.checkDecimal('totalValue');
					this.checkDecimal('pctShare');
				}

				this.checkQuoteIdF(this.genInfoData.quoteId);
			});

			if(this.line === 'CAR' || this.line === 'EAR'){
			 // 	this.quotationService.getCoverageInfo(this.plainQuotationNo(this.quotationNo),null).subscribe((data: any) =>{
			 //     this.quoteInfo.showAlop = data.quotation.project.coverage.sectionCovers.filter(a=>{
			 //       return a.section == 'III'
			 //     }).length >0;		     
		  	 // 	});
		  	 //changed to check quote option
		  		this.quotationService.getQuoteOptions(null,this.plainQuotationNo(this.quotationNo)).subscribe(data => {
		  			if(data['quotation'] !== null)
			           first:for(let option of data['quotation'].optionsList){
			             for(let otherRate of option.otherRatesList){
			               if(otherRate.section == 'III'){
			                 this.quoteInfo.showAlop = true;
			                 break first;
			               }
			             }
			           }
			    });
			}

		/*setTimeout(() => { 
			$('.ng-dirty').removeClass('ng-dirty');

			
		},1000);*/

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
				this.genInfoData.issueDate		= this.ns.toDateTimeString(0);
				this.genInfoData.reqDate		= this.ns.toDateTimeString(0);
				this.genInfoData.preparedBy		= this.ns.getCurrentUser();
				
				var date = new Date();
				var millis = date.setDate(date.getDate() + 30);

				this.genInfoData.expiryDate		= this.ns.toDateTimeString(millis);	
				this.project.projId 			= '1';
				this.project.pctShare  			= 100;

				this.maintenanceService.getMtnCurrency('PHP','Y').subscribe(data => {
					var curr = data['currency'][0];

					this.genInfoData.currencyCd = curr.currencyCd;
					this.genInfoData.currencyRt = curr.currencyRt;

					setTimeout(() => {
						$('input[appCurrencyRate]').focus();
						$('input[appCurrencyRate]').blur();
					},0)
				});

				this.maintenanceService.getLineClassLOV(this.line).subscribe(data => {					
					if(data['lineClass'].length == 1) {
						var lc = data['lineClass'][0];

						this.genInfoData.lineClassCd = lc.lineClassCd;
						this.genInfoData.lineClassDesc = lc.lineClassCdDesc;
					} 
				});

				this.maintenanceService.getMtnQuotationWordings(this.line,'O').subscribe(data => {
					for(let word of data['quoteWordings']) {
						if(word.defaultTag === 'Y') {
							this.genInfoData.openingParag = word.wording;
						}
					}
				});

				this.maintenanceService.getMtnQuotationWordings(this.line,'C').subscribe(data => {
					for(let word of data['quoteWordings']) {
						if(word.defaultTag === 'Y') {
							this.genInfoData.closingParag = word.wording;
						}
					}
				});

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

				this.checkQuoteIdF(this.genInfoData.quoteId);
			});

		}
		setTimeout(() => {
			$("#firstFocus").focus();
			$('.ng-dirty').removeClass('ng-dirty');

			if(this.savingType == 'modification') {
				$('#wordingAltIdLov #modalBtn').addClass('ng-dirty');
			}
		},1000);

		this.getLineClass();
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
		$('#hiddenInp').addClass('ng-touched ng-dirty');

		this.genInfoData.principalName = data.insuredName;
		this.genInfoData.principalId = data.insuredId;
		this.ns.lovLoader(data.ev, 0);

		this.updateInsuredDesc();
		this.focusBlur();
	}

	showContractorLOV(){
		$('#contractorLOV #modalBtn').trigger('click');
	}


	showLineClassLOV(){
		$('#lineClassLOV #modalBtn').trigger('click');
		$('#lineClassLOV #modalBtn').addClass('ng-dirty')
	}

	showIntLOV(){
		$('#intLOV #modalBtn').trigger('click');
	}


	setContractor(data){
		$('#hiddenInp').addClass('ng-touched ng-dirty');

		this.genInfoData.contractorName = data.insuredName;
		this.genInfoData.contractorId = data.insuredId;
		this.ns.lovLoader(data.ev, 0);

		this.updateInsuredDesc();
		this.focusBlur();
		
	}

	showCurrencyModal(){
		$('#currencyModal #modalBtn').trigger('click');
	}

	setCurrency(data){
		$('#hiddenInp').addClass('ng-touched ng-dirty');

		this.genInfoData.currencyCd = data.currencyCd;
		this.genInfoData.currencyRt = data.currencyRt;
		this.ns.lovLoader(data.ev, 0);

		setTimeout(() => {
			$('input[appCurrencyRate]').focus();
			$('input[appCurrencyRate]').blur();
		},0) 

	}


	plainQuotationNo(data: string){
		var arr = data.split('-');

		return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + arr[4];
	}

	showCedingCompanyLOV(event?) {
		$('#cedingCompany #modalBtn').trigger('click');
	}


	setCedingcompany(event){
		$('#hiddenInp').addClass('ng-touched ng-dirty');

		this.genInfoData.cedingId = this.pad(event.cedingId);
		this.genInfoData.cedingName = event.cedingName;
		this.ns.lovLoader(event.ev, 0);
		this.focusBlur();
	}

	showCedingCompanyNotMemberLOV() {
		$('#cedingCompanyNotMember #modalBtn').trigger('click');
	}

	setReinsurer(event) {
		$('#hiddenInp').addClass('ng-touched ng-dirty');

		this.genInfoData.reinsurerId = this.pad(event.cedingId);
		this.genInfoData.reinsurerName = event.cedingName;
		this.ns.lovLoader(event.ev, 0);
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
    	$('#hiddenInp').addClass('ng-touched ng-dirty');

        this.genInfoData.intmId = this.pad(event.intmId, 6);
        this.genInfoData.intmName = event.intmName;
        this.ns.lovLoader(event.ev, 0);
        this.focusBlur();

    }

	dateParser(arr) {
		function pad(num){
			return (num < 10) ? '0' + num : num;
		}

		return new Date(arr[0] + '-' + pad(arr[1]) + '-' + pad(arr[2])).toISOString();   
	}

	saveQuoteGenInfo(cancelFlag?) {
		this.cancelFlag = cancelFlag !== undefined;
		this.saveBtnClicked = true;
		this.loading = true;
		if(this.validate(this.prepareParam())){
			this.focusBlur();

			this.quotationService.saveQuoteGeneralInfo(JSON.stringify(this.prepareParam())).subscribe(data => {
				this.loading = false;
				if(data['returnCode'] == 0) {
					this.dialogMessage = data['errorList'][0].errorMessage;
					this.dialogIcon = "error";
					$('#genInfo #successModalBtn').trigger('click');
				} else {
					this.genInfoData.quoteId = data['quoteId'];
					this.genInfoData.quotationNo = data['quotationNo'];
					this.genInfoData.quoteSeqNo = parseInt(data['quotationNo'].split('-')[2]);
					this.genInfoData.quoteRevNo = parseInt(data['quotationNo'].split('-')[3]);
					if(this.quotationService.toGenInfo[0] === 'add') {
						this.genInfoData.createUser = this.ns.getCurrentUser();
						this.genInfoData.createDate = this.ns.toDateTimeString(0);
					} else if(this.quotationService.toGenInfo[0] === 'edit' && this.savingType === 'modification') {
						this.genInfoData.statusDesc = 'In Progress';
						this.genInfoData.createUser = this.ns.getCurrentUser();
						this.genInfoData.createDate = this.ns.toDateTimeString(0);
					}
					this.genInfoData.updateUser = this.ns.getCurrentUser();
					this.genInfoData.updateDate	= this.ns.toDateTimeString(0);

					this.checkQuoteIdF(this.genInfoData.quoteId);

					this.quotationService.toGenInfo[0] = 'edit';
					this.quotationService.savingType = 'normal';

		            this.dialogMessage="";
		            this.dialogIcon = "";
		            $('.ng-dirty').removeClass('ng-dirty');
					$('#genInfo #successModalBtn').trigger('click');
						//for internal comp
						if(this.savingType === 'internalComp'){
							
							var internalCompParams: any[] = [{
							  adviceNo: 0,
							  cedingId: this.genInfoData.cedingId,
							  cedingRepId: 0,
							  createDate: this.ns.toDateTimeString(0),
							  createUser: this.ns.getCurrentUser(),
							  quoteId: this.genInfoData.quoteId,
							  updateDate: this.ns.toDateTimeString(0),
							  updateUser: this.ns.getCurrentUser(),
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
			this.dialogIcon = "error";
			this.dialogMessage = "Please complete all the required fields.";
			$('#genInfo #successModalBtn').trigger('click');
			setTimeout(()=>{$('.globalLoading').css('display','none');},0);
       		

			//this.focusBlur();
		}

	}

	prepareParam() {
		var saveQuoteGeneralInfoParam = {
			"savingType"    : this.quotationService.savingType,
			"altWordings"	: this.genInfoData.quoteRevNo != 0 ? this.genInfoData.altWordings.trim() : '',
			"approvedBy"	: this.genInfoData.approvedBy,
			"cedingId"		: this.genInfoData.cedingId,
			"cessionId"		: this.genInfoData.cessionId,
			"closingParag"	: this.genInfoData.closingParag.trim(),
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
			"openingParag"	: this.genInfoData.openingParag.trim(),
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
			"regionCd"		: this.project.regionCd,
			"provinceCd"	: this.project.provinceCd,
			"cityCd"		: this.project.cityCd,
			"districtCd"	: this.project.districtCd,
			"blockCd"		: this.project.blockCd,
			"latitude"		: this.project.latitude,
			"longitude"		: this.project.longitude,
			"site"			: this.project.site,
			"status"		: this.genInfoData.status,
			"testing"		: this.project.testing,
			"timeExc"		: this.project.timeExc,
			"totalSi"		: this.project.totalSi,
			"totalValue"	: this.project.totalValue,
			"updateDate"	: this.genInfoData.updateDate,
			"updateUser"	: this.genInfoData.updateUser
		}

		if(this.quotationService.toGenInfo[0] === 'edit') {
			saveQuoteGeneralInfoParam.updateUser = this.ns.getCurrentUser();
			saveQuoteGeneralInfoParam.updateDate = this.ns.toDateTimeString(0);
			saveQuoteGeneralInfoParam.prjUpdateUser = this.ns.getCurrentUser();
			saveQuoteGeneralInfoParam.prjUpdateDate = this.ns.toDateTimeString(0);
		} else if (this.quotationService.toGenInfo[0] === 'add') {
			saveQuoteGeneralInfoParam.createUser = this.ns.getCurrentUser();
			saveQuoteGeneralInfoParam.createDate = this.ns.toDateTimeString(0);
			saveQuoteGeneralInfoParam.updateUser = this.ns.getCurrentUser();
			saveQuoteGeneralInfoParam.updateDate = this.ns.toDateTimeString(0);
			saveQuoteGeneralInfoParam.prjCreateUser = this.ns.getCurrentUser();
			saveQuoteGeneralInfoParam.prjCreateDate = this.ns.toDateTimeString(0);
			saveQuoteGeneralInfoParam.prjUpdateUser = this.ns.getCurrentUser();
			saveQuoteGeneralInfoParam.prjUpdateDate = this.ns.toDateTimeString(0);
		}

		if(this.savingType === 'internalComp') {
			saveQuoteGeneralInfoParam['tempQuoteIdInternalComp'] = this.tempQuoteIdInternalComp;
		}

		if(this.savingType === 'modification') {
			saveQuoteGeneralInfoParam['altWordings'] = this.genInfoData.altWordings.trim();
			saveQuoteGeneralInfoParam['tempQuoteIdModification'] = this.tempQuoteIdModification;
			saveQuoteGeneralInfoParam['createUser'] = this.ns.getCurrentUser();
			saveQuoteGeneralInfoParam['createDate'] = this.ns.toDateTimeString(0);
			saveQuoteGeneralInfoParam['prjCreateUser'] = this.ns.getCurrentUser();
			saveQuoteGeneralInfoParam['prjCreateDate'] = this.ns.toDateTimeString(0);
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
		$('#hiddenInp').addClass('ng-touched ng-dirty');

    	this.project.objectId = this.pad(String(data.objectId));
    	this.project.objectDesc = data.description;
    	this.ns.lovLoader(data.ev, 0);

    	this.focusBlur();
  	}

  	showOpeningWordingLov(){
  		$('#wordingOpeningIdLov #modalBtn').trigger('click');
  	}

  	setOpeningWording(data) {
  		$('#hiddenInp').addClass('ng-touched ng-dirty');

  		this.genInfoData.openingParag = data.wording;
  		this.focusBlur();
  	}

  	showClosingWordingLov(){
  		$('#wordingClosingIdLov #modalBtn').trigger('click');
  	}

  	setClosingWording(data) {
  		$('#hiddenInp').addClass('ng-touched ng-dirty');

  		this.genInfoData.closingParag = data.wording;
  		this.focusBlur();
  	}

  	showAltWordingLov(){
  		$('#wordingAltIdLov #modalBtn').trigger('click');
  	}

  	setAltWording(data) {
  		$('#hiddenInp').addClass('ng-touched ng-dirty');
  		
  		this.genInfoData.altWordings = data.wording;
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
  			typeOfCession: this.genInfoData.cessionDesc,
  			status: this.genInfoData.status,
  			statusDesc: this.genInfoData.statusDesc,
  			reasonCd: this.genInfoData.reasonCd,
  			principalId: this.genInfoData.principalId,
  			lineCd: this.line,
  			showAlop: this.quoteInfo.showAlop,
  			cessionId: this.genInfoData.cessionId
  		});		
  		this.checkCoverage();//PAUL
  		this.checkQuoteOption(); //PAUL
  	}

  	validate(obj){
  		var req = ['cedingId','lineClassCd','prinId','insuredDesc','status','issueDate',
  				   'expiryDate','currencyCd','currencyRt','openingParag','closingParag',
  				   'projDesc','objectId','site'];

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

  		if(this.savingType === 'modification') {
  			req.push('altWordings');
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


  	checkCode(ev, field) {
  		this.ns.lovLoader(ev, 1);
  		$(ev.target).addClass('ng-dirty');

  		if(field === 'cedingCo') {
  			this.genInfoData.cedingId = this.pad(this.genInfoData.cedingId);  		  			

  			this.cedingCoLov.checkCode(this.genInfoData.cedingId, ev);
  		} else if(field === 'cedingCoNotMember') {
  			this.genInfoData.reinsurerId = this.pad(this.genInfoData.reinsurerId);

  			this.cedingCoNotMemberLov.checkCode(this.genInfoData.reinsurerId, ev);
  		} else if(field === 'intermediary') {
  			this.intermediaryLov.checkCode(this.genInfoData.intmId, ev);
  		} else if(field === 'principal') {
  			this.genInfoData.principalId = this.pad(this.genInfoData.principalId, 6);

  			this.insuredLovs['first'].checkCode(this.genInfoData.principalId, '#principalLOV', ev);

/*  			setTimeout(() => { this.genInfoData.principalId = this.pad(this.genInfoData.principalId, 6) },800);*/

  		} else if(field === 'contractor') {
  			this.insuredLovs['last'].checkCode(this.genInfoData.contractorId, '#contractorLOV', ev);
  		} else if(field === 'object') {	
  			this.objectLov.checkCode(this.line, this.project.objectId, ev);
  		} else if(field === 'currency') {
  			this.currencyLov.checkCode(this.genInfoData.currencyCd, ev);
  		} else if(field === 'preparedBy') {
  			this.usersLov.checkCode(this.genInfoData.preparedBy, ev);
  		}
  	}

  	onClickSave(){
  		$('#confirm-save #modalBtn2').trigger('click');
	}

	cancel(){
		this.cancelBtn.clickCancel();
	}

	pad(str, num?) {
		if(str === '' || str == null){
			return '';
		}
		
		return String(str).padStart(num != null ? num : 3, '0');
	}

	showUsersLOV() {
		$('#usersLOV #modalBtn').trigger('click');
		$('#usersLOV #modalBtn').addClass('ng-dirty');
	}

	setPreparedBy(data) {
		this.genInfoData.preparedBy = data.userId;
		this.ns.lovLoader(data.ev, 0);
	}

	updateExpiryDate(ev) {
		var d = new Date(ev);
		d.setDate(d.getDate() + 30);

		this.genInfoData.expiryDate = this.ns.toDateTimeString(d);
	}

	testFoc() {
		this.a = this.genInfoData.reqBy == '' || this.genInfoData.reqBy == null ? '<Quotation_Header.Requested_By>' : this.genInfoData.reqBy; 
	}

	testBlur() {
		this.b = this.genInfoData.reqBy == '' || this.genInfoData.reqBy == null ? '<Quotation_Header.Requested_By>' : this.genInfoData.reqBy;

		var reg = new RegExp(this.a, 'gi');

		this.genInfoData.openingParag = this.genInfoData.openingParag.replace(reg, this.b);
	}

	//paul
	checkQuoteOption(){
		this.quotationService.getQuoteOptions(this.genInfoData.quoteId).subscribe((data)=>{
			if(data['quotation'] != null && data['quotation'].optionsList.length!=0){
				this.enblEndtTab.emit(true);
				let alopFlag = false;
		           if(data['quotation'] !== null)
		           first:for(let option of data['quotation'].optionsList){
		             for(let otherRate of option.otherRatesList){
		               if(otherRate.section == 'III'){
		                 alopFlag = true;
		                 break first;
		               }
		             }
		           }
		           this.quoteInfo.showAlop = alopFlag;
			}
		})
	}

	checkCoverage(){
		this.quotationService.getCoverageInfo(null,this.genInfoData.quoteId).subscribe((data: any) => {
			this.enblOptTab.emit(data.quotation.project!==null);
		})
	}

	cbToggle(ev) {
		$(ev.target).addClass('ng-dirty');
	}

	lineClasses: any[] = [];
	getLineClass(){
    this.maintenanceService.getLineClassLOV(this.line).subscribe(a=>{
      this.lineClasses = a['lineClass'];
    })
  }

  compute(ev,str) {
  	$(ev.target).addClass('ng-dirty');

  	if(str === 'pctShare' && this.project.totalSi != '') {
  		if(Number(this.project.pctShare) > 100) {
  			this.project.pctShare = '';
  			this.project.totalValue = '';
  		} else {
  			var val = Number(this.project.totalSi) / (Number(this.project.pctShare)/100);
  			this.project.totalValue = String(val).indexOf('.') === -1 && String(val) != 'Infinity' ? String(val) + '.00' : String(val) === 'Infinity' ? '' : val;	
  		}  		
  	} else if (str === 'totalValue' && this.project.totalSi != '') {
  		if(Number(this.project.totalValue) < Number(this.project.totalSi)) {
  			this.project.pctShare = '';
  			this.project.totalValue = '';
  		} else {
  			var val = Math.round(((Number(this.project.totalSi) / Number(this.project.totalValue)) * 100) * 1e10) / 1e10;
  			this.project.pctShare = String(val);
  			this.checkDecimal('pctShare');
  		}  		
  	}
  }

  checkDecimal(str) {
  	if(str === 'totalValue') {
  		if(String(this.project.totalValue) != '' && this.project.totalValue != null) {
  			var tvArr = String(this.project.totalValue).split('.');
  			tvArr[1] = tvArr[1] === undefined ? '00' : tvArr[1].padEnd(2, '0');
  			this.project.totalValue = tvArr.join('.');
  		}
  	} else if(str === 'pctShare') {
  		if(String(this.project.pctShare) != '' && this.project.pctShare != null) {
  			var pctArr = String(this.project.pctShare).split('.');
  			pctArr[1] = pctArr[1] === undefined ? '0000000000' : pctArr[1].padEnd(10, '0');
  			this.project.pctShare = pctArr.join('.');
  		}
  	}
  }

}
export interface SelectRequestMode {
	name: string;
	value: string;
}
