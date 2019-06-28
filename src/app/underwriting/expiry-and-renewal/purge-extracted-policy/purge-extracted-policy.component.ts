import { Component, OnInit, ViewChild } from '@angular/core';
import { ExtractedPolicy } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService, MaintenanceService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { ModalComponent }  from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-purge-extracted-policy',
  templateUrl: './purge-extracted-policy.component.html',
  styleUrls: ['./purge-extracted-policy.component.css']
})
export class PurgeExtractedPolicyComponent implements OnInit {
  
  @ViewChild('mdl') modal : ModalComponent;
  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild('tbl') table :CustEditableNonDatatableComponent;
  @ViewChild('lov') tableLov :CustEditableNonDatatableComponent;
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
  	infoFlag:true,
    pageID:'purge',

  }

  passDataLov :any ={
    tableData:[],
    tHeader: ['Policy No', 'Ceding Company', 'Insured'],
    dataTypes:['text','text','text'],
    tooltip:[null,null,null],
    keys:['policyNo','cedingName','insuredName'],
    uneditable:[true,true,true],
    widths:[180,200,230],
    paginateFlag:true,
    infoFlag:true,
    pageID:'LOV',
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
  first = true;
  policyLov:any;
  selected:any;

  params:any = {
    cedingId : "",
    cedingName : "",
    line: "",
    typeOfCessionId : "",
    lineDescription :"",
    typeOfCession :"",
    byDateFrom: '',
    byDateTo: null,
    byMonthFrom:null,
    byMonthTo:null,
    byYearTo: null,
    byYearFrom: null
  }

  dateParams:any = {
    byDateFrom: ''
  }

  

  PolicyNo: any = {
    line: null,
    year: null,
    sequenceNo: null,
    companyNo: null,
    coSeriesNo: null,
    altNo: null
  }
  constructor(private modalService: NgbModal,private underwritingService: UnderwritingService,private ns: NotesService, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.getPolPurging();
  }

  getPolPurging(){
    this.underwritingService.getPolForPurging(null).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      this.policyLov = data.polForPurging;
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

    if(this.baseOnParam){
      if(this.params.line !== null){
        for(var i = 0 ; i < this.passData.tableData.length;i++){
          if(this.passData.tableData[i].policyNo.split('-')[0] === this.params.line){
            this.purgeData.deletePurge.push(this.passData.tableData[i]);
          }
        }
      }

      if(this.params.typeOfCessionId !== null){
        for(var i = 0 ; i < this.passData.tableData.length;i++){
          if(this.passData.tableData[i].cessionId === this.params.typeOfCessionId){
            this.purgeData.deletePurge.push(this.passData.tableData[i]);
          }
        }
      }

      if(this.params.cedingId !== null){
        for(var i = 0 ; i < this.passData.tableData.length;i++){
          if(this.passData.tableData[i].cedingId == this.params.cedingId){
            this.purgeData.deletePurge.push(this.passData.tableData[i]);
          }
        }
      }

      if(this.PolicyNo.lineCd !== null && this.PolicyNo.altNo !== null){
        var polNo = this.PolicyNo.lineCd+'-'+this.PolicyNo.year+'-'+this.PolicyNo.sequenceNo+'-'+this.PolicyNo.companyNo+'-'+this.PolicyNo.coSeriesNo+'-'+this.PolicyNo.altNo;
        for(var i = 0 ; i < this.passData.tableData.length; i++){
          if(this.passData.tableData[i].policyNo == polNo){
            this.purgeData.deletePurge.push(this.passData.tableData[i]);
          }
        }
      }

      if(this.byDate && this.params.byDateTo !== undefined){
        if(this.params.byDateFom !== undefined && this.params.byDateFom !== ''){
          for(var i = 0; i < this.passData.tableData.length; i++){
            if(this.ns.toDateTimeString(this.passData.tableData[i].expiryDate).split('T')[0].trim() === this.params.byDateFrom){
               console.log(this.params.byDateFom);
               console.log(this.params.byDateFom);
            }
          }
        }
      }

    }
  }

  saveData(cancelFlag?){
    this.prepareData();
    console.log(this.purgeData.deletePurge);

    if (this.purgeData.deletePurge.length > 0) {
      this.underwritingService.savePolForPurging(this.purgeData).subscribe((data:any)=>{
        if(data['returnCode'] == 0) {
          console.log('fail')
        } else{
          console.log('success')
          this.getPolPurging();
          this.clearData();
          $('#purgeMsgModal > #modalBtn').trigger('click');
        }
      });
    } else {
      

      setTimeout(() => {
          console.log('this.purgeData.deletePurge is 0');
          $('#purgeNoSelectedMsgModal > #modalBtn').trigger('click');
      },1000); 
      
    }
  }

  parameter() {
        $('#parameter #modalBtn').trigger('click');
  }

  checkCode(ev, field){
    this.ns.lovLoader(ev, 1);

    if(field === 'line') {            
        this.lineLov.checkCode(this.params.line, ev);
    } else if(field === 'typeOfCession'){
        this.typeOfCessionLov.checkCode(this.params.typeOfCessionId, ev);
    } else if(field === 'cedingCo') {         
        this.cedingCoLov.checkCode(this.params.cedingId, ev);
    }
  }

  setLine(data){
    this.params.line = data.lineCd;
    this.params.lineDescription = data.description;
    this.ns.lovLoader(data.ev, 0);

    if(data.hasOwnProperty('fromLOV')){
        $('#parameter > #modalBtn').trigger('click');    
    }
  }

  setTypeOfCession(data) {        
        this.params.typeOfCessionId = data.cessionId;
        this.params.typeOfCession = data.description;
        this.ns.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#typeOfCessionId');    
        }
  }

  setCedingcompany(event){
    this.params.cedingId = event.cedingId;
    this.params.cedingName = event.cedingName;
    this.ns.lovLoader(event.ev, 0);
  }

   onClickAdd(event) {
    if(this.first){
        this.maintenanceService.getMtnTypeOfCession(1).subscribe(data => {            
          this.params.typeOfCessionId = data['cession'][0].cessionId;
          this.params.typeOfCession = data['cession'][0].cessionAbbr;

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
    this.cedingCoLov.modal.openNoClose();
  }

  clearData(){
    this.params.line = null;
    this.params.lineDescription = null;
    this.params.typeOfCession = null;
    this.params.typeOfCessionId = null;
    this.params.cedingId = null;
    this.params.cedingName = null;
    this.PolicyNo.lineCd = null;
    this.PolicyNo.year = null;
    this.PolicyNo.companyNo = null;
    this.PolicyNo.sequenceNo = null;
    this.PolicyNo.coSeriesNo = null;
    this.PolicyNo.altNo = null;
  }

   clearDates() {
    $('#fromDate').val("");
    $('#toDate').val("");
  }

  row(data){
    console.log(data)
  }

  onClickPurge() {
    $('#purgeModal > #modalBtn').trigger('click');
  }

  showPolicyLov(){
    
    for(var i = 0 ; i  < this.policyLov.length; i++){
      this.passDataLov.tableData.push(this.policyLov[i]);
    }
    this.tableLov.refreshTable();
    this.modal.openNoClose()
  }

  onClick(data){
    console.log(data)
    this.selected = data;
  }

  setLOV(){
    if(this.selected !== null){
      var polNo = this.selected.policyNo.split('-');
      this.PolicyNo.lineCd  = polNo[0];
      this.PolicyNo.year  = polNo[1];
      this.PolicyNo.sequenceNo  = polNo[2];
      this.PolicyNo.companyNo  = polNo[3];
      this.PolicyNo.coSeriesNo  = polNo[4];
      this.PolicyNo.altNo  = polNo[5];
    }
  }

  test(){
    var arr =[];
    console.log(this.passData.tableData[0].expiryDate)
    console.log(this.dateParams.byDateFrom)
    for(var i= 0 ; i <  this.passData.tableData.length; i++){
      if(this.passData.tableData[i].expiryDate > this.ns.toDateTimeString(this.dateParams.byDateFrom)){
        arr.push(this.passData.tableData[i]);
      }
    }
    console.log(arr)
  }
}
