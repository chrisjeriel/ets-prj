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
		osPaidTag: 'O',
		extTypeTag: 'LE',
	    dateParam: '4',
	    dateRange: 'D',
	  	reportName : '',
	    dateFrom: '',
	    dateTo: '',
	    dateToAsOf: '',
	  	reportId : '',
	    lineCd: '',
	    cessionId: '',
	    destination: '',
	    forceExtract: 'N',
	    perLine: true,
	    perCession: true,
	}

	passLov: any = {
	    selector: 'mtnReport',
	    reportId: '',
	    hide: []
	}

	constructor(private titleService: Title, private route: ActivatedRoute, private router: Router, private ns: NotesService, private ms: MaintenanceService, private userService: UserService,
		        private printService: PrintService, public modalService: NgbModal) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-IT | Bordereaux");
    	this.userService.emitModuleId("ACIT061");
		this.passLov.modReportId = 'ACITR052%';
	}

	onTabChange($event: NgbTabChangeEvent) {
		if($event.nextId === 'Exit') {
		  	$event.preventDefault();
		  	this.router.navigateByUrl('');
		}
	}

	getReports(){
		this.passLov.reportId = 'ACITR052%';
	  	this.lovMdl.openLOV();
	}

	setReport(data){
	    // this.paramsToggle = [];
	    if(data.data != null){
		  	this.params.reportId = data.data.reportId;
		  	this.params.reportName = data.data.reportTitle;
		}else{
			this.params.reportId = null;
		  	this.params.reportName = null;
		}


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

	setCession(ev) {
		this.ns.lovLoader(ev.ev, 0);

		this.params.cessionId = ev.cessionId;
		this.cessionDesc = ev.description;
	}

	checkCode(ev, str) {
		this.ns.lovLoader(ev, 1);

		if(str == 'line') {
			this.lineLOV.checkCode(this.params.lineCd, ev);
		} else if(str == 'cession') {
			this.cessionLOV.checkCode(this.params.cessionId, ev);
		} if(str === 'report'){
	      if(this.passLov.reportId.indexOf('ACITR052') == -1){
	        this.passLov.code = '';
	      }
	      this.passLov.code = this.params.reportId;
	      this.lovMdl.checkCode('reportId',ev);
	  }
	}

	prepareData(){
	    this.modalMode = "";

	    try {
	    	if(this.params.dateRange == "D"){
		      this.params.dateFrom = this.ns.toDateTimeString(this.params.dateFrom);
		      this.params.dateTo = this.ns.toDateTimeString(this.params.dateTo);
		    }else if(this.params.dateRange == "A"){
		      this.params.dateTo = this.ns.toDateTimeString(this.params.dateToAsOf);
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
    
    	this.prepareData();
    	console.log(this.params);

	    this.printService.extractReport({ reportId: this.params.reportId, acitr052Params:this.params }).subscribe((data:any)=>{
	        console.log("extractReport return data");
	        console.log(data);
	        if (data.errorList.length > 0) {
	          
	          if (data.errorList[0].errorMessage.includes("parameters already exists.")) {
	            this.modalMode = "reExtract";
	            this.modalHeader = "Confirmation";
	            this.acitReportsModal.openNoClose();
	          } else {
	            this.dialogIcon = 'error';
	            this.appDialog.open();
	          }
	          
	        } else {
	          if (data.params.extractCount != 0) {
	            this.modalHeader = "Extraction Completed";
	            this.modalBody = "Successfully extracted " + data.params.extractCount + " record/s.";
	            this.acitReportsModal.openNoClose();
	          } else {
	            this.modalHeader = "Extraction Completed";
	            this.modalBody = "No record/s extracted.";
	            this.acitReportsModal.openNoClose();
	          }
	        }
	    },
	    (err) => {
	      alert("Exception when calling services.");
	    });
	    
	    this.params.forceExtract = 'N';
    }

  forceExtract() {
    this.params.forceExtract = 'Y';
  }

  print() {
    this.prepareData();

    let params :any = {
        "reportId" : this.params.reportId,
        "acitr052Params.extractUser" : this.params.extractUser,
		"acitr052Params.osPaidTag" : this.params.osPaidTag,
		"acitr052Params.extTypeTag" : this.params.extTypeTag,
		"acitr052Params.dateParam" : this.params.dateParam,
		"acitr052Params.dateRange" : this.params.dateRange,
		"acitr052Params.reportName" :  this.params.reportName,
		"acitr052Params.dateFrom" : this.params.dateFrom,
		"acitr052Params.dateTo" : this.params.dateTo,
		"acitr052Params.reportId" : this.params.reportId,
		"acitr052Params.lineCd" : this.params.lineCd,
		"acitr052Params.cessionId" : this.params.cessionId,
		"acitr052Params.destination" : this.params.destination,
		"acitr052Params.forceExtract" : this.params.forceExtract,
    }

    console.log(this.params);

    this.printService.print(this.params.destination,this.params.reportId, params);
  }
}
