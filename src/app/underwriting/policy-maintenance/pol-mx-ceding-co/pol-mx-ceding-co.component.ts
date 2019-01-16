import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-pol-mx-ceding-co',
	templateUrl: './pol-mx-ceding-co.component.html',
	styleUrls: ['./pol-mx-ceding-co.component.css']
})
export class PolMxCedingCoComponent implements OnInit {

	addEdit: boolean = false;

	passData: any = {
		tableData:[
			[true,true,true,'001','AFP GENERAL INSURANCE CORP.','AFP','Col. Boni Serrano Road E. Delos Santos Ave.',new Date('2015-02-09'),null,null]
		],
		tHeader: ['Active','Govt','Member','Co No','Name','Abbreviation','Address','Membership Date','Termination Date','Inactive Date'],
		dataTypes:['checkbox','checkbox','checkbox','text','text','text','text','date','date','date'],
		addFlag: true,
		editFlag: true,
		pagination: true,
		pageStatus: true,
		searchFlag: true,
		pageLength: 10,
		resizable: [false,false,false,false,true,false,true,false,false,false],
		filters: [
			/*{
            	key: 'active',
            	title:'Active',
            	dataType: 'checkbox'
        	},
        	{
            	key: 'govt',
            	title:'Government',
            	dataType: 'checkbox'
        	},
        	{
            	key: 'member',
            	title:'Member',
            	dataType: 'checkbox'
        	},*/
        	{
            	key: 'coNo',
            	title:'Company No',
            	dataType: 'text'
        	},
        	{
            	key: 'name',
            	title:'Name',
            	dataType: 'text'
        	},
        	{
            	key: 'abbreviation',
            	title:'Abbreviation',
            	dataType: 'text'
        	},
        	{
            	key: 'address',
            	title:'Address',
            	dataType: 'text'
        	},
        	{
            	key: 'membershipDate',
            	title:'Membership Date',
            	dataType: 'date'
        	},
        	{
            	key: 'terminationDate',
            	title:'Termination Date',
            	dataType: 'date'
        	},
        	{
            	key: 'inactiveDate',
            	title:'Inactive Date',
            	dataType: 'date'
        	}
		],
		pageID: 1,
	};

	passDataAddEdit: any = {
		tableData:[
			[true,'Mr.','Henry','I','Tiu','Engg Head','Engineering Insurance','09178348984',null],
			[false,'Ms.','Rose','O','Lim','Acct Head','Accounting','09112233456',null]
		],
		tHeader: ['Default','Designation','First Name','M.I.','Last Name','Position','Department','Contact No','E-Signature'],
		dataTypes:['checkbox','text','text','text','text','text','text','text','text'],
		addFlag: true,
		deleteFlag: true,
		paginateFlag: true,
		infoFlag: true,
		pageLength: 5,
		widths: ['1','1','1','1','1','auto','auto','auto','1'],
		pageID: 2,
	}

	constructor() { }

	ngOnInit() {
	}

	toAddEdit() {
		this.addEdit = true;
	}
}
