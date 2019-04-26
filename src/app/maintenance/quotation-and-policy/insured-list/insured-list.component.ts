import { Component, OnInit } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insured-list',
  templateUrl: './insured-list.component.html',
  styleUrls: ['./insured-list.component.css']
})
export class InsuredListComponent implements OnInit {

	passDataInsuredList : any = {
		tableData 	: [],
		tHeader		: ['Insured No', 'Name', 'Abbreviation', 'Active', 'Type', 'Corp Tag', 'VAT Type', 'Address'],
		dataTypes 	: ['sequence-6','text','text','checkbox','text', 'text','text','text'],
		nData:
        {
            insuredId      	: null,
            insuredName   	: null,
            insuredAbbr		: null,
            activeTag     	: null,
            insuredType    	: null,
            corpTag         : null,
            vatTag         	: null,
            address    		: null
        },
        paginateFlag        : true,
        infoFlag            : true,
        searchFlag          : true,
        pageLength          : 10,
        addFlag             : true,
        editFlag          	: true,
        keys                : ['insuredId','insuredName','insuredAbbr','activeTag','insuredType','corpTag','vatTag','address'],
        uneditable          : [true,true,true,true,true,true,true,true],
        pageID              : 'mtn-insured',
        widths              : ['auto','auto','auto','auto','auto','auto','auto','auto']
	}

	insuredRecord : any = {
		insuredId		: null,
		createUser		: null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null,
	}

  constructor(private titleService: Title ,private mtnService: MaintenanceService, private ns: NotesService, private router: Router) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Insured List');
  	this.getInsuredList();
  }

  getInsuredList(){
  	this.mtnService.getMtnInsured(100)
  	.subscribe(data => {
  		console.log(data);
  		var rec = data['insured'];

  		for(let i of rec){
  			this.passDataInsuredList.tableData.push({	
	  			insuredId      	: i.insuredId,
	            insuredName   	: i.insuredName,
	            insuredAbbr		: i.insuredAbbr,
	            activeTag     	: this.cbFunc(i.activeTag),
	            insuredType    	: i.insuredTypeDesc,
	            corpTag         : i.corpTagDesc,
	            vatTag         	: i.vatTagDesc,
	            address    		: i.address,

	            createUser		: i.createUser,
	            createDate		: i.createDate,
	            updateUser		: i.updateUser,
	            updateDate		: i.updateDate
  			});	
  		}
  		
  	});
  }

  cbFunc(cb){
  	return cb === 'Y'?true:false;
  }

  onRowClick(event){
  	console.log(event);
  	if(event !== null){
  		this.insuredRecord.insuredId	= event.insuredId;
	  	this.insuredRecord.createUser	= event.createUser;
	  	this.insuredRecord.createDate	= this.ns.toDateTimeString(event.createDate);
	  	this.insuredRecord.updateUser	= event.updateUser;
	  	this.insuredRecord.updateDate	= this.ns.toDateTimeString(event.updateDate);
  	}
  }

  onRowDblClick(event){
  	this.insuredRecord.insuredId = parseInt(event.target.closest("tr").children[0].innerText);
  	this.router.navigate(['/insured-mtn', { insuredId : this.insuredRecord.insuredId }], { skipLocationChange: true });

  }

  onClickAdd(event){
  	console.log('add');
  	this.router.navigate(['/insured-mtn', { insuredId : '' }], { skipLocationChange: true });
  }

}
