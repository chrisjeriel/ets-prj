import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-mtn-cresta',
  templateUrl: './mtn-cresta.component.html',
  styleUrls: ['./mtn-cresta.component.css']
})
export class MtnCrestaComponent implements OnInit {
  
  @ViewChild("crestaZone") table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;

  passData: any = {
    tHeader: [ "Zone Code","Description","Active","Remarks"],
    tableData:[],
    dataTypes: ['sequence-2','text',"checkbox","text"],
    nData: {
      zoneCd: null,
      zoneDesc: null,
      activeTag: 'N',
      remarks: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'crestaZone',
    //checkFlag: true,
    disableGeneric : true,
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    widths:[95,675,90,290],
    keys:['zoneCd','zoneDesc','activeTag','remarks'],
    //keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
  };

  crestaData :any = {
  	createUser: null,
  	createDate: null,
  	updateUser: null,
  	updateDate: null
  }

  saveCresta: any = {
  	delCrestaZone:[],
  	saveCrestaZone: []
  }

  edited: any =[];
  deleted: any = [];
  cancelFlag:boolean;
  dialogMessage : string = '';
  dialogIcon: any;

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  	this.getCresta()
  }

  getCresta(){
  	this.passData.tableData = [];
  	this.maintenanceService.getMtnCresta().subscribe((data:any) => {
  		console.log(data)
  		for(var i =0; i< data.crestaZone.length;i++){
  			this.passData.tableData.push(data.crestaZone[i]);
  			this.passData.tableData[i].uneditable = ['zoneCd']
  		}
  		this.table.refreshTable();
  	})
  }

  onrowClick(data){
  	if(data != null){
  		this.passData.disableGeneric = false;
  		this.crestaData = data;
  		this.crestaData.createDate = this.ns.toDateTimeString(data.createDate);
  		this.crestaData.updateDate = this.ns.toDateTimeString(data.updateDate);
  	}else{
  		this.passData.disableGeneric = true;
  	}
  }

  delete(){
  	if(this.table.indvSelect.okDelete == 'N'){
  	  this.dialogIcon = 'info';
  	  this.dialogMessage =  'You are not allowed to delete a CRESTA Zone with existing record in City Maintenance.';
  	  this.successDialog.open();
  	}else{
  	  this.table.indvSelect.deleted = true;
  	  this.table.selected  = [this.table.indvSelect]
  	  this.table.confirmDelete();
  	}
  }

  onClickSave(){
  	  let currCds:string[] = this.passData.tableData.filter(a=>!a.deleted).map(a=>String(a.zoneCd).padStart(3,'0'));

  	  if(currCds.some((a,i)=>currCds.indexOf(a) != i)){
  	    this.dialogMessage = 'Unable to save the record. CRESTA Zone Code must be unique.';
  	    this.dialogIcon = 'error-message';
  	    this.successDialog.open();
  	    return;
  	  }else{
  		 $('#confirm-save #modalBtn2').trigger('click');
  	  }
  }

  prepareData(){
  	this.edited = [];
  	this.deleted = [];
  	for(var i = 0; i< this.passData.tableData.length;i++){
  		if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  			this.edited.push(this.passData.tableData[i]);
  			this.edited[this.edited.length - 1].updateUser = JSON.parse(window.localStorage.currentUser).username;
        	this.edited[this.edited.length - 1].updateDate = this.ns.toDateTimeString(0);
  		}
  		if(this.passData.tableData[i].deleted){
  			this.deleted.push(this.passData.tableData[i]);
  		}
  	}
  	this.saveCresta.delCrestaZone = this.deleted;
  	this.saveCresta.saveCrestaZone = this.edited;
  }

  saveData(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	this.prepareData();
  	this.maintenanceService.saveMtnCrestaZone(this.saveCresta).subscribe((data:any) => {
  		 if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          this.successDialog.open();
        } else{
          this.dialogIcon = "success";
          this.successDialog.open();
          this.getCresta();
        }
  	})
  }
}
