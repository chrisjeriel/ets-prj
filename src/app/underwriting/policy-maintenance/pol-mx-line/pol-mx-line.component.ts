import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';


@Component({
	selector: 'app-pol-mx-line',
	templateUrl: './pol-mx-line.component.html',
	styleUrls: ['./pol-mx-line.component.css']
})
export class PolMxLineComponent implements OnInit {
	@ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

	passData: any = {
		tableData:[],
		tHeader:["Line Code", "Description", "Cut-off Time","Active", "With CAT","Renewal",  "Open Cover", "ALOP", "Ref", "Sort Seq", "Remarks"],
		dataTypes:["text", "text", "time", "checkbox", "checkbox", "checkbox", "checkbox", "checkbox", "number", "number", "text"],
		nData:{
			lineCd 		: null,
			description : null,
			cutOffTime 	: null,
			activeTag 	: null,
			catTag 		: null,
			renewalTag 	: null,
			openCover 	: null,
			alop		: null,
			referenceNo : null,
			sortSeq 	: null,
			remarks 	: null,
		},
		checkFlag: true,
		selectFlag:false,
		addFlag:true,
		deleteFlag:true,
		paginateFlag: true,
		infoFlag: true,
		searchFlag: false,
		pageLength:10,
		resizable: [true, true, true, false, true, true, false,true],
		pageID:1,
		keys: ['lineCd','description','cutOffTime','activeTag','catTag','renewalTag','openCoverTag','alopTag','referenceNo','sortSeq','remarks'],
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

	

	constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
	this.titleService.setTitle('Mtn | Line');
  }

  mtnLineReq :any;
  saveMtnLine:any = {
  	  activeTag: false,
	  alopTag: false,
	  catTag: false,
	  createDate: "",
	  createUser: "",
	  description: "",
	  lineCd: "",
	  openCoverTag: false,
	  referenceNo: "",
	  remarks: "",
	  renewalTag: false,
	  sortSeq: "",
	  updateDate: "",
	  updateUser: "",
  };



  onClickSave(){

  	for(var i=0;i<this.passData.tableData.length;i++){
  		console.log(this.passData.tableData[i]);
  		var rec = this.passData.tableData[i];
  		this.mtnLineReq = {	
		  "activeTag":		this.cbFunc(rec.activeTag),
		  "alopTag":		this.cbFunc(rec.alopTag),
		  "catTag":			this.cbFunc(rec.catTag),
		  "createDate":		this.ns.toDateTimeString(0),
		  "createUser":		JSON.parse(window.localStorage.currentUser).username,
		  "description":	rec.description,
		  "lineCd":			rec.lineCd,
		  "openCoverTag":	this.cbFunc(rec.openCoverTag),
		  "referenceNo":	rec.referenceNo,
		  "remarks":		rec.remarks,
		  "renewalTag":		this.cbFunc(rec.renewalTag),
		  "sortSeq":		rec.sortSeq,
		  "updateDate":		this.ns.toDateTimeString(0),
		  "updateUser":		JSON.parse(window.localStorage.currentUser).username
		}

		console.log(JSON.stringify(this.mtnLineReq));
		this.mtnService.saveMtnLine(JSON.stringify(this.mtnLineReq))
	  		.subscribe(data => {
	  			console.log(data);
	  		});
  	}
	
 //  	this.mtnLineReq = {	
	//   "activeTag":		this.cbFunc(this.saveMtnLine.activeTag),
	//   "alopTag":		this.saveMtnLine.alopTag,
	//   "catTag":			this.cbFunc(this.saveMtnLine.catTag),
	//   "createDate":		this.ns.toDateTimeString(this.saveMtnLine.createDate),
	//   "createUser":		this.saveMtnLine.createUser,
	//   "description":	this.saveMtnLine.description,
	//   "lineCd":			this.saveMtnLine.lineCd,
	//   "openCoverTag":	this.saveMtnLine.openCoverTag,
	//   "referenceNo":	this.saveMtnLine.referenceNo,
	//   "remarks":		this.saveMtnLine.remarks,
	//   "renewalTag":		this.cbFunc(this.saveMtnLine.renewalTag),
	//   "sortSeq":		this.saveMtnLine.sortSeq,
	//   "updateDate":		this.ns.toDateTimeString(this.saveMtnLine.updateDate),
	//   "updateUser":		this.saveMtnLine.updateUser
	// }
	// console.log(JSON.stringify(this.mtnLineReq));

 //  	this.mtnService.saveMtnLine(JSON.stringify(this.mtnLineReq))
 //  		.subscribe(data => {
 //  			console.log(data);
 //  		});
  }

  cbFunc(chxbox:boolean){
  	return (chxbox === null  || false )? 'N' : 'Y';
  }

  addToTable(){
  	this.passData.tableData.push({
  		activeTag : 	this.cbFunc(this.saveMtnLine.activeTag),
  		catTag : 		this.cbFunc(this.saveMtnLine.catTag),
  		renewalTag : 	this.cbFunc(this.saveMtnLine.renewalTag),
  		lineCd : 		this.saveMtnLine.lineCd,
  		description : 	this.saveMtnLine.description,
  		referenceNo : 	this.saveMtnLine.referenceNo,
  		sortSeq : 		this.saveMtnLine.sortSeq,
  		remarks:		this.saveMtnLine.remarks
  	});
  	this.table.refreshTable();

  }

}

/*	ngOnChanges() {
		
	}
*/
	/*tempAddToTable(){
		this.passData.tableData.push([this.activeCb, this.withCatCb, this.renewalCb, this.lineCode, this.description, this.referenceNo, this.sortSeq]);
		console.log(this.passData.tableData);
	}*/
