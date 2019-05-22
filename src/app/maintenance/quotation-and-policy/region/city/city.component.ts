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
import { MtnProvinceComponent } from '@app/maintenance/mtn-region/mtn-province/mtn-province.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("confirmSave") confirmDialog: ConfirmSaveComponent;
  @ViewChild("cityTable") provinceTable: CustEditableNonDatatableComponent;
  @ViewChild(MtnRegionComponent) regionLov: MtnRegionComponent;
  @ViewChild(MtnProvinceComponent) provinceLov: MtnProvinceComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  @ViewChild(LovComponent) lovMdl: LovComponent;
  passLOV: any = {};
  locData:any = {};
  oldValue: any;

   passData: any = {
		tableData:[],
		tHeader				:["City Code", "Description","","CRESTA Zone", "Active", "Remarks"],
		dataTypes			:["reqNumber", "reqText", "reqNumber","reqText","checkbox", "text"],
		magnifyingGlass     :["zoneCd"],
		nData:{
			cityCd          : null,
			description     : null,
			activeTag       : null,
			cresta          : null,
			zoneCd          : null,
			remarks         : null,
			showMG			: 1,
			"createUser"    : this.ns.getCurrentUser(),
      		"createDate"    : this.ns.toDateTimeString(0),
      		"updateUser"	: this.ns.getCurrentUser(),
      		"updateDate"	: this.ns.toDateTimeString(0)
		},
		checkFlag			  : false,
		searchFlag			  : true,
		addFlag				  : true,
		genericBtn      	  :'Delete',
		disableAdd      	  : true,
		disableGeneric 		  : true,
		paginateFlag		  : true,
		infoFlag			  : true,
		pageLength			  : 10,
		widths				  :[1,'auto',1,'auto','1','auto'],
		resizable			  :[true, true, true, true, false ,true],
		pageunID		      :'mtn-city',
		keys				  :['cityCd','description','zoneCd','cresta','activeTag','remarks'],
		uneditable			  :[false,false,true,true,false,false],


	};

    cityRecord : any = {
		cityCd				: null,
		createUser			: null,
	    createDate			: null,
	    updateUser			: null,
	    updateDate			: null,
	}

	regionCD   		 : any;
	descRegion 		 : any;
	provinceCD  	 : any;
	descProvince 	 : any;
	crestaZoneLOVRow : number;
	cityCdArray 	 : any = [];
	cancelFlag: boolean;

	dialogMessage: string = "";
    dialogIcon: string = "";
    desc: any;

    mtnCityReq  : any = { 
                "deleteCity": [],
                "saveCity"  : []}
    editedData:any[] = [];
    deletedData:any[] =[];
    selectedData  : any;
    deleteBool : boolean;


  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal) { }


  ngOnInit() {
  	this.titleService.setTitle('Mtn | City');
  }

  openGenericLOV(selector){
      if(selector == 'province'){
          this.passLOV.regionCd = this.locData.regionCd;
      }else if(selector == "city"){
          this.passLOV.regionCd = this.locData.regionCd;
          this.passLOV.provinceCd = this.locData.provinceCd;
      }
      this.passLOV.selector = selector;
      this.lovMdl.openLOV();
  }

   setRegion(data){
   		if(this.isEmptyObject(data)){
   			    this.locData.regionCd = '';
                this.locData.regionDesc = '';
                this.locData.provinceCd = '';
                this.locData.provinceDesc = '';
                this.clear();
   		}else{
   			this.locData.regionCd = data.regionCd;
        	this.locData.regionDesc = data.regionDesc;
   		}
       
    }
  
  setProvince(data){
  		if(this.isEmptyObject(data)){
                this.locData.provinceCd = '';
                this.locData.provinceDesc = '';
                this.clear();
  		}else {
  			this.locData.provinceCd = data.provinceCd;
        	this.locData.provinceDesc = data.provinceDesc;
        	this.getCity();
  		}
       
    }

   checkCode(ev, field){
        if(field === 'region'){
            this.oldValue = this.locData.regionCd;
            if (this.locData.regionCd == null || this.locData.regionCd == '') {
                this.locData.regionCd = '';
                this.locData.regionDesc = '';
                this.locData.provinceCd = '';
                this.locData.provinceDesc = '';
                this.clear();
            } else {
                this.locData.regionDesc = '';
                this.locData.provinceCd = '';
                this.locData.provinceDesc = '';
                this.clear();
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('region', this.locData.regionCd, '', '', '', '', ev);
            }
        } else if(field === 'province'){
            this.oldValue = this.locData.provinceCd;
            if (this.locData.provinceCd == null || this.locData.provinceCd == '') {
                this.locData.provinceCd = '';
                this.locData.provinceDesc = '';
            	this.clear();
            } else {
            	this.locData.regionCd = '';
                this.locData.regionDesc = '';
                this.locData.provinceDesc = '';
              	this.clear();
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('province', this.locData.regionCd, this.locData.provinceCd, '', '', '', ev);
            }
        } 
    }

    clear(){
    	  this.passData.tableData = [];
    	  this.passData.disableAdd = true;
    	  this.passData.disableGeneric = true;
    	  this.table.refreshTable();
    }

    setLOVField(data){
        this.ns.lovLoader(data.ev, 0);
        var resetSucceedingFields = false;

        if(data.selector == 'region'){
            if (data.data == null) {
                this.setRegion(data);
                if (this.oldValue = data.regionCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                if (this.oldValue = data.data.regionCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.locData.provinceCd = '';
                this.locData.provinceDesc = '';
            }

        } else if(data.selector == 'province'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                if (this.oldValue = data.provinceList[0].provinceCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                if (this.oldValue = data.data.provinceCd) {
                    resetSucceedingFields = true;
                }
            }
        } 
        this.ns.lovLoader(data.ev, 0);
    }

    getCity(){
    	this.table.loadingFlag = true;
    	this.passData.tableData = [];
    	this.passData.disableAdd = false;
    	this.passData.disableGeneric = true;

	  	this.mtnService.getMtnCity(this.locData.regionCd,this.locData.provinceCd,null).subscribe(a=>{
	      if(a['region'].length != 0){

	      	for (let i=0; i < a['region'].length ; i++ ){
	      		var records = a['region'][i].provinceList[0].cityList; 

	      		for(let rec of records){
              		this.passData.tableData.push({
                                            cityCd      : rec.cityCd,
                                            description : rec.cityDesc,
                                            activeTag   : this.cbFunc(rec.activeTag),
                                            remarks     : rec.remarks,
                                            createUser  : rec.createUser,
                                            createDate  : this.ns.toDateTimeString(rec.createDate),
                                            updateUser  : rec.updateUser,
                                            updateDate  : this.ns.toDateTimeString(rec.updateDate),
                                            zoneCd	    : rec.zoneCd,
                                            cresta      : rec.zoneDesc,
                                            uneditable  : ['cityCd','zoneCd','cresta'],
                                            showMG		: 1
                                           });
            	}


	      	}
	      }
	  		this.table.refreshTable();
	  	})
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
        this.cityRecord.cityCd = event.cityCd;
  	    this.passData.disableGeneric    = false;
  		this.cityRecord.provinceCd	= event.provinceCd;
	  	this.cityRecord.createUser	= event.createUser;
	  	this.cityRecord.createDate	= event.createDate;
	  	this.cityRecord.updateUser	= event.updateUser;
	  	this.cityRecord.updateDate	= event.updateDate;
  	} else {
  	    this.passData.disableGeneric  = true;
  		this.cityRecord.provinceCd	= null;
	  	this.cityRecord.createUser	= null;
	  	this.cityRecord.createDate	= null;
	  	this.cityRecord.updateUser	= null;
	  	this.cityRecord.updateDate	= null;
  	}
  }

  clickCrestaZone(data){
    $('#crestaZoneLOV #modalBtn').trigger('click');
    this.crestaZoneLOVRow = data.index;
  }

  selectedCrestZoneLOV(data){
  	this.passData.tableData[this.crestaZoneLOVRow].zoneCd = data.zoneCd;
    this.passData.tableData[this.crestaZoneLOVRow].cresta = data.zoneDesc;
    this.passData.tableData[this.crestaZoneLOVRow].edited = true;
    $('#cust-table-container').addClass('ng-dirty');
  }

  checkFields(){
    this.cityCdArray = [];
      for(let check of this.passData.tableData){
        this.cityCdArray.push(check.cityCd);
        if (check.description === undefined || check.zoneCd === undefined){
        	 return false
        } else {
        	if(check.cityCd === null || Number.isNaN(check.cityCd)  || check.description === null || check.description.length === 0 || check.zoneCd === null || check.zoneCd.length === 0 ){
          		return false;
        	 }
        }
      }
      return true;
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
      if(this.checkFields()){
        if(this.hasDuplicates(this.cityCdArray)){
          this.dialogMessage="Unable to save the record. City Code must be unique.";
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

  hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  change(){
  	$('#cust-table-container').addClass('ng-dirty');
  }

   onClickSaveCity(cancelFlag?){

    this.mtnCityReq.saveCity = [];
    this.mtnCityReq.deleteCity = [];
    this.editedData = [];
    this.deletedData = [];
    
    for(var i=0;i<this.passData.tableData.length;i++){
       if(this.passData.tableData[i].edited){
              this.editedData.push(this.passData.tableData[i]);
              this.editedData[this.editedData.length - 1].regionCd       = this.locData.regionCd;
              this.editedData[this.editedData.length - 1].provinceCd     = this.locData.provinceCd;
              this.editedData[this.editedData.length - 1].activeTag  = this.cbFunc2(this.passData.tableData[i].activeTag);
              this.editedData[this.editedData.length - 1].updateUser = this.ns.getCurrentUser();
              this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);             
       }    
    }    
            this.mtnCityReq.saveCity   = this.editedData;
            this.mtnCityReq.deleteCity = this.deletedData; 

            if(this.mtnCityReq.saveCity.length > 0){
              this.confirmDialog.showBool = true;
              this.passData.disableGeneric = true;
              this.saveCity(this.mtnCityReq);
            } else {
              this.confirmDialog.showBool = false;
              this.dialogIcon = 'info';
              this.dialogMessage = 'Nothing to save';
              this.successDialog.open();
            }

  }

   saveCity(obj){
    this.mtnService.saveMtnCity(JSON.stringify(obj))
                .subscribe(data => {
              if(data['returnCode'] == -1){
                  this.dialogIcon = "success";
                  this.successDialog.open();
                  this.getCity();
              }else{
                  this.dialogIcon = "error";
                  this.successDialog.open();
                  this.getCity();
              }
    });
  }

   deleteCity(){
      if (this.selectedData.add){
          this.deleteBool = false;
        }else {
          this.deleteBool = true;  
        }

      this.provinceTable.indvSelect.deleted = true;
      this.provinceTable.selected  = [this.provinceTable.indvSelect]
      this.provinceTable.confirmDelete();

  }

 
  onClickDelCity(obj : boolean){
    this.mtnCityReq.saveCity = [];
    this.mtnCityReq.deleteCity = [];
    this.editedData = [];
    this.deletedData = [];
    this.passData.disableGeneric = true;

      if(obj){
        this.mtnService.getMtnDistrict(this.locData.regionCd,this.locData.provinceCd,this.cityRecord.cityCd,null).subscribe(data => {
          if(data['region'].length > 0){
             this.dialogMessage="You are not allowed to delete a City that is used by District or Block.";
             this.dialogIcon = "warning-message";
             this.successDialog.open();
             this.getCity();
          } else {
            this.deletedData.push({
                    "cityCd": this.cityRecord.cityCd,
                    "regionCd": this.locData.regionCd ,
                    "provinceCd": this.locData.provinceCd
                     });
            this.mtnCityReq.saveCity = this.editedData;
            this.mtnCityReq.deleteCity = this.deletedData;  
            this.saveCity(this.mtnCityReq);
          }
        });
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



}
