import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-insured',
  templateUrl: './insured.component.html',
  styleUrls: ['./insured.component.css']
})
export class InsuredComponent implements OnInit {

  	private sub	: any;

  	insuredRecord : any = {
	  	insuredId		: null,
		insuredName		: null,
		insuredAbbr		: null,
		insuredType		: null,
		firstName		: null,
		middleInitial	: null,
		lastName		: null,
		addrLine1		: null,
		addrLine2		: null,
		addrLine3		: null,
		zipCd			: null,
		contactNo		: null,
		emailAdd		: null,
		activeTag		: null,
		corpTag			: null,
		vatTag			: null,
		oldInsId		: null,
		remarks			: null,
		createUser		: null,
		createDate		: null,
		updateUser		: null,
		updateDate		: null
	}

  	constructor(private mtnService:MaintenanceService, private ns: NotesService, private activatedRoute: ActivatedRoute ) { }

  	ngOnInit() {
		this.sub = this.activatedRoute.params
				   .subscribe(params => {
				   		this.insuredRecord.insuredId 	=	 params['insuredId'];
				   });

		this.getInsuredList();
		
  		
  	}

  	getInsuredList(){
  		this.mtnService.getMtnInsured(this.insuredRecord.insuredId)
  		.subscribe(data => {
  			console.log(data);
  			var rec = data['insured'];
  			this.insuredRecord = rec[0];
  			this.insuredRecord.activeTag  = this.cbFunc(this.insuredRecord.activeTag);
			this.insuredRecord.createDate = this.ns.toDateTimeString(this.insuredRecord.createDate);
			this.insuredRecord.updateDate = this.ns.toDateTimeString(this.insuredRecord.updateDate);
  			
  		});
  	}

  	insuredReq :any;
  	onSaveMtnInsured(){
  		this.mtnService.getMtnInsured(this.insuredRecord.insuredId)
  		.subscribe(data => {
  			console.log(data);
  			var rec = data['insured'];
  			this.insuredRecord = rec[0];
  			this.insuredRecord.activeTag  = this.cbFunc(this.insuredRecord.activeTag);
			this.insuredRecord.createDate = this.ns.toDateTimeString(this.insuredRecord.createDate);
			this.insuredRecord.updateDate = this.ns.toDateTimeString(this.insuredRecord.updateDate);

			this.mtnService.saveMtnInsured(JSON.stringify(this.insuredRecord))
  			.subscribe(data => {
  				console.log(data);
  			
  			});	
  			
  		});	
  		
  	}

  	cbFunc(data){
  		return data === 'Y' ? true : false;
  	}

}
