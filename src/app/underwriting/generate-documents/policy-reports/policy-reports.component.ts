import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-policy-reports',
  templateUrl: './policy-reports.component.html',
  styleUrls: ['./policy-reports.component.css']
})

export class PolicyReportsComponent implements OnInit {
  
  @ViewChild (CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild('ceding') cedingLov: CedingCompanyComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild('extractParams') extractParams: ModalComponent;
  
  passLov: any = {
    selector: 'mtnReport',
    reportId: '',
    hide: []
  }

  params :any = {
    dateRange: '',
    dateParam:'',
  	reportName : '',
    byDateFrom:'',
    byDateTo:'',
    byAsOf:'',
  	reportId : '',
    lineCd: '',
    lineName: '',
    destination: '',
    cedingId: '',
    cedingName: '',
    alteration: ''
  }

  sendData: any = {
    dateRange: '',
    dateParam:'',
    dateRangeFrom: '',
    dateRangeTo: '',
    cedingId: '',
    lineCd: '',
    alteration: '',
    reportId : '',
    destination: '',
  };

  constructor(private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  }

  getReports(){
  	this.lovMdl.openLOV();
  }

  setReport(data){
  	console.log(data.data);
  	this.params.reportId = data.data.reportId;
  	this.params.reportName = data.data.reportTitle;
    this.ns.lovLoader(data.ev, 0);
  }

  getLine(){
    this.lineLov.modal.openNoClose();
  }
  
  setLine(data){
    this.params.lineCd = data.lineCd;
    this.params.lineName = data.description;
    this.ns.lovLoader(data.ev, 0);
  }

  showCedingCompanyLOV() {
    this.cedingLov.modal.openNoClose();
  }

  setCedingcompany(data){
    this.params.cedingId = data.cedingId;
    this.params.cedingName = data.cedingName; 
    this.ns.lovLoader(data.ev, 0);
  }

  prepareData(){
    if(this.params.dateRange == 1){
      this.sendData.dateRangeFrom = this.ns.toDateTimeString(this.params.byDateFrom);
      this.sendData.dateRangeTo = this.ns.toDateTimeString(this.params.byDateTo);
    }else if(this.params.dateRange == 2){
      this.sendData.dateRangeFrom = this.ns.toDateTimeString(new Date(this.params.byMonthFromYear,this.params.byMonthFrom,0).getTime());
      this.sendData.dateRangeTo = this.ns.toDateTimeString(new Date(this.params.byMonthToYear,this.params.byMonthTo,0).getTime());
    }else if(this.params.dateRange == 3){
      this.sendData.dateRangeTo = this.ns.toDateTimeString(this.params.byAsOf);
    }

    this.sendData.dateRange = this.params.dateRange;
    this.sendData.reportId = this.params.reportId;
    this.sendData.dateParam = this.params.dateParam;
    this.sendData.lineCd = this.params.lineCd;
    this.sendData.cedingId = this.params.cedingId;
    this.sendData.alteration = this.params.alteration;
    this.sendData.destination = this.params.destination;
  }

  extract(cancel?){
    this.prepareData();
    if(1==1){ // change the condition to check if parameters inserted already exists.
      this.extractParams.openNoClose();
    }else{
      //insert the extraction
    }
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  checkCode(ev, field){
    this.ns.lovLoader(ev, 1);

    if(field === 'line') {            
        this.lineLov.checkCode(this.params.lineCd, ev);
    } else if(field === 'company') {
        this.cedingLov.checkCode(String(this.params.cedingId).padStart(3, '0'), ev);            
    } else if(field === 'report'){
      this.passLov.code = this.params.reportId;
      this.lovMdl.checkCode('reportId');
    }
  }

}
