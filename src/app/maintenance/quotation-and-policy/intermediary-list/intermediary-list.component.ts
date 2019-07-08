import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as alasql from 'alasql';

@Component({
  selector: 'app-intermediary-list',
  templateUrl: './intermediary-list.component.html',
  styleUrls: ['./intermediary-list.component.css']
})
export class IntermediaryListComponent implements OnInit {
	@ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

	passDataIntmList : any = {
		tableData 	: [],
		tHeader		: ['Intm No', 'Name', 'Active', 'Corp Tag', 'VAT Type', 'Address', 'Contact No', 'Old Intm No'],
		dataTypes 	: ['sequence-7','text','checkbox','text', 'text','text','text', 'sequence-7'],
		resizable	: [true,true,true,true,true,true,true,true],
        pagination	: true,
        pageStatus  : true,
        pageLength  : 10,
        addFlag     : true,
        editFlag    : true,
        exportFlag	: true,
        keys        : ['intmId','intmName','activeTag','corpTagDesc','vatTagDesc','address','contactNo','oldIntmId'],
        pageID      : 'mtn-intermediary',
        filters		: [{ key: 'intmId',title: 'Intm No',dataType: 'text'},
        			   { key: 'intmName',title: 'Name',dataType: 'text'},
        			   { key: 'activeTag',title: 'Active',dataType: 'text'},
        			   { key: 'corpTag',title: 'Corp Tag',dataType: 'text'},
        			   { key: 'vatTag',title: 'VAT Type',dataType: 'text'},
        			   { key: 'address',title: 'Address',dataType: 'text'},
        			   { key: 'contactNo',title: 'Contact No',dataType: 'text'},
        			   { key: 'oldIntmId',title	: 'Old Intm No',dataType: 'text'},
        ]
	};

	intmRecord : any = {
		intmId			: null,
		createUser		: null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null
	};

	searchParams		: any[] = [];

	constructor(private titleService: Title ,private mtnService: MaintenanceService, private ns: NotesService, private router: Router,private modalService: NgbModal) { }

    ngOnInit() {
  		this.titleService.setTitle('Mtn | Intermediary List');
  		this.getIntmList();
    }

    getIntmList(){
  	
	  	this.mtnService.getMtnIntmList(this.searchParams)
	  	.subscribe(data => {
	  		console.log(data);
	  		var rec = data['intermediary'];
	  		this.passDataIntmList.tableData = rec;
	  		this.table.refreshTable();
	  		this.table.onRowClick(null, this.passDataIntmList.tableData[0]);
	  		console.log(this.table.onRowClick(null, this.passDataIntmList.tableData[0])); // do not delete, selecting first row upon loading will not work XD

	  	});
	}

	searchQuery(searchParams){
		console.log(searchParams);
		this.searchParams = searchParams;
		this.passDataIntmList.tableData = [];
		this.getIntmList();
	}


	export(){
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var currDate = mm + dd+ yyyy;
		var filename = 'MtnIntermediaryList_'+currDate+'.xlsx'
		var mystyle = {
			headers:true, 
			column: {style:{Font:{Bold:"1"}}}
		};

		alasql.fn.datetime = function(dateStr) {
			var date = new Date(dateStr);
			return date.toLocaleString();
		};

		alasql('SELECT intmId AS IntmNo, intmName AS Name, activeTag AS Active, corpTag AS CorpTag, vatTag AS VATType, address AS Address, contactNo AS ContactNo, oldIntmId AS OldIntmNo INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passDataIntmList.tableData]);
  	}

  	onRowClick(event){
	  	if(Object.keys(event).length != 0){
	  		this.intmRecord.intmId		= event.intmId;
		  	this.intmRecord.createUser	= event.createUser;
		  	this.intmRecord.createDate	= this.ns.toDateTimeString(event.createDate);
		  	this.intmRecord.updateUser	= event.updateUser;
		  	this.intmRecord.updateDate	= this.ns.toDateTimeString(event.updateDate);
	  	}else{
		  	this.intmRecord.createUser	= '';
		  	this.intmRecord.createDate	= '';
		  	this.intmRecord.updateUser	= '';
		  	this.intmRecord.updateDate	= '';
	  	}
  	}

  	onRowDblClick(){
  		this.router.navigate(['/intermediary-mtn', { intmId : this.intmRecord.intmId }], { skipLocationChange: true });
  	}

  	onClickAdd(event){
  		this.router.navigate(['/intermediary-mtn', { intmId : '' }], { skipLocationChange: true });
  	}

  	onClickEdit(event){
	  	if(this.intmRecord.intm !== '' || this.intmRecord.intm !== null || this.intmRecord.intm !== undefined){
	  		this.router.navigate(['/intermediary-mtn', { intmId : this.intmRecord.intmId }], { skipLocationChange: true });
	  	}
  	}

 	 onTabChange($event: NgbTabChangeEvent) {

	  	if($event.nextId === 'Exit'){
	  		$event.preventDefault();
			this.router.navigateByUrl('/maintenance-qu-pol');
	  	}

	 }



}
