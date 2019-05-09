import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {
		tableData:[],
		tHeader				:["Region Code", "Description","Active","Remarks"],
		dataTypes			:["number", "text", "checkbox", "text"],
		nData:{
			regionCd          : null,
			description     : null,
			activeTag       : null,
			catTag          : null,
			remarks         : null,
		},
		checkFlag			: false,
		searchFlag			: true,
		addFlag				: true,
		deleteFlag			: true,
		paginateFlag		: true,
		infoFlag			: true,
		pageLength			: 10,
		widths				:[1,'auto',1,'auto'],
		resizable			: [true, true, false ,true],
		pageID				: 'mtn-region',
		keys				: ['regionCd','description','activeTag','remarks'],
	};

	regionRecord : any = {
		regionCd		: null,
		createUser		: null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null,
	}

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal) { }

  ngOnInit() {
  	    this.titleService.setTitle('Mtn | Region');
		this.getMtnRegion();
  }


  getMtnRegion(){
		this.passData.tableData = [];
		this.mtnService.getMtnRegion()
		.subscribe(data => {
			console.log(data);
			var records = data['region'];
			for(let rec of records){
				this.passData.tableData.push({
											regionCd 	: rec.regionCd,
	                                        description : rec.regionDesc,
	                                        activeTag	: this.cbFunc(rec.activeTag),
	                                        remarks     : rec.remarks,
 											createUser  : rec.createUser,
 											createDate  : this.ns.toDateTimeString(rec.createDate),
 											updateUser  : rec.updateUser,
 											updateDate  : this.ns.toDateTimeString(rec.updateDate)
											});
		    }
			this.table.refreshTable();
		});
	}

  cbFunc(cb){
  	return cb === 'Y'?true:false;
  }

  onRowClick(event){
  	console.log(event);
  	if(event !== null){
  		this.regionRecord.regionCd	    = event.regionCd;
	  	this.regionRecord.createUser	= event.createUser;
	  	this.regionRecord.createDate	= event.createDate;
	  	this.regionRecord.updateUser	= event.updateUser;
	  	this.regionRecord.updateDate	= event.updateDate;


  	}
  }


}
