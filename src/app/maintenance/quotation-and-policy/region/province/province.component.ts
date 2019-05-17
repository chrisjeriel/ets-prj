import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { MtnRegionComponent } from '@app/maintenance/mtn-region/mtn-region/mtn-region.component';

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.css']
})
export class ProvinceComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("confirmSave") confirmDialog: ConfirmSaveComponent;
  @ViewChild("provinceTable") provinceTable: CustEditableNonDatatableComponent;
  @ViewChild(MtnRegionComponent) regionLov: MtnRegionComponent;

   passData: any = {
		tableData:[],
		tHeader				:["Province Code", "Description","Active","Remarks"],
		dataTypes			:["reqNumber", "reqText", "checkbox", "text"],
		nData:{
			provinceCd      : null,
			description     : null,
			activeTag       : null,
			catTag          : null,
			remarks         : null,
			"createUser"    : this.ns.getCurrentUser(),
      "createDate"    : this.ns.toDateTimeString(0),
      "updateUser"	  : this.ns.getCurrentUser(),
      "updateDate"	  : this.ns.toDateTimeString(0)
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
		  createUser		:
       null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null,
	}

	dialogMessage: string = "";
    dialogIcon: string = "";
    regionCD: any;
    desc: any;

  cancelFlag: boolean;
  provinceCdArray : any = [];
  btnDisabledSave: boolean = true;
  tempTableData:[];
  mtnProvinceReq  : any = { 
                "deleteProvince": [],
                "saveProvince"  : []}
  editedData:any[] = [];
  deletedData:any[] =[];
  selectedData  : any;
  provinceCD : any;
  deleteBool : boolean;

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Province');
  }

  onRowClick(event){
  	if(event !== null){
      this.selectedData = event;
      this.provinceCD = event.provinceCd;
  	    this.passData.disableGeneric    = false;
  		this.provinceRecord.provinceCd	= event.provinceCd;
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
    this.regionCD = null;
    if (this.isEmptyObject(event)){
    }else {
      this.regionCD = event.regionCd;
      this.desc = event.regionDesc;
      if(this.regionCD === null){
        this.clear();
      }else {
       this.getMtnProvince();  
      }
    }
  }

  getMtnProvince(){
    this.provinceTable.loadingFlag = true;
    this.passData.disableAdd = false;
    this.btnDisabledSave = false;
    this.passData.disableGeneric = true; 
    this.passData.tableData = [];
  	this.mtnService.getMtnProvince(this.regionCD,'').subscribe(data=>{
      
       if (data['region'].length === 0){
         this.passData.tableData = [];
       } else {
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
        }
       this.provinceTable.refreshTable();
    });
  	
  }

  clear(){
      this.provinceTable.passData.tableData = [];
      this.desc = null;
      this.regionCD = null;
      this.provinceTable.passData.disableAdd = true,
      this.provinceTable.passData.disableGeneric = true,
      this.btnDisabledSave = true;
      this.provinceTable.refreshTable();
  }

  checkCode(ev){
    if (this.isEmptyObject(this.regionCD)){
       this.clear();
    } else {
      this.ns.lovLoader(ev, 1);
      this.regionLov.checkCode(this.regionCD,ev);
    }
  }

  isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
      if(this.checkFields()){
        if(this.hasDuplicates(this.provinceCdArray)){
          this.dialogMessage="Unable to save the record. Province Code must be unique.";
          this.dialogIcon = "warning-message";
          this.successDialog.open();
        } else {
          this.confirmDialog.confirmModal();
        }
      }else{
        this.dialogMessage="Please check field values.";
        this.dialogIcon = "error";
        this.successDialog.open();
      }
  }

  change(event){

  }

  checkFields(){
    this.provinceCdArray = [];
      for(let check of this.passData.tableData){
        this.provinceCdArray.push(check.provinceCd);
        if(check.provinceCd === null || Number.isNaN(check.provinceCd)  || check.description === null || check.description.length === 0){
          return false;
        }
      }
      return true;
  }

  hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  onClickSaveProvince(cancelFlag?){
    this.mtnProvinceReq.saveProvince = [];
    this.mtnProvinceReq.deleteProvince = [];
    this.editedData = [];
    this.deletedData = [];
    
    for(var i=0;i<this.passData.tableData.length;i++){
       if(this.passData.tableData[i].edited){
              this.editedData.push(this.passData.tableData[i]);
              this.editedData[this.editedData.length - 1].regionCd   = this.regionCD;
              this.editedData[this.editedData.length - 1].activeTag  = this.cbFunc2(this.passData.tableData[i].activeTag);
              this.editedData[this.editedData.length - 1].updateUser = this.ns.getCurrentUser();
              this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);             
       }    
    }    
            this.mtnProvinceReq.saveProvince   = this.editedData;
            this.mtnProvinceReq.deleteProvince = this.deletedData; 

            if(this.mtnProvinceReq.saveProvince.length > 0){
              this.confirmDialog.showBool = true;
              this.passData.disableGeneric = true;
              this.saveProvince(this.mtnProvinceReq);
            } else {
              this.confirmDialog.showBool = false;
              this.dialogIcon = 'info';
              this.dialogMessage = 'Nothing to save';
              this.successDialog.open();
            }
  }

  cbFunc2(cb){
    return cb === true?'Y':'N';
  }

  saveProvince(obj){
    this.mtnService.saveMtnProvince(JSON.stringify(obj))
                .subscribe(data => {
              if(data['returnCode'] == -1){
                  this.dialogIcon = "success";
                  this.successDialog.open();
                  this.getMtnProvince();
              }else{
                  this.dialogIcon = "error";
                  this.successDialog.open();
                  this.getMtnProvince();
              }
    });
  }

  deleteProvince(){
      if (this.selectedData.add){
          this.deleteBool = false;
        }else {
          this.deleteBool = true;  
        }

      this.provinceTable.indvSelect.deleted = true;
      this.provinceTable.selected  = [this.provinceTable.indvSelect]
      this.provinceTable.confirmDelete();

  }

  onClickDelProvince(obj : boolean){
    this.mtnProvinceReq.saveProvince = [];
    this.mtnProvinceReq.deleteProvince = [];
    this.editedData = [];
    this.deletedData = [];
    this.passData.disableGeneric = true;
      if(obj){
        this.mtnService.getMtnCity(this.regionCD,this.provinceCD,null).subscribe(data => {
          if(data['region'].length > 0){
             this.dialogMessage="You are not allowed to delete a Province that is used by City, District or Block.";
             this.dialogIcon = "warning-message";
             this.successDialog.open();
             this.getMtnProvince();
          } else {
            this.deletedData.push({
                    "provinceCd": this.provinceCD
                     });
            this.mtnProvinceReq.saveProvince = this.editedData;
            this.mtnProvinceReq.deleteProvince = this.deletedData;     
            this.saveProvince(this.mtnProvinceReq);
          }
        });
      } 

  }

  cancel(){
     this.cancelBtn.clickCancel();
  }


}
