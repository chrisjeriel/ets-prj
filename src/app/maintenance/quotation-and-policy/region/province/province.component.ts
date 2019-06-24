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
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';

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
  btnDisabledSave: boolean = true;
  tempTableData:[];
  mtnProvinceReq  : any = { 
                "deleteProvince": [],
                "saveProvince"  : []}
  deletedData:any[] =[];
  selectedData  : any;
  provinceCD : any;
  deleteBool : boolean;
  oldRegionCd: any;

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

  showRegionLOV(ev){
    ev.preventDefault();
    if($('.ng-dirty').length != 0 ){
        const subject = new Subject<boolean>();
        const modal = this.modalService.open(ConfirmLeaveComponent,{
            centered: true, 
            backdrop: 'static', 
            windowClass : 'modal-size'
        });
        modal.componentInstance.subject = subject;
        subject.subscribe(a=>{
           if(a){
            $('#regionLOV #modalBtn').trigger('click');
          } 
        })
    } else {
       $('#regionLOV #modalBtn').trigger('click');
    }
  	
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
    this.oldRegionCd = this.regionCD;
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
                                            uneditable  : ['provinceCd'],
                                            okDelete    : rec.okDelete
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
    $('#regionCode').removeClass('ng-dirty');
    ev.preventDefault();

    if($('.ng-dirty').length != 0 ){
        const subject = new Subject<boolean>();
        const modal = this.modalService.open(ConfirmLeaveComponent,{
            centered: true, 
            backdrop: 'static', 
            windowClass : 'modal-size'
        });
        modal.componentInstance.subject = subject;

        subject.subscribe(a=>{
           if(a){
            this.showProvinceList(ev);
          } else {
            this.regionCD = this.oldRegionCd; 
          }
        })
    } else {
       this.showProvinceList(ev);
    }
   
  }

  showProvinceList(ev){
            $('.ng-dirty').removeClass('ng-dirty');
            $('#cust-table-container').removeClass('ng-dirty');
            this.mtnProvinceReq.saveProvince = [];
            this.mtnProvinceReq.deleteProvince = [];

             if (this.isEmptyObject(this.regionCD)){
               this.clear();
            } else {
              this.ns.lovLoader(ev, 1);
              this.regionLov.checkCode(this.regionCD,ev);
              this.deletedData = [];
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
      if(this.checkFields()){
        let provinceCds:string[] = this.provinceTable.passData.tableData.map(a=>a.provinceCd);
          if(provinceCds.some((a,i)=>provinceCds.indexOf(a)!=i)){
            this.dialogMessage = 'Unable to save the record. Province Code must be unique.';
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

  change(event){
  }

  checkFields(){
      for(let check of this.passData.tableData){
        if(check.provinceCd === null || check.provinceCd.toString().length > 6 || Number.isNaN(check.provinceCd)  || check.description === null || check.description.length === 0){    
          return false;
        } 
      }
      return true;
  }

  onClickSaveProvince(cancelFlag?){
     this.cancelFlag = cancelFlag !== undefined;
     if(this.cancelFlag){
        if(this.checkFields()){
          let provinceCds:string[] = this.provinceTable.passData.tableData.map(a=>a.provinceCd);
          if(provinceCds.some((a,i)=>provinceCds.indexOf(a)!=i)){
            this.dialogMessage = 'Unable to save the record. Province Code must be unique.';
            this.dialogIcon = 'error-message';
            this.successDialog.open();
            return;
          } else {
            this.saveDataProvince();
          }
        }else{
          this.dialogMessage="Please fill up required fields.";
          this.dialogIcon = "error";
          this.successDialog.open();
        }
     } else {
       this.saveDataProvince();
     }
  }

  saveDataProvince(){
     this.mtnProvinceReq.saveProvince = [];
     this.mtnProvinceReq.deleteProvince = [];
     this.mtnProvinceReq.saveProvince = this.passData.tableData.filter(a=>a.edited && !a.deleted);
     this.mtnProvinceReq.saveProvince.forEach(a=>a.updateUser = this.ns.getCurrentUser());
     this.mtnProvinceReq.saveProvince.forEach(a=>a.activeTag = this.cbFunc2(a.activeTag));
     this.mtnProvinceReq.saveProvince.forEach(a=>a.regionCd = this.regionCD);
     this.mtnProvinceReq.deleteProvince = this.deletedData; 
     
      if(this.mtnProvinceReq.saveProvince.length === 0 && this.mtnProvinceReq.deleteProvince.length === 0  ){     
              this.confirmDialog.showBool = false;
              this.dialogIcon = "success";
              this.successDialog.open();
            } else {
              this.confirmDialog.showBool = true;
              this.passData.disableGeneric = true;
              this.saveProvince(this.mtnProvinceReq);     
      }
  }

  cbFunc2(cb){
    return cb === true?'Y':'N';
  }

  saveProvince(obj){
    this.deletedData = [];
    console.log(JSON.stringify(obj));
    this.mtnService.saveMtnProvince(JSON.stringify(obj))
                .subscribe(data => {
                  console.log(data);
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
          this.provinceTable.indvSelect.deleted = true;
          this.provinceTable.selected  = [this.provinceTable.indvSelect];
          this.provinceTable.confirmDelete();
       }else {
          this.deleteBool = true;
          console.log(this.provinceTable.indvSelect.okDelete);  
          if(this.provinceTable.indvSelect.okDelete == 'N'){
            this.dialogIcon = 'info';
            this.dialogMessage =  'You are not allowed to delete a Province that is already used by City, District or Block';
            this.successDialog.open();
          }else{
            this.provinceTable.indvSelect.deleted = true;
            this.provinceTable.selected  = [this.provinceTable.indvSelect]
            this.provinceTable.confirmDelete();
          }
       }
  }

  onClickDelProvince(obj : boolean){
    this.mtnProvinceReq.saveProvince = [];
    this.mtnProvinceReq.deleteProvince = [];
    this.passData.disableGeneric = true;
      if(obj){
            this.deletedData.push({
                    "provinceCd": this.provinceCD,
                    "regionCd": this.regionCD
                     });
            this.mtnProvinceReq.deleteProvince = this.deletedData;     
      } 
  }

  cancel(){
     this.cancelBtn.clickCancel();
  }


}
