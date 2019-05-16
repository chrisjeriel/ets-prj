import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.css']
})
export class ProvinceComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("regionTable") regionTable: CustEditableNonDatatableComponent;

   passData: any = {
		tableData:[],
		tHeader				:["Province Code", "Description","Active","Remarks"],
		dataTypes			:["number", "text", "checkbox", "text"],
		nData:{
			regionCd        : null,
			description     : null,
			activeTag       : null,
			catTag          : null,
			remarks         : null,
			"createUser"    : this.ns.getCurrentUser(),
      "createDate"    : 0,
      "updateUser"	  : this.ns.getCurrentUser(),
      "updateDate"	  : 0,
		},
		checkFlag			  : false,
		searchFlag			: true,
		addFlag				  : true,
		genericBtn      :'Delete',
		disableAdd      : true,
		disableGeneric 	: true,
		paginateFlag		: true,
		infoFlag			  : true,
		pageLength			: 10,
		widths				  :[1,'auto',1,'auto'],
		resizable			  :[true, true, false ,true],
		pageunID		    :'mtn-region',
		keys				    :['provinceCd','description','activeTag','remarks'],
		uneditable			:[false,false,false,false]

	};

	provinceRecord : any = {
		  provinceCd		: null,
		  createUser		: null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null,
	}

	dialogMessage: string = "";
    dialogIcon: string = "";
    regionCD: any;

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Province');
  }

  onRowClick(event){
  	console.log(event);
  	if(event !== null){
  	    this.provinceRecord.disableGeneric    = false;
  		this.provinceRecord.provinceCd	= event.regionCd;
	  	this.provinceRecord.createUser	= event.createUser;
	  	this.provinceRecord.createDate	= event.createDate;
	  	this.provinceRecord.updateUser	= event.updateUser;
	  	this.provinceRecord.updateDate	= event.updateDate;
  	} else {
  	    this.passData.disableGeneric  = true;
  		this.provinceRecord.provinceCd	= null;
	  	this.provinceRecord.createUser	= null;
	  	this.provinceRecord.createDate	= null;
	  	this.provinceRecord.updateUser	= null;
	  	this.provinceRecord.updateDate	= null;
  	}
  }

  cbFunc(cb){
  	return cb === 'Y'?true:false;
  }

  showRegionLOV(){
  	$('#regionLOV #modalBtn').trigger('click');
    $('#regionLOV #modalBtn').addClass('ng-dirty')
  }

  setProvince(event){
  	console.log(event.regionCd);
  	this.regionCD = event.regionCd;
  	this.getMtnProvince();
  }

  getMtnProvince(){
    this.regionTable.loadingFlag = true;
    this.passData.disableAdd = false;
    this.passData.disableGeneric = false; 
    this.passData.tableData = [];
  	this.mtnService.getMtnProvince(this.regionCD,'').subscribe(data=>{
       
       var records = data['region'][0].provinceList;

       for(let rec of records){
            this.passData.tableData.push({
                                          provinceCd    : rec.provinceCd,
                                          description : rec.provinceDesc,
                                          activeTag   : this.cbFunc(rec.activeTag),
                                          remarks     : rec.remarks,
                                          createUser  : rec.createUser,
                                          createDate  : this.ns.toDateTimeString(rec.createDate),
                                          updateUser  : rec.updateUser,
                                          updateDate  : this.ns.toDateTimeString(rec.updateDate),
                                          uneditable  : ['provinceCd']
                                         });
        }
       this.regionTable.refreshTable();
    });
  	
  }

}
