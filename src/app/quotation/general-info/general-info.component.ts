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
				this.line = params['quotationNo'].split('-')[0];
				this.typeOfCession = params['typeOfCession'];
				this.quotationNo = params['quotationNo'];
				this.typeOfCession = this.typeOfCession;
			}
		});

		if (this.quotationService.toGenInfo[0] == "edit") {
				this.quotationService.getQuoteGenInfo('', this.plainQuotationNo(this.quotationNo)).subscribe(data => {
				
				this.project = (data['project'] == null) ? this.project : data['project'];
				this.genInfoData = (data['quotationGeneralInfo'] == null) ? this.genInfoData : data['quotationGeneralInfo'];
			});

			/*	this.quotationService.getQuoteGenInfo('', this.quotationNo).subscribe((data: any) => {
				this.genInfoData = data.quotationGeneralInfo;
				
				console.log('DATA >>>>> ' + data.quotationGeneralInfo);*/

				/*this.genInfoData.cessionDesc = this.genInfoData.cessionDesc.toUpperCase();*/
			/*});*/


/*			console.log(this.quotationService.rowData);*/
			this.quotationGenInfo = new QuotationGenInfo();
			this.quotationGenInfo.line = "";
			this.quotationGenInfo.year = 0;
			this.quotationGenInfo.seqNo;
			this.quotationGenInfo.reqSeq;
			this.quotationGenInfo.histNo = "MOCK DATA";
			this.quotationGenInfo.branch = this.rowData[1];
			this.quotationGenInfo.lineClass = this.quotationNo[0];
			this.quotationGenInfo.policyNumber = 0;
			this.quotationGenInfo.printedBy = "MOCK DATA";
			this.quotationGenInfo.printDate;
			this.quotationGenInfo.cedingCompany = this.rowData[4];
			this.quotationGenInfo.quoteStatus = this.rowData[3];
			this.quotationGenInfo.quoteDate = new Date(this.rowData[11]);
			this.quotationGenInfo.validUntil = new Date(this.rowData[12]);
			this.quotationGenInfo.requestedBy = this.rowData[13];
			this.quotationGenInfo.requestedDate;
			this.quotationGenInfo.requestedMode = "MOCK DATA";
			this.quotationGenInfo.principal = this.rowData[5];
			this.quotationGenInfo.contractor = this.rowData[6];
			this.quotationGenInfo.insured = this.rowData[7];
			this.quotationGenInfo.propertyProjectDescription = "MOCK DATA";
			this.quotationGenInfo.site = "MOCK DATA";
			this.quotationGenInfo.durationTesting = "MOCK DATA";
			this.quotationGenInfo.risk = this.rowData[8];
			this.quotationGenInfo.object = this.rowData[9];
			this.quotationGenInfo.location = this.rowData[10];
			this.quotationGenInfo.share = "MOCK DATA";
			this.quotationGenInfo.partOf100 = "MOCK DATA";
			this.quotationGenInfo.intermediary = "MOCK DATA";
			this.quotationGenInfo.governmentFlag = "MOCK DATA";
			this.quotationGenInfo.indicative = "MOCK DATA";
			this.quotationGenInfo.openCover = "MOCK DATA";
			this.quotationGenInfo.declaration = "MOCK DATA";
			this.quotationGenInfo.openingParagraph = "MOCK DATA";
			this.quotationGenInfo.closingParagraph = "MOCK DATA";
			this.quotationGenInfo.createdBy = "MOCK DATA";
			this.quotationGenInfo.dateCreated;
			this.quotationGenInfo.lastUpdate;
			this.quotationGenInfo.lastUpdateBy = "MOCK DATA";

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
		this.quotationGenInfo.principal = data.insuredName;
		this.principalCd = data.insuredId;
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
		this.quotationGenInfo.contractor = data.insuredName;
		this.contractorCd = data.insuredId;
	}

	showCurrencyModal(){
		$('#currencyModal #modalBtn').trigger('click');
	}

	setCurrency(data){
		this.currencyAbbr = data.currencyAbbr;
		this.currencyRt = data.currencyRt;
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

	setLineClass(event){
		this.lineClassCode = event.lineClassCd;
        this.lineClassDesc = event.lineClassCdDesc;
        this.genInfoData.lineCd = this.lineClassCode + ' - ' + this.lineClassDesc;

    }

    setInt(event){
        this.genInfoData.intmId = event.intmId;
        this.genInfoData.intmName = event.intmName;
    }

}
export interface SelectRequestMode {
	name: string;
	value: string;
}
