import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as alasql from 'alasql';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';


@Component({
  selector: 'app-insured-list',
  templateUrl: './insured-list.component.html',
  styleUrls: ['./insured-list.component.css']
})
export class InsuredListComponent implements OnInit {
	@ViewChild(LoadingTableComponent) table: LoadingTableComponent;

	passDataInsuredList : any = {
		tableData 	: [],
		tHeader		: ['Insured No', 'Name', 'Abbreviation', 'Active', 'Corp Tag', 'VAT Type', 'Address'],
     sortKeys : ['INSURED_ID','INSURED_NAME','INSURED_ABBR','ACTIVE_TAG','CORP_TAG_DESC','VAT_TAG_DESC','ADDRESS'],
		dataTypes 	: ['sequence-6','text','text','checkbox', 'text','text','text'],
		resizable	: [true,true,true,true,true,true,true,true],
        pagination	: true,
        pageStatus  : true,
        pageLength  : 10,
        addFlag     : true,
        editFlag    : true,
        exportFlag	: true,
        keys        : ['insuredId','insuredName','insuredAbbr','activeTag','corpTagDesc','vatTagDesc','address'],
        pageID      : 'mtn-insured',
        filters		: [{ key: 'insuredId',title	: 'Insured No',dataType: 'text'},
        			   { key: 'insuredName',title	: 'Name',dataType: 'text'},
        			   { key: 'insuredAbbr',title	: 'Abbreviation',dataType: 'text'},
        			   { key: 'activeTag',title	: 'Active',dataType: 'text'},
        			   { key: 'corpTag',title	: 'Corp Tag',dataType: 'text'},
        			   { key: 'vatTag',title	: 'VAT Type',dataType: 'text'},
        			   { key: 'address',title	: 'Address',dataType: 'text'},
        ]
	};

  searchParams: any = {
        'paginationRequest.count':10,
        'paginationRequest.position':1,  
    };


	insuredRecord : any = {
		insuredId		: null,
		createUser		: null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null,
	}

  constructor(private titleService: Title ,private mtnService: MaintenanceService, private ns: NotesService, private router: Router,private modalService: NgbModal) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Insured List');
  	this.getInsuredList();
  }

  getInsuredList(){
  	
  	this.mtnService.newGetMtnInsuredList(this.searchParams)
  	.subscribe(data => {
  		var rec = data['insured'];
      //this.passDataInsuredList.tableData = rec;
  		// for(let i of rec){
  		// 	this.passDataInsuredList.tableData.push({	
	  	// 		insuredId      	: i.insuredId,
	   //          insuredName   	: i.insuredName,
	   //          insuredAbbr		: i.insuredAbbr,
	   //          activeTag     	: this.cbFunc(i.activeTag),
	   //          insuredType    	: i.insuredTypeDesc,
	   //          corpTag         : i.corpTagDesc,
	   //          vatTag         	: i.vatTagDesc,
	   //          address    		: i.address,

	   //          createUser		: i.createUser,
	   //          createDate		: i.createDate,
	   //          updateUser		: i.updateUser,
	   //          updateDate		: i.updateDate
  		// 	});	
  		// }
      this.passDataInsuredList.count = data['length']
      this.table.placeData(rec);
      this.table.onRowClick(null, this.passDataInsuredList.tableData[0]);
      console.log(this.table.onRowClick(null, this.passDataInsuredList.tableData[0])); // do not delete, selecting first row upon loading will not work XD
      
  	});
  }

  searchQuery(searchParams){
    for(let key of Object.keys(searchParams)){
        this.searchParams[key] = searchParams[key]
    }
  	this.getInsuredList();
  }

  export(){
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var currDate = mm + dd+ yyyy;
		var filename = 'MtnInsuredList_'+currDate+'.xls'
		var mystyle = {
			headers:true, 
			column: {style:{Font:{Bold:"1"}}}
		};

		alasql.fn.datetime = function(dateStr) {
			var date = new Date(dateStr);
			return date.toLocaleString();
		};

		alasql('SELECT insuredId AS InsuredNo, insuredName AS Name, insuredAbbr AS Abbreviation, activeTag AS Active, insuredType AS Type, corpTag AS CorpTag, vatTag AS VATType, address AS Address INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passDataInsuredList.tableData]);
  }

  cbFunc(cb){
  	return cb === 'Y'?true:false;
  }

  onRowClick(event){
  	if(Object.keys(event).length != 0){
  		this.insuredRecord.insuredId	= event.insuredId;
	  	this.insuredRecord.createUser	= event.createUser;
	  	this.insuredRecord.createDate	= this.ns.toDateTimeString(event.createDate);
	  	this.insuredRecord.updateUser	= event.updateUser;
	  	this.insuredRecord.updateDate	= this.ns.toDateTimeString(event.updateDate);
  	}else{
      this.insuredRecord.createUser  = '';
      this.insuredRecord.createDate  = '';
      this.insuredRecord.updateUser  = '';
      this.insuredRecord.updateDate  = '';
    }
  }

  onRowDblClick(){
  	//this.insuredRecord.insuredId = parseInt(event.target.closest("tr").children[0].innerText);
  	this.router.navigate(['/insured-mtn', { insuredId : this.insuredRecord.insuredId }], { skipLocationChange: true });

  }

  onClickAdd(event){
  	this.router.navigate(['/insured-mtn', { insuredId : '' }], { skipLocationChange: true });
  }

  onClickEdit(event){
  	if(this.insuredRecord.insured !== '' || this.insuredRecord.insured !== null || this.insuredRecord.insured !== undefined){
  		this.router.navigate(['/insured-mtn', { insuredId : this.insuredRecord.insuredId }], { skipLocationChange: true });
  	}
  }

  onTabChange($event: NgbTabChangeEvent) {

  	if($event.nextId === 'Exit'){
  		$event.preventDefault();
		  this.router.navigateByUrl('/maintenance-qu-pol');
  	}

  }

}
