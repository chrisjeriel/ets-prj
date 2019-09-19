import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnClaimStatusLovComponent } from '@app/maintenance/mtn-claim-status-lov/mtn-claim-status-lov.component';

@Component({
  selector: 'app-claim-status',
  templateUrl: './claim-status.component.html',
  styleUrls: ['./claim-status.component.css']
})
export class ClaimStatusComponent implements OnInit {
  
  @ViewChild('claimStatus') table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('modal') modal: MtnClaimStatusLovComponent;
  passData: any = {
    tHeader: [ "Status Code","Description",'O/C',"Active","Remarks"],
    tableData:[],
    dataTypes: ['text','text', 'select', 'checkbox','text'],
    tooltip:[null,null,'Open / Close',null,null],
    opts: [{
            selector: 'openTag',
            prev: ['Open','Close'],
            vals: ['Y','N'],
        }],
    nData: {
      statusCode: null,
      description: null,
      remarks: null,
      openTag: 'N',
      activeTag: 'Y',
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'claimStatus',
    disableGeneric : true,
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,false,false,false,false],
    widths:[1,'auto',73,1,'auto'],
    keys:['statusCode','description','openTag','activeTag','remarks']
  };

  cancelFlag:boolean;
  edited: any = [];
  deleted: any = [];
  dialogMessage : string = '';
  dialogIcon: any;
  errorFlag:boolean = false;

  claimStat : any = {
  	createUser: null,
  	createDate: '',
  	updateUser: null,
  	updateDate: ''
  }

  saveData:any ={
    delClaimStatus :[],
    saveClaimStatus: []
  }

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  	this.getClaimStat();
  }

  getClaimStat(){
  	this.maintenanceService.getClaimStatus(null).subscribe((data: any) => {
  		console.log(data)
  		if(data.claimStatus !== null){
  			var datas = data.claimStatus;
        this.passData.tableData = [];
  			for(var i = 0; i < datas.length; i++){
  				this.passData.tableData.push(datas[i]);
          this.passData.tableData[i].uneditable = ['statusCode'];
  			}
  		}

  		this.table.refreshTable();
  	});
  }

  onRowClick(data){
  	console.log(data)
  	if(data !== null){
   	   this.claimStat = data;
   	   this.claimStat.createDate = this.ns.toDateTimeString(data.createDate);
   	   this.claimStat.updateDate = this.ns.toDateTimeString(data.updateDate);
       this.passData.disableGeneric = false;
   	}else{
       this.passData.disableGeneric = true;
    }
  }

  onClickSave(){
    this.errorFlag = false;
    for(var i = 0 ; i < this.passData.tableData.length; i++){
      for(var j = 0; j < this.passData.tableData.length; j++){
        if( i != j){
          if(this.passData.tableData[i].statusCode.trim() == this.passData.tableData[j].statusCode.trim()){
            this.errorFlag = true;
          }
        }
      }
    }

    this.prepareData();

    if(this.errorFlag){
      this.dialogMessage = 'Unable to save the record. Status Code must be unique.';
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else if(this.saveData.saveClaimStatus.length == 0 && this.saveData.delClaimStatus.length == 0){
      this.dialogMessage = 'Nothing to save';
      this.dialogIcon = "info";
      this.successDiag.open();
    }else{
      $('#confirm-save #modalBtn2').trigger('click');
    }
  }

  prepareData(){
    for(var i = 0; i < this.passData.tableData.length;i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.saveData.saveClaimStatus.push(this.passData.tableData[i]);
        this.saveData.saveClaimStatus[this.saveData.saveClaimStatus.length - 1].createDate = this.ns.getCurrentUser();
        this.saveData.saveClaimStatus[this.saveData.saveClaimStatus.length - 1].createDate = this.ns.toDateTimeString(0);
        this.saveData.saveClaimStatus[this.saveData.saveClaimStatus.length - 1].updateUser = this.ns.getCurrentUser();
        this.saveData.saveClaimStatus[this.saveData.saveClaimStatus.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passData.tableData[i].deleted){
        this.saveData.delClaimStatus.push(this.passData.tableData[i]);
      }
    }
  }

  saveClaimStatus(cancelFlag?){
    this.prepareData();

    this.maintenanceService.saveMtnClaimStatus(this.saveData).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      } else{
        this.dialogIcon = "success";
        this.successDiag.open();
        this.getClaimStat();
        this.passData.disableGeneric = true;
      }
    });
  }

  deleteCurr(){
      this.table.indvSelect.deleted = true;
      this.table.selected  = [this.table.indvSelect]
      this.table.confirmDelete();
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }
  
}
