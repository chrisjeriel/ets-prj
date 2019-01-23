import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-pol-mx-line',
	templateUrl: './pol-mx-line.component.html',
	styleUrls: ['./pol-mx-line.component.css']
})
export class PolMxLineComponent implements OnInit {

	passData: any = {
		tableData:[],
		tHeader:[],
		tHeaderWithColspan:[],
		magnifyingGlass:[],
		options:[],
		dataTypes:[],
		opts:[],
		nData:{},
		checkFlag:false,
		selectFlag:false,
		addFlag:false,
		editFlag:false,
		deleteFlag:false,
		pagination: false,
		pageStatus: false,
		searchFlag: false,
		checkboxFlag:false,
		pageLength:10,
		resizable: [],
		pageID:1,
		filters: [
			{
            	key: 'lineCode',
            	title:'Line Code',
            	dataType: 'text'
        	},
        	{
            	key: 'description',
            	title:'description',
            	dataType: 'text'
        	},
        	{
            	key: 'ref',
            	title:'Ref',
            	dataType: 'text'
        	},
        	{
            	key: 'sortSeq',
            	title:'Sort Seq',
            	dataType: 'text'
        	}
        ]
	};

	activeCb: boolean = false;
	withCatCb: boolean = false;
	renewalCb: boolean = false;
	lineCode: string = "";
	description: string = "";
	referenceNo: string = "";
	sortSeq: string = "";

	constructor() { }

	ngOnInit() {
		this.passData.tHeader.push("Active", "With CAT", "Renewal", "Line Code", "Description", "Ref", "Sort Seq");
		this.passData.tableData.push([true, true, true, "CAR", "Contractor's All Risk", "1810", "1"],
									 [true, true, true, "EAR", "Erection All Risk", "1810", "2"],
									 [true, true, true, "EEI", "Electronic Equipment Insurance", "1830", "3"],
									 [true, false, false, "MBI", "Machinery Insurance", "1800", "4"],
									 [true, false, false, "BPV", "Boiler and Pressure Vessel", "1840", "5"],
									 [true, false, false, "MLP", "Machinery Loss of Profits ff. Machinery Breakdown", "1980", "6"],
									 [true, false, false, "DOS", "Deterioration of Stocks", "1900", "7"],
									 [true, true, true, "CEC", "Civil Engineering Completed Risk", "9999", "8"]);
		this.passData.dataTypes.push("checkbox", "checkbox", "checkbox", "text", "text", "number", "number");
		this.passData.resizable.push(true, true, true, false, true, true, false)
		this.passData.pagination = true;
		this.passData.pageStatus = true;
	}

	ngOnChanges() {
		
	}

	/*tempAddToTable(){
		this.passData.tableData.push([this.activeCb, this.withCatCb, this.renewalCb, this.lineCode, this.description, this.referenceNo, this.sortSeq]);
		console.log(this.passData.tableData);
	}*/
}
