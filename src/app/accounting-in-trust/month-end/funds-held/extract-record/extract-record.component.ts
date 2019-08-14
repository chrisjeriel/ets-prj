  import { Component, OnInit } from '@angular/core';
  import { MaintenanceService, NotesService, AccountingService } from '@app/_services'

@Component({
  selector: 'app-extract-record',
  templateUrl: './extract-record.component.html',
  styleUrls: ['./extract-record.component.css']
})
export class ExtractRecordComponent implements OnInit {

  constructor(private ms: MaintenanceService, private ns: NotesService, private as:AccountingService) { }

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

  ngOnInit() {
  	//this.getCompanyList();
  	this.params.extractUser = this.ns.getCurrentUser();
  	this.params.extractDate = this.ns.toDateTimeString(0);
  	this.getUPRMethods();
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

  extract(){
  	this.as.generateUPR(this.params).subscribe(a=>{
  		console.log(a);
  	})
  }

}
