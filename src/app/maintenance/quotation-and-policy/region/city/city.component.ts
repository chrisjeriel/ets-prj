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
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("confirmSave") confirmDialog: ConfirmSaveComponent;
  @ViewChild("cityTable") cityTable: CustEditableNonDatatableComponent;
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
		checkFlag			    : false,
		searchFlag			  : true,
		addFlag				    : true,
		genericBtn      	:'Delete',
		disableAdd      	: true,
		disableGeneric 		: true,
		paginateFlag		  : true,
		infoFlag			    : true,
		pageLength			  : 10,
		widths				    :[1,'auto',1,'auto','1','auto'],
		resizable			    :[true, true, true, true, false ,true],
		pageunID		      :'mtn-city',
		keys				      :['cityCd','description','zoneCd','cresta','activeTag','remarks'],
		uneditable			  :[false,false,true,true,false,false],
	};

    cityRecord    : any = {
		cityCd				    : null,
		  createUser			: null,
	    createDate			: null,
	    updateUser			: null,
	    updateDate			: null,
	}

	regionCD   		   : any;
	descRegion 		   : any;
	provinceCD  	   : any;
	descProvince 	   : any;
	crestaZoneLOVRow : number;
	cancelFlag       : boolean;

	dialogMessage    : string = "";
  dialogIcon       : string = "";
  desc             : any;

  mtnCityReq       : any = { 
                     "deleteCity": [],
                     "saveCity"  : []}
  editedData       : any[] = [];
  deletedData      : any[] =[];
  selectedData     : any;
  deleteBool       : boolean;
  oldRegionCd      : any;
  oldProvinceCd    : any;

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal) { }


  ngOnInit() {
  	this.titleService.setTitle('Mtn | City');
  }

  openGenericLOV(selector, ev){
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
             this.showLoV(selector, ev);
          } 
        })
    } else {
       this.showLoV(selector, ev);
    }
  }


  showLoV(selector, ev){
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
        this.clear();
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
          this.clear();
  			  this.locData.provinceCd = data.provinceCd;
        	this.locData.provinceDesc = data.provinceDesc;
        	this.getCity();
  		}
       
    }

   checkCode(ev, field){
        $('#regionCode').removeClass('ng-dirty');
        $('#provinceCode').removeClass('ng-dirty');
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
              this.showCityList(ev,field);
            } else {
              this.locData.regionCd = this.oldRegionCd; 
              this.locData.provinceCd = this.oldProvinceCd;
            }
          })
          } else {
             this.showCityList(ev,field);
          }
    }

    showCityList(ev,obj){
      if(obj === 'region'){
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
        } else if(obj === 'province'){
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
        $('.ng-dirty').removeClass('ng-dirty');
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
      this.oldRegionCd = this.locData.regionCd;
      this.oldProvinceCd = this.locData.provinceCd;
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
                                            showMG		  : 1,
                                            okDelete    : rec.okDelete
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
      for(let check of this.passData.tableData){
        if (check.description === undefined || check.zoneCd === undefined){
        	 return false
        } else {
        	if(check.cityCd === null || check.cityCd.toString().length > 6 || Number.isNaN(check.cityCd)  || check.description === null || check.description.length === 0 || check.zoneCd === null || check.zoneCd.length === 0 ){
          		return false;
        	 }
        }
      }
      return true;
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
      if(this.checkFields()){
        let cityCds:string[] = this.cityTable.passData.tableData.map(a=>a.cityCd);
          if(cityCds.some((a,i)=>cityCds.indexOf(a)!=i)){
            this.dialogMessage = 'Unable to save the record. City Code must be unique.';
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

  change(){
  	$('#cust-table-container').addClass('ng-dirty');
  }

  onClickSaveCity(cancelFlag?){

     this.mtnCityReq.saveCity = [];
     this.mtnCityReq.deleteCity = [];
     this.mtnCityReq.saveCity = this.passData.tableData.filter(a=>a.edited && !a.deleted);
     this.mtnCityReq.saveCity.forEach(a=>a.updateUser   = this.ns.getCurrentUser());
     this.mtnCityReq.saveCity.forEach(a=>a.activeTag    = this.cbFunc2(a.activeTag));
     this.mtnCityReq.saveCity.forEach(a=>a.regionCd     = this.locData.regionCd);
     this.mtnCityReq.saveCity.forEach(a=>a.provinceCd   = this.locData.provinceCd);
     this.mtnCityReq.deleteCity = this.deletedData; 
     
      if(this.mtnCityReq.saveCity.length === 0 && this.mtnCityReq.deleteCity.length === 0  ){     
              this.confirmDialog.showBool = false;
              this.dialogIcon = "success";
              this.successDialog.open();
            } else {
              this.confirmDialog.showBool = true;
              this.passData.disableGeneric = true;
              this.saveCity(this.mtnCityReq);     
      }

  }

  saveCity(obj){
    this.deletedData = [];
    console.log(JSON.stringify(obj));
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
          this.cityTable.indvSelect.deleted = true;
          this.cityTable.selected  = [this.cityTable.indvSelect];
          this.cityTable.confirmDelete();
       }else {
          this.deleteBool = true;
          console.log(this.cityTable.indvSelect.okDelete);  
          if(this.cityTable.indvSelect.okDelete == 'N'){
            this.dialogIcon = 'info';
            this.dialogMessage =  'You are not allowed to delete a City that is used by District or Block.';
            this.successDialog.open();
          }else{
            this.cityTable.indvSelect.deleted = true;
            this.cityTable.selected  = [this.cityTable.indvSelect]
            this.cityTable.confirmDelete();
          }
       }

  }

 
  onClickDelCity(obj : boolean){
    this.mtnCityReq.saveCity = [];
    this.mtnCityReq.deleteCity = [];
    this.passData.disableGeneric = true;
      if(obj){
            this.deletedData.push({
                    "cityCd": this.cityRecord.cityCd,
                    "regionCd": this.locData.regionCd ,
                    "provinceCd": this.locData.provinceCd
                     });
            this.mtnCityReq.deleteCity = this.deletedData;  
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

  cancel(){
     this.cancelBtn.clickCancel();
  }



}
