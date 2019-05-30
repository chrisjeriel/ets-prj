import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';


@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
  @ViewChild(NgbTabset)tabset:NgbTabset;

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmDialog: ConfirmSaveComponent;
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
            "createDate"    : this.ns.toDateTimeString(0),
            "updateUser"	  : this.ns.getCurrentUser(),
      		  "updateDate"	  : null
		},
		checkFlag			      : false,
		searchFlag		      : true,
		addFlag				      : true,
		genericBtn          :'Delete',
		disableGeneric 		  : true,
		paginateFlag		    : true,
		infoFlag			      : true,
		pageLength			    : 10,
		widths				      :[1,'auto',1,'auto'],
		resizable			      :[true, true, false ,true],
		pageunID		        : 'mtn-region',
		keys				        :['regionCd','description','activeTag','remarks'],
		uneditable			    :[false,false,false,false]

	};

	regionRecord : any = {
		regionCd		: null,
		createUser		: null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null,
	}

	regionCdArray : any = [];

	dialogMessage : string = "";
    dialogIcon    : string = "";
    selectedData  : any;
    mtnRegionReq  : any = { 
    						        "deleteRegion": [],
                    		"saveRegion"  : []}
    editedData:any[] = [];
    deletedData:any[] =[];
    deleteBool : boolean;
    regionCd : any;
    cancelFlag: boolean;


  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal
    ,private route: ActivatedRoute) { }

  ngOnInit() {
	  this.titleService.setTitle('Mtn | Region');
    this.route.params.subscribe(a=>{
      this.tabset.activeId = a.id;
      if(a.id == 'region')
        this.getMtnRegion();
    })
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

  cbFunc2(cb){
  	return cb === true?'Y':'N';
  }

  onRowClick(event){
  	if(event !== null){
  		this.selectedData = event;
  		this.regionCd = event.regionCd;
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

  onClickSave(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	
      if(this.checkFields()){
		    if(this.hasDuplicates(this.regionCdArray)){
		      this.dialogMessage="Unable to save the record. Region Code must be unique.";
			  this.dialogIcon = "warning-message";
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

  onClickSaveRegion(cancelFlag?){

  	this.mtnRegionReq.saveRegion = [];
  	this.mtnRegionReq.deleteRegion = [];
  	this.editedData = [];
  	this.deletedData = [];
    
  	for(var i=0;i<this.passData.tableData.length;i++){
  		 if(this.passData.tableData[i].edited){
  		 	  this.editedData.push(this.passData.tableData[i]);
  		 	  this.editedData[this.editedData.length - 1].activeTag  = this.cbFunc2(this.passData.tableData[i].activeTag);
              this.editedData[this.editedData.length - 1].updateUser = this.ns.getCurrentUser();
              this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);             
         }     
  	}
  	        this.mtnRegionReq.saveRegion = this.editedData;
            this.mtnRegionReq.deleteRegion = this.deletedData;     

             if(this.mtnRegionReq.saveRegion.length > 0){
              this.confirmDialog.showBool = true;
              this.passData.disableGeneric = true;
              this.saveRegion();
            } else {
              this.confirmDialog.showBool = false;
              this.dialogIcon = 'info';
              this.dialogMessage = 'Nothing to save';
              this.successDialog.open();
            }

  }

  saveRegion(){
  	this.mtnService.saveMtnRegion(JSON.stringify(this.mtnRegionReq))
                .subscribe(data => {
                	console.log(data);
                    if(data['returnCode'] == -1){
			            this.dialogIcon = "success";
			            this.successDialog.open();
			            this.getMtnRegion();
			        }else{
			            this.dialogIcon = "error";
			            this.successDialog.open();
			            this.getMtnRegion();
			        }
    });
  }

  onClickDelRegion(obj : boolean){
  	  this.mtnRegionReq.saveRegion = [];
  	  this.mtnRegionReq.deleteRegion = [];
  		this.deletedData = [];
  		this.editedData = [];
      this.passData.disableGeneric = true;
  		
      if(obj){
  			this.mtnService.getMtnProvince(this.regionCd,null).subscribe(data => {
  				console.log(data['region'].length);
  				if(data['region'].length > 0){
  				   this.getMtnRegion();
  				   this.dialogMessage="You are not allowed to delete a Region that is used by Province, City, District or Block.";
			       this.dialogIcon = "warning-message";
			       this.successDialog.open();
  				} else {
  				  this.deletedData.push({
								    "regionCd": this.regionCd
								     });
		  		  this.mtnRegionReq.saveRegion = this.editedData;
		          this.mtnRegionReq.deleteRegion = this.deletedData;     
		  		  this.saveRegion();
  				}
  			});
  		} 
  }

  deleteRegion(){
  	    if (this.selectedData.add){
  	    	this.deleteBool = false;
  	    }else {
  	    	this.deleteBool = true;	
  	    }
  	  this.regionTable.indvSelect.deleted = true;
	  	this.regionTable.selected  = [this.regionTable.indvSelect]
	  	this.regionTable.confirmDelete();
  }

  addRegion(event){
    	
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onTabChange(event){
    if(event.nextId == 'region'){
      this.getMtnRegion();
    }
  }

  change(event){
    $('#cust-table-container').addClass('ng-dirty');
  }


}
