import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services'
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-program-parameter',
  templateUrl: './program-parameter.component.html',
  styleUrls: ['./program-parameter.component.css']
})
export class ProgramParameterComponent implements OnInit {
  
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild('programParam') table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  passData: any = {
    tHeader: [ "Param Name","Param Type","Character Value","Numeric Value", "Date Value","Remarks"],
    tableData:[],
    dataTypes: ['text','select','text','text','text', "text"],
    nData: {
      paramName: null,
      paramType: null,
      characterValue: null,
      numericValue: null,
      dateValue: null,
      remarks: null,
      okDelete: 'Y',
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      description: null,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    opts: [{
            selector: 'paramType',
            prev: [],
            vals: [],
           }
    ],
    pageID: 'programParam',
    //checkFlag: true,
    disableGeneric : true,
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,false,false,false,false,false],
    widths:['auto','auto','auto','auto','auto','auto'],
    keys:['paramName','paramType','paramValueV','paramValueN','paramValueD','remarks']
  };

  cancelFlag:boolean;
  edited: any = [];
  deleted: any = [];
  dialogMessage : string = '';
  dialogIcon: any;
  errorFlag:boolean = false;

  parameters : any = {
  	createUser: null,
  	createDate: '',
  	updateUser: null,
  	updateDate: ''
  }

  saveData:any ={
    delParameters :[],
    saveParameters: []
  }

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  	this.getParameters();
  }

  getParameters(){
  	this.passData.tableData = [];
  	this.passData.opts[0].vals = [];
  	this.passData.opts[0].prev = [];
  	this.maintenanceService.getMtnParameters(null).subscribe((data:any) => {
  		for(var i = 0; i < data.parameters.length;i++ ){
  			this.passData.tableData.push(data.parameters[i]);
  		}

  		this.maintenanceService.getRefCode('ETS_PARAMETER.PARAM_TYPE').subscribe((data:any) => {
  			for(var datas of data.refCodeList){
  				this.passData.opts[0].vals.push(datas.code);
  				this.passData.opts[0].prev.push(datas.description);
  			}
  			this.table.refreshTable();
  		});
  	});
   }

   onRowClick(data){
   	console.log(data)
   	  if(data !== null){
   	   this.parameters = data;
   	   this.parameters.createDate = this.ns.toDateTimeString(data.createDate);
   	   this.parameters.updateDate = this.ns.toDateTimeString(data.updateDate);
   	 }

     if(data.okDelete == 'Y'){
       this.passData.disableGeneric = false;
     }else{
   	   this.passData.disableGeneric = true;
   	 }
   }

   deleteCurr(){
   		this.table.indvSelect.deleted = true;
   		this.table.selected  = [this.table.indvSelect]
   		this.table.confirmDelete();
   }

   onClickSave(){
   		this.errorFlag = false;
   		for(var i =0; i < this.passData.tableData.length; i++){
   			if((this.passData.tableData[i].paramType == 'V' && (this.passData.tableData[i].paramValueV == null || this.passData.tableData[i].paramValueV == "")) || (this.passData.tableData[i].paramType == 'N' && (this.passData.tableData[i].paramValueN == null || this.passData.tableData[i].paramValueN == "")) || (this.passData.tableData[i].paramType == 'D' && (this.passData.tableData[i].paramValueD == null || this.passData.tableData[i].paramValueD == ""))){
   				console.log(this.passData.tableData[i])
   				this.errorFlag = true;
   			}
   		}

   		if(this.errorFlag){
   			this.dialogMessage = "";
   			this.dialogIcon = "error";
   			this.successDiag.open();
   		}else{
   			$('#confirm-save #modalBtn2').trigger('click');
   		}
   }

   prepareData(){
   		for(var i = 0; i < this.passData.tableData.length;i++){
   			if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
   				this.edited.push(this.passData.tableData[i]);
          this.edited[this.edited.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
          this.edited[this.edited.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
   			}

   			if(this.passData.tableData[i].deleted){
   				this.deleted.push(this.passData.tableData[i]);
   			}
   		}

   		this.saveData.saveParameters = this.edited;
   		this.saveData.delParameters  = this.deleted;
   }

   saveParameters(cancelFlag?){
   	this.cancelFlag = cancelFlag !== undefined;
   	this.prepareData();

    if(this.edited.length === 0 && this.deleted.length === 0){
      setTimeout(()=> {
        this.dialogMessage = "Nothing to Save.";
        this.dialogIcon = "info";
        this.successDiag.open();
      },0);
    }else{
     	this.maintenanceService.saveMtnParameters(this.saveData).subscribe((data:any) => {
     		if(data['returnCode'] == 0) {
     		    this.dialogMessage = data['errorList'][0].errorMessage;
     		    this.dialogIcon = "error";
     		    this.successDiag.open();
     		  } else{
     		    this.dialogIcon = "success";
     		    this.successDiag.open();
     		    this.getParameters();
     		  }
     	});
    }
   }

   cancel(){
   	this.cancelBtn.clickCancel();
   }
}
