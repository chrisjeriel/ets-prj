  import { Component, OnInit, Output, EventEmitter } from '@angular/core';
  import { MaintenanceService, NotesService, AccountingService } from '@app/_services'

@Component({
  selector: 'app-extract-record',
  templateUrl: './extract-record.component.html',
  styleUrls: ['./extract-record.component.css']
})
export class ExtractRecordComponent implements OnInit {

  constructor(private ms: MaintenanceService, private ns: NotesService, private as:AccountingService) { }
  monthList:any[] = [
    {code:"1", description:'January'},
    {code:"2", description:'February'},
    {code:"3", description:'March'},
    {code:"4", description:'April'},
    {code:"5", description:'May'},
    {code:"6", description:'June'},
    {code:"7", description:'July'},
    {code:"8", description:'August'},
    {code:"9", description:'September'},
    {code:"10", description:'October'},
    {code:"11", description:'November'},
    {code:"12", description:'December'}
  ]

  companyList:any[] = [];
  methodList:any[] = [];
  extractUser:string = '';
  extractDate:string = '';
  params:any = {
  	extMm:'',
  	extYear:'',
  	extMethod:'',
  	extractUser:'',
  	extractDate:'',
  }

  @Output() paramOut: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  	//this.getCompanyList();
  	this.getUPRMethods();
    this.getUPRParams();
  }

  getCompanyList(){
  	this.ms.getCedingCompanyList([]).subscribe(a=>{
  		this.companyList = a['cedingcompany'].filter(a=>a.membershipTag== 'Y' || a.treatyTag=='Y');
  	})
  }

  getUPRMethods(){
  	this.ms.getRefCode('UPR_METHOD').subscribe(a=>{
  		this.methodList = a['refCodeList'];
  	})
  }

  getUPRParams(){
    this.as.getUPRParams().subscribe(a=>{
      if(a['params'] != null){
        this.params = a['params'];
        this.params.extractDate = this.ns.toDateTimeString(this.params.extractDate);
      } else{
        this.params.extractUser = this.ns.getCurrentUser();
        this.params.extractDate = this.ns.toDateTimeString(0);
      }
      this.emitParam();
    })
  }

  extract(){
    this.params.extractUser = this.ns.getCurrentUser();
    this.params.extractDate = this.ns.toDateTimeString(0);
  	this.as.generateUPR(this.params).subscribe(a=>{
  		console.log(a);
  	})
  }

  emitParam(){
    this.params.monthName = this.monthList.filter(a=>a.code == this.params.extMm)[0].description;
    this.params.methodName = this.methodList.filter(a=>a.code == this.params.extMethod)[0].description;
    this.paramOut.emit(this.params);
  }



}
