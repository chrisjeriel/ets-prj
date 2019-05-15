import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';


@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("regionTable") regionTable: CustEditableNonDatatableComponent;

  passData: any = {
		tableData:[],
		tHeader				:["Region Code", "Description","Active","Remarks"],
		dataTypes			:["reqNumber", "reqText", "checkbox", "text"],
		nData:{
			regionCd        : null,
			description     : null,
			activeTag       : null,
			catTag          : null,
			remarks         : null,
			"createUser"    : this.ns.getCurrentUser(),
            "createDate"    : 0,
            "updateUser"	: this.ns.getCurrentUser(),
      		"updateDate"	: 0,
		},
		checkFlag			: false,
		searchFlag			: true,
		addFlag				: true,
		genericBtn          :'Delete',
		disableGeneric 		: true,
		paginateFlag		: true,
		infoFlag			: true,
		pageLength			: 10,
		widths				:[1,'auto',1,'auto'],
		resizable			:[true, true, false ,true],
		pageunID		    : 'mtn-region',
		keys				:['regionCd','description','activeTag','remarks'],
		uneditable			:[false,false,false,false]

	};

	regionRecord : any = {
		regionCd		: null,
		createUser		: null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null,
	}

	regionCdArray : any = [];

	dialogMessage: string = "";
    dialogIcon: string = "";

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
 											updateDate  : this.ns.toDateTimeString(rec.updateDate),
 											uneditable  : ['regionCd']
											});
		    }
			this.regionTable.refreshTable();
		});
  }

  cbFunc(cb){
  	return cb === 'Y'?true:false;
  }

  onRowClick(event){
  	console.log(event);
  	if(event !== null){
  	    this.passData.disableGeneric    = false;
  		this.regionRecord.regionCd	    = event.regionCd;
	  	this.regionRecord.createUser	= event.createUser;
	  	this.regionRecord.createDate	= event.createDate;
	  	this.regionRecord.updateUser	= event.updateUser;
	  	this.regionRecord.updateDate	= event.updateDate;
  	} else {
  	    this.passData.disableGeneric    = true;
  		this.regionRecord.regionCd	    = null;
	  	this.regionRecord.createUser	= null;
	  	this.regionRecord.createDate	= null;
	  	this.regionRecord.updateUser	= null;
	  	this.regionRecord.updateDate	= null;
  	}
  }

  onClickSave(){
      if(this.checkFields()){
            console.log(this.hasDuplicates(this.regionCdArray));
		    if(this.hasDuplicates(this.regionCdArray)){
		      	this.dialogMessage="Unable to save the record. Region Code must be unique.";
		        this.dialogIcon = "error";
		        this.successDialog.open();
		    } else {
		      $('#confirm-save #modalBtn2').trigger('click');
		    }
      }else{
        this.dialogMessage="Please check field values.";
        this.dialogIcon = "error";
        this.successDialog.open();
      }
  }

  checkFields(){
  	this.regionCdArray = [];
      for(let check of this.passData.tableData){
      	this.regionCdArray.push(check.regionCd);
        if(check.regionCd === null || Number.isNaN(check.regionCd)  || check.description === undefined || check.description.length === 0){
          return false;
        }
      }
      return true;
  }

  hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  onClickSaveRegion(){

  }

  addRegion(event){
    	
  }

}
