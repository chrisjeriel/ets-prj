import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MaintenanceService, NotesService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';

@Component({
  selector: 'app-report-param',
  templateUrl: './report-param.component.html',
  styleUrls: ['./report-param.component.css']
})
export class ReportParamComponent implements OnInit {

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CustNonDatatableComponent) tableNonEditable: CustNonDatatableComponent;
  @ViewChild('mdl') modal: ModalComponent;
  @ViewChild('lineMdl') lineModal: MtnLineComponent;

  private currentUser: string = JSON.parse(window.localStorage.currentUser).username;

  dialogIcon: string = "";
  dialogMessage: string = "";

  selectedRow: any;
  indvSelect: any;
  selectedReport: any;

  cancelFlag: boolean = false;

  savedData: any = [];
  deletedData: any = [];

  reportIdIndex: number = 0;
  lineCdIndex: number = 0;

  reportParamsData: any = {
  	tableData: [],
  	tHeader: ['Report ID', 'Title', 'Text', 'Line Code', 'Remarks'],
  	dataTypes: ['lovInput', 'text', 'text', 'lovInput', 'text'],
  	magnifyingGlass: ['reportId', 'lineCd'],
  	keys: ['reportId', 'title', 'text', 'lineCd', 'remarks'],
  	uneditable: [false,false,false,false,false],
  	nData: {
  		reportId: '',
  		title: '',
  		text: '',
  		lineCd: '',
  		renarks: '',
  		showMG: 1,
  		createUser: this.currentUser,
  		createDate: this.ns.toDateTimeString(0),
  		updateUser: this.currentUser,
  		updateDate: this.ns.toDateTimeString(0)
  	},
  	paginateFlag: true,
  	infoFlag: true,
  	addFlag: true,
  	searchFlag: true,
    genericBtn: 'Delete',
    widths: [90,150,'auto',1,190]
  }

  reportsData: any = {
    	tableData: [],
    	tHeader: ['Report ID', 'Report Title'],
    	dataTypes: ['text', 'text'],
    	keys: ['reportId', 'reportTitle'],
    	pagination: true,
    	pageStatus: true,
    	pageID: 'reportsDataLOV'
    }

  constructor(private route: ActivatedRoute,private router: Router, private ms: MaintenanceService, private ns: NotesService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.retrieveMtnReportParamsMethod();
  	//this.retrieveMtnReportsMethod();
  }

  retrieveMtnReportParamsMethod(){
  	//get report params list
  	this.reportParamsData.tableData = [];
  	this.ms.getMtnReportsParam().subscribe((data: any)=>{
  		for(var rec of data.reportsParam){
  			rec.uneditable = ['reportId', 'title'];
  			rec.showMG = 1;
  			rec.colMG = 'reportId';
  			this.reportParamsData.tableData.push(rec);
  		}
  		this.table.onRowClick(null, this.reportParamsData.tableData[0]);
  		this.table.refreshTable();
  	});
  }

  retrieveMtnReportsMethod(){
  	this.reportsData.tableData = [];
  	this.tableNonEditable.loadingFlag = true;
  	this.ms.getMtnReports().subscribe((data: any)=>{
  		this.reportsData.tableData = data.reports;
  		this.tableNonEditable.onRowClick('event', this.reportsData.tableData[0], 0);
  		this.tableNonEditable.refreshTable();
  		this.tableNonEditable.loadingFlag = false;
  	});
  }

  reportParamLOV(data){
  	console.log(data);
  	if(data.key === 'reportId'){
  		this.reportIdIndex = data.index;
  		this.retrieveMtnReportsMethod();
  		this.modal.openNoClose();
  	}else if(data.key === 'lineCd'){
  		this.lineCdIndex = data.index;
  		this.lineModal.modal.open();
  	}
  }

  onRowClickReports(data){
  	if(data === null || (data !== null && Object.keys(data).length === 0)){
  		data = null;
  	}
  	this.selectedReport = data;
  }

  setReportId(noDataFound?){
  	this.reportParamsData.tableData[this.reportIdIndex].reportId = this.selectedReport.reportId;
  	this.reportParamsData.tableData[this.reportIdIndex].colMG = noDataFound !== undefined ? undefined : 'reportId';
  	this.reportParamsData.tableData[this.reportIdIndex].uneditable = noDataFound !== undefined ? undefined : 'reportId';
  	this.table.refreshTable();
  }

  setLine(data){
  	this.reportParamsData.tableData[this.lineCdIndex].lineCd = data.lineCd;
  	this.ns.lovLoader(data.ev, 0);
  	this.table.refreshTable();
  }

  clearReportId(){
  	console.log(this.reportIdIndex);
  	this.reportParamsData.tableData[this.reportIdIndex].reportId = '';
  	this.reportParamsData.tableData[this.reportIdIndex].colMG = undefined;
  	this.reportParamsData.tableData[this.reportIdIndex].uneditable = undefined;
  	//this.table.refreshTable();
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedReport = {
        reportId: '',
        reportTitle: '',
        ev: ev
      };
      this.ns.lovLoader(ev, 0);
      this.setReportId('nodatafound');
      this.retrieveMtnReportsMethod();
      this.modal.openNoClose();
    } else {
      this.ms.getMtnReports(code.toUpperCase()).subscribe(data => {
        if(data['reports'].length > 0) {
          data['reports'][0]['ev'] = ev;
          this.selectedReport = data['reports'][0];

          this.setReportId();
        } else {
          this.selectedReport = {
             reportId: '',
             reportTitle: '',
             ev: ev
           };
          this.setReportId('nodatafound');
          this.retrieveMtnReportsMethod();
          this.modal.openNoClose();
        }
       	this.ns.lovLoader(ev, 0);
      });
  	}
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('');
      }
    }

  onRowClick(data){
  	if(data !== null){
      this.selectedRow = data;
      this.reportParamsData.disableGeneric = false;
    }else{
      this.reportParamsData.disableGeneric = true;
    }
  }

  update(data){
  	this.reportParamsData.tableData = data;
  	console.log(data);
  	if(data.hasOwnProperty('lovInput') && data.key === 'reportId'){
  		this.reportIdIndex = data.index;
  		this.checkCode(data.ev.target.value, data.ev);
  	}else if(data.hasOwnProperty('lovInput') && data.key === 'lineCd'){
  		this.lineCdIndex = data.index;
  		this.lineModal.checkCode(data.ev.target.value, data.ev);
  	}
  }

  onClickSave(){
  	if(!this.checkFields()){
  		this.dialogIcon = 'error';
  		this.successDiag.open();
  	}/*else if(!this.checkForDuplicates()){
    	this.dialogIcon = "info";
    	this.dialogMessage = "Unable to save record. Report ID must be unique.";
    	this.successDiag.open();
    }*/else{
  		$('#confirm-save #modalBtn2').trigger('click');
  	}
  }

  onClickDelete(data){
    this.table.selected = [this.table.indvSelect];
    this.table.confirmDelete();
  }

  onClickCancel(){
  	this.cancelBtn.clickCancel();
  }

  save(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	this.savedData = [];
  	this.deletedData = [];

  	for (var i = 0 ; this.reportParamsData.tableData.length > i; i++) {
  	  if(this.reportParamsData.tableData[i].edited && !this.reportParamsData.tableData[i].deleted){
  	      this.savedData.push(this.reportParamsData.tableData[i]);
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
  	  }
  	  else if(this.reportParamsData.tableData[i].edited && this.reportParamsData.tableData[i].deleted){
  	     this.deletedData.push(this.reportParamsData.tableData[i]);
  	     this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
  	     this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	  }

  	}

  	if(this.savedData.length === 0 && this.deletedData.length === 0){
  		setTimeout(()=>{
  			this.dialogIcon = "info";
  			this.dialogMessage = "Nothing to save.";
  			this.successDiag.open();
  		},0);
  	}else{
  		this.ms.saveMtnReportParam(this.savedData, this.deletedData).subscribe((data:any)=>{
	  		if(data.returnCode === 0){
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
	  			this.dialogIcon = 'error';
	  			this.successDiag.open();
	  		}else{
	  			this.dialogIcon = '';
	  			this.successDiag.open();
		        this.deletedData = [];
		        this.table.markAsPristine();
		  		this.retrieveMtnReportParamsMethod();
	  		}
	  	});
  	}
  }

  checkFields(){
  	for(var i of this.reportParamsData.tableData){
  		if(i.reportId.length === 0 || i.reportId === undefined || i.reportId === null ||
  		   i.title.length === 0 || i.title === undefined || i.title === null ||
  		   i.text.length === 0 || i.text === undefined || i.text === null){
  			return false;
  		}
  	}
  	return true;
  }

   /*checkForDuplicates(){
  	//check if there are similar reasonCd
  	for(var j = 0; j < this.reportParamsData.tableData.length; j++){
  		for(var k = j; k < this.reportParamsData.tableData.length; k++){
  			if(j !== k && this.reportParamsData.tableData[j].reportId === this.reportParamsData.tableData[k].reportId){
  				return false;
  			}
  		}
  	}
  	return true;
  }*/

}
