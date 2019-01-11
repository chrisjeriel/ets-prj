import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pol-mx-ceding-co',
  templateUrl: './pol-mx-ceding-co.component.html',
  styleUrls: ['./pol-mx-ceding-co.component.css']
})
export class PolMxCedingCoComponent implements OnInit {
  
  passData: any = {
		tableData:[
			[true,true,true,'001','AFP GENERAL INSURANCE CORP.','AFP','Col. Boni Serrano Road E. Delos Santos Ave.',new Date('2015-02-09'),null,null]
		],
		tHeader: ['Active','Govt','Member','Co No','Name','Abbreviation','Address','Membership Date','Termination Date','Inactive Date'],
		dataTypes:['checkbox','checkbox','checkbox','text','text','text','text','date','date','date'],
		addFlag: true,
		editFlag: true,
		paginateFlag: true,
		infoFlag: true,
		searchFlag: true,
		pageLength: 10,
		widths: ['1','1','1','1','auto','1','auto','1','1','1'],
		pageID: 1,
	};

  constructor() { }

  ngOnInit() {
  }

}
