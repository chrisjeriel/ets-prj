import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService, UserService, PrintService } from '@app/_services';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';

@Component({
  selector: 'app-bordereaux',
  templateUrl: './bordereaux.component.html',
  styleUrls: ['./bordereaux.component.css']
})
export class BordereauxComponent implements OnInit {
	@ViewChild('lineLov') lineLOV: MtnLineComponent;
	@ViewChild('cessionLov') cessionLOV: MtnTypeOfCessionComponent;
	@ViewChild('acitReportsModal') acitReportsModal: ModalComponent;
	@ViewChild('appDialog') appDialog: SucessDialogComponent;
	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
	@ViewChild(LovComponent) lovMdl: LovComponent;
	@ViewChild(CedingCompanyComponent) cedingLov: CedingCompanyComponent;
	@ViewChild('currencyModal') currLov: MtnCurrencyCodeComponent;

	dateParam: string = '1';
	extnType: string = 'O';
	perLine: boolean = true;
	perTypeOfCession: boolean = true;
	lineDesc: string = '';
	cessionDesc: string = '';

	extractDisabled: boolean = true;
	modalHeader: string = "";
	modalBody: string = "";
	dialogIcon: string = "";
	dialogMessage: string = "";
	modalMode: string = "";

	params :any = {
		extractUser: JSON.parse(window.localStorage.currentUser).username,
		osPaidTag: '',
		extTypeTag: 'LE',
	    dateParam: '',
	    dateRange: '',
	  	reportName : '',
	    dateFrom: '',
	    dateTo: '',
	    dateToAsOf: '',
	  	reportId : '',
	    lineCd: '',
	    cessionId: '',
	    cedingId: '',
	    cedingName: '',
	    currCd: '',
	    currency: '',
	    destination: '',
	    forceExtract: 'N',
	    perLine: true,
	    perCession: true,
	    byDateFrom : '',
	    byDateTo : '',
	    byMonthFrom: '',
	    byMonthFromYear : '',
	    byMonthTo: ''


	}

	passLov: any = {
	    selector: 'mtnReport',
	    reportId: '',
	    hide: []
	}

	disableOutstanding: boolean = true;
	disableLosses: boolean = true;
	disableCompany: boolean = true;
	disablePrint: boolean = true;
	loading: boolean = false;

	paramsToggle: Array<string> = [];


	constructor(private titleService: Title, private route: ActivatedRoute, private router: Router, private ns: NotesService, private ms: MaintenanceService, private userService: UserService,
		        private printService: PrintService, public modalService: NgbModal) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-IT | Bordereaux");
    	this.userService.emitModuleId("ACIT061");
		// this.passLov.modReportId = 'ACITR052%';
		this.passLov.modReportId = 'CLMR052%';
		this.loading = false;
	}

	onTabChange($event: NgbTabChangeEvent) {
		if($event.nextId === 'Exit') {
		  	$event.preventDefault();
		  	this.router.navigateByUrl('');
		}
	}

	getReports(){
		// this.passLov.reportId = 'ACITR052%';
		this.passLov.reportId = 'CLMR052%';
	  	this.lovMdl.openLOV();
	}

	setReport(data){
	    // this.paramsToggle = [];
	    this.clearFields();
	    if(data.data != null){
		  	this.params.reportId = data.data.reportId;
		  	this.params.reportName = data.data.reportTitle;
		  	switch(data.data.reportId){
		  		case 'ACITR052A':
		  			this.disableLosses = true;
		  			this.params.dateRange = 'A';
		  			this.disableCompany = true;
		  			this.disableOutstanding = false;
		  			this.params.osPaidTag = 'O';
		  			this.params.dateParam = '4';
		  			break;
				case 'ACITR052B':
					this.disableCompany = true;
					this.disableLosses = false;
					this.disableOutstanding = true;
					this.params.dateRange = 'D';
					this.params.osPaidTag = 'P';
					this.params.dateParam = '7';
					break;
				case 'ACITR052C':
					this.disableLosses = true;
					this.disableOutstanding = false;
					this.disableCompany = false;
					this.params.osPaidTag = 'O';
					this.params.dateRange = 'A';
					this.params.dateParam = '4';
					break;
				case 'ACITR052D':
					this.disableLosses = true;
					this.disableOutstanding = false;
					this.disableCompany = false;
					this.params.osPaidTag = 'O';
					this.params.dateRange = 'A';
					this.params.dateParam = '4';
					break;
				case 'ACITR052E':
					this.disableCompany = true;
					this.disableOutstanding = false;
					this.disableLosses = true;
					this.params.osPaidTag = 'O';
					this.params.dateRange = 'A';
					this.params.dateParam = '4';
					break;
				case 'ACITR052F':
					this.disableCompany = true;
					this.disableOutstanding = false;
					this.disableLosses = true;
					this.params.osPaidTag = 'O';
					this.params.dateRange = 'A';
					this.params.dateParam = '4';
					break;
				case 'ACITR052G':
					this.disableLosses = true;
					this.disableOutstanding = false;
					this.disableCompany = false;
					this.params.osPaidTag = 'O';
					this.params.dateRange = 'A';
					this.params.dateParam = '4';
					break;
				case 'ACITR052H':
					this.disableOutstanding = true;
					this.disableCompany = false;
					this.disableLosses = false;
					this.params.dateRange = 'D';
					this.params.osPaidTag = 'P';
					this.params.dateParam = '7';
					break;
				case 'ACITR052I':
					this.disableLosses = true;
					this.disableOutstanding = false;
					this.disableCompany = false;
					this.params.osPaidTag = 'O';
					this.params.dateRange = 'A';
					this.params.dateParam = '4';
					break;
				case 'ACITR052J':
					this.disableOutstanding = true;
					this.disableLosses = false;
					this.disableCompany = false;
					this.params.dateRange = 'D';
					this.params.osPaidTag = 'P';
					this.params.dateParam = '7';
					break;
				case 'ACITR052K':
					this.disableLosses = true;
					this.disableOutstanding = false;
					this.disableCompany = false;
					this.params.dateRange = 'A';
					this.params.osPaidTag = 'O';
					this.params.dateParam = '4';
					break;
				case 'ACITR052L':
					this.disableOutstanding = true;
					this.disableLosses = false;
					this.disableCompany = false;
					this.params.dateRange = 'D';
					this.params.osPaidTag = 'P';
					this.params.dateParam = '7';
					break;
				case 'ACITR052M':
					this.disableLosses = true;
					this.disableOutstanding = false;
					this.disableCompany = false;
					this.params.dateRange = 'A';
					this.params.osPaidTag = 'O';
					this.params.dateParam = '4';
					break;
				case 'ACITR052N':
					this.disableOutstanding = true;
					this.disableLosses = false;
					this.disableCompany = false;
					this.params.dateRange = 'D';
					this.params.osPaidTag = 'P';
					this.params.dateParam = '7';
					break;
				case 'ACITR052O':
					this.disableLosses = true;
					this.disableOutstanding = false;
					this.disableCompany = false;
					this.params.dateRange = 'A';
					this.params.osPaidTag = 'O';
					this.params.dateParam = '4';
					break;

				case 'CLMR052A':
		  			this.disableLosses = true;
		  			this.params.dateRange = 'A';
		  			this.disableCompany = false;
		  			this.disableOutstanding = false;
		  			this.params.osPaidTag = 'O';
		  			this.params.dateParam = '4';
		  			break;
		  		case 'CLMR052B':
		  			this.disableLosses = false;
		  			this.params.dateRange = 'A';
		  			this.disableCompany = false;
		  			this.disableOutstanding = true;
		  			this.params.dateRange = 'D';
					this.params.osPaidTag = 'P';
					this.params.dateParam = '7';
		  			break;
				default:
					this.disableOutstanding = true;
					this.disableLosses = true;
					this.disableCompany = true;
		  	}
		}else{
			this.params.reportId = null;
		  	this.params.reportName = null;
		}

		setTimeout(()=>{
			$('.report').focus().blur();
		},0);


	    /*if (this.repExtractions.indexOf(this.params.reportId) > -1) {
	      this.extractDisabled = false;
	    } else {
	      this.extractDisabled = true;
	    }

	    if (this.params.reportId == 'CLMR010A') {
	      this.paramsToggle.push('line', 'company',
	                             'byDate', 'byMonthYear', 'asOf');
	    } else if (this.params.reportId == 'CLMR010B') {
	      this.paramsToggle.push('line', 'company',
	                             'byDate', 'byMonthYear', 'asOf');
	    }*/

	    

	    setTimeout(()=> {
	    	this.ns.lovLoader(data.ev, 0);
	    }, 500)
	}

	showLineLOV() {
		this.lineLOV.modal.openNoClose();
	}

	setLine(ev) {
		this.ns.lovLoader(ev.ev, 0);

		this.params.lineCd = ev.lineCd;
		this.lineDesc = ev.description;
	}

	showCessionLOV() {
		this.cessionLOV.modal.openNoClose();
	}

	showCedingCompanyLOV() {
	  this.cedingLov.modal.openNoClose();
	}

	setCession(ev) {
		this.ns.lovLoader(ev.ev, 0);

		this.params.cessionId = ev.cessionId;
		this.cessionDesc = ev.description;
	}

	setCedingcompany(data){
	  this.params.cedingId = data.cedingId;
	  this.params.cedingName = data.cedingName; 
	  this.ns.lovLoader(data.ev, 0);
	}

	checkCode(ev, str) {
		this.ns.lovLoader(ev, 1);

		if(str == 'line') {
			this.lineLOV.checkCode(this.params.lineCd, ev);
		}else if(str === 'company') {
			if(this.params.cedingId != '') {
				this.cedingLov.checkCode(String(this.params.cedingId).padStart(3, '0'), ev);
			} else {
				this.cedingLov.checkCode(this.params.cedingId, ev);
			} 
	    } else if(str == 'cession') {
			this.cessionLOV.checkCode(this.params.cessionId, ev);
		} else if(str === 'report'){
	      // if(this.params.reportId.indexOf('ACITR052') == -1){
	      //   this.passLov.code = 'ACITR052%';
	      if(this.params.reportId.indexOf('CLMR052') == -1){
	        this.passLov.code = 'CLMR052%';
	      }else{
	      	this.passLov.code = this.params.reportId;
	      }
	      this.lovMdl.checkCode('reportId',ev);
	  	} else if(str == 'currency') {
	  		this.currLov.checkCode(this.params.currCd, ev);
	  	}
	}

	prepareData(){
	    this.modalMode = "";

	    try {
	    	if(this.params.dateRange == "D"){
		      this.params.dateFrom = this.ns.toDateTimeString(this.params.dateFrom);
		      this.params.dateTo = this.ns.toDateTimeString(this.params.dateTo);
		    }else if(this.params.dateRange == "A"){
		      this.params.dateToAsOf = this.ns.toDateTimeString(this.params.dateToAsOf);
		    }
	    } catch (ex) {
	    	console.log(ex);
	    }
	    

/*	    this.sendData.dateRange = this.params.dateRange == 1 ? "D" : (this.params.dateRange == 2 ? "M" : "A");
	    this.sendData.reportId = this.params.reportId;
	    this.sendData.dateParam = this.params.dateParam;
	    this.sendData.lineCdParam = this.params.lineCd;
	    this.sendData.cedingIdParam = this.params.cedingId;
	    this.sendData.incRecTag = this.params.incRecTag;
	    this.sendData.destination = this.params.destination;*/
	  }

	extract(cancel?){
    	this.loading = true;
    	this.prepareData();
    	let paramsJson = JSON.stringify(this.params);
    	// let acit052Params = JSON.parse(paramsJson);
    	let clm052Params = JSON.parse(paramsJson);

    	// acit052Params['dateTo'] = acit052Params['dateTo'] == null || acit052Params['dateTo'].length == 0 ? acit052Params['dateToAsOf'] : acit052Params['dateTo'];
    	clm052Params['dateTo'] = clm052Params['dateTo'] == null || clm052Params['dateTo'].length == 0 ? clm052Params['dateToAsOf'] : clm052Params['dateTo'];

	    this.printService.extractReport({ reportId: this.params.reportId, clmr052Params: clm052Params }).subscribe((data:any)=>{
	        if (data.errorList.length > 0) {
	          
	          if (data.errorList[0].errorMessage.includes("parameters already exists.")) {
	            this.modalMode = "reExtract";
	            this.modalHeader = "Confirmation";
	            this.acitReportsModal.openNoClose();
	          } else {
	            this.dialogIcon = 'error-message';
	            this.dialogMessage = 'An error occurred during extraction.';
	            this.appDialog.open();
	          }
	          
	        } else {
	          if (data.params.extractCount != 0) {
	            this.modalHeader = "Extraction Completed";
	            this.modalBody = "Successfully extracted " + data.params.extractCount + " record/s.";
	            this.acitReportsModal.openNoClose();
	            this.disablePrint = false;
	          } else {
	            this.modalHeader = "Extraction Completed";
	            this.modalBody = "No record/s extracted.";
	            this.acitReportsModal.openNoClose();
	          }
	        }
	        this.loading = false;
	    },
	    (err) => {
	      alert("Exception when calling services.");
	    });
	    
	    this.params.forceExtract = 'N';
    }

  forceExtract() {
    this.params.forceExtract = 'Y';
  }

  resetDateParams(){
  	this.params.dateFrom = '';
  	this.params.dateTo = '';
  	this.params.dateToAsOf = '';
  }

  print() {
  	// if(this.params.destination == 'exl'){
   //    this.passDataCsv = [];
   //    this.getExtractToCsv();
   //    return;
   //  }

  	if(this.params.destination === '' || this.params.destination === undefined){
  	  this.dialogIcon = "warning-message";
  	  this.dialogMessage = "Please select a print destination";
  	  this.appDialog.open();
  	  return;
  	}
    this.prepareData();

    /*let params :any = {
        "reportId" : this.params.reportId,
        "acitr052Params.extractUser" : this.params.extractUser,
		"acitr052Params.osPaidTag" : this.params.osPaidTag,
		"acitr052Params.extTypeTag" : this.params.extTypeTag,
		"acitr052Params.dateParam" : this.params.dateParam,
		"acitr052Params.dateRange" : this.params.dateRange,
		"acitr052Params.reportName" :  this.params.reportName,
		"acitr052Params.dateFrom" : this.params.dateFrom,
		"acitr052Params.dateTo" : this.params.dateTo == null || this.params.dateTo.length == 0 ? this.params.dateToAsOf : this.params.dateTo,
		"acitr052Params.reportId" : this.params.reportId,
		"acitr052Params.lineCd" : this.params.lineCd,
		"acitr052Params.cessionId" : this.params.cessionId,
		"acitr052Params.destination" : this.params.destination,
		"acitr052Params.forceExtract" : this.params.forceExtract,
		"acitr052Params.cedingId" : this.params.cedingId
    }*/

    let params :any = {
        "reportId" : this.params.reportId,
        "clmr052Params.extractUser" : this.params.extractUser,
		"clmr052Params.osPaidTag" : this.params.osPaidTag,
		"clmr052Params.extTypeTag" : this.params.extTypeTag,
		"clmr052Params.dateParam" : this.params.dateParam,
		"clmr052Params.dateRange" : this.params.dateRange,
		"clmr052Params.reportName" :  this.params.reportName,
		"clmr052Params.dateFrom" : this.params.dateFrom,
		"clmr052Params.dateTo" : this.params.dateTo == null || this.params.dateTo.length == 0 ? this.params.dateToAsOf : this.params.dateTo,
		"clmr052Params.reportId" : this.params.reportId,
		"clmr052Params.lineCd" : this.params.lineCd,
		"clmr052Params.cessionId" : this.params.cessionId,
		"clmr052Params.destination" : this.params.destination,
		"clmr052Params.forceExtract" : this.params.forceExtract,
		"clmr052Params.cedingId" : this.params.cedingId,
		"clmr052Params.currCd" : this.params.currCd
    }

    this.printService.print(this.params.destination,this.params.reportId, params);
  }

  paramChange(){
  	this.disablePrint = true;
  }

  clearFields(){
  		this.params.extractUser	= JSON.parse(window.localStorage.currentUser).username;
  		this.params.osPaidTag	= '';
  		this.params.extTypeTag	= 'LE';
  	    this.params.dateParam	= '';
  	    this.params.dateRange	= '';
  	  	this.params.reportName 	= '';
  	    this.params.dateFrom	= '';
  	    this.params.dateTo		= '';
  	    this.params.dateToAsOf	= '';
  	  	//this.params.reportId 	= '';
  	    this.params.lineCd		= '';
  	    this.lineDesc			= '';
  	    this.params.cessionId	= '';
  	    this.params.cedingId	= '';
  	    this.params.cedingName	= '';
  	    this.params.destination	= '';
  	    this.params.forceExtract= 'N';
  	    this.params.perLine		= true;
  	    this.params.perCession	= true;
  }

  showCurrencyModal() {
    // $('#currencyModal #modalBtn').trigger('click');
    this.currLov.modal.openNoClose();
  }

  setCurrency(data){
    this.params.currCd = data.currencyCd;
    this.params.currency = data.description;
    this.ns.lovLoader(data.ev, 0);
    setTimeout(()=>{
      $('.currCd').focus().blur();
    }, 0);
  }
 
}
