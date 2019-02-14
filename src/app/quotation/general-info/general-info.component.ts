import { Component, OnInit } from '@angular/core';
import { QuotationGenInfo } from '../../_models';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';
import { QuotationService, MaintenanceService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-general-info',
	templateUrl: './general-info.component.html',
	styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {
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
		declarationTag: '',
		expiryDate: '',
		govtTag: '',
		indicativeTag: '',
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
		openCoverTag: '',
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
		updateDate: '',
		updateUser: ''
	};

	currencyAbbr: string = "";
	currencyRt: number = 0;
	intId: number;
	intName: string = "";

	constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private route: ActivatedRoute, private maintenanceService: MaintenanceService) { }
	ngOnInit() {
		this.titleService.setTitle("Quo | General Info");
		this.tHeader.push("Item No", "Description of Items");
		this.dataTypes.push("text", "text");
		this.filters.push("Item No", "Desc. of Items");
		this.tableData = this.quotationService.getItemInfoData();

		this.sub = this.route.params.subscribe(params => {
			this.from = params['from'];
			if (this.from == "quo-processing") {
				this.line = params['line'];
				this.typeOfCession = params['typeOfCession'];				
			}
		});

		if (this.quotationService.toGenInfo[0] == "edit") {
			this.sub = this.route.params.subscribe(params => {
				this.from = params['from'];
				if (this.from == "quo-processing") {
					this.line = params['quotationNo'].split('-')[0];
					this.typeOfCession = params['typeOfCession'];
					this.quotationNo = params['quotationNo'];
					this.typeOfCession = this.typeOfCession;
				}
			});

			this.quotationService.getQuoteGenInfo('', this.plainQuotationNo(this.quotationNo)).subscribe(data => {
				
				if(data['quotationGeneralInfo'] != null) {
					this.genInfoData = data['quotationGeneralInfo'];						
					this.genInfoData.createDate = this.dateParser(this.genInfoData.createDate);
					this.genInfoData.expiryDate = this.dateParser(this.genInfoData.expiryDate);
					this.genInfoData.issueDate = this.dateParser(this.genInfoData.issueDate);
					this.genInfoData.printDate = (this.genInfoData.printDate == null) ? '' : this.dateParser(this.genInfoData.issueDate);
					this.genInfoData.reqDate = this.dateParser(this.genInfoData.reqDate);
					this.genInfoData.updateDate = this.dateParser(this.genInfoData.updateDate);
				}

				if(data['project'] != null) {
					this.project = data['project'];
					this.project.createDate = this.dateParser(this.project.createDate);
					this.project.updateDate = this.dateParser(this.project.updateDate);
				}

			});

		} else {

			this.quotationGenInfo = new QuotationGenInfo();
			this.quotationGenInfo.line = "";
			this.quotationGenInfo.year;
			this.quotationGenInfo.seqNo;
			this.quotationGenInfo.reqSeq;
			this.quotationGenInfo.histNo = "";
			this.quotationGenInfo.branch = "";
			this.quotationGenInfo.lineClass = "";
			this.quotationGenInfo.policyNumber;
			this.quotationGenInfo.printedBy = "";
			this.quotationGenInfo.printDate;
			this.quotationGenInfo.cedingCompany = "";
			this.quotationGenInfo.quoteStatus = "";
			this.quotationGenInfo.quoteDate;
			this.quotationGenInfo.validUntil;
			this.quotationGenInfo.requestedBy = "";
			this.quotationGenInfo.requestedDate;
			this.quotationGenInfo.requestedMode = "";
			this.quotationGenInfo.principal = "";
			this.quotationGenInfo.contractor = "";
			this.quotationGenInfo.insured = "";
			this.quotationGenInfo.propertyProjectDescription = "";
			this.quotationGenInfo.site = "";
			this.quotationGenInfo.durationTesting = "";
			this.quotationGenInfo.risk = "";
			this.quotationGenInfo.object = "";
			this.quotationGenInfo.location = "";
			this.quotationGenInfo.share = "";
			this.quotationGenInfo.partOf100 = "";
			this.quotationGenInfo.intermediary = "";
			this.quotationGenInfo.governmentFlag = "";
			this.quotationGenInfo.indicative = "";
			this.quotationGenInfo.openCover = "";
			this.quotationGenInfo.declaration = "";
			this.quotationGenInfo.openingParagraph = "";
			this.quotationGenInfo.closingParagraph = "";
			this.quotationGenInfo.createdBy = "";
			this.quotationGenInfo.dateCreated;
			this.quotationGenInfo.lastUpdate;
			this.quotationGenInfo.lastUpdateBy = "";
		}

		/*this.sub = this.route.params.subscribe(params => {
			this.from = params['from'];
			if (this.from == "quo-processing") {
				this.typeOfCession = params['cessionDesc'];
			}
		});*/
		/*this.checkTypeOfCession();*/
	}


	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	checkTypeOfCession() {
		return (this.genInfoData.cessionDesc.toUpperCase() === 'RETROCESSION') ? true : false;
	}

	reqMode: SelectRequestMode[] = [
	{ name: '', value: '' },
	{ name: 'Web Portal', value: 'Web Portal' },
	{ name: 'Fax', value: 'Fax' },
	{ name: 'Email', value: 'Email' },
	{ name: 'Phone', value: 'Phone' },
	{ name: 'etc', value: 'etc' },
	];

	//getting value
	func(a: string, b: Date) {
		this.quotationGenInfo.createdBy = a;
		this.quotationGenInfo.lastUpdate = b;
		console.log(this.quotationGenInfo.createdBy);
		console.log(this.quotationGenInfo.lastUpdate);
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
	}

	showCurrencyModal(){
		$('#currencyModal #modalBtn').trigger('click');
	}

	setCurrency(data){
		this.genInfoData.currencyCd = data.currencyAbbr;
		this.genInfoData.currencyRt = data.currencyRt;
	}


	plainQuotationNo(data: string){
		var arr = data.split('-');

		return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
	}

	showCedingCompanyLOV() {
		$('#cedingCompanyLOV #modalBtn').trigger('click');
	}

	setCedingcompany(event){
		this.genInfoData.cedingId = event.coNo;
		this.genInfoData.cedingName = event.name;
	}

	showInsuredLOV(){
		$('#insuredLOV #modalBtn').trigger('click');
	}

	setInsured(data){
		//this.genInfoData.principal = data.insuredId;
		this.genInfoData.insuredDesc = data.insuredName;
	}

	setLineClass(event){
		this.lineClassCode = event.lineClassCd;
        this.lineClassDesc = event.lineClassCdDesc;
        this.genInfoData.lineCd = this.lineClassDesc;

    }

    setInt(event){
        this.genInfoData.intmId = event.intmId;
        this.genInfoData.intmName = event.intmName;
    }

	dateParser(arr) {
		function pad(num){
			return (num < 10) ? '0' + num : num;
		}

		return new Date(arr[0] + '-' + pad(arr[1]) + '-' + pad(arr[2])).toISOString();   
	}

	saveQuoteGenInfo() {		
		console.log('PREPARING DATA >>> ' + this.prepareParam());

		this.quotationService.saveQuoteGeneralInfo(this.prepareParam()).subscribe(data => console.log(data));
	}

	prepareParam() {
		var saveQuoteGeneralInfoParam = {
			"approvedBy"	: this.genInfoData.approvedBy,
			"cedingId"		: this.genInfoData.cedingId,
			"cessionId"		: (this.genInfoData.cessionDesc.toUpperCase() === 'DIRECT') ? '1' : '2', //this.genInfoData.cessionId,
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
			"prjCreateDate"	: this.project.createDate,
			"prjCreateUser"	: this.project.createUser,
			"prjUpdateDate"	: this.project.updateDate,
			"prjUpdateUser"	: this.project.updateUser,
			"projDesc"		: this.project.projDesc,
			"projId"		: this.project.projId,
			"quoteId"		: this.genInfoData.quoteId,
			"quoteRevNo"	: (this.genInfoData.quoteId === '') ? '0' : this.genInfoData.quoteRevNo,
			"quoteSeqNo"	: (this.genInfoData.quoteId === '') ? '1' : this.genInfoData.quoteSeqNo,
			"quoteYear"		: (this.genInfoData.quoteId === '') ? new Date().getFullYear().toString() : this.genInfoData.quoteYear,
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

		return JSON.stringify(saveQuoteGeneralInfoParam);
	}

	toDateTime(ev) {
		return new Date(ev).toISOString();
	}
}
export interface SelectRequestMode {
	name: string;
	value: string;
}
