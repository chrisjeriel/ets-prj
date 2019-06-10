import { Component, OnInit, ViewChild } from '@angular/core';
import { ExtractedPolicy } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService, MaintenanceService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';


@Component({
  selector: 'app-purge-extracted-policy',
  templateUrl: './purge-extracted-policy.component.html',
  styleUrls: ['./purge-extracted-policy.component.css']
})
export class PurgeExtractedPolicyComponent implements OnInit {
  
  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(CustEditableNonDatatableComponent) table :CustEditableNonDatatableComponent;
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
  passData:any={
  	tableData:[],
  	tHeader: ['Policy No', 'TSI Amount', 'Premium Amount', 'Expiry Date', 'P', 'X'],
  	dataTypes:['text','currency','currency','date', 'checkbox', 'checkbox'],
    tooltip:[null,null,null,null,'Processed','Expired'],
    keys:['policyNo','totalSi','totalPrem','expiryDate','processTag','expiryTag'],
    uneditable:[true,true,true,true,true,true],
  	paginateFlag:true,
  	infoFlag:true

  }

  purgeData: any = {
    deletePurge:[]
  }

  byDate: boolean = true;
  disabledFlag: boolean = true;
  baseOnParam:boolean = false;
  expiredAndProcessed:boolean = false;
  unProcess:boolean = false;
  allProcess:boolean = false;
  line: string = "";
  typeOfCessionId = "";
  lineDescription:string ="";
  typeOfCession:string ="";
  first = true;
  cedingId = "";
  cedingName = "";
  constructor(private modalService: NgbModal,private underwritingService: UnderwritingService,private ns: NotesService, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.getPolPurging();
  }

  getPolPurging(){
    this.underwritingService.getPolForPurging(null).subscribe((data:any) => {
      this.passData.tableData = [];
      var datas = data.polForPurging;
      for(var i = 0; i < datas.length;i++){
        this.passData.tableData.push(datas[i]);
      }
      this.table.refreshTable();
    });
  }

  baseParam(event){
    if(event.target.checked){
      this.baseOnParam = true
      this.disabledFlag = false;
    }else {
      this.baseOnParam = false;
      this.disabledFlag = true;
    }
  }

  unprocessed(event){
    if(event.target.checked){
      this.unProcess = true
    }else {
      this.unProcess = false;
    }
  }

  expiredAndProcess(event){
    if(event.target.checked){
      this.expiredAndProcessed = true
    }else {
      this.expiredAndProcessed = false;
    }
  }

  processed(event){
    if(event.target.checked){
      this.allProcess = true
    }else {
      this.allProcess = false;
    }
  }

  prepareData(){
    this.purgeData.deletePurge = [];
    if(this.expiredAndProcessed){
      for(var i = 0; i < this.passData.tableData.length;i++){
        if(this.passData.tableData[i].expiryTag === 'Y' && this.passData.tableData[i].processTag === 'Y'){
          this.purgeData.deletePurge.push(this.passData.tableData[i]);
        }
      }
    }

    if(this.allProcess){
      for(var i = 0; i < this.passData.tableData.length;i++){
        if(this.passData.tableData[i].processTag === 'Y'){
          this.purgeData.deletePurge.push(this.passData.tableData[i]);
        }
      }
    }

    if(this.unProcess){
      for(var i = 0; i < this.passData.tableData.length;i++){
        if(this.passData.tableData[i].processTag === 'N'){
          this.purgeData.deletePurge.push(this.passData.tableData[i]);
        }
      }
    }
  }

  saveData(cancelFlag?){
    console.log('pasok')
    this.prepareData();
    console.log(this.purgeData)
    this.underwritingService.savePolForPurging(this.purgeData).subscribe((data:any)=>{
      if(data['returnCode'] == 0) {
        console.log('fail')
      } else{
        console.log('success')
        this.getPolPurging()
      }
    })

  }

  parameter() {
        $('#parameter #modalBtn').trigger('click');
  }

  checkCode(ev, field){
    this.ns.lovLoader(ev, 1);

    if(field === 'line') {            
        this.lineLov.checkCode(this.line, ev);
    } else if(field === 'typeOfCession'){
        this.typeOfCessionLov.checkCode(this.typeOfCessionId, ev);
    } else if(field === 'cedingCo') {         
        this.cedingCoLov.checkCode(this.cedingId, ev);
    }
  }

  setLine(data){
    this.line = data.lineCd;
    this.lineDescription = data.description;
    this.ns.lovLoader(data.ev, 0);

    if(data.hasOwnProperty('fromLOV')){
        $('#parameter > #modalBtn').trigger('click');    
    }
  }

  setTypeOfCession(data) {        
        this.typeOfCessionId = data.cessionId;
        this.typeOfCession = data.description;
        this.ns.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#typeOfCessionId');    
        }
  }

  setCedingcompany(event){
    this.cedingId = event.cedingId;
    this.cedingName = event.cedingName;
    this.ns.lovLoader(event.ev, 0);
  }

   onClickAdd(event) {
    if(this.first){
        this.maintenanceService.getMtnTypeOfCession(1).subscribe(data => {            
          this.typeOfCessionId = data['cession'][0].cessionId;
          this.typeOfCession = data['cession'][0].cessionAbbr;

          this.first = false;
        });
    }
    $('#addModal > #modalBtn').trigger('click');        
  }

  showTypeOfCessionLOV(){
    this.typeOfCessionLov.modal.openNoClose();
  }

  showLineLOV(){
    this.lineLov.modal.openNoClose();
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  clearData(){
    this.line = null;
    this.lineDescription = null;
    this.typeOfCession = null;
    this.typeOfCessionId = null;
    this.cedingId = null;
    this.cedingName = null;
  }

   clearDates() {
    $('#fromDate').val("");
    $('#toDate').val("");
  }
}
