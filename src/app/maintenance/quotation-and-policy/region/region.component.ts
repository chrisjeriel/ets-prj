import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal, NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';


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
 											uneditable  : ['regionCd'],
                      okDelete    : rec.okDelete
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

      if(this.checkFields()){
        let regionCds:string[] = this.regionTable.passData.tableData.map(a=>a.regionCd);
          if(regionCds.some((a,i)=>regionCds.indexOf(a)!=i)){
            this.dialogMessage = 'Unable to save the record. Region Code must be unique.';
            this.dialogIcon = 'error-message';
            this.successDialog.open();
            return;
          } else {
                this.confirmDialog.confirmModal();
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

  onClickSaveRegion(cancelFlag?){
    
    this.cancelFlag = cancelFlag !== undefined;
     if(this.cancelFlag){
        if(this.checkFields()){
          let regionCds:string[] = this.regionTable.passData.tableData.map(a=>a.regionCd);
          if(regionCds.some((a,i)=>regionCds.indexOf(a)!=i)){
            this.dialogMessage = 'Unable to save the record. Region Code must be unique.';
            this.dialogIcon = 'error-message';
            this.successDialog.open();
            return;
          } else {
            this.saveDataRegion();
          }
        }else{
          this.dialogMessage="Please fill up required fields.";
          this.dialogIcon = "error";
          this.successDialog.open();
        }
     } else {
       this.saveDataRegion();
     }

  }

  saveDataRegion(){
    this.mtnRegionReq.saveRegion = [];
    this.mtnRegionReq.deleteRegion = [];
    this.mtnRegionReq.saveRegion = this.passData.tableData.filter(a=>a.edited && !a.deleted);
    this.mtnRegionReq.saveRegion.forEach(a=>a.updateUser = this.ns.getCurrentUser()); 
    this.mtnRegionReq.saveRegion.forEach(a=>a.updateDate = this.ns.toDateTimeString(0));
    this.mtnRegionReq.saveRegion.forEach(a=>a.activeTag = this.cbFunc2(a.activeTag));
    this.mtnRegionReq.saveRegion.forEach(a=>a.regionCd = this.regionCd);
    this.mtnRegionReq.deleteRegion = this.deletedData; 


     if(this.mtnRegionReq.saveRegion.length === 0 && this.mtnRegionReq.deleteRegion.length === 0  ){     
              this.confirmDialog.showBool = false;
              this.dialogIcon = "success";
              this.successDialog.open();
            } else {
              this.confirmDialog.showBool = true;
              this.passData.disableGeneric = true;
              this.saveRegion(this.mtnRegionReq);     
      }
  }

  saveRegion(obj){
    this.deletedData = [];
    console.log(JSON.stringify(obj));
    this.mtnService.saveMtnRegion(JSON.stringify(obj))
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
    this.passData.disableGeneric = true;
      
      if(obj){
            this.deletedData.push({
                    "regionCd": this.regionCd
                     });
            this.mtnRegionReq.deleteRegion = this.deletedData;     
      } 
  }
  
  deleteRegion(){
       if (this.selectedData.add){
          this.deleteBool = false;
          this.regionTable.indvSelect.deleted = true;
          this.regionTable.selected  = [this.regionTable.indvSelect];
          this.regionTable.confirmDelete();
       }else {
          this.deleteBool = true;
          console.log(this.regionTable.indvSelect.okDelete);  
          if(this.regionTable.indvSelect.okDelete == 'N'){
            this.dialogIcon = 'info';
            this.dialogMessage =  'You are not allowed to delete a Region that is already used by Province, City, District or Block';
            this.successDialog.open();
          }else{
            this.regionTable.indvSelect.deleted = true;
            this.regionTable.selected  = [this.regionTable.indvSelect]
            this.regionTable.confirmDelete();
          }
       }
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onTabChange(event){
    if(event.nextId == 'region'){
      this.getMtnRegion();
    }

    if($('.ng-dirty').length != 0 ){
        event.preventDefault();
        const subject = new Subject<boolean>();
        const modal = this.modalService.open(ConfirmLeaveComponent,{
            centered: true, 
            backdrop: 'static', 
            windowClass : 'modal-size'
        });
        modal.componentInstance.subject = subject;

        subject.subscribe(a=>{
          if(a){
            $('.ng-dirty').removeClass('ng-dirty');
            this.tabset.select(event.nextId)
          }
        })
  
    }
  }

  change(event){
    $('#cust-table-container').addClass('ng-dirty');
  }




}
