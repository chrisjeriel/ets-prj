import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { CedingCompanyList, CedingCompany } from '../../../_models';

@Component({
	selector: 'app-pol-mx-ceding-co',
	templateUrl: './pol-mx-ceding-co.component.html',
	styleUrls: ['./pol-mx-ceding-co.component.css']
})
export class PolMxCedingCoComponent implements OnInit {

	addEdit: boolean = false;

	passData: any = {
		//tableData : this.underwritingService.getCedingCompanyList(),
        tHeader: ['Active','Govt','Member','Co No','Name','Abbreviation','Address','Membership Date','Termination Date','Inactive Date'],
		dataTypes:['checkbox','checkbox','checkbox','sequence-3','text','text','text','date','date','date'],
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
		tableData:[/*
			[true,'Mr.','Henry','I','Tiu','Engg Head','Engineering Insurance','09178348984',null],
			[false,'Ms.','Rose','O','Lim','Acct Head','Accounting','09112233456',null]*/
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

	constructor(private underwritingService: UnderwritingService) { }

	ngOnInit() {
        let arrayData = [];
        let passDataa = [];
        this.underwritingService.getCedingCompanyList().subscribe((data: any) => {
        for (var i = 0; i <  data.cedingcompany.length ; i++) {
        
        arrayData.push(new CedingCompanyList(data.cedingcompany[i].activeTag, data.cedingcompany[i].govtTag,
                                             data.cedingcompany[i].membershipTag,data.cedingcompany[i].cedingId,
                                             data.cedingcompany[i].cedingName,data.cedingcompany[i].cedingAbbr,
                                             data.cedingcompany[i].address,data.cedingcompany[i].membershipDate,
                                             data.cedingcompany[i].termindationDate,data.cedingcompany[i].inactiveDate));

        }

        });

        this.passData.tableData = arrayData;
        this.underwritingService.getCedingCompany().subscribe((dataa: any) => {

        for (var i = 0; i <  dataa.cedingCompany.length ; i++) {
            passDataa.push(new CedingCompany(dataa.cedingCompany[i].cedingRepresentative.defaultTag, dataa.cedingCompany[i].cedingRepresentative.designation, dataa.cedingCompany[i].cedingRepresentative.firstName, dataa.cedingCompany[i].cedingRepresentative.middleInitial, dataa.cedingCompany[i].cedingRepresentative.lastName, dataa.cedingCompany[i].cedingRepresentative.position, dataa.cedingCompany[i].cedingRepresentative.department, dataa.cedingCompany[i].cedingRepresentative.contactNo, dataa.cedingCompany[i].cedingRepresentative.eSignature));
        }
        });
        this.passDataAddEdit.tableData = passDataa;
	}

	toAddEdit() {
		this.addEdit = true;
	}
}
